"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
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
  ChevronDown,
  Check,
  Search,
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
// ลบ Select ของเดิมออกได้เลย หรือทิ้งไว้ก็ได้ แต่เราไม่ได้ใช้แล้ว
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import apiClient from "@/lib/apiClient";

// --- 🔥 Searchable Select (ตัวเดิมที่ใช้งานดีอยู่แล้ว) ---
const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "เลือกข้อมูล",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 5,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  const selectedOption = options.find(
    (item) => String(item.id) === String(value)
  );

  const filteredOptions = options.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  return (
    <div className="relative w-full">
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
      >
        <span className={selectedOption ? "text-slate-900 dark:text-slate-50" : "text-slate-500"}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>

      {isOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998] bg-transparent"
              onClick={() => setIsOpen(false)}
            />
            <div
              style={{
                top: coords.top,
                left: coords.left,
                width: coords.width,
              }}
              className="fixed z-[9999] mt-1 max-h-[300px] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-xl animate-in fade-in-80 zoom-in-95 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
            >
              <div className="flex items-center border-b px-3 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  autoFocus
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400"
                  placeholder={`ค้นหา ${placeholder}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') e.preventDefault();
                  }}
                />
              </div>

              <div className="overflow-y-auto max-h-[250px] p-1">
                {filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-slate-500">
                    ไม่พบข้อมูล
                  </div>
                ) : (
                  filteredOptions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onChange(String(item.id));
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 ${
                        String(value) === String(item.id)
                          ? "bg-slate-100 dark:bg-slate-800 font-medium"
                          : ""
                      }`}
                    >
                      {String(value) === String(item.id) && (
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600" />
                        </span>
                      )}
                      {item.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

// --- Main Modal Component ---
export default function CreateStockItemModal({
  initialData,
  onClose,
  onSubmit,
  apiCategories = [],
  apiUnits = [],
}) {
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stock, setStock] = useState(0);
  const [unitId, setUnitId] = useState("");
  const [packSize, setPackSize] = useState(1);
  const [packUnitId, setPackUnitId] = useState("");
  const [itemType, setItemType] = useState("Consumable");
  const [loading, setLoading] = useState(false);

  const isEditMode = !!initialData;

  // ✅ สร้างตัวเลือกประเภทเตรียมไว้สำหรับ SearchableSelect
  const itemTypeOptions = [
    { id: "Consumable", name: "วัสดุ (เบิกเลย)" },
    { id: "Returnable", name: "อุปกรณ์ (ต้องคืน)" },
  ];

  useEffect(() => {
    if (initialData) {
      setItemCode(initialData.itemCode || "");
      setItemName(initialData.itemName || "");
      setStock(initialData.stock || 0);
      setPackSize(initialData.packSize || 1);
      setItemType(initialData.itemType || "Consumable");
      setCategoryId(initialData.categoryId ? String(initialData.categoryId) : "");
      setUnitId(initialData.unitId ? String(initialData.unitId) : "");
      setPackUnitId(
        initialData.packUnitId
          ? String(initialData.packUnitId)
          : initialData.unitId
            ? String(initialData.unitId)
            : ""
      );
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

    if (Number.isNaN(parsedCategoryId) || Number.isNaN(parsedUnitId) || Number.isNaN(parsedPackUnitId)) {
      alert("หมวดหมู่ / หน่วยสั่ง / หน่วยย่อย ต้องเป็น ID (ตัวเลข)");
      return;
    }

    const apiType = itemType === "Returnable" ? "EQUIPMENT" : "MATERIAL";

    const payload = {
      code: itemCode.toUpperCase(),
      name: itemName,
      type: apiType,
      categoryId: parsedCategoryId,
      unitId: parsedUnitId,
      packSize: parsedPackSize,
      packUnitId: parsedPackUnitId,
      qtyOnHand: parsedStock,
      stockQty: parsedStock,
      status: true,
    };

    try {
      setLoading(true);

      if (!isEditMode) {
        const res = await apiClient.post("/create-item", payload);
        const createdItem = res?.data?.item || null;
        if (onSubmit) onSubmit(createdItem || payload);
        alert("เพิ่มวัสดุ/อุปกรณ์สำเร็จ");
      } else {
        if (onSubmit) {
          onSubmit({
            ...initialData,
            itemCode: itemCode.toUpperCase(),
            itemName,
            stock: parsedStock,
            packSize: parsedPackSize,
            itemType,
            categoryId: parsedCategoryId,
            unitId: parsedUnitId,
            packUnitId: parsedPackUnitId,
          }, true);
        }
        alert("แก้ไขในหน้าจอเรียบร้อย");
      }
      onClose();
    } catch (error) {
      console.error("Error creating/updating item:", error);
      const serverMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      alert(`บันทึกไม่สำเร็จ: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                bg-white dark:bg-gray-900 rounded-lg shadow-2xl z-50 
                w-[95%] max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PackagePlus className="h-7 w-7" />
            {isEditMode ? "แก้ไขของในคลัง" : "เพิ่มของใหม่เข้าคลัง (Stock Master)"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-blue-700" disabled={loading}>
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-800">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <Hash className="h-4 w-4 text-gray-500" /> รหัสอะไหล่ (Item Code) *
              </Label>
              <Input id="itemCode" placeholder="เช่น ITM-001" value={itemCode} onChange={(e) => setItemCode(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <Type className="h-4 w-4 text-gray-500" /> ชื่ออะไหล่ (Item Name) *
              </Label>
              <Input id="itemName" placeholder="เช่น สายไฟ" value={itemName} onChange={(e) => setItemName(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <ListTree className="h-4 w-4 text-gray-500" /> หมวดหมู่ (Category) *
              </Label>
              <SearchableSelect 
                value={categoryId} 
                onChange={setCategoryId} 
                options={apiCategories} 
                placeholder="ค้นหาหมวดหมู่..." 
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <Boxes className="h-4 w-4 text-gray-500" /> ประเภท (Item Type) *
              </Label>
              {/* ✅ เปลี่ยนมาใช้ SearchableSelect และส่ง itemTypeOptions เข้าไป */}
              <SearchableSelect 
                value={itemType} 
                onChange={setItemType} 
                options={itemTypeOptions} 
                placeholder="เลือกประเภท..." 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <Package className="h-4 w-4 text-gray-500" /> หน่วยสั่ง (Unit) *
              </Label>
              <SearchableSelect 
                value={unitId} 
                onChange={setUnitId} 
                options={apiUnits} 
                placeholder="ค้นหาหน่วย..." 
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <Warehouse className="h-4 w-4 text-gray-500" /> จำนวน Stock เริ่มต้น
              </Label>
              <Input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <Ruler className="h-4 w-4 text-gray-500" /> ขนาดบรรจุ (ต่อ 1 หน่วยสั่ง)
              </Label>
              <Input type="number" min="1" value={packSize} onChange={(e) => setPackSize(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <Ruler className="h-4 w-4 text-gray-500" /> หน่วยย่อย (Unit Pkg) *
              </Label>
              <SearchableSelect 
                value={packUnitId} 
                onChange={setPackUnitId} 
                options={apiUnits} 
                placeholder="ค้นหาหน่วยย่อย..." 
              />
            </div>
          </div>

        </CardContent>

        <CardFooter className="border-t p-4 flex justify-end gap-3 bg-white dark:bg-gray-900">
          <Button variant="outline" onClick={onClose} disabled={loading}>ยกเลิก</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={loading}>
            {loading ? "กำลังบันทึก..." : <><Plus className="mr-2 h-4 w-4" /> {isEditMode ? "บันทึกการแก้ไข" : "บันทึก"}</>}
          </Button>
        </CardFooter>
      </div>
    </>
  );
}