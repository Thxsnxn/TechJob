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
  Plus,
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

import apiClient from "@/lib/apiClient";

export default function CreateStockItemModal({
  initialData,
  onClose,
  onSubmit,
  apiCategories = [],
  apiUnits = [],
}) {
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [categoryId, setCategoryId] = useState(""); // dropdown -> id
  const [supplierName, setSupplierName] = useState("");
  const [stock, setStock] = useState(0);
  const [unitId, setUnitId] = useState(""); // dropdown -> id
  const [packSize, setPackSize] = useState(1);
  const [packUnitId, setPackUnitId] = useState(""); // หน่วยย่อย -> packUnit (id)
  const [itemType, setItemType] = useState("Consumable"); // Consumable / Returnable
  const [loading, setLoading] = useState(false);

  
  const isEditMode = !!initialData;

  // preload ข้อมูลตอนแก้ไข
  useEffect(() => {
    if (initialData) {
      setItemCode(initialData.itemCode || "");
      setItemName(initialData.itemName || "");
      setStock(initialData.stock || 0);
      setPackSize(initialData.packSize || 1);
      setItemType(initialData.itemType || "Consumable");
      setCategoryId(
        initialData.categoryId ? String(initialData.categoryId) : ""
      );
      setUnitId(initialData.unitId ? String(initialData.unitId) : "");
      setPackUnitId(
        initialData.packUnitId
          ? String(initialData.packUnitId)
          : initialData.unitId
            ? String(initialData.unitId)
            : ""
      );
      // supplierName ยังไม่ได้มาจาก backend ชัด ๆ เลยยังไม่ set
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!itemCode || !itemName || !categoryId || !unitId || !packUnitId) {
      alert("กรุณาเลือกหมวดหมู่ / หน่วยสั่ง / หน่วยย่อย และกรอกช่อง * ให้ครบ");
      return;
    }

    const parsedCategoryId = Number(categoryId);
    const parsedUnitId = Number(unitId);
    const parsedPackUnitId = Number(packUnitId);
    const parsedPackSize = Number(packSize) || 1;
    const parsedStock = Number(stock) || 0;

    if (
      Number.isNaN(parsedCategoryId) ||
      Number.isNaN(parsedUnitId) ||
      Number.isNaN(parsedPackUnitId)
    ) {
      alert("หมวดหมู่ / หน่วยสั่ง / หน่วยย่อย ต้องเป็น ID (ตัวเลข)");
      return;
    }

    // map UI → API type
    // Consumable → MATERIAL
    // Returnable → EQUIPMENT
    const apiType = itemType === "Returnable" ? "EQUIPMENT" : "MATERIAL";

    const payload = {
      code: itemCode.toUpperCase(),
      name: itemName,
      type: apiType, // MATERIAL | EQUIPMENT
      categoryId: parsedCategoryId,
      unitId: parsedUnitId,
      packSize: parsedPackSize,
      packUnit: parsedPackUnitId,
      qtyOnHand: parsedStock,
      stockQty: parsedStock,
      status: true,
    };

    try {
      setLoading(true);

      if (!isEditMode) {
        // 👍 สร้างใหม่ → ยิง /create-item
        const res = await apiClient.post("/create-item", payload);
        const createdItem = res?.data?.item || null;

        if (onSubmit) {
          // ให้ parent refetch จาก /filter-items อยู่ดี
          onSubmit(createdItem || payload);
        }
        alert("เพิ่มวัสดุ/อุปกรณ์สำเร็จ");
      } else {
        // แก้ไข (ยังไม่เชื่อม API update ให้ backend นะ)
        if (onSubmit) {
          onSubmit(
            {
              ...initialData,
              itemCode: itemCode.toUpperCase(),
              itemName,
              stock: parsedStock,
              packSize: parsedPackSize,
              itemType,
              categoryId: parsedCategoryId,
              unitId: parsedUnitId,
              packUnitId: parsedPackUnitId,
            },
            true
          );
        }
        alert("แก้ไขในหน้าจอเรียบร้อย (ยังไม่ได้ยิง API update)");
      }

      onClose();
    } catch (error) {
      console.error("Error creating/updating item:", error);
      alert("มีข้อผิดพลาดในการเพิ่ม/แก้ไขสินค้า กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                bg-white dark:bg-gray-900 rounded-lg shadow-2xl z-50 
                w-[95%] max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PackagePlus className="h-7 w-7" />
            {isEditMode ? "แก้ไขของในคลัง" : "เพิ่มของใหม่เข้าคลัง (Stock Master)"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-blue-700"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-800">
          {/* แถว 1: รหัส + ชื่อ */}
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
                placeholder="เช่น ITM-001"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
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
                placeholder="เช่น สายไฟ"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
          </div>

          {/* แถว 2: หมวดหมู่ (dropdown) + ประเภท (dropdown) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="categoryId"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <ListTree className="h-4 w-4 text-gray-500" /> หมวดหมู่ (Category) *
              </Label>
              <Select
                value={categoryId}
                onValueChange={(v) => setCategoryId(v)}
              >
                <SelectTrigger id="categoryId" className="w-full">
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                {/* แก้ไข: เพิ่ม z-index */}
                <SelectContent className="z-[9999]">
                  {apiCategories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="itemType"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <Boxes className="h-4 w-4 text-gray-500" /> ประเภท (Item Type) *
              </Label>
              <Select
                value={itemType}
                onValueChange={(v) => setItemType(v)}
              >
                <SelectTrigger id="itemType" className="w-full">
                  <SelectValue placeholder="เลือกประเภท" />
                </SelectTrigger>
                {/* แก้ไข: เพิ่ม z-index */}
                <SelectContent className="z-[9999]">
                  <SelectItem value="Consumable">วัสดุ (เบิกเลย)</SelectItem>
                  <SelectItem value="Returnable">อุปกรณ์ (ต้องคืน)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* แถว 3: หน่วยสั่ง (dropdown) + Stock เริ่มต้น */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="unitId"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <Package className="h-4 w-4 text-gray-500" /> หน่วยสั่ง (Unit) *
              </Label>
              <Select value={unitId} onValueChange={(v) => setUnitId(v)}>
                <SelectTrigger id="unitId" className="w-full">
                  <SelectValue placeholder="เลือกหน่วยสั่ง" />
                </SelectTrigger>
                {/* แก้ไข: เพิ่ม z-index */}
                <SelectContent className="z-[9999]">
                  {apiUnits.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="stock"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <Warehouse className="h-4 w-4 text-gray-500" /> จำนวน Stock เริ่มต้น
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          {/* แถว 4: packSize + หน่วยย่อย (dropdown → packUnit) */}
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
                onChange={(e) => setPackSize(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="packUnitId"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <Ruler className="h-4 w-4 text-gray-500" /> หน่วยย่อย (Unit Pkg / PackUnit) *
              </Label>
              <Select
                value={packUnitId}
                onValueChange={(v) => setPackUnitId(v)}
              >
                <SelectTrigger id="packUnitId" className="w-full">
                  <SelectValue placeholder="เลือกหน่วยย่อย" />
                </SelectTrigger>
                {/* แก้ไข: เพิ่ม z-index */}
                <SelectContent className="z-[9999]">
                  {apiUnits.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t p-4 flex justify-end gap-3 bg-white dark:bg-gray-900">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            ยกเลิก
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              "กำลังบันทึก..."
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {isEditMode ? "บันทึกการแก้ไข" : "บันทึก"}
              </>
            )}
          </Button>
        </CardFooter>
      </div>
    </>
  );
}