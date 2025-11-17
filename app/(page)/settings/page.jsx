"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { SiteHeader } from "@/components/site-header"; // <-- This import causes an error, so I'm commenting it out.
import { Eye, Pencil, User, Lock, } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  // --- Theme Management ---
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- State for Settings ---
  const [pushNotifications, setPushNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  // --- Note: I am removing the 'Jobs' logic (useState, useEffect, useMemo)
  // --- as it doesn't seem to be needed for the Settings page.

  // const [jobs, setJobs] = useState([]);
  // const [search, setSearch] = useState("");
  // ... (rest of jobs state) ...
  const [showCreateModal, setShowCreateModal] = useState(false);

  // --- Removed useEffect for loading jobs.json ---
  // --- Removed useMemo for filteredJobs ---
  // --- Removed getStatusColor function ---

  return (
    <main className="">
      {/* <SiteHeader title="Settings" /> */} {/* <-- Replaced this */}
      {/* Placeholder Header */}
      <SiteHeader title="Settings" />

      <section className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and app settings</p>
          </div>
        </div>

        {/* --- Start of Settings UI --- */}
        <div className="w-full max-w-auto mx-auto space-y-6">
          {/* 1. Account Card */}
          <Card>
            <CardHeader>
              <CardTitle>บัญชี (Account)</CardTitle>
              <CardDescription>
                จัดการข้อมูลบัญชีและการเข้าสู่ระบบของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>ดูโปรไฟล์</Label>
                  <p className="text-sm text-muted-foreground">
                    ดูข้อมูลโปรไฟล์สาธารณะของคุณ
                  </p>
                </div>
                <Button variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>เปลี่ยนรหัสผ่าน</Label>
                  <p className="text-sm text-muted-foreground">
                    แนะนำให้เปลี่ยนรหัสผ่านอย่างสม่ำเสมอ
                  </p>
                </div>
                <Button variant="outline">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
            
          </Card>

          {/* 2. Theme Card */}
          <Card>
            <CardHeader>
              <CardTitle>ธีมสี (Appearance)</CardTitle>
              <CardDescription>
                เลือกธีมสีสว่าง, มืด, หรือตามการตั้งค่าระบบ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="theme-select" className="text-base">
                  เลือกธีม
                </Label>
                {mounted ? (
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-[180px]" id="theme-select">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">ระบบ (System)</SelectItem>
                      <SelectItem value="light">สว่าง (Light)</SelectItem>
                      <SelectItem value="dark">มืด (Dark)</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="w-[180px] h-10 border rounded-md bg-muted animate-pulse" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* 3. Notification Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าการแจ้งเตือน (Notifications)</CardTitle>
              <CardDescription>
                จัดการวิธีที่คุณจะได้รับการแจ้งเตือน
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="push-notifications" className="text-base">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    เปิด/ปิด การแจ้งเตือนแบบ pop-up
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  hecked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. Privacy Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าความเป็นส่วนตัว (Privacy)</CardTitle>
              <CardDescription>
                จัดการการตั้งค่าความเป็นส่วนตัวและข้อมูลของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="public-profile" className="text-base">
                    โปรไฟล์สาธารณะ
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    อนุญาตให้ผู้ใช้อื่นเห็นโปรไฟล์ของคุณ
                  </p>
                </div>
                <Switch
                  id="public-profile"
                  checked={publicProfile}
                  onCheckedChange={setPublicProfile}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="data-sharing" className="text-base">
                    แบ่งปันข้อมูลการใช้งาน
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    อนุญาตให้เราใช้ข้อมูลเพื่อปรับปรุงบริการ
                  </p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={dataSharing}
                  onCheckedChange={setDataSharing}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* --- End of Settings UI --- */}
      </section>

      {/* This modal is part of your original Jobs code template */}
      {showCreateModal && (
        <CreateJobModal onClose={() => setShowCreateModal(false)} />
      )}
    </main>
  );
}