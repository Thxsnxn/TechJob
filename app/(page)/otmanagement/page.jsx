"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function OTManagementPage() {
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState("")
  const [type, setType] = useState("")
  const [status, setStatus] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // โหลดข้อมูลจำลองจากไฟล์ JSON
  useEffect(() => {
    fetch("/data/overtime.json")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("Failed to load overtime data:", err))
  }, [])

  // ฟังก์ชันกรองข้อมูล
  const normalize = (s) =>
    String(s ?? "").trim().toLowerCase().replace(/\s+/g, "")
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.name.toLowerCase().includes(search.toLowerCase()) ||
        req.jobId.toLowerCase().includes(search.toLowerCase())

      const matchesType =
        type === "" || normalize(req.type) === normalize(type)

      const matchesStatus =
        status === "" || normalize(req.status) === normalize(status)

      return matchesSearch && matchesType && matchesStatus
    })
  }, [requests, search, type, status])

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusColor = (status) => {
    if (status === "Real-time")
      return "bg-blue-100 text-blue-700 border border-blue-200"
    if (status === "Retrospective")
      return "bg-purple-100 text-purple-700 border border-purple-200"
    return "bg-gray-100 text-gray-700"
  }

  return (
    <main className="bg-background">
      <SiteHeader title="OT Management" />

      <section className="p-6 space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold">Overtime Requests Management</h1>
          <p className="text-muted-foreground">
            Management overtime for <span className="text-black font-medium">Engineer</span>
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="grid md:grid-cols-3 gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Filled Engineer</label>
              <Input
                placeholder="Search customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex gap-4 md:col-span-2">
              <div>
                <label className="text-sm font-medium">Types</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Auto filled Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real-time">Real-time</SelectItem>
                    <SelectItem value="retrospective">Retrospective</SelectItem>
                  </SelectContent>
                </Select>
              </div>
  
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Auto filled Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">All Overtime Requests</h2>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>OT Period</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((req, index) => (
                    <TableRow key={index}>
                      <TableCell>{req.id}</TableCell>
                      <TableCell>{req.name}</TableCell>
                      <TableCell>{req.jobId}</TableCell>
                      <TableCell>{req.date}</TableCell>
                      <TableCell>{req.period}</TableCell>
                      <TableCell>{req.hours}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(req.type)} px-3 py-1 text-sm font-medium`}
                        >
                          {req.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No overtime requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
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
                  className={currentPage === i + 1 ? "bg-blue-600 text-white" : ""}
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
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
