"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Image as ImageIcon,
  User,
  Calendar,
  Send,
  MessageSquare,
  Clock,
  ShieldAlert,
  FileText
} from "lucide-react";

export function ReportDetailModal({ isOpen, onClose, report }) {
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReplyMessage("");
    }
  }, [isOpen, report]);

  if (!report) return null;

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      alert("กรุณาพิมพ์ข้อความก่อนส่ง");
      return;
    }
    // จำลองการส่ง API
    alert(`ส่งข้อความตอบกลับเรียบร้อย!\nReport ID: ${report.id}\nMessage: ${replyMessage}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        // ***** ปรับปรุง Responsive ที่นี่ *****
        // max-w-3xl สำหรับหน้าจอขนาดใหญ่, w-full สำหรับมือถือ, max-h-[95vh] ให้สูงขึ้นเล็กน้อย
        className="sm:max-w-3xl w-[95%] max-h-[95vh] p-0 gap-0 overflow-hidden flex flex-col mx-auto"
      >

        {/* --- 1. Header: Title & ID --- */}
        <DialogHeader className="px-4 sm:px-6 py-4 border-b bg-gray-50/50 dark:bg-gray-900/50 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-full shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            {/* ปรับให้ ID แสดงแยกบรรทัดบนจอเล็ก */}
            <div>
              <DialogTitle className="text-lg font-bold leading-tight truncate">
                {report.title}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                ID: <span className="font-mono">{report.id}</span>
              </p>
            </div>
          </div>
          <Badge variant="outline" className="ml-4 shrink-0 bg-white dark:bg-black">
            {report.role}
          </Badge>
        </DialogHeader>

        {/* --- Content Scrollable Area --- */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

          {/* 2. User & Time Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar Mockup */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-gray-600 font-bold shrink-0">
                {report.submittedBy.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {report.submittedBy}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3 shrink-0" /> {report.date}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Details Box */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-500 shrink-0" /> รายละเอียดปัญหา
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-7">
              {report.details}
            </p>
          </div>

          {/* 4. Image Attachment (Optional) */}
          {report.imageUrl && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <ImageIcon className="w-4 h-4 shrink-0" /> หลักฐาน / ภาพประกอบ
              </h4>
              <div className="rounded-lg border overflow-hidden bg-gray-100 dark:bg-gray-800">
                {/* ปรับให้ภาพไม่ใหญ่เกินไปบนมือถือ */}
                <img
                  src={report.imageUrl}
                  alt="Attached evidence"
                  className="w-full h-auto max-h-[300px] sm:max-h-[350px] object-contain mx-auto"
                />
              </div>
            </div>
          )}
        </div>

        {/* --- 5. Footer: Reply Section --- */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t space-y-3">
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <textarea
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-white dark:bg-black pl-10 pr-3 py-3 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all"
              placeholder="พิมพ์ข้อความตอบกลับ หรือบันทึกการแก้ไข..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
          </div>

          <DialogFooter
            // ***** ปรับปรุง Responsive ที่นี่ *****
            // ใช้ flex-row-reverse บนมือถือเพื่อให้ปุ่ม "ส่ง" อยู่ขวาสุดเสมอ 
            // และจัดให้อยู่ชิดขวาบนมือถือ
            className="flex flex-col sm:flex-row items-end sm:items-center justify-end sm:justify-between gap-3 w-full"
          >
            {/* คำอธิบาย: ซ่อนบนจอที่เล็กมาก */}
            <p className="text-xs text-muted-foreground hidden sm:block">
              *การตอบกลับจะถูกแจ้งเตือนไปยังผู้ส่งทันที
            </p>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <Button type="button" variant="ghost" onClick={onClose} className="w-1/2 sm:w-auto">
                ยกเลิก
              </Button>
              <Button
                type="button"
                onClick={handleSendReply}
                className="bg-blue-600 hover:bg-blue-700 shadow-sm text-white w-1/2 sm:w-auto"
              >
                <Send className="w-4 h-4 mr-2" /> ส่งข้อความ
              </Button>
            </div>
          </DialogFooter>
        </div>

      </DialogContent>
    </Dialog>
  );
}