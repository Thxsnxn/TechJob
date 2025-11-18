"use client";

import { useState } from "react";
//  import เป็น default เพราะไฟล์ lib/apiClient.js ใช้ `export default apiClient`
import apiClient from "@/lib/apiClient";

import { setAuthToken } from "@/lib/apiClient";
import { useEffect } from "react";


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
import { toast } from "sonner";

export default function CreateUserModal({ onClose, onCreate }) {

    useEffect(() => {
        try {
            const saved = sessionStorage.getItem("admin_session");
            if (saved) {
                const session = JSON.parse(saved);
                if (session.token) {
                    setAuthToken(session.token);
                    console.log("TOKEN LOADED =", session.token);
                }
            }
        } catch (e) {
            console.error("LOAD TOKEN ERROR:", e);
        }
    }, []);





    // โหมดหลัก: "employee" หรือ "customer"
    const [mode, setMode] = useState("employee");

    // ถ้า customer จะมี PERSON/COMPANY
    const [customerType, setCustomerType] = useState("PERSON");

    // state ของฟอร์มเก็บทุกฟิลด์ที่ใช้ในทั้ง 3 กรณี
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

    // handleChange → update state
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ==========================
    //  SUBMIT HANDLER
    // ==========================
    const handleSubmit = async () => {
        try {
            // validate
            if (mode === "employee") {
                if (!form.firstName || !form.lastName || !form.email) {
                    toast.error("กรุณากรอกชื่อ นามสกุล และอีเมลสำหรับพนักงาน");
                    return;
                }
            } else if (mode === "customer") {
                if (customerType === "PERSON") {
                    if (!form.firstName || !form.lastName || !form.email) {
                        toast.error("กรุณากรอกข้อมูลลูกค้า (บุคคล)");
                        return;
                    }
                } else {
                    if (!form.companyName || !form.contactName || !form.email) {
                        toast.error("กรุณากรอกข้อมูลลูกค้า (บริษัท)");
                        return;
                    }
                }
            }

            // ---- LOG 1: เช็ค token ----
            console.log("AUTH HEADER =", apiClient.defaults.headers.common["Authorization"]);

            let payload = {};
            let endpoint = "";

            // employee
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
            }

            // customer
            if (mode === "customer") {
                endpoint = "/add-customer";

                if (customerType === "PERSON") {
                    payload = {
                        type: "PERSON",
                        firstName: form.firstName,
                        lastName: form.lastName,
                        gender: form.gender,
                        username: form.username,
                        email: form.email,
                        phone: form.phone,
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

            // ---- LOG 2: เช็ค payload ก่อนยิง API ----
            console.log("PAYLOAD SENT =", payload);

            // POST API
            const res = await apiClient.post(endpoint, payload);

            toast.success("สร้างข้อมูลสำเร็จ!");

            onCreate?.(res.data);
            onClose();

        } catch (err) {
            // ---- LOG 3: เช็ค error จาก backend ----
            console.error("BACKEND ERROR =", err?.response?.data);

            toast.error(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "เกิดข้อผิดพลาด"
            );
        }
    };



    // ==========================
    //  UI
    // ==========================
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-xl w-[95%] md:w-[650px] p-6 space-y-6">
                <h2 className="text-2xl font-semibold">Create User</h2>

                {/* เลือก employee/customer */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
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

                <Card>
                    <CardHeader>
                        <h3 className="text-gray-500">User Information</h3>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {(mode === "employee" || customerType === "PERSON") && (
                            <>
                                <Input
                                    name="firstName"
                                    placeholder="First Name"
                                    value={form.firstName}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={form.lastName}
                                    onChange={handleChange}
                                />
                            </>
                        )}

                        {mode === "customer" && customerType === "COMPANY" && (
                            <>
                                <Input
                                    name="companyName"
                                    placeholder="Company Name"
                                    value={form.companyName}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="taxId"
                                    placeholder="Tax ID"
                                    value={form.taxId}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="branch"
                                    placeholder="Branch"
                                    value={form.branch}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="contactName"
                                    placeholder="Contact Name"
                                    value={form.contactName}
                                    onChange={handleChange}
                                />
                            </>
                        )}

                        <Input
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                        />

                        <Input
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <Input
                            name="phone"
                            placeholder="Phone"
                            value={form.phone}
                            onChange={handleChange}
                        />

                        <Input
                            name="address"
                            placeholder="Address"
                            value={form.address}
                            onChange={handleChange}
                        />

                        {(mode === "employee" || customerType === "PERSON") && (
                            <Select
                                onValueChange={(val) => setForm({ ...form, gender: val })}
                                defaultValue={form.gender}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Gender" />
                                </SelectTrigger>
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
                                <SelectTrigger>
                                    <SelectValue placeholder="Employee Role" />
                                </SelectTrigger>
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

                {/* ปุ่ม */}
                <div className="flex justify-between">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="bg-blue-600 text-white" onClick={handleSubmit}>
                        Create
                    </Button>
                </div>
            </div>
        </div>
    );
}
