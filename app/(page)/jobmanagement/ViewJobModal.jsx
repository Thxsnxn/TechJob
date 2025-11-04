"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function ViewJobModal({ job, onClose, onApprove, onReject }) {
  const [detail, setDetail] = useState(null)
  const [showRejectNote, setShowRejectNote] = useState(false)
  const [rejectNote, setRejectNote] = useState("")

  useEffect(() => {
    if (!job?.id) return
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]")
    const found = jobs.find((j) => j.id === job.id)
    setDetail(found || job)
  }, [job])

  if (!detail) return null

  const statusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-yellow-100 text-yellow-700"
      case "Approved": return "bg-green-100 text-green-700"
      case "Rejected": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const handleApprove = () => {
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]")
    const updated = jobs.map((j) =>
      j.id === detail.id ? { ...j, status: "Approved" } : j
    )
    localStorage.setItem("jobs", JSON.stringify(updated))
    toast.success("✅ Job Approved")
    onApprove(detail)
  }

  const handleReject = () => {
    if (!rejectNote.trim()) {
      toast.error("Please provide a reject reason")
      return
    }
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]")
    const updated = jobs.map((j) =>
      j.id === detail.id ? { ...j, status: "Rejected", rejectNote } : j
    )
    localStorage.setItem("jobs", JSON.stringify(updated))
    toast.error("❌ Job Rejected")
    onReject(detail, rejectNote)
  }

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
                  <div><label className="text-sm text-muted-foreground">Job ID</label><p>{detail.id}</p></div>
                  <div><label className="text-sm text-muted-foreground">Job Title</label><p>{detail.title}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm text-muted-foreground">Start Date</label><p>{detail.startDate || "-"}</p></div>
                  <div><label className="text-sm text-muted-foreground">Due Date</label><p>{detail.dueDate || "-"}</p></div>
                </div>
                <div><label className="text-sm text-muted-foreground">Description</label><p className="whitespace-pre-wrap">{detail.description || "-"}</p></div>
              </CardContent>
            </Card>

            {/* --- Customer --- */}
            <Card>
              <CardHeader><h2 className="font-semibold text-lg">👥 Customer Information</h2></CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <p><span className="text-sm text-muted-foreground">Name</span><br />{detail.customer?.name || "-"}</p>
                <p><span className="text-sm text-muted-foreground">Contact</span><br />{detail.customer?.contact || "-"}</p>
                <p><span className="text-sm text-muted-foreground">Address</span><br />{detail.customer?.address || "-"}</p>
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
                    {detail.lead ? (
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>{detail.lead.id}</TableCell>
                        <TableCell>{detail.lead.name}</TableCell>
                        <TableCell>{detail.lead.position}</TableCell>
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
                    {detail.engineers?.length ? (
                      detail.engineers.map((eng, i) => (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{eng.id}</TableCell>
                          <TableCell>{eng.name}</TableCell>
                          <TableCell>{eng.position}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No Engineer Assigned</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* --- Location & Notes --- */}
            <Card>
              <CardHeader><h2 className="font-semibold text-lg">📍 Location Details</h2></CardHeader>
              <CardContent><p>{detail.location || "-"}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><h2 className="font-semibold text-lg">📝 Notes</h2></CardHeader>
              <CardContent><p className="whitespace-pre-wrap">{detail.notes || "-"}</p></CardContent>
            </Card>

            {/* --- Actions --- */}
            {detail.status === "Completed" ? (
              !showRejectNote ? (
                <div className="flex justify-end gap-2">
                  <Button className="bg-green-600 text-white hover:bg-green-700" onClick={handleApprove}>Approve</Button>
                  <Button variant="destructive" onClick={() => setShowRejectNote(true)}>Reject</Button>
                </div>
              ) : (
                <div className="border rounded-md p-4">
                  <label className="text-sm font-medium">Reject Reason</label>
                  <Textarea rows={3} value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} placeholder="Please provide reason..." />
                  <div className="flex justify-end gap-2 mt-3">
                    <Button variant="outline" onClick={() => setShowRejectNote(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleReject}>Confirm Reject</Button>
                  </div>
                </div>
              )
            ) : (
              <div className="flex justify-end">
                <Button variant="outline" onClick={onClose}>Back</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
