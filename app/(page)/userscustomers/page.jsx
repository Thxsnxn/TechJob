"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

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
import { setAuthToken } from "@/lib/apiClient"

export default function UserCustomersPage() {
  const [currentTab, setCurrentTab] = useState("customer")
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState([])

  // โหลด token จาก sessionStorage (สำคัญมากกกก)
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_session")
    if (saved) {
      const session = JSON.parse(saved)
      if (session.token) {
        setAuthToken(session.token)
        console.log("TOKEN LOADED =", session.token)
      }
    }
  }, [])

  const roleLabel = {
    customer: "Customer",
    lead: "Lead",
    engineer: "Engineer",
  }

  const getCustomerTypeLabel = (t) =>
    t === "PERSON" ? "บุคคล" : t === "COMPANY" ? "บริษัท" : "-"

  // ฟังก์ชันคัดข้อมูลก่อนแสดงในตาราง
  const filterByTab = (u) => {
    if (currentTab === "customer") return u.type === "PERSON" || u.type === "COMPANY"
    if (currentTab === "lead") return u.role === "LEAD"
    if (currentTab === "engineer") return u.role === "ENGINEER"
    return false
  }

  return (
    <main>
      <SiteHeader title="Users Customers" />

      <section className="p-4 sm:p-6 space-y-4 max-w-full lg:max-w-[90%] xl:max-w-[1200px] mx-auto">

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Users & Customers Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage employees and customer information
          </p>
        </div>

        {/* Tabs + Button */}
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

        {/* Table */}
        <Card className="rounded-xl">
          <CardHeader>
            <h2 className="text-lg font-semibold">All {roleLabel[currentTab]}s</h2>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>

                  {currentTab === "engineer" && <TableHead>Position</TableHead>}
                  {currentTab === "lead" && <TableHead>Position</TableHead>}
                  {currentTab === "customer" && <TableHead>Address</TableHead>}

                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.filter(filterByTab).length > 0 ? (
                  users
                    .filter(filterByTab)
                    .map((u, i) => (
                      <TableRow key={i}>
                        <TableCell>{u.id}</TableCell>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.phone}</TableCell>

                        {currentTab !== "customer" && (
                          <TableCell>{u.position || "-"}</TableCell>
                        )}

                        {currentTab === "customer" && (
                          <TableCell>{u.address || "-"}</TableCell>
                        )}

                        <TableCell>
                          {currentTab === "customer"
                            ? getCustomerTypeLabel(u.type)
                            : u.role || "-"}
                        </TableCell>

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
                      colSpan={8}
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

        {/* Modal */}
        {showModal && (
          <CreateUserModal
            onClose={() => setShowModal(false)}
            onCreate={(data) => {
              const normalized = {
                id: data.id,
                name:
                  data.type === "COMPANY"
                    ? data.companyName
                    : `${data.firstName || ""} ${data.lastName || ""}`.trim(),
                email: data.email,
                phone: data.phone,
                address: data.address,
                type: data.type,
                role: data.role,
                position: data.role,
              }

              setUsers((prev) => [...prev, normalized])
            }}
          />
        )}

      </section>
    </main>
  )
}
