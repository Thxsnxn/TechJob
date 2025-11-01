"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Page from "@/app/page/dashboard/page";

export default function AdminHome() {
  const router = useRouter();


  return <div className="">
    <Page/>
  </div>;
}
