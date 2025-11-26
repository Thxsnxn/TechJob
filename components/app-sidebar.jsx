"use client";

import React, { useMemo } from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";

import {
  CircleGauge,
  SquareChartGantt,
  UserCog,
  ClockPlus,
  BellRing,
  BriefcaseBusiness,
  Flag,
  CalendarDays,
  Package,
  Settings,
  History,
  Phone,
  Map,
  Database, // เพิ่มไอคอน Database
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { getAdminSession } from "@/lib/adminSession";

// ✅ แปลง Mapping ให้เป็นภาษาไทย
const ROLE_MENU = {
  CEO: [
    "แดชบอร์ด",
    "รายงาน",
    "ตั้งค่า",
    "การแจ้งเตือน",
    "แผนที่",
    "งานของฉัน",
    "จัดการงาน",
    "ผู้ใช้งานและลูกค้า",
    "จัดการคลังสินค้า",
    "ข้อมูลหลัก", // เพิ่มสิทธิ์ให้ CEO
    "จัดการรายงาน",
    "ปฏิทิน",
    "แบบฟอร์มเริ่มโครงการ"
  ],
  ADMIN: [
    "จัดการงาน",
    "ผู้ใช้งานและลูกค้า",
    "จัดการคลังสินค้า",
    "แบบฟอร์มเริ่มโครงการ",
    "ข้อมูลหลัก", // เพิ่มสิทธิ์ให้ ADMIN
    "จัดการรายงาน",
    "การแจ้งเตือน",
    "ตั้งค่า",
    "แผนที่",
  ],
  SUPERVISOR: [
    "รายงาน",
    "ตั้งค่า",
    "การแจ้งเตือน",
    "จัดการคลังสินค้า",
    "ปฏิทิน",
    "งานของฉัน",
    "แผนที่",
  ],
  EMPLOYEE: [
    "งานของฉัน",
    "การแจ้งเตือน",
    "ตั้งค่า",
    "รายงาน",
    "ปฏิทิน",
    "แผนที่",
  ],
};

// ✅ แปลง Title เป็นภาษาไทย
const BASE_NAV_ITEMS = [
  { title: "แดชบอร์ด", url: "/dashboard", icon: <CircleGauge />, },
  { title: "แบบฟอร์มเริ่มโครงการ", url: "/projectform", icon: <SquareChartGantt />, },

  { title: "จัดการงาน", url: "/jobmanagement", icon: <SquareChartGantt />, },
  { title: "ผู้ใช้งานและลูกค้า", url: "/userscustomers", icon: <UserCog /> },


  { title: "งานของฉัน", url: "/work", icon: <BriefcaseBusiness /> },
  { title: "จัดการคลังสินค้า", url: "/inventorysmanagement", icon: <Package /> },
  { title: "ข้อมูลหลัก", url: "/master-data", icon: <Database /> },

  { title: "ปฏิทิน", url: "/calendar", icon: <CalendarDays /> },
  { title: "รายงาน", url: "/reports", icon: <Flag /> },
  { title: "จัดการรายงาน", url: "/reportsmanagement", icon: <Flag /> },
  { title: "การแจ้งเตือน", url: "/notifications", icon: <BellRing />, },
  { title: "ตั้งค่า", url: "/settings", icon: <Settings /> },
  { title: "แผนที่", url: "/map", icon: <Map /> },

];

export default function AppSidebar(props) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const session = getAdminSession();
  const role = session?.role || "EMPLOYEE";

  const user = useMemo(
    () => ({
      name: session?.name || "Guest",
      role,
      avatar:
        "https://i.scdn.co/image/ab67616d0000b2733c249d0e0fb353891c99179a",
    }),
    [session, role]
  );

  const navItems = useMemo(() => {
    const allowedTitles = ROLE_MENU[role] || [];
    return BASE_NAV_ITEMS.filter((item) =>
      allowedTitles.includes(item.title)
    );
  }, [role]);

  if (!mounted) {
    return null;
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              {/* ✅ ลิงก์ไปหน้า Home */}
              <a href="/home">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Tech Job</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}