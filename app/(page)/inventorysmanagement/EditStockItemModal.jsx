"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Hash,
  Type,
  Warehouse,
  Package,
  Ruler,
  Boxes,
  ListTree,
  Building,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function EditStockItemModal({ onClose, onSubmit, item }) {
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [stock, setStock] = useState(0);
  const [unit, setUnit] = useState("");
  const [packSize, setPackSize] = useState(1);
  const [unitPkg, setUnitPkg] = useState("");
  const [itemType, setItemType] = useState("Consumable");

  // โหลดข้อมูลเดิมมาใส่ในฟอร์ม
  useEffect(() => {
    if (item) {
      setItemCode(item.itemCode || "");
      setItemName(item.itemName || "");
      setCategory(item.category || "");
      setSupplierName(item.supplierName || "");
      setStock(item.stock || 0);
      setUnit(item.unit || "");
      setPackSize(item.packSize || 1);
      setUnitPkg(item.unitPkg || "");
      setItemType(item.itemType || "Consumable");
    }
  }, [item]);

  const handleSubmit = () => {
    if (!itemCode || !itemName || !unit || !unitPkg || !category) {
      alert("กรุณากรอกข้อมูลที่มี * ให้ครบ");
      return;
    }

    const updatedItem = {
      ...item,
      itemCode: itemCode.toUpperCase(),
      itemName,
      supplierName,
      stock: parseFloat(stock) || 0,
      unit,
      packSize: parseFloat(packSize) || 1,
      unitPkg,
      itemType,
      category,
    };

    onSubmit(updatedItem);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                bg-white dark:bg-gray-900 rounded-lg shadow-2xl z-50 
                w-[95%] max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header สีส้ม สำหรับหน้าแก้ไข Stock */}
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-700 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-7 w-7" />
            แก้ไขข้อมูลวัสดุ / ปรับสต็อก
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-orange-600"
          >
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-800">
          
          {/* ส่วนจัดการ Stock */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
              <Warehouse className="h-5 w-5" /> ปรับปรุงจำนวน Stock
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
               <div className="space-y-2">
                <Label htmlFor="stock">
                  จำนวนคงเหลือ (หน่วยสั่ง: {unit})
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  className="text-lg font-bold text-blue-700"
                  value={stock}
                  onChange={(e) => setStock(parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  * แก้ไขตัวเลขนี้เพื่อเพิ่มหรือลดสต็อก
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemCode">รหัสอะไหล่ (Item Code) *</Label>
              <Input
                id="itemCode"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemName">ชื่ออะไหล่ (Item Name) *</Label>
              <Input
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">หมวดหมู่ (Category) *</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemType">ประเภท (Item Type) *</Label>
              <Select value={itemType} onValueChange={setItemType}>
                <SelectTrigger id="itemType">
                  <SelectValue placeholder="เลือกประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consumable">วัสดุ (เบิกเลย)</SelectItem>
                  <SelectItem value="Returnable">อุปกรณ์ (ต้องคืน)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">หน่วยสั่ง (Unit) *</Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="supplierName">ผู้จำหน่าย (Supplier)</Label>
                <Input
                id="supplierName"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="packSize">ขนาดบรรจุ (ต่อ 1 หน่วยสั่ง)</Label>
              <Input
                id="packSize"
                type="number"
                min="1"
                value={packSize}
                onChange={(e) => setPackSize(parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitPkg">หน่วยย่อย (Unit Pkg) *</Label>
              <Input
                id="unitPkg"
                value={unitPkg}
                onChange={(e) => setUnitPkg(e.target.value)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t p-4 flex justify-end gap-3 bg-white dark:bg-gray-900">
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={handleSubmit}
          >
            <Save className="mr-2 h-4 w-4" />
            บันทึกการเปลี่ยนแปลง
          </Button>
        </CardFooter>
      </div>
    </>
  );
}