"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  X,
  FileText,
  Calendar,
  MapPin,
  Clock,
  User,
  AlertCircle,
} from "lucide-react";

// --- Helpers ---
const statusLabels = {
  Pending: "รอดำเนินการ",
  "In Progress": "กำลังดำเนินการ",
  Reject: "ยกเลิก/ปฏิเสธ",
  Completed: "เสร็จสิ้น",
};

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
      className={`${styles[status] || "bg-gray-100"} border px-2 py-0.5 text-[10px] h-fit`}
    >
      {statusLabels[status] || status}
    </Badge>
  );
};

export function FullWorkDetailModal({ open, onOpenChange, work }) {
  if (!work) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ⭐ แก้ไขจุดสำคัญ: เปลี่ยน !grid เป็น !flex !flex-col เพื่อบังคับทิศทาง layout ให้ชิดบนแน่นอน */}
      <DialogContent className="fixed !left-0 !top-0 !z-[200] !flex !flex-col !h-screen !w-screen !max-w-none !translate-x-0 !translate-y-0 !border-none !rounded-none !bg-gray-50 !p-0 shadow-none dark:!bg-gray-950 overflow-hidden outline-none">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 bg-white dark:bg-gray-900 border-b shadow-sm flex-none z-10">
          <div className="flex items-center gap-3 overflow-hidden">
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onOpenChange(false)}
                className="rounded-full hover:bg-gray-100 h-8 w-8 shrink-0"
             >
               <ChevronRight className="w-5 h-5 rotate-180 text-gray-500" />
             </Button>

             <div className="flex items-center gap-3 overflow-hidden">
                <h2 className="text-base font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                    {work.title}
                </h2>
                <div className="shrink-0">
                    {getStatusBadge(work.status)}
                </div>
                <div className="hidden sm:flex items-center text-xs text-muted-foreground border-l pl-3 h-4 shrink-0">
                    #{work.id}
                </div>
             </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
              <Button variant="outline" size="sm" className="hidden sm:flex h-8 text-xs px-3">
                  <FileText className="w-3.5 h-3.5 mr-2" /> PDF
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
                  <X className="w-5 h-5 text-gray-500" />
              </Button>
          </div>
        </div>

        {/* Content Area */}
        {/* p-2 คือ Padding รอบด้าน (บน ล่าง ซ้าย ขวา) 8px เท่ากันหมด */}
        <div className="flex-1 overflow-y-auto p-2 bg-gray-50/50 dark:bg-gray-950">
           
           <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-2">
              
              {/* Left Column */}
              <div className="lg:col-span-2 flex flex-col gap-2 h-full">
                 {/* Card 1 */}
                 <Card className="shadow-sm border-gray-200 shrink-0">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">ข้อมูลทั่วไป</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ลูกค้า</label>
                                <p className="font-medium text-base mt-1">{work.customer}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">วันที่ดำเนินการ</label>
                                <p className="font-medium text-base mt-1 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" /> 
                                    {work.dateRange || "-"}
                                </p>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">รายละเอียด</label>
                                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border text-sm leading-relaxed">
                                    {work.description}
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">สถานที่</label>
                                <p className="font-medium text-base mt-1 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    {work.address}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                 </Card>

                 {/* Card 2 */}
                 <Card className="shadow-sm border-gray-200 flex-1 flex flex-col">
                     <CardHeader className="pb-3 shrink-0">
                         <CardTitle className="text-lg flex items-center gap-2">
                             <Clock className="w-5 h-5 text-gray-500" /> ประวัติการดำเนินงาน
                         </CardTitle>
                     </CardHeader>
                     <CardContent className="flex-1">
                         <div className="relative pl-4 border-l-2 border-gray-200 space-y-8 ml-2 mt-2 h-full">
                             <div className="relative">
                                 <div className="absolute -left-[21px] top-1 bg-blue-500 h-3 w-3 rounded-full ring-4 ring-white dark:ring-gray-900"></div>
                                 <p className="text-sm font-semibold">สร้างใบงาน</p>
                                 <p className="text-xs text-muted-foreground mt-0.5">20/11/2025 10:00 น. โดย Admin</p>
                             </div>
                             <div className="relative opacity-50">
                                 <div className="absolute -left-[21px] top-1 bg-gray-300 h-3 w-3 rounded-full ring-4 ring-white dark:ring-gray-900"></div>
                                 <p className="text-sm font-semibold">มอบหมายงาน</p>
                                 <p className="text-xs text-muted-foreground mt-0.5">รอดำเนินการ</p>
                             </div>
                         </div>
                     </CardContent>
                 </Card>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-2 h-full">
                  {/* Card 3 */}
                  <Card className="shadow-sm border-gray-200 shrink-0">
                      <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex justify-between items-center">
                              ทีมงาน 
                              <span className="text-sm font-normal text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">{work.assignedStaff.length}</span>
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="space-y-4">
                            {work.assignedStaff.map((staff) => (
                                <div key={staff.id} className="flex items-center gap-3">
                                    <img src={staff.avatar} alt={staff.name} className="w-10 h-10 rounded-full border ring-1 ring-gray-100" />
                                    <div>
                                        <p className="text-sm font-medium leading-none">{staff.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{staff.role}</p>
                                    </div>
                                </div>
                            ))}
                            {work.assignedStaff.length === 0 && (
                                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed">
                                    <p className="text-sm text-muted-foreground">ยังไม่มีทีมงาน</p>
                                </div>
                            )}
                          </div>
                      </CardContent>
                  </Card>

                  {/* Card 4 */}
                  <Card className="shadow-sm border-gray-200 flex-1 flex flex-col">
                      <CardHeader className="pb-3 shrink-0">
                          <CardTitle className="text-lg">ผู้ติดต่อประสานงาน</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-1">
                           <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                               <div className="bg-blue-100 p-2 rounded-full">
                                   <User className="w-6 h-6 text-blue-600" />
                               </div>
                               <div>
                                   <p className="text-sm font-bold text-blue-900">คุณสมชาย (หน้างาน)</p>
                                   <p className="text-sm text-blue-700 font-mono mt-0.5">081-xxx-xxxx</p>
                               </div>
                           </div>
                           <div className="text-sm bg-amber-50 text-amber-800 p-3 rounded-lg border border-amber-100 flex items-start gap-2">
                               <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                               <span>หมายเหตุ: กรุณาโทรแจ้งล่วงหน้าก่อนเข้าพื้นที่ 1 ชั่วโมง</span>
                           </div>
                      </CardContent>
                  </Card>
              </div>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}