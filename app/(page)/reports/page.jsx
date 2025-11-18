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
import { FileText, UploadCloud, HelpCircle, AlertCircle, Send, Loader2 } from "lucide-react";

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
    <main className="min-h-screen bg-background/50 pb-10">
      <SiteHeader title="Reports" />
      
      {/* Header Section (Adjusted Scale) */}
      <div className="bg-white dark:bg-gray-900 border-b py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-4 mb-2">
             <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shadow-sm dark:bg-blue-900/30 dark:text-blue-400">
                <FileText className="w-6 h-6" />
             </div>
             <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Submit a Ticket</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">แจ้งปัญหา ข้อเสนอแนะ หรือร้องเรียนเรื่องต่างๆ</p>
             </div>
          </div>
        </div>
      </div>

      {/* Content Container (Adjusted Scale) */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Main Form (2/3 width) */}
          <div className="lg:col-span-2">
            <Card className="border shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b px-6 py-4">
                <CardTitle className="text-xl">แบบฟอร์มแจ้งปัญหา</CardTitle>
                <CardDescription>กรุณากรอกข้อมูลให้ครบถ้วนเพื่อความรวดเร็วในการตรวจสอบ</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="space-y-4">
                    {/* Request Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        หัวข้อปัญหา <span className="text-red-500">*</span>
                        </label>
                        <Select value={formData.type} onValueChange={handleSelectChange}>
                        <SelectTrigger className="h-11 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-2 transition-all">
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
                        <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        เรื่อง <span className="text-red-500">*</span>
                        </label>
                        <Input 
                            id="subject"
                            placeholder="ระบุเรื่องแบบย่อ (เช่น แอร์ไม่เย็น, คอมพิวเตอร์เปิดไม่ติด)" 
                            className="h-11 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-2 transition-all"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        รายละเอียด <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            className="flex min-h-[150px] w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all resize-y"
                            placeholder="อธิบายรายละเอียดปัญหา เวลาที่เกิดเหตุ และข้อมูลอื่นๆ ที่เกี่ยวข้อง..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      แนบภาพประกอบ (ถ้ามี)
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 transition-all group"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                             <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            คลิกเพื่ออัปโหลดไฟล์
                          </p>
                          <p className="text-xs text-gray-400">
                            JPG, PNG, PDF (Max 10MB)
                          </p>
                        </div>
                        <Input id="file-upload" type="file" className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t mt-6">
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full sm:w-auto h-11 px-8 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
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
          <div className="lg:col-span-1 space-y-6">
             {/* Tips Card */}
             <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900 shadow-sm">
                <CardHeader className="pb-3">
                   <CardTitle className="text-base font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5" /> ข้อแนะนำ
                   </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800/80 dark:text-blue-300/80 space-y-3 leading-relaxed">
                   <p>• กรุณาระบุรายละเอียดให้ชัดเจน เพื่อให้เจ้าหน้าที่วิเคราะห์ปัญหาได้ตรงจุด</p>
                   <p>• หากเป็นปัญหาทางเทคนิค ควรถ่ายภาพหน้าจอ (Screenshot) error ที่เกิดขึ้นแนบมาด้วย</p>
                   <p>• สำหรับกรณีเร่งด่วน กรุณาติดต่อแผนก IT หรืออาคารสถานที่โดยตรง</p>
                </CardContent>
             </Card>

             {/* Contact Info */}
             <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                   <AlertCircle className="w-5 h-5 text-orange-500" /> ช่องทางติดต่อฉุกเฉิน
                </h3>
                <div className="space-y-4 text-sm">
                   <div className="flex justify-between items-center pb-2 border-b border-dashed">
                      <span className="text-gray-500 dark:text-gray-400">ฝ่าย IT Support</span>
                      <span className="font-mono font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">1111</span>
                   </div>
                   <div className="flex justify-between items-center pb-2 border-b border-dashed">
                      <span className="text-gray-500 dark:text-gray-400">ฝ่ายอาคาร</span>
                      <span className="font-mono font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">2222</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">ฝ่ายบุคคล</span>
                      <span className="font-mono font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">3333</span>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}