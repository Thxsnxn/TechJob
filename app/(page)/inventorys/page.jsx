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

  // Normalize status and return consistent badge color classes
  const getStatusColor = (status) => {
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

  return (
    <main className="bg-background">
      <SiteHeader title="Inventory" />

      <section className="p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Inventory</h1>
            <p className="text-muted-foreground">Manage all</p>
          </div>
        </div>
























      </section>
      {showCreateModal && (
        <CreateJobModal onClose={() => setShowCreateModal(false)} />
      )}
    </main>
  );
}
