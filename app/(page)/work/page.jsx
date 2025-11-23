"use client";

import React, { useState, useMemo, useEffect } from "react";

// --- UI Components Imports ---
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

// ⭐ Import Modal ที่แยกออกไป
import { FullWorkDetailModal } from "@/components/full-work-detail-modal";

// --- Icons Imports ---
import {
  ChevronRight,
  Search,
  MapPin,
  Briefcase,
  CalendarDays,
  User,
  Calendar,
  Users,
  CheckCircle2,
  Plus,
} from "lucide-react";

// ⭐ client API
import apiClient from "@/lib/apiClient";

// ==========================================
// 1. Constants & Helpers
// ==========================================

const statusLabels = {
  Pending: "รอดำเนินการ",
  "In Progress": "กำลังดำเนินการ",
  Reject: "ยกเลิก/ปฏิเสธ",
  Completed: "เสร็จสิ้น",
};

const getStatusStyles = (status) => {
  switch (status) {
    case "Pending":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Reject":
      return "bg-red-100 text-red-700 border-red-200";
    case "In Progress":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Completed":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const uiToApiStatus = {
  All: undefined,
  Pending: "PENDING",
  "In Progress": "IN_PROGRESS",
  Reject: "REJECTED",
  Completed: "COMPLETED",
};

const apiToUiStatus = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  REJECTED: "Reject",
  COMPLETED: "Completed",
};

function getAdminSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem("admin_session");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.error("Cannot read admin_session:", e);
    return null;
  }
}

function getEmpCodeFromSession(session) {
  if (!session) return null;
  return session.code ?? null;
}

function extractCustomerName(customer) {
  if (!customer) return "ไม่ระบุชื่อลูกค้า";
  if (typeof customer === "string") return customer;
  const { companyName, contactName, firstName, lastName, code } = customer;
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  return companyName || fullName || contactName || code || "ไม่ระบุชื่อลูกค้า";
}

function extractCustomerAddress(customer, fallback) {
  if (!customer || typeof customer === "string") return fallback || "-";
  return customer.address || fallback || "-";
}

function formatWorkDateRange(start, end) {
  if (!start && !end) return null;
  const fmt = (d) =>
    new Date(d).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  if (start && end) return `${fmt(start)} - ${fmt(end)}`;
  if (start) return fmt(start);
  if (end) return fmt(end);
  return null;
}

// ⭐ map ข้อมูลจาก API -> UI (แยก description กับ note)
function mapApiWorkToUi(work, index) {
  const uiStatus = apiToUiStatus[work.status] || work.status || "Pending";
  const customerObj = work.customer || null;
  const customerName = extractCustomerName(customerObj);
  const address = extractCustomerAddress(
    customerObj,
    work.locationAddress || "ไม่ระบุที่อยู่"
  );

  const employees = Array.isArray(work.employees) ? work.employees : [];
  let staffList = [];

  if (employees.length > 0) {
    staffList = employees.map((e, idx) => {
      const emp = e.employee || e;
      const name =
        [emp.firstName, emp.lastName].filter(Boolean).join(" ") ||
        emp.username ||
        `พนักงาน ${idx + 1}`;
      return {
        id: emp.id || e.id || `emp-${idx}`,
        name,
        role: emp.role || "ช่าง",
        avatar:
          emp.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=random`,
      };
    });
  } else {
    const supervisors = Array.isArray(work.supervisors) ? work.supervisors : [];
    staffList = supervisors.map((s, idx) => {
      const sup = s.supervisor || {};
      const name =
        [sup.firstName, sup.lastName].filter(Boolean).join(" ") ||
        sup.username ||
        `หัวหน้า ${idx + 1}`;
      return {
        id: sup.id || s.id || `sup-${idx}`,
        name,
        role: "หัวหน้างาน",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random`,
      };
    });
  }

  let leadEngineerName = "ไม่ระบุหัวหน้างาน";
  if (Array.isArray(work.supervisors) && work.supervisors.length > 0) {
    const sup = work.supervisors[0].supervisor || {};
    leadEngineerName =
      [sup.firstName, sup.lastName].filter(Boolean).join(" ") ||
      sup.username ||
      "ไม่ระบุหัวหน้างาน";
  }

  // ⭐ แปลง lat/lng ให้เป็น number ถ้า backend ส่งมาเป็น string
  const latRaw = work.locationLat ?? work.lat ?? null;
  const lngRaw = work.locationLng ?? work.lng ?? null;
  const lat =
    latRaw !== null && latRaw !== undefined && latRaw !== ""
      ? Number(latRaw)
      : null;
  const lng =
    lngRaw !== null && lngRaw !== undefined && lngRaw !== ""
      ? Number(lngRaw)
      : null;

  const locationName =
    (typeof work.locationName === "string" &&
      work.locationName.trim() !== "" &&
      work.locationName.trim()) ||
    customerName;

  // ⭐ ดึง note แยกต่างหาก
  const note = typeof work.note === "string" && work.note.trim() !== ""
    ? work.note.trim()
    : null;

  return {
    id: work.id ?? work.workOrderId ?? index + 1,
    title: work.title || "ไม่ระบุชื่องาน",
    customer: customerName,
    leadEngineer: leadEngineerName,
    assignedBy: "-",
    status: uiStatus,
    dateRange:
      work.dateRange || formatWorkDateRange(work.startDate, work.endDate),
    description: work.description || "-", // ไม่ยัดหมายเหตุเพิ่ม
    note, // ⭐ เก็บหมายเหตุแยกไว้
    address,
    assignedStaff: staffList,

    // ⭐ เอาไว้ใช้โชว์แผนที่
    lat,
    lng,
    locationName,
  };
}

// ==========================================
// 2. Main Page Component
// ==========================================

export default function Page() {
  const [session, setSession] = useState(null);
  const [sessionStatus, setSessionStatus] = useState("loading");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // State Modals
  const [selectedWork, setSelectedWork] = useState(null);
  const [showFullDetail, setShowFullDetail] = useState(false);

  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const s = getAdminSession();
    if (s) {
      setSession(s);
      setSessionStatus("authenticated");
    } else {
      setSession(null);
      setSessionStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus !== "authenticated" || !session) {
      setWorkItems([]);
      setError("ยังไม่ได้เข้าสู่ระบบหรือไม่พบข้อมูลผู้ใช้ (admin_session)");
      return;
    }
    const empCode = getEmpCodeFromSession(session);
    if (!empCode) {
      setWorkItems([]);
      setError("ไม่พบรหัสพนักงาน (code) ใน admin_session");
      return;
    }

    const fetchWorkOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const payload = {
          empCode,
          search: searchQuery || undefined,
          status:
            activeFilter === "All"
              ? undefined
              : uiToApiStatus[activeFilter] || activeFilter,
          page,
          pageSize,
        };
        const res = await apiClient.post("/supervisor/by-code", payload);
        const rawItems =
          res.data?.items || res.data?.data || res.data?.rows || [];
        const mapped = Array.isArray(rawItems)
          ? rawItems.map((w, idx) => mapApiWorkToUi(w, idx))
          : [];
        setWorkItems(mapped);
        if (typeof res.data?.total === "number") {
          setTotal(res.data.total);
        }
      } catch (err) {
        console.error("fetch work orders error:", err);
        setError("ไม่สามารถโหลดข้อมูลงานได้");
        setWorkItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkOrders();
  }, [activeFilter, searchQuery, page, sessionStatus, session]);

  const filteredWorks = useMemo(() => workItems, [workItems]);

  const filterOptions = [
    { id: "All", label: "ทั้งหมด" },
    { id: "Pending", label: "รอดำเนินการ" },
    { id: "In Progress", label: "กำลังดำเนินการ" },
    { id: "Reject", label: "ยกเลิก" },
    { id: "Completed", label: "เสร็จสิ้น" },
  ];

  return (
    <main className="h-[98vh] w-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* 1. Fixed Header */}
      <div className="flex-none z-20 shadow-sm bg-white dark:bg-gray-950">
        <SiteHeader />
      </div>

      {/* 2. Content Container */}
      <div className="flex-1 flex flex-col min-h-0 container mx-auto max-w-[95%] 2xl:max-w-[1600px] px-4">
        {/* 2.1 Fixed Filters & Search */}
        <div className="flex-none py-4 z-10 bg-white dark:bg-gray-950">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Work Orders
              </h1>
              <p className="text-muted-foreground">
                จัดการและติดตามสถานะงานติดตั้ง/ซ่อมบำรุง
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่องาน, ลูกค้า..."
                className="pl-9 bg-white dark:bg-gray-900 shadow-sm"
                value={searchQuery}
                onChange={(e) => {
                  setPage(1);
                  setSearchQuery(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 border-b pb-4">
            {filterOptions.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setPage(1);
                  setActiveFilter(filter.id);
                }}
                className={`rounded-full px-4 ${
                  activeFilter === filter.id
                    ? "shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-md mt-2">
              {error}
            </div>
          )}
        </div>

        {/* 2.2 Scrollable Grid Area */}
        <div className="flex-1 overflow-y-auto min-h-0 pb-6 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center h-full">
              <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-semibold">กำลังโหลดข้อมูลงาน...</h3>
            </div>
          ) : filteredWorks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
              {filteredWorks.map((item) => (
                <Card
                  key={item.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-transparent hover:border-primary/20 bg-white dark:bg-gray-900 overflow-hidden flex flex-col h-full shadow-sm border-gray-200"
                  onClick={() => setSelectedWork(item)}
                >
                  <div
                    className={`h-1.5 w-full ${
                      item.status === "Pending"
                        ? "bg-orange-400"
                        : item.status === "In Progress"
                        ? "bg-blue-500"
                        : item.status === "Completed"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <CardHeader className="p-5 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <Badge
                        variant="outline"
                        className={`${getStatusStyles(
                          item.status
                        )} border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide`}
                      >
                        {statusLabels[item.status] || item.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        #{item.id}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold leading-tight group-hover:text-blue-600 transition-colors pt-2 line-clamp-2">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-1 flex items-center gap-1 mt-1">
                      <Briefcase className="w-3 h-3" /> {item.customer}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 h-10">
                        {item.description}
                      </p>
                      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{item.address}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t flex items-center justify-between">
                      <div className="flex -space-x-2 overflow-hidden">
                        {item.assignedStaff.length > 0 ? (
                          item.assignedStaff.slice(0, 3).map((staff) => (
                            <img
                              key={staff.id}
                              className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
                              src={staff.avatar}
                              alt={staff.name}
                            />
                          ))
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 ring-2 ring-white">
                            -
                          </div>
                        )}
                        {item.assignedStaff.length > 3 && (
                          <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 ring-2 ring-white font-medium">
                            +{item.assignedStaff.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        {item.dateRange ? (
                          <>
                            <CalendarDays className="w-3.5 h-3.5" />
                            {item.dateRange.replace("เริ่ม ", "")}
                          </>
                        ) : (
                          <span>ดูรายละเอียด</span>
                        )}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center h-full">
              <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold">ไม่พบงานที่ค้นหา</h3>
              <p className="text-muted-foreground">
                ลองเปลี่ยนคำค้นหา หรือเลือกสถานะอื่นดูนะครับ
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal เล็ก (Quick View) - ฝังอยู่ในไฟล์นี้ตามคำขอ */}
      <WorkDetailModal
        open={!!selectedWork}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedWork(null);
        }}
        work={selectedWork}
        onOpenFullDetail={() => setShowFullDetail(true)}
      />

      {/* Modal ใหญ่ (Full Screen) - Import มาจากไฟล์ที่แยก */}
      <FullWorkDetailModal
        open={showFullDetail}
        onOpenChange={setShowFullDetail}
        work={selectedWork}
      />
    </main>
  );
}

// ==========================================
// 3. Internal Components (WorkDetailModal ตัวเล็ก)
// ==========================================

const getStatusBadge = (status) => {
  const styles = {
    Pending: "bg-orange-100 text-orange-700 border-orange-200",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
    Completed: "bg-green-100 text-green-700 border-green-200",
    Reject: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <Badge
      variant="outline"
      className={`${styles[status] || "bg-gray-100"} border px-3 py-1`}
    >
      {statusLabels[status] || status}
    </Badge>
  );
};

function WorkDetailModal({ open, onOpenChange, work, onOpenFullDetail }) {
  if (!work) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="px-6 py-6 border-b bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {work.title}
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span>ลูกค้า: {work.customer}</span>
              </div>
            </div>
            {getStatusBadge(work.status)}
          </div>
          {work.dateRange && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-3 bg-white dark:bg-gray-800 w-fit px-3 py-1.5 rounded-full border shadow-sm">
              <Calendar className="w-4 h-4 text-blue-500" />
              {work.dateRange}
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* รายละเอียดงาน */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" /> รายละเอียดงาน
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border">
              {work.description}
            </p>
          </div>

          {/* ⭐ หมายเหตุเพิ่มเติม (แยกออกมา) */}
          {work.note && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" /> หมายเหตุเพิ่มเติม
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-700">
                {work.note}
              </p>
            </div>
          )}

          {/* สถานที่ปฏิบัติงาน + แผนที่ */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" /> สถานที่ปฏิบัติงาน
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-6">
              {work.address}
            </p>

            {/* ⭐ แสดงแผนที่ถ้ามีพิกัด หรืออย่างน้อยมีที่อยู่ */}
            {(() => {
              const hasCoord = work.lat && work.lng;
              const hasAddress = Boolean(work.address && work.address !== "-");

              if (!hasCoord && !hasAddress) return null;

              const mapSrc = hasCoord
                ? `https://www.google.com/maps?q=${work.lat},${work.lng}&hl=th&z=16&output=embed`
                : `https://www.google.com/maps?q=${encodeURIComponent(
                    work.address
                  )}&hl=th&z=16&output=embed`;

              return (
                <div className="ml-6 space-y-2">
                  <div className="h-64 w-full rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800">
                    <iframe
                      title="location-map"
                      src={mapSrc}
                      width="100%"
                      height="100%"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    <div className="font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      {work.locationName || work.address}
                    </div>
                    <div>{work.address}</div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ทีมงาน */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mt-4">
              <Users className="w-4 h-4 text-blue-500" /> ทีมงานที่ได้รับมอบหมาย (
              {work.assignedStaff.length})
            </h3>

            {work.assignedStaff.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {work.assignedStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-900 hover:shadow-sm transition-shadow"
                  >
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text:white">
                        {staff.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {staff.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic ml-6">
                ยังไม่มีพนักงานได้รับมอบหมาย
              </p>
            )}

            {work.status === "Pending" && (
              <div className="mt-3 pt-2">
                <Button
                  variant="outline"
                  className="w-full h-12 border-dashed border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center gap-2 text-muted-foreground hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
                  onClick={() => alert("เปิดหน้าต่างเลือกพนักงาน")}
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">เพิ่มพนักงานเข้าทีม</span>
                </Button>
              </div>
            )}
          </div>

          {/* footer ข้อมูลหัวหน้า / ผู้มอบหมาย */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t mt-4">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" /> หัวหน้างาน:{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {work.leadEngineer}
              </span>
            </div>
            <div>
              มอบหมายโดย:{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {work.assignedBy}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50 dark:bg-gray-900 sm:justify-between">
          {/* ปุ่มดูรายละเอียด (ซ้ายล่าง) */}
          <Button variant="outline" className="bg-white" onClick={onOpenFullDetail}>
            ดูรายละเอียด
          </Button>

          {/* กลุ่มปุ่มเดิม (ขวาล่าง) */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              ปิดหน้าต่าง
            </Button>
            {work.status === "Pending" && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                เริ่มงาน
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}