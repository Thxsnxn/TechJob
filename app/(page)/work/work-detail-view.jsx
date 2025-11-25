"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  MapPin,
  MapPinned,
  NotebookPen,
  NotebookText,
  Package,
  PackagePlus,
  Save,
  Search,
  Trash2,
  UserCog,
  UserPlus,
  Users,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import AddEquipmentModal from "./add-equipment-modal";

// --- AddTechnicianModal Component ---  
function AddTechnicianModal({ isOpen, onClose, onConfirm, existingIds = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      setSelectedIds([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post("/filter-employees", {
        search: searchTerm.trim(),
        role: "EMPLOYEE",   // <<<<<<<<<<<<<<  เปลี่ยนตรงนี้
        page: 1,
        pageSize: 100
      });

      console.log("EMP RESPONSE:", res.data);

      const employeesData =
        res.data?.items ||
        res.data?.data ||
        res.data ||
        [];

      setEmployees(employeesData);

    } catch (error) {
      console.error("Failed to fetch employees:", error);
      console.error("Backend said:", error.response?.data);
      toast.error("ไม่สามารถโหลดรายชื่อช่างได้");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (emp) => {
    setSelectedIds((prev) =>
      prev.includes(emp.id)
        ? prev.filter((id) => id !== emp.id)
        : [...prev, emp.id]
    );
  };

  const handleConfirm = () => {
    const selectedEmployees = employees.filter((emp) => selectedIds.includes(emp.id));
    onConfirm(selectedEmployees);
    onClose();
  };

  const renderWorkStatusBadge = (status) => {
    switch (status) {
      case "BUSY":
        return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">ไม่ว่าง</Badge>;
      case "FREE":
        return <Badge variant="success" className="bg-green-100 text-green-700 border-green-200">ว่าง</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white dark:bg-slate-900 border dark:border-slate-800">
        <DialogHeader className="px-6 py-4 border-b bg-white dark:bg-slate-900 z-10">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
            <UserPlus className="w-6 h-6 text-blue-600" />
            เพิ่มช่างเข้าทีม (Add Technician)
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 border-b bg-white dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ค้นหา รหัส, ชื่อ, เบอร์..."
                className="pl-9 bg-white dark:bg-slate-950"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchEmployees()}
              />
            </div>
            <Button onClick={fetchEmployees} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "ค้นหา"}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-0 bg-gray-50 dark:bg-slate-950 min-h-[300px]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-center w-[60px] whitespace-nowrap">เลือก</th>
                  <th className="px-4 py-3 whitespace-nowrap">ข้อมูลพนักงาน</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">ตำแหน่ง</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">สถานะ</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">เบอร์โทร</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800 bg-white dark:bg-slate-900">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                      กำลังค้นหา...
                    </td>
                  </tr>
                ) : employees.length > 0 ? (
                  employees.map((emp) => {
                    const isSelected = selectedIds.includes(emp.id);
                    const isAlreadyAdded = existingIds.includes(emp.id);

                    const status = emp.workStatus || emp.workstatus || "FREE";
                    const isBusy = status === "BUSY";
                    const isDisabled = isAlreadyAdded || isBusy;

                    return (
                      <tr
                        key={emp.id}
                        className={`transition-colors border-b dark:border-slate-800
                          ${isDisabled ? "bg-gray-100 dark:bg-slate-800 opacity-60 cursor-not-allowed"
                            : "hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"}
                          ${isSelected ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}
                        onClick={() => !isDisabled && toggleSelection(emp)}
                      >
                        <td className="px-4 py-3 text-center">
                          {!isDisabled && (
                            <div className={`w-5 h-5 rounded border mx-auto flex items-center justify-center transition-all 
                              ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"}`}>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                          )}
                          {isAlreadyAdded && <Check className="w-4 h-4 text-green-500 mx-auto" />}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border">
                              {(emp.firstName?.[0] || "U") + (emp.lastName?.[0] || "")}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-slate-100">
                                {emp.firstName} {emp.lastName}
                              </div>
                              <div className="text-xs text-gray-500">{emp.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="outline" className="font-normal text-xs bg-slate-50 whitespace-nowrap">
                            {emp.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {renderWorkStatusBadge(status)}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-500 text-xs whitespace-nowrap">
                          {emp.phone || "-"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400 italic">
                      ไม่พบข้อมูลช่างที่ค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="px-4 sm:px-6 py-4 border-t bg-gray-50 dark:bg-slate-950 flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-3 sm:gap-0">
          <div className="text-sm text-gray-500">
            เลือกแล้ว <span className="font-bold text-blue-600">{selectedIds.length}</span> คน
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
              ยกเลิก
            </Button>
            <Button onClick={handleConfirm} disabled={selectedIds.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none">
              เพิ่มลงในรายการ
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function WorkDetailView({ work, onBack }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [supervisorPage, setSupervisorPage] = useState(1);
  const [technicianPage, setTechnicianPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    if (work?.assignedStaff) {
      setCurrentStaff(work.assignedStaff);
      setSupervisorPage(1);
      setTechnicianPage(1);
    }

    // Prefer raw API `work.items` when available, otherwise use normalized `work.requisitions`
    const apiItems = Array.isArray(work?.items) && work.items.length > 0
      ? work.items
      : Array.isArray(work?.requisitions)
        ? work.requisitions
        : [];

    if (apiItems && apiItems.length > 0) {
      setSelectedEquipments(apiItems.map(req => {
        const itemObj = req.item || req;
        const stockQty = itemObj.stockQty ?? 0;
        const qtyOnHand = itemObj.qtyOnHand ?? 0;
        const initialQty = Number(req.qtyRequest ?? req.qty ?? req.quantity ?? req.qtyRequested ?? 1) || 1;

        // Mark API-origin items as locked so qty/remark cannot be edited
        return {
          uid: `api-${req.id ?? itemObj.id ?? Math.random().toString(36).slice(2)}`,
          itemId: itemObj.id ?? req.itemId,
          code: itemObj.code || "-",
          name: itemObj.name || "-",
          type: itemObj.type === "EQUIPMENT" ? "อุปกรณ์ (ยืม-คืน)" : (itemObj.type === "MATERIAL" ? "วัสดุ (เบิกเลย)" : (itemObj.type || "-")),
          category: itemObj.category?.name || itemObj.category || "-",
          unit: itemObj.unit?.name || itemObj.unit || "-",
          packSize: itemObj.packSize || 1,
          stockQty,
          qtyOnHand,
          total: itemObj.qtyOnHand ?? itemObj.stockQty ?? 0,
          requestQty: initialQty,
          remark: req.remark ?? req.note ?? "",
          locked: true,     // <-- API items are locked/read-only
          source: "api"
        };
      }));
    } else {
      setSelectedEquipments([]); // clear when no items
    }
  }, [work]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("admin_session");
      if (raw) {
        const session = JSON.parse(raw);
        setCurrentUserRole(session.role || "");
      }
    } catch (e) {
      console.error("Error reading session role:", e);
    }
  }, []);

  const handleAddStaff = (newStaff) => {
    setCurrentStaff((prev) => {
      const existingIds = prev.map(s => s.id);
      const uniqueNew = newStaff.filter(s => !existingIds.includes(s.id));
      return [...prev, ...uniqueNew];
    });
    toast.success(`เพิ่มช่างลงในรายการแล้ว ${newStaff.length} คน (กดบันทึกเพื่อยืนยัน)`);
  };

  const handleRemoveStaff = (staffId) => {
    setCurrentStaff((prev) => prev.filter(s => s.id !== staffId));
  };

  const handleAddEquipment = (newItems) => {
    setSelectedEquipments((prev) => {
      // allow adding items even if same itemId exists from API by creating new uid entries
      const transformed = newItems.map(item => ({
        uid: `new-${item.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        itemId: item.id,
        code: item.code,
        name: item.name,
        type: item.type,
        category: item.category,
        unit: item.unit,
        packSize: item.packSize || 1,
        stockQty: item.stockQty || 0,
        qtyOnHand: item.qtyOnHand || item.stockQty || 0,
        total: item.total || 0,
        requestQty: Number(item.requestQty ?? 1),
        remark: item.remark ?? "",
        locked: false, // newly added entries are editable
        source: "new"
      }));

      // Keep previous entries and append new unique ones
      return [...prev, ...transformed];
    });
    toast.success(`เพิ่มอุปกรณ์ลงในรายการแล้ว ${newItems.length} รายการ`);
  };

  const handleRemoveEquipment = (uid) => {
    setSelectedEquipments((prev) => prev.filter(i => i.uid !== uid));
  };

  const handleEquipmentQtyChange = (uid, newQty) => {
    const qty = Number(newQty);
    if (isNaN(qty) || qty < 0) return;
    setSelectedEquipments((prev) =>
      prev.map(item =>
        item.uid === uid ? { ...item, requestQty: qty } : item
      )
    );
  };

  const handleEquipmentRemarkChange = (uid, newRemark) => {
    setSelectedEquipments((prev) =>
      prev.map(item =>
        item.uid === uid ? { ...item, remark: newRemark } : item
      )
    );
  };

  // --- 🔥 จุดที่แก้ไข: Reset ตารางหลังเบิกเสร็จ 🔥 ---
  const handleConfirmRequisition = async () => {
    // Only send newly added/unlocked items (allow multiple issues)
    const toIssue = selectedEquipments.filter(item => !item.locked);
    if (toIssue.length === 0) {
      toast.error("ไม่มีรายการใหม่สำหรับเบิก");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        workOrderId: work.id,
        items: toIssue.map(item => ({
          itemId: item.itemId,
          qty: Number(item.requestQty || 0),
          remark: item.remark || ""
        }))
      };

      await apiClient.post("/issue-items", payload);

      toast.success("บันทึกการเบิกอุปกรณ์เรียบร้อยแล้ว");
      
      // ✅ RESET LOGIC: เปลี่ยนสถานะ items ที่เพิ่งเบิกให้เป็น locked (เหมือนโหลดมาจาก API) ทันที
      // ทำให้ช่องกรอกข้อมูลถูก disable และปุ่มลบหายไป เป็นการยืนยันว่าเบิกเสร็จแล้ว
      setSelectedEquipments((prev) =>
        prev.map((item) =>
          !item.locked
            ? { ...item, locked: true, source: "api" }
            : item
        )
      );

    } catch (error) {
      console.error("Failed to issue items:", error);
      toast.error("เกิดข้อผิดพลาดในการเบิกอุปกรณ์");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const technicianIds = currentStaff
        .filter(staff => staff.role !== 'SUPERVISOR' && staff.role !== 'หัวหน้างาน')
        .map(staff => staff.id);

      await apiClient.post(`/work-orders/${work.id}/assign-employees`, { employeeIds: technicianIds });

      const toIssue = selectedEquipments.filter(item => !item.locked);
      if (toIssue.length > 0) {
        const payload = {
          workOrderId: work.id,
          items: toIssue.map(item => ({
            itemId: item.itemId,
            qty: Number(item.requestQty || 0),
            remark: item.remark || ""
          }))
        };
        try {
          await apiClient.post("/issue-items", payload);
        } catch (reqError) {
          console.warn("Failed to save requisition (issue-items):", reqError);
        }
      }

      toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
      onBack();

    } catch (error) {
      console.error("Save error:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSaving(false);
    }
  };

  const supervisors = useMemo(() => {
    return currentStaff.filter(staff => staff.role === "SUPERVISOR" || staff.role === "หัวหน้างาน");
  }, [currentStaff]);

  const technicians = useMemo(() => {
    return currentStaff.filter(staff => staff.role !== "SUPERVISOR" && staff.role !== "หัวหน้างาน");
  }, [currentStaff]);

  const totalSupervisorPages = Math.max(1, Math.ceil(supervisors.length / ITEMS_PER_PAGE));
  const paginatedSupervisors = supervisors.slice(
    (supervisorPage - 1) * ITEMS_PER_PAGE,
    supervisorPage * ITEMS_PER_PAGE
  );

  const totalTechnicianPages = Math.max(1, Math.ceil(technicians.length / ITEMS_PER_PAGE));
  const paginatedTechnicians = technicians.slice(
    (technicianPage - 1) * ITEMS_PER_PAGE,
    technicianPage * ITEMS_PER_PAGE
  );

  const renderWorkStatusBadge = (status) => {
    switch (status) {
      case "BUSY":
        return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">ไม่ว่าง</Badge>;
      case "FREE":
        return <Badge variant="success" className="bg-green-100 text-green-700 border-green-200">ว่าง</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">{status}</Badge>;
    }
  };

  if (!work) return null;

  const isInProgress = work?.status?.toUpperCase()?.replace(" ", "_") === "IN_PROGRESS";
  const isCompleted = work?.status?.toUpperCase() === "COMPLETED" || work?.status?.toUpperCase() === "CANCELLED";

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col animate-in fade-in duration-300">
      {/* --- Header (Fixed Top) --- */}
      <header className="bg-white dark:bg-slate-900 border-b px-4 py-4 flex-none z-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-slate-100 dark:hover:bg-slate-800 px-2 sm:px-3"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">ย้อนกลับ</span>
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 sm:mx-2 flex-none"></div>
          <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2 truncate">
            <NotebookText className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6 flex-none" />
            <span className="truncate">{work.title}</span>
          </h1>
        </div>

        <div className="hidden sm:block flex-none ml-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
            {work.status}
          </span>
        </div>
      </header>

      {/* --- Main Content (Scrollable Middle) --- */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
        <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto space-y-6">

          {/* 1. ข้อมูลงาน */}
          <Card className="bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex items-center gap-2 flex-row pb-2 border-b mb-4">
              <NotebookText className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                ข้อมูลงาน (Job Information)
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ชื่องาน</label>
                  <Input readOnly value={work.title} className="bg-gray-50 dark:bg-slate-950 dark:border-slate-700 cursor-default" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-blue-500" /> ระยะเวลาดำเนินงาน
                  </label>
                  <Input readOnly value={work.dateRange || "-"} className="bg-gray-50 dark:bg-slate-950 dark:border-slate-700 cursor-default" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">รายละเอียด</label>
                <Textarea readOnly value={work.description} className="bg-gray-50 dark:bg-slate-950 dark:border-slate-700 min-h-[80px] cursor-default" />
              </div>
            </CardContent>
          </Card>

          {/* 2. ข้อมูลลูกค้า */}
          <Card className="bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex items-center gap-2 flex-row pb-2 border-b mb-4">
              <CircleUserRound className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                ข้อมูลลูกค้า (Customer)
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ชื่อลูกค้า / บริษัท</label>
                  <Input readOnly value={work.customer} className="bg-gray-50 dark:bg-slate-950 dark:border-slate-700 cursor-default" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ที่อยู่ลูกค้า</label>
                  <Input readOnly value={work.address} className="bg-gray-50 dark:bg-slate-950 dark:border-slate-700 cursor-default" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3.1 หัวหน้างาน (Supervisor) + Pagination */}
          <Card className="bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b bg-orange-50/50 dark:bg-orange-900/10 gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <UserCog className="text-orange-600 dark:text-orange-400"/>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                  หัวหน้างาน (Supervisor)
                </h2>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 w-fit">
                {supervisors.length} คน
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[600px] sm:min-w-full">
                  <thead className="bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                    <tr>
                      <th className="px-4 py-3 w-[50px] text-center">#</th>
                      <th className="px-4 py-3 text-left">ชื่อ-นามสกุล</th>
                      <th className="px-4 py-3 text-center">หน้าที่</th>
                      <th className="px-4 py-3 text-center">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y dark:divide-slate-800">
                    {paginatedSupervisors.length > 0 ? (
                      paginatedSupervisors.map((staff, index) => (
                        <tr key={staff.id || index}>
                          <td className="px-4 py-3 text-center text-slate-500">
                            {(supervisorPage - 1) * ITEMS_PER_PAGE + index + 1}
                          </td>
                          <td className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 flex items-center gap-3">
                            <img src={staff.avatar} alt="avatar" className="w-9 h-9 min-w-[2.25rem] rounded-full border bg-white object-cover" />
                            <div className="font-medium">{staff.name}</div>
                          </td>
                          <td className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
                            <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs border border-orange-100 font-medium whitespace-nowrap">
                              {staff.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {renderWorkStatusBadge(staff.workStatus || staff.workstatus || staff.status)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400 italic bg-gray-50 dark:bg-slate-900">
                          ยังไม่มีหัวหน้างาน
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {supervisors.length > 0 && (
                <div className="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-slate-800">
                  <span className="text-xs text-gray-500 mr-2">
                    หน้า {supervisorPage} จาก {totalSupervisorPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSupervisorPage(prev => Math.max(prev - 1, 1))}
                    disabled={supervisorPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSupervisorPage(prev => Math.min(prev + 1, totalSupervisorPages))}
                    disabled={supervisorPage === totalSupervisorPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3.2 ช่าง/พนักงาน (Technicians) + Pagination */}
          <Card className="bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b gap-3 sm:gap-0">
              <div className="flex items-center gap-2">
                <Users className="text-blue-600 dark:text-blue-400" />
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                  ทีมงาน / ช่าง (Technicians)
                </h2>
              </div>

              {currentUserRole !== "EMPLOYEE" && !isInProgress && (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <UserPlus className="w-4 h-4 mr-1" /> เพิ่มช่าง
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[600px] sm:min-w-full">
                  <thead className="bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                    <tr>
                      <th className="px-4 py-3 w-[50px] text-center">#</th>
                      <th className="px-4 py-3 text-left">ชื่อ-นามสกุล</th>
                      <th className="px-4 py-3 text-center">หน้าที่</th>
                      <th className="px-4 py-3 text-center">สถานะ</th>
                      {currentUserRole !== "EMPLOYEE" && !isInProgress && (
                        <th className="px-4 py-3 w-[50px]"></th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y dark:divide-slate-800">
                    {paginatedTechnicians.length > 0 ? (
                      paginatedTechnicians.map((staff, index) => (
                        <tr key={staff.id || index}>
                          <td className="px-4 py-3 text-center text-slate-500">
                            {(technicianPage - 1) * ITEMS_PER_PAGE + index + 1}
                          </td>
                          <td className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 flex items-center gap-3">
                            <img src={staff.avatar} alt="avatar" className="w-9 h-9 min-w-[2.25rem] rounded-full border bg-white object-cover" />
                            <div className="font-medium">{staff.name}</div>
                          </td>
                          <td className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 font-medium whitespace-nowrap">
                              {staff.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {renderWorkStatusBadge(staff.workStatus || staff.workstatus || staff.status)}
                          </td>

                          {currentUserRole !== "EMPLOYEE" && !isInProgress && (
                            <td className="px-4 py-3 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                onClick={() => handleRemoveStaff(staff.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={currentUserRole !== "EMPLOYEE" && !isInProgress ? 5 : 4} className="px-4 py-8 text-center text-gray-400 italic bg-gray-50 dark:bg-slate-900">
                          ยังไม่มีช่างในทีม
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {technicians.length > 0 && (
                <div className="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-slate-800">
                  <span className="text-xs text-gray-500 mr-2">
                    หน้า {technicianPage} จาก {totalTechnicianPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setTechnicianPage(prev => Math.max(prev - 1, 1))}
                    disabled={technicianPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setTechnicianPage(prev => Math.min(prev + 1, totalTechnicianPages))}
                    disabled={technicianPage === totalTechnicianPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. สถานที่ปฏิบัติงาน */}
          <Card className="bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex items-center gap-2 flex-row pb-2 border-b mb-4">
              <MapPinned className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                สถานที่ปฏิบัติงาน (Location)
              </h2>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[400px] w-full rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800 relative shadow-inner">
                {(() => {
                  const hasCoord = work.lat && work.lng;
                  const hasAddress = Boolean(work.address && work.address !== "-");

                  if (!hasCoord && !hasAddress) {
                    return (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                        <MapPin className="w-12 h-12 opacity-30" />
                        <p>ไม่ระบุพิกัดหรือที่อยู่</p>
                      </div>
                    );
                  }

                  const mapSrc = hasCoord
                    ? `https://www.google.com/maps?q=${work.lat},${work.lng}&hl=th&z=15&output=embed`
                    : `https://www.google.com/maps?q=${encodeURIComponent(work.address)}&hl=th&z=15&output=embed`;

                  return (
                    <iframe
                      title="location-map"
                      src={mapSrc}
                      width="100%"
                      height="100%"
                      loading="lazy"
                      style={{ border: 0 }}
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  );
                })()}
              </div>
              {work.lat && work.lng && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm rounded-lg flex flex-col gap-1 border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center justify-start font-semibold gap-2">
                    <MapPinned className="w-5 h-5 text-blue-600" />
                    <span>พิกัด GPS:</span>
                    <span className="font-mono text-blue-700 dark:text-blue-300">{work.lat.toFixed(6)}, {work.lng.toFixed(6)}</span>
                  </div>
                  {work.locationName && (
                    <div className="pl-7 text-xs text-slate-600 dark:text-slate-400 mt-1">
                      <span className="font-semibold">สถานที่:</span> {work.locationName}
                    </div>
                  )}
                  {work.address && (
                    <div className="pl-7 text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold">ที่อยู่:</span> {work.address}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 5. หมายเหตุ */}
          {work.note && (
            <Card className="bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm border-l-4 border-l-amber-400">
              <CardHeader className="flex items-center gap-2 flex-row pb-2">
                <NotebookPen className="text-amber-500" />
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                  หมายเหตุเพิ่มเติม
                </h2>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 rounded-md text-sm leading-relaxed border border-amber-100 dark:border-amber-900">
                  {work.note}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 6. เบิกอุปกรณ์ (Equipment Requisition) */}
          <Card className="bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm border-l-4 border-l-green-400">
            <CardHeader className="flex flex-row items-center justify-between  border-b pt-3 px-6">
              <div className="flex items-center gap-2">
                <Package className="text-green-500" />
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                  เบิกอุปกรณ์ (Equipment Requisition)
                </h2>
              </div>

              {!isCompleted && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={handleConfirmRequisition}
                    disabled={isSaving || selectedEquipments.length === 0}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-1" />
                    )}
                    ยืนยันการเบิก
                  </Button>

                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setIsEquipmentModalOpen(true)}
                  >
                    <PackagePlus className="w-4 h-4 mr-1" />
                    เพิ่มอุปกรณ์
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[800px]">
                  <thead className="bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                    <tr>
                      <th className="px-4 py-3 w-[50px] text-center">#</th>
                      <th className="px-4 py-3">รหัสอะไหล่</th>
                      <th className="px-4 py-3">ชื่ออะไหล่</th>
                      <th className="px-4 py-3 text-center">ประเภท</th>
                      <th className="px-4 py-3 text-center">หน่วยนับ</th>
                      <th className="px-4 py-3 text-center text-blue-600">คงเหลือ</th>
                      <th className="px-4 py-3 text-center w-[120px]">จำนวนที่เบิก</th>
                      <th className="px-4 py-3 text-center w-[200px]">หมายเหตุ</th>
                      {!isCompleted && <th className="px-4 py-3 w-[50px]"></th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y dark:divide-slate-800">
                    {selectedEquipments.length > 0 ? (
                      selectedEquipments.map((item, index) => (
                        <tr key={item.uid || index}>
                          <td className="px-4 py-3 text-center text-slate-500">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                            {item.code}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline" className={`font-normal text-xs whitespace-nowrap ${String(item.type).includes('อุปกรณ์') ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-orange-200 text-orange-700 bg-orange-50'}`}>
                              {item.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                            {item.unit}
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-blue-600 dark:text-blue-400">
                            {item.qtyOnHand ?? item.stockQty ?? 0}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Input
                              type="number"
                              min="1"
                              max={item.stockQty}
                              value={item.requestQty ?? ""}
                              onChange={(e) => handleEquipmentQtyChange(item.uid, e.target.value)}
                              className="h-8 w-20 text-center mx-auto"
                              disabled={isCompleted || item.locked}
                            />
                          </td>

                          {/* New: remark input */}
                          <td className="px-4 py-3">
                            <Input
                              type="text"
                              value={item.remark || ""}
                              placeholder={item.locked ? "แก้ไขไม่ได้ (เบิกแล้ว)" : "เหตุผลการเบิก..."}
                              onChange={(e) => handleEquipmentRemarkChange(item.uid, e.target.value)}
                              className="h-8 text-sm"
                              disabled={isCompleted || item.locked}
                            />
                          </td>

                          {!isCompleted && (
                            <td className="px-4 py-3 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 ${item.locked ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => !item.locked && handleRemoveEquipment(item.uid)}
                                disabled={item.locked}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        {/* header currently renders 8 columns (without delete column) or 9 (with delete) */}
                        <td colSpan={isCompleted ? 8 : 9} className="px-4 py-8 text-center text-gray-400 italic bg-gray-50 dark:bg-slate-900">
                          ยังไม่มีรายการเบิกอุปกรณ์
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>

      {/* ⭐ 6. Action Bar (Footer) */}
      {currentUserRole === "SUPERVISOR" && (
        <footer className="flex-none bg-white dark:bg-slate-900 border-t px-4 py-4 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isSaving}
              className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700 w-full sm:w-auto min-w-[100px]"
            >
              <X className="w-4 h-4 mr-2" /> ยกเลิก
            </Button>

            {!isInProgress && (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto min-w-[100px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> บันทึก
                  </>
                )}
              </Button>
            )}
          </div>
        </footer>
      )}

      {/* --- Modals --- */}
      <AddTechnicianModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddStaff}
        existingIds={currentStaff.map(s => s.id)}
      />

      <AddEquipmentModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        onConfirm={handleAddEquipment}
        existingIds={selectedEquipments.filter(i => i.source === 'new').map(i => i.itemId)} // prevent duplicates among newly added items only
      />

    </div>
  );
}