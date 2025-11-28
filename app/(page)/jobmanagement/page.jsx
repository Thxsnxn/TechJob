"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SiteHeader } from "@/components/site-header";
import {
  Eye,
  Pencil,
  Loader2,
  CalendarDays,
  MapPin,
  BriefcaseBusiness,
  Search,
  Filter,
} from "lucide-react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import ViewJobModal from "./ViewJobModal";
import EditJobModal from "./EditJobModal";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";


// --- Helper Functions ---

const apiToUiStatus = {
  IN_PROGRESS: "กำลังดำเนินการ",
  PENDING_REVIEW: "รอตรวจสอบ",
  NEED_FIX: "ต้องแก้ไข",
  COMPLETED: "เสร็จสิ้น",
};

const uiToApiStatus = {
  all: undefined,
  "in progress": "IN_PROGRESS",
  "pending review": "PENDING_REVIEW",
  "need fix": "NEED_FIX",
  completed: "COMPLETED",
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

function mapApiWorkToUi(work, index) {
  const uiStatus =
    apiToUiStatus[work.status] || work.status || "กำลังดำเนินการ";
  const customerObj = work.customer || null;
  const customerName = extractCustomerName(customerObj);
  const address = extractCustomerAddress(
    customerObj,
    work.locationAddress || "ไม่ระบุที่อยู่"
  );

  // 1. Employees
  const employees = Array.isArray(work.employees) ? work.employees : [];
  const empList = employees.map((e, idx) => {
    const emp = e.employee || e;
    const name =
      [emp.firstName, emp.lastName].filter(Boolean).join(" ") ||
      emp.username ||
      `พนักงาน ${idx + 1}`;
    return {
      id: emp.id || e.id || `emp-${idx}`,
      name,
      role: "EMPLOYEE",
      avatar:
        emp.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random`,
      position: emp.position || "-",
      workStatus: emp.workStatus || emp.workstatus || "FREE",
    };
  });

  // 2. Supervisors
  const supervisors = Array.isArray(work.supervisors) ? work.supervisors : [];
  const supList = supervisors.map((s, idx) => {
    const sup = s.supervisor || s;
    const name =
      [sup.firstName, sup.lastName].filter(Boolean).join(" ") ||
      sup.username ||
      `หัวหน้า ${idx + 1}`;
    return {
      id: sup.id || s.id || `sup-${idx}`,
      name,
      role: "SUPERVISOR",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random`,
      position: "Supervisor",
      workStatus: sup.workStatus || sup.workstatus || "FREE",
    };
  });

  const staffList = [...supList, ...empList];

  let leadEngineerName = "ไม่ระบุหัวหน้างาน";
  if (supList.length > 0) {
    leadEngineerName = supList[0].name;
  }

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

  return {
    id: work.id ?? work.workOrderId ?? index + 1,
    title: work.title || "ไม่ระบุชื่องาน",
    customer: customerName,
    customerObj: customerObj, // Pass full customer object
    leadEngineer: leadEngineerName,
    assignedBy: "-",
    status: uiStatus,
    dateRange:
      work.dateRange || formatWorkDateRange(work.startDate, work.endDate),
    description: work.description || "-",
    note: work.note || work.notes || null,
    address,
    assignedStaff: staffList,
    locationName,
    lat,
    lng,
    // Keep raw object for modals if needed
    raw: work,
  };
}

export default function Page() {
  const router = useRouter()
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all"); // Default to 'all'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [viewJob, setShowViewModal] = useState(null);
  const [editJob, setShowEditModal] = useState(null);

  // Updated Default Date (Empty to show all by default)
  const [dateRange, setDateRange] = useState([null, null]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const itemsPerPage = 50;

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);

      const session = getAdminSession();
      const empCode = getEmpCodeFromSession(session);

      if (!empCode) {
        console.warn("No empCode found in session");
        router.push('/auth/login');
      }

      const payload = {
        empCode: empCode,
        search: search || undefined,
        status: uiToApiStatus[status],
        dateFrom: dateFrom || undefined, // Send undefined if empty
        dateTo: dateTo || undefined, // Send undefined if empty
        page: currentPage,
        pageSize: itemsPerPage,
      };

      // console.log("Fetching API with payload:", payload)

      const response = await apiClient.post("/supervisor/by-code", payload);
      // console.log("API Response:", response.data)

      const rawItems =
        response.data?.items ||
        response.data?.data ||
        response.data?.rows ||
        [];
      const total =
        response.data?.totalPages ||
        (response.data?.total
          ? Math.ceil(response.data.total / itemsPerPage)
          : 1);

      const mappedJobs = rawItems.map((job, index) =>
        mapApiWorkToUi(job, index)
      );
      // console.log("Mapped Jobs:", mappedJobs)

      setJobs(mappedJobs);
      setTotalPages(total);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("ไม่สามารถดึงข้อมูลงานได้");
    } finally {
      setLoading(false);
    }
  }, [search, status, currentPage, dateFrom, dateTo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const getStatusColor = (status) => {
    const s = status?.toUpperCase() || "";
    if (s === "COMPLETED" || s === "เสร็จสิ้น")
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (s.includes("PROGRESS") || s.includes("กำลังดำเนินการ"))
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (s.includes("REVIEW") || s.includes("รอตรวจสอบ"))
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    if (s.includes("FIX") || s.includes("ต้องแก้ไข"))
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
  };



  const handleDelete = (job) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้?")) return;
    // Simulation
    const updated = jobs.filter((j) => j.id !== job.id);
    setJobs(updated);
    setShowEditModal(null);
    toast.error("ลบงานสำเร็จแล้ว (จำลอง)");
  };

  const handleSaveEdit = (updatedJob) => {
    // Simulation
    const updated = jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j));
    setJobs(updated);
    setShowEditModal(null);
    toast.success("แก้ไขข้อมูลงานเรียบร้อย (จำลอง)");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <SiteHeader title="จัดการงาน" />

      <main className="p-4 md:p-6 space-y-8 mx-auto">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-lg">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                <BriefcaseBusiness className="h-8 w-8" /> จัดการงาน
              </h1>
              <p className="text-blue-100 mt-2 text-lg">
                จัดการงานและการมอบหมายทั้งหมดในระบบ
              </p>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <Link href="/jobmanagement/add" className="w-full md:w-auto">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-lg h-11 px-6 text-base font-semibold w-full md:w-auto">
                  + สร้างงานใหม่
                </Button>
              </Link>

            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardContent className="grid md:grid-cols-4 gap-6 py-6">
            <div className="md:col-span-1 space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Search className="h-4 w-4" /> ค้นหา
              </label>
              <Input
                placeholder="รหัสงาน, ชื่องาน หรือ ลูกค้า..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500"
              />
            </div>

            <div className="md:col-span-1 space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Filter className="h-4 w-4" /> สถานะ
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-10 border-slate-200 dark:border-slate-800 focus:ring-blue-500">
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="in progress">กำลังดำเนินการ</SelectItem>
                  <SelectItem value="pending review">รอตรวจสอบ</SelectItem>
                  <SelectItem value="need fix">ต้องแก้ไข</SelectItem>
                  <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> ช่วงวันที่
              </label>
              <div className="w-full">
                <DatePicker.RangePicker
                  className="w-full h-10 border-slate-200 rounded-md shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500"
                  value={dateRange}
                  onChange={(dates) => {
                    setDateRange(dates);
                    if (dates) {
                      setDateFrom(
                        dates[0] ? dayjs(dates[0]).format("YYYY-MM-DD") : ""
                      );
                      setDateTo(
                        dates[1] ? dayjs(dates[1]).format("YYYY-MM-DD") : ""
                      );
                    } else {
                      setDateFrom("");
                      setDateTo("");
                    }
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="bg-blue-600 w-1 h-6 rounded-full inline-block"></span>
                รายการงานทั้งหมด
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                )}
              </h2>
              <Badge
                variant="secondary"
                className="text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800"
              >
                {jobs.length} รายการ
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* [แก้ไข 1] เพิ่ม div wrapper ให้มี overflow-x-auto เพื่อให้ scroll แนวนอนได้ */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                  <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
                    <TableHead className="w-[60px] font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      #
                    </TableHead>
                    {/* [แก้ไข 2] กำหนด min-width ให้คอลัมน์ชื่องาน */}
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 min-w-[200px]">
                      ชื่องาน
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      ลูกค้า
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      หัวหน้างาน
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      วันที่
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      ทีมงาน
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      สถานะ
                    </TableHead>
                    <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      จัดการ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-48 text-center">
                        <div className="flex flex-col justify-center items-center gap-3 text-slate-500">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                          <p className="text-sm">กำลังโหลดข้อมูล...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : jobs.length > 0 ? (
                    jobs.map((job, index) => (
                      <TableRow
                        key={job.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-slate-100 dark:border-slate-800"
                      >
                        <TableCell className="font-medium text-slate-500 text-xs whitespace-nowrap">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>

                        {/* [แก้ไข 3] ใส่ max-w และ truncate เพื่อตัดคำที่ยาวเกินไป */}
                        <TableCell className="max-w-[250px]">
                          <div className="flex flex-col">
                            <span
                              className="font-medium text-slate-900 dark:text-slate-100 truncate"
                              title={job.title} // เอาเมาส์ชี้แล้วจะเห็นชื่อเต็ม
                            >
                              {job.title}
                            </span>
                            <div
                              className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate"
                              title={job.raw?.locationAddress} // เอาเมาส์ชี้แล้วจะเห็นที่อยู่เต็ม
                            >
                              <MapPin className="w-3 h-3 flex-shrink-0" /> {/* flex-shrink-0 กันไอคอนบี้ */}
                              <span className="truncate">
                                {job.raw?.locationAddress || "ไม่ระบุที่อยู่"}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-slate-700 dark:text-slate-300 text-sm whitespace-nowrap">
                          {job.customer}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 text-sm whitespace-nowrap">
                          {job.leadEngineer}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3 text-slate-400" />
                            {job.dateRange}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex -space-x-2 overflow-hidden hover:space-x-1 transition-all duration-200 w-max">
                            {job.assignedStaff?.length > 0 ? (
                              job.assignedStaff.slice(0, 3).map((staff) => (
                                <div key={staff.id} className="relative group">
                                  <img
                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover shadow-sm bg-slate-100"
                                    src={staff.avatar}
                                    alt={staff.name}
                                    title={staff.name}
                                  />
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">-</span>
                            )}
                            {job.assignedStaff?.length > 3 && (
                              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-500 ring-2 ring-white dark:ring-slate-900 font-medium">
                                +{job.assignedStaff.length - 3}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              job.raw?.status || job.status
                            )} px-2.5 py-0.5 rounded-full shadow-sm border-0 font-medium whitespace-nowrap`}
                          >
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                              onClick={() => setShowViewModal(job)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-full"
                              onClick={() => setShowEditModal(job.raw || job)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-slate-500 h-48"
                      >
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <BriefcaseBusiness className="h-6 w-6 text-slate-400" />
                          </div>
                          <p className="text-sm">ไม่พบข้อมูลงาน</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* View & Edit Modals */}
      {viewJob && (
        <ViewJobModal job={viewJob} onClose={() => setShowViewModal(null)} />
      )}
      {editJob && (
        <EditJobModal
          job={editJob}
          onClose={() => setShowEditModal(null)}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
