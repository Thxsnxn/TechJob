// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  return NextResponse.next();
}

export const config = {
  // ยังกันไม่ให้ middleware ไปยุ่งกับไฟล์ static / _next / ไฟล์นามสกุลต่าง ๆ
  matcher: ["/((?!_next|.*\\..*).*)"],
};
