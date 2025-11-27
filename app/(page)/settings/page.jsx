"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation"; // [เพิ่ม] 1. Import useRouter
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/card";
import { User, Lock, Settings, Bell, Shield, Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  // [เพิ่ม] 2. ประกาศตัวแปร router
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <SiteHeader title="ตั้งค่า" />

      <main className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 p-8 shadow-lg">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                <Settings className="h-8 w-8" /> ตั้งค่า
              </h1>
              <p className="text-slate-300 mt-2 text-lg">
                จัดการบัญชีผู้ใช้ การแจ้งเตือน และความเป็นส่วนตัว
              </p>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Account Card */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <User className="w-5 h-5 text-blue-500" /> บัญชี (Account)
              </CardTitle>
              <CardDescription>
                จัดการข้อมูลบัญชีและการเข้าสู่ระบบของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <div className="space-y-1">
                  <Label className="text-base">ดูโปรไฟล์</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    ดูข้อมูลโปรไฟล์สาธารณะของคุณ
                  </p>
                </div>
                
                {/* [แก้ไข] 3. ใส่ onClick เพื่อลิงก์ไปหน้า /page/profile */}
                <Button 
                  variant="outline" 
                  className="border-slate-200 dark:border-slate-700"
                  onClick={() => router.push("/profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>

              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <div className="space-y-1">
                  <Label className="text-base">เปลี่ยนรหัสผ่าน</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    แนะนำให้เปลี่ยนรหัสผ่านอย่างสม่ำเสมอ
                  </p>
                </div>
                <Button variant="outline" className="border-slate-200 dark:border-slate-700">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 2. Theme Card */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Palette className="w-5 h-5 text-purple-500" /> ธีมสี (Appearance)
              </CardTitle>
              <CardDescription>
                เลือกธีมสีสว่าง, มืด, หรือตามการตั้งค่าระบบ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <Label htmlFor="theme-select" className="text-base">
                  เลือกธีม
                </Label>
                {mounted ? (
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-[180px] border-slate-200 dark:border-slate-700" id="theme-select">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">ระบบ (System)</SelectItem>
                      <SelectItem value="light">สว่าง (Light)</SelectItem>
                      <SelectItem value="dark">มืด (Dark)</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="w-[180px] h-10 border rounded-md bg-slate-100 animate-pulse" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* 3. Notification Settings Card */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Bell className="w-5 h-5 text-orange-500" /> การแจ้งเตือน (Notifications)
              </CardTitle>
              <CardDescription>
                จัดการวิธีที่คุณจะได้รับการแจ้งเตือน
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <div className="space-y-1">
                  <Label htmlFor="push-notifications" className="text-base">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    เปิด/ปิด การแจ้งเตือนแบบ pop-up
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. Privacy Settings Card */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Shield className="w-5 h-5 text-green-500" /> ความเป็นส่วนตัว (Privacy)
              </CardTitle>
              <CardDescription>
                จัดการการตั้งค่าความเป็นส่วนตัวและข้อมูลของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <div className="space-y-1">
                  <Label htmlFor="public-profile" className="text-base">
                    โปรไฟล์สาธารณะ
                  </Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    อนุญาตให้ผู้ใช้อื่นเห็นโปรไฟล์ของคุณ
                  </p>
                </div>
                <Switch
                  id="public-profile"
                  checked={publicProfile}
                  onCheckedChange={setPublicProfile}
                />
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <div className="space-y-1">
                  <Label htmlFor="data-sharing" className="text-base">
                    แบ่งปันข้อมูลการใช้งาน
                  </Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
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
      </main>
    </div>
  );
}