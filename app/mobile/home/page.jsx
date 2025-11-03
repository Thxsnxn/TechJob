"use client";
import React from "react";
import Link from "next/link";

const page = () => {
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

      {/* Profile section */}
      <main className="px-6 flex-1">
        <div className="max-w-md mx-auto text-center">
          <div className="w-36 h-36 mx-auto rounded-full overflow-hidden shadow-lg">
            <img
              src="https://i.pinimg.com/736x/50/f3/9f/50f39feefd36f890e9a9754dcc09610a.jpg"
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold">กิตติวัฒน์ กุดั่น</h2>
          <p className="text-sm text-gray-600">
            67107666 Sripatum University | Bachelor of Science (Computer Science
            and Software Development Innovation)
          </p>
        </div>

        {/* Action list */}
        <div className="mt-8 max-w-md mx-auto space-y-4">
          <button className="w-full bg-blue-600 text-white rounded-xl py-4 px-4 flex items-center shadow-md focus:outline-none">
            <span className="bg-white/20 rounded-lg p-2 mr-4">
              {/* calendar icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </span>
            <span className="font-medium">ตารางการทำงานของฉัน</span>
          </button>

          <button className="w-full bg-blue-600 text-white rounded-xl py-4 px-4 flex items-center shadow-md focus:outline-none">
            <span className="bg-white/20 rounded-lg p-2 mr-4">
              {/* holiday icon (bookmark) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v16l7-5 7 5V3z"
                />
              </svg>
            </span>
            <span className="font-medium">ปฏิทินวันหยุด</span>
          </button>

          <button className="w-full bg-blue-600 text-white rounded-xl py-4 px-4 flex items-center shadow-md focus:outline-none">
            <span className="bg-white/20 rounded-lg p-2 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
            <span className="font-medium">เมนูที่ว่าง</span>
          </button>

          <button className="w-full bg-blue-600 text-white rounded-xl py-4 px-4 flex items-center shadow-md focus:outline-none">
            <span className="bg-white/20 rounded-lg p-2 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
            <span className="font-medium">เมนูที่ว่าง</span>
          </button>

          <button className="w-full bg-blue-600 text-white rounded-xl py-4 px-4 flex items-center shadow-md focus:outline-none">
            <span className="bg-white/20 rounded-lg p-2 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
            <span className="font-medium">เมนูที่ว่าง</span>
          </button>
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-center">
        <div
          style={{ width: 402 }}
          className="bg-white border-t shadow-inner flex justify-between items-center px-4 py-3"
        >
          <button className="flex flex-col items-center text-blue-600">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1946/1946433.png "
              alt="home"
              className="h-6 w-6"
            />
            <span className="text-xs mt-1">หน้าแรก</span>
          </button>

          <button className="flex flex-col items-center text-gray-600">
            <img
              src="https://cdn-icons-png.flaticon.com/128/6372/6372498.png"
              alt="ot"
              className="h-6 w-6"
            />
            <span className="text-xs mt-1">โอที</span>
          </button>

          <Link
            href="/mobile/home/work"
            className="flex flex-col items-center text-gray-600 transition-transform duration-200 hover:scale-110 active:scale-95"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/2910/2910791.png"
              alt="work"
              className="h-6 w-6"
            />
            <span className="text-xs mt-1">งาน</span>
          </Link>

          <button className="flex flex-col items-center text-gray-600">
            <img
              src="https://cdn-icons-png.flaticon.com/128/18/18436.png"
              alt="help"
              className="h-6 w-6"
            />
            <span className="text-xs mt-1">ช่วยเหลือ</span>
          </button>

          <Link
            href="/mobile/home/profile"
            className="flex flex-col items-center text-gray-600 transition-transform duration-200 hover:scale-110 active:scale-95"
          >
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
