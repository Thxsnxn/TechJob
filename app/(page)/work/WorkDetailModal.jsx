// responsive/home/WorkDetailModal.jsx

"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Map, Users, MapPin, BookText, X } from "lucide-react";

// Modal นี้จะถูกควบคุมโดย 'open' และ 'onOpenChange' จาก page.jsx
export function WorkDetailModal({ work, open, onOpenChange }) {
  
  // ถ้าไม่มีข้อมูล 'work' (เช่น ตอนกำลังปิด)
  // เราจะ render null หรือ Modal เปล่าๆ เพื่อให้ animation การปิดทำงาน
  if (!work) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent></DialogContent>
      </Dialog>
    );
  }

  // เมื่อมีข้อมูล 'work'
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        
        {/* ใช้ ScrollArea เผื่อข้อมูลยาวเกินจอ */}
        <ScrollArea className="max-h-[80vh] md:max-h-[70vh]">
          <div className="p-6 space-y-6">
            {/* 1. ชื่องาน / ชื่อลูกค้า / หัวหน้างาน */}
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{work.title}</DialogTitle>
              <DialogDescription className="text-base pt-1">
                <span className="font-medium text-gray-900 dark:text-gray-100">Customer:</span> {work.customer}
                <br />
                <span className="font-medium text-gray-900 dark:text-gray-100">Lead Engineer:</span> {work.leadEngineer}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* 2. รายละเอียดงาน */}
              <div className="flex gap-4 items-start">
                <BookText className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">รายละเอียดงาน</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{work.description || "N/A"}</p>
                </div>
              </div>

              <Separator />

              {/* 7. พนักงานที่ต้องทำงานนี้ (4 กล่อง) */}
              <div className="flex gap-4 items-start">
                <Users className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    พนักงาน ({work.assignedStaff.length})
                  </h3>
                  {work.assignedStaff && work.assignedStaff.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      {work.assignedStaff.map(staff => (
                        <div key={staff.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <Avatar>
                            <AvatarImage src={staff.avatar} alt={staff.name} />
                            <AvatarFallback>{staff.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{staff.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{staff.role || 'Technician'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ยังไม่มีการมอบหมายพนักงาน</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* 5. ที่อยู่ลูกค้า */}
              <div className="flex gap-4 items-start">
                <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">ที่อยู่ลูกค้า</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{work.address || "N/A"}</p>
                </div>
              </div>

              {/* 6. แผนที่ (Placeholder) */}
              <div className="flex gap-4 items-start">
                <Map className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">แผนที่</h3>
                  <div className="mt-2 rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={`https://placehold.co/600x300/e2e8f0/64748b?text=Map+of+${encodeURIComponent(work.title)}`} 
                      alt="Map Placeholder" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}