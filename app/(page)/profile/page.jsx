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
// [แก้ไข 1] เพิ่ม import clearAdminSession เข้ามาด้วย
import { getAdminSession, clearAdminSession } from "@/lib/adminSession"; 
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
            const res = await apiClient.get("/users/me");
            setUser(res.data);
        } catch (err) {
            console.warn("Failed to fetch user profile from API, falling back to session:", err);
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

    // [แก้ไข 2] เปลี่ยน Logic Logout ให้เหมือนกับ NavUser
    const handleLogout = () => {
        // 1) ลบ sessionStorage
        clearAdminSession();

        // 2) ลบ cookie admin_session
        let cookie = "admin_session=; Path=/; Max-Age=0; SameSite=Lax";
        if (process.env.NODE_ENV === "production") {
            cookie += "; Secure";
        }
        document.cookie = cookie;

        // 3) เด้งกลับหน้า login (เช็ค Path ให้ตรงกับโปรเจคคุณ เช่น /auth/login หรือ /login)
        router.push("/auth/login"); 
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
                    <Button onClick={() => router.push("/auth/login")}>กลับไปหน้าเข้าสู่ระบบ</Button>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
            <SiteHeader title="โปรไฟล์ของฉัน" />

            <main className="p-4 md:p-8 mx-auto space-y-8">
                {/* Header Profile Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-lg">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-3xl font-bold bg-white text-blue-600">
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center md:text-left text-white">
                            <h1 className="text-3xl font-bold tracking-tight flex flex-col md:flex-row items-center md:items-end gap-2 justify-center md:justify-start">
                                {user.name || "ผู้ใช้งาน"}
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                                    {user.role || "Employee"}
                                </Badge>
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg flex items-center justify-center md:justify-start gap-2">
                                {/* • {user.department || "แผนกทั่วไป"} */}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                className="bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm"
                                onClick={fetchUserProfile}
                            >
                                รีเฟรชข้อมูล
                            </Button>
                            
                            {/* ปุ่ม Logout สีแดง */}
                            <Button
                                variant="destructive"
                                className="bg-red-500/80 hover:bg-red-600 text-white border-none shadow-lg"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" /> ออกจากระบบ
                            </Button>
                        </div>
                    </div>
                </div>

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

// ... ส่วนอื่นๆ (RoleBasedActions, getPermissions, ProfileSkeleton) ปล่อยไว้เหมือนเดิมก็ได้ครับ ไม่ได้กระทบ Logout
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