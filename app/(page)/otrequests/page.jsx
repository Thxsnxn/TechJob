"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SiteHeader } from "@/components/site-header";

// === เพิ่ม icon และส่วนที่จำเป็น ===
import { Eye, Pencil, UploadCloud } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// ===================================

export default function Page() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // === State ใหม่สำหรับเก็บไฟล์ที่เลือก ===
  const [selectedFile, setSelectedFile] = useState(null);
  // ========================================

  // โหลดข้อมูลจาก jobs.json
  useEffect(() => {
    fetch("/data/jobs.json")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Failed to load jobs:", err));
  }, []);

  // ฟังก์ชันกรองข้อมูล
  const normalize = (s) =>
    String(s ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

  const filteredJobs = useMemo(() => {
    // (โค้ดส่วน filter... เหมือนเดิม)
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.id.toLowerCase().includes(search.toLowerCase()) ||
        job.customer.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        role === "" ||
        (role === "manager" && job.lead === "Thastanon") ||
        (role === "technician" && job.lead !== "Thastanon");

      const matchesStatus =
        status === "" || normalize(job.status) === normalize(status);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [jobs, search, role, status]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Normalize status and return consistent badge color classes
  const getStatusColor = (status) => {
    // (โค้ดส่วน getStatusColor... เหมือนเดิม)
    const s = String(status ?? "").trim().toLowerCase().replace(/\s+/g, "");
    switch (s) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "inprogress":
        return "bg-yellow-100 text-yellow-700";
      case "pending":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // === Handler ใหม่สำหรับจัดการการเลือกไฟล์ ===
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
  // ===========================================

  return (
    <main className="bg-background min-h-screen">
      <SiteHeader title="OT Request" />

      <section className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">OT Request</h1>
            Management overtime for{" "}
            <span className="text-black font-medium">Employee</span>
          </div>
        </div>

        {/* === ฟอร์มบันทึกแจ้งทำโอที === */}
        <Card>
          <CardHeader>
            <CardTitle>ฟอร์มบันทึกแจ้งทำโอที</CardTitle>
            <CardDescription>
              กรอกรายละเอียดเพื่อแจ้งขอทำงานล่วงเวลา
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* วันที่ */}
            <div className="space-y-2">
              <Label htmlFor="ot-date">วันที่</Label>
              <Input id="ot-date" type="date" />
            </div>

            {/* เวลา (จัดกลุ่มแบบ 2-columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ot-start-time">เวลาเริ่มต้น</Label>
                <Input id="ot-start-time" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ot-end-time">เวลาสิ้นสุด</Label>
                <Input id="ot-end-time" type="time" />
              </div>
            </div>

            {/* รายละเอียดโอที */}
            <div className="space-y-2">
              <Label htmlFor="ot-details">รายละเอียด</Label>
              <Textarea
                id="ot-details"
                placeholder="อธิบายรายละเอียดงานที่ทำ..."
              />
            </div>

            {/* === (ปรับปรุง) ส่วนแนบรูป === */}
            <div className="space-y-2">
              <Label>แนบรูป</Label>
              <Label
                htmlFor="ot-image"
                className="flex flex-col items-center justify-center w-full h-32 p-4 border-2 border-dashed rounded-md cursor-pointer text-sm text-muted-foreground hover:bg-muted"
              >
                <UploadCloud className="w-8 h-8 mb-2" />
                <span>
                  {selectedFile
                    ? selectedFile.name
                    : "คลิกเพื่ออัปโหลดรูปภาพ"}
                </span>
                <span className="text-xs mt-1">
                  (รองรับ PNG, JPG, GIF)
                </span>
              </Label>
              <Input
                id="ot-image"
                type="file"
                className="hidden" // <-- ซ่อน Input จริง
                onChange={handleFileChange} // <-- เรียก Handler
                accept="image/png, image/jpeg, image/gif" // <-- จำกัดประเภทไฟล์
              />
            </div>
            {/* ============================= */}
            
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">บันทึกโอที</Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}