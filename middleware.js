// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  const sessionCookie = req.cookies.get("admin_session")?.value;

  // อนุญาต resource สาธารณะ/ไฟล์
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/assets") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".webp");

  if (isPublicAsset) return NextResponse.next();

  // หน้า/พาธที่ให้เข้าถึงได้เสมอ (ต้องใช้ตอนยังไม่ล็อกอิน)
  const PUBLIC_PATHS = ["/login", "/forgot-password", "/data/Employee.json"];

  // 1) ถ้าเข้า root "/" และยังไม่มี session -> ส่งไปหน้า login
  if (pathname === "/" && !sessionCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2) ถ้าเป็น public path
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    // ถ้ามี session แล้วแต่ดันมา /admin/login -> ส่งไป /admin
    if (sessionCookie && pathname.startsWith("/login")) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 3) ปกป้องหน้าที่เหลือทั้งหมด (โดยเฉพาะ /admin/*)
  if (!sessionCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    // เก็บพาธเดิมไว้ เผื่อต้องการใช้หลังล็อกอินสำเร็จ
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // ตัดไฟล์ที่มีนามสกุล และโฟลเดอร์ _next ออก
  matcher: ["/((?!_next|.*\\..*).*)"],
};
