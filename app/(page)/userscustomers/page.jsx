"use client"

import React, { useState } from "react"
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

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import CreateUserModal from "./add/CreateUserModal"

export default function UserCustomersPage() {
  const [currentTab, setCurrentTab] = useState("customer")
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState("")

  const roleLabel = {
    customer: "Customer",
    lead: "Lead",
    engineer: "Engineer",
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700"
      case "Inactive":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <main className="">
      {/* Header */}
      <SiteHeader title="Users Customers" />
      <section className="p-6 space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Users & Customers Management</h1>
          <p className="text-muted-foreground">
            Manage employees and customer information
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          {["customer", "lead", "engineer"].map((role) => (
            <Button
              key={role}
              variant={currentTab === role ? "default" : "outline"}
              className={
                currentTab === role
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
              onClick={() => setCurrentTab(role)}
            >
              {roleLabel[role]}
            </Button>
          ))}

          <div className="flex-1 text-right">
            <Button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              + Create New {roleLabel[currentTab]}
            </Button>
          </div>
        </div>

        {/* Filter Section */}
        <Card>
          <CardContent className="grid md:grid-cols-2 gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Select {roleLabel[currentTab]}</label>
              <Input placeholder={`Search ${roleLabel[currentTab]}...`} />
            </div>
            {/*  */}
            <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">
              All {roleLabel[currentTab]}s
            </h2>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  {currentTab !== "customer" && <TableHead>Position</TableHead>}
                  {currentTab === "customer" && <TableHead>Address</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.length > 0 ? (
                  users
                    .filter((u) => u.role === currentTab)
                    .map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        {currentTab !== "customer" && (
                          <TableCell>{user.position}</TableCell>
                        )}
                        {currentTab === "customer" && (
                          <TableCell>{user.address}</TableCell>
                        )}
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              user.status
                            )} px-3 py-1 text-sm font-medium`}
                          >
                            {user.status}
                          </Badge>
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
                      {/* ไม่พบตามrole */}
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
            role={currentTab}
            onClose={() => setShowModal(false)}
            onCreate={(newUser) => {
              setUsers((prev) => [...prev, newUser])
            }}
          />
        )}
      </section>
    </main>
  )
}
