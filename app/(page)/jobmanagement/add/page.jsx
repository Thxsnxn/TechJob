"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import {
  CircleUserRound,
  NotebookPen,
  NotebookText,
  MapPinned,
  Save,
  RotateCcw
} from "lucide-react"
import SmartMapProFinal from "./SmartMapUltimate" // ✅ แผนที่หลักของหน้า Add Job
import { toast } from "sonner"

export default function CreateJobPage() {
  const router = useRouter()

  // 🟩 State หลักของฟอร์ม
  const [form, setForm] = useState({
    title: "",
    description: "",
    customerName: "",
    contactNumber: "",
    address: "",
    notes: "",
  })

  // 🟦 เก็บข้อมูลพิกัดหมุดจากแผนที่
  const [markers, setMarkers] = useState([])

  // 🟨 handleChange สำหรับอัปเดตค่าฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // 🟩 โหลดข้อมูลที่เคยกรอกไว้จาก localStorage (ใช้เวลา refresh หน้า)
  useEffect(() => {
    const savedForm = localStorage.getItem("jobForm")
    if (savedForm) setForm(JSON.parse(savedForm))

    const savedMarkers = localStorage.getItem("jobMarkers")
    if (savedMarkers) setMarkers(JSON.parse(savedMarkers))
  }, [])

  // 🟦 บันทึกลง localStorage ทุกครั้งที่เปลี่ยนฟอร์มหรือหมุด
  useEffect(() => {
    localStorage.setItem("jobForm", JSON.stringify(form))
    localStorage.setItem("jobMarkers", JSON.stringify(markers))
  }, [form, markers])

  // ✅ ตรวจสอบข้อมูลก่อนบันทึก
  const validateForm = () => {
    // ถ้าไม่กรอกชื่อใบงาน
    if (!form.title.trim()) {
      toast.error("⚠️ กรุณากรอกชื่อใบงาน (Job Title)")
      return false
    }
    // ถ้าไม่กรอกรายละเอียด
    if (!form.description.trim()) {
      toast.error("⚠️ กรุณากรอกรายละเอียดงาน (Description)")
      return false
    }
    // ถ้าไม่กรอกชื่อลูกค้า
    if (!form.customerName.trim()) {
      toast.error("⚠️ กรุณากรอกชื่อลูกค้า (Customer Name)")
      return false
    }
    // ถ้าไม่กรอกเบอร์โทรลูกค้า
    if (!form.contactNumber.trim()) {
      toast.error("⚠️ กรุณากรอกเบอร์โทรลูกค้า (Contact Number)")
      return false
    }
    // ถ้าไม่กรอกที่อยู่ลูกค้า
    if (!form.address.trim()) {
      toast.error("⚠️ กรุณากรอกที่อยู่ลูกค้า (Address)")
      return false
    }
    return true // ✅ ผ่านทุกเงื่อนไข
  }

  // ✅ ฟังก์ชันบันทึกงาน (Save Job)
  const handleSave = () => {
    // ตรวจสอบข้อมูลก่อน ถ้าไม่ครบให้หยุด
    if (!validateForm()) return

    // ดึงข้อมูล jobs เก่าจาก localStorage
    const existingJobs = JSON.parse(localStorage.getItem("jobs") || "[]")

    // สร้าง job ใหม่
    const newJob = {
      id: `#J${String(existingJobs.length + 1).padStart(3, "0")}`,
      ...form,
      markers, // เก็บพิกัดทั้งหมดจากแผนที่
      status: "Pending",
      createdAt: new Date().toISOString(),
    }

    // รวมข้อมูลแล้วบันทึกกลับ localStorage
    const updated = [...existingJobs, newJob]
    localStorage.setItem("jobs", JSON.stringify(updated))

    // แสดงข้อความ Toast
    toast.success("✅ บันทึกใบงานเรียบร้อยแล้ว!")

    // กลับหน้า Job Management
    router.push("/jobmanagement")
  }

  // 🧹 ฟังก์ชันเคลียร์ข้อมูลทั้งหมด
  const handleReset = () => {
    if (confirm("ต้องการล้างข้อมูลทั้งหมดหรือไม่?")) {
      setForm({
        title: "",
        description: "",
        customerName: "",
        contactNumber: "",
        address: "",
        notes: "",
      })
      setMarkers([])
      localStorage.removeItem("jobForm")
      localStorage.removeItem("jobMarkers")
      toast.error("🧹 เคลียร์ข้อมูลแล้ว!")
    }
  }

  return (
    <main>
      <SiteHeader title="Create New Job" />

      <div className="p-6 space-y-6">
        {/* === JOB INFO === */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <NotebookText className="text-blue-600" />
            <h2 className="text-lg font-semibold">Job Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="title"
              placeholder="Job title..."
              value={form.title}
              onChange={handleChange}
            />
            <Textarea
              name="description"
              placeholder="Job description..."
              value={form.description}
              onChange={handleChange}
            />
          </CardContent>
        </Card>

        {/* === CUSTOMER INFO === */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <CircleUserRound className="text-blue-600" />
            <h2 className="text-lg font-semibold">Customer Information</h2>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <Input
              name="customerName"
              placeholder="Customer name..."
              value={form.customerName}
              onChange={handleChange}
            />
            <Input
              name="contactNumber"
              placeholder="Contact number..."
              value={form.contactNumber}
              onChange={handleChange}
            />
            <Input
              name="address"
              placeholder="Customer address..."
              value={form.address}
              onChange={handleChange}
            />
          </CardContent>
        </Card>

        {/* === LOCATION MAP === */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <MapPinned className="text-blue-600" />
            <h2 className="text-lg font-semibold">Worksite Location</h2>
          </CardHeader>
          <CardContent>
            {/* ✅ ใช้ SmartMapProFinal เพื่อเพิ่ม/ลบหมุดได้ */}
            <SmartMapProFinal onChange={setMarkers} />
          </CardContent>
        </Card>

        {/* === NOTES === */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <NotebookPen className="text-blue-600" />
            <h2 className="text-lg font-semibold">Notes</h2>
          </CardHeader>
          <CardContent>
            <Textarea
              name="notes"
              placeholder="Additional notes (optional)..."
              value={form.notes}
              onChange={handleChange}
            />
          </CardContent>
        </Card>

        {/* === ACTION BUTTONS === */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="bg-gray-100 hover:bg-gray-200"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" /> Save Job
          </Button>
        </div>
      </div>
    </main>
  )
}
