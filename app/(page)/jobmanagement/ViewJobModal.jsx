"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

export default function ViewJobModal({ job, onClose }) {
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    if (job) {
      setDetail(job)
    }
  }, [job])

  if (!detail) return null

  const statusColor = (status) => {
    const s = status?.toLowerCase() || ""
    if (s === "completed") return "bg-green-100 text-green-700"
    if (s.includes("progress")) return "bg-blue-100 text-blue-700"
    if (s.includes("review")) return "bg-purple-100 text-purple-700"
    if (s.includes("fix")) return "bg-red-100 text-red-700"
    return "bg-gray-100 text-gray-700"
  }

  // Helper to get customer info safely
  const customerObj = detail.customerObj || (typeof detail.customer === 'object' ? detail.customer : null)
  const customerName = customerObj?.name || customerObj?.companyName || (typeof detail.customer === 'string' ? detail.customer : "-")
  const customerContact = customerObj?.contactName || customerObj?.contact || "-"
  const customerAddress = customerObj?.address || detail.address || "-"
  const customerPhone = customerObj?.phone || customerObj?.tel || "-"

  // Helper to separate staff
  const lead = detail.lead || detail.assignedStaff?.find(s => s.role === 'SUPERVISOR')
  const engineers = detail.engineers || detail.assignedStaff?.filter(s => s.role === 'EMPLOYEE') || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">View Job</h3>
              <Badge className={statusColor(detail.status)}>{detail.status}</Badge>
            </div>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* --- Job Information --- */}
            <Card>
              <CardHeader><h2 className="font-semibold text-lg">🧾 Job Information</h2></CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm text-muted-foreground">Job Title</label><p>{detail.title}</p></div>
                  <div><label className="text-sm text-muted-foreground">Date Range</label><p>{detail.dateRange || detail.startDate || "-"}</p></div>
                </div>
                <div><label className="text-sm text-muted-foreground">Description</label><p className="whitespace-pre-wrap">{detail.description || "-"}</p></div>
              </CardContent>
            </Card>

            {/* --- Customer --- */}
            <Card>
              <CardHeader><h2 className="font-semibold text-lg">👥 Customer Information</h2></CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <p><span className="text-sm text-muted-foreground">Name</span><br />{customerName}</p>
                <p><span className="text-sm text-muted-foreground">Contact</span><br />{customerContact} {customerPhone !== "-" && `(${customerPhone})`}</p>
                <p><span className="text-sm text-muted-foreground">Address</span><br />{customerAddress}</p>
              </CardContent>
            </Card>

            {/* --- Lead --- */}
            <Card>
              <CardHeader><h2 className="font-semibold text-lg">🧑‍💼 Assigned Lead</h2></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lead ? (
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>{lead.id}</TableCell>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell>{lead.position || "Supervisor"}</TableCell>
                      </TableRow>
                    ) : (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No Lead Assigned</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* --- Engineers --- */}
            <Card>
              <CardHeader><h2 className="font-semibold text-lg">🧑‍🔧 Engineer(s)</h2></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {engineers.length > 0 ? (
                      engineers.map((eng, i) => (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{eng.id}</TableCell>
                          <TableCell>{eng.name}</TableCell>
                          <TableCell>{eng.position || "Technician"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No Engineer Assigned</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* --- Location & Map --- */}
            <Card>
              <CardHeader><h2 className="font-semibold text-lg">📍 Location Details</h2></CardHeader>
              <CardContent className="space-y-4">
                <p>{detail.locationName || detail.location || "-"}</p>
                {detail.lat && detail.lng ? (
                  <div className="w-full h-[300px] rounded-md overflow-hidden border relative">
                    <iframe
                      className="w-full h-full pointer-events-none"
                      frameBorder="0"
                      src={`https://maps.google.com/maps?q=${detail.lat},${detail.lng}&z=15&output=embed`}
                      allowFullScreen
                    ></iframe>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${detail.lat},${detail.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 bg-white/90 text-xs px-2 py-1 rounded shadow hover:bg-white"
                    >
                      Open in Maps
                    </a>
                  </div>
                ) : (
                  <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center text-muted-foreground rounded-md">
                    No Map Data Available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><h2 className="font-semibold text-lg">📝 Notes</h2></CardHeader>
              <CardContent><p className="whitespace-pre-wrap">{detail.note || detail.notes || "-"}</p></CardContent>
            </Card>

            {/* --- Actions --- */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
