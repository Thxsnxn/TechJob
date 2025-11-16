"use client";

import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    console.log('Login attempt with:');
    console.log('Employee ID:', employeeId);
    console.log('Password:', password);

    if (employeeId === 'cyn' && password === '1') {
      console.log('Login Successful! Redirecting...');
      router.push('/responsive/home');

    } else {
      console.log('Login Failed!');
      setError('รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    // 1. พื้นหลังสีเข้ม (slate-950) ตลอดเวลาตามที่คุณขอ
    <main className="relative flex items-center justify-center min-h-screen bg-slate-950 py-12">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* 2. เปลี่ยน Border เป็นสีฟ้า (sky) */}
      <Card className="w-[402px] h-auto shadow-xl border-sky-300 dark:border-sky-800 flex flex-col">
        <CardHeader className="space-y-1 text-center">
          {/* 3. เปลี่ยน Title เป็นสีฟ้า (sky) */}
          <CardTitle className="text-3xl font-bold text-sky-600 dark:text-sky-400">
            Welcome to Tech Job
          </CardTitle>
          <CardDescription>
            ลงชื่อเข้าใช้ระบบของคุณ
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow">
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              {/* ช่องรหัสพนักงาน */}
              <div className="grid gap-2">
                <Label htmlFor="employeeId">รหัสพนักงาน</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="employeeId"
                    type="text"
                    placeholder="EMP00001"
                    required
                    className="pl-10"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
                </div>
              </div>

              {/* ช่องรหัสผ่าน */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <Link
                    href="/forgot-password"
                    // 4. เปลี่ยน Link เป็นสีฟ้า (sky)
                    className="ml-auto inline-block text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 underline"
                  >
                    ลืมรหัสผ่าน?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Error message (ยังเป็นสีแดง) */}
              {error && (
                <p className="text-sm font-medium text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}

              {/* 5. เปลี่ยนปุ่มเป็นสีฟ้า (sky) */}
              <Button
                type="submit"
                className="w-full text-white bg-sky-600 hover:bg-sky-700 focus-visible:ring-sky-500"
              >
                เข้าสู่ระบบ
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="text-center text-sm">
          {/* สีข้อความนี้จะปรับตามธีม */}
          <p className="w-full text-gray-600 dark:text-gray-400">
            ยังไม่มีบัญชี?{' '}
            <Link
              href="/register"
              // 6. เปลี่ยน Link เป็นสีฟ้า (sky)
              className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 underline"
            >
              สมัครสมาชิก
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}