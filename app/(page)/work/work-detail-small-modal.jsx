"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Briefcase,
  Calendar,
  Users,
  CheckCircle2,
  User,
} from "lucide-react";

// --- Constants & Helpers เฉพาะของ Modal ---
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
      className={`${styles[status] || "bg-gray-100"} border px-3 py-1`}
    >
      {statusLabels[status] || status}
    </Badge>
  );
};

// ⭐ เพิ่ม prop 'onOpenBigModal' รับฟังก์ชันเปิด modal ใหญ่
export function WorkDetailModal({ open, onOpenChange, work, onOpenBigModal }) {
  if (!work) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        
        {/* --- Header --- */}
        <div className="px-6 py-6 border-b bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {work.title}
              </DialogTitle>
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

        {/* --- Body Content --- */}
        <div className="p-6 space-y-6">
          {/* 1. รายละเอียดงาน */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" /> รายละเอียดงาน
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border">
              {work.description}
            </p>
          </div>

          {/* 2. หมายเหตุเพิ่มเติม */}
          {work.note && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />{" "}
                หมายเหตุเพิ่มเติม
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-700">
                 {work.note}
              </div>
            </div>
          )}

          {/* 3. สถานที่ปฏิบัติงาน + แผนที่ */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" /> สถานที่ปฏิบัติงาน
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-6">
              {work.address}
            </p>

            {/* Google Map Embed */}
            {(() => {
              const hasCoord = work.lat && work.lng;
              const hasAddress = Boolean(work.address && work.address !== "-");

              if (!hasCoord && !hasAddress) return null;

              const mapSrc = hasCoord
                ? `https://www.google.com/maps?q=${work.lat},${work.lng}&hl=th&z=15&output=embed`
                : `https://www.google.com/maps?q=${encodeURIComponent(
                    work.address
                  )}&hl=th&z=15&output=embed`;

              return (
                <div className="ml-6 space-y-2">
                  <div className="h-64 w-full rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800 relative">
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
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {work.locationName || work.address}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 4. ทีมงาน */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mt-4">
              <Users className="w-4 h-4 text-blue-500" /> ทีมงานที่ได้รับมอบหมาย
              ({work.assignedStaff?.length || 0})
            </h3>

            {work.assignedStaff && work.assignedStaff.length > 0 ? (
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
          </div>

          {/* Footer Info: หัวหน้างาน / ผู้มอบหมาย */}
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

        {/* --- Buttons Footer --- */}
        {/* ⭐ ปรับ justify-end เป็น justify-between เพื่อดันปุ่มไปคนละฝั่ง */}
        <DialogFooter className="px-6 py-4 border-t bg-gray-50 dark:bg-gray-900 sm:justify-between">
          
          {/* ⭐ ปุ่มใหม่ "ดูรายละเอียด" อยู่ทางซ้าย */}
          <Button variant="outline" className="bg-white" onClick={onOpenBigModal}>
            ดูรายละเอียด
          </Button>

          {/* กลุ่มปุ่มเดิม อยู่ทางขวา */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              ปิดหน้าต่าง
            </Button>
            {work.status === "Pending" && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                เริ่มงาน
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}