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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Loader2, Package, Check } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export default function AddEquipmentModal({ isOpen, onClose, onConfirm, existingIds = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); // Store full item objects
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const fetchItems = async () => {
        try {
            setLoading(true);
            const payload = {
                search: searchTerm,
                type: "", // Fetch all types or specify if needed
                categoryId: "",
                unitId: "",
                page: page,
                pageSize: pageSize,
            };
            const res = await apiClient.post("/filter-items", payload);
            const fetchedItems = res.data?.items || [];
            setItems(fetchedItems);
            setTotalPages(Math.ceil((res.data?.total || 0) / pageSize));
        } catch (error) {
            console.error("Failed to fetch equipment:", error);
            toast.error("ไม่สามารถค้นหาข้อมูลอุปกรณ์ได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setSearchTerm("");
            setSelectedIds([]);
            setSelectedItems([]);
            setPage(1);
            fetchItems();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            fetchItems();
        }
    }, [page]); // Refetch when page changes

 const toggleSelection = (item) => {
    if (existingIds.includes(item.id)) return;

    // เช็คจาก State ปัจจุบันโดยตรง (ไม่ต้องไปเช็คใน Callback)
    const isSelected = selectedIds.includes(item.id);

    if (isSelected) {
        // กรณีเอาออก (Remove)
        setSelectedIds((prev) => prev.filter((id) => id !== item.id));
        setSelectedItems((current) => current.filter((i) => i.id !== item.id));
    } else {
        // กรณีเพิ่ม (Add)
        setSelectedIds((prev) => [...prev, item.id]);
        setSelectedItems((current) => [...current, item]);
    }
};

    const handleConfirm = () => {
        // Map to the format expected by the parent component
        const normalizedItems = selectedItems.map(item => ({
            id: item.id,
            code: item.code,
            name: item.name,
            type: item.type === "EQUIPMENT" ? "อุปกรณ์ (ยืม-คืน)" : "วัสดุ (เบิกเลย)",
            category: item.category?.name || "-",
            unit: item.unit?.name || "-",
            packUnit: item.packUnit?.name || "-",
            packSize: item.packSize || 1,
            stockQty: item.stockQty || 0, // Remaining stock
            total: item.qtyOnHand || 0, // Total stock (assuming qtyOnHand is total, need to verify mapping)
            requestQty: 1 // Default request quantity
        }));
        onConfirm(normalizedItems);
        onClose();
    };

    const handleSearch = () => {
        setPage(1);
        fetchItems();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 z-[1050]">
                <DialogHeader className="px-4 sm:px-6 py-4 border-b bg-gray-50 dark:bg-slate-950">
                    <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Package className="w-5 h-5 text-blue-600" />
                        เบิกอุปกรณ์ (Equipment Requisition)
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 border-b bg-white dark:bg-slate-900">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="ค้นหา รหัส, ชื่ออุปกรณ์..."
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
                        <table className="w-full text-sm text-left min-w-[800px]">
                            <thead className="bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-4 py-3 text-center w-[50px]">
                                        {/* Header Checkbox could go here if we wanted 'Select All' for page */}
                                    </th>
                                    <th className="px-4 py-3">รหัสอะไหล่</th>
                                    <th className="px-4 py-3">ชื่ออะไหล่</th>
                                    <th className="px-4 py-3 text-center">ประเภท</th>
                                    <th className="px-4 py-3 text-center">หมวดหมู่</th>
                                    <th className="px-4 py-3 text-center">หน่วยนับ</th>
                                    <th className="px-4 py-3 text-center">บรรจุ</th>
                                    <th className="px-4 py-3 text-center text-blue-600">คงเหลือ</th>
                                    <th className="px-4 py-3 text-center">ทั้งหมด</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-slate-800 bg-white dark:bg-slate-900">
                                {loading ? (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-gray-500">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                            กำลังค้นหา...
                                        </td>
                                    </tr>
                                ) : items.length > 0 ? (
                                    items.map((item) => {
                                        const isSelected = selectedIds.includes(item.id);
                                        const isAlreadyAdded = existingIds.includes(item.id);
                                        const isDisabled = isAlreadyAdded; // Disable if already added to the main list

                                        return (
                                            <tr
                                                key={item.id}
                                                className={`
                          transition-colors border-b dark:border-slate-800
                          ${isDisabled
                                                        ? "bg-gray-100 dark:bg-slate-800 opacity-60 cursor-not-allowed"
                                                        : "hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                                                    }
                          ${isSelected ? "bg-blue-50 dark:bg-blue-900/30" : ""}
                        `}
                                                onClick={() => !isDisabled && toggleSelection(item)}
                                            >
                                                <td className="px-4 py-3 text-center">
                                                    <Checkbox
                                                        checked={isSelected || isAlreadyAdded}
                                                        disabled={isDisabled}
                                                        onCheckedChange={() => !isDisabled && toggleSelection(item)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className={isAlreadyAdded ? "data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400" : ""}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                                                    {item.code}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                                                    {item.name}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge variant="outline" className={`font-normal text-xs whitespace-nowrap ${item.type === 'EQUIPMENT' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-orange-200 text-orange-700 bg-orange-50'}`}>
                                                        {item.type === 'EQUIPMENT' ? 'อุปกรณ์ (ยืม-คืน)' : 'วัสดุ (เบิกเลย)'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                                                    {item.category?.name || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                                                    {item.unit?.name || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                                                    {item.packSize || 1} {item.packUnit?.name || ""}
                                                </td>
                                                <td className="px-4 py-3 text-center font-bold text-blue-600 dark:text-blue-400">
                                                    {item.qtyOnHand || 0}
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-500">
                                                    {item.stockQty || 0}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-gray-400 italic">
                                            ไม่พบข้อมูลอุปกรณ์
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
                            เลือกแล้ว <span className="font-bold text-blue-600">{selectedIds.length}</span> รายการ
                        </div>
                        {/* Simple Pagination */}
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
