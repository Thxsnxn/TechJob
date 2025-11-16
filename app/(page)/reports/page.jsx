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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
import { Eye, Pencil } from "lucide-react";

export default function Page() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showCreateModal, setShowCreateModal] = useState(false);

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
    const s = String(status ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");
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

  return (
    <main className="bg-background">
      <SiteHeader title="Reports" />
      <section className="p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Send a feedback</p>
          </div>
        </div>
        {/* Reports Section */}
        <Card className="w-full my-8">
          <CardHeader>
            <h2 className="text-2xl font-bold">Submit a Ticket</h2>
            <p className="text-muted-foreground">อยากแจ้งอะไรแจ้งเลย</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              DETAILS
            </div> */}

            {/* Form Group: CHOOSE A REQUEST TYPE */}
            <div className="space-y-2">
              <label htmlFor="request-type" className="text-sm font-medium">
                ปัญหาเกี่ยวกับ <span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger id="request-type">
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refund">สถานที่การทำงาน</SelectItem>
                  <SelectItem value="premier">เกี่ยวกับบุคคลากร</SelectItem>
                  <SelectItem value="technical">ทางเทคนิคและระบบ</SelectItem>
                  <SelectItem value="account">เกี่ยวกับอุปกรณ์</SelectItem>
                  <SelectItem value="billing">อื่นๆ</SelectItem>
                  {/* <SelectItem value="suspension">???</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {/* Form Group: WHAT PLATFORM */}
            {/* <div className="space-y-2">
              <label htmlFor="platform" className="text-sm font-medium">
                WHAT PLATFORM ARE YOU REQUESTING ASSISTANCE WITH
              </label>
              <Select>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pc">PC</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="console">Console</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* Form Group: ISSUE */}
            {/* <div className="space-y-2">
              <label htmlFor="issue" className="text-sm font-medium">
                PLEASE SELECT THE ISSUE YOU ARE EXPERIENCING:{" "}
                <span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger id="issue">
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="issue-a">Issue A</SelectItem>
                  <SelectItem value="issue-b">Issue B</SelectItem>
                  <SelectItem value="issue-c">Issue C</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* Form Group: DESCRIPTION */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                รายละเอียด <span className="text-red-500">*</span>
              </label>
              {/* ใช้ <textarea> ธรรมดาและใส่ class ของ shadcn/ui 
                เพื่อหลีกเลี่ยงการ import 'Textarea' เพิ่ม
              */}
              <textarea
                id="description"
                rows="6"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Please provide a detailed description of your issue."
              ></textarea>
            </div>

            {/* Form Group: ATTACHMENTS */}
            <div className="space-y-2">
              <label htmlFor="file-upload" className="text-sm font-medium">
                แนบภาพประกอบ (ถ้ามี)
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      ต้องการแนบภาพหรือไฟล์อื่นๆ คลิกที่นี่เพื่ออัปโหลด
                    </p>
                  </div>
                  {/* ใช้ Input ที่มีอยู่ แต่ซ่อนไว้ */}
                  <Input id="file-upload" type="file" className="hidden" />
                </label>
              </div>
            </div>

            {/* Form Group: SUBMIT */}
            <div>
              {/* ใช้ variant="destructive" เพื่อให้เป็นสีแดง */}
              <Button variant="destructive" className="w-full sm:w-auto">
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* END: Added Report Form */}     {" "}
      </section>
           {" "}
      {showCreateModal && (
        <CreateJobModal onClose={() => setShowCreateModal(false)} />
      )}
         {" "}
    </main>
  );
}
