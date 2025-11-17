"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function CreateUserModal({ role = "customer", onClose, onCreate }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        id: "",
        phone: "",
        position: "",
        address: "",
        notes: "",
        status: "Active",
    })

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleCreate = () => {
        if (!form.name || !form.email) {
            toast.error("Please fill in Name and Email")
            return
        }

        const newUser = {
            id: form.id || Math.floor(Math.random() * 100000000).toString(),
            name: form.name,
            email: form.email,
            phone: form.phone,
            position: form.position,
            address: form.address,
            notes: form.notes,
            status: form.status,
            role,
        }

        toast.success(`✅ New ${role.charAt(0).toUpperCase() + role.slice(1)} Created!`)
        onCreate?.(newUser)
        onClose?.()
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
<div className="rounded-xl shadow-lg w-[10%] md:w-[750px] p-6 space-y-6 bg-card">
                <h2 className="text-xl md:text-2xl font-semibold">
                    Create New {role.charAt(0).toUpperCase() + role.slice(1)}
                </h2>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <h3 className="font-medium text-gray-400 capitalize">{role} Information</h3>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        <Input name="name" placeholder={`Enter ${role} Name...`} value={form.name} onChange={handleChange} />
                        <Input name="email" placeholder={`Enter ${role} Email...`} value={form.email} onChange={handleChange} />
                        <Input name="id" placeholder={`Enter ${role} ID...`} value={form.id} onChange={handleChange} />
                        <Input name="phone" placeholder={`Enter ${role} Phone...`} value={form.phone} onChange={handleChange} />

                        {/* ฟิลด์พิเศษตาม role */}
                        {role === "lead" && (
                            <Select value={form.position} onValueChange={(val) => setForm({ ...form, position: val })}>
                                <SelectTrigger><SelectValue placeholder="Auto filled Position..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Manager">Manager</SelectItem>
                                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                                    <SelectItem value="Front end">Front end</SelectItem>
                                </SelectContent>
                            </Select>
                        )}

                        {role === "engineer" && (
                            <Select value={form.position} onValueChange={(val) => setForm({ ...form, position: val })}>
                                <SelectTrigger><SelectValue placeholder="Select Engineer Position..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fireguard">Fireguard</SelectItem>
                                    <SelectItem value="Network Technician">Network Technician</SelectItem>
                                    <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </CardContent>
                </Card>

            
                {/* Buttons */}
                <div className="flex justify-between">
                    <Button variant="outline" className="bg-gray-200 hover:bg-gray-300" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreate}>
                        Create
                    </Button>
                </div>
            </div>
        </div>
    )
}
