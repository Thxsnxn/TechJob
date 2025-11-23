"use client";

import React, { useState, useEffect } from "react";
import { X, Save, PackagePlus, Type, Tag, Box, Hash, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ข้อมูลตัวเลือกต่างๆ (Mock Data)
const categories = [
  "เครื่องมือทั่วไป (Hand Tools)",
  "เครื่องมือไฟฟ้า (Power Tools)",
  "วัสดุสิ้นเปลือง (Consumables)",
  "อุปกรณ์ป้องกัน (PPE)",
  "วัสดุไฟฟ้า (Electrical)",
  "วัสดุประปา (Plumbing)",
];
const units = ["อัน", "ชิ้น", "กล่อง", "เครื่อง", "ชุด", "เมตร", "ม้วน", "หลอด", "กระป๋อง", "ถุง"];
const unitPkgs = ["อัน", "ชิ้น", "ตัว", "เส้น", "แผ่น", "คู่", "กิโลกรัม", "เมตร"];

export default function ManageStockModal({ onClose, onSubmit, initialData }) {
  // State สำหรับเก็บค่าในฟอร์ม
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    category: "",
    itemType: "Non-Returnable", // Default: วัสดุ (เบิกเลย)
    unit: "",
    stock: 0,
    packSize: 1,
    unitPkg: "",
  });

  // ถ้าเป็นการแก้ไข (Edit Mode) ให้ดึงข้อมูลเดิมมาใส่
  useEffect(() => {
    if (initialData) {
      setFormData({
        itemCode: initialData.itemCode || "",
        itemName: initialData.itemName || "",
        category: initialData.category || "",
        itemType: initialData.itemType || "Non-Returnable",
        unit: initialData.unit || "",
        stock: initialData.stock || 0,
        packSize: initialData.packSize || 1,
        unitPkg: initialData.unitPkg || "",
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validation อย่างง่าย
    if (!formData.itemCode || !formData.itemName) {
      alert("กรุณากรอกรหัสและชื่ออะไหล่");
      return;
    }

    const submissionData = {
        ...formData,
        supplierName: "-", // ใส่ค่า Default เนื่องจากตัดช่อง Supplier ออกแล้ว
        lastUpdate: new Date().toISOString()
    };
    
    onSubmit(submissionData, !!initialData);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 transition-opacity">
      
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white shadow-sm shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PackagePlus className="h-6 w-6" />
            {initialData ? "แก้ไขข้อมูลสินค้า (Edit Stock)" : "เพิ่มของใหม่เข้าคลัง (New Stock)"}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-blue-700 rounded-full p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* Grid Layout: จัด 2 คอลัมน์เท่ากัน */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. รหัสอะไหล่ */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700">
                <Hash className="h-4 w-4 text-blue-500" /> รหัสอะไหล่ (Item Code) <span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="เช่น BOLT-M8-50MM" 
                value={formData.itemCode} 
                onChange={(e) => handleChange("itemCode", e.target.value)}
                disabled={!!initialData}
                className="h-10 w-full" 
              />
            </div>

            {/* 2. ชื่ออะไหล่ */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700">
                <Type className="h-4 w-4 text-blue-500" /> ชื่ออะไหล่ (Item Name) <span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="เช่น น็อต M8x50mm" 
                value={formData.itemName} 
                onChange={(e) => handleChange("itemName", e.target.value)}
                className="h-10 w-full"
              />
            </div>

            {/* 3. หมวดหมู่ (แก้: เพิ่ม w-full ให้ SelectTrigger) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700">
                <Layers className="h-4 w-4 text-blue-500" /> หมวดหมู่ (Category) <span className="text-red-500">*</span>
              </label>
              <Select value={formData.category} onValueChange={(val) => handleChange("category", val)}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* 4. ประเภท (แก้: เพิ่ม w-full ให้ SelectTrigger) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700">
                <Tag className="h-4 w-4 text-blue-500" /> ประเภท (Item Type) <span className="text-red-500">*</span>
              </label>
              <Select value={formData.itemType} onValueChange={(val) => handleChange("itemType", val)}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="เลือกประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non-Returnable">วัสดุ (เบิกเลย)</SelectItem>
                  <SelectItem value="Returnable">อุปกรณ์ (ยืม-คืน)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. หน่วยสั่ง (แก้: เพิ่ม w-full ให้ SelectTrigger) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700">
                <Box className="h-4 w-4 text-blue-500" /> หน่วยสั่ง (Unit) <span className="text-red-500">*</span>
              </label>
              <Select value={formData.unit} onValueChange={(val) => handleChange("unit", val)}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="เลือกหน่วยสั่ง" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* 6. จำนวน Stock */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700">
                <Box className="h-4 w-4 text-green-600" /> จำนวน Stock คงเหลือ
              </label>
              <Input 
                type="number" 
                min="0"
                value={formData.stock} 
                onChange={(e) => handleChange("stock", Number(e.target.value))}
                className="h-10 w-full"
              />
            </div>

            {/* 7. ขนาดบรรจุ */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700">
                <Hash className="h-4 w-4 text-gray-500" /> ขนาดบรรจุ (ต่อ 1 หน่วยสั่ง)
              </label>
              <Input 
                type="number" 
                min="1"
                value={formData.packSize} 
                onChange={(e) => handleChange("packSize", Number(e.target.value))}
                className="h-10 w-full"
              />
            </div>

            {/* 8. หน่วยย่อย (แก้: เพิ่ม w-full ให้ SelectTrigger) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700">
                <Hash className="h-4 w-4 text-gray-500" /> หน่วยย่อย (Unit Pkg) <span className="text-red-500">*</span>
              </label>
              <Select value={formData.unitPkg} onValueChange={(val) => handleChange("unitPkg", val)}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="เลือกหน่วยย่อย" />
                </SelectTrigger>
                <SelectContent>
                  {unitPkgs.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={onClose} className="h-10 px-6">
            ยกเลิก
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 h-10 px-6">
            <Save className="mr-2 h-4 w-4" /> บันทึก
          </Button>
        </div>
      </div>
    </div>
  );
}