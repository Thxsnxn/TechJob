"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic"; 

// --- Theme Imports ---
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
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
  Save,
  RotateCcw,
  Search,
  Check,
  UserPlus,
  Trash2,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";

// --- Dynamic Map ---
const SmartMapProFinal = dynamic(() => import("./SmartMapUltimate"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center text-slate-400">
      <Loader2 className="h-8 w-8 animate-spin mr-2" />
      Loading Map...
    </div>
  ),
});

// --- 🟡 MOCK DATA (สำรอง) ---
const mockEmployees = [
  { id: "67112761", name: "Thastanon Kaisomsat", position: "Fireguard", role: "Engineer" },
  { id: "67112762", name: "Somchai Khemkhaeng", position: "Lead Engineer", role: "Lead" },
];

// --- 🌗 Theme Toggle ---
function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:text-blue-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

// --- 🔵 Customer Search Modal ---
function CustomerSearchModal({ isOpen, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("ALL");
  const [selectedId, setSelectedId] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async (override = {}) => {
    try {
      setLoading(true);
      setSelectedId(null);
      const effectiveSearch = override.search !== undefined ? override.search : searchTerm;
      const effectiveType = override.type !== undefined ? override.type : searchType;
      const apiType = effectiveType === "ALL" ? "" : effectiveType;

      const response = await apiClient.post("/filter-users", {
        search: effectiveSearch || "",
        type: apiType,
        page: 1,
        pageSize: 50,
      });
      const items = response.data?.items || [];
      const normalized = items.map((u) => ({
        id: u.id,
        code: u.code || "-",
        name: u.type === "COMPANY" ? u.companyName : `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        type: u.type === "COMPANY" ? "organization" : "person",
        contact: u.phone || "-",
        address: u.address || "-",
      }));
      setUsers(normalized);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("ไม่สามารถดึงข้อมูลลูกค้าได้");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSearchType("ALL");
      setSelectedId(null);
      fetchCustomers({ search: "", type: "ALL" });
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (selectedId) {
      const customer = users.find((c) => c.id === selectedId);
      if (customer) {
        onSelect(customer);
        onClose();
      }
    } else {
      toast.error("กรุณาเลือกรายชื่อลูกค้าก่อน");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="z-[2000] sm:max-w-[1000px] w-[95vw] p-0 overflow-hidden gap-0 bg-white dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-slate-100">
        <DialogHeader className="bg-blue-600 text-white px-6 py-4 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-lg font-bold">เลือกลูกค้า (Select Customer)</DialogTitle>
        </DialogHeader>
        <div className="p-4 bg-gray-50 border-b dark:bg-slate-800 dark:border-slate-700">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="ค้นหา รหัส/ชื่อลูกค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") fetchCustomers({ search: e.currentTarget.value }); }}
                disabled={loading}
                className="pl-10 bg-white dark:bg-slate-950 dark:border-slate-600 dark:text-white"
              />
              {loading ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-blue-600" /> : <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
            </div>
            <select
              value={searchType}
              onChange={(e) => { setSearchType(e.target.value); fetchCustomers({ type: e.target.value }); }}
              disabled={loading}
              className="h-10 px-3 rounded-md border border-input bg-white text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-slate-950 dark:border-slate-600 dark:text-white"
            >
              <option value="ALL">ทั้งหมด</option>
              <option value="PERSON">บุคคล</option>
              <option value="COMPANY">บริษัท</option>
            </select>
            <Button onClick={() => fetchCustomers()} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">ค้นหา</Button>
          </div>
        </div>
        <div className="h-[400px] overflow-y-auto bg-white dark:bg-slate-900">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="px-6 py-3 w-[50px] text-center">#</th>
                <th className="px-6 py-3 w-[50px]">เลือก</th>
                <th className="px-6 py-3">รหัสลูกค้า</th>
                <th className="px-6 py-3">ชื่อลูกค้า</th>
                <th className="px-6 py-3 w-[150px] text-center">ประเภท</th>
                <th className="px-6 py-3">เบอร์โทร</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {loading ? (
                 <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-slate-400"><div className="flex flex-col items-center justify-center gap-2"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /><span>กำลังโหลดข้อมูล...</span></div></td></tr>
              ) : users.length > 0 ? (
                users.map((customer, index) => (
                  <tr key={customer.id} className={`border-b hover:bg-blue-50 cursor-pointer transition-colors dark:border-slate-700 dark:hover:bg-slate-800 ${selectedId === customer.id ? "bg-blue-50 dark:bg-blue-900/30" : "bg-white dark:bg-slate-900"}`} onClick={() => setSelectedId(customer.id)}>
                    <td className="px-6 py-4 text-center text-gray-500 dark:text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4 text-center"><div className={`w-4 h-4 rounded-full border flex items-center justify-center mx-auto ${selectedId === customer.id ? "border-blue-600 dark:border-blue-500" : "border-gray-300 dark:border-slate-500"}`}>{selectedId === customer.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500" />}</div></td>
                    <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">{customer.code}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{customer.name}</td>
                    <td className="px-6 py-4 text-center"><span className={`px-2 py-1 rounded-md text-xs font-medium border ${customer.type === 'organization' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800' : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800'}`}>{customer.type === 'organization' ? 'บริษัท' : 'บุคคล'}</span></td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{customer.contact}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-slate-500">ไม่พบข้อมูลลูกค้า</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <DialogFooter className="p-4 border-t bg-gray-50 sm:justify-between items-center dark:bg-slate-800 dark:border-slate-700">
          <div className="text-sm text-gray-500 hidden sm:block dark:text-slate-400">{loading ? "กำลังค้นหา..." : `พบข้อมูล ${users.length} รายการ`}</div>
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button variant="outline" onClick={onClose} className="bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600">ยกเลิก</Button>
            <Button onClick={handleConfirm} disabled={loading || !selectedId} className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"><Check className="w-4 h-4 mr-2" /> ยืนยัน</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- 🟣 COMPONENT: Employee Selection Modal (API Connected) ---
function EmployeeSelectionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  initialSelected = [], 
  roleFilter = "" // รับค่า Role: "SUPERVISOR", "EMPLOYEE", "ADMIN" หรือ ""
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]); 
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 ฟังก์ชันดึงข้อมูลพนักงานจาก API
  const fetchEmployees = async (searchOverride = null) => {
    try {
      setLoading(true);
      const response = await apiClient.post("/filter-employees", {
        search: searchOverride !== null ? searchOverride : searchTerm,
        role: roleFilter, // ส่ง Role ไปกรองที่ API
        page: 1,
        pageSize: 50,
      });

      const items = response.data?.items || [];

      const normalized = items.map((emp) => ({
        id: emp.id,
        code: emp.code || "-",
        name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
        position: emp.position || "-",
        role: emp.role || "-",
      }));

      setEmployees(normalized);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("ไม่สามารถดึงข้อมูลพนักงานได้");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลเมื่อ Modal เปิด
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedIds(initialSelected.map(e => e.id));
      fetchEmployees("");
    }
  }, [isOpen, roleFilter]); // โหลดใหม่เมื่อ roleFilter เปลี่ยน

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    // หา Object ของพนักงานจาก IDs ที่เลือก (จากที่โหลดมา)
    const selectedEmployees = employees.filter(e => selectedIds.includes(e.id));
    
    // รวมกับของเก่าที่อาจจะไม่ได้อยู่ในหน้าค้นหาปัจจุบัน
    const initialSelectedStillActive = initialSelected.filter(e => selectedIds.includes(e.id));
    
    const combined = [...selectedEmployees, ...initialSelectedStillActive];
    // ตัดตัวซ้ำ
    const uniqueSelected = Array.from(new Map(combined.map(item => [item.id, item])).values());

    onConfirm(uniqueSelected);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="z-[2000] sm:max-w-[1000px] w-[95vw] max-w-3xl p-0 overflow-hidden gap-0 bg-white dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-slate-100">
        <DialogHeader className="bg-blue-600 text-white px-6 py-4">
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
        </DialogHeader>
        
        {/* Search Box */}
        <div className="p-4 bg-gray-50 border-b dark:bg-slate-800 dark:border-slate-700">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="ค้นหา ชื่อ, รหัสพนักงาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchEmployees(e.currentTarget.value);
                }}
                disabled={loading}
                className="pl-10 bg-white dark:bg-slate-950 dark:border-slate-600 dark:text-white"
              />
              {loading ? (
                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-blue-600" />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              )}
            </div>
            <Button onClick={() => fetchEmployees()} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              ค้นหา
            </Button>
          </div>
        </div>

        {/* Table List */}
        <div className="h-[400px] overflow-y-auto bg-white dark:bg-slate-900">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="px-6 py-3 w-[50px] text-center">เลือก</th>
                <th className="px-6 py-3">รหัสพนักงาน</th>
                <th className="px-6 py-3">ชื่อ-นามสกุล</th>
                <th className="px-6 py-3">ตำแหน่ง</th>
                <th className="px-6 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                   <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-slate-400">
                     <div className="flex flex-col items-center justify-center gap-2">
                       <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                       <span>กำลังโหลดข้อมูล...</span>
                     </div>
                   </td>
                 </tr>
              ) : employees.length > 0 ? (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className={`border-b hover:bg-blue-50 cursor-pointer transition-colors dark:border-slate-700 dark:hover:bg-slate-800 ${
                      selectedIds.includes(emp.id) ? "bg-blue-50 dark:bg-blue-900/30" : "bg-white dark:bg-slate-900"
                    }`}
                    onClick={() => toggleSelection(emp.id)}
                  >
                    <td className="px-6 py-4 text-center">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center mx-auto ${selectedIds.includes(emp.id) ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"}`}>
                         {selectedIds.includes(emp.id) && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">{emp.code}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{emp.name}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{emp.position}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">{emp.role}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-slate-500">ไม่พบข้อมูลพนักงาน ({roleFilter || "ทั้งหมด"})</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <DialogFooter className="p-4 border-t bg-gray-50 sm:justify-between items-center dark:bg-slate-800 dark:border-slate-700">
           <div className="text-sm text-gray-500 hidden sm:block dark:text-slate-400">เลือกแล้ว {selectedIds.length} รายการ</div>
           <div className="flex gap-2 justify-end w-full sm:w-auto">
             <Button variant="outline" onClick={onClose} className="bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 hover:dark:bg-slate-600">ยกเลิก</Button>
             <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white"><Save className="w-4 h-4 mr-2" /> บันทึกการเลือก</Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- 🔴 CONTENT COMPONENT (Main Logic) ---
function JobPageContent() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    searchCustomer: "",
    customerName: "",
    contactNumber: "",
    address: "",
    notes: "",
  });

  const [markers, setMarkers] = useState([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [assignedEngineers, setAssignedEngineers] = useState([]);
  
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [engineerSearchQuery, setEngineerSearchQuery] = useState("");

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isEngineerModalOpen, setIsEngineerModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerSelect = (customer) => {
    setForm((prev) => ({
      ...prev,
      searchCustomer: customer.code,
      customerName: customer.name,
      contactNumber: customer.contact,
      address: customer.address,
    }));
    toast.success(`เลือก: ${customer.name}`);
  };

  const handleConfirmLeads = (selected) => {
      setAssignedLeads(selected);
      toast.success(`อัปเดต Leads: ${selected.length} คน`);
  };
  const removeLead = (id) => {
      setAssignedLeads(prev => prev.filter(l => l.id !== id));
  };

  const handleConfirmEngineers = (selected) => {
      setAssignedEngineers(selected);
      toast.success(`อัปเดต Engineers: ${selected.length} คน`);
  };
  const removeEngineer = (id) => {
      setAssignedEngineers(prev => prev.filter(e => e.id !== id));
  };

  useEffect(() => {
    const savedForm = localStorage.getItem("jobForm");
    if (savedForm) setForm(JSON.parse(savedForm));
    const savedMarkers = localStorage.getItem("jobMarkers");
    if (savedMarkers) setMarkers(JSON.parse(savedMarkers));
  }, []);

  useEffect(() => {
    localStorage.setItem("jobForm", JSON.stringify(form));
    localStorage.setItem("jobMarkers", JSON.stringify(markers));
  }, [form, markers]);

  const validateForm = () => {
    if (!form.title.trim()) return toast.error("⚠️ กรุณากรอกชื่อใบงาน") || false;
    if (!form.description.trim()) return toast.error("⚠️ กรุณากรอกรายละเอียดงาน") || false;
    if (!form.customerName.trim()) return toast.error("⚠️ กรุณากรอกชื่อลูกค้า") || false;
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const existingJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const newJob = {
      id: `#J${String(existingJobs.length + 1).padStart(3, "0")}`,
      ...form,
      markers,
      assignedLeads,   
      assignedEngineers,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("jobs", JSON.stringify([...existingJobs, newJob]));
    toast.success("✅ บันทึกใบงานเรียบร้อยแล้ว!");
    router.push("/jobmanagement");
  };

  const handleReset = () => {
    if (confirm("ต้องการล้างข้อมูลทั้งหมดหรือไม่?")) {
      setForm({ title: "", description: "", searchCustomer: "", customerName: "", contactNumber: "", address: "", notes: "" });
      setMarkers([]);
      setAssignedLeads([]);
      setAssignedEngineers([]);
      setLeadSearchQuery("");
      setEngineerSearchQuery("");
      localStorage.removeItem("jobForm");
      localStorage.removeItem("jobMarkers");
      toast.error("🧹 เคลียร์ข้อมูลแล้ว!");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200 relative">
      
      {/* ส่วนหัวและปุ่มเปลี่ยนธีม */}
      <div className="relative">
        <SiteHeader title="Create New Job" />
      </div>

      {/* Modals */}
      <CustomerSearchModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSelect={handleCustomerSelect}
      />

      {/* 🔥 Modal เลือก Assigned Lead: ส่ง roleFilter="SUPERVISOR" */}
      <EmployeeSelectionModal 
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onConfirm={handleConfirmLeads}
        title="เลือก Assigned Lead (Supervisor)"
        initialSelected={assignedLeads}
        roleFilter="SUPERVISOR" 
      />

      {/* 🔥 Modal เลือก Engineers: ส่ง roleFilter="EMPLOYEE" */}
      <EmployeeSelectionModal 
        isOpen={isEngineerModalOpen}
        onClose={() => setIsEngineerModalOpen(false)}
        onConfirm={handleConfirmEngineers}
        title="เลือก Engineers (Employee)"
        initialSelected={assignedEngineers}
        roleFilter="EMPLOYEE"
      />

      <div className="p-6 space-y-6">
        {/* 1. JOB INFO */}
        <Card className="bg-white dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex items-center gap-2 flex-row">
            <NotebookText className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Job Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="title"
              placeholder="Job title..."
              value={form.title}
              onChange={handleChange}
              className="bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-white"
            />
            <Textarea
              name="description"
              placeholder="Job description..."
              value={form.description}
              onChange={handleChange}
              className="bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-white"
            />
          </CardContent>
        </Card>

        {/* 2. CUSTOMER INFO */}
        <Card className="bg-white dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex items-center gap-2 flex-row">
            <CircleUserRound className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Customer Information</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Customer</label>
              <div className="relative">
                <Input
                  name="searchCustomer"
                  placeholder="Click search icon to select customer..."
                  value={form.searchCustomer}
                  onChange={handleChange}
                  readOnly
                  className="pr-10 bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-white cursor-pointer"
                  onClick={() => setIsCustomerModalOpen(true)}
                />
                <div
                  className="absolute right-0 top-0 h-full px-3 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-r-md border-l transition-colors dark:border-slate-700 dark:hover:bg-slate-800"
                  onClick={() => setIsCustomerModalOpen(true)}
                >
                  <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Customer Name</label>
                <Input
                  name="customerName"
                  placeholder="Auto filled..."
                  value={form.customerName}
                  onChange={handleChange}
                  className="bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact Number</label>
                <Input
                  name="contactNumber"
                  placeholder="Auto filled..."
                  value={form.contactNumber}
                  onChange={handleChange}
                  className="bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                <Input
                  name="address"
                  placeholder="Auto filled..."
                  value={form.address}
                  onChange={handleChange}
                  className="bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- 3. JOB OWNERSHIP & ASSIGNMENT --- */}
        <Card className="bg-white dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="flex items-center gap-2 flex-row">
                <UserPlus className="text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Job Ownership & Assignment</h2>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* Section: Assigned Lead */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Assigned Lead</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Input 
                                placeholder="Search for existing Assigned Lead..." 
                                value={leadSearchQuery}
                                onChange={(e) => setLeadSearchQuery(e.target.value)}
                                className="pl-10 bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-white" 
                            />
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        <Button 
                            className="bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                            onClick={() => setIsLeadModalOpen(true)}
                        >
                            + Add Lead
                        </Button>
                    </div>
                    
                    {/* Table Display for Leads */}
                    <div className="border rounded-md overflow-hidden dark:border-slate-700 mt-2">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                                <tr>
                                    <th className="px-4 py-3 w-[60px]">No</th>
                                    <th className="px-4 py-3">Id</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Position</th>
                                    <th className="px-4 py-3 w-[60px]"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-950 divide-y dark:divide-slate-800">
                                {assignedLeads
                                  .filter(lead => 
                                    lead.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) || 
                                    lead.id.includes(leadSearchQuery)
                                  )
                                  .map((lead, index) => (
                                    <tr key={lead.id}>
                                        <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{lead.id}</td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{lead.name}</td>
                                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{lead.position}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Button 
                                                size="icon" 
                                                variant="destructive" 
                                                className="h-8 w-8 bg-red-500 hover:bg-red-600"
                                                onClick={() => removeLead(lead.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {assignedLeads.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-6 text-center text-gray-400 italic bg-gray-50 dark:bg-slate-900">
                                            No Assigned Lead
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <hr className="border-gray-100 dark:border-slate-800"/>

                {/* <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Assign Engineer(s)</label>
                    <div className="flex gap-2">
                         <div className="relative flex-1">
                            <Input 
                                placeholder="Search for existing Assign Engineer(s)..." 
                                value={engineerSearchQuery}
                                onChange={(e) => setEngineerSearchQuery(e.target.value)}
                                className="pl-10 bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-white" 
                            />
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        <Button 
                            className="bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                            onClick={() => setIsEngineerModalOpen(true)}
                        >
                            + Add Engineer
                        </Button>
                    </div> */}

                      {/* <div className="border rounded-md overflow-hidden dark:border-slate-700 mt-2">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                                <tr>
                                    <th className="px-4 py-3 w-[60px]">No</th>
                                    <th className="px-4 py-3">Id</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Position</th>
                                    <th className="px-4 py-3 w-[60px]"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-950 divide-y dark:divide-slate-800">
                                {assignedEngineers
                                    .filter(eng => 
                                      eng.name.toLowerCase().includes(engineerSearchQuery.toLowerCase()) || 
                                      eng.id.includes(engineerSearchQuery)
                                    )
                                    .map((eng, index) => (
                                    <tr key={eng.id}>
                                        <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{eng.id}</td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{eng.name}</td>
                                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{eng.position}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Button 
                                                size="icon" 
                                                variant="destructive" 
                                                className="h-8 w-8 bg-red-500 hover:bg-red-600"
                                                onClick={() => removeEngineer(eng.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {assignedEngineers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-6 text-center text-gray-400 italic bg-gray-50 dark:bg-slate-900">
                                            No Engineers Assigned
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div> */}

            </CardContent>
        </Card>

        {/* 4. LOCATION & NOTES */}
        <Card className="bg-white dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex items-center gap-2 flex-row">
            <MapPinned className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Worksite Location</h2>
          </CardHeader>
          <CardContent>
            <SmartMapProFinal onChange={setMarkers} />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex items-center gap-2 flex-row">
            <NotebookPen className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notes</h2>
          </CardHeader>
          <CardContent>
            <Textarea
              name="notes"
              placeholder="Additional notes..."
              value={form.notes}
              onChange={handleChange}
              className="bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-white"
            />
          </CardContent>
        </Card>

        {/* BUTTONS */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset} className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500">
            <Save className="mr-2 h-4 w-4" /> Save Job
          </Button>
        </div>
      </div>
    </main>
  );
}

// --- 🟡 Main Export (Wrapper for ThemeProvider) ---
export default function CreateJobPage() {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <JobPageContent />
    </NextThemesProvider>
  );
}