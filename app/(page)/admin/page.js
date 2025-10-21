"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHome() {
  const router = useRouter();


  return <div className="p-6">Welcome to Admin!</div>;
}
