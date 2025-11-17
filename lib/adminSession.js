// src/lib/adminSession.js

const SESSION_KEY = "admin_session";

/**
 * ดึงข้อมูล session ของ admin จาก sessionStorage
 * ถ้าไม่มี / parse ไม่ได้ -> คืน null
 */
export function getAdminSession() {
  if (typeof window === "undefined") return null; // กันตอนรันบน server

  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);

    // จะตรวจเพิ่มก็ได้ เช่น ต้องมี code / token
    if (!data || !data.code || !data.token) {
      return null;
    }

    return data; // { id, code, username, name, role, email, phone, loginAt, token, ... }
  } catch {
    return null;
  }
}

/**
 * บันทึก session admin ลง sessionStorage
 * ใช้ตอน login สำเร็จ
 */
export function setAdminSession(sessionData) {
  if (typeof window === "undefined") return;

  try {
    if (!sessionData) {
      sessionStorage.removeItem(SESSION_KEY);
      return;
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch (err) {
    console.error("setAdminSession error:", err);
  }
}

/**
 * ลบ session admin
 * ใช้ตอน logout
 */
export function clearAdminSession() {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error("clearAdminSession error:", err);
  }
}

/**
 * เช็คว่า login อยู่ไหม (มี session และมี token)
 */
export function isAdminLoggedIn() {
  const s = getAdminSession();
  return !!(s && s.token);
}
