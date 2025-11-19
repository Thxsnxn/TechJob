"use client";

import React, { useEffect, useState, Suspense } from "react"; // 1. เพิ่ม import Suspense
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // เพิ่ม Loader2 เผื่อใช้ตอน Loading
import { cn } from "@/lib/utils";

import apiClient, { setAuthToken } from "@/lib/apiClient";

// --- 2. แยก Logic หลักมาไว้ใน Component นี้ ---
function AdminLoginContent() {
  const router = useRouter();
  const search = useSearchParams(); // ใช้ useSearchParams ได้อย่างปลอดภัยในนี้

  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_employee_code");
      if (saved) {
        setEmployeeCode(saved);
        setRemember(true);
      }
    } catch {}
  }, []);

  // ✅ เก็บ session ไว้ที่ sessionStorage
  const setAdminSession = (session) => {
    try {
      sessionStorage.setItem("admin_session", JSON.stringify(session));
    } catch (e) {
      console.error("Cannot save admin_session:", e);
    }
  };

  const setAdminCookie = (value = "1", maxAgeSec = 60 * 60 * 8) => {
    const parts = [
      `admin_session=${encodeURIComponent(value)}`,
      "Path=/",
      `Max-Age=${maxAgeSec}`,
      "SameSite=Lax",
    ];
    if (process.env.NODE_ENV === "production") {
      parts.push("Secure");
    }
    document.cookie = parts.join("; ");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    /* ---------------------------- */
    const code = employeeCode.trim();
    if (!code) return setErr("กรุณากรอกรหัสพนักงานหรือ username");
    if (!password.trim()) return setErr("กรุณากรอกรหัสผ่าน");

    setLoading(true);
    try {
      const res = await apiClient.post("/login", {
        identifier: code,
        password: password,
      });
      /* ----------------------- */

      const { token, employee } = res.data || {};

      if (!token || !employee) {
        throw new Error("ข้อมูลที่ได้จากเซิร์ฟเวอร์ไม่ถูกต้อง");
      }

      try {
        if (remember) localStorage.setItem("admin_employee_code", code);
        else localStorage.removeItem("admin_employee_code");
      } catch {}

      const sessionPayload = {
        id: employee.id,
        code: employee.code,
        username: employee.username,
        name: `${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim(),
        role: employee.role ?? "EMPLOYEE",
        email: employee.email ?? null,
        phone: employee.phone ?? null,
        loginAt: Date.now(),
        token,
      };

      // ✅ เก็บ session ฝั่ง client แท็บนี้
      setAdminSession(sessionPayload);

      // ตั้ง token ให้ axios ใช้เวลา call API อื่น ๆ
      setAuthToken(token);

      // ตั้ง cookie ให้ middleware ตรวจว่า login แล้ว (ใช้ token เป็น value ได้เลย)
      setAdminCookie(token);

      // redirect กลับ path เดิม หรือไป /dashboard
      const from = search.get("from");
      router.push(from && from.startsWith("/") ? from : "/dashboard");
    } catch (e) {
      console.error("Login error:", e);
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col gap-6 min-h-svh items-center justify-center p-6 md:p-10 bg-neutral-900 overflow-hidden"
      )}
    >
      {/* พื้นหลัง */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(130,87,229,0.25),rgba(0,0,0,0.95))] blur-3xl opacity-90 animate-pulse" />

      <Card className="overflow-hidden p-0 w-full max-w-sm md:max-w-4xl relative z-10">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={onSubmit} className="p-6 md:p-8">
            <div className="flex flex-col items-center gap-2 text-center mb-6">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground text-balance">
                เข้าสู่ระบบสำหรับผู้ดูแลระบบ
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="employeeCode"
                className="block text-sm font-medium mb-1"
              >
                รหัสพนักงานหรือ Username
              </label>
              <Input
                id="employeeCode"
                type="text"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                placeholder="เช่น 1234567 หรือ admin01"
                autoComplete="username"
                required
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="text-sm font-medium">
                  รหัสผ่าน
                </label>
                <a
                  href="#"
                  className="text-sm underline-offset-2 hover:underline"
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
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
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

            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(Boolean(v))}
              />
              <label htmlFor="remember" className="cursor-pointer text-sm">
                จำรหัสไว้
              </label>
            </div>

            {err && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 mb-4">
                {err}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "กำลังล็อกอิน..." : "ล็อกอิน"}
            </Button>
          </form>

          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170"
              alt="Admin team working"
              className="bg-muted border-8 border-white rounded-2xl hidden md:block h-full w-full object-cover"
            />
            <div className="absolute inset-[8px] rounded-xl bg-gradient-to-tr from-black/70 via-black/30 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-8 right-6 text-white drop-shadow-lg">
              <h2 className="text-xl font-semibold">
                Manage Smarter, Work Faster.
              </h2>
              <p className="text-sm text-gray-200 mt-1 leading-snug">
                ระบบจัดการภายในที่ออกแบบมาเพื่อทีมของคุณ — ปลอดภัย รวดเร็ว
                และใช้งานง่าย
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- 3. Export Component หลักที่คลุมด้วย Suspense ---
export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-neutral-900 text-white">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}