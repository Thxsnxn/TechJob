"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { ChevronLeft, ChevronRight, X, Search, Loader2, CalendarDays, MapPin, User, Users } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import apiClient from "@/lib/apiClient";

function getAdminSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem("admin_session");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Cannot read admin_session:", e);
    return null;
  }
}

const JOB_STATUSES = {
  PENDING: { label: "รอดำเนินการ", color: "text-blue-600 bg-blue-50 border-blue-100" },
  IN_PROGRESS: { label: "กำลังดำเนินการ", color: "text-orange-600 bg-orange-50 border-orange-100" },
  COMPLETED: { label: "เสร็จสิ้น", color: "text-green-600 bg-green-50 border-green-100" },
  CANCELLED: { label: "ยกเลิก", color: "text-red-600 bg-red-50 border-red-100" },
};

const getThaiDateString = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  } catch (e) {
    return dateString.split('T')[0];
  }
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Bangkok'
    });
  } catch (e) {
    return dateString;
  }
};

const JobDetailModal = ({ job, isOpen, onClose }) => {
  if (!job) return null;

  const getStatusBadge = (status) => {
    const s = String(status ?? "").trim().toUpperCase().replace(/\s+/g, "_");
    const config = JOB_STATUSES[s] || { label: status, color: "text-gray-600 bg-gray-50 border-gray-100" };
    return (
      <Badge className={`${config.color} border px-3 py-1 text-sm font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const extractCustomerName = (customer) => {
    if (!customer) return "ไม่ระบุชื่อลูกค้า";
    if (typeof customer === "string") return customer;
    const { companyName, contactName, firstName, lastName, code } = customer;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    return companyName || fullName || contactName || code || "ไม่ระบุชื่อลูกค้า";
  };

  const extractCustomerAddress = (customer, fallback) => {
    if (!customer || typeof customer === "string") return fallback || "-";
    return customer.address || fallback || "-";
  };

  const customerName = extractCustomerName(job.customer);
  const address = extractCustomerAddress(job.customer, job.locationAddress || "ไม่ระบุที่อยู่");

  const employees = Array.isArray(job.employees) ? job.employees : [];
  const supervisors = Array.isArray(job.supervisors) ? job.supervisors : [];

  const empList = employees.map((e, idx) => {
    const emp = e.employee || e;
    return [emp.firstName, emp.lastName].filter(Boolean).join(" ") || emp.username || `พนักงาน ${idx + 1}`;
  });

  const supList = supervisors.map((s, idx) => {
    const sup = s.supervisor || s;
    return [sup.firstName, sup.lastName].filter(Boolean).join(" ") || sup.username || `หัวหน้า ${idx + 1}`;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            รายละเอียดงาน
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex-1">
                {job.title || "ไม่ระบุชื่องาน"}
              </h3>
              {getStatusBadge(job.status)}
            </div>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <User className="h-4 w-4" />
              <span className="font-medium">ลูกค้า:</span>
            </div>
            <p className="text-slate-900 dark:text-slate-100 ml-6">{customerName}</p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">สถานที่:</span>
            </div>
            <p className="text-slate-900 dark:text-slate-100 ml-6">{address}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <CalendarDays className="h-4 w-4" />
                <span className="font-medium">วันที่เริ่ม:</span>
              </div>
              <p className="text-slate-900 dark:text-slate-100 ml-6 text-sm">
                {formatDisplayDate(job.startDate)}
              </p>
            </div>
            <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <CalendarDays className="h-4 w-4" />
                <span className="font-medium">วันที่สิ้นสุด:</span>
              </div>
              <p className="text-slate-900 dark:text-slate-100 ml-6 text-sm">
                {formatDisplayDate(job.endDate)}
              </p>
            </div>
          </div>

          {job.description && (
            <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="font-medium text-slate-600 dark:text-slate-400">รายละเอียด:</span>
              <p className="text-slate-900 dark:text-slate-100 whitespace-pre-wrap">{job.description}</p>
            </div>
          )}

          {(supList.length > 0 || empList.length > 0) && (
            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Users className="h-4 w-4" />
                <span className="font-medium">ทีมงาน:</span>
              </div>
              <div className="ml-6 space-y-2">
                {supList.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">หัวหน้างาน:</p>
                    <div className="flex flex-wrap gap-2">
                      {supList.map((name, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {empList.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">พนักงาน:</p>
                    <div className="flex flex-wrap gap-2">
                      {empList.map((name, idx) => (
                        <Badge key={idx} variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            onClick={() => {
              onClose();
              window.location.href = "/work";
            }}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            ไปหน้า Work Orders
          </Button>
          <Button onClick={onClose} variant="outline" className="border-slate-200 dark:border-slate-800">
            ปิด
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const WorkCalendar = ({ jobs, currentDate, onDateChange, isLoading, onEventClick }) => {
  const [isEditing, setIsEditing] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const daysOfWeek = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
  const calendarCells = [];

  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ date: prevMonthDays - firstDayOfMonth + i + 1, isCurrentMonth: false, events: [] });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const currentDayStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;

    const events = jobs
      .filter(job => {
        const start = getThaiDateString(job.startDate);
        const end = getThaiDateString(job.endDate) || start;
        return start && (currentDayStr === start || currentDayStr === end);
      })
      .map(job => {
        const start = getThaiDateString(job.startDate);
        const end = getThaiDateString(job.endDate) || start;

        let typeLabel = "";
        let typeColor = "";

        if (currentDayStr === start && currentDayStr === end) {
          typeLabel = "(จบในวัน)";
          typeColor = "text-green-600";
        } else if (currentDayStr === start) {
          typeLabel = "(เริ่ม)";
          typeColor = "text-green-600";
        } else if (currentDayStr === end) {
          typeLabel = "(สิ้นสุด)";
          typeColor = "text-red-600";
        }

        return {
          status: job.status,
          title: job.title,
          typeLabel: typeLabel,
          typeColor: typeColor,
          jobData: job
        };
      });

    calendarCells.push({
      date: i,
      isCurrentMonth: true,
      isToday: new Date().toDateString() === new Date(year, month, i).toDateString(),
      events
    });
  }

  const nextMonth = () => onDateChange(new Date(year, month + 1, 1));
  const prevMonth = () => onDateChange(new Date(year, month - 1, 1));

  const getEventConfig = (status) => {
    const s = String(status ?? "").trim().toUpperCase().replace(/\s+/g, "_");
    return JOB_STATUSES[s] || { label: s, color: "text-gray-600 bg-gray-50 border-gray-100" };
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleMonthChange = (value) => {
    onDateChange(new Date(year, parseInt(value), 1));
  };

  const handleYearChange = (value) => {
    onDateChange(new Date(parseInt(value), month, 1));
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth} disabled={isLoading} className="h-8 w-8 border-slate-200 dark:border-slate-800"><ChevronLeft className="h-4 w-4" /></Button>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Select value={month.toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[120px] h-8 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((m, index) => (
                    <SelectItem key={index} value={index.toString()}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={year.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[100px] h-8 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <h2 className="text-lg font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1 rounded-md transition-colors text-slate-800 dark:text-slate-200" onClick={() => setIsEditing(true)}>
              {monthNames[month]} {year}
            </h2>
          )}
          <Button variant="outline" size="icon" onClick={nextMonth} disabled={isLoading} className="h-8 w-8 border-slate-200 dark:border-slate-800"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 text-slate-500">
            <Loader2 className="h-10 w-10 animate-spin mb-2 text-blue-600" />
            <p>กำลังโหลดข้อมูลปฏิทิน...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 border-t border-slate-200 dark:border-slate-800">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center py-3 font-semibold text-sm border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400">{day}</div>
            ))}
            {calendarCells.map((cell, index) => (
              <div key={index} className={`min-h-[8rem] p-2 border-r border-b border-slate-200 dark:border-slate-800 flex flex-col transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${!cell.isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-900/50 text-slate-400' : 'bg-white dark:bg-slate-900'} ${cell.isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-sm font-medium ${cell.isToday ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}>
                    {cell.isToday ? <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-full text-xs">{cell.date}</span> : cell.date}
                  </div>
                  {cell.events.length > 0 && (
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-full font-medium">
                      {cell.events.length}
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-1.5 overflow-y-auto max-h-24 scrollbar-hide">
                  {cell.events.slice(0, 3).map((event, idx) => {
                    const config = getEventConfig(event.status);
                    return (
                      <div
                        key={idx}
                        className={`text-[10px] font-medium px-1.5 py-1 rounded border ${config.color} cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1`}
                        title={`${event.title} ${event.typeLabel}`}
                        onClick={() => onEventClick && onEventClick(event.jobData)}
                      >
                        <span className="text-[8px]">
                          {event.typeLabel === "(เริ่ม)" && "🟢"}
                          {event.typeLabel === "(สิ้นสุด)" && "🔴"}
                          {event.typeLabel === "(จบในวัน)" && "⚫"}
                        </span>
                        <span className="truncate flex-1">{event.title}</span>
                      </div>
                    );
                  })}
                  {cell.events.length > 3 && (
                    <div
                      className="text-[10px] text-center text-slate-500 dark:text-slate-400 py-1 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200"
                      onClick={() => cell.events.length > 0 && onEventClick && onEventClick(cell.events[0].jobData)}
                    >
                      +{cell.events.length - 3} เพิ่มเติม
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function Page() {
  const [jobs, setJobs] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getExpandedMonthRange = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const lastDay = new Date(year, month, 0).getDate();
    const dateFrom = `${year}-01-01`;
    const dateTo = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')} 23:59:59`;
    return { dateFrom, dateTo };
  };

  const fetchJobs = useCallback(async () => {
    const session = getAdminSession();
    if (!session) {
      console.warn("No admin session found.");
      return;
    }

    const myEmpCode = session.code || (session.employee && session.employee.code);
    if (!myEmpCode) return;

    const { dateFrom, dateTo } = getExpandedMonthRange(currentDate);

    setIsLoading(true);

    try {
      const response = await apiClient.post("/supervisor/by-code", {
        empCode: myEmpCode,
        search: searchText,
        status: "",
        dateFrom: dateFrom,
        dateTo: dateTo,
        page: 1,
        pageSize: 100
      });

      const responseData = response.data || response;
      setJobs(responseData.items || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, searchText]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchJobs(); }, 500);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const handleEventClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <SiteHeader title="ปฏิทินงาน" />

      <main className="p-4 md:p-6 space-y-8 mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 shadow-lg">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                <CalendarDays className="h-8 w-8" /> ปฏิทินงาน
              </h1>
              <p className="text-purple-100 mt-2 text-lg">
                จัดการและติดตามตารางงานของคุณในรูปแบบปฏิทิน
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="ค้นหางาน..."
                className="pl-9 h-11 bg-white/10 text-white placeholder:text-purple-200 border-white/20 focus-visible:ring-white/30 backdrop-blur-sm"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {Object.values(JOB_STATUSES).map((status, index) => (
            <div key={index} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${status.color}`}>
              <div className={`w-2 h-2 rounded-full bg-current`} />
              {status.label}
            </div>
          ))}
        </div>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-6">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">สัญลักษณ์ประเภทงาน:</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">🟢</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">วันเริ่มงาน</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🔴</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">วันสิ้นสุดงาน</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">⚫</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">งานเริ่มและจบในวันเดียวกัน</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <WorkCalendar
          jobs={jobs}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          isLoading={isLoading}
          onEventClick={handleEventClick}
        />
      </main>

      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}