"use client";

import React, { useState, useMemo } from "react";

// --- UI Components Imports ---
import { SiteHeader } from "@/components/site-header"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

// --- Icons Imports ---
import {
  ChevronRight,
  Search,
  MapPin,
  Briefcase,
  CalendarDays,
  LayoutGrid,
  User,
  Calendar,
  Users,
  CheckCircle2,
  Plus, // <--- เพิ่ม icon Plus เข้ามา
} from "lucide-react";

// ==========================================
// 1. ข้อมูลสมมติ (Mock Data) & Constants
// ==========================================


const workItems = [
  {
    id: 1,
    title: "Big C | สาขา ลาดพร้าว",
    customer: "ปลาทูนึ่ง ตัวใหญ่ๆ",
    leadEngineer: "Cynthialyn",
    assignedBy: "แจ็กแปปโฮ",
    status: "Pending",
    dateRange: null,
    description:
      "ติดตั้งระบบปรับอากาศโซนสินค้าแช่แข็ง ตรวจสอบการเดินสายไฟ และทดสอบการทำงานของคอมเพรสเซอร์ 3 ตัว",
    address: "1234 ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900",
    assignedStaff: [
      {
        id: "s1",
        name: "สมศักดิ์",
        role: "ช่างไฟ",
        avatar: "https://ui-avatars.com/api/?name=Som&background=random",
      },
      {
        id: "s2",
        name: "มานะ",
        role: "ช่างแอร์",
        avatar: "https://ui-avatars.com/api/?name=Mana&background=random",
      },
    ],
  },
  {
    id: 2,
    title: "Lotus's | สาขา รามอินทรา",
    customer: "แมวน้ำ อุ๋งๆ",
    leadEngineer: "David",
    assignedBy: "สมชาย",
    status: "In Progress",
    dateRange: "12/11/2025",
    description:
      "เปลี่ยนตู้ MDB (Main Distribution Board) เก่า และเดินรางไฟใหม่สำหรับโซนอาหารสดทั้งหมด",
    address: "5678 ถนนรามอินทรา แขวงคันนายาว เขตคันนายาว กรุงเทพมหานคร 10230",
    assignedStaff: [
      {
        id: "s5",
        name: "ประเสริฐ",
        role: "หัวหน้าช่างไฟ",
        avatar: "https://ui-avatars.com/api/?name=Prasert&background=random",
      },
    ],
  },
  {
    id: 3,
    title: "The Mall | สาขา บางกะปิ",
    customer: "ไก่ทอด หาดใหญ่",
    leadEngineer: "Cynthialyn",
    assignedBy: "สมหญิง",
    status: "Reject",
    dateRange: "13/11/2025 - 14/11/2025",
    description:
      "ลูกค้าแจ้ง Reject งานติดตั้งระบบ Hood ดูดควันร้านอาหาร เนื่องจากสเปคท่อลมไม่ตรงตามที่ตกลงในสัญญา",
    address: "3522 ถนนลาดพร้าว แขวงคลองจั่น เขตบางกะปิ กรุงเทพมหานคร 10240",
    assignedStaff: [],
  },
  {
    id: 4,
    title: "Central | สาขา พระราม 9",
    customer: "หนูแฮมสเตอร์",
    leadEngineer: "Michael",
    assignedBy: "แจ็กแปปโฮ",
    status: "Completed",
    dateRange: "10/11/2025",
    description: "งานเสร็จสิ้น ตรวจสอบระบบเรียบร้อย",
    address: "9/9 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310",
    assignedStaff: [
      {
        id: "s1",
        name: "สมศักดิ์",
        role: "ช่างไฟ",
        avatar: "https://ui-avatars.com/api/?name=Som&background=random",
      },
    ],
  },
];

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

// ==========================================
// 2. Main Page Component
// ==========================================

export default function Page() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWork, setSelectedWork] = useState(null);

  const filteredWorks = useMemo(() => {
    return workItems.filter((item) => {
      const matchesFilter =
        activeFilter === "All" || item.status === activeFilter;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const filterOptions = [
    { id: "All", label: "ทั้งหมด" },
    { id: "Pending", label: "รอดำเนินการ" },
    { id: "In Progress", label: "กำลังดำเนินการ" },
    { id: "Reject", label: "ยกเลิก" },
    { id: "Completed", label: "เสร็จสิ้น" },
  ];

  return (
    <main className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <SiteHeader />

      <div className="container mx-auto max-w-[95%] 2xl:max-w-[1600px] px-4 py-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Work Orders
            </h1>
            <p className="text-muted-foreground mt-1">
              จัดการและติดตามสถานะงานติดตั้ง/ซ่อมบำรุง
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาชื่องาน, ลูกค้า..."
              className="pl-9 bg-white dark:bg-gray-900 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b">
          {filterOptions.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className={`rounded-full px-4 ${
                activeFilter === filter.id
                  ? "shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter.label}
            </Button>
          ))}
          <div className="ml-auto hidden md:flex items-center gap-2 text-muted-foreground">
            <LayoutGrid className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
          </div>
        </div>

        {/* Work Grid */}
        {filteredWorks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWorks.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-transparent hover:border-primary/20 bg-white dark:bg-gray-900 overflow-hidden flex flex-col h-full"
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
                          {item.dateRange.includes("เริ่ม")
                            ? item.dateRange.replace("เริ่ม ", "")
                            : item.dateRange}
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
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

      <WorkDetailModal
        open={!!selectedWork}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedWork(null);
        }}
        work={selectedWork}
      />
    </main>
  );
}

// ==========================================
// 3. Modal Component & Helpers
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
      {status}
    </Badge>
  );
};

function WorkDetailModal({ open, onOpenChange, work }) {
  if (!work) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <div className="px-6 py-6 border-b bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {work.title}
              </h2>
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

        {/* Content */}
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

          {/* สถานที่ */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" /> สถานที่ปฏิบัติงาน
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-6">
              {work.address}
            </p>
          </div>

          {/* --- ส่วนของทีมงาน (Staff Section) --- */}
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
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
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




            {/* --- [NEW] ปุ่มเพิ่ม Employee (เฉพาะสถานะ Pending) --- */}
            {work.status === 'Pending' && (
              <div className="mt-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-dashed border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center gap-2 text-muted-foreground hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
                    onClick={() => alert("เปิดหน้าต่างเลือกพนักงาน")} // ใส่ Logic เปิด Modal เลือกพนักงานตรงนี้
                  >
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">เพิ่มพนักงานเข้าทีม</span>
                  </Button>
              </div>
            )}

          </div>




          {/* Project Lead Info */}
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

        <DialogFooter className="px-6 py-4 border-t bg-gray-50 dark:bg-gray-900">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ปิดหน้าต่าง
          </Button>
          {work.status === "Pending" && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              เริ่มงาน
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}