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
import { Search, Loader2, Package, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export default function AddEquipmentModal({
    isOpen,
    onClose,
    onConfirm,
    existingIds = [],
    existingRequisitions = []
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState(""); // Default empty
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [itemQuantities, setItemQuantities] = useState({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const fetchItems = async () => {
        try {
            setLoading(true);
            const payload = {
                search: searchTerm,
                type: typeFilter === "ALL" ? undefined : typeFilter,
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
            setItemQuantities({});
            setPage(1);
            fetchItems();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            fetchItems();
        }
    }, [page, searchTerm, typeFilter]);

    const handleSearch = () => {
        setPage(1);
        fetchItems();
    };

    const toggleSelection = (item) => {
        if (selectedIds.includes(item.id)) {
            setSelectedIds(selectedIds.filter((id) => id !== item.id));
            setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
            const newQuantities = { ...itemQuantities };
            delete newQuantities[item.id];
            setItemQuantities(newQuantities);
        } else {
            setSelectedIds([...selectedIds, item.id]);
            setSelectedItems([...selectedItems, item]);
            setItemQuantities({ ...itemQuantities, [item.id]: 1 });
        }
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            const newIds = [...selectedIds];
            const newItems = [...selectedItems];
            const newQuantities = { ...itemQuantities };

            items.forEach(item => {
                if (!newIds.includes(item.id)) {
                    newIds.push(item.id);
                    newItems.push(item);
                    newQuantities[item.id] = 1;
                }
            });

            setSelectedIds(newIds);
            setSelectedItems(newItems);
            setItemQuantities(newQuantities);
        } else {
            const newIds = selectedIds.filter(id => !items.find(i => i.id === id));
            const newItems = selectedItems.filter(i => !items.find(item => item.id === i.id));
            const newQuantities = { ...itemQuantities };
            items.forEach(item => delete newQuantities[item.id]);

            setSelectedIds(newIds);
            setSelectedItems(newItems);
            setItemQuantities(newQuantities);
        }
    };

    const handleQuantityChange = (itemId, qty) => {
        if (qty < 1) return;
        setItemQuantities({ ...itemQuantities, [itemId]: qty });
    };

    const handleConfirm = () => {
        const result = selectedItems.map(item => ({
            ...item,
            requestQty: itemQuantities[item.id] || 1
        }));

        // Confirmation Dialog
        const confirmMessage = `ยืนยันการเบิกอุปกรณ์ ${result.length} รายการ?`;
        if (window.confirm(confirmMessage)) {
            onConfirm(result);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] sm:max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 z-[1050]">
                <DialogHeader className="px-4 sm:px-6 py-4 border-b bg-gray-50 dark:bg-slate-950">
                    <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Package className="w-5 h-5 text-blue-600" />
                        เบิกอุปกรณ์ (Equipment Requisition)
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 border-b bg-white dark:bg-slate-900">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Type Filter */}
                        <div className="flex items-center gap-2 sm:w-auto w-full">
                            <Filter className="w-4 h-4 text-gray-500 flex-none" />
                            <Select value={typeFilter} onValueChange={(val) => { setTypeFilter(val); setPage(1); }}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="ประเภททั้งหมด" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">ทั้งหมด</SelectItem>
                                    <SelectItem value="EQUIPMENT">อุปกรณ์ (ยืม-คืน)</SelectItem>
                                    <SelectItem value="MATERIAL">วัสดุ (เบิกเลย)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search Bar */}
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
                        <table className="w-full text-sm text-left min-w-[900px]">
                            <thead className="bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-4 py-3 text-center w-[50px]">
                                        <Checkbox
                                            checked={items.length > 0 && items.every(item => selectedIds.includes(item.id))}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="px-4 py-3">รหัสอะไหล่</th>
                                    <th className="px-4 py-3">ชื่ออะไหล่</th>
                                    <th className="px-4 py-3 text-center">ประเภท</th>
                                    <th className="px-4 py-3 text-center">หมวดหมู่</th>
                                    <th className="px-4 py-3 text-center">หน่วยนับ</th>
                                    <th className="px-4 py-3 text-center">บรรจุ</th>
                                    <th className="px-4 py-3 text-center text-blue-600">คงเหลือ</th>
                                    <th className="px-4 py-3 text-center">ทั้งหมด</th>
                                    <th className="px-4 py-3 text-center w-[100px]">จำนวน</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-slate-800 bg-white dark:bg-slate-900">
                                {loading ? (
                                    <tr>
                                        <td colSpan={10} className="py-12 text-center text-gray-500">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                            กำลังค้นหา...
                                        </td>
                                    </tr>
                                ) : items.length > 0 ? (
                                    items.map((item) => {
                                        const isSelected = selectedIds.includes(item.id);
                                        const isAlreadyRequisitioned = existingIds.includes(item.id);

                                        // Calculate remaining stock based on existing requisitions in this job
                                        const relatedRequisitions = existingRequisitions.filter(r =>
                                            (r.item?.id === item.id) || (r.itemId === item.id)
                                        );
                                        const totalRequestedInJob = relatedRequisitions.reduce((sum, req) => sum + (req.qtyRequest || 0), 0);
                                        const displayQty = Math.max(0, (item.qtyOnHand || 0) - totalRequestedInJob);

                                        return (
                                            <tr
                                                key={item.id}
                                                className={`transition-colors border-b dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer ${isSelected ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}
                                                onClick={() => toggleSelection(item)}
                                            >
                                                <td className="px-4 py-3 text-center">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={() => toggleSelection(item)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                                                    {item.code}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                                                    <div className="flex items-center gap-2">
                                                        {item.name}
                                                        {isAlreadyRequisitioned && (
                                                            <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-green-100 text-green-700 border-green-200">
                                                                เบิกแล้ว
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge variant="outline" className={`font-normal text-xs whitespace-nowrap ${item.type === 'EQUIPMENT' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-orange-200 text-orange-700 bg-orange-50'}`}>
                                                        {item.type === 'EQUIPMENT' ? 'อุปกรณ์' : 'วัสดุ'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-500">
                                                    {item.category?.name || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-500">
                                                    {item.unit?.name || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-500">
                                                    {item.packSize || 1} {item.packUnit || item.unit?.name || ""}
                                                </td>
                                                <td className="px-4 py-3 text-center font-bold text-blue-600">
                                                    {displayQty}
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-400">
                                                    {item.stockQty || item.qtyOnHand || 0}
                                                </td>
                                                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                                    {isSelected ? (
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            max={displayQty}
                                                            value={itemQuantities[item.id] || 1}
                                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                                            className="w-16 h-8 text-center mx-auto bg-white dark:bg-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        />
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="py-12 text-center text-gray-500">
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
                        {/* Page Numbers */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                ก่อนหน้า
                            </Button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (page <= 3) {
                                    pageNum = i + 1;
                                } else if (page >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={page === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setPage(pageNum)}
                                        className={page === pageNum ? "bg-blue-600 text-white" : ""}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
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
                            ยืนยัน ({selectedIds.length})
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
