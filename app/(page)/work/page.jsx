"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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
import { toast } from "sonner";

// ⭐ Import Components
import { WorkDetailModal } from "./work-detail-small-modal"; // Modal ตัวเล็ก
import { WorkDetailView } from "./work-detail-view";   // หน้า Detail ตัวใหญ่
import AddEquipmentModal from "./add-equipment-modal"; // Modal เบิกอุปกรณ์
import AddEmployeeModal from "./add-employee-modal"; // Modal เพิ่มพนักงาน
import StartWorkModal from "./start-work-modal"; // Modal เริ่มงาน
import CompleteWorkModal from "./complete-work-modal"; // Modal จบงาน

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

// ⭐ แก้ไข function นี้: ดึงทั้ง Employee และ Supervisor มารวมกันเสมอ
function mapApiWorkToUi(work, index) {
  console.log("Raw Work Object:", work);
  const uiStatus = apiToUiStatus[work.status] || work.status || "Pending";
  const customerObj = work.customer || null;
  const customerName = extractCustomerName(customerObj);
  const address = extractCustomerAddress(
    customerObj,
    work.locationAddress || "ไม่ระบุที่อยู่"
  );

  // 1. ดึงรายการพนักงาน (Employees) และระบุ Role เป็น "EMPLOYEE"
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

  // 2. ดึงรายการหัวหน้างาน (Supervisors) และระบุ Role เป็น "SUPERVISOR"
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

  // ⭐ รวมทั้ง 2 ลิสต์เข้าด้วยกัน
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

  const note = typeof work.note === "string" && work.note.trim() !== ""
    ? work.note.trim()
    : null;

  // ⭐ Map items/requisitions from API (support both `items` and `requisitions` shapes)
  const apiItems = Array.isArray(work.items) ? work.items : Array.isArray(work.requisitions) ? work.requisitions : [];
  const requisitions = apiItems.map((r, idx) => {
    // r may be a nested object (has item) or minimal
    const inner = r.item || r;
    return {
      id: r.id ?? r.itemId ?? `req-${idx}`,
      itemId: inner.id ?? inner.itemId ?? null,
      qtyRequest: r.qtyRequest ?? r.qty ?? r.quantity ?? r.qtyRequested ?? 0,
      qtyApproved: r.qtyApproved ?? r.qtyApproved ?? null,
      qtyUsed: r.qtyUsed ?? null,
      remark: r.remark ?? r.note ?? "",
      item: {
        id: inner.id,
        code: inner.code,
        name: inner.name,
        type: inner.type,
        category: inner.category || inner.categoryId || null,
        unit: inner.unit?.name || inner.unitId || null,
        packSize: inner.packSize ?? inner.pack_size ?? 1,
        packUnit: inner.packUnit || null,
        qtyOnHand: inner.qtyOnHand ?? inner.qty_on_hand ?? inner.stockQty ?? null,
        stockQty: inner.stockQty ?? inner.stock_qty ?? inner.qtyOnHand ?? null,
        categoryRaw: inner.category,
        unitRaw: inner.unit,
      },
    };
  });

  return {
    id: work.id ?? work.workOrderId ?? work.work_order_id ?? work._id ?? index + 1,
    title: work.title || `งานติดตั้ง #${(work.id || "").toString().substring(0, 6)}`,
    customer: customerName,
    leadEngineer: leadEngineerName,
    assignedBy: "-",
    status: uiStatus,
    dateRange:
      work.dateRange || formatWorkDateRange(work.startDate, work.endDate),
    description: work.description || "-",
    note,
    address,
    assignedStaff: staffList, // ส่ง list รวมที่มี role ชัดเจน
    lat,
    lng,
    locationName,
    requisitions, // <-- normalized list for UI
    items: apiItems, // <-- keep raw api items accessible for compatibility

    // ข้อมูลเพิ่มเติมสำหรับ Detail (Legacy support)
    contactPerson: work.contactPerson || (work.customer && work.customer.contactName) || "-",
    contactPhone: work.contactPhone || (work.customer && work.customer.phone) || "-",
    technicians: work.technicians || work.employees || [],
    images: work.images || [],
    history: work.history || [],
  };
}

// ==========================================
// 2. Main Page Component
// ==========================================
function WorkPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openWorkId = searchParams.get("openWorkId");

  const [session, setSession] = useState(null);
  const [sessionStatus, setSessionStatus] = useState("loading");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // State การแสดงผล: 'list' | 'detail'
  const [viewMode, setViewMode] = useState("list");

  // State เลือกงาน
  const [selectedWork, setSelectedWork] = useState(null);

  // State Modal เล็ก (Popup)
  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);

  // State Add Equipment Modal
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);

  // State Add Employee Modal
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);

  // New Modal States
  const [isStartWorkModalOpen, setIsStartWorkModalOpen] = useState(false);
  const [isCompleteWorkModalOpen, setIsCompleteWorkModalOpen] = useState(false);

  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [total, setTotal] = useState(0);
  const route = useRouter();

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
      route.push('/auth/login');
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
        } else if (typeof res.data?.totalPages === "number") {
          // If API returns totalPages but not total count, we might need to adjust logic
          // For now, assuming totalPages is enough for simple pagination or we just show what we have
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

  // ⭐ Deep Linking Logic
  useEffect(() => {
    if (openWorkId && workItems.length > 0) {
      const targetWork = workItems.find((w) => w.id.toString() === openWorkId.toString());
      if (targetWork) {
        setSelectedWork(targetWork);
        setIsSmallModalOpen(true);

        // Clean up URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete("openWorkId");
        router.replace(`/work?${params.toString()}`);
      }
    }
  }, [openWorkId, workItems, router, searchParams]);

  const filteredWorks = useMemo(() => workItems, [workItems]);

  const filterOptions = [
    { id: "All", label: "ทั้งหมด" },
    { id: "Pending", label: "รอดำเนินการ" },
    { id: "In Progress", label: "กำลังดำเนินการ" },
    { id: "Reject", label: "ยกเลิก" },
    { id: "Completed", label: "เสร็จสิ้น" },
  ];

  // --- Handlers ---
  const handleOpenAddEquipment = () => {
    setIsAddEquipmentModalOpen(true);
  };

  const handleConfirmAddEquipment = async (newItems) => {
    if (!selectedWork) return;

    const payload = {
      workOrderId: selectedWork.id,
      items: newItems.map(item => ({
        itemId: item.id,
        qty: item.requestQty || 1,
        remark: item.remark || "" // เหตุผลการเบิก
      }))
    };

    try {
      setLoading(true);
      console.log("Sending equipment requisition:", payload);

      const res = await apiClient.post("/issue-items", payload);

      // Check if successful
      if (res?.status === 200 || res?.data?.success) {
        toast.success("เบิกอุปกรณ์เรียบร้อย - ส่งไปยังแอดมินแล้ว");

        // Create new requisitions from selected items for UI update
        const newRequisitions = newItems.map(item => ({
          id: `REQ-NEW-${Date.now()}-${item.id}`, // Temporary ID
          item: {
            id: item.id,
            code: item.code,
            name: item.name,
            unit: item.unit
          },
          qtyRequest: item.requestQty || 1,
          remark: item.remark || "",
          status: "Pending"
        }));

        // Update selectedWork state
        setSelectedWork(prev => ({
          ...prev,
          requisitions: [...(prev.requisitions || []), ...newRequisitions]
        }));

        // Also update in the main list
        setWorkItems(prevWorks => prevWorks.map(w =>
          w.id === selectedWork.id
            ? { ...w, requisitions: [...(w.requisitions || []), ...newRequisitions] }
            : w
        ));

        setIsAddEquipmentModalOpen(false);
      } else {
        throw new Error(res?.data?.message || "ไม่สำเร็จ");
      }
    } catch (err) {
      console.error("Failed to requisition equipment:", err);
      toast.error(err?.response?.data?.message || err.message || "ไม่สามารถเบิกอุปกรณ์ได้");
    } finally {
      setLoading(false);
    }
  };

  // New handler for opening the AddEmployeeModal
  const handleOpenAddEmployee = () => {
    setIsAddEmployeeModalOpen(true);
  };

  // New handler for confirming employee addition
  const handleConfirmAddEmployee = async (newUsers) => {
    if (!selectedWork) return;

    // Create new staff objects from selected users
    const newStaff = newUsers.map(user => ({
      id: user.id,
      name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username,
      role: user.role || "EMPLOYEE",
      avatar: user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName || "U")}&background=random`,
      position: user.position || "-",
      workStatus: user.workStatus || "FREE",
      isNew: true // Mark as new so it can be removed
    }));

    // ⭐ If status is "In Progress", update via API immediately
    if (selectedWork.status === "In Progress") {
      try {
        setLoading(true);
        // 1. Get existing employee IDs (excluding supervisors)
        const existingEmployeeIds = selectedWork.assignedStaff
          .filter(s => s.role === "EMPLOYEE")
          .map(s => s.id);

        // 2. Get new employee IDs
        const newEmployeeIds = newUsers.map(u => u.id);

        // 3. Combine unique IDs
        const allEmployeeIds = Array.from(new Set([...existingEmployeeIds, ...newEmployeeIds]));

        console.log("Updating employees for In Progress work:", allEmployeeIds);

        // 4. Call API
        await apiClient.post(`/work-orders/${selectedWork.id}/assign-employees`, {
          employeeIds: allEmployeeIds
        });

        toast.success("เพิ่มพนักงานเรียบร้อย");

        // 5. Update UI State (Optimistic)
        // We need to make sure we don't duplicate if API returns success
        // But for consistency with local state logic:
        setSelectedWork(prev => ({
          ...prev,
          assignedStaff: [...(prev.assignedStaff || []), ...newStaff]
        }));

        setWorkItems(prevWorks => prevWorks.map(w =>
          w.id === selectedWork.id
            ? { ...w, assignedStaff: [...(w.assignedStaff || []), ...newStaff] }
            : w
        ));

        setIsAddEmployeeModalOpen(false);

      } catch (err) {
        console.error("Failed to add employees:", err);
        toast.error("ไม่สามารถเพิ่มพนักงานได้: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    } else {
      // ⭐ Normal behavior for Pending/Other statuses (Local state only)
      setSelectedWork(prev => ({
        ...prev,
        assignedStaff: [...(prev.assignedStaff || []), ...newStaff]
      }));

      // Also update in the main list
      setWorkItems(prevWorks => prevWorks.map(w =>
        w.id === selectedWork.id
          ? { ...w, assignedStaff: [...(w.assignedStaff || []), ...newStaff] }
          : w
      ));

      setIsAddEmployeeModalOpen(false);
    }
  };

  // Handler for removing an employee (only for newly added ones)
  const handleRemoveEmployee = (employeeId) => {
    if (!selectedWork) return;

    // Update selectedWork state
    setSelectedWork(prev => ({
      ...prev,
      assignedStaff: prev.assignedStaff.filter(s => s.id !== employeeId)
    }));

    // Also update in the main list
    setWorkItems(prevWorks => prevWorks.map(w =>
      w.id === selectedWork.id
        ? { ...w, assignedStaff: w.assignedStaff.filter(s => s.id !== employeeId) }
        : w
    ));
  };

  // Helper to actually update status and data
  const updateWorkStatus = async (newStatus, additionalData = {}) => {
    if (!selectedWork) return;

    try {
      setLoading(true);

      // Map UI status to API status
      const apiStatus = uiToApiStatus[newStatus];
      if (!apiStatus) {
        throw new Error(`Invalid status: ${newStatus}`);
      }

      // Prepare payload
      const payload = {
        status: apiStatus,
        ...additionalData
      };

      console.log("Updating status:", payload);

      // Call API
      await apiClient.put(`/work-orders/${selectedWork.id}`, payload);

      // Optimistic update
      const updatedWork = { ...selectedWork, status: newStatus, ...additionalData };

      setSelectedWork(updatedWork);
      setWorkItems(prevWorks => prevWorks.map(w =>
        w.id === selectedWork.id
          ? updatedWork
          : w
      ));

      toast.success("อัพเดทสถานะเรียบร้อยแล้ว");

    } catch (err) {
      console.error("Failed to update work status:", err);
      setError("ไม่สามารถอัพเดทสถานะงานได้");
      toast.error("เกิดข้อผิดพลาดในการอัพเดทสถานะ");
    } finally {
      setLoading(false);
    }
  };

  // Handler for updating work status (Triggered by button click)
  const handleUpdateStatus = (newStatus) => {
    if (!selectedWork) return;

    if (newStatus === "In Progress") {
      setIsStartWorkModalOpen(true);
    } else if (newStatus === "Completed") {
      setIsCompleteWorkModalOpen(true);
    } else {
      // Direct update for other statuses (if any)
      updateWorkStatus(newStatus);
    }
  };

  const handleConfirmStartWork = async (images) => {
    try {
      // 1. Collect all employee IDs
      const employees = selectedWork.assignedStaff.filter(s => s.role === "EMPLOYEE");
      const employeeIds = employees.map(s => s.id);

      if (employeeIds.length > 0) {
        console.log("Assigning employees to start work:", employeeIds);
        await apiClient.post(`/work-orders/${selectedWork.id}/assign-employees`, {
          employeeIds: employeeIds
        });
        toast.success("บันทึกพนักงานและเริ่มงานเรียบร้อย");

        // Optimistic update to "In Progress"
        const updatedWork = { ...selectedWork, status: "In Progress" };
        setSelectedWork(updatedWork);
        setWorkItems(prevWorks => prevWorks.map(w =>
          w.id === selectedWork.id ? updatedWork : w
        ));
      } else {
        toast.error("กรุณาเพิ่มพนักงานก่อนเริ่มงาน");
        return;
      }

      setIsStartWorkModalOpen(false);
    } catch (err) {
      console.error("Failed to start work:", err);
      toast.error("ไม่สามารถเริ่มงานได้: " + (err.response?.data?.message || err.message));
    }
  };

  const handleConfirmCompleteWork = async (data) => {
    try {
      console.log("Completing work (Supervisor Review) with data:", data);

      // Call the supervisor review API as requested
      await apiClient.post(`/work-orders/${selectedWork.id}/supervisor-review`, {
        decision: "APPROVE"
      });

      toast.success("อนุมัติและจบงานเรียบร้อย");

      // Optimistic update to "Completed"
      const updatedWork = { ...selectedWork, status: "Completed" };
      setSelectedWork(updatedWork);
      setWorkItems(prevWorks => prevWorks.map(w =>
        w.id === selectedWork.id ? updatedWork : w
      ));

      setIsCompleteWorkModalOpen(false);
    } catch (err) {
      console.error("Failed to complete work:", err);
      toast.error("ไม่สามารถจบงานได้: " + (err.response?.data?.message || err.message));
    }
  };

  // Handler for opening the detail view from the small modal
  const handleOpenDetailView = () => {
    setIsSmallModalOpen(false); // Close the small modal
    setViewMode("detail");      // Switch main view to Detail View
  };

  // --- Render ---
  if (viewMode === "detail" && selectedWork) {
    return (
      <>
        <WorkDetailView
          work={selectedWork}
          onBack={() => {
            setViewMode("list");
          }}
          onAddEquipment={handleOpenAddEquipment}
          onAddEmployee={handleOpenAddEmployee}
          onRemoveEmployee={handleRemoveEmployee}
          onUpdateStatus={handleUpdateStatus}
        />
        {/* Modals for Detail View */}
        {selectedWork && (
          <AddEquipmentModal
            isOpen={isAddEquipmentModalOpen}
            onClose={() => setIsAddEquipmentModalOpen(false)}
            onConfirm={handleConfirmAddEquipment}
            existingIds={selectedWork?.requisitions?.map(r => r.item?.id).filter(Boolean) || []}
            existingRequisitions={selectedWork?.requisitions || []}
          />
        )}
        {selectedWork && (
          <AddEmployeeModal
            isOpen={isAddEmployeeModalOpen}
            onClose={() => setIsAddEmployeeModalOpen(false)}
            onConfirm={handleConfirmAddEmployee}
            existingIds={selectedWork?.assignedStaff?.map(s => s.id).filter(Boolean) || []}
          />
        )}
        {selectedWork && (
          <StartWorkModal
            isOpen={isStartWorkModalOpen}
            onClose={() => setIsStartWorkModalOpen(false)}
            onConfirm={handleConfirmStartWork}
          />
        )}
        {selectedWork && (
          <CompleteWorkModal
            isOpen={isCompleteWorkModalOpen}
            onClose={() => setIsCompleteWorkModalOpen(false)}
            onConfirm={handleConfirmCompleteWork}
          />
        )}
      </>
    );
  }

  return (
    <main className="h-[98vh] w-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* 1. Fixed Header */}
      < div className="flex-none z-20 shadow-sm bg-white dark:bg-gray-950" >
        <SiteHeader />
      </div >

      {/* 2. Content Container */}
      < div className="flex-1 flex flex-col min-h-0 container mx-auto max-w-[95%] 2xl:max-w-[1600px] px-4" >
        {/* 2.1 Fixed Filters & Search */}
        < div className="flex-none py-4 z-10 bg-white dark:bg-gray-950" >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Work Orders
              </h1>
              <p className="text-muted-foreground">
                จัดการและติดตามสถานะงานติดตั้ง/ซ่อมบำรุง
              </p>
            </div >
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
          </div >

          {/* Filter Buttons */}
          < div className="flex flex-wrap items-center gap-2 border-b pb-4" >
            {
              filterOptions.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setPage(1);
                    setActiveFilter(filter.id);
                  }}
                  className={`rounded-full px-4 ${activeFilter === filter.id
                    ? "shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {filter.label}
                </Button>
              ))
            }
          </div >

          {
            error && (
              <div className="text-sm text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-md mt-2">
                {error}
              </div>
            )
          }
        </div >

        {/* 2.2 Scrollable Grid Area */}
        < div className="flex-1 overflow-y-auto min-h-0 pb-6 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700" >
          {
            loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center h-full" >
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
                    onClick={() => {
                      setSelectedWork(item);
                      setIsSmallModalOpen(true);
                    }}
                  >
                    <div
                      className={`h-1.5 w-full ${item.status === "Pending"
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
            )
          }
        </div >
      </div >

      {/* Modal ตัวเล็ก (Popup) */}
      {
        selectedWork && (
          <WorkDetailModal
            open={isSmallModalOpen}
            onOpenChange={setIsSmallModalOpen}
            work={selectedWork}
            onOpenBigModal={handleOpenDetailView}
          />
        )
      }

      {/* Add Equipment Modal */}
      {
        selectedWork && (
          <AddEquipmentModal
            isOpen={isAddEquipmentModalOpen}
            onClose={() => setIsAddEquipmentModalOpen(false)}
            onConfirm={handleConfirmAddEquipment}
            existingIds={selectedWork?.requisitions?.map(r => r.item?.id).filter(Boolean) || []}
            existingRequisitions={selectedWork?.requisitions || []}
          />
        )
      }

      {/* Add Employee Modal */}
      {
        selectedWork && (
          <AddEmployeeModal
            isOpen={isAddEmployeeModalOpen}
            onClose={() => setIsAddEmployeeModalOpen(false)}
            onConfirm={handleConfirmAddEmployee}
            existingIds={selectedWork?.assignedStaff?.map(s => s.id).filter(Boolean) || []}
          />
        )
      }
    </main >
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <WorkPageContent />
    </Suspense>
  );
}
