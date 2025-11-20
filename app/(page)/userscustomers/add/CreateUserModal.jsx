"use client";

import { useState, useEffect } from "react";
import apiClient, { setAuthToken } from "@/lib/apiClient";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectValue,
    SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { toast } from "sonner";

export default function CreateUserModal({ open, onClose, onCreate }) {

    useEffect(() => {
        const saved = sessionStorage.getItem("admin_session");
        if (saved) {
            const session = JSON.parse(saved);
            if (session.token) {
                setAuthToken(session.token);
            }
        }
    }, []);

    const [mode, setMode] = useState("employee");
    const [customerType, setCustomerType] = useState("PERSON");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        role: "",
        companyName: "",
        taxId: "",
        branch: "",
        contactName: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ============== SUBMIT ============
    const handleSubmit = async () => {
        try {
            let endpoint = "";
            let payload = {};

            if (mode === "employee") {
                endpoint = "/add-employee";
                payload = {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    username: form.username,
                    email: form.email,
                    phone: form.phone,
                    gender: form.gender,
                    address: form.address,
                    role: form.role,
                };
            } else {
                endpoint = "/add-customer";

                if (customerType === "PERSON") {
                    payload = {
                        type: "PERSON",
                        firstName: form.firstName,
                        lastName: form.lastName,
                        username: form.username,
                        email: form.email,
                        phone: form.phone,
                        gender: form.gender,
                        address: form.address,
                    };
                } else {
                    payload = {
                        type: "COMPANY",
                        companyName: form.companyName,
                        taxId: form.taxId,
                        branch: form.branch,
                        contactName: form.contactName,
                        username: form.username,
                        email: form.email,
                        phone: form.phone,
                        address: form.address,
                    };
                }
            }

            const res = await apiClient.post(endpoint, payload);
            toast.success("สร้างข้อมูลสำเร็จ");

            onCreate?.(res.data);
            onClose();
        } catch (err) {
            console.error("BACKEND ERROR =", err?.response?.data);
            toast.error("เกิดข้อผิดพลาด");
        }
    };

    // ============= UI ===============
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[650px] max-h-[85vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                </DialogHeader>

                {/* MAIN CONTENT */}
                <div className="space-y-6">
                    {/* MODE SELECT */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <Select
                            onValueChange={(val) => {
                                setMode(val);
                                if (val !== "customer") setCustomerType("PERSON");
                            }}
                            defaultValue={mode}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="employee">Create Employee</SelectItem>
                                <SelectItem value="customer">Create Customer</SelectItem>
                            </SelectContent>
                        </Select>

                        {mode === "customer" && (
                            <Select
                                onValueChange={setCustomerType}
                                defaultValue={customerType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Customer Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PERSON">Person</SelectItem>
                                    <SelectItem value="COMPANY">Company</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* FORM */}
                    <Card>
                        <CardHeader>
                            <h3 className="text-gray-500">User Information</h3>
                        </CardHeader>

                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* — PERSON CASE — */}
                            {(mode === "employee" || customerType === "PERSON") && (
                                <>
                                    <Input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
                                    <Input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
                                </>
                            )}

                            {/* — COMPANY CASE — */}
                            {mode === "customer" && customerType === "COMPANY" && (
                                <>
                                    <Input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} />
                                    <Input name="taxId" placeholder="Tax ID" value={form.taxId} onChange={handleChange} />
                                    <Input name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} />
                                    <Input name="contactName" placeholder="Contact Name" value={form.contactName} onChange={handleChange} />
                                </>
                            )}

                            {/* COMMON FIELDS */}
                            <Input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
                            <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                            <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
                            <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} />

                            {(mode === "employee" || customerType === "PERSON") && (
                                <Select
                                    onValueChange={(val) => setForm({ ...form, gender: val })}
                                    defaultValue={form.gender}
                                >
                                    <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MALE">Male</SelectItem>
                                        <SelectItem value="FEMALE">Female</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}

                            {mode === "employee" && (
                                <Select
                                    onValueChange={(val) => setForm({ ...form, role: val })}
                                    defaultValue={form.role}
                                >
                                    <SelectTrigger><SelectValue placeholder="Employee Role" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CEO">CEO</SelectItem>
                                        <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="EMPLOYEE">Employee</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}

                        </CardContent>
                    </Card>
                </div>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button className="bg-blue-600 text-white" onClick={handleSubmit}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
