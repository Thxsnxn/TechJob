"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SiteHeader } from "@/components/site-header"
import { Eye, Pencil, RotateCcw, Loader2 } from "lucide-react"
import ViewJobModal from "./ViewJobModal"
import EditJobModal from "./EditJobModal"
import { toast } from "sonner"
// 🟢 1. Import API Client
import apiClient from "@/lib/apiClient"

export default function Page() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  // const [role, setRole] = useState("") // *API Payload ไม่ได้รับ Role ผมขอ comment ไว้ก่อน หรือถ้าต้องการใช้ Client filter แจ้งได้ครับ
  const [status, setStatus] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1) // เก็บจำนวนหน้าทั้งหมดจาก API
  
  const [viewJob, setShowViewModal] = useState(null)
  const [editJob, setShowEditModal] = useState(null)

  // กำหนด Default Date (เช่น เดือนปัจจุบัน) หรือปรับตาม Business Logic
  const [dateFrom, setDateFrom] = useState("2025-01-01") 
  const [dateTo, setDateTo] = useState("2025-12-31")

  const itemsPerPage = 50 // ปรับตาม JSON ที่ให้มา

  // 🟢 ฟังก์ชันแปลง Status UI เป็น API Format (in progress -> IN_PROGRESS)
  const formatStatusForApi = (statusValue) => {
    if (!statusValue || statusValue === "all") return null;
    return statusValue.toUpperCase().replace(" ", "_"); // เช่น "in progress" -> "IN_PROGRESS"
  }

  // 🟢 ฟังก์ชันดึงข้อมูลจาก API
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)

      const payload = {
        empCode: 7110962, // Hardcode ตามที่ขอ
        search: search,
        status: formatStatusForApi(status), // แปลงค่า Status ให้ตรง format
        dateFrom: dateFrom,
        dateTo: dateTo,
        page: currentPage,
        pageSize: itemsPerPage
      }

      console.log("Fetching API with payload:", payload)

      const response = await apiClient.post("/supervisor/by-code", payload)
      
      // ⚠️ ปรับจุดนี้ตาม Structure จริงของ Response API 
      // สมมติว่า response.data คือ Array หรือมี structure แบบ { data: [], totalPages: 1 }
      const data = response.data?.data || response.data || []
      const total = response.data?.totalPages || 1 

      setJobs(data)
      setTotalPages(total)

    } catch (error) {
      console.error("Failed to fetch jobs:", error)
      toast.error("ไม่สามารถดึงข้อมูลงานได้")
    } finally {
      setLoading(false)
    }
  }, [search, status, currentPage, dateFrom, dateTo])

  // 🟢 เรียก API เมื่อค่าใน dependency เปลี่ยน (Debounce search เล็กน้อยได้ถ้าต้องการ)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs()
    }, 500) // Delay 500ms เวลาพิมพ์ search จะได้ไม่ยิง API รัวเกินไป

    return () => clearTimeout(timer)
  }, [fetchJobs])

  // 🟢 Helper สำหรับสี Status
  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || ""
    if (s === "completed") return "bg-green-100 text-green-700"
    if (s.includes("progress")) return "bg-yellow-100 text-yellow-700"
    if (s === "pending") return "bg-gray-100 text-gray-700"
    if (s === "approved") return "bg-blue-100 text-blue-700"
    if (s === "rejected") return "bg-red-100 text-red-700"
    return "bg-gray-100 text-gray-700"
  }

  // 🟢 Reset Filter
  const handleReset = () => {
    setSearch("")
    setStatus("")
    setCurrentPage(1)
    toast.info("รีเซ็ตตัวกรองแล้ว")
  }

  // --- Logic เดิมสำหรับการจัดการ Modal (ปรับให้ update state local ชั่วคราว หรือยิง API update ตามต้องการ) ---
  const handleApprove = (job) => {
    // TODO: ต่อ API Approve ตรงนี้
    const updated = jobs.map((j) =>
      j.id === job.id ? { ...j, status: "Approved" } : j
    )
    setJobs(updated)
    setShowViewModal(null)
    toast.success("✅ อนุมัติงานแล้ว (Simulation)")
  }

  const handleReject = (job, note) => {
    // TODO: ต่อ API Reject ตรงนี้
    const updated = jobs.map((j) =>
      j.id === job.id ? { ...j, status: "Rejected", rejectNote: note } : j
    )
    setJobs(updated)
    setShowViewModal(null)
    toast.error("❌ งานถูกตีกลับแล้ว (Simulation)")
  }

  const handleSaveEdit = (updatedJob) => {
    // TODO: ต่อ API Update ตรงนี้
    const updated = jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
    setJobs(updated)
    setShowEditModal(null)
    toast.success("💾 แก้ไขข้อมูลงานเรียบร้อย (Simulation)")
  }

  const handleDelete = (job) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้?")) return
    // TODO: ต่อ API Delete ตรงนี้
    const updated = jobs.filter((j) => j.id !== job.id)
    setJobs(updated)
    setShowEditModal(null)
    toast.error("🗑️ ลบงานสำเร็จแล้ว (Simulation)")
  }

  return (
    <main>
      <SiteHeader title="Job Management" />

      <section className="p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Job Management</h1>
            <p className="text-muted-foreground">Manage all jobs and assignments (API Connected)</p>
          </div>

          <div className="flex gap-3">
            <Link href="/jobmanagement/add" className="md:w-[300px]">
              <Button className="bg-blue-600 w-full h-11 text-lg md:text-2xl py-3 hover:bg-blue-700 text-white">
                + Create New Job
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-11 flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="grid md:grid-cols-3 gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search job id, title or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex gap-4 md:col-span-2">
              {/* Role Dropdown - ปิดไว้ก่อนเนื่องจาก API ไม่ได้รับ parameter นี้ */}
              {/* <div>
                <label className="text-sm font-medium">Role</label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              */}

              <div className="w-full md:w-1/2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              All Jobs
              {loading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
            </h2>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : jobs.length > 0 ? (
                  jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.id}</TableCell>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.customer?.name || job.customer}</TableCell>
                      <TableCell>{job.lead}</TableCell>
                      <TableCell>{job.date}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(job.status)} px-2 py-1`}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowViewModal(job)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowEditModal(job)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground h-24"
                    >
                      No jobs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-end items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </Button>
                
                <span className="text-sm font-medium mx-2">
                    Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* View & Edit Modals */}
      {viewJob && (
        <ViewJobModal
          job={viewJob}
          onClose={() => setShowViewModal(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
      {editJob && (
        <EditJobModal
          job={editJob}
          onClose={() => setShowEditModal(null)}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
        />
      )}
    </main>
  )
}