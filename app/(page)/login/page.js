// app/(page)/admin/login/page.js
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // โหลดค่าที่เคยจำไว้
  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_employee_code");
      if (saved) {
        setEmployeeCode(saved);
        setRemember(true);
      }
    } catch {}
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!employeeCode.trim()) return setErr("กรุณากรอกรหัสพนักงาน");
    if (!password.trim()) return setErr("กรุณากรอกรหัสผ่าน");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeCode: employeeCode.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) {
        throw new Error(data?.error || "เข้าสู่ระบบไม่สำเร็จ");
      }

      // จำเฉพาะรหัสพนักงาน
      try {
        if (remember)
          localStorage.setItem("admin_employee_code", employeeCode.trim());
        else localStorage.removeItem("admin_employee_code");
      } catch {}

      router.push("/admin"); // ปรับ path ได้ตามระบบคุณ
    } catch (e) {
      setErr(e?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E7EDF3] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-4">
          <CardTitle>เข้าสู่ระบบผู้ดูแล</CardTitle>
          <CardDescription>
            กรอกรหัสพนักงานและรหัสผ่านสำหรับผู้ดูแลระบบ
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            {/* รหัสพนักงาน */}
            <div className="grid gap-2">
              <Label htmlFor="employeeCode">รหัสพนักงาน</Label>
              <Input
                id="employeeCode"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                autoComplete="username"
              />
            </div>

            {/* รหัสผ่าน */}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <a
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  ลืมรหัสผ่าน?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                  aria-label={showPwd ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* จำรหัสไว้ */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(Boolean(v))}
              />
              <Label htmlFor="remember" className="cursor-pointer">
                จำรหัสไว้
              </Label>
            </div>

            {/* แสดง error */}
            {err ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </div>
            ) : null}

            {/* ปุ่มล็อกอิน */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "กำลังล็อกอิน..." : "ล็อกอิน"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground text-center">
            ระบบจะจำเฉพาะ “รหัสพนักงาน” ในเครื่องนี้ (ไม่เก็บรหัสผ่าน)
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
