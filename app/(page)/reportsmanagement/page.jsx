"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // ยังคง import ไว้เผื่อใช้จุดอื่น
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select มาใช้ทำตัวกรอง
import { 
  Users, 
  UserCog, 
  UserCheck, 
  FileText, 
  Clock, 
  Search, 
  Filter,
  AlertCircle,
  CheckCircle2,
  LayoutDashboard,
  ChevronRight,
  XCircle
} from "lucide-react";
import { ReportDetailModal } from "./ReportDetailModal";
import { SiteHeader } from "@/components/site-header";

// --- ข้อมูล Mockup (Theme Inventory) ---
const mockReports = [
  {
    id: "R-2025-001",
    title: "แจ้งปัญหา: ระบบเบิกสินค้าโหลดช้ามาก",
    details: "เมื่อเข้าหน้า 'รายการเบิกของฉัน' ระบบหมุนติ้วๆ นานกว่า 20 วินาทีกว่าจะขึ้นข้อมูล ลองเปลี่ยน Browser แล้วก็ยังเป็นเหมือนเดิมครับ",
    submittedBy: "นายสมชาย ใจดี",
    date: "เมื่อวานนี้",
    role: "Employee",
    status: "pending",
  },
  {
    id: "R-2025-002",
    title: "ร้องเรียน: อะไหล่ 'ตลับลูกปืน 6205-2Z' หมดสต็อกบ่อย",
    details: "ช่วงนี้ตลับลูกปืนเบอร์นี้ขาดสต็อกบ่อยมาก ทำให้งานซ่อมเครื่องจักรต้องหยุดชะงัก อยากให้พิจารณาเพิ่ม Min/Max Stock ครับ",
    submittedBy: "นายวิศิษฐ์ ช่างซ่อม",
    date: "2 ชั่วโมงที่แล้ว",
    role: "Lead Engineer",
    status: "investigating",
  },
  {
    id: "R-2025-003",
    title: "ขออนุมัติ: เพิ่มหมวดหมู่ 'อุปกรณ์เซฟตี้' ในระบบ",
    details: "เนื่องจากมีนโยบายความปลอดภัยใหม่ ต้องการให้เพิ่มหมวดหมู่และรายการสินค้าประเภท PPE (หมวก, รองเท้า, ถุงมือ) เข้าใน Master Stock เพื่อให้เบิกจ่ายได้",
    submittedBy: "จป. วิชาชีพ",
    date: "3 วันที่แล้ว",
    role: "CEO",
    status: "reviewed",
  },
  {
    id: "R-2025-004",
    title: "แจ้งซ่อม: เครื่องสแกน Barcode ที่คลังสินค้าพัง",
    details: "เครื่องสแกน Barcode ตัวที่ 2 ยิงไม่ติดแสงไม่ออก ลองเปลี่ยนถ่านแล้วไม่หาย รบกวนฝ่ายไอทีเข้ามาดูหน่อยครับ เบิกของลำบากมาก",
    submittedBy: "น.ส. จินตนา คลังสินค้า",
    date: "1 ชั่วโมงที่แล้ว",
    role: "Employee",
    status: "resolved",
  },
  {
    id: "R-2025-005",
    title: "สอบถาม: ใบเบิก WO-2025-11-004 หายไปจากระบบ",
    details: "ผมกดเบิกไปเมื่อวานตอนเย็น สถานะขึ้นรออนุมัติ แต่วันนี้มาดูในรายการไม่เจอแล้ว ไม่แน่ใจว่าถูกลบ หรือระบบมีปัญหาครับ ช่วยเช็คให้หน่อย",
    submittedBy: "ช่างกล โรงงาน 2",
    date: "30 นาทีที่แล้ว",
    role: "Lead Engineer",
    status: "pending",
  },
];

// Helper: Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    investigating: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    reviewed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  };

  const labels = {
    pending: "รอตรวจสอบ",
    investigating: "กำลังตรวจสอบ",
    resolved: "แก้ไขแล้ว",
    reviewed: "รับทราบแล้ว",
  };

  return (
    <Badge variant="outline" className={`${styles[status] || styles.pending} border px-3 py-1 text-xs font-medium`}>
      {labels[status] || "Unknown"}
    </Badge>
  );
};

export function ReportManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // --- Filter States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // State สำหรับเก็บค่าตัวกรองสถานะ

  // --- Search & Filter Logic ---
  const getFilteredReports = (role) => {
    return mockReports.filter((report) => {
      // 1. กรองตาม Role (Tabs)
      const matchesRole = report.role === role;
      
      // 2. กรองตามคำค้นหา (Search)
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        report.title.toLowerCase().includes(query) ||
        report.id.toLowerCase().includes(query) ||
        report.submittedBy.toLowerCase().includes(query) ||
        report.details.toLowerCase().includes(query);

      // 3. กรองตามสถานะ (Filter) -> เพิ่มใหม่
      const matchesStatus = statusFilter === "all" || report.status === statusFilter;

      return matchesRole && matchesSearch && matchesStatus;
    });
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  // --- Scaled Up Report Item ---
  const ReportItem = ({ report }) => (
    <div
      className="group flex items-center p-6 rounded-xl hover:bg-accent/50 border border-transparent hover:border-border cursor-pointer transition-all duration-200 shadow-sm bg-card mb-3"
      onClick={() => handleReportClick(report)}
    >
      {/* Icon (Larger) */}
      <div className="flex-shrink-0 mr-6 p-4 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <FileText className="w-8 h-8" />
      </div>

      {/* Main Text */}
      <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Title & ID */}
        <div className="lg:col-span-5">
            <h4 className="text-lg font-bold text-foreground truncate pr-4 group-hover:text-primary transition-colors">
                {report.title}
            </h4>
            <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                 <span className="font-medium text-foreground/80">{report.submittedBy}</span>
                 <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                 <span className="truncate max-w-[200px] font-mono bg-muted px-1.5 rounded text-xs">ID: {report.id}</span>
            </div>
        </div>
        
        {/* Details Preview */}
        <div className="hidden lg:col-span-4 lg:block">
            <p className="text-base text-muted-foreground truncate w-full">
                {report.details}
            </p>
        </div>

        {/* Status & Date */}
        <div className="lg:col-span-3 flex items-center justify-end gap-6">
            <StatusBadge status={report.status} />
            <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap">
                <Clock className="w-4 h-4 mr-2" />
                {report.date}
            </div>
            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                <ChevronRight className="w-6 h-6 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background/50">
      <SiteHeader title="Report Management" />
      
      {/* Scaled Container Width */}
      <div className="container mx-auto max-w-[95%] 2xl:max-w-[1600px] px-6 py-10 space-y-10">
        
        {/* 1. Dashboard Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="shadow-sm border bg-card hover:shadow-md transition-all">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-base font-medium text-muted-foreground">รายงานทั้งหมด</CardTitle>
               <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                 <LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
               </div>
             </CardHeader>
             <CardContent>
               <div className="text-4xl font-bold text-foreground">{mockReports.length}</div>
               <p className="text-sm text-muted-foreground mt-1">+1 จากเมื่อวาน</p>
             </CardContent>
           </Card>
           <Card className="shadow-sm border bg-card hover:shadow-md transition-all">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-base font-medium text-muted-foreground">รอตรวจสอบ</CardTitle>
               <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900/30">
                 <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
               </div>
             </CardHeader>
             <CardContent>
               <div className="text-4xl font-bold text-red-600 dark:text-red-400">
                 {mockReports.filter(r => r.status === 'pending').length}
               </div>
               <p className="text-sm text-muted-foreground mt-1">ต้องการการดำเนินการ</p>
             </CardContent>
           </Card>
           <Card className="shadow-sm border bg-card hover:shadow-md transition-all">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-base font-medium text-muted-foreground">แก้ไขแล้ว</CardTitle>
               <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
                 <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
               </div>
             </CardHeader>
             <CardContent>
               <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                 {mockReports.filter(r => r.status === 'resolved').length}
               </div>
               <p className="text-sm text-muted-foreground mt-1">ในรอบสัปดาห์นี้</p>
             </CardContent>
           </Card>
        </div>

        {/* 2. Main Content Area */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">รายการแจ้งปัญหา</h2>
              <p className="text-lg text-muted-foreground mt-1">
                ตรวจสอบปัญหาการใช้งานระบบ Inventory และการเบิกจ่าย
              </p>
            </div>
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="ค้นหาหัวข้อ, รหัส หรือผู้ส่ง..." 
                className="pl-10 h-12 text-base bg-background shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="employee" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              {/* Tabs List */}
              <TabsList className="grid w-full sm:w-[500px] grid-cols-3 h-12 bg-muted/50 p-1">
                <TabsTrigger value="employee" className="text-base h-full">
                  <Users className="w-5 h-5 mr-2" /> Employee
                </TabsTrigger>
                <TabsTrigger value="lead-engineer" className="text-base h-full">
                  <UserCog className="w-5 h-5 mr-2" /> Lead
                </TabsTrigger>
                <TabsTrigger value="ceo" className="text-base h-full">
                  <UserCheck className="w-5 h-5 mr-2" /> CEO
                </TabsTrigger>
              </TabsList>
              
              {/* Filter Dropdown (ใช้ Select แทน Button เพื่อความง่ายในการทำ Logic) */}
              <div className="w-full sm:w-[200px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 w-full text-base border-dashed">
                    <div className="flex items-center">
                      <Filter className="w-5 h-5 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="ตัวกรองสถานะ" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                    <SelectItem value="pending">รอตรวจสอบ</SelectItem>
                    <SelectItem value="investigating">กำลังตรวจสอบ</SelectItem>
                    <SelectItem value="resolved">แก้ไขแล้ว</SelectItem>
                    <SelectItem value="reviewed">รับทราบแล้ว</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tab Contents */}
            <TabsContent value="employee" className="mt-0">
              <div className="flex flex-col space-y-3">
                {getFilteredReports("Employee").map((report) => (
                  <ReportItem key={report.id} report={report} />
                ))}
                {getFilteredReports("Employee").length === 0 && (
                    <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2">
                      <XCircle className="w-10 h-10 text-muted-foreground/50" />
                      <span>ไม่พบรายการที่ค้นหา</span>
                    </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="lead-engineer" className="mt-0">
              <div className="flex flex-col space-y-3">
                {getFilteredReports("Lead Engineer").map((report) => (
                  <ReportItem key={report.id} report={report} />
                ))}
                {getFilteredReports("Lead Engineer").length === 0 && (
                    <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2">
                      <XCircle className="w-10 h-10 text-muted-foreground/50" />
                      <span>ไม่พบรายการที่ค้นหา</span>
                    </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="ceo" className="mt-0">
              <div className="flex flex-col space-y-3">
                {getFilteredReports("CEO").map((report) => (
                  <ReportItem key={report.id} report={report} />
                ))}
                {getFilteredReports("CEO").length === 0 && (
                    <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2">
                      <XCircle className="w-10 h-10 text-muted-foreground/50" />
                      <span>ไม่พบรายการที่ค้นหา</span>
                    </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal Component */}
      <ReportDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        report={selectedReport}
      />
    </main>
  );
}

export default ReportManagement;