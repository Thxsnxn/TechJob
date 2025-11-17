"use client";

import { useRouter } from "next/navigation";

import { IconDotsVertical, IconLogout } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { clearAdminSession } from "@/lib/adminSession"; // 👈 helper ที่เราสร้างเมื่อกี้

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  // 👇 ฟังก์ชัน logout หลัก
  const handleLogout = () => {
    // 1) ลบ sessionStorage
    clearAdminSession();

    // 2) ลบ cookie admin_session (ให้ middleware เห็นว่าหลุดแล้ว)
    let cookie = "admin_session=; Path=/; Max-Age=0; SameSite=Lax";
    if (process.env.NODE_ENV === "production") {
      cookie += "; Secure";
    }
    document.cookie = cookie;

    // 3) เด้งกลับหน้า login
    router.push("/auth/login");
  };

  const displayName = user?.name || "Unknown User";
  const displayRole = user?.role || "EMPLOYEE";
  const avatarSrc = user?.avatar || "";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={avatarSrc} alt={displayName} />
                <AvatarFallback className="rounded-lg">
                  {displayName?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {displayRole}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            // 👇 ของเดิมพิมพ์ผิดนิดหน่อย แก้ให้เป็นแบบ shadcn มาตรฐาน
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarSrc} alt={displayName} />
                  <AvatarFallback className="rounded-lg">
                    {displayName?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {displayRole}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            {/* ปุ่ม Logout จริง ๆ */}
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <IconLogout className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
