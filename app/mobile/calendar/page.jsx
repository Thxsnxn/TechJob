"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const Calendar = () => {
  const currentDate = new Date(2025, 10); // November 2025
  const daysInMonth = new Date(2025, 11, 0).getDate();
  const firstDayOfMonth = new Date(2025, 10, 1).getDay();

  // [1] list ของ Events
  const calendarEvents = [
    {
      day: 1,
      text: "Pending",
      colorClass: "bg-orange-500",
    },
    {
      day: 11,
      text: "In progress",
      colorClass: "bg-[#FF5B3E]",
    },
  ];

  // Previous month days for padding
  const prevMonthDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    prevMonthDays.push(
      <div key={`prev-${i}`} className="text-gray-400 p-2 text-center">
        {new Date(2025, 9, 31 - i).getDate()}
      </div>
    );
  }

  // Current month days
  const monthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const eventForThisDay = calendarEvents.find((event) => event.day === i);

    monthDays.push(
      <div
        key={`day-${i}`}
        className="p-2 text-center relative flex flex-col items-center"
      >
        <span>{i}</span>
        
        {eventForThisDay && (
          <div>
            {/* ⭐️ FIX 1: เพิ่ม whitespace-nowrap เพื่อไม่ให้ตัดคำ */}
            <span
              className={`${eventForThisDay.colorClass} text-white text-[10px] px-1 rounded whitespace-nowrap`}
            >
              {eventForThisDay.text}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-[402px] mx-auto relative">
      {/* Header */}
      <header className="fixed w-full max-w-[402px] top-0 bg-white border-b z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link href="/mobile/home">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-semibold text-blue-600">Tech Job</h1>
          </div>
          <div className="text-sm font-medium">ปฏิทิน</div>
        </div>
      </header>

      {/* Calendar */}
      <main className="pt-16 px-4 pb-20">
        <div className="bg-white rounded-xl p-4">
          {/* Month and Year */}
          <div className="text-xl font-semibold mb-6 text-center">
            November 2025
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 mb-4 text-blue-600 text-bold">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium p-4">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
           {/* ⭐️ FIX 2: ลด gap-10 ลงเหลือ gap-2 (หรือ 4) */}
          <div className="grid grid-cols-7 gap-2">
            {prevMonthDays.reverse()}
            {monthDays}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calendar;