"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

export default function OvertimeViewModal({ request, onClose, onApprove, onReject }) {
  const [showReject, setShowReject] = useState(false)
  const [reason, setReason] = useState("")

  if (!request) return null

  const typeColor = (type) => {
    if (type === "Real-time") return "bg-blue-100 text-blue-700 border border-blue-200"
    if (type === "Retrospective") return "bg-purple-100 text-purple-700 border border-purple-200"
    return "bg-gray-100 text-gray-700"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl max-h-[90vh]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">View Overtime Request</h3>
              <Badge className={typeColor(request.type)}>{request.type}</Badge>
            </div>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4 max-h-[calc(90vh-64px)] overflow-y-auto p-6 pr-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Engineer</div>
                  <div className="font-medium">{request.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Job ID</div>
                  <div className="font-medium">{request.jobId}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Request Date</div>
                  <div className="font-medium">{request.date}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">OT Period</div>
                  <div className="font-medium">{request.period}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                  <div className="font-medium">{request.hours}</div>
                </div>
              </div>

              {request.note ? (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Engineer Note</div>
                  <div className="whitespace-pre-wrap">{request.note}</div>
                </div>
              ) : null}

              {/* สำหรับ Retrospective แสดงรูปหลักฐานถ้ามี */}
              {request.type === "Retrospective" && Array.isArray(request.images) && request.images.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Evidence</div>
                  <div className="grid grid-cols-3 gap-2">
                    {request.images.map((src, i) => (
                      <img key={i} src={src} alt={`evidence-${i}`} className="h-28 w-full object-cover rounded-md border" />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                {!showReject ? (
                  <div className="flex items-center gap-2 justify-end">
                    <Button className="bg-green-600 text-white hover:bg-green-700" onClick={() => onApprove(request)}>
                      Approve
                    </Button>
                    <Button variant="destructive" onClick={() => setShowReject(true)}>
                      Reject
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-md p-3">
                    <div className="text-sm font-medium mb-2">Reject reason</div>
                    <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Please provide a reason..." />
                    <div className="flex items-center justify-end gap-2 mt-3">
                      <Button variant="outline" onClick={() => { setReason(""); setShowReject(false); }}>Cancel</Button>
                      <Button variant="destructive" onClick={() => onReject(request, reason)}>Confirm Reject</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


