"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHome() {
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("admin_session");
    if (!raw) {
      router.replace("/admin/register");
    }
  }, [router]);

  return <div className="p-6">Welcome to Admin!</div>;
}
