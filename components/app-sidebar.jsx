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
  ],
  ADMIN: [
    "Job Management",
    "Users Customers",
    "Inventorys Management",
    "OT Management",
    "Reports Management",
    "Notifications",
    "Settings",
  ],
  SUPERVISOR: [
    "Workschedule",
    "OT Management",
    "Reports",
    "Settings",
    "Notification",
    "Inventorys Management",
    "Calendar",
  ],
  EMPLOYEE: [
    "Work",
    "Inventorys Request",
    "OT Request",
    "Notifications",
    "Settings",
    "Reports",
    "Calendar",
  ],
};

const BASE_NAV_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: <CircleGauge />, },
  { title: "Job Management", url: "/jobmanagement", icon: <SquareChartGantt />, },
  { title: "Users Customers", url: "/userscustomers", icon: <UserCog /> },

  { title: "OT Management", url: "/otmanagement", icon: <ClockPlus /> },
  { title: "OT Request", url: "/otrequests", icon: <History /> },

  { title: "Notifications", url: "/notifications", icon: <BellRing />, },
  { title: "Workschedule", url: "/workschedule", icon: <BriefcaseBusiness />, },

  { title: "Reports", url: "/reports", icon: <Flag /> },
  { title: "Reports Management", url: "/reportsmanagement", icon: <Flag /> },


  { title: "Calendar", url: "/calendar", icon: <CalendarDays /> },


  { title: "Inventorys Management", url: "/inventorysmanagement", icon: <Package /> },
  { title: "Inventorys Request", url: "/inventorysrequest", icon: <Package /> },

  /* work */
  { title: "Work", url: "/work", icon: <Settings /> },

  { title: "Settings", url: "/settings", icon: <Settings /> },
  { title: "ไปหน้ามือถือจะได้สะดวก", url: "/responsive/login", icon: <Phone />, },
];

export default function AppSidebar(props) {
  const session = getAdminSession();
  const role = session?.role || "EMPLOYEE";

  const user = useMemo(
    () => ({
      name: session?.name || "Guest",
      role,
      avatar:
        "https://i.pinimg.com/736x/50/f3/9f/50f39feefd36f890e9a9754dcc09610a.jpg",
    }),
    [session, role]
  );

  const navItems = useMemo(() => {
    const allowedTitles = ROLE_MENU[role] || [];
    return BASE_NAV_ITEMS.filter((item) =>
      allowedTitles.includes(item.title)
    );
  }, [role]);

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
