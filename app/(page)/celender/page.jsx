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

  // Previous month days for padding (Desktop version)
  const prevMonthDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    prevMonthDays.push(
      <div
        key={`prev-${i}`}
        className="h-32 p-2 border-b border-r border-gray-100 bg-gray-50 text-gray-400" // ⭐️ Cell มีความสูง, border, และ bg สีเทา
      >
        {new Date(2025, 9, 31 - i).getDate()}
      </div>
    );
  }

  // Current month days (Desktop version)
  const monthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const eventForThisDay = calendarEvents.find((event) => event.day === i);

    monthDays.push(
      <div
        key={`day-${i}`}
        className="h-32 p-2 border-b border-r border-gray-100 relative flex flex-col items-start" // ⭐️ Cell มีความสูง, border, และจัดชิดซ้ายบน
      >
        <span className="font-medium">{i}</span> {/* ตัวเลขวัน */}
        
        {eventForThisDay && (
          <div className="mt-1 w-full">
            <span
              className={`${eventForThisDay.colorClass} text-white text-xs px-2 py-0.5 rounded-md whitespace-nowrap`} // ⭐️ ปรับขนาด Font และ Padding
            >
              {eventForThisDay.text}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    // ⭐️ [Layout] เปลี่ยนเป็น bg-gray-100 และไม่มี max-w
    <div className="min-h-screen bg-gray-100">
      
      {/* Header */}
      <header className="fixed w-full top-0 bg-white border-b z-50 shadow-sm">
        {/* ⭐️ [Layout] เพิ่ม max-w-7xl mx-auto ข้างใน */}
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link href="/mobile/home">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-semibold text-blue-600">Tech Job</h1>
          </div>
          <div className="text-sm font-medium">ปฏิทิน</div>
        </div>
      </header>

      {/* ⭐️ [Layout] เพิ่ม max-w-7xl mx-auto และ pt-20 */}
      <main className="pt-20 px-4 pb-20 max-w-7xl mx-auto">
        {/* ⭐️ [Card] เพิ่ม shadow และ padding */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          
          {/* Month and Year */}
          <div className="text-xl font-semibold mb-6 text-center">
            November 2025
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold p-2 text-blue-600" // ⭐️ แก้เป็น font-semibold และ p-2
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
           {/* ⭐️ [Grid] ใช้ border-t และ border-l เพื่อเริ่มตาราง */}
          <div className="grid grid-cols-7 border-t border-l border-gray-100">
            {prevMonthDays.reverse()}
            {monthDays}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calendar;