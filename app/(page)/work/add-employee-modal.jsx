"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Loader2, UserPlus, User, Users } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AddEmployeeModal({ isOpen, onClose, onConfirm, existingIds = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState("employee"); // 'employee' | 'supervisor'
    const pageSize = 10;

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const roleToSend = activeTab === "supervisor" ? "SUPERVISOR" : "EMPLOYEE";

            const payload = {
                search: searchTerm,
                role: roleToSend,
                workStatus: "",
                page: page,
                pageSize: pageSize,
            };
            const res = await apiClient.post("/filter-employees", payload);
            const fetchedUsers = res.data?.items || [];
            setUsers(fetchedUsers);
            setTotalPages(Math.ceil((res.data?.total || 0) / pageSize));
        } catch (error) {
            console.error("Failed to fetch employees:", error);
            toast.error("ไม่สามารถค้นหาข้อมูลพนักงานได้");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setSearchTerm("");
            setSelectedIds([]);
            setSelectedUsers([]);
            setPage(1);
            fetchUsers();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [page, activeTab]);

    // --- Logic สำหรับการเลือกรายบุคคล ---
    const toggleSelection = (user) => {
        // เช็คว่ามีอยู่แล้วหรือไม่
        if (existingIds.includes(user.id)) return;

        // เช็คเงื่อนไข BUSY: ห้ามเลือกเฉพาะถ้าเป็น "พนักงาน" (employee)
        // ถ้าเป็นหัวหน้า (supervisor) ต่อให้ BUSY ก็เลือกได้
        if (user.workstatus === 'BUSY' && activeTab === 'employee') return;

        const isSelected = selectedIds.includes(user.id);

        if (isSelected) {
            setSelectedIds((prev) => prev.filter((id) => id !== user.id));
            setSelectedUsers((current) => current.filter((u) => u.id !== user.id));
        } else {
            setSelectedIds((prev) => [...prev, user.id]);
            setSelectedUsers((current) => [...current, user]);
        }
    };

    // --- Logic สำหรับ Select All ---
    // 1. หาว่าในหน้าปัจจุบัน มีใครบ้างที่ "เลือกได้"
    const selectableUsersOnPage = users.filter(user => {
        // เงื่อนไขห้ามเลือก: มีอยู่แล้ว หรือ (เป็นพนักงาน และ BUSY)
        const isAlreadyAdded = existingIds.includes(user.id);
        const isBusyBlocked = user.workstatus === 'BUSY' && activeTab === 'employee';

        return !isAlreadyAdded && !isBusyBlocked;
    });

    // 2. เช็คว่า "ทุกคนที่เลือกได้" ถูกเลือกไปหมดแล้วหรือยัง
    const isAllSelected = selectableUsersOnPage.length > 0 && selectableUsersOnPage.every(user =>
        selectedIds.includes(user.id)
    );

    // 3. ฟังก์ชันกดปุ่ม Select All
    const handleSelectAll = () => {
        if (isAllSelected) {
            // เอาออกเฉพาะคนในหน้านี้ที่เลือกได้
            const idsToRemove = selectableUsersOnPage.map(u => u.id);
            setSelectedIds(prev => prev.filter(id => !idsToRemove.includes(id)));
            setSelectedUsers(prev => prev.filter(u => !idsToRemove.includes(u.id)));
        } else {
            // เลือกเพิ่มเฉพาะคนที่ยังไม่ได้เลือก
            const newUsers = selectableUsersOnPage.filter(u => !selectedIds.includes(u.id));
            setSelectedIds(prev => [...prev, ...newUsers.map(u => u.id)]);
            setSelectedUsers(prev => [...prev, ...newUsers]);
        }
    };

    const handleConfirm = () => {
        onConfirm(selectedUsers);
        onClose();
    };

    const handleSearch = () => {
        setPage(1);
        fetchUsers();
    };

    const handleClearAll = () => {
        setSelectedIds([]);
        setSelectedUsers([]);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 z-[1050]">
                <DialogHeader className="px-4 sm:px-6 py-4 border-b bg-gray-50 dark:bg-slate-950">
                    <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <UserPlus className="w-5 h-5 text-blue-600" />
                        เพิ่มทีมงาน (Add Staff)
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 border-b bg-white dark:bg-slate-900 space-y-4">
                    <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setPage(1); }} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="employee" className="flex items-center gap-2">
                                <Users className="w-4 h-4" /> พนักงาน (Employees)
                            </TabsTrigger>
                            <TabsTrigger value="supervisor" className="flex items-center gap-2">
                                <User className="w-4 h-4" /> หัวหน้างาน (Supervisors)
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="ค้นหา ชื่อ, เบอร์โทร..."
                                className="pl-9 bg-white dark:bg-slate-950"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "ค้นหา"}
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-0 bg-gray-50 dark:bg-slate-950 min-h-[300px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-4 py-3 text-center w-[50px]">
                                        {/* --- Checkbox Select All --- */}
                                        <Checkbox
                                            checked={isAllSelected}
                                            onCheckedChange={handleSelectAll}
                                            disabled={selectableUsersOnPage.length === 0}
                                        />
                                    </th>
                                    <th className="px-4 py-3">ชื่อ-นามสกุล</th>
                                    <th className="px-4 py-3 text-center">ตำแหน่ง</th>
                                    <th className="px-4 py-3 text-center">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-slate-800 bg-white dark:bg-slate-900">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-gray-500">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                            กำลังค้นหา...
                                        </td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map((user) => {
                                        const isSelected = selectedIds.includes(user.id);
                                        const isAlreadyAdded = existingIds.includes(user.id);
                                        const isBusy = user.workstatus === 'BUSY';

                                        // --- [แก้ไขเงื่อนไข] ---
                                        // Disable ถ้า:
                                        // 1. เคยเพิ่มไปแล้ว (isAlreadyAdded)
                                        // 2. BUSY และ เป็นหน้าพนักงาน (isBusy && activeTab === 'employee')
                                        // หัวหน้างาน (activeTab === 'supervisor') จะไม่โดนบล็อกด้วย isBusy
                                        const isDisabled = isAlreadyAdded || (isBusy && activeTab === 'employee');

                                        return (
                                            <tr
                                                key={user.id}
                                                className={`transition-colors border-b dark:border-slate-800 ${isDisabled
                                                        ? "bg-gray-100 dark:bg-slate-800 opacity-60 cursor-not-allowed"
                                                        : "hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                                                    } ${isSelected ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}
                                                onClick={() => !isDisabled && toggleSelection(user)}
                                            >
                                                <td className="px-4 py-3 text-center">
                                                    <Checkbox
                                                        checked={isSelected || isAlreadyAdded}
                                                        disabled={isDisabled}
                                                        onCheckedChange={() => !isDisabled && toggleSelection(user)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                        {user.firstName?.charAt(0) || "U"}
                                                    </div>
                                                    <div>
                                                        <div>{user.firstName} {user.lastName}</div>
                                                        <div className="text-xs text-muted-foreground">{user.username}</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                                                    <Badge variant="outline">{user.role || (activeTab === 'supervisor' ? 'Supervisor' : 'Employee')}</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`text-xs font-medium ${user.workstatus === 'BUSY' ? 'text-red-500' : 'text-green-500'}`}>
                                                        {user.workstatus || "FREE"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-gray-400 italic">
                                            ไม่พบข้อมูล{activeTab === 'supervisor' ? 'หัวหน้างาน' : 'พนักงาน'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <DialogFooter className="px-4 sm:px-6 py-4 border-t bg-gray-50 dark:bg-slate-950 flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-3 sm:gap-0">
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                        <div className="text-sm text-gray-500">
                            เลือกแล้ว <span className="font-bold text-blue-600">{selectedIds.length}</span> คน
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                ก่อนหน้า
                            </Button>
                            <span className="text-xs text-gray-500">
                                หน้า {page} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                ถัดไป
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        {/* ปุ่มล้างการเลือก */}
                        {selectedIds.length > 0 && (
                            <Button
                                variant="ghost"
                                onClick={handleClearAll}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
                            >
                                ล้างการเลือก
                            </Button>
                        )}
                        <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">ยกเลิก</Button>
                        <Button onClick={handleConfirm} disabled={selectedIds.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none">
                            ยืนยัน
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}