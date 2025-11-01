// components/nav-main.jsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({ items = [] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item, i) => {
            const Icon = item.icon;
            const href = item.url || "/";
            const isActive =
              href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
            const key = item.key ?? `${item.title}-${href}-${i}`;

            return (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link href={href}>
                    {Icon ? <Icon className="!size-5" /> : null}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
