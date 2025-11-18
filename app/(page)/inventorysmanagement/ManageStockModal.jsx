"use client";

import React, { useState, useEffect } from "react";
import {
  PackagePlus,
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

export default function ManageStockModal({ onClose, onSubmit, initialData }) {
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [stock, setStock] = useState(0);
  const [unit, setUnit] = useState("");
  const [packSize, setPackSize] = useState(1);
  const [unitPkg, setUnitPkg] = useState("");
  const [itemType, setItemType] = useState("Consumable");

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setItemCode(initialData.itemCode);
      setItemName(initialData.itemName);
      setCategory(initialData.category);
      setSupplierName(initialData.supplierName || "");
      setStock(initialData.stock);
      setUnit(initialData.unit);
      setPackSize(initialData.packSize);
      setUnitPkg(initialData.unitPkg);
      setItemType(initialData.itemType);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!itemCode || !itemName || !unit || !unitPkg || !category) {
      alert("กรุณากรอกข้อมูลที่มี * ให้ครบ");
      return;
    }

    const newItem = {
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

    onSubmit(newItem, isEditMode); // ส่ง isEditMode กลับไปบอก parent
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
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PackagePlus className="h-7 w-7" />
            {isEditMode ? "แก้ไขข้อมูลวัสดุ (Edit Stock)" : "เพิ่มของใหม่เข้าคลัง (New Stock)"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-blue-700"
          >
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="itemCode"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <Hash className="h-4 w-4 text-gray-500" /> รหัสอะไหล่ (Item Code) *
              </Label>
              <Input
                id="itemCode"
                placeholder="เช่น BOLT-M8-50MM"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                disabled={isEditMode} // ห้ามแก้รหัสตอน Edit
                className={isEditMode ? "bg-gray-100" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="itemName"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <Type className="h-4 w-4 text-gray-500" /> ชื่ออะไหล่ (Item Name) *
              </Label>
              <Input
                id="itemName"
                placeholder="เช่น น็อต M8x50mm"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <ListTree className="h-4 w-4 text-gray-500" /> หมวดหมู่ (Category) *
              </Label>
              <Input
                id="category"
                placeholder="เช่น วัสดุสิ้นเปลือง"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="itemType"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <Boxes className="h-4 w-4 text-gray-500" /> ประเภท (Item Type) *
              </Label>
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
              <Label
                htmlFor="unit"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <Package className="h-4 w-4 text-gray-500" /> หน่วยสั่ง (Unit) *
              </Label>
              <Input
                id="unit"
                placeholder="เช่น แพ็ค, กล่อง, ม้วน"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="stock"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <Warehouse className="h-4 w-4 text-gray-500" /> จำนวน Stock คงเหลือ
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="packSize"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <Ruler className="h-4 w-4 text-gray-500" /> ขนาดบรรจุ (ต่อ 1 หน่วยสั่ง)
              </Label>
              <Input
                id="packSize"
                type="number"
                min="1"
                value={packSize}
                onChange={(e) => setPackSize(parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="unitPkg"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <Ruler className="h-4 w-4 text-gray-500" /> หน่วยย่อย (Unit Pkg) *
              </Label>
              <Input
                id="unitPkg"
                placeholder="เช่น ตัว, ชิ้น, เมตร"
                value={unitPkg}
                onChange={(e) => setUnitPkg(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="supplierName"
              className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
            >
              <Building className="h-4 w-4 text-gray-500" /> ผู้จำหน่าย (Supplier)
            </Label>
            <Input
              id="supplierName"
              placeholder="เช่น Makita Thailand"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
          </div>
        </CardContent>

        <CardFooter className="border-t p-4 flex justify-end gap-3 bg-white dark:bg-gray-900">
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
          >
            <Save className="mr-2 h-4 w-4" />
            {isEditMode ? "บันทึกการแก้ไข" : "บันทึก"}
          </Button>
        </CardFooter>
      </div>
    </>
  );
}