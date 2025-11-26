"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { ChevronLeft, ChevronRight, X, Search, Loader2, CalendarDays } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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

// --- CONFIG: สีของหัวข้องาน (ตามสถานะ) ---
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

// รับ prop isLoading เข้ามาเพิ่ม
const WorkCalendar = ({ jobs, currentDate, onDateChange, isLoading }) => {
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
          typeColor: typeColor
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

  // Generate year options (current year +/- 5)
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
        {/* ถ้า isLoading เป็น true ให้แสดง Loading Spinner แทนตาราง */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 text-slate-500">
            <Loader2 className="h-10 w-10 animate-spin mb-2 text-blue-600" />
            <p>กำลังโหลดข้อมูลปฏิทิน...</p>
          </div>
        ) : (
          // ถ้าไม่โหลด แสดงตารางตามปกติ
          <div className="grid grid-cols-7 border-t border-slate-200 dark:border-slate-800">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center py-3 font-semibold text-sm border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400">{day}</div>
            ))}
            {calendarCells.map((cell, index) => (
              <div key={index} className={`min-h-[8rem] p-2 border-r border-b border-slate-200 dark:border-slate-800 flex flex-col transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${!cell.isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-900/50 text-slate-400' : 'bg-white dark:bg-slate-900'} ${cell.isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                <div className={`text-right text-sm mb-2 font-medium ${cell.isToday ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}>
                  {cell.isToday ? <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-full text-xs">{cell.date}</span> : cell.date}
                </div>
                <div className="flex-1 space-y-1.5 overflow-y-auto max-h-24 scrollbar-hide">
                  {cell.events.map((event, idx) => {
                    const config = getEventConfig(event.status);
                    return (
                      <div
                        key={idx}
                        className={`text-[10px] font-medium truncate px-1.5 py-1 rounded border ${config.color}`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    );
                  })}
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
  const [isLoading, setIsLoading] = useState(false); // 1. สร้าง State สำหรับ Loading

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

    // 2. เริ่มโหลด: ตั้งค่าเป็น true
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
      // 3. จบการทำงาน (ไม่ว่าจะ error หรือไม่): ตั้งค่ากลับเป็น false
      setIsLoading(false);
    }
  }, [currentDate, searchText]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchJobs(); }, 500);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <SiteHeader title="ปฏิทินงาน" />

      <main className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
        {/* Banner Section */}
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

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {Object.values(JOB_STATUSES).map((status, index) => (
            <div key={index} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${status.color}`}>
              <div className={`w-2 h-2 rounded-full bg-current`} />
              {status.label}
            </div>
          ))}
        </div>

        {/* Calendar Component */}
        <WorkCalendar
          jobs={jobs}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}