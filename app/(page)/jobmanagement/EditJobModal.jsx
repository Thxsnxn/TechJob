"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function EditJobModal({ job, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(job)

  useEffect(() => {
    if (job) setForm(job)
  }, [job])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Simulation
    toast.success("💾 Job Updated Successfully (Simulation)")
    onSave(form)
  }

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return
    // Simulation
    toast.error("🗑️ Job Deleted (Simulation)")
    onDelete(job)
  }

  if (!form) return null

  // Helper to handle customer fields safely
  const customerName = typeof form.customer === 'object' ? (form.customer?.name || form.customer?.companyName) : form.customer
  const customerContact = typeof form.customer === 'object' ? form.customer?.contact : ""
  const customerAddress = typeof form.customer === 'object' ? form.customer?.address : ""

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-auto p-4">
      <div className="bg-white dark:bg-black text-gray-900 dark:text-white rounded-xl shadow-lg w-[95%] md:w-[900px] max-h-[90vh] overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit Job</h2>

        <Card>
          <CardHeader><h3 className="font-semibold text-lg">🧾 Job Information</h3></CardHeader>
          <CardContent className="grid gap-4">
            <Input name="title" placeholder="Job Title" value={form.title || ""} onChange={handleChange} />
            <Textarea name="description" placeholder="Job Description" value={form.description || ""} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <Input type="date" name="startDate" value={form.startDate || ""} onChange={handleChange} />
              <Input type="date" name="dueDate" value={form.dueDate || ""} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader><h3 className="font-semibold text-lg">👥 Customer Information</h3></CardHeader>
          <CardContent className="grid gap-4">
            <Input
              name="customerName"
              placeholder="Customer Name"
              value={customerName || ""}
              onChange={(e) => setForm({ ...form, customer: { ...form.customer, name: e.target.value } })}
              disabled={typeof form.customer === 'string'} // Disable if simple string
            />
            <Input
              name="customerContact"
              placeholder="Contact Number"
              value={customerContact || ""}
              onChange={(e) => setForm({ ...form, customer: { ...form.customer, contact: e.target.value } })}
              disabled={typeof form.customer === 'string'}
            />
            <Input
              name="customerAddress"
              placeholder="Address"
              value={customerAddress || ""}
              onChange={(e) => setForm({ ...form, customer: { ...form.customer, address: e.target.value } })}
              disabled={typeof form.customer === 'string'}
            />
          </CardContent>
        </Card>

        {/* Location & Notes */}
        <Card>
          <CardHeader><h3 className="font-semibold text-lg">📍 Location</h3></CardHeader>
          <CardContent><Textarea name="location" placeholder="Enter location..." value={form.locationName || form.location || ""} onChange={handleChange} /></CardContent>
        </Card>
        <Card>
          <CardHeader><h3 className="font-semibold text-lg">📝 Notes</h3></CardHeader>
          <CardContent><Textarea name="notes" placeholder="Enter notes..." value={form.note || form.notes || ""} onChange={handleChange} /></CardContent>
        </Card>

        {/* Footer Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
