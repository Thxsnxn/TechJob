"use client";

import React from "react";
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
  UserRoundPen,
  Settings,
  Map,
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

const data = {
  user: {
    name: "shadcn",
    role: "CEO",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <CircleGauge />,
    },
    {
      title: "Job Management",
      url: "/jobmanagement",
      icon: <SquareChartGantt />,
    },
    { title: "Users Customers", url: "/userscustomers", icon: <UserCog /> },
    { title: "OT Management", url: "/otmanagement", icon: <ClockPlus /> },
    {
      title: "Notifications",
      url: "/notifications",
      icon: <BellRing />,
    },
    {
      title: "Workschedule",
      url: "/workschedule",
      icon: <BriefcaseBusiness />,
    },
    { title: "Reports", url: "/reports", icon: <Flag/> },
    { title: "Calendar", url: "/calendar", icon: <CalendarDays/> },
    { title: "Inventorys", url: "/employee/inventorys", icon: <Package/> },
    { title: "Profiles", url: "/profiles", icon: <UserRoundPen/> },
    { title: "Settings", url: "/settings", icon: <Settings/> },
    { title: "Maps", url: "/maps", icon: <Map/> },
  ],
};

export default function AppSidebar(props) {
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
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
