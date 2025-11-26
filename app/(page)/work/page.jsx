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
import { Skeleton } from "@/components/ui/skeleton";

// --- Icons Imports ---
import {
  ChevronRight,
  Search,
  MapPin,
  Briefcase,
  CalendarDays,
  Filter,
  BriefcaseBusiness
} from "lucide-react";

// ⭐ client API
import apiClient from "@/lib/apiClient";

// ⭐ Import Components
import { WorkDetailModal } from "./work-detail-small-modal"; // Modal ตัวเล็ก
import { WorkDetailView } from "./work-detail-view";   // หน้า Detail ตัวใหญ่

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
      return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
    case "Reject":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    case "In Progress":
      return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    case "Completed":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
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

// ==========================================
// 2. Main Page Component
// ==========================================
export default function Page() {
  // --- State ---
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // จำนวนรายการต่อหน้า

  // Modal State
  const [selectedWork, setSelectedWork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  // --- Effect: Fetch Data ---
  useEffect(() => {
    fetchWorks();
  }, [activeTab, currentPage, searchQuery]); // Re-fetch when filter/page/search changes

  const fetchWorks = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = getAdminSession();
      if (!session) {
        throw new Error("ไม่พบข้อมูลการเข้าสู่ระบบ (Session not found)");
      }

      const empCode = getEmpCodeFromSession(session);
      // ถ้าไม่มี empCode อาจจะแสดงทั้งหมด หรือไม่แสดงเลย แล้วแต่ Policy
      // ในที่นี้สมมติว่าถ้าไม่มี empCode ก็ไม่ส่ง filter technicianId (เห็นงานทั้งหมด?)
      // หรือจะบังคับว่าต้องมีก็ได้

      const statusParam = uiToApiStatus[activeTab];

      // สร้าง query params
      const params = {
        page: currentPage,
        pageSize: pageSize,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (statusParam) {
        params.status = statusParam;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      // Filter by technicianId (เฉพาะงานของฉัน)
      if (empCode) {
        params.technicianId = empCode;
      }

      const res = await apiClient.get("/work-orders", { params });

      // API response structure: { items: [...], total: 10, page: 1, pageSize: 10, totalPages: 1 }
      const data = res.data;

      // Map API data to UI format
      const mappedWorks = (data.items || []).map(mapApiWorkToUi);

      setWorks(mappedWorks);
      setTotalPages(data.totalPages || 1);

    } catch (err) {
      console.error("Error fetching works:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  // Helper to map API object to UI object
  function mapApiWorkToUi(work, index) {
    // ... (Logic เดิมในการ map ข้อมูล)
    // เพื่อความกระชับ ขอใช้ logic เดิม แต่เขียนใหม่ให้ชัดเจน
    const customerName = extractCustomerName(work.customer);
    const status = apiToUiStatus[work.status] || "Pending";

    return {
      id: work.id,
      title: work.title || `งานติดตั้ง #${work.id.substring(0, 6)}`,
      customer: customerName,
      location: work.locationName || "ไม่ระบุสถานที่", // ใช้ locationName ถ้ามี
      date: work.appointmentDate
        ? new Date(work.appointmentDate).toLocaleDateString("th-TH", { day: 'numeric', month: 'short', year: 'numeric' })
        : "ไม่ระบุวันที่",
      time: work.appointmentTime || "09:00 - 12:00", // ถ้าไม่มีเวลา ให้ใส่ default หรือ "-"
      status: status,
      type: work.jobType || "Installation",
      priority: work.priority || "Normal",

      // ข้อมูลเพิ่มเติมสำหรับ Detail
      description: work.description,
      contactPerson: work.contactPerson,
      contactPhone: work.contactPhone,
      address: work.address,
      latitude: work.latitude,
      longitude: work.longitude,
      technicians: work.technicians, // Array of technicians
      images: work.images || [],
      history: work.history || [],
    };
  }

  // --- Handlers ---
  const handleWorkClick = (work) => {
    setSelectedWork(work);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWork(null);
  };

  const handleOpenDetailView = () => {
    setIsDetailViewOpen(true);
    setIsModalOpen(false); // ปิด Modal เล็ก
  };

  const handleCloseDetailView = () => {
    setIsDetailViewOpen(false);
    setSelectedWork(null);
    // Refresh data after closing detail view (in case status changed)
    fetchWorks();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  // --- Render ---
  if (isDetailViewOpen && selectedWork) {
    return (
      <WorkDetailView
        work={selectedWork}
        onBack={handleCloseDetailView}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <SiteHeader title="งานของฉัน" />

      <main className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-lg">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                <BriefcaseBusiness className="h-8 w-8" /> งานของฉัน
              </h1>
              <p className="text-blue-100 mt-2 text-lg">
                จัดการและติดตามสถานะงานติดตั้ง/ซ่อมบำรุงของคุณ
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Status Tabs */}
          <div className="flex p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto max-w-full">
            {["All", "Pending", "In Progress", "Completed", "Reject"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeTab === tab
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
              >
                {tab === "All" ? "ทั้งหมด" : statusLabels[tab] || tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="ค้นหางาน..."
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 rounded-xl"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm">
            <div className="inline-flex p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 mb-4">
              <Filter className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">เกิดข้อผิดพลาด</h3>
            <p className="text-slate-500 mt-1">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={fetchWorks}
            >
              ลองใหม่อีกครั้ง
            </Button>
          </div>
        ) : works.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 mb-4">
              <Briefcase className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">ไม่พบงานที่ค้นหา</h3>
            <p className="text-slate-500 mt-1">ลองปรับตัวกรองหรือคำค้นหาใหม่</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map((work) => (
              <Card
                key={work.id}
                className="group cursor-pointer hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                onClick={() => handleWorkClick(work)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <Badge variant="outline" className={`${getStatusStyles(work.status)} border px-2 py-0.5 rounded-full text-xs font-medium`}>
                      {statusLabels[work.status] || work.status}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">#{work.id.toString().slice(-4)}</span>
                  </div>
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 mt-2 group-hover:text-blue-600 transition-colors">
                    {work.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-slate-400" />
                    <span className="line-clamp-2 text-xs">{work.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="text-xs">{work.date} • {work.time}</span>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        {work.customer.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                        {work.customer}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-800"
            >
              &lt;
            </Button>
            <span className="flex items-center px-4 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              หน้า {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-800"
            >
              &gt;
            </Button>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedWork && (
        <WorkDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          work={selectedWork}
          onOpenDetail={handleOpenDetailView}
        />
      )}
    </div>
  );
}