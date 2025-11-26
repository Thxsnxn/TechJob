import React from "react";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    User,
    Users,
    Package,
    FileText,
    Info,
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function WorkDetailView({ work, onBack }) {
    if (!work) return null;

    // Helper to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
            case "In Progress":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
            case "Pending":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
            case "Reject":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed":
                return <CheckCircle2 className="w-4 h-4 mr-1" />;
            case "In Progress":
                return <Clock className="w-4 h-4 mr-1" />;
            case "Pending":
                return <AlertCircle className="w-4 h-4 mr-1" />;
            case "Reject":
                return <XCircle className="w-4 h-4 mr-1" />;
            default:
                return <Info className="w-4 h-4 mr-1" />;
        }
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 flex-none">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onBack}
                    className="h-10 w-10 rounded-full border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {work.title}
                        </h1>
                        <Badge
                            variant="outline"
                            className={cn("px-3 py-1 border", getStatusColor(work.status))}
                        >
                            {getStatusIcon(work.status)}
                            {work.status === "Pending"
                                ? "รอดำเนินการ"
                                : work.status === "In Progress"
                                    ? "กำลังดำเนินการ"
                                    : work.status === "Completed"
                                        ? "เสร็จสิ้น"
                                        : work.status === "Reject"
                                            ? "ยกเลิก"
                                            : work.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {work.dateRange || "ไม่ระบุวันที่"}
                    </p>
                </div>
            </div>

            {/* Content ScrollArea */}
            <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
                    {/* Left Column: Info & Staff */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 1. Job Information */}
                        <Card className="border-none shadow-md bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="w-5 h-5 text-primary" />
                                    รายละเอียดงาน
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <p className="text-sm text-muted-foreground mb-1">ลูกค้า</p>
                                        <div className="flex items-center gap-2 font-medium">
                                            <User className="w-4 h-4 text-blue-500" />
                                            {work.customer || "-"}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <p className="text-sm text-muted-foreground mb-1">
                                            หัวหน้างาน (Lead)
                                        </p>
                                        <div className="flex items-center gap-2 font-medium">
                                            <User className="w-4 h-4 text-orange-500" />
                                            {work.leadEngineer || "-"}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        รายละเอียดเพิ่มเติม
                                    </p>
                                    <p className="text-sm leading-relaxed">
                                        {work.description || "-"}
                                    </p>
                                </div>

                                {work.note && (
                                    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30">
                                        <p className="text-sm text-yellow-700 dark:text-yellow-500 font-medium mb-1 flex items-center gap-2">
                                            <Info className="w-4 h-4" /> หมายเหตุ
                                        </p>
                                        <p className="text-sm text-yellow-600 dark:text-yellow-400/80">
                                            {work.note}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 2. Staff List */}
                        <Card className="border-none shadow-md bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Users className="w-5 h-5 text-primary" />
                                    ทีมงานที่ปฏิบัติหน้าที่
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {work.assignedStaff && work.assignedStaff.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {work.assignedStaff.map((staff, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 hover:shadow-sm transition-shadow"
                                            >
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {staff.name?.charAt(0) || "S"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{staff.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {staff.role || "Staff"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        ไม่มีพนักงานที่ได้รับมอบหมาย
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 3. Location / Map */}
                        <Card className="border-none shadow-md bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    สถานที่ปฏิบัติงาน
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-none" />
                                    <div>
                                        <p className="font-medium text-sm">
                                            {work.locationName || "ไม่ระบุชื่อสถานที่"}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {work.address || "ไม่ระบุที่อยู่"}
                                        </p>
                                    </div>
                                </div>

                                {/* Placeholder for Map - In a real app, integrate Google Maps or Leaflet here */}
                                {work.lat && work.lng ? (
                                    <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center group">
                                        <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=13.7563,100.5018&zoom=12&size=600x300&maptype=roadmap&key=YOUR_API_KEY_HERE')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        <div className="z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-red-500" />
                                            <span className="text-xs font-medium">
                                                {work.lat}, {work.lng}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                                        <MapPin className="w-8 h-8 mb-2 opacity-20" />
                                        <span className="text-sm">ไม่พบพิกัดแผนที่</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Equipment / Requisitions */}
                    <div className="lg:col-span-1">
                        <Card className="border-none shadow-md bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Package className="w-5 h-5 text-primary" />
                                    รายการเบิกอุปกรณ์
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 p-0">
                                {work.requisitions && work.requisitions.length > 0 ? (
                                    <div className="relative">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="hover:bg-transparent border-b border-gray-100 dark:border-gray-800">
                                                    <TableHead className="w-[60%] pl-6">รายการ</TableHead>
                                                    <TableHead className="text-right pr-6">จำนวน</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {work.requisitions.map((req, idx) => (
                                                    <TableRow
                                                        key={req.id || idx}
                                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 last:border-0"
                                                    >
                                                        <TableCell className="pl-6 py-3">
                                                            <div className="font-medium text-sm">
                                                                {req.item?.name || "Unknown Item"}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {req.item?.code || "-"}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right pr-6 py-3">
                                                            <Badge variant="secondary" className="font-mono">
                                                                {req.qtyRequest} {req.item?.unit || "หน่วย"}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                            <Package className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium">ไม่มีรายการเบิก</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            งานนี้ไม่มีการเบิกใช้อุปกรณ์
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
