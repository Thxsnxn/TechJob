"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Package,
  List,
  Calendar as CalendarIcon,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import CreateInventoryModal from "../inventorysmanagement/CreateInventoryModal";
import EditInventoryModal from "../inventorysmanagement/EditInventoryModal";

import {
  initialStockData,
  mockOrderData,
  findStockInfo,
  StatusBadge,
} from "@/lib/inventoryUtils";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function DatePicker({ value, onChange, placeholder = "เลือกวันที่" }) {
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (value) {
      setDate(new Date(value));
    } else {
      setDate(null);
    }
  }, [value]);

  const handleSelect = (selectedDate) => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      onChange(formattedDate);
      setDate(selectedDate);
    } else {
      onChange("");
      setDate(null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default function Page() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stockData] = useState(initialStockData);
  const [requests, setRequests] = useState(
    mockOrderData.flatMap((group) => group.orders)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false); 
  const [editingItem, setEditingItem] = useState(null); 

  // --- Stock Filters & Pagination ---
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedUnit, setSelectedUnit] = useState("all");
  
  const [stockPage, setStockPage] = useState(1);
  const stockItemsPerPage = 10;

  // --- Detail Pagination ---
  const [detailPage, setDetailPage] = useState(1);
  const detailItemsPerPage = 10;

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesStatus = activeTab === "all" || req.status === activeTab;
      const matchesSearch =
        searchQuery === "" ||
        req.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.orderbookId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [requests, searchQuery, activeTab]);

  const handleSaveNewInventory = (newData) => {
    setRequests([newData, ...requests]);
    setShowCreateModal(false);
  };

  const handleCancelRequest = (request) => {
    if (window.confirm(`คุณต้องการยกเลิกใบเบิก ${request.orderbookId} ใช่หรือไม่?`)) {
        setRequests(currentRequests =>
            currentRequests.map(req =>
                req.orderbookId === request.orderbookId
                    ? { ...req, status: "ยกเลิก", details: { ...req.details, rejectionReason: "ผู้ใช้ยกเลิกคำขอ" } } 
                    : req
            )
        );
        setShowDetailModal(false);
    }
  };

  const handleCloseEditModal = () => {
    setEditingItem(null);
    setShowEditModal(false);
  };

  const handleSaveEdit = (updatedData) => {
    setRequests((currentRequests) =>
      currentRequests.map((req) =>
        req.orderbookId === updatedData.orderbookId ? updatedData : req
      )
    );
    if (selectedItem && selectedItem.orderbookId === updatedData.orderbookId) {
      setSelectedItem(updatedData);
    }
    handleCloseEditModal();
  };

  const handleViewDetails = (request) => {
    setSelectedItem(request);
    setDetailPage(1);
    setShowDetailModal(true);
  };

  const stockCategories = useMemo(
    () => ["all", ...new Set(stockData.map((item) => item.category))],
    [stockData]
  );

  const stockTypes = useMemo(
    () => ["all", ...new Set(stockData.map((item) => item.itemType))],
    [stockData]
  );

  const stockUnits = useMemo(
    () => ["all", ...new Set(stockData.map((item) => item.unit))],
    [stockData]
  );

  const filteredStockData = useMemo(() => {
    return stockData.filter((item) => {
      const normalizedQuery = stockSearchQuery.toLowerCase();
      const matchesSearch =
        item.itemName.toLowerCase().includes(normalizedQuery) ||
        item.itemCode.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesType = 
        selectedType === "all" || item.itemType === selectedType;
      const matchesUnit =
        selectedUnit === "all" || item.unit === selectedUnit;

      return matchesSearch && matchesCategory && matchesType && matchesUnit;
    });
  }, [stockData, stockSearchQuery, selectedCategory, selectedType, selectedUnit]);

  useEffect(() => {
    setStockPage(1);
  }, [stockSearchQuery, selectedCategory, selectedType, selectedUnit]);

  const totalStockPages = Math.max(1, Math.ceil(filteredStockData.length / stockItemsPerPage));
  const paginatedStockData = filteredStockData.slice(
    (stockPage - 1) * stockItemsPerPage,
    stockPage * stockItemsPerPage
  );

  const detailItems = selectedItem ? selectedItem.items : [];
  const totalDetailPages = Math.ceil(detailItems.length / detailItemsPerPage);
  const paginatedDetailItems = detailItems.slice(
    (detailPage - 1) * detailItemsPerPage,
    detailPage * detailItemsPerPage
  );

  const renderPagination = (currentPage, totalPages, setPage) => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-end items-center gap-2 p-3 border-t bg-gray-50 dark:bg-gray-800">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          return (
            <Button
              key={p}
              variant={currentPage === p ? "default" : "outline"}
              size="sm"
              className={currentPage === p ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <>
      <SiteHeader title="Inventory Request" />
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Inventory Requests</h1>
            <p className="text-muted-foreground">
              ติดตามสถานะคำขอเบิก และตรวจสอบรายการวัสดุ
            </p>
          </div>
          <Button
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            สร้างใบเบิกใหม่
          </Button>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="requests">
              <List className="mr-2 h-4 w-4" /> รายการเบิกของฉัน
            </TabsTrigger>
            <TabsTrigger value="stock">
              <Package className="mr-2 h-4 w-4" /> เช็คสต็อกวัสดุ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาด้วย Job ID, ชื่องาน หรือ เลขที่เอกสาร..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Tabs
                  defaultValue="all"
                  className="w-full md:w-auto"
                  onValueChange={setActiveTab}
                >
                  <TabsList className="w-full md:w-auto">
                    <TabsTrigger value="all" className="flex-1 md:flex-initial">
                      ทั้งหมด
                    </TabsTrigger>
                    <TabsTrigger value="รออนุมัติ" className="flex-1 md:flex-initial">
                      รออนุมัติ
                    </TabsTrigger>
                    <TabsTrigger value="อนุมัติ" className="flex-1 md:flex-initial">
                      อนุมัติแล้ว
                    </TabsTrigger>
                    <TabsTrigger value="ไม่อนุมัติ" className="flex-1 md:flex-initial">
                      ไม่อนุมัติ
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <Card
                    key={req.orderbookId}
                    className="flex flex-col justify-between hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="flex flex-row justify-between items-start pb-4">
                      <div className="max-w-[80%]">
                        <CardTitle className="text-lg leading-tight">
                          {req.supplier}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground pt-1">
                          {req.orderbookId}
                        </p>
                      </div>
                      <StatusBadge status={req.status} />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        ยื่นขอเมื่อ: {req.orderDate}
                      </p>
                      {(req.status === "ไม่อนุมัติ" ||
                        req.status === "ยกเลิก") && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-red-600">
                            เหตุผล:
                          </p>
                          <p className="text-sm text-red-700 bg-red-50 p-2 rounded-md">
                            {req.details?.rejectionReason || "ไม่ระบุเหตุผล"}
                          </p>
                        </div>
                      )}
                      <p className="text-sm font-medium mt-3 mb-1">
                        รายการที่เบิก ({req.items.length}):
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {req.items.slice(0, 2).map((item) => (
                          <li key={item.itemCode} className="truncate">
                            {item.itemName}
                          </li>
                        ))}
                        {req.items.length > 2 && (
                          <li className="font-medium">
                            ...และอีก {req.items.length - 2} รายการ
                          </li>
                        )}
                      </ul>
                    </CardContent>
                    <CardFooter
                      className={
                        req.status === "รออนุมัติ"
                          ? "grid grid-cols-2 gap-2"
                          : "grid grid-cols-1"
                      }
                    >
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewDetails(req)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="ml-2">ดูรายละเอียด</span>
                      </Button>
                      {req.status === "รออนุมัติ" && (
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleCancelRequest(req)}
                        >
                          <X className="h-4 w-4" />
                          <span className="ml-2">ยกเลิกใบเบิก</span>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground col-span-3 text-center py-10">
                  ไม่พบรายการคำขอที่ตรงกับตัวกรอง
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stock" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>รายการวัสดุคงคลัง (Master Stock)</CardTitle>
                <p className="text-sm text-muted-foreground">
                  ตรวจสอบรายการวัสดุและจำนวนคงเหลือ
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative w-full md:flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="ค้นหาด้วยรหัส หรือ ชื่ออะไหล่..."
                      className="pl-10"
                      value={stockSearchQuery}
                      onChange={(e) => setStockSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select
                    value={selectedType}
                    onValueChange={setSelectedType}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="all">ทุกประเภท</SelectItem>
                       {stockTypes.filter(t => t !== "all").map(type => (
                         <SelectItem key={type} value={type}>
                           {type === "Returnable" ? "อุปกรณ์ (ยืม-คืน)" : "วัสดุ (เบิกเลย)"}
                         </SelectItem>
                       ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "ทุกหมวดหมู่" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedUnit}
                    onValueChange={setSelectedUnit}
                  >
                    <SelectTrigger className="w-full md:w-[150px]">
                      <SelectValue placeholder="เลือกหน่วย" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit === "all" ? "ทุกหน่วย" : unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                </div>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-100 dark:bg-gray-800">
                      <TableRow>
                        <TableHead className="w-[150px]">รหัสอะไหล่</TableHead>
                        <TableHead>ชื่ออะไหล่</TableHead>
                        <TableHead>หมวดหมู่</TableHead>
                        <TableHead>ประเภท</TableHead>
                        <TableHead>ผู้จำหน่าย</TableHead>
                        <TableHead>หน่วยสั่ง</TableHead>
                        <TableHead>ขนาดบรรจุ (หน่วยย่อย)</TableHead>
                        <TableHead className="text-right">
                          Stock คงเหลือ (หน่วยสั่ง)
                        </TableHead>
                        <TableHead className="text-right">
                          Stock คงเหลือรวม (หน่วยย่อย)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedStockData.length > 0 ? (
                        paginatedStockData.map((item) => {
                            const totalStock = item.stock * parseFloat(item.packSize);
                            return (
                            <TableRow key={item.itemCode}>
                                <TableCell className="font-medium">
                                {item.itemCode}
                                </TableCell>
                                <TableCell>{item.itemName}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>
                                {item.itemType === "Returnable" ? (
                                  <Badge 
                                    variant="outline" 
                                    className="rounded-full border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 text-[10px] px-3"
                                  >
                                    อุปกรณ์ (ยืม-คืน)
                                  </Badge>
                                ) : (
                                  <Badge 
                                    variant="outline" 
                                    className="rounded-full border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 text-[10px] px-3"
                                  >
                                    วัสดุ (เบิกเลย)
                                  </Badge>
                                )}
                                </TableCell>
                                <TableCell>{item.supplierName}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.packSize} {item.unitPkg}</TableCell>
                                <TableCell className="text-right font-bold text-blue-600">
                                {item.stock}
                                </TableCell>
                                <TableCell className="text-right font-bold text-blue-600">
                                {totalStock}
                                </TableCell>
                            </TableRow>
                            );
                        })
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center h-24 text-muted-foreground"
                          >
                            ไม่พบรายการวัสดุ
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {renderPagination(stockPage, totalStockPages, setStockPage)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {showDetailModal && selectedItem && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowDetailModal(false)}
          ></div>
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                bg-white dark:bg-gray-900 rounded-lg shadow-2xl z-50 
                w-[95%] max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedItem.supplier}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">
                    เลขที่เอกสาร: {selectedItem.orderbookId} ({selectedItem.id})
                  </p>
                </div>
                <StatusBadge status={selectedItem.status} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDetailModal(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </CardHeader>

            <CardContent className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-blue-50/50 dark:bg-gray-800/50 p-4 rounded-lg mb-6 border border-blue-100 dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ผู้ขอเบิก</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{selectedItem.details?.requester}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">วันที่ขอเบิก</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{selectedItem.details?.requestDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">แผนก</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{selectedItem.details?.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">วันที่คาดว่าจะได้รับ</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{selectedItem.deliveryDate || "-"}</p>
                </div>
                {selectedItem.status === "ไม่อนุมัติ" && (
                  <div className="col-span-2 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-800">
                    <p className="text-sm font-medium text-red-500 dark:text-red-400">เหตุผลที่ไม่อนุมัติ</p>
                    <p className="text-red-700 dark:text-red-200">{selectedItem.details?.rejectionReason}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                  <Package className="h-5 w-5" /> รายการที่เบิก
                </h3>
                <div className="border dark:border-gray-700 rounded-md overflow-hidden">
                  {/* ✅ Fixed Header to cover full width */}
                  <div className="sticky top-0 z-30 shadow-md bg-emerald-600 p-4 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <span className="font-semibold">รายละเอียดอะไหล่ ({selectedItem?.items.length})</span>
                    </div>
                  </div>

                  {/* ✅ Removed min-h-[400px], changed to auto height */}
                  <div className="relative h-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                    <div className="overflow-x-auto">
                      <Table className="min-w-full border-collapse text-xs">
                        <TableHeader className="bg-gray-900 sticky top-0 z-20">
                          <TableRow className="hover:bg-gray-900 border-none">
                            <TableHead className="w-[50px] text-white">#</TableHead>
                            <TableHead className="text-white">รหัสอะไหล่</TableHead>
                            <TableHead className="text-white">ชื่อรายการ</TableHead>
                            <TableHead className="text-white">จำนวน</TableHead>
                            <TableHead className="text-white">หน่วย</TableHead>
                            <TableHead className="text-white">ประเภท</TableHead>
                            {selectedItem.status === "อนุมัติ" && (
                              <TableHead className="text-white">กำหนดคืน</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedDetailItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item["#"]}</TableCell>
                              <TableCell>{item.itemCode}</TableCell>
                              <TableCell>{item.itemName}</TableCell>
                              <TableCell className="font-bold">{item.qty}</TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>
                                {item.itemType === "Returnable" ? (
                                  <Badge 
                                    variant="outline" 
                                    className="rounded-full border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 text-[10px] px-3"
                                  >
                                    อุปกรณ์ (ยืม-คืน)
                                  </Badge>
                                ) : (
                                  <Badge 
                                    variant="outline" 
                                    className="rounded-full border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 text-[10px] px-3"
                                  >
                                    วัสดุ (เบิกเลย)
                                  </Badge>
                                )}
                              </TableCell>
                              {selectedItem.status === "อนุมัติ" && (
                                <TableCell>
                                  {item.returnDate || "-"}
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  {/* ✅ Pagination Controls */}
                  {renderPagination(detailPage, totalDetailPages, setDetailPage)}
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t dark:border-gray-700 p-4 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                ปิด
              </Button>
              {selectedItem.status === "รออนุมัติ" && (
                <Button
                  variant="destructive"
                  onClick={() => handleCancelRequest(selectedItem)}
                >
                  <X className="mr-2 h-4 w-4" /> ยกเลิกใบเบิก
                </Button>
              )}
            </CardFooter>
          </div>
        </>
      )}

      {showCreateModal && (
        <CreateInventoryModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleSaveNewInventory}
          stockData={stockData}
          findStockInfo={findStockInfo}
        />
      )}

      {showEditModal && editingItem && (
        <EditInventoryModal
          onClose={handleCloseEditModal}
          onSubmit={handleSaveEdit}
          inventoryData={editingItem}
          stockData={stockData}
          findStockInfo={findStockInfo}
          mode="user"
        />
      )}
    </>
  );
}