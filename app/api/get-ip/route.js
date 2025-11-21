// src/app/api/get-ip/route.js
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = headers();
  // ดึง IP จาก Header ที่ Server มองเห็น
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';
  // x-forwarded-for อาจมาหลาย IP คั่นด้วย comma ให้เอาตัวแรก
  const realIp = ip.split(',')[0].trim();
  
  return NextResponse.json({ ip: realIp });
}