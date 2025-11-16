"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  ClipboardList,
  X,
  FileText,
  Hash,
  User,
  Building,
  Package,
  CalendarDays,
  Pencil,
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

export default function EditInventoryModal({
  onClose,
  onSubmit,
  inventoryData,
  stockData,
}) {
  const [id, setId] = useState("");
  const [supplier, setSupplier] = useState("");
  const [orderbookId, setOrderbookId] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [vendorCode, setVendorCode] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [unit, setUnit] = useState("1");
  const [packSize, setPackSize] = useState("ชิ้น");
  const [deliveryDate, setDeliveryDate] = useState("");

  const [requester, setRequester] = useState("");
  const [department, setDepartment] = useState("");

  const [currentStockInfo, setCurrentStockInfo] = useState(null);

  useEffect(() => {
    if (inventoryData && stockData) {
      const formattedOrderDate = inventoryData.orderDate
        .split("/")
        .reverse()
        .join("-");
      const formattedDeliveryDate = inventoryData.deliveryDate
        .split("/")
        .reverse()
        .join("-");

      setId(inventoryData.id || "");
      setSupplier(inventoryData.supplier || "");
      setOrderbookId(inventoryData.orderbookId || "");
      setOrderDate(formattedOrderDate);
      setVendorCode(inventoryData.vendorCode || "");
      setVendorName(inventoryData.vendorName || "");
      setUnit(inventoryData.unit || "1");
      setPackSize(inventoryData.packSize || "ชิ้น");
      setDeliveryDate(formattedDeliveryDate);
      setRequester(inventoryData.details?.requester || "");
      setDepartment(inventoryData.details?.department || "");

      const stockItem = stockData.find(
        (s) => s.itemCode === inventoryData.vendorCode
      );
      setCurrentStockInfo(stockItem);
    }
  }, [inventoryData, stockData]);

  const handleSubmit = () => {
    if (currentStockInfo && parseFloat(unit) > currentStockInfo.stock) {
      alert(
        `ไม่สามารถเบิก ${unit} ${packSize} ได้ \nเนื่องจาก Stock คงเหลือเพียง ${currentStockInfo.stock} ${currentStockInfo.unit}`
      );
      return;
    }

    const editedInventoryOrder = {
      ...inventoryData,
      id,
      supplier,
      orderbookId,
      orderDate: format(new Date(orderDate), "dd/MM/yyyy"),
      vendorCode,
      vendorName,
      unit,
      packSize,
      deliveryDate: format(new Date(deliveryDate), "dd/MM/yyyy"),
      details: {
        ...inventoryData.details,
        requester: requester,
        department: department,
        lastEditor: "ผู้ใช้ปัจจุบัน (แก้ไข)",
        lastEditDate: format(new Date(), "dd/MM/yyyy HH:mm:ss"),
      },
      items: [
        {
          ...(inventoryData.items[0] || {}),
          itemCode: vendorCode,
          itemName: vendorName,
          qty: unit,
          unit: packSize,
          unitPkg: packSize,
        },
      ],
    };
    console.log("Saving edited inventory:", editedInventoryOrder);
    onSubmit(editedInventoryOrder);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      ></div>
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        bg-white dark:bg-gray-900 rounded-lg shadow-2xl z-50 
        w-[95%] max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Pencil className="h-7 w-7" />
            แก้ไขรายการเบิก ( {inventoryData.orderbookId} )
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-yellow-600"
          >
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-800">
          <Card className="shadow-md">
            <CardHeader className="bg-blue-50 dark:bg-blue-900 border-b pb-4 flex flex-row items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">
                ข้อมูลใบเบิก
              </h3>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="id"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
                >
                  <Hash className="h-4 w-4 text-gray-500" /> รหัสการเบิก
                </Label>
                <Input
                  id="id"
                  placeholder="ระบุรหัสการเบิก"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label
                  htmlFor="supplier"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
                >
                  <ClipboardList className="h-4 w-4 text-gray-500" /> JOBID/JOB
                  TITLE
                </Label>
                <Input
                  id="supplier"
                  placeholder="ระบุ JOBID / JOB TITLE"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="orderbookId"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
                >
                  <FileText className="h-4 w-4 text-gray-500" /> เลขที่เอกสาร
                </Label>
                <Input
                  id="orderbookId"
                  placeholder="ระบุเลขที่เอกสาร"
                  value={orderbookId}
                  onChange={(e) => setOrderbookId(e.target.value)}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="requester"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
                >
                  <User className="h-4 w-4 text-gray-500" /> ผู้แจ้งซ่อม
                </Label>
                <Input
                  id="requester"
                  placeholder="ระบุชื่อผู้แจ้งซ่อม"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="department"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
                >
                  <Building className="h-4 w-4 text-gray-500" /> แผนก
                </Label>
                <Input
                  id="department"
                  placeholder="ระบุแผนก"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="bg-purple-50 dark:bg-purple-900 border-b pb-4 flex flex-row items-center gap-2">
              <Package className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-200">
                รายละเอียดอุปกรณ์
              </h3>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="vendorCode"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
                >
                  <Hash className="h-4 w-4 text-gray-500" /> รหัสอะไหล่
                </Label>
                <Input id="vendorCode" value={vendorCode} disabled />
                {currentStockInfo && (
                  <p className="text-sm text-blue-600 font-medium mt-2">
                    Stock คงเหลือ: {currentStockInfo.stock}{" "}
                    {currentStockInfo.unit}
                  </p>
                )}
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label
                  htmlFor="vendorName"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
                >
                  <Package className="h-4 w-4 text-gray-500" /> อุปกรณ์ที่เบิก
                </Label>
                <Input id="vendorName" value={vendorName} disabled />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="unit"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
                >
                  <Hash className="h-4 w-4 text-gray-500" /> จำนวน
                </Label>
                <Input
                  id="unit"
                  type="number"
                  min="1"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="packSize"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
                >
                  <Package className="h-4 w-4 text-gray-500" /> หน่วยนับ
                </Label>
                <Input id="packSize" value={packSize} disabled />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="bg-green-50 dark:bg-green-900 border-b pb-4 flex flex-row items-center gap-2">
              <CalendarDays className="h-5 w-5 text-green-600 dark:text-green-300" />
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-200">
                วันที่
              </h3>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="orderDate"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
                >
                  <CalendarDays className="h-4 w-4 text-gray-500" /> วันที่เบิก
                </Label>
                <Input
                  id="orderDate"
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="deliveryDate"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
                >
                  <CalendarDays className="h-4 w-4 text-gray-500" />{" "}
                  วันที่คาดว่าจะได้รับ
                </Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </CardContent>

        <CardFooter className="border-t p-4 flex justify-end gap-3 bg-white dark:bg-gray-900">
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            className="bg-yellow-600 hover:bg-yellow-700"
            onClick={handleSubmit}
          >
            <Pencil className="mr-2 h-4 w-4" />
            บันทึกการแก้ไข
          </Button>
        </CardFooter>
      </div>
    </>
  );
}