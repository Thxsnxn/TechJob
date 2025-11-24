"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  FileText,
  X,
  Trash2,
  PackagePlus,
  Save,
  Pencil,
  Search as SearchIcon,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as UiCalendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SiteHeader } from "@/components/site-header";
// ❌ ลบ import mock data ออกแล้ว
import apiClient from "@/lib/apiClient";

// ⭐ modal เพิ่มของใหม่เข้าคลัง
import CreateStockItemModal from "./CreateStockItemModal";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------
// FUNCTION: Logic การแสดงผลเลขหน้าแบบ Windowing
// ----------------------------------------------------
const getPageRange = (currentPage, totalPages) => {
  const pages = [];
  const windowSize = 2;

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - windowSize && i <= currentPage + windowSize)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return pages;
};

function DatePicker({ value, onChange, placeholder = "เลือกวันที่" }) {
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed)) setDate(parsed);
      else setDate(null);
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
        <UiCalendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

const allStatusNames = ["รออนุมัติ", "อนุมัติ", "ไม่อนุมัติ", "ยกเลิก"];

export default function Page() {
  const [view, setView] = useState("list");
  // ⭐ Active Tab State
  const [activeTab, setActiveTab] = useState("product");
  const [selectedItem, setSelectedItem] = useState(null);

  const [detailSearchQuery, setDetailSearchQuery] = useState("");
  const [detailFilterType, setDetailFilterType] = useState("all");

  // Pagination States
  const [productPage, setProductPage] = useState(1);
  const productItemsPerPage = 10;

  const [stockPage, setStockPage] = useState(1);
  const stockItemsPerPage = 50;

  // ⭐ เพิ่ม state สำหรับ pagination ในหน้า Detail
  const [detailPage, setDetailPage] = useState(1);
  const detailItemsPerPage = 10;

  const [collapsedGroups, setCollapsedGroups] = useState(new Set());

  // ✅ แก้ไข: เปลี่ยนจาก mockOrderData เป็น array ว่าง
  const [inventoryData, setInventoryData] = useState([]);

  // ⭐ ข้อมูลคลังวัสดุ/อุปกรณ์ จาก API
  // ✅ แก้ไข: เปลี่ยนจาก initialStockData เป็น array ว่าง
  const [stockData, setStockData] = useState([]);
  const [stockTotal, setStockTotal] = useState(0);
  const [isLoadingStock, setIsLoadingStock] = useState(false);

  const [showManageStockModal, setShowManageStockModal] = useState(false);
  const [editingStockItem, setEditingStockItem] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");

  const [tempSelectedStatuses, setTempSelectedStatuses] =
    useState(allStatusNames);
  const [isAllSelected, setIsAllSelected] = useState(true);

  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); // ใช้เป็น id
  const [selectedUnit, setSelectedUnit] = useState("all"); // ใช้เป็น id
  const [selectedType, setSelectedType] = useState("all"); // ใช้ Returnable / Consumable / all

  const [apiCategories, setApiCategories] = useState([]);
  const [apiUnits, setApiUnits] = useState([]);

  // 🔹 โหลด dropdown category / unit
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [catRes, unitRes] = await Promise.all([
          apiClient.get("/categories"),
          apiClient.get("/units"),
        ]);
        if (catRes.data?.items) setApiCategories(catRes.data.items);
        if (unitRes.data?.items) setApiUnits(unitRes.data.items);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdowns();
  }, []);

  // 🔹 รีเซ็ตหน้า Detail Page เมื่อมีการค้นหาหรือเปลี่ยน filter
  useEffect(() => {
    setDetailPage(1);
  }, [detailSearchQuery, detailFilterType]);

  // 🔹 ฟังก์ชันดึงข้อมูลคลังจาก API /filter-items
  const fetchStockItems = React.useCallback(async () => {
    setIsLoadingStock(true);
    try {
      // map ประเภทจาก UI → type ของ API
      let typeForApi = "";
      if (selectedType === "Returnable") typeForApi = "EQUIPMENT";
      else if (selectedType === "Consumable") typeForApi = "MATERIAL";

      const body = {
        search: stockSearchQuery || "",
        type: typeForApi, // "", "MATERIAL", "EQUIPMENT"
        categoryId: selectedCategory === "all" ? "" : Number(selectedCategory),
        unitId: selectedUnit === "all" ? "" : Number(selectedUnit),
        page: stockPage,
        pageSize: stockItemsPerPage,
      };

      const res = await apiClient.post("/filter-items", body);
      const items = res.data?.items || [];

      const mapped = items.map((i) => ({
        itemCode: i.code,
        itemName: i.name,
        itemType: i.type === "EQUIPMENT" ? "Returnable" : "Consumable",
        categoryId: i.categoryId,
        category: i.category?.name || "",
        unitId: i.unitId,
        unit: i.unit?.name || "",
        packSize: i.packSize,
        packUnitId: i.packUnitId,
        unitPkg: i.unit?.name || "",
        stock: i.qtyOnHand,
        stockQty: i.stockQty,
      }));

      setStockData(mapped);
      setStockTotal(res.data?.total || mapped.length);
    } catch (error) {
      console.error("Error fetching stock items:", error);
    } finally {
      setIsLoadingStock(false);
    }
  }, [
    stockSearchQuery,
    selectedType,
    selectedCategory,
    selectedUnit,
    stockPage,
    stockItemsPerPage,
  ]);

  // โหลดข้อมูลคลังตอนเปิดหน้า + ตอน filter / page เปลี่ยน
  useEffect(() => {
    fetchStockItems();
  }, [fetchStockItems]);

  // เวลาเปลี่ยน filter / ค้นหา ให้กลับไปหน้า 1
  useEffect(() => {
    setStockPage(1);
  }, [stockSearchQuery, selectedCategory, selectedUnit, selectedType]);

  const handleToggleGroup = (groupCode) => {
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupCode)) {
        newSet.delete(groupCode);
      } else {
        newSet.add(groupCode);
      }
      return newSet;
    });
  };

  const handleStatusChange = (status, checked) => {
    if (status === "all") {
      setIsAllSelected(checked);
      setTempSelectedStatuses(checked ? allStatusNames : []);
    } else {
      let newStatuses;
      if (checked) newStatuses = [...tempSelectedStatuses, status];
      else newStatuses = tempSelectedStatuses.filter((s) => s !== status);
      setTempSelectedStatuses(newStatuses);
      setIsAllSelected(newStatuses.length === allStatusNames.length);
    }
  };

  const handleResetDates = () => {
    setTempStartDate("");
    setTempEndDate("");
  };

  const handleOpenCreateStock = () => {
    setEditingStockItem(null);
    setShowManageStockModal(true);
  };
  const handleOpenEditStock = (item) => {
    setEditingStockItem(item);
    setShowManageStockModal(true);
  };

  // 🔹 เมื่อ modal บันทึกสำเร็จ → refetch จาก API
  const handleSaveStockItem = () => {
    setShowManageStockModal(false);
    fetchStockItems();
  };

  const handleDeleteStockItem = (itemCode) => {
    if (
      window.confirm(
        `คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า: ${itemCode}? (ยังไม่ได้เชื่อม API delete)`
      )
    ) {
      // ตอนนี้ยังเป็นลบใน frontend อย่างเดียว
      setStockData((prev) => prev.filter((item) => item.itemCode !== itemCode));
    }
  };

  const handleDeleteInventory = (orderToDelete) => {
    const stockAction =
      orderToDelete.status === "อนุมัติ"
        ? "(Stock จะถูกคืน)"
        : "(ไม่มีการคืน Stock)";
    if (
      !window.confirm(
        `คุณแน่ใจหรือไม่ว่าต้องการลบ: ${orderToDelete.orderbookId}?\n${stockAction}`
      )
    )
      return;

    if (orderToDelete.status === "อนุมัติ") {
      orderToDelete.items.forEach((item) => {
        const itemCode = item.itemCode;
        const quantity = parseFloat(item.qty);
        setStockData((prev) =>
          prev.map((s) =>
            s.itemCode === itemCode ? { ...s, stock: s.stock + quantity } : s
          )
        );
      });
    }

    setInventoryData((currentData) =>
      currentData
        .map((group) => ({
          ...group,
          orders: group.orders.filter(
            (order) => order.orderbookId !== orderToDelete.orderbookId
          ),
        }))
        .filter((group) => group.orders.length > 0)
    );

    if (
      selectedItem &&
      selectedItem.orderbookId === orderToDelete.orderbookId
    ) {
      setSelectedItem(null);
      setView("list");
    }
  };

  const handleSaveChanges = () => {
    if (!selectedItem) return;
    if (!window.confirm("ยืนยันการบันทึกการเปลี่ยนแปลง?")) return;

    setInventoryData((currentData) =>
      currentData.map((group) => ({
        ...group,
        orders: group.orders.map((order) =>
          order.orderbookId === selectedItem.orderbookId ? selectedItem : order
        ),
      }))
    );
    alert("บันทึกข้อมูลเรียบร้อยแล้ว");
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedItem) return;
    const orderId = selectedItem.orderbookId;
    const orderToUpdate = { ...selectedItem };
    const oldStatus = orderToUpdate.status;
    let reason = null;

    if (newStatus === "อนุมัติ") {
      if (
        !window.confirm(
          `คุณแน่ใจหรือไม่ว่าต้องการ "อนุมัติ" ใบเบิก: ${orderId}?\n(Stock จะถูกหักตามยอดเบิกทันที)`
        )
      )
        return;
    } else if (newStatus === "ไม่อนุมัติ") {
      reason = window.prompt(
        `โปรดระบุเหตุผลที่ "ไม่อนุมัติ" ใบเบิก: ${orderId}`
      );
      if (reason === null || reason.trim() === "")
        return alert("กรุณาระบุเหตุผล");
    } else if (newStatus === "ยกเลิก") {
      reason = window.prompt(`โปรดระบุเหตุผลที่ "ยกเลิก" ใบเบิก: ${orderId}?`);
      if (reason === null || reason.trim() === "")
        return alert("กรุณาระบุเหตุผล");
    }

    orderToUpdate.items.forEach((item) => {
      const itemCode = item.itemCode;
      const quantity = parseFloat(item.qty);
      if (newStatus === "อนุมัติ" && oldStatus !== "อนุมัติ") {
        setStockData((prev) =>
          prev.map((s) =>
            s.itemCode === itemCode ? { ...s, stock: s.stock - quantity } : s
          )
        );
      } else if (
        (newStatus === "ยกเลิก" || newStatus === "ไม่อนุมัติ") &&
        oldStatus === "อนุมัติ"
      ) {
        setStockData((prev) =>
          prev.map((s) =>
            s.itemCode === itemCode ? { ...s, stock: s.stock + quantity } : s
          )
        );
      }
    });

    const updatedOrder = {
      ...orderToUpdate,
      status: newStatus,
      details: {
        ...orderToUpdate.details,
        approver:
          newStatus === "อนุมัติ"
            ? "ผู้ใช้ปัจจุบัน"
            : orderToUpdate.details.approver,
        approveDate:
          newStatus === "อนุมัติ"
            ? format(new Date(), "dd/MM/yyyy HH:mm:ss")
            : orderToUpdate.details.approveDate,
        rejectionReason: reason || orderToUpdate.details.rejectionReason,
      },
    };

    setInventoryData((currentData) =>
      currentData.map((group) => ({
        ...group,
        orders: group.orders.map((order) =>
          order.orderbookId === orderId ? updatedOrder : order
        ),
      }))
    );
    setSelectedItem(updatedOrder);
  };

  const handleDetailChange = (field, value, isNested = false) => {
    setSelectedItem((prev) => {
      if (isNested)
        return { ...prev, details: { ...prev.details, [field]: value } };
      return { ...prev, [field]: value };
    });
  };

  const handleItemChange = (index, field, value) => {
    setSelectedItem((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const handleViewDetails = (order) => {
    const orderClone = JSON.parse(JSON.stringify(order));
    orderClone.items = orderClone.items.map((item) => ({
      ...item,
      requestQty: item.requestQty || item.qty,
    }));
    setSelectedItem(orderClone);
    setDetailSearchQuery("");
    setDetailFilterType("all");
    setDetailPage(1); // Reset to page 1 when viewing details
    setView("detail");
  };

  const handleBackToList = () => {
    setSelectedItem(null);
    setView("list");
  };

  // 🔹 filter ใบเบิก (ส่วนเดิม)
  const filteredData = useMemo(() => {
    const normalizedSearch = (searchQuery || "").toLowerCase().trim();
    const noStatusFilter = (tempSelectedStatuses || []).length === 0;
    const noSearchFilter = normalizedSearch === "";
    const noDateFilter = tempStartDate === "" && tempEndDate === "";

    if (noStatusFilter && noSearchFilter && noDateFilter) {
      return inventoryData;
    }

    const newFilteredData = [];
    (inventoryData || []).forEach((group) => {
      const matchingOrders = (group.orders || []).filter((order) => {
        const matchesStatus =
          noStatusFilter || (tempSelectedStatuses || []).includes(order.status);
        const matchesSearch =
          noSearchFilter ||
          (order.id && order.id.toLowerCase().includes(normalizedSearch)) ||
          (order.supplier &&
            order.supplier.toLowerCase().includes(normalizedSearch)) ||
          (order.orderbookId &&
            order.orderbookId.toLowerCase().includes(normalizedSearch));

        let matchesDate = true;
        if (!noDateFilter && order.orderDate) {
          const [d, m, y] = order.orderDate.split("/");
          const orderISO = `${y}-${m}-${d}`;
          if (!orderISO) matchesDate = false;
          else {
            if (tempStartDate && orderISO < tempStartDate) matchesDate = false;
            if (tempEndDate && orderISO > tempEndDate) matchesDate = false;
          }
        }
        return matchesStatus && matchesSearch && matchesDate;
      });

      if (matchingOrders.length > 0) {
        newFilteredData.push({ ...group, orders: matchingOrders });
      }
    });
    return newFilteredData;
  }, [
    inventoryData,
    tempSelectedStatuses,
    searchQuery,
    tempStartDate,
    tempEndDate,
  ]);

  // ✅ ตอนนี้ปล่อย filter ให้ backend ทำทั้งหมด
  const filteredStockData = useMemo(() => stockData || [], [stockData]);

  const totalProductPages = Math.max(
    1,
    Math.ceil(
      (filteredData || []).reduce(
        (acc, g) => acc + ((g.orders && g.orders.length) || 0),
        0
      ) / productItemsPerPage
    )
  );

  const flattenedProductOrders = useMemo(() => {
    const arr = [];
    (filteredData || []).forEach((g) => {
      (g.orders || []).forEach((o) =>
        arr.push({ groupCode: g.groupCode, groupName: g.groupName, order: o })
      );
    });
    return arr;
  }, [filteredData]);

  const paginatedProductFlat = flattenedProductOrders.slice(
    (productPage - 1) * productItemsPerPage,
    productPage * productItemsPerPage
  );

  // 🔹 page จาก backend
  const totalStockPages = Math.max(
    1,
    Math.ceil((stockTotal || 0) / stockItemsPerPage)
  );
  const paginatedStockData = filteredStockData || [];

  useEffect(() => {
    setProductPage((p) => Math.min(p, totalProductPages));
  }, [totalProductPages]);
  const renderListView = () => (
    <>
      {activeTab === "product" && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <Input
                placeholder="ค้นหา รหัสการเบิก, JOB, เลขที่เอกสาร..."
                className="w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="w-full md:w-[200px]">
                <label className="text-sm font-medium">วันที่เริ่มต้น</label>
                <DatePicker
                  placeholder="เลือกวันที่"
                  value={tempStartDate}
                  onChange={setTempStartDate}
                />
              </div>
              <div className="w-full md:w-[200px]">
                <label className="text-sm font-medium">วันที่สิ้นสุด</label>
                <DatePicker
                  placeholder="เลือกวันที่"
                  value={tempEndDate}
                  onChange={setTempEndDate}
                />
              </div>
              <Button variant="outline" size="icon" onClick={handleResetDates}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <TabsList>
            <TabsTrigger value="product">รายการเบิกวัสดุ/อุปกรณ์</TabsTrigger>
            <TabsTrigger value="supplier">คลังวัสดุ (Stock Master)</TabsTrigger>
          </TabsList>
        </div>

        {/* ---------------- TAB รายการเบิก ---------------- */}
        <TabsContent value="product">
          <Card className="p-0 overflow-hidden mt-4">
            <div className="relative max-h-[600px] overflow-hidden">
              <div className="overflow-y-auto h-full custom-scrollbar">
                <div className="overflow-x-auto">
                  <Table className="min-w-[800px] border-collapse text-xs">
                    <TableHeader className="sticky top-0 z-10 bg-blue-900 shadow-md">
                      <TableRow className="h-8">
                        <TableHead className="text-white font-semibold whitespace-nowrap px-2">
                          รหัสการเบิก
                        </TableHead>
                        <TableHead className="text-white font-semibold whitespace-nowrap px-2">
                          JOB ID/JOB TITLE
                        </TableHead>
                        <TableHead className="text-white font-semibold whitespace-nowrap px-2">
                          เลขที่เอกสาร
                        </TableHead>
                        <TableHead className="text-white font-semibold whitespace-nowrap px-2">
                          วันที่เบิก
                        </TableHead>
                        <TableHead className="text-white font-semibold whitespace-nowrap px-2">
                          รหัสอะไหล่หลัก
                        </TableHead>
                        <TableHead className="text-white font-semibold whitespace-nowrap px-2">
                          ชื่ออะไหล่หลัก
                        </TableHead>
                        <TableHead className="text-white font-semibold whitespace-nowrap px-2">
                          จำนวนรายการ
                        </TableHead>
                        <TableHead className="text-white font-semibold whitespace-nowrap px-2">
                          คาดว่าจะได้รับ
                        </TableHead>
                        <TableHead className="text-white font-semibold whitespace-nowrap text-center px-1">
                          จัดการ
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {paginatedProductFlat.length > 0 ? (
                        paginatedProductFlat.map((flat, idx) => {
                          const { groupCode, groupName, order } = flat;
                          const showGroupHeader =
                            idx === 0 ||
                            paginatedProductFlat[idx - 1].groupCode !==
                              groupCode;

                          const isCollapsed = collapsedGroups.has(groupCode);

                          return (
                            <React.Fragment
                              key={`${groupCode}-${order.orderbookId}-${idx}`}
                            >
                              {showGroupHeader && (
                                <TableRow
                                  className="bg-yellow-500 hover:bg-yellow-600 border-none cursor-pointer h-7 transition-colors"
                                  onClick={() => handleToggleGroup(groupCode)}
                                >
                                  <TableCell
                                    colSpan={9}
                                    className="font-bold text-yellow-900 text-xs px-2 select-none"
                                  >
                                    <div className="flex items-center gap-2">
                                      <ChevronDown
                                        className={cn(
                                          "h-4 w-4 transition-transform duration-200",
                                          isCollapsed ? "-rotate-90" : ""
                                        )}
                                      />
                                      {groupCode} {groupName}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}

                              {!isCollapsed && (
                                <TableRow className="h-7">
                                  <TableCell className="cursor-pointer px-2 whitespace-nowrap">
                                    {order.id}
                                  </TableCell>
                                  <TableCell className="cursor-pointer px-2 whitespace-nowrap">
                                    {order.supplier}
                                  </TableCell>
                                  <TableCell className="cursor-pointer px-2 whitespace-nowrap">
                                    {order.orderbookId}
                                  </TableCell>
                                  <TableCell className="cursor-pointer px-2 whitespace-nowrap">
                                    {order.orderDate}
                                  </TableCell>
                                  <TableCell className="cursor-pointer px-2 whitespace-nowrap">
                                    {order.vendorCode}
                                  </TableCell>
                                  <TableCell className="cursor-pointer px-2 whitespace-nowrap">
                                    {order.vendorName}
                                  </TableCell>
                                  <TableCell className="cursor-pointer px-2 whitespace-nowrap font-semibold">
                                    {order.items.length}
                                  </TableCell>
                                  <TableCell className="cursor-pointer px-2 whitespace-nowrap">
                                    {order.deliveryDate || "-"}
                                  </TableCell>
                                  <TableCell className="px-1 text-center">
                                    <div className="flex gap-1 justify-center">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-blue-600 hover:text-blue-700 h-6 w-6"
                                        onClick={() => handleViewDetails(order)}
                                      >
                                        <FileText className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center text-muted-foreground h-24 text-sm"
                          >
                            ไม่พบข้อมูลที่ตรงกับตัวกรอง
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {totalProductPages > 1 && (
              <div className="flex justify-end items-center gap-2 p-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={productPage === 1}
                  onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                >
                  ก่อนหน้า
                </Button>

                {getPageRange(productPage, totalProductPages).map((p, i) => {
                  if (p === "...") {
                    return (
                      <span
                        key={`el-${i}`}
                        className="px-2 py-1 text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }
                  const pageNumber = p;
                  return (
                    <Button
                      key={pageNumber}
                      size="sm"
                      variant={
                        productPage === pageNumber ? "default" : "outline"
                      }
                      className={
                        productPage === pageNumber
                          ? "bg-blue-600 text-white"
                          : ""
                      }
                      onClick={() => setProductPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={productPage === totalProductPages}
                  onClick={() =>
                    setProductPage((p) =>
                      Math.min(totalProductPages, p + 1)
                    )
                  }
                >
                  ถัดไป
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* ---------------- TAB คลังวัสดุ (Stock Master) ---------------- */}
        <TabsContent value="supplier">
          <Card className="mt-4 p-0 overflow-hidden border">
            <div className="sticky top-0 z-30 bg-background border-b shadow-sm">
              <CardHeader className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 className="text-lg font-semibold">
                    รายการวัสดุคงคลัง (Master Stock)
                  </h3>
                  <Button
                    onClick={handleOpenCreateStock}
                    className="w-full md:w-auto"
                  >
                    <PackagePlus className="mr-2 h-4 w-4" />{" "}
                    เพิ่มของใหม่เข้าคลัง
                  </Button>
                </div>
                <div className="flex flex-col md:flex-row flex-wrap items-center gap-4 pt-4">
                  <div className="relative w-full md:w-[250px]">
                    <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                    <Input
                      placeholder="ค้นหารหัส หรือ ชื่ออะไหล่..."
                      className="w-full pl-8"
                      value={stockSearchQuery}
                      onChange={(e) => setStockSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* ประเภท: Returnable / Consumable */}
                  <Select
                    value={selectedType}
                    onValueChange={setSelectedType}
                  >
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกประเภท</SelectItem>
                      <SelectItem value="Consumable">
                        วัสดุ (เบิกเลย)
                      </SelectItem>
                      <SelectItem value="Returnable">
                        อุปกรณ์ (ต้องคืน)
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* หมวดหมู่: ใช้ id เป็น value */}
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                      {apiCategories.map((c) => (
                        <SelectItem
                          key={c.id || c.name}
                          value={String(c.id)}
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* หน่วย: ใช้ id เป็น value */}
                  <Select
                    value={selectedUnit}
                    onValueChange={setSelectedUnit}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="เลือกหน่วย" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกหน่วย</SelectItem>
                      {apiUnits.map((u) => (
                        <SelectItem
                          key={u.id || u.name}
                          value={String(u.id)}
                        >
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </div>

            <CardContent className="p-0 border-t">
              <div className="h-[65vh] w-full overflow-auto relative custom-scrollbar">
                <table className="w-full text-left min-w-[1000px] border-collapse text-xs">
                  <TableHeader className="sticky top-0 z-10 bg-gray-100 dark:bg-slate-800 shadow-sm border-b">
                    <TableRow className="h-8">
                      <TableHead className="whitespace-nowrap px-2">
                        รหัสอะไหล่
                      </TableHead>
                      <TableHead className="whitespace-nowrap px-2">
                        ชื่ออะไหล่
                      </TableHead>
                      <TableHead className="whitespace-nowrap px-2">
                        ประเภท
                      </TableHead>
                      <TableHead className="whitespace-nowrap px-2">
                        หมวดหมู่
                      </TableHead>
                      <TableHead className="whitespace-nowrap px-2">
                        หน่วยสั่ง
                      </TableHead>
                      <TableHead className="whitespace-nowrap px-2">
                        บรรจุ
                      </TableHead>
                      <TableHead className="whitespace-nowrap px-2">
                        คงเหลือ
                      </TableHead>
                      <TableHead className="whitespace-nowrap px-2">
                        รวม
                      </TableHead>
                      <TableHead className="whitespace-nowrap px-1 text-center">
                        จัดการ
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {/* Loading State */}
                    {isLoadingStock ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          <div className="flex justify-center items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                            <span>กำลังโหลดข้อมูล...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : paginatedStockData.length > 0 ? (
                      paginatedStockData.map((item) => {
                        const totalStock =
                          item.stockQty != null
                            ? item.stockQty
                            : item.stock * parseFloat(item.packSize || 1);
                        return (
                          <TableRow
                            key={item.itemCode}
                            className="h-7 border-b"
                          >
                            <TableCell className="px-2 whitespace-nowrap">
                              {item.itemCode}
                            </TableCell>
                            <TableCell className="px-2 whitespace-nowrap">
                              {item.itemName}
                            </TableCell>
                            <TableCell className="px-2 whitespace-nowrap">
                              {item.itemType === "Returnable" ? (
                                <Badge
                                  variant="outline"
                                  className="w-fit rounded-full border-blue-500 text-blue-500 hover:bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-normal whitespace-nowrap"
                                >
                                  อุปกรณ์ (ยืม-คืน)
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="w-fit rounded-full border-orange-500 text-orange-500 hover:bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-normal whitespace-nowrap"
                                >
                                  วัสดุ (เบิกเลย)
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="px-2 whitespace-nowrap">
                              {item.category}
                            </TableCell>
                            <TableCell className="px-2 whitespace-nowrap">
                              {item.unit}
                            </TableCell>
                            <TableCell className="px-2 whitespace-nowrap">
                              {item.packSize} {item.unitPkg}
                            </TableCell>
                            <TableCell className="px-2 font-semibold text-blue-600">
                              {item.stock}
                            </TableCell>
                            <TableCell className="px-2 font-semibold text-blue-600">
                              {totalStock}
                            </TableCell>
                            <TableCell className="px-1 text-center">
                              <div className="flex gap-1 justify-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-yellow-600 hover:text-yellow-700 h-6 w-6"
                                  onClick={() => handleOpenEditStock(item)}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-700 h-6 w-6"
                                  onClick={() =>
                                    handleDeleteStockItem(item.itemCode)
                                  }
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center text-muted-foreground h-24"
                        >
                          ไม่พบรายการอะไหล่
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </table>
              </div>
            </CardContent>

            {/* Pagination for Stock Master */}
            {stockTotal > 0 && (
              <div className="flex justify-end items-center gap-2 p-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={stockPage === 1}
                  onClick={() => setStockPage((p) => Math.max(1, p - 1))}
                >
                  ก่อนหน้า
                </Button>

                {getPageRange(stockPage, totalStockPages).map((p, i) => {
                  if (p === "...") {
                    return (
                      <span
                        key={`el-${i}`}
                        className="px-2 py-1 text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }
                  const pageNumber = p;
                  return (
                    <Button
                      key={pageNumber}
                      size="sm"
                      variant={
                        pageNumber === stockPage ? "default" : "outline"
                      }
                      className={
                        pageNumber === stockPage
                          ? "bg-blue-600 text-white"
                          : ""
                      }
                      onClick={() => setStockPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={stockPage === totalStockPages}
                  onClick={() =>
                    setStockPage((p) =>
                      Math.min(totalStockPages, p + 1)
                    )
                  }
                >
                  ถัดไป
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderDetailView = () => {
    const filteredDetailItems =
      selectedItem?.items.filter((item) => {
        const matchesSearch =
          detailSearchQuery === "" ||
          item.itemCode
            .toLowerCase()
            .includes(detailSearchQuery.toLowerCase()) ||
          item.itemName
            .toLowerCase()
            .includes(detailSearchQuery.toLowerCase());
        const stockItem = stockData.find(
          (s) => s.itemCode === item.itemCode
        );
        const itemType =
          item.itemType ||
          (stockItem ? stockItem.itemType : "Non-Returnable");
        const matchesType =
          detailFilterType === "all" || itemType === detailFilterType;
        return matchesSearch && matchesType;
      }) || [];

    // Pagination Logic for Detail View
    const totalDetailPages = Math.max(
      1,
      Math.ceil(filteredDetailItems.length / detailItemsPerPage)
    );
    const paginatedDetailItems = filteredDetailItems.slice(
      (detailPage - 1) * detailItemsPerPage,
      detailPage * detailItemsPerPage
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <div>
            <h2 className="text-2xl font-bold">
              เลขที่เอกสาร {selectedItem?.orderbookId} ({selectedItem?.id})
            </h2>
            <p className="text-lg text-muted-foreground">
              {selectedItem?.supplier}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">รายละเอียด</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">รหัสการเบิก</label>
                <Input disabled value={selectedItem?.id || ""} />
              </div>
              <div>
                <label className="text-sm font-medium">
                  JOB ID/JOB TITLE (User)
                </label>
                <Input disabled value={selectedItem?.supplier || ""} />
              </div>
              <div>
                <label className="text-sm font-medium">
                  ผู้รับผิดชอบ (User)
                </label>
                <Input
                  disabled
                  value={selectedItem?.details?.contact || ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">เลขที่เอกสาร</label>
                <Input disabled value={selectedItem?.orderbookId || ""} />
              </div>
              <div>
                <label className="text-sm font-medium">แผนก (User)</label>
                <Input
                  disabled
                  value={selectedItem?.details?.department || ""}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-blue-600">
                  รหัสอ้างอิง (แก้ไขได้)
                </label>
                <Input
                  value={selectedItem?.details?.vendorInvoice || ""}
                  onChange={(e) =>
                    handleDetailChange(
                      "vendorInvoice",
                      e.target.value,
                      true
                    )
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-blue-600">
                  วันที่คาดว่าจะได้รับ (แก้ไขได้)
                </label>
                <Input
                  type="date"
                  value={selectedItem?.deliveryDate || ""}
                  onChange={(e) =>
                    handleDetailChange("deliveryDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">
                  ผู้ขอเบิก (User)
                </label>
                <Input
                  disabled
                  value={selectedItem?.details?.requester || ""}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  วันที่ขอเบิก (System)
                </label>
                <Input
                  disabled
                  value={selectedItem?.details?.requestDate || ""}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  ผู้อนุมัติ (System)
                </label>
                <Input
                  disabled
                  placeholder="ระบบจะบันทึกอัตโนมัติ"
                  value={selectedItem?.details?.approver || ""}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  วันที่อนุมัติ (System)
                </label>
                <Input
                  disabled
                  placeholder="ระบบจะบันทึกอัตโนมัติ"
                  value={selectedItem?.details?.approveDate || ""}
                />
              </div>
            </div>
          </CardContent>
          <div className="p-4 border-t flex justify-end">
            <Button
              className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
              onClick={handleSaveChanges}
            >
              <Save className="mr-2 h-4 w-4" /> บันทึกการแก้ไข
            </Button>
          </div>
        </Card>

        {/* UI รายละเอียดอะไหล่/วัสดุ */}
        <Card className="border overflow-hidden">
          <div className="sticky top-0 z-30">
            <CardHeader className="bg-emerald-600 text-white space-y-4 p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <PackagePlus className="h-5 w-5" />
                  รายละเอียดอะไหล่/วัสดุ ({selectedItem?.items.length})
                </h3>

                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <div className="relative w-full md:w-[250px]">
                    <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                    <Input
                      placeholder="ค้นหาอะไหล่ในใบเบิก..."
                      className="pl-8 !bg-white !text-black !placeholder-gray-500 border-none h-9 ring-offset-transparent focus-visible:ring-0"
                      value={detailSearchQuery}
                      onChange={(e) => setDetailSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select
                    value={detailFilterType}
                    onValueChange={setDetailFilterType}
                  >
                    <SelectTrigger className="w-full md:w-[150px] !bg-white !text-black border-none h-9 ring-offset-transparent focus:ring-0">
                      <SelectValue placeholder="ประเภท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="Returnable">อุปกรณ์</SelectItem>
                      <SelectItem value="Non-Returnable">วัสดุ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </div>

          <CardContent className="p-0">
            <div className="h-[60vh] overflow-auto relative custom-scrollbar">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="sticky top-0 z-50 bg-gray-900 text-white text-xs uppercase shadow-sm">
                  <tr className="h-10 border-b border-gray-700">
                    <th className="whitespace-nowrap px-4 font-semibold w-[50px]">
                      #
                    </th>
                    <th className="whitespace-nowrap px-4 font-semibold w-[150px]">
                      รหัสอะไหล่
                    </th>
                    <th className="whitespace-nowrap px-4 font-semibold w-[200px]">
                      ชื่ออะไหล่
                    </th>
                    <th className="whitespace-nowrap px-4 font-semibold w-[100px]">
                      ประเภท
                    </th>
                    <th className="whitespace-nowrap px-4 font-semibold w-[120px]">
                      จำนวนที่เบิก
                    </th>
                    <th className="whitespace-nowrap px-4 font-semibold w-[100px]">
                      หน่วยสั่ง
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedDetailItems.map((item, index) => {
                    const stockItem = stockData.find(
                      (s) => s.itemCode === item.itemCode
                    );
                    const itemType =
                      item.itemType ||
                      (stockItem ? stockItem.itemType : null);

                    return (
                      <tr
                        key={index}
                        className="h-12 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-4 whitespace-nowrap text-xs">
                          {item["#"]}
                        </td>
                        <td className="px-4 whitespace-nowrap text-xs">
                          {item.itemCode}
                        </td>
                        <td
                          className="px-4 whitespace-nowrap text-xs truncate max-w-[200px]"
                          title={item.itemName}
                        >
                          {item.itemName}
                        </td>
                        <td className="px-4 whitespace-nowrap text-xs">
                          {itemType === "Returnable" ? (
                            <Badge
                              variant="outline"
                              className="border-blue-500 text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full"
                            >
                              อุปกรณ์ (ยืม-คืน)
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-orange-500 text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full"
                            >
                              วัสดุ (เบิกเลย)
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 whitespace-nowrap text-xs font-bold text-red-600">
                          {item.qty}
                        </td>
                        <td className="px-4 whitespace-nowrap text-xs">
                          <div>{item.unit}</div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredDetailItems.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center h-24 text-muted-foreground"
                      >
                        ไม่พบรายการที่ค้นหา
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>

          {/* Pagination for Detail View */}
          {totalDetailPages > 1 && (
            <div className="flex justify-end items-center gap-2 p-3 border-t">
              <Button
                variant="outline"
                size="sm"
                disabled={detailPage === 1}
                onClick={() => setDetailPage((p) => Math.max(1, p - 1))}
              >
                ก่อนหน้า
              </Button>

              {getPageRange(detailPage, totalDetailPages).map((p, i) => {
                if (p === "...") {
                  return (
                    <span
                      key={`el-${i}`}
                      className="px-2 py-1 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }
                const pageNumber = p;
                return (
                  <Button
                    key={pageNumber}
                    size="sm"
                    variant={
                      detailPage === pageNumber ? "default" : "outline"
                    }
                    className={
                      detailPage === pageNumber
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : ""
                    }
                    onClick={() => setDetailPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                disabled={detailPage === totalDetailPages}
                onClick={() =>
                  setDetailPage((p) =>
                    Math.min(totalDetailPages, p + 1)
                  )
                }
              >
                ถัดไป
              </Button>
            </div>
          )}
        </Card>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            className="bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 w-full md:w-auto"
            onClick={handleBackToList}
          >
            ย้อนกลับ
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-muted/40 flex flex-col">
      <SiteHeader />
      <div className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              ระบบจัดการคลังวัสดุและอุปกรณ์
            </h1>
            <p className="text-muted-foreground">
              จัดการรายการเบิก จ่าย และตรวจสอบสถานะคงคลัง
            </p>
          </div>
        </div>

        {view === "list" ? renderListView() : renderDetailView()}
      </div>

      {showManageStockModal && (
        <CreateStockItemModal
          initialData={editingStockItem}
          onClose={() => setShowManageStockModal(false)}
          onSubmit={handleSaveStockItem}
          apiCategories={apiCategories}
          apiUnits={apiUnits}
        />
      )}
    </div>
  );
}