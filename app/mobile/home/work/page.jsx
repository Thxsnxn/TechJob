'use client'; // <-- [แก้ไข 1] เพิ่มบรรทัดนี้

import React, { useState } from "react";
import Link from "next/link";

const filterLabels = {
  all: { label: "All", color: "#3b82f6" }, // สีฟ้า
  pending: { label: "Pending", color: "#f59e0b" }, // สีส้ม
  inprogress: { label: "In Progress", color: "#ef4444" }, // สีแดง
  awaiting: { label: "Awaiting", color: "#06b6d4" }, // สีฟ้าอ่อน
  complete: { label: "Complete", color: "#22c55e" }, // สีเขียว
  reject: { label: "Reject", color: "#9333ea" }, // สีม่วง
  cancel: { label: "Cancel", color: "#eab308" }, // สีเหลือง
};

// ข้อมูลตัวอย่างงาน
const jobData = [
  {
    id: 1,
    branch: "Big C | สาขา บลาบลาฯๆ",
    customer: "ปลาทูตัวใหญ่ๆ",
    leadEngineer: "Cynthialyn",
    assignedBy: "แจ็กแปปเปิ้ล",
    status: "pending",
  },
  {
    id: 2,
    branch: "Big C | สาขา บางนา",
    customer: "ปลาทูตัวใหญ่ๆ",
    leadEngineer: "Cynthialyn",
    assignedBy: "แจ็กแปปเปิ้ล",
    status: "inprogress",
  },
  {
    id: 3,
    branch: "Big C | สาขา พระราม 4",
    customer: "ปลาทูตัวใหญ่ๆ",
    leadEngineer: "Cynthialyn",
    assignedBy: "แจ็กแปปเปิ้ล",
    status: "awaiting",
  },
  {
    id: 4,
    branch: "Big C | สาขา ลาดพร้าว",
    customer: "ปลาทูตัวใหญ่ๆ",
    leadEngineer: "Cynthialyn",
    assignedBy: "แจ็กแปปเปิ้ล",
    status: "complete",
  },
  {
    id: 5,
    branch: "Big C | สาขา บลาบลาฯๆ",
    customer: "ปลาทูตัวใหญ่ๆ",
    leadEngineer: "Cynthialyn",
    assignedBy: "แจ็กแปปเปิ้ล",
    status: "reject",
    startDate: "13/11/68",
    endDate: "สิ้นสุด"
  },
  {
    id: 6,
    branch: "Big C | สาขา รัชดา",
    customer: "ปลาทูตัวใหญ่ๆ",
    leadEngineer: "Cynthialyn",
    assignedBy: "แจ็กแปปเปิ้ล",
    status: "cancel",
  },
];

const page = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // กรองงานตามสถานะที่เลือก
  const filteredJobs = jobData.filter(job => {
    if (selectedFilter === "all") return true;
    return job.status === selectedFilter.toLowerCase();
  });

  return (
    <div
      className="bg-white text-gray-900 flex flex-col"
      style={{ width: 402, margin: "0 auto" }}
    >
      {/* Header */}
      <header className="px-4 pt-6 pb-2 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-blue-600">Tech Job</h1>
        <button aria-label="notifications" className="text-gray-600">
          {/* Bell icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      </header>

      {/* Main content: งาน */}
      <main className="px-4 flex-1 pb-24">
        {/* Filters */}
        <div className="flex items-center justify-end mb-4 relative">
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded-full font-semibold shadow flex items-center"
            onClick={() => setShowFilters((prev) => !prev)}
            style={{ minWidth: 80 }}
          >
            {filterLabels[selectedFilter].label}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showFilters && (
            <div className="absolute right-0 top-10 z-10 bg-white rounded-xl shadow-lg py-2 px-2 w-32" style={{ minWidth: 100 }}>
              {Object.entries(filterLabels).map(([key, { label, color }]) => (
                <button
                  key={key}
                  className={`flex items-center w-full px-2 py-1 rounded-lg mb-1 text-sm font-semibold ${selectedFilter === key ? 'bg-gray-100' : ''}`}
                  onClick={() => { setSelectedFilter(key); setShowFilters(false); }}
                >
                  <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ background: color, border: '2px solid #eee' }}></span>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Card ตัวอย่างงาน */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="font-semibold text-base">{job.branch}</div>
              <div className="text-sm text-gray-600">Customer : {job.customer}</div>
              <div className="text-sm text-gray-600">Lead Engineer : {job.leadEngineer}</div>
              <div className="text-sm text-gray-600 mb-2">Assigned by : {job.assignedBy}</div>
              <div className="flex items-center justify-between">
                <span 
                  className="text-white px-3 py-1 rounded-lg text-xs font-bold shadow"
                  style={{ backgroundColor: filterLabels[job.status].color }}
                >
                  {filterLabels[job.status].label}
                </span>
                {job.status === "reject" ? (
                  <span className="text-xs text-gray-500">
                    เริ่ม {job.startDate} - {job.endDate}
                  </span>
                ) : (
                  <span className="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-center">
        <div
          style={{ width: 402 }}
          className="bg-white border-t shadow-inner flex justify-between items-center px-4 py-3"
        >
          <Link href="/mobile/home" className="flex flex-col items-center text-gray-600 transition-transform duration-200 hover:scale-110 active:scale-95">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png"
              alt="home"
              className="h-6 w-6"
            />
            <span className="text-xs mt-1">หน้าแรก</span>
          </Link>

          <Link href="/mobile/home/ot" className="flex flex-col items-center text-gray-600 transition-transform duration-200 hover:scale-110 active:scale-95">
            <img
              src="https://cdn-icons-png.flaticon.com/128/6372/6372498.png"
              alt="ot"
              className="h-6 w-6"
            />
            <span className="text-xs mt-1">โอที</span>
          </Link>

          <Link href="/mobile/home/work" className="flex flex-col items-center text-blue-600 transition-transform duration-200 hover:scale-110 active:scale-95">
            <img
              src="https://cdn-icons-png.flaticon.com/128/10147/10147580.png"
              alt="work"
              className="h-6 w-6"
            />
            <span className="text-xs mt-1">งาน</span>
          </Link>

          <Link href="/mobile/home/help" className="flex flex-col items-center text-gray-600 transition-transform duration-200 hover:scale-110 active:scale-95">
            <img
              src="https://cdn-icons-png.flaticon.com/128/18/18436.png"
              alt="help"
              className="h-6 w-6"
            />
            <span className="text-xs mt-1">ช่วยเหลือ</span>
          </Link>

          <Link href="/mobile/home/profile" className="flex flex-col items-center text-gray-600 transition-transform duration-200 hover:scale-110 active:scale-95">
            <div className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all">
              <img
                src="https://i.pinimg.com/736x/50/f3/9f/50f39feefd36f890e9a9754dcc09610a.jpg"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs mt-1">โปรไฟล์</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default page;