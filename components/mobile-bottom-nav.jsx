"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  BriefcaseBusiness,
  ClockPlus,
  MessageCircleQuestionMark,
} from "lucide-react";
import BottomSheet from "@/components/ui/bottom-sheet";
import { useRouter } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [showOTSheet, setShowOTSheet] = useState(false);

  const linkClass = (path) =>
    `flex flex-col items-center transition-transform duration-200 hover:scale-110 active:scale-95 ${
      pathname === path ? "text-blue-600" : "text-gray-600"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-center z-10">
      <div
        style={{ width: 402 }}
        className="bg-white border-t shadow-inner flex justify-between items-center px-4 py-3"
      >
        <Link href="/mobile/home" className={linkClass("/mobile/home")}>
          <House className="h-6 w-6" />
          <span className="text-xs mt-1">หน้าแรก</span>
        </Link>

        {/* OT button now opens a bottom sheet instead of navigating immediately */}
        <button
          onClick={() => setShowOTSheet(true)}
          className={linkClass("/mobile/ot") + " bg-transparent border-0"}
        >
          <ClockPlus className="h-6 w-6" />
          <span className="text-xs mt-1">โอที</span>
        </button>

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
      <BottomSheet
        isOpen={showOTSheet}
        onClose={() => setShowOTSheet(false)}
        title={"เลือกประเภทการขอโอที"}
      >
        {/* Add outer padding and small gap between option buttons; ensure buttons are clickable */}
        <div className="w-full bg-white rounded-lg border border-gray-200 p-3">
          <button
            type="button"
            onClick={() => {
              setShowOTSheet(false);
              // navigate to ot request page with type param
              router.push("/mobile/beforeot");
            }}
            className="w-full text-left px-4 py-3 bg-white rounded-md cursor-pointer mb-2 border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <div className="text-sm text-gray-800">ก่อนเริ่มทำโอที</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowOTSheet(false);
              router.push("/mobile/otrequest");
            }}
            className="w-full text-left px-4 py-3 bg-white rounded-md cursor-pointer border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <div className="text-sm text-gray-800">ขอโอทีย้อนหลัง</div>
          </button>
        </div>
      </BottomSheet>
    </nav>
  );
}
