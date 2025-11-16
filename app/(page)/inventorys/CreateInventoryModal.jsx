"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
    ClipboardList, X, FileText, Hash, User, Building, Package, CalendarDays, Plus, Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default function CreateInventoryModal({ onClose, onSubmit, stockData, findStockInfo }) {
    const [id, setId] = useState("");
    const [supplier, setSupplier] = useState("");
    const [orderbookId, setOrderbookId] = useState("");
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
    const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split("T")[0]);
    const [requester, setRequester] = useState("");
    const [department, setDepartment] = useState("");

    const [items, setItems] = useState([
        { "#": 1, itemCode: "", itemName: "", qty: "1", unit: "", vendorItemCode: "", itemNameVendor: "", itemNameDetail: "", packSize: "1", unitPkg: "", }
    ]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;

        if (field === 'itemCode') {
            const stockItem = findStockInfo(stockData, value);
            if (stockItem) {
                newItems[index].itemName = stockItem.itemName;
                newItems[index].unit = stockItem.unit;
                newItems[index].unitPkg = stockItem.unitPkg;
                newItems[index].packSize = String(stockItem.packSize);
                newItems[index].vendorItemCode = stockItem.supplierName || "N/A";
                newItems[index].itemNameVendor = stockItem.itemName;
                newItems[index].itemNameDetail = stockItem.itemName;
            } else {
                newItems[index].itemName = ""; newItems[index].unit = ""; newItems[index].unitPkg = ""; 
                newItems[index].packSize = ""; newItems[index].vendorItemCode = ""; 
                newItems[index].itemNameVendor = ""; newItems[index].itemNameDetail = "";
            }
        }
        
        if (field === 'qty') {
             const numericValue = parseFloat(value);
             newItems[index].qty = (isNaN(numericValue) || numericValue < 0) ? "0" : String(numericValue);
        }
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { "#": items.length + 1, itemCode: "", itemName: "", qty: "1", unit: "", vendorItemCode: "", itemNameVendor: "", itemNameDetail: "", packSize: "1", unitPkg: "", }]);
    };

    const handleRemoveItem = (index) => {
        if (items.length <= 1) { alert("ใบเบิกต้องมีอย่างน้อย 1 รายการ"); return; }
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems.map((item, index) => ({...item, "#": index + 1})));
    };

    const handleSubmit = () => {
        if (items.some(item => !item.itemCode || parseFloat(item.qty) <= 0)) { alert("กรุณาเลือกรหัสอะไหล่และระบุจำนวนสั่งมากกว่า 0 สำหรับทุกรายการ"); return; }

        for (const item of items) {
            const stockInfo = findStockInfo(stockData, item.itemCode);
            const requestedQty = parseFloat(item.qty);
            if (stockInfo && requestedQty > stockInfo.stock) {
                alert(`ไม่สามารถเบิกได้: รายการ ${item.itemCode} (จำนวน ${requestedQty} ${item.unit}) เกิน Stock ที่มีอยู่ (${stockInfo.stock} ${stockInfo.unit})`);
                return;
            }
        }

        const newInventoryOrder = {
            id, supplier, orderbookId, orderDate: format(new Date(orderDate), "dd/MM/yyyy"),
            vendorCode: items.length === 1 ? items[0].itemCode : 'MIXED',
            vendorName: items.length === 1 ? items[0].itemName : 'รายการอะไหล่รวม',
            unit: items.length.toString(), packSize: 'รายการ', deliveryDate: format(new Date(deliveryDate), "dd/MM/yyyy"),
            status: "รออนุมัติ",
            details: { requester, department, requestDate: format(new Date(), "dd/MM/yyyy HH:mm:ss"), lastEditor: requester, lastEditDate: format(new Date(), "dd/MM/yyyy HH:mm:ss"), },
            items: items.map(item => ({...item, qty: item.qty.toString()}))
        };

        onSubmit(newInventoryOrder);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                bg-white dark:bg-gray-900 rounded-lg shadow-2xl z-50 
                w-[95%] max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                    <h2 className="text-2xl font-bold flex items-center gap-2"><ClipboardList className="h-7 w-7" />สร้างรายการเบิกใหม่</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-blue-700"><X className="h-6 w-6" /></Button>
                </CardHeader>

                <CardContent className="p-6 space-y-6 overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-800">
                    <Card className="shadow-md">
                        <CardHeader className="bg-blue-50 dark:bg-blue-900 border-b pb-4 flex flex-row items-center gap-2"><FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" /><h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">ข้อมูลใบเบิก</h3></CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2"><Label htmlFor="id" className="flex items-center gap-1 text-gray-700 dark:text-gray-300"><Hash className="h-4 w-4 text-gray-500" /> รหัสการเบิก</Label><Input id="id" placeholder="ระบุรหัสการเบิก" value={id} onChange={(e) => setId(e.target.value)}/></div>
                            <div className="space-y-2 lg:col-span-2"><Label htmlFor="supplier" className="flex items-center gap-1 text-gray-700 dark:text-gray-300"><ClipboardList className="h-4 w-4 text-gray-500" /> JOBID/JOB TITLE</Label><Input id="supplier" placeholder="ระบุ JOBID / JOB TITLE" value={supplier} onChange={(e) => setSupplier(e.target.value)}/></div>
                            <div className="space-y-2"><Label htmlFor="orderbookId" className="flex items-center gap-1 text-gray-700 dark:text-gray-300"><FileText className="h-4 w-4 text-gray-500" /> เลขที่เอกสาร</Label><Input id="orderbookId" placeholder="ระบุเลขที่เอกสาร" value={orderbookId} onChange={(e) => setOrderbookId(e.target.value)}/></div>
                            <div className="space-y-2"><Label htmlFor="requester" className="flex items-center gap-1 text-gray-700 dark:text-gray-300"><User className="h-4 w-4 text-gray-500" /> ผู้แจ้งซ่อม</Label><Input id="requester" placeholder="ระบุชื่อผู้แจ้งซ่อม" value={requester} onChange={(e) => setRequester(e.target.value)}/></div>
                            <div className="space-y-2"><Label htmlFor="department" className="flex items-center gap-1 text-gray-700 dark:text-gray-300"><Building className="h-4 w-4 text-gray-500" /> แผนก</Label><Input id="department" placeholder="ระบุแผนก" value={department} onChange={(e) => setDepartment(e.target.value)}/></div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader className="bg-purple-50 dark:bg-purple-900 border-b pb-4 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2"><Package className="h-5 w-5 text-purple-600 dark:text-purple-300" /><h3 className="text-lg font-semibold text-purple-700 dark:text-purple-200">รายการอะไหล่/วัสดุที่เบิก</h3></div>
                            <Button variant="outline" size="sm" onClick={handleAddItem}><Plus className="mr-2 h-4 w-4" /> เพิ่มรายการ</Button>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <Table className="min-w-full">
                                <TableHeader>
                                    <TableRow className="bg-gray-100">
                                        <TableHead className="w-[50px]">#</TableHead><TableHead className="w-[150px]">รหัสอะไหล่</TableHead><TableHead className="w-[200px]">ชื่ออะไหล่</TableHead><TableHead className="w-[100px]">จำนวนสั่ง</TableHead><TableHead className="w-[100px]">หน่วย</TableHead><TableHead className="w-[100px] text-blue-600">Stock คงเหลือ (หน่วยย่อย)</TableHead><TableHead className="w-[50px]">ลบ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item, index) => {
                                        const stockInfo = findStockInfo(stockData, item.itemCode);
                                        const totalStockInUnitPkg = stockInfo ? stockInfo.stock * parseFloat(stockInfo.packSize) : null;
                                        const currentStockDisplay = stockInfo ? `${totalStockInUnitPkg} ${stockInfo.unitPkg}` : 'ไม่พบข้อมูล';
                                        const isQtyExceeded = stockInfo && parseFloat(item.qty) > stockInfo.stock;
                                        
                                        return (
                                            <TableRow key={index} className={isQtyExceeded ? "bg-red-50" : ""}>
                                                <TableCell className="font-medium w-[50px]">{item["#"]}</TableCell>
                                                <TableCell className="w-[150px]">
                                                    <Select
                                                        onValueChange={(value) => handleItemChange(index, 'itemCode', value)}
                                                        value={item.itemCode}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="-- เลือกรหัสอะไหล่ --" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {stockData.map((s) => (
                                                                <SelectItem key={s.itemCode} value={s.itemCode}>{s.itemCode} ({s.itemName})</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="w-[200px]"><Input value={item.itemName} disabled placeholder="-- ชื่ออุปกรณ์ (อัตโนมัติ) --"/></TableCell>
                                                <TableCell className="w-[100px]"><Input type="number" min="0.1" step="0.1" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} className={isQtyExceeded ? "border-red-500 focus:border-red-500" : ""}/></TableCell>
                                                <TableCell className="w-[100px]"><Input value={item.unit} disabled placeholder="-- หน่วยสั่ง --"/></TableCell>
                                                <TableCell className={`w-[100px] font-medium ${isQtyExceeded ? "text-red-700 font-bold" : "text-blue-600"}`}>{currentStockDisplay}</TableCell>
                                                <TableCell className="w-[50px]"><Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            {items.length === 0 && (<p className="text-center text-muted-foreground py-4">โปรดเพิ่มรายการอะไหล่</p>)}
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader className="bg-green-50 dark:bg-green-900 border-b pb-4 flex flex-row items-center gap-2"><CalendarDays className="h-5 w-5 text-green-600 dark:text-green-300" /><h3 className="text-lg font-semibold text-green-700 dark:text-green-200">วันที่</h3></CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><Label htmlFor="orderDate" className="flex items-center gap-1 text-gray-700 dark:text-gray-300"><CalendarDays className="h-4 w-4 text-gray-500" /> วันที่เบิก</Label><Input id="orderDate" type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)}/></div>
                            <div className="space-y-2"><Label htmlFor="deliveryDate" className="flex items-center gap-1 text-gray-700 dark:text-gray-300"><CalendarDays className="h-4 w-4 text-gray-500" /> วันที่คาดว่าจะได้รับ</Label><Input id="deliveryDate" type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)}/></div>
                        </CardContent>
                    </Card>
                </CardContent>

                <CardFooter className="border-t p-4 flex justify-end gap-3 bg-white dark:bg-gray-900">
                    <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
                        <Plus className="mr-2 h-4 w-4" />บันทึกใบเบิก
                    </Button>
                </CardFooter>
            </div>
        </>
    );
}