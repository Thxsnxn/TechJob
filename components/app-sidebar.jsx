"use client";

import React, { useMemo } from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import {
  CircleGauge,
  SquareChartGantt,
  UserCog,
  BellRing,
  BriefcaseBusiness,
  Flag,
  CalendarDays,
  Package,
  Settings,
  Map,
  Database,
  User,
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
    // "การแจ้งเตือน",
    "แผนที่",
    "โปรไฟล์",
    "ตั้งค่า",

    // "งานของฉัน",
    // "จัดการงาน",
    // "ผู้ใช้งานและลูกค้า",
    // "จัดการคลังสินค้า",
    // "ข้อมูลหลัก",
    // "จัดการรายงาน",
    // "ปฏิทิน",
    // "แบบฟอร์มเริ่มโครงการ",
    // เพิ่มสิทธิ์ให้ CEO
  ],
  ADMIN: [
    "จัดการงาน",
    "ผู้ใช้งานและลูกค้า",
    "จัดการคลังสินค้า",
    "แบบฟอร์มเริ่มโครงการ",
    "ข้อมูลหลัก",
    "การแจ้งเตือน",
    "ตั้งค่า",
    "แผนที่",
    "โปรไฟล์" // เพิ่มสิทธิ์ให้ ADMIN
  ],
  SUPERVISOR: [
    "ตั้งค่า",
    "การแจ้งเตือน",
    "ปฏิทิน",
    "งานของฉัน",
    "แผนที่",
    "โปรไฟล์" // เพิ่มสิทธิ์ให้ SUPERVISOR
  ],
  EMPLOYEE: [
    "งานของฉัน",
    "การแจ้งเตือน",
    "ตั้งค่า",
    "ปฏิทิน",
    "แผนที่",
    "โปรไฟล์" // เพิ่มสิทธิ์ให้ EMPLOYEE
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
  // { title: "รายงาน", url: "/reports", icon: <Flag /> },
  // { title: "จัดการรายงาน", url: "/reportsmanagement", icon: <Flag /> },
  { title: "การแจ้งเตือน", url: "/notifications", icon: <BellRing />, },
  { title: "แผนที่", url: "/map", icon: <Map /> },
  { title: "โปรไฟล์", url: "/profile", icon: <User /> }, // เพิ่มเมนูโปรไฟล์
  { title: "ตั้งค่า", url: "/settings", icon: <Settings /> },
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
              <a href="/home" className="flex items-center gap-2">
                <IconInnerShadowTop className="!size-6" />
                <span className="text-xl font-bold">
                  Tech <span className="text-blue-600">Job</span>
                </span>
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