"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { FileText, UploadCloud, HelpCircle, AlertCircle, Send, Loader2, MessageSquareWarning } from "lucide-react";

export default function SubmitReportPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    description: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newReport = {
      id: `R-${Math.floor(Math.random() * 10000)}`,
      title: formData.subject || "ไม่ได้ระบุหัวข้อ",
      details: formData.description,
      submittedBy: "คุณ (Current User)",
      date: "เมื่อสักครู่นี้",
      role: "Employee",
      status: "pending",
      imageUrl: "",
    };

    setTimeout(() => {
      const existingReports = JSON.parse(localStorage.getItem("mockReports") || "[]");
      const updatedReports = [newReport, ...existingReports];
      localStorage.setItem("mockReports", JSON.stringify(updatedReports));

      alert("ส่งรายงานเรียบร้อยแล้ว! ข้อมูลถูกส่งไปยังฝ่ายจัดการ");
      setIsLoading(false);

      setFormData({ type: "", subject: "", description: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <SiteHeader title="แจ้งปัญหา" />

      <main className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-8 shadow-lg">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                <MessageSquareWarning className="h-8 w-8" /> แจ้งปัญหา
              </h1>
              <p className="text-orange-100 mt-2 text-lg">
                แจ้งปัญหา ข้อเสนอแนะ หรือร้องเรียนเรื่องต่างๆ เพื่อการแก้ไขที่รวดเร็ว
              </p>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

          {/* Left Column: Main Form (2/3 width) */}
          <div className="lg:col-span-7">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">แบบฟอร์มแจ้งปัญหา</CardTitle>
                <CardDescription>กรุณากรอกข้อมูลให้ครบถ้วนเพื่อความรวดเร็วในการตรวจสอบ</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                  <div className="space-y-4">
                    {/* Request Type */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        หัวข้อปัญหา <span className="text-red-500">*</span>
                      </label>
                      <Select value={formData.type} onValueChange={handleSelectChange}>
                        <SelectTrigger className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-orange-500 transition-all">
                          <SelectValue placeholder="เลือกหัวข้อปัญหา" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="place">สถานที่ทำงาน / อาคาร</SelectItem>
                          <SelectItem value="person">บุคลากร / การบริการ</SelectItem>
                          <SelectItem value="technical">ระบบไอที / เทคนิค</SelectItem>
                          <SelectItem value="equipment">อุปกรณ์สำนักงาน / ครุภัณฑ์</SelectItem>
                          <SelectItem value="other">อื่นๆ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        เรื่อง <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="subject"
                        placeholder="ระบุเรื่องแบบย่อ (เช่น แอร์ไม่เย็น, คอมพิวเตอร์เปิดไม่ติด)"
                        className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-orange-500 transition-all"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        รายละเอียด <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        className="flex min-h-[150px] w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all resize-y"
                        placeholder="อธิบายรายละเอียดปัญหา เวลาที่เกิดเหตุ และข้อมูลอื่นๆ ที่เกี่ยวข้อง..."
                        value={formData.description}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      แนบภาพประกอบ (ถ้ามี)
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-600 transition-all group"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-orange-500 transition-colors" />
                          </div>
                          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                            คลิกเพื่ออัปโหลดไฟล์
                          </p>
                          <p className="text-xs text-slate-400">
                            JPG, PNG, PDF (Max 10MB)
                          </p>
                        </div>
                        <Input id="file-upload" type="file" className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto h-11 px-8 text-base font-medium bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg transition-all"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังส่ง...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" /> ส่งรายงาน
                        </>
                      )}
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Info (1/3 width) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tips Card */}
            <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" /> ข้อแนะนำ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-sm text-blue-800/80 dark:text-blue-300/80 space-y-3 leading-relaxed">
                <p>• กรุณาระบุรายละเอียดให้ชัดเจน เพื่อให้เจ้าหน้าที่วิเคราะห์ปัญหาได้ตรงจุด</p>
                <p>• หากเป็นปัญหาทางเทคนิค ควรถ่ายภาพหน้าจอ (Screenshot) error ที่เกิดขึ้นแนบมาด้วย</p>
                <p>• สำหรับกรณีเร่งด่วน กรุณาติดต่อแผนก IT หรืออาคารสถานที่โดยตรง</p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                <AlertCircle className="w-5 h-5 text-orange-500" /> ช่องทางติดต่อฉุกเฉิน
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">ฝ่าย IT Support</span>
                  <span className="font-mono font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300">1111</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">ฝ่ายอาคาร</span>
                  <span className="font-mono font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300">2222</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">ฝ่ายบุคคล</span>
                  <span className="font-mono font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300">3333</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}