"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  Package,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Calendar,
  Loader2,
  CircleGauge,
  SquareChartGantt,
  UserCog,
  BellRing,
  BriefcaseBusiness,
  Flag,
  CalendarDays,
  Settings,
  Database,
  Map,
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { getAdminSession } from "@/lib/adminSession";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

// --- Role Configuration (Copied from app-sidebar.jsx to ensure consistency) ---
const ROLE_MENU = {
  CEO: [
    "แดชบอร์ด",
    "ตั้งค่า",
    "การแจ้งเตือน",
    "แผนที่",
    "งานของฉัน",
    "จัดการงาน",
    "ผู้ใช้งานและลูกค้า",
    "จัดการคลังสินค้า",
    "ข้อมูลหลัก",
    "ปฏิทิน",
    "แบบฟอร์มเริ่มโครงการ",
  ],
  ADMIN: [
    "จัดการงาน",
    "ผู้ใช้งานและลูกค้า",
    "จัดการคลังสินค้า",
    "แบบฟอร์มเริ่มโครงการ",
    "ข้อมูลหลัก",
    "การแจ้งเตือน",
    "ตั้งค่า",
  ],
  SUPERVISOR: [
    "ตั้งค่า",
    "การแจ้งเตือน",
    "จัดการคลังสินค้า",
    "ปฏิทิน",
    "งานของฉัน",
  ],
  EMPLOYEE: ["งานของฉัน", "การแจ้งเตือน", "ตั้งค่า", "ปฏิทิน"],
};

const BASE_NAV_ITEMS = [
  { title: "แดชบอร์ด", url: "/dashboard", icon: <CircleGauge /> },
  {
    title: "แบบฟอร์มเริ่มโครงการ",
    url: "/projectform",
    icon: <SquareChartGantt />,
  },
  { title: "จัดการงาน", url: "/jobmanagement", icon: <SquareChartGantt /> },
  { title: "ผู้ใช้งานและลูกค้า", url: "/userscustomers", icon: <UserCog /> },
  { title: "งานของฉัน", url: "/work", icon: <BriefcaseBusiness /> },
  {
    title: "จัดการคลังสินค้า",
    url: "/inventorysmanagement",
    icon: <Package />,
  },
  { title: "ข้อมูลหลัก", url: "/master-data", icon: <Database /> },
  { title: "ปฏิทิน", url: "/calendar", icon: <CalendarDays /> },
  { title: "การแจ้งเตือน", url: "/notifications", icon: <BellRing /> },
  { title: "ตั้งค่า", url: "/settings", icon: <Settings /> },
  { title: "แผนที่", url: "/map", icon: <Map /> },
];

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    inProgress: 0,
    completed: 0,
    lowStock: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const session = getAdminSession();
    setUser(session);
    // Fetch data for everyone, but we might conditionally render parts
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Always fetch recent jobs for everyone
      const recentJobsRes = await apiClient.get(
        "/work-orders?pageSize=5&sort=createdAt:desc"
      );
      setRecentJobs(recentJobsRes.data?.items || []);

      // Only fetch full stats if CEO/ADMIN to save resources/avoid permission issues if any
      const session = getAdminSession();
      if (session?.role === "CEO" || session?.role === "ADMIN") {
        const [allJobsRes, inProgressRes, completedRes, itemsRes] =
          await Promise.all([
            apiClient.get("/work-orders?pageSize=1"),
            apiClient.get("/work-orders?status=IN_PROGRESS&pageSize=1"),
            apiClient.get("/work-orders?status=COMPLETED&pageSize=1"),
            apiClient.get("/items?pageSize=1000"),
          ]);

        const items = itemsRes.data?.items || [];
        const lowStockCount = items.filter(
          (i) => (i.qty || 0) < (i.minQty || 5)
        ).length;

        setStats({
          totalJobs: allJobsRes.data?.total || 0,
          inProgress: inProgressRes.data?.total || 0,
          completed: completedRes.data?.total || 0,
          lowStock: lowStockCount,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Determine if user has full dashboard access (Stats)
  const isFullDashboard = user?.role === "CEO" || user?.role === "ADMIN";

  // Filter Quick Actions based on Role
  const quickActions = useMemo(() => {
    const role = user?.role || "EMPLOYEE";
    const allowedTitles = ROLE_MENU[role] || [];
    return BASE_NAV_ITEMS.filter((item) => allowedTitles.includes(item.title));
  }, [user]);

  const statCards = [
    {
      title: "งานทั้งหมด",
      value: stats.totalJobs,
      description: "งานทั้งหมดในระบบ",
      icon: <Briefcase className="h-5 w-5 text-white" />,
      bg: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
      border: "border-none",
      text: "text-blue-100",
    },
    {
      title: "กำลังดำเนินการ",
      value: stats.inProgress,
      description: "งานที่อยู่ระหว่างทำ",
      icon: <Clock className="h-5 w-5 text-white" />,
      bg: "bg-gradient-to-br from-orange-400 to-orange-600 text-white",
      border: "border-none",
      text: "text-orange-100",
    },
    {
      title: "เสร็จสิ้นแล้ว",
      value: stats.completed,
      description: "งานที่ปิดเรียบร้อย",
      icon: <CheckCircle2 className="h-5 w-5 text-white" />,
      bg: "bg-gradient-to-br from-green-500 to-green-600 text-white",
      border: "border-none",
      text: "text-green-100",
    },
    {
      title: "สินค้าคงคลังต่ำ",
      value: stats.lowStock,
      description: "ต้องสั่งซื้อเพิ่ม",
      icon: <AlertCircle className="h-5 w-5 text-white" />,
      bg: "bg-gradient-to-br from-red-500 to-red-600 text-white",
      border: "border-none",
      text: "text-red-100",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
        <SiteHeader title="หน้าหลัก" />
        <main className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
          {/* Banner Skeleton */}
          <Skeleton className="h-48 w-full rounded-2xl" />

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions Skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
              {/* Recent Jobs Skeleton */}
              <Skeleton className="h-64 rounded-xl" />
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-8">
              <Skeleton className="h-96 rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <SiteHeader title="หน้าหลัก" />

      <main className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
        {/* Welcome Section with Gradient Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-lg">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                สวัสดี, {user?.name || "ยินดีต้อนรับ"}! 👋
              </h1>
              <p className="text-blue-100 mt-2 text-lg">
                {isFullDashboard
                  ? "นี่คือภาพรวมของงานและกิจกรรมทั้งหมดในระบบของคุณ"
                  : "จัดการงานและดูสถานะล่าสุดได้ที่นี่"}
              </p>
            </div>
            {isFullDashboard && (
              <Link href="/jobmanagement/add">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-lg h-11 px-6 text-base font-semibold">
                  <Plus className="mr-2 h-5 w-5" /> สร้างงานใหม่
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid - Only for CEO/ADMIN */}
        {isFullDashboard && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <Card
                key={index}
                className={`shadow-md hover:shadow-lg transition-all duration-200 ${stat.border} ${stat.bg}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle
                    className={`text-sm font-medium ${
                      stat.text || "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-white/50" />
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-white">
                        {stat.value}
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          stat.text || "text-slate-500"
                        }`}
                      >
                        {stat.description}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions (Dynamic based on Role) */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" /> เมนูลัด
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                href={action.url}
                icon={React.cloneElement(action.icon, { className: "h-6 w-6" })}
                label={action.title}
                index={index}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function QuickActionCard({ href, icon, label, index }) {
  // Generate a nice gradient based on index
  const gradients = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-orange-500 to-orange-600",
    "from-green-500 to-green-600",
    "from-pink-500 to-pink-600",
    "from-cyan-500 to-cyan-600",
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <Link href={href} className="group">
      <div
        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 cursor-pointer bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1`}
      >
        <div
          className={`p-3 rounded-full bg-gradient-to-br ${gradient} text-white mb-3 group-hover:scale-110 transition-transform shadow-md`}
        >
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
      </div>
    </Link>
  );
}

function StatusBadge({ status }) {
  const styles = {
    IN_PROGRESS: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    COMPLETED: "text-green-600 bg-green-100 dark:bg-green-900/30",
    PENDING_REVIEW: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    NEED_FIX: "text-red-600 bg-red-100 dark:bg-red-900/30",
  };

  const labels = {
    IN_PROGRESS: "กำลังดำเนินการ",
    COMPLETED: "เสร็จสิ้น",
    PENDING_REVIEW: "รอตรวจสอบ",
    NEED_FIX: "ต้องแก้ไข",
  };

  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
        styles[status] || "text-gray-600 bg-gray-100"
      }`}
    >
      {labels[status] || status || "ไม่ระบุ"}
    </span>
  );
}
