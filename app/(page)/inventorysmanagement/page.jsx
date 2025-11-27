"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom"; // ✅ อย่าลืม import นี้
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
  Package,
  Filter,
  ArrowRight,
  Check, // เพิ่ม Check สำหรับ SearchableSelect
  Search // เพิ่ม Search สำหรับ SearchableSelect
} from "lucide-react";
import { format } from "date-fns";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import apiClient from "@/lib/apiClient";
import CreateStockItemModal from "./CreateStockItemModal";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- 🔥 Searchable Select Component (ตัวเดียวกับใน Modal) ---
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
        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
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
                  placeholder={`ค้นหา...`}
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
// ------------------------------------------------------------------

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

const allStatusNames = ["รออนุมัติ", "อนุมัติ", "ไม่อนุมัติ", "ยกเลิก"];

export default function Page() {
  const [view, setView] = useState("list");
  const [activeTab, setActiveTab] = useState("product");
  const [selectedItem, setSelectedItem] = useState(null);

  const [detailSearchQuery, setDetailSearchQuery] = useState("");
  const [detailFilterType, setDetailFilterType] = useState("all");

  const [productPage, setProductPage] = useState(1);
  const productItemsPerPage = 10;

  const [stockPage, setStockPage] = useState(1);
  const stockItemsPerPage = 50;

  const [detailPage, setDetailPage] = useState(1);
  const detailItemsPerPage = 10;

  const [collapsedGroups, setCollapsedGroups] = useState(new Set());

  const [inventoryData, setInventoryData] = useState([]);

  const [stockData, setStockData] = useState([]);
  const [stockTotal, setStockTotal] = useState(0);
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  const [showManageStockModal, setShowManageStockModal] = useState(false);
  const [editingStockItem, setEditingStockItem] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [tempSelectedStatuses, setTempSelectedStatuses] = useState(allStatusNames);
  const [isAllSelected, setIsAllSelected] = useState(true);

  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUnit, setSelectedUnit] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const [apiCategories, setApiCategories] = useState([]);
  const [apiUnits, setApiUnits] = useState([]);

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

  // --- เตรียมข้อมูลสำหรับ SearchableSelect (เพิ่มตัวเลือก "ทั้งหมด") ---
  const typeOptions = [
    { id: "all", name: "ทุกประเภท" },
    { id: "Consumable", name: "วัสดุ (เบิกเลย)" },
    { id: "Returnable", name: "อุปกรณ์ (ต้องคืน)" },
  ];

  const categoryOptionsWithAll = [
    { id: "all", name: "ทุกหมวดหมู่" },
    ...apiCategories.map(c => ({ id: String(c.id), name: c.name }))
  ];

  const unitOptionsWithAll = [
    { id: "all", name: "ทุกหน่วย" },
    ...apiUnits.map(u => ({ id: String(u.id), name: u.name }))
  ];
  // -------------------------------------------------------------

  useEffect(() => {
    setDetailPage(1);
  }, [detailSearchQuery, detailFilterType]);

  const fetchStockItems = React.useCallback(async () => {
    setIsLoadingStock(true);
    try {
      let typeForApi = "";
      if (selectedType === "Returnable") typeForApi = "EQUIPMENT";
      else if (selectedType === "Consumable") typeForApi = "MATERIAL";

      const body = {
        search: stockSearchQuery || "",
        type: typeForApi,
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

  const fetchWorkOrders = React.useCallback(async () => {
    setIsLoadingInventory(true);
    try {
      const body = {
        search: searchQuery || " ",
        page: 1,
        pageSize: 100,
      };
      const res = await apiClient.post("/work-orders/list", body);
      const items = res.data?.items || [];

      const grouped = items.reduce((acc, item) => {
        const groupKey = item.title || "Untitled";

        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }

        const workOrderItems = item.items.map((i) => ({
          id: i.id,
          issueCode: i.issueCode || "-",
          requestDate: format(new Date(item.createdAt), "dd/MM/yyyy"),
          partCode: i.item?.code || "-",
          partName: i.item?.name || "-",
          qty: i.qtyRequest,
          unit: i.item?.unit?.name || "-",
          rawWorkOrder: item,
        }));

        acc[groupKey].push(...workOrderItems);
        return acc;
      }, {});

      const inventoryArray = Object.keys(grouped).map((title) => ({
        groupCode: title,
        groupName: "",
        orders: grouped[title],
      }));

      setInventoryData(inventoryArray);
    } catch (error) {
      console.error("Error fetching work orders:", error);
    } finally {
      setIsLoadingInventory(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  useEffect(() => {
    fetchStockItems();
  }, [fetchStockItems]);

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

  const handleOpenCreateStock = () => {
    setEditingStockItem(null);
    setShowManageStockModal(true);
  };
  const handleOpenEditStock = (item) => {
    setEditingStockItem(item);
    setShowManageStockModal(true);
  };

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

    // Map header fields
    orderClone.jobTitle = order.title || "-";
    orderClone.requestDate = order.createdAt ? format(new Date(order.createdAt), "dd/MM/yyyy HH:mm") : "-";
    orderClone.requester = order.requester || order.user?.name || "-";
    orderClone.contact = order.contact || "-";

    // Map items
    orderClone.items = orderClone.items.map((item, index) => ({
      ...item,
      "#": index + 1,
      itemCode: item.item?.code || "-",
      itemName: item.item?.name || "-",
      qty: item.qtyRequest || 0,
      unit: item.item?.unit?.name || "-",
      itemType: item.item?.type === "EQUIPMENT" ? "Returnable" : "Consumable",
      requestQty: item.requestQty || item.qty,
    }));

    setSelectedItem(orderClone);
    setDetailSearchQuery("");
    setDetailFilterType("all");
    setDetailPage(1);
    setView("detail");
  };

  const handleBackToList = () => {
    setSelectedItem(null);
    setView("list");
  };

  const filteredData = useMemo(() => {
    return inventoryData;
  }, [inventoryData]);

  const filteredStockData = useMemo(() => stockData || [], [stockData]);

  const totalProductPages = Math.max(
    1,
    Math.ceil((filteredData || []).length / productItemsPerPage)
  );

  const paginatedGroups = useMemo(() => {
    return (filteredData || []).slice(
      (productPage - 1) * productItemsPerPage,
      (productPage * productItemsPerPage)
    );
  }, [filteredData, productPage, productItemsPerPage]);

  const paginatedProductFlat = useMemo(() => {
    const arr = [];
    paginatedGroups.forEach((g) => {
      (g.orders || []).forEach((o) =>
        arr.push({ groupCode: g.groupCode, groupName: g.groupName, order: o })
      );
    });
    return arr;
  }, [paginatedGroups]);

  const totalStockPages = Math.max(
    1,
    Math.ceil((stockTotal || 0) / stockItemsPerPage)
  );
  const paginatedStockData = filteredStockData || [];

  const renderListView = () => (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="bg-white dark:bg-slate-900 p-1 h-12 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl">
            <TabsTrigger value="product" className="h-10 px-6 rounded-lg data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-400">รายการเบิกวัสดุ/อุปกรณ์</TabsTrigger>
            <TabsTrigger value="supplier" className="h-10 px-6 rounded-lg data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400">คลังวัสดุ (Stock Master)</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="product" className="space-y-6">
          {/* Filters for Product Tab */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-[400px]">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="ค้นหา รหัสการเบิก, JOB, เลขที่เอกสาร..."
                    className="pl-10 h-10 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="text-sm text-slate-500">
                  ทั้งหมด <span className="font-semibold text-emerald-600">{filteredData.length}</span> รายการ
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 🔥 [แก้ไข] Table for Product Tab : กำหนดความสูง 550px เพื่อให้แสดงประมาณ 10 แถว + Scrollbar */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 flex flex-col">
            <div className="relative h-[550px] overflow-y-auto custom-scrollbar rounded-t-lg">
              <Table>
                {/* เพิ่ม bg-slate-50 ให้ Header ทึบ เวลาเลื่อนข้อมูลจะได้ไม่ซ้อนกัน */}
                <TableHeader className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-800 shadow-sm">
                  <TableRow className="border-slate-200 dark:border-slate-800">
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">รหัสการเบิก</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">วันที่เบิก</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">รหัสอะไหล่หลัก</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">ชื่ออะไหล่หลัก</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">จำนวน</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">หน่วย</TableHead>
                    <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingInventory ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex flex-col justify-center items-center gap-2 text-slate-500">
                          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                          <p>กำลังโหลดข้อมูล...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedProductFlat.length > 0 ? (
                    paginatedProductFlat.map((flat, idx) => {
                      const { groupCode, groupName, order } = flat;
                      const showGroupHeader = idx === 0 || paginatedProductFlat[idx - 1].groupCode !== groupCode;
                      const isCollapsed = collapsedGroups.has(groupCode);

                      return (
                        <React.Fragment key={`${groupCode}-${order.id}-${idx}`}>
                          {showGroupHeader && (
                            <TableRow
                              className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-slate-200 dark:border-slate-800"
                              onClick={() => handleToggleGroup(groupCode)}
                            >
                              <TableCell colSpan={7} className="font-semibold text-slate-700 dark:text-slate-300 py-3">
                                <div className="flex items-center gap-2">
                                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isCollapsed ? "-rotate-90" : "")} />
                                  {groupCode}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}

                          {!isCollapsed && (
                            <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-slate-100 dark:border-slate-800">
                              <TableCell className="font-medium text-slate-900 dark:text-slate-100">{order.issueCode}</TableCell>
                              <TableCell className="text-slate-600 dark:text-slate-400">{order.requestDate}</TableCell>
                              <TableCell className="text-slate-600 dark:text-slate-400">{order.partCode}</TableCell>
                              <TableCell className="text-slate-600 dark:text-slate-400">{order.partName}</TableCell>
                              <TableCell className="font-semibold text-emerald-600">{order.qty}</TableCell>
                              <TableCell className="text-slate-600 dark:text-slate-400">{order.unit}</TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full"
                                  onClick={() => handleViewDetails(order.rawWorkOrder)}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <SearchIcon className="h-6 w-6 text-slate-400" />
                          </div>
                          <p>ไม่พบข้อมูลที่ตรงกับตัวกรอง</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination for Product Tab */}
            {filteredData.length > 0 && (
              <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="text-sm text-slate-500">
                  หน้า {productPage} จาก {totalProductPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                    disabled={productPage === 1}
                    className="h-8 border-slate-200 dark:border-slate-800"
                  >
                    ก่อนหน้า
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProductPage((p) => Math.min(totalProductPages, p + 1))}
                    disabled={productPage === totalProductPages}
                    className="h-8 border-slate-200 dark:border-slate-800"
                  >
                    ถัดไป
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="supplier" className="space-y-6">
          {/* Filters for Supplier Tab */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="bg-blue-600 w-1 h-6 rounded-full inline-block"></span>
                  รายการวัสดุคงคลัง (Master Stock)
                </h3>
                <Button onClick={handleOpenCreateStock} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  <PackagePlus className="mr-2 h-4 w-4" /> เพิ่มของใหม่เข้าคลัง
                </Button>
              </div>

              {/* ✅ ปรับปรุงส่วน Filter ให้ใช้ SearchableSelect */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="ค้นหารหัส หรือ ชื่ออะไหล่..."
                      className="pl-10 h-10 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500"
                      value={stockSearchQuery}
                      onChange={(e) => setStockSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:col-span-1">
                  {/* เปลี่ยน Select เป็น SearchableSelect */}
                  <SearchableSelect 
                    value={selectedType} 
                    onChange={setSelectedType} 
                    options={typeOptions} 
                    placeholder="ทุกประเภท" 
                  />
                </div>
                <div className="md:col-span-1">
                  <SearchableSelect 
                    value={selectedCategory} 
                    onChange={setSelectedCategory} 
                    options={categoryOptionsWithAll} 
                    placeholder="ทุกหมวดหมู่" 
                  />
                </div>
                <div className="md:col-span-1">
                  <SearchableSelect 
                    value={selectedUnit} 
                    onChange={setSelectedUnit} 
                    options={unitOptionsWithAll} 
                    placeholder="ทุกหน่วย" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table for Supplier Tab */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
            <div className="h-[65vh] w-full overflow-auto relative custom-scrollbar">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800/50 shadow-sm">
                  <TableRow className="border-slate-200 dark:border-slate-800">
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">รหัสอะไหล่</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">ชื่ออะไหล่</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">ประเภท</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">หมวดหมู่</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">หน่วยสั่ง</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">บรรจุ</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">คงเหลือ</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">รวม</TableHead>
                    <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingStock ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center">
                        <div className="flex flex-col justify-center items-center gap-2 text-slate-500">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                          <p>กำลังโหลดข้อมูล...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedStockData.length > 0 ? (
                    paginatedStockData.map((item) => {
                      const totalStock = item.stockQty != null ? item.stockQty : item.stock * parseFloat(item.packSize || 1);
                      return (
                        <TableRow key={item.itemCode} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-slate-100 dark:border-slate-800">
                          <TableCell className="font-medium text-slate-900 dark:text-slate-100">{item.itemCode}</TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">{item.itemName}</TableCell>
                          <TableCell>
                            {item.itemType === "Returnable" ? (
                              <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">อุปกรณ์ (ยืม-คืน)</Badge>
                            ) : (
                              <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">วัสดุ (เบิกเลย)</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400">{item.category}</TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400">{item.unit}</TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400">{item.packSize} {item.unitPkg}</TableCell>
                          <TableCell className="font-semibold text-blue-600 dark:text-blue-400">{item.stock}</TableCell>
                          <TableCell className="font-semibold text-blue-600 dark:text-blue-400">{totalStock}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-1 justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-full"
                                onClick={() => handleOpenEditStock(item)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                                onClick={() => handleDeleteStockItem(item.itemCode)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <SearchIcon className="h-6 w-6 text-slate-400" />
                          </div>
                          <p>ไม่พบข้อมูลที่ตรงกับตัวกรอง</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <SiteHeader title="จัดการคลังสินค้า" />

      <main className="p-4 md:p-6 space-y-8 mx-auto">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 shadow-lg">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                <Package className="h-8 w-8" /> จัดการคลังสินค้า
              </h1>
              <p className="text-emerald-100 mt-2 text-lg">
                ตรวจสอบสต็อก อนุมัติการเบิกจ่าย และจัดการรายการวัสดุ
              </p>
            </div>
            {view === "detail" && (
              <Button
                onClick={handleBackToList}
                className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm"
              >
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> กลับหน้ารายการ
              </Button>
            )}
          </div>
        </div>

        {view === "list" ? renderListView() : (
          <div className="space-y-6">
            {/* Detail View Content */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle>รายละเอียดใบเบิก: {selectedItem?.issueCode}</CardTitle>
                <CardDescription>
                  วันที่ขอเบิก: {selectedItem?.requestDate} โดย {selectedItem?.requester}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัสสินค้า</TableHead>
                      <TableHead>ชื่อสินค้า</TableHead>
                      <TableHead>จำนวนที่ขอ</TableHead>
                      <TableHead>หน่วย</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedItem?.items?.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.itemCode}</TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Modals */}
      {showManageStockModal && (
        <CreateStockItemModal
          initialData={editingStockItem}
          onClose={() => setShowManageStockModal(false)}
          onSubmit={handleSaveStockItem}
          // ✅ เพิ่มส่ง Props ให้ Modal เพื่อให้ Dropdown ใน Modal ทำงานได้
          apiCategories={apiCategories}
          apiUnits={apiUnits}
        />
      )}
    </div>
  );
}