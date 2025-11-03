"use client";

import React, { useState, useEffect, useMemo } from "react";
// import CreateJobModal from "./app/page/workschedule"
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Pending":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="bg-background">
      <SiteHeader title="Work Schedule" />

      <section className="p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Work Schedule</h1>
            <p className="text-muted-foreground">Manage all Work Schedule</p>
          </div>

          {/* <Button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 w-full md:w-[300px] h-auto md:h-[60px] text-lg md:text-2xl py-3 hover:bg-blue-700 text-white"
                    >
                        + Create New Job213
                    </Button> */}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="space-y-4 py-4">
            {/* First row: Search, Start date, Due date */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Work schedule</label>
                <Input
                  placeholder="Search details Id details Head..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Start</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Second row: Search, Role, Status */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Select details</label>
                <Input
                  placeholder="Search details Id details Head..."
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
                      <SelectValue placeholder="Auto filled Role" />
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
                      <SelectValue placeholder="Auto filled Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inprogress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  <TableHead>Assigned Lead</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedJobs.length > 0 ? (
                  paginatedJobs.map((job, index) => (
                    <TableRow key={index}>
                      <TableCell>{job.id}</TableCell>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.customer}</TableCell>
                      <TableCell>{job.lead}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(job.status)} px-2 py-1`}
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{job.date}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/* <Button variant="outline" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button> */}
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
          </CardContent>
        </Card>
      </section>
      {showCreateModal && (
        <CreateJobModal onClose={() => setShowCreateModal(false)} />
      )}
    </main>
  );
}
