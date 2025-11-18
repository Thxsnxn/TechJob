"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { SiteHeader } from "@/components/site-header"
import { Eye } from "lucide-react"
import CreateUserModal from "./add/CreateUserModal"
import apiClient from "@/lib/apiClient"

// shadcn
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

export default function UserCustomersPage() {
  const [currentTab, setCurrentTab] = useState("customer")
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState([])

  // 🔍 state ค้นหา + type (ใช้เฉพาะ tab customer)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL") // PERSON / COMPANY / ALL

  // ⏳ loading เวลาเรียก API
  const [loading, setLoading] = useState(false)

  // ===========================
  // 🔥 ดึงข้อมูล User จาก API
  // ===========================
  const fetchUsers = async (override = {}) => {
    try {
      setLoading(true)

      const effectiveSearch =
        override.search !== undefined ? override.search : search

      const effectiveType =
        override.type !== undefined ? override.type : typeFilter

      // ถ้า ALL ให้ส่ง type เป็นค่าว่างไปหลังบ้าน
      const apiType = effectiveType === "ALL" ? "" : effectiveType

      const response = await apiClient.post("/filter-users", {
        search: effectiveSearch || "",
        type: apiType,
        page: 1,
        pageSize: 50,
      })

      console.log("Fetched users:", response.data)

      const items = response.data?.items || []

      const normalized = items.map((u) => ({
        rawId: u.id,              // เก็บ id จริงไว้เผื่อใช้ภายหลัง (แก้ไข/ลบ)
        code: u.code || "",       // รหัสลูกค้า
        name:
          u.type === "COMPANY"
            ? u.companyName
            : `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        email: u.email || "-",
        phone: u.phone || "-",
        address: u.address || "-",
        type: u.type,             // COMPANY / PERSON
        status: u.status,         // boolean จากหลังบ้าน
        role: u.role || "-",
        position: u.position || "-",
      }))

      setUsers(normalized)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const roleLabel = {
    customer: "Customer",
    lead: "Lead",
    engineer: "Engineer",
  }

  const getCustomerTypeLabel = (t) =>
    t === "PERSON" ? "บุคคล" : t === "COMPANY" ? "บริษัท" : "-"

  const renderStatusText = (status) => {
    if (status === true) return "ใช้งาน"
    if (status === false) return "ปิดใช้งาน"
    return "-"
  }

  // ฟิลเตอร์ตาม tab
  const filterByTab = (u) => {
    if (currentTab === "customer")
      return u.type === "PERSON" || u.type === "COMPANY"

    if (currentTab === "lead") return u.role === "LEAD"
    if (currentTab === "engineer") return u.role === "ENGINEER"

    return false
  }

  const filteredUsers = users.filter(filterByTab)

  return (
    <main>
      <SiteHeader title="Users Customers" />

      <section className="p-4 sm:p-6 space-y-4 max-w-full lg:max-w-[90%] xl:max-w-[1200px] mx-auto">

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Users & Customers Management
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage employees and customer information
          </p>
        </div>

        {/* Tabs + Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-2 w-full sm:w-auto">
            {["customer", "lead", "engineer"].map((role) => (
              <Button
                key={role}
                variant={currentTab === role ? "default" : "outline"}
                className={
                  currentTab === role
                    ? "bg-blue-600 text-white flex-1 sm:flex-none"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1 sm:flex-none"
                }
                onClick={() => setCurrentTab(role)}
              >
                {roleLabel[role]}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            + Create New {roleLabel[currentTab]}
          </Button>
        </div>

        {/* 🔎 Search + Type Filter — แสดงเฉพาะ tab customer */}
        {currentTab === "customer" && (
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex flex-1 gap-2">
              <Input
                placeholder="ค้นหา companyName, taxId, contactName, firstName, lastName, username, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchUsers({ search: e.currentTarget.value })
                  }
                }}
                disabled={loading}
              />

              <Select
                value={typeFilter}
                onValueChange={(val) => {
                  setTypeFilter(val)
                  fetchUsers({ type: val })
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="เลือกประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="PERSON">บุคคล</SelectItem>
                  <SelectItem value="COMPANY">บริษัท</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={() => fetchUsers({ search, type: typeFilter })}
              disabled={loading}
            >
              {loading ? "กำลังค้นหา..." : "ค้นหา"}
            </Button>
          </div>
        )}

        {/* Table */}
        <Card className="rounded-xl">
          <CardHeader>
            <h2 className="text-lg font-semibold">
              All {roleLabel[currentTab]}s
            </h2>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>รหัสลูกค้า</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>

                  {currentTab !== "customer" && <TableHead>Position</TableHead>}
                  {currentTab === "customer" && <TableHead>Address</TableHead>}

                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground"
                    >
                      กำลังโหลดข้อมูล...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u, i) => (
                    <TableRow key={u.rawId ?? i}>
                      {/* ลำดับ 1, 2, 3, 4... */}
                      <TableCell>{i + 1}</TableCell>

                      {/* รหัสลูกค้า */}
                      <TableCell>{u.code || "-"}</TableCell>

                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.phone}</TableCell>

                      {currentTab !== "customer" && (
                        <TableCell>{u.position || "-"}</TableCell>
                      )}

                      {currentTab === "customer" && (
                        <TableCell>{u.address || "-"}</TableCell>
                      )}

                      {/* Type */}
                      <TableCell>{getCustomerTypeLabel(u.type)}</TableCell>

                      {/* Status จาก boolean */}
                      <TableCell>{renderStatusText(u.status)}</TableCell>

                      <TableCell className="flex justify-end">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground"
                    >
                      No {roleLabel[currentTab]} found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal สร้างผู้ใช้ใหม่ */}
        {showModal && (
          <CreateUserModal
            onClose={() => setShowModal(false)}
            onCreate={(data) => {
              setShowModal(false)

              fetchUsers()
            }}
          />
        )}
      </section>
    </main>
  )
}
