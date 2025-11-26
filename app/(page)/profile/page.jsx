"use client";

import React, { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    User,
    Mail,
    Phone,
    Building,
    Briefcase,
    MapPin,
    CalendarDays,
    Shield,
    LogOut,
    Settings,
    FileText,
    Users,
    BriefcaseBusiness,
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { getAdminSession } from "@/lib/adminSession";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            // 1. Try fetching from API
            // Note: If this endpoint doesn't exist yet, it will fail and we'll fall back to session
            const res = await apiClient.get("/users/me");
            setUser(res.data);
        } catch (err) {
            console.warn("Failed to fetch user profile from API, falling back to session:", err);
            // 2. Fallback to Session
            const session = getAdminSession();
            if (session) {
                setUser(session);
            } else {
                setError("ไม่พบข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Implement logout logic here (e.g., clear session, redirect)
        // For now, just redirect to login or show alert
        alert("Logout functionality to be implemented");
    };

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-center">
                <div className="text-center p-8">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">เกิดข้อผิดพลาด</h2>
                    <p className="text-slate-500 mb-4">{error}</p>
                    <Button onClick={() => router.push("/login")}>กลับไปหน้าเข้าสู่ระบบ</Button>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
            <SiteHeader title="โปรไฟล์ของฉัน" />

            <main className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
                {/* Header Profile Card */}
                <Card className="overflow-hidden border-none shadow-lg">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                        <div className="absolute -bottom-12 left-8">
                            <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-900 shadow-md">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
                                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <CardContent className="pt-16 pb-6 px-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    {user.name || "ผู้ใช้งาน"}
                                    <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                                        {user.role || "Employee"}
                                    </Badge>
                                </h1>
                                <p className="text-slate-500 flex items-center gap-2 mt-1">
                                    <Briefcase className="h-4 w-4" />
                                    {user.position || "พนักงานทั่วไป"} {/* • {user.department || "แผนกทั่วไป"} */}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={fetchUserProfile}>
                                    รีเฟรชข้อมูล
                                </Button>
                                <Button variant="destructive" size="sm" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" /> ออกจากระบบ
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Personal Info */}
                    <div className="md:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="h-5 w-5 text-blue-500" /> ข้อมูลส่วนตัว
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoItem icon={<Mail />} label="อีเมล" value={user.email || "-"} />
                                <InfoItem icon={<Phone />} label="เบอร์โทรศัพท์" value={user.phone || "-"} />
                                <InfoItem icon={<Building />} label="รหัสพนักงาน" value={user.code || "-"} />
                                <InfoItem icon={<CalendarDays />} label="วันที่เริ่มงาน" value={user.joinedDate ? new Date(user.joinedDate).toLocaleDateString("th-TH") : "-"} />
                                <InfoItem icon={<MapPin />} label="ที่อยู่" value={user.address || "-"} className="md:col-span-2" />
                            </CardContent>
                        </Card>

                        {/* Role Based Actions */}
                        {/* <RoleBasedActions role={user.role} /> */}
                    </div>

                    {/* Right Column: Stats or Additional Info */}
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Shield className="h-5 w-5 text-green-500" /> สิทธิ์การใช้งาน
                                </CardTitle>
                                <CardDescription>สิทธิ์ที่คุณได้รับในระบบ</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {getPermissions(user.role).map((perm, index) => (
                                        <Badge key={index} variant="outline" className="bg-slate-50 text-slate-600">
                                            {perm}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

function InfoItem({ icon, label, value, className = "" }) {
    return (
        <div className={`flex items-start gap-3 ${className}`}>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                {React.cloneElement(icon, { className: "h-4 w-4" })}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-base text-slate-900 dark:text-slate-100 font-medium">{value}</p>
            </div>
        </div>
    );
}

function RoleBasedActions({ role }) {
    if (!role) return null;

    const actions = {
        CEO: [
            { label: "ตั้งค่าระบบ", icon: <Settings />, href: "/settings", color: "bg-slate-900 text-white hover:bg-slate-800" },
            { label: "ดูรายงานสรุป", icon: <FileText />, href: "/reports", color: "bg-blue-600 text-white hover:bg-blue-700" },
            { label: "จัดการผู้ใช้งาน", icon: <Users />, href: "/userscustomers", color: "bg-indigo-600 text-white hover:bg-indigo-700" },
        ],
        ADMIN: [
            { label: "จัดการงานทั้งหมด", icon: <BriefcaseBusiness />, href: "/jobmanagement", color: "bg-blue-600 text-white hover:bg-blue-700" },
            { label: "จัดการผู้ใช้งาน", icon: <Users />, href: "/userscustomers", color: "bg-indigo-600 text-white hover:bg-indigo-700" },
        ],
        EMPLOYEE: [
            { label: "งานของฉัน", icon: <BriefcaseBusiness />, href: "/work", color: "bg-blue-600 text-white hover:bg-blue-700" },
            { label: "ปฏิทินงาน", icon: <CalendarDays />, href: "/calendar", color: "bg-green-600 text-white hover:bg-green-700" },
        ],
    };

    const currentActions = actions[role] || actions["EMPLOYEE"];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Briefcase className="h-5 w-5 text-orange-500" /> เมนูด่วน
                </CardTitle>
                <CardDescription>เมนูที่ใช้งานบ่อยสำหรับ {role}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentActions.map((action, index) => (
                    <Button
                        key={index}
                        className={`w-full justify-start h-12 text-base ${action.color}`}
                        asChild
                    >
                        <a href={action.href}>
                            {React.cloneElement(action.icon, { className: "mr-2 h-5 w-5" })}
                            {action.label}
                        </a>
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
}

function getPermissions(role) {
    switch (role) {
        case "CEO":
            return ["Access All", "Manage Users", "View Reports", "System Settings"];
        case "ADMIN":
            return ["Manage Jobs", "Manage Users", "View Reports", "Edit Data"];
        case "SUPERVISOR":
            return ["View Reports", "Manage Team", "Approve Jobs"];
        default:
            return ["View My Jobs", "Update Job Status", "View Calendar"];
    }
}

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
            <SiteHeader title="โปรไฟล์ของฉัน" />
            <main className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
                <Skeleton className="h-48 w-full rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <Skeleton className="h-64 w-full rounded-xl" />
                        <Skeleton className="h-48 w-full rounded-xl" />
                    </div>
                    <div className="space-y-8">
                        <Skeleton className="h-48 w-full rounded-xl" />
                    </div>
                </div>
            </main>
        </div>
    );
}
