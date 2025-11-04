"use client"

import React, { useState, useEffect, useMemo } from "react"
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
import { Eye, Pencil, RotateCcw } from "lucide-react"
import ViewJobModal from "./ViewJobModal"
import EditJobModal from "./EditJobModal"
import { toast } from "sonner"

export default function Page() {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewJob, setShowViewModal] = useState(null)
  const [editJob, setShowEditModal] = useState(null)
  const itemsPerPage = 5

  // 🟢 โหลดข้อมูลจาก localStorage หรือ jobs.json ครั้งแรก
  useEffect(() => {
    const storedJobs = localStorage.getItem("jobs")
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs))
    } else {
      fetch("/data/jobs.json")
        .then((res) => res.json())
        .then((data) => {
          setJobs(data)
          localStorage.setItem("jobs", JSON.stringify(data))
        })
        .catch((err) => console.error("Failed to load jobs:", err))
    }
  }, [])

  // 🟢 Sync กลับ localStorage ทุกครั้งที่ jobs เปลี่ยน
  useEffect(() => {
    if (jobs.length > 0) {
      localStorage.setItem("jobs", JSON.stringify(jobs))
    }
  }, [jobs])

  // 🟢 ปุ่ม Reset ข้อมูลกลับไปใช้ jobs.json เดิม
  const handleReset = async () => {
    if (confirm("ต้องการรีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้นหรือไม่?")) {
      const res = await fetch("/data/jobs.json")
      const data = await res.json()
      localStorage.setItem("jobs", JSON.stringify(data))
      setJobs(data)
      toast.success("✅ รีเซ็ตข้อมูลสำเร็จแล้ว!")
    }
  }

  // 🧠 ฟังก์ชัน filter
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.id?.toLowerCase().includes(search.toLowerCase()) ||
        job.customer?.toLowerCase().includes(search.toLowerCase())

      const matchesRole =
        role === "" ||
        (role === "manager" && job.lead === "Thastanon") ||
        (role === "technician" && job.lead !== "Thastanon")

      const matchesStatus =
        status === "" ||
        job.status?.toLowerCase() === status.toLowerCase()

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [jobs, search, role, status])

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700"
      case "In Progress":
        return "bg-yellow-100 text-yellow-700"
      case "Pending":
        return "bg-gray-100 text-gray-700"
      case "Approved":
        return "bg-blue-100 text-blue-700"
      case "Rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const handleApprove = (job) => {
    const updated = jobs.map((j) =>
      j.id === job.id ? { ...j, status: "Approved" } : j
    )
    setJobs(updated)
    setShowViewModal(null)
    toast.success("✅ อนุมัติงานแล้ว!")
  }

  const handleReject = (job, note) => {
    const updated = jobs.map((j) =>
      j.id === job.id ? { ...j, status: "Rejected", rejectNote: note } : j
    )
    setJobs(updated)
    setShowViewModal(null)
    toast.error("❌ งานถูกตีกลับแล้ว!")
  }

  const handleSaveEdit = (updatedJob) => {
    const updated = jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
    setJobs(updated)
    setShowEditModal(null)
    toast.success("💾 แก้ไขข้อมูลงานเรียบร้อย!")
  }

  const handleDelete = (job) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้?")) return
    const updated = jobs.filter((j) => j.id !== job.id)
    setJobs(updated)
    setShowEditModal(null)
    toast.error("🗑️ ลบงานสำเร็จแล้ว!")
  }

  return (
    <main>
      <SiteHeader title="Job Management" />

      <section className="p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Job Management</h1>
            <p className="text-muted-foreground">Manage all jobs and assignments</p>
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
              Reset Data
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
              <div>
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

              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
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
            <h2 className="text-lg font-semibold">All Jobs</h2>
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
                {paginatedJobs.length > 0 ? (
                  paginatedJobs.map((job) => (
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
                      className="text-center text-muted-foreground"
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
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    className={
                      currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                    }
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
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
