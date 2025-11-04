"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
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
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]")
    const updatedJobs = jobs.map((j) => (j.id === form.id ? form : j))
    localStorage.setItem("jobs", JSON.stringify(updatedJobs))
    toast.success("💾 Job Updated Successfully")
    onSave(form)
  }

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]")
    const updated = jobs.filter((j) => j.id !== job.id)
    localStorage.setItem("jobs", JSON.stringify(updated))
    toast.error("🗑️ Job Deleted")
    onDelete(job)
  }

  if (!form) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-auto p-4">
      <div className="bg-white rounded-xl shadow-lg w-[95%] md:w-[900px] max-h-[90vh] overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <h2 className="text-2xl font-bold mb-4">Edit Job</h2>

        {/* Job Info */}
        <Card>
          <CardHeader><h3 className="font-semibold text-lg">🧾 Job Information</h3></CardHeader>
          <CardContent className="grid gap-4">
            <Input name="title" placeholder="Job Title" value={form.title} onChange={handleChange} />
            <Textarea name="description" placeholder="Job Description" value={form.description} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <Input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
              <Input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader><h3 className="font-semibold text-lg">👥 Customer Information</h3></CardHeader>
          <CardContent className="grid gap-4">
            <Input name="customer.name" placeholder="Customer Name" value={form.customer?.name || ""} onChange={(e) => setForm({ ...form, customer: { ...form.customer, name: e.target.value } })} />
            <Input name="customer.contact" placeholder="Contact Number" value={form.customer?.contact || ""} onChange={(e) => setForm({ ...form, customer: { ...form.customer, contact: e.target.value } })} />
            <Input name="customer.address" placeholder="Address" value={form.customer?.address || ""} onChange={(e) => setForm({ ...form, customer: { ...form.customer, address: e.target.value } })} />
          </CardContent>
        </Card>

        {/* Location & Notes */}
        <Card>
          <CardHeader><h3 className="font-semibold text-lg">📍 Location</h3></CardHeader>
          <CardContent><Textarea name="location" placeholder="Enter location..." value={form.location || ""} onChange={handleChange} /></CardContent>
        </Card>
        <Card>
          <CardHeader><h3 className="font-semibold text-lg">📝 Notes</h3></CardHeader>
          <CardContent><Textarea name="notes" placeholder="Enter notes..." value={form.notes || ""} onChange={handleChange} /></CardContent>
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
