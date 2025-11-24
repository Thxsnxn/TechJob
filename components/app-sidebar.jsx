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

const ROLE_MENU = {
  CEO: [
    "Dashboard",
    "Reports",
    "Settings",
    "Notification",


    "Work",
    "Job Management",
    "Users Customers",
    "Inventorys Management",
    "Master Data", // เพิ่มสิทธิ์ให้ CEO
    "Reports Management",
    "Notifications",
    "Calendar",
    "Project Initiation Form"
  ],
  ADMIN: [
    "Job Management",
    "Users Customers",
    "Inventorys Management",
    "Project Initiation Form",
    "Master Data", // เพิ่มสิทธิ์ให้ ADMIN
    "Reports Management",
    "Notifications",
    "Settings",
  ],
  SUPERVISOR: [
    "Reports",
    "Settings",
    "Notification",
    "Inventorys Management",
    "Calendar",
    "Work",
  ],
  EMPLOYEE: [
    "Work",
    "Notifications",
    "Settings",
    "Reports",
    "Calendar",
  ],
};

const BASE_NAV_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: <CircleGauge />, },
  { title: "Project Initiation Form", url: "/projectform", icon: <SquareChartGantt />, },

  { title: "Job Management", url: "/jobmanagement", icon: <SquareChartGantt />, },
  { title: "Users Customers", url: "/userscustomers", icon: <UserCog /> },


  { title: "Work", url: "/work", icon: <BriefcaseBusiness /> },
  { title: "Inventorys Management", url: "/inventorysmanagement", icon: <Package /> },
  { title: "Master Data", url: "/master-data", icon: <Database /> },

  { title: "Calendar", url: "/calendar", icon: <CalendarDays /> },
  { title: "Reports", url: "/reports", icon: <Flag /> },
  { title: "Reports Management", url: "/reportsmanagement", icon: <Flag /> },
  { title: "Notifications", url: "/notifications", icon: <BellRing />, },
  { title: "Settings", url: "/settings", icon: <Settings /> },
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
              <a href="#">
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