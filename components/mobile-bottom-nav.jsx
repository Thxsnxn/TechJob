"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  BriefcaseBusiness,
  ClockPlus,
  MessageCircleQuestionMark,
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname() || "";

  const linkClass = (path) =>
    `flex flex-col items-center transition-transform duration-200 hover:scale-110 active:scale-95 ${
      pathname === path ? "text-blue-600" : "text-gray-600"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-center">
      <div
        style={{ width: 402 }}
        className="bg-white border-t shadow-inner flex justify-between items-center px-4 py-3"
      >
        <Link href="/mobile/home" className={linkClass("/mobile/home")}>
          <House className="h-6 w-6" />
          <span className="text-xs mt-1">หน้าแรก</span>
        </Link>

        <Link href="/mobile/ot" className={linkClass("/mobile/ot")}>
          <ClockPlus className="h-6 w-6" />
          <span className="text-xs mt-1">โอที</span>
        </Link>

        <Link href="/mobile/work" className={linkClass("/mobile/work")}>
          <BriefcaseBusiness className="h-6 w-6" />
          <span className="text-xs mt-1">งาน</span>
        </Link>

        <Link href="/mobile/help" className={linkClass("/mobile/help")}>
          <MessageCircleQuestionMark className="h-6 w-6" />
          <span className="text-xs mt-1">ช่วยเหลือ</span>
        </Link>

        <Link href="/mobile/profile" className={linkClass("/mobile/profile")}>
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
  );
}
