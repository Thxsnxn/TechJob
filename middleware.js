// middleware.js
import { NextResponse } from "next/server";

const LOGIN_PATH = "/auth/login";
const PUBLIC_PATHS = [
  "/",
  "/contact",
  "/request-quote",
  LOGIN_PATH,
  "/auth/forgot-password",
  "/data/Employee.json"
];

export function middleware(req) {
  const { pathname } = req.nextUrl;
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

  // 1) ตรวจสอบว่าเป็น Public Path หรือไม่
  const isPublicPath = PUBLIC_PATHS.some((p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p)
  );

  if (isPublicPath) {
    // ถ้ามี session แล้วแต่เข้าหน้า login -> ส่งไป dashboard
    if (sessionCookie && pathname.startsWith(LOGIN_PATH)) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 2) ปกป้องหน้าที่เหลือทั้งหมด (Internal Routes)
  if (!sessionCookie) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    // เก็บ path + query ปัจจุบันไว้ใน from
    url.searchParams.set("from", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // ตัดไฟล์ที่มีนามสกุล และโฟลเดอร์ _next ออก
  matcher: ["/((?!_next|.*\\..*).*)"],
};
