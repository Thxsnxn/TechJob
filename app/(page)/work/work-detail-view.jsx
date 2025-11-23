"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner"; 

// --- API Client ---
import apiClient from "@/lib/apiClient";

// --- Icons ---
import {
  CircleUserRound,
  NotebookPen,
  NotebookText,
  MapPinned,
  CalendarClock,
  UserPlus,
  ArrowLeft,
  MapPin,
  Search,
  Check,
  Loader2,
  Trash2, 
  UserCog, 
  Users,
  Save,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// ==========================================
// 🛠️ Helper: Render Status Badge
// ==========================================
const renderWorkStatusBadge = (status) => {
  const rawStatus = status || "FREE"; 

  if (rawStatus === 'BUSY') {
    return (
      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 font-normal hover:bg-orange-50 whitespace-nowrap">
        กำลังทำงาน
      </Badge>
    );
  } else if (rawStatus === 'FREE') {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-normal hover:bg-green-50 whitespace-nowrap">
        ว่าง
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 font-normal whitespace-nowrap">
      {rawStatus}
    </Badge>
  );
};

// ==========================================
// 🛠️ Component: Modal ค้นหาและเพิ่มช่าง (Employee Only)
// ==========================================
function AddTechnicianModal({ isOpen, onClose, onConfirm, existingIds = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const payload = {
        search: searchTerm,
        role: "EMPLOYEE", 
        page: 1,
        pageSize: 50,
      };
      const res = await apiClient.post("/filter-employees", payload);
      const items = res.data?.items || res.data?.data || res.data?.rows || [];
      setEmployees(items);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      toast.error("ไม่สามารถค้นหาข้อมูลพนักงานได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedIds([]);
      fetchEmployees();
    }
  }, [isOpen]);

  const toggleSelection = (emp) => {
    if (existingIds.includes(emp.id)) return;
    setSelectedIds((prev) => {
      if (prev.includes(emp.id)) {
        return prev.filter((id) => id !== emp.id);
      } else {
        return [...prev, emp.id];
      }
    });
  };

  const handleConfirm = () => {
    const selectedEmployees = employees.filter((emp) => selectedIds.includes(emp.id));
    const normalizedEmployees = selectedEmployees.map(emp => ({
      id: emp.id,
      name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.username,
      role: emp.role || "EMPLOYEE",
      avatar: emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.firstName || "U")}&background=random`,
      position: emp.position || "-",
      workStatus: emp.workStatus || emp.workstatus || "FREE" 
    }));
    onConfirm(normalizedEmployees);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 z-[1050]">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b bg-gray-50 dark:bg-slate-950">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <UserPlus className="w-5 h-5 text-blue-600" />
            เพิ่มช่างเข้าปฏิบัติงาน (Add Technician)
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
                        className={`
                          transition-colors border-b dark:border-slate-800
                          ${isDisabled 
                            ? "bg-gray-100 dark:bg-slate-800 opacity-60 cursor-not-allowed" 
                            : "hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer" 
                          }
                          ${isSelected ? "bg-blue-50 dark:bg-blue-900/30" : ""}
                        `}
                        onClick={() => !isDisabled && toggleSelection(emp)}
                      >
                        <td className="px-4 py-3 text-center">
                           {!isDisabled && (
                             <div className={`w-5 h-5 rounded border mx-auto flex items-center justify-center transition-all ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"}`}>
                               {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                             </div>
                           )}
                           {isAlreadyAdded && <Check className="w-4 h-4 text-green-500 mx-auto" />}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 min-w-[2.25rem] rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs overflow-hidden border">
                               {emp.avatarUrl ? (
                                 <img src={emp.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                               ) : (
                                 (emp.firstName?.[0] || "U") + (emp.lastName?.[0] || "")
                               )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1">
                                {emp.firstName} {emp.lastName} 
                              </div>
                              <div className="text-xs text-gray-500 flex flex-col xl:flex-row xl:gap-2">
                                  <span className="text-blue-600 font-mono">{emp.code || "-"}</span>
                                  <span className="hidden xl:inline text-gray-300">|</span>
                                  <span className="truncate max-w-[200px]">{emp.email}</span>
                              </div>
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
             <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">ยกเลิก</Button>
             <Button onClick={handleConfirm} disabled={selectedIds.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none">
               เพิ่มลงในรายการ
             </Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// 📄 Main Page: WorkDetailView (Full Page)
// ==========================================
export function WorkDetailView({ work, onBack }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState([]);
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
    setCurrentStaff((prev) => [...prev, ...newStaff]);
    toast.success(`เพิ่มช่างลงในรายการแล้ว ${newStaff.length} คน (กดบันทึกเพื่อยืนยัน)`);
  };

  const handleRemoveStaff = (staffId) => {
    setCurrentStaff((prev) => prev.filter(s => s.id !== staffId));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const technicianIds = currentStaff
        .filter(staff => staff.role !== 'SUPERVISOR' && staff.role !== 'หัวหน้างาน')
        .map(staff => staff.id);

      const payload = {
        employeeIds: technicianIds
      };

      await apiClient.post(`/work-orders/${work.id}/assign-employees`, payload);

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

  // 🔥 คำนวณ Total Page ขั้นต่ำเป็น 1 เสมอ (เพื่อให้โชว์ 1/1)
  const totalSupervisorPages = Math.max(1, Math.ceil(supervisors.length / ITEMS_PER_PAGE));
  const paginatedSupervisors = supervisors.slice(
    (supervisorPage - 1) * ITEMS_PER_PAGE,
    supervisorPage * ITEMS_PER_PAGE
  );

  // 🔥 คำนวณ Total Page ขั้นต่ำเป็น 1 เสมอ
  const totalTechnicianPages = Math.max(1, Math.ceil(technicians.length / ITEMS_PER_PAGE));
  const paginatedTechnicians = technicians.slice(
    (technicianPage - 1) * ITEMS_PER_PAGE,
    technicianPage * ITEMS_PER_PAGE
  );

  if (!work) return null;

  const isInProgress = work?.status?.toUpperCase()?.replace(" ", "_") === "IN_PROGRESS";

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
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b mb-4 bg-orange-50/50 dark:bg-orange-900/10 gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <UserCog className="text-orange-600 dark:text-orange-400" />
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                    หัวหน้างาน (Supervisor)
                </h2>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 w-fit">
                 {supervisors.length} คน
              </Badge>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
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
              
              {/* ✅ 🔥 Pagination Controls for Supervisor (แสดงตลอดถ้ามีข้อมูล > 0) */}
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
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b mb-4 gap-3 sm:gap-0">
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
            <CardContent className="p-0 sm:p-6">
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
              
              {/* ✅ 🔥 Pagination Controls for Technicians (แสดงตลอดถ้ามีข้อมูล > 0) */}
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

          {/* ... (Card 4, 5 เหมือนเดิม) ... */}
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

    </div>
  );
}