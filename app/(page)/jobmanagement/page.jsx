"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
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
}
  from "@/components/ui/table"
import { SiteHeader } from "@/components/site-header"
import { Eye, Pencil, RotateCcw, Loader2, CalendarDays, MapPin } from "lucide-react"
import { DatePicker } from "antd"
import dayjs from "dayjs"
import ViewJobModal from "./ViewJobModal"
import EditJobModal from "./EditJobModal"
import { toast } from "sonner"
import apiClient from "@/lib/apiClient"

// --- Helper Functions (Copied/Adapted from work/page.jsx) ---

const apiToUiStatus = {
  IN_PROGRESS: "In Progress",
  PENDING_REVIEW: "Pending Review",
  NEED_FIX: "Need Fix",
  COMPLETED: "Completed",
};

const uiToApiStatus = {
  all: undefined,
  "in progress": "IN_PROGRESS",
  "pending review": "PENDING_REVIEW",
  "need fix": "NEED_FIX",
  "completed": "COMPLETED",
};

function getAdminSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem("admin_session");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.error("Cannot read admin_session:", e);
    return null;
  }
}

function getEmpCodeFromSession(session) {
  if (!session) return null;
  return session.code ?? null;
}

function extractCustomerName(customer) {
  if (!customer) return "ไม่ระบุชื่อลูกค้า";
  if (typeof customer === "string") return customer;
  const { companyName, contactName, firstName, lastName, code } = customer;
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  return companyName || fullName || contactName || code || "ไม่ระบุชื่อลูกค้า";
}

function extractCustomerAddress(customer, fallback) {
  if (!customer || typeof customer === "string") return fallback || "-";
  return customer.address || fallback || "-";
}

function formatWorkDateRange(start, end) {
  if (!start && !end) return null;
  const fmt = (d) =>
    new Date(d).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  if (start && end) return `${fmt(start)} - ${fmt(end)}`;
  if (start) return fmt(start);
  if (end) return fmt(end);
  return null;
}

function mapApiWorkToUi(work, index) {
  const uiStatus = apiToUiStatus[work.status] || work.status || "In Progress";
  const customerObj = work.customer || null;
  const customerName = extractCustomerName(customerObj);
  const address = extractCustomerAddress(
    customerObj,
    work.locationAddress || "ไม่ระบุที่อยู่"
  );

  // 1. Employees
  const employees = Array.isArray(work.employees) ? work.employees : [];
  const empList = employees.map((e, idx) => {
    const emp = e.employee || e;
    const name =
      [emp.firstName, emp.lastName].filter(Boolean).join(" ") ||
      emp.username ||
      `พนักงาน ${idx + 1}`;
    return {
      id: emp.id || e.id || `emp-${idx}`,
      name,
      role: "EMPLOYEE",
      avatar:
        emp.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random`,
      position: emp.position || "-",
      workStatus: emp.workStatus || emp.workstatus || "FREE",
    };
  });

  // 2. Supervisors
  const supervisors = Array.isArray(work.supervisors) ? work.supervisors : [];
  const supList = supervisors.map((s, idx) => {
    const sup = s.supervisor || s;
    const name =
      [sup.firstName, sup.lastName].filter(Boolean).join(" ") ||
      sup.username ||
      `หัวหน้า ${idx + 1}`;
    return {
      id: sup.id || s.id || `sup-${idx}`,
      name,
      role: "SUPERVISOR",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random`,
      position: "Supervisor",
      workStatus: sup.workStatus || sup.workstatus || "FREE",
    };
  });

  const staffList = [...supList, ...empList];

  let leadEngineerName = "ไม่ระบุหัวหน้างาน";
  if (supList.length > 0) {
    leadEngineerName = supList[0].name;
  }

  const latRaw = work.locationLat ?? work.lat ?? null;
  const lngRaw = work.locationLng ?? work.lng ?? null;
  const lat =
    latRaw !== null && latRaw !== undefined && latRaw !== ""
      ? Number(latRaw)
      : null;
  const lng =
    lngRaw !== null && lngRaw !== undefined && lngRaw !== ""
      ? Number(lngRaw)
      : null;

  const locationName =
    (typeof work.locationName === "string" &&
      work.locationName.trim() !== "" &&
      work.locationName.trim()) ||
    customerName;

  return {
    id: work.id ?? work.workOrderId ?? index + 1,
    title: work.title || "ไม่ระบุชื่องาน",
    customer: customerName,
    customerObj: customerObj, // Pass full customer object
    leadEngineer: leadEngineerName,
    assignedBy: "-",
    status: uiStatus,
    dateRange:
      work.dateRange || formatWorkDateRange(work.startDate, work.endDate),
    description: work.description || "-",
    note: work.note || work.notes || null,
    address,
    assignedStaff: staffList,
    locationName,
    lat,
    lng,
    // Keep raw object for modals if needed
    raw: work,
  };
}

export default function Page() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all") // Default to 'all'
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [viewJob, setShowViewModal] = useState(null)
  const [editJob, setShowEditModal] = useState(null)

  // Updated Default Date (Empty to show all by default)
  const [dateRange, setDateRange] = useState([null, null])
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const itemsPerPage = 50

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)

      const session = getAdminSession();
      const empCode = getEmpCodeFromSession(session);

      if (!empCode) {
        console.warn("No empCode found in session");
      }

      const payload = {
        empCode: empCode,
        search: search || undefined,
        status: uiToApiStatus[status],
        dateFrom: dateFrom || undefined, // Send undefined if empty
        dateTo: dateTo || undefined,     // Send undefined if empty
        page: currentPage,
        pageSize: itemsPerPage
      }

      console.log("Fetching API with payload:", payload)

      const response = await apiClient.post("/supervisor/by-code", payload)
      console.log("API Response:", response.data)

      const rawItems = response.data?.items || response.data?.data || response.data?.rows || []
      const total = response.data?.totalPages || (response.data?.total ? Math.ceil(response.data.total / itemsPerPage) : 1)

      const mappedJobs = rawItems.map((job, index) => mapApiWorkToUi(job, index))

      setJobs(mappedJobs)
      setTotalPages(total)

    } catch (error) {
      console.error("Failed to fetch jobs:", error)
      toast.error("ไม่สามารถดึงข้อมูลงานได้")
    } finally {
      setLoading(false)
    }
  }, [search, status, currentPage, dateFrom, dateTo])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs()
    }, 500)

    return () => clearTimeout(timer)
  }, [fetchJobs])

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || ""
    if (s === "completed") return "bg-green-100 text-green-700"
    if (s.includes("progress")) return "bg-blue-100 text-blue-700"
    if (s.includes("review")) return "bg-purple-100 text-purple-700"
    if (s.includes("fix")) return "bg-red-100 text-red-700"
    return "bg-gray-100 text-gray-700"
  }

  const handleReset = () => {
    setSearch("")
    setStatus("all")
    setCurrentPage(1)
    setDateRange([null, null])
    setDateFrom("")
    setDateTo("")
    setShowEditModal(null)
    toast.success("💾 แก้ไขข้อมูลงานเรียบร้อย (Simulation)")
  }

  const handleDelete = (job) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้?")) return
    // Simulation
    const updated = jobs.filter((j) => j.id !== job.id)
    setJobs(updated)
    setShowEditModal(null)
    toast.error("🗑️ ลบงานสำเร็จแล้ว (Simulation)")
  }

  const handleSaveEdit = (updatedJob) => {
    // Simulation
    const updated = jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
    setJobs(updated)
    setShowEditModal(null)
    toast.success("💾 แก้ไขข้อมูลงานเรียบร้อย (Simulation)")
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
          <CardContent className="grid md:grid-cols-4 gap-4 py-4">
            <div className="md:col-span-1">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search job id, title or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="md:col-span-1">
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="pending review">Pending Review</SelectItem>
                  <SelectItem value="need fix">Need Fix</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="mt-1">
                <DatePicker.RangePicker
                  className="w-full h-10"
                  value={dateRange}
                  onChange={(dates) => {
                    setDateRange(dates)
                    if (dates) {
                      setDateFrom(dates[0] ? dayjs(dates[0]).format("YYYY-MM-DD") : "")
                      setDateTo(dates[1] ? dayjs(dates[1]).format("YYYY-MM-DD") : "")
                    } else {
                      setDateFrom("")
                      setDateTo("")
                    }
                  }}
                />
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
                  <TableHead>No.</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : jobs.length > 0 ? (
                  jobs.map((job, index) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{job.title}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {job.locationName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{job.customer}</TableCell>
                      <TableCell>{job.leadEngineer}</TableCell>
                      <TableCell className="text-sm">
                        {job.dateRange}
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2 overflow-hidden">
                          {job.assignedStaff?.length > 0 ? (
                            job.assignedStaff.slice(0, 3).map((staff) => (
                              <img
                                key={staff.id}
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                                src={staff.avatar}
                                alt={staff.name}
                                title={staff.name}
                              />
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                          {job.assignedStaff?.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 ring-2 ring-white font-medium">
                              +{job.assignedStaff.length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
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
                          onClick={() => setShowEditModal(job.raw || job)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
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