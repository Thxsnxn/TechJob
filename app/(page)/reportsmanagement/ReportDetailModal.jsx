"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, User, Calendar } from "lucide-react";

// เราไม่ต้อง import "Report" Type แล้ว

// เอา Type "ReportDetailModalProps" ออกไป
export function ReportDetailModal({ isOpen, onClose, report }) {
  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{report.title}</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1.5" /> {report.submittedBy}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5" /> {report.date}
            </span>
            <Badge variant="outline">{report.role}</Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* ส่วนของรายละเอียด */}
          <div className="space-y-2">
            <h4 className="font-semibold">รายละเอียด (Details)</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {report.details}
            </p>
          </div>

          {/* ส่วนของภาพประกอบ (ถ้ามี) */}
          {report.imageUrl && (
            <div className="space-y-2">
              <h4 className="font-semibold">ภาพประกอบ (Attachment)</h4>
              <div className="rounded-md border overflow-hidden">
                <img
                  src={report.imageUrl}
                  alt="ภาพประกอบรายงาน"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}