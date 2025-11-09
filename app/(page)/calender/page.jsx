"use client";

import React, { useState, useEffect, useMemo } from "react";
// import CreateJobModal from "./app/page/workschedule"
import { Button } from "@/components/ui/button";
// (Imports ที่ไม่จำเป็นถูกลบออก เช่น Input, Select, Table)
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header"; // สมมติว่าไฟล์นี้มีอยู่จริง
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- START: Work Calendar Component Placeholder ---
const WorkCalendar = ({ jobs }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, ...
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const calendarCells = [];

  // Padding days from previous month
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ 
      date: prevMonthDays - firstDayOfMonth + i + 1, 
      isCurrentMonth: false, 
      events: [] 
    });
  }

  // Days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    const events = jobs
      .filter(job => job.date === dateString) // กรองงานที่ตรงกับวันที่
      .map(job => ({ 
        title: job.title, 
        status: job.status 
      }));

    calendarCells.push({ 
      date: i, 
      isCurrentMonth: true, 
      isToday: new Date().toDateString() === new Date(year, month, i).toDateString(),
      events 
    });
  }

  // Next button logic
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Prev button logic
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  // Logic to determine event color/style (simplified)
  const getEventColor = (status) => {
    const s = String(status ?? "").trim().toLowerCase().replace(/\s+/g, "");
    switch (s) {
      case "completed":
        return "text-green-500"; // สีเขียว
      case "inprogress":
        return "text-yellow-500"; // สีเหลือง (เหมือนในรูปของคุณ)
      case "pending":
        return "text-blue-500"; // สีน้ำเงิน
      default:
        return "text-gray-500";
    }
  };


  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="text-black dark:text-white">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {monthNames[month]} {year}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth} className="text-black dark:text-white">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {/* (ส่วนของปุ่ม Month/Year ถูกลบออกแล้ว) */}
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-t border-gray-200 dark:border-gray-700">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center py-2 font-medium text-sm border-b border-gray-200 dark:border-gray-700 text-black dark:text-white">
              {day}
            </div>
          ))}
          {calendarCells.map((cell, index) => (
            <div 
              key={index}
              className={`h-24 p-2 border-r border-b border-gray-200 dark:border-gray-700 
                ${!cell.isCurrentMonth ? 'text-muted-foreground opacity-50' : 'text-black dark:text-white'}
                ${cell.isToday ? 'border-2 border-blue-500' : ''}
              `}
            >
              <div className="text-right font-bold text-lg mb-1 text-black dark:text-white">{cell.date}</div>
              <div className="space-y-0.5 overflow-y-auto max-h-16">
                {cell.events.map((event, eventIndex) => (
                  <div key={eventIndex} className={`text-xs truncate ${getEventColor(event.status)}`}>
                    • {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
// --- END: Work Calendar Component Placeholder ---


export default function Page() {
  const [jobs, setJobs] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // โหลดข้อมูลจาก jobs.json (ยังคงจำเป็นสำหรับปฏิทิน)
  useEffect(() => {
    fetch("/data/jobs.json")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Failed to load jobs:", err));
  }, []);

  return (
    <main className="bg-white dark:bg-gray-900 min-h-screen">
      <SiteHeader title="Calendar" />

      <section className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">Calendar</h1>
            <p className="text-muted-foreground"></p>
          </div>
          {/* <Button ...> + Create New Job213 </Button> */}
        </div>

        {/* --- NEW: Work Calendar Section --- */}
        <div className="pb-4">
          <WorkCalendar jobs={jobs} /> 
          {/* Note: WorkCalendar ใช้ข้อมูล 'jobs' ทั้งหมดเพื่อแสดงผลงานบนปฏิทิน */}
        </div>
        
        {/* (Filters and Table are removed) */}

      </section>
      
      {/* {showCreateModal && (
        <CreateJobModal onClose={() => setShowCreateModal(false)} />
      )} 
      */}
    </main>
  );
}