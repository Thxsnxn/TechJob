"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  Calendar as CalendarIcon,
  Pencil,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Calendar } from "@/components/ui/calendar";

// *** IMPORT MODALS ***
import CreateInventoryModal from "./CreateInventoryModal";
import EditInventoryModal from "./EditInventoryModal";

// ===============================================
// HELPER FUNCTIONS & UTILITIES
// ===============================================

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const SiteHeader = ({ title }) => {
  return (
    <header className="hidden">
      <h1>{title}</h1>
    </header>
  );
};

function DatePicker({ value, onChange, placeholder = "Select date" }) {
  const [date, setDate] = useState(value ? new Date(value) : null);
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    setDate(value ? new Date(value) : null);
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
          captionLayout="dropdown"
          fromYear={currentYear - 10}
          toYear={currentYear + 10}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

const convertDateToISO = (buddhistDate) => {
  if (!buddhistDate || buddhistDate.length !== 10) return null;
  try {
    const [day, month, year] = buddhistDate.split("/");
    const gregorianYear = parseInt(year) - 543;
    return `${gregorianYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  } catch (e) {
    return null;
  }
};

const StatusBadge = ({ status }) => {
  switch (status) {
    case "อนุมัติ":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          {status}
        </Badge>
      );
    case "รออนุมัติ":
      return (
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
          {status}
        </Badge>
      );
    case "ไม่อนุมัติ":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          {status}
        </Badge>
      );
    case "ยกเลิก":
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          {status}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

function findStockInfo(stockData, itemCode) {
  return stockData.find((s) => s.itemCode === itemCode);
}

// ===============================================
// MOCK DATA
// ===============================================

const mockOrderData = [
  {
    groupName: "สายการผลิต A (Production Line A)",
    groupCode: "LINE-A",
    orders: [
      {
        id: "EQM-1001",
        supplier: "J-2568-001 / ตรวจสอบระบบไฮดรอลิก (PM)",
        orderbookId: "WO-2568-11-001",
        orderDate: "15/11/2568",
        vendorCode: "HYD-OIL-32",
        vendorName: "น้ำมันไฮดรอลิก PTT H-32",
        unit: "1",
        packSize: "ถัง",
        deliveryDate: "16/11/2568",
        status: "อนุมัติ",
        details: {
          requester: "นายสมชาย ใจดี (ฝ่ายผลิต)",
          requestDate: "14/11/2568 10:30:00",
          approver: "นายวิศิษฐ์ ช่างซ่อม",
          approveDate: "15/11/2568 09:00:15",
          lastEditor: "นายวิศิษฐ์ ช่างซ่อม",
          lastEditDate: "15/11/2568 09:00:15",
          department: "ซ่อมบำรุง (Maintenance)",
          contact: "ทีมซ่อมบำรุง 1",
          vendorInvoice: "REF-MAINT-A01",
        },
        items: [
          {
            "#": 1,
            itemCode: "HYD-OIL-32",
            itemName: "น้ำมันไฮดรอลิก PTT H-32",
            vendorItemCode: "PTT-H32-200L",
            itemNameVendor: "น้ำมันไฮดรอลิก PTT เบอร์ 32 (200L)",
            itemNameDetail: "น้ำมันไฮดรอลิก PTT H-32 บรรจุถัง 200 ลิตร",
            qty: "1",
            unit: "ถัง",
            packSize: "200",
            unitPkg: "ลิตร",
          },
        ],
      },
      {
        id: "EQM-1002",
        supplier: "J-2568-002 / ซ่อมมอเตอร์ขับเคลื่อน (CM)",
        orderbookId: "WO-2568-11-002",
        orderDate: "16/11/2568",
        vendorCode: "MIXED",
        vendorName: "รายการอะไหล่รวม",
        unit: "2",
        packSize: "รายการ",
        deliveryDate: "16/11/2568",
        status: "รออนุมัติ",
        details: {
          requester: "กะกลางคืน (ฝ่ายผลิต)",
          requestDate: "16/11/2568 03:00:00",
          approver: "-",
          approveDate: "-",
          lastEditor: "นายสมชาย ใจดี",
          lastEditDate: "16/11/2568 08:00:00",
          department: "ซ่อมบำรุง (Maintenance)",
          contact: "ทีมซ่อมบำรุง 2",
          vendorInvoice: "REF-MAINT-A02",
        },
        items: [
          {
            "#": 1,
            itemCode: "BEARING-6205",
            itemName: "ตลับลูกปืน 6205-2Z",
            vendorItemCode: "SKF-6205-2Z",
            itemNameVendor: "SKF Bearing 6205-2Z",
            itemNameDetail: "ตลับลูกปืนเม็ดกลมร่องลึก ฝาเหล็ก 2 ข้าง",
            qty: "2",
            unit: "ชิ้น",
            packSize: "1",
            unitPkg: "ชิ้น",
          },
          {
            "#": 2,
            itemCode: "NAIL-3IN",
            itemName: "ตะปู 3 นิ้ว",
            vendorItemCode: "TH-NAIL-200",
            itemNameVendor: "ตะปูยกกล่อง 200 ตัว",
            itemNameDetail: "ใช้ยึดโครงสร้างชั่วคราว",
            qty: "0.5",
            unit: "กล่อง",
            packSize: "200",
            unitPkg: "ตัว",
          },
        ],
      },
      {
        id: "EQM-1007",
        supplier: "J-2568-007 / ขอสำรองตลับลูกปืน (Stock)",
        orderbookId: "WO-2568-11-007",
        orderDate: "20/11/2568",
        vendorCode: "BEARING-6205",
        vendorName: "ตลับลูกปืน 6205-2Z",
        unit: "50",
        packSize: "ชิ้น",
        deliveryDate: "25/11/2568",
        status: "ไม่อนุมัติ",
        details: {
          requester: "นายสมชาย ใจดี",
          requestDate: "20/11/2568 10:00:00",
          approver: "นายวิศิษฐ์ ช่างซ่อม",
          approveDate: "20/11/2568 11:00:00",
          lastEditor: "นายวิศิษฐ์ ช่างซ่อม",
          lastEditDate: "20/11/2568 11:00:00",
          department: "ซ่อมบำรุง (Maintenance)",
          contact: "ทีมซ่อมบำรุง 2",
          vendorInvoice: "REF-MAINT-A05",
        },
        items: [
          {
            "#": 1,
            itemCode: "BEARING-6205",
            itemName: "ตลับลูกปืน 6205-2Z",
            vendorItemCode: "SKF-6205-2Z",
            itemNameVendor: "SKF Bearing 6205-2Z",
            itemNameDetail: "ตลับลูกปืนเม็ดกลมร่องลึก ฝาเหล็ก 2 ข้าง",
            qty: "50",
            unit: "ชิ้น",
            packSize: "1",
            unitPkg: "ชิ้น",
          },
        ],
      },
      {
        id: "EQM-1004",
        supplier: "J-2568-004 / มอเตอร์สายพานเสียงดัง (BD)",
        orderbookId: "WO-2568-11-004",
        orderDate: "18/11/2568",
        vendorCode: "V-BELT-B50",
        vendorName: "สายพาน V-Belt B50",
        unit: "4",
        packSize: "เส้น",
        deliveryDate: "19/11/2568",
        status: "ยกเลิก",
        details: {
          requester: "นายสมชาย ใจดี (ฝ่ายผลิต)",
          requestDate: "18/11/2568 09:00:00",
          approver: "นายวิศิษฐ์ ช่างซ่อม",
          approveDate: "18/11/2568 10:00:00",
          lastEditor: "นายวิศิษฐ์ ช่างซ่อม",
          lastEditDate: "18/11/2568 11:00:00",
          department: "ซ่อมบำรุง (Maintenance)",
          contact: "ทีมซ่อมบำรุง 1",
          vendorInvoice: "REF-MAINT-A03",
        },
        items: [
          {
            "#": 1,
            itemCode: "V-BELT-B50",
            itemName: "สายพาน V-Belt B50",
            vendorItemCode: "MITSUBOSHI-B50",
            itemNameVendor: "สายพาน B50",
            itemNameDetail: "สายพานร่อง B เบอร์ 50",
            qty: "4",
            unit: "เส้น",
            packSize: "1",
            unitPkg: "เส้น",
          },
        ],
      },
    ],
  },
  {
    groupName: "ระบบสาธารณูปโภค (Utility)",
    groupCode: "UTILITY",
    orders: [
      {
        id: "AIR-COMP-01",
        supplier: "J-2568-003 / ตรวจสอบ Air Compressor (PM)",
        orderbookId: "WO-2568-11-003",
        orderDate: "17/11/2568",
        vendorCode: "AIR-FILTER-01",
        vendorName: "ไส้กรองอากาศ Compressor P-01",
        unit: "1",
        packSize: "ชิ้น",
        deliveryDate: "20/11/2568",
        status: "รออนุมัติ",
        details: {
          requester: "นายวิศิษฐ์ ช่างซ่อม",
          requestDate: "17/11/2568 09:00:00",
          approver: "นายสมหวัง ตั้งใจ (ผู้จัดการฝ่ายวิศวกรรม)",
          approveDate: "17/11/2568 10:00:00",
          lastEditor: "นายสมหวัง ตั้งใจ",
          lastEditDate: "17/11/2568 10:00:00",
          department: "ซ่อมบำรุง (Utility)",
          contact: "ทีม Utility",
          vendorInvoice: "REF-MAINT-U01",
        },
        items: [
          {
            "#": 1,
            itemCode: "AIR-FILTER-01",
            itemName: "ไส้กรองอากาศ Compressor P-01",
            vendorItemCode: "ATLAS-FILTER-XYZ",
            itemNameVendor: "Atlas Copco Air Filter XYZ",
            itemNameDetail: "ไส้กรองอากาศสำหรับ Air Compressor Atlas Copco",
            qty: "1",
            unit: "ชิ้น",
            packSize: "1",
            unitPkg: "ชิ้น",
          },
        ],
      },
    ],
  },
];

const initialStockData = [
  {
    itemCode: "NAIL-3IN",
    itemName: "ตะปู 3 นิ้ว (สำหรับงานโครงสร้าง)",
    supplierName: "Thai Steel Fasteners",
    stock: 50,
    unit: "กล่อง",
    packSize: 200,
    unitPkg: "ตัว",
  },
  {
    itemCode: "HYD-OIL-32",
    itemName: "น้ำมันไฮดรอลิก PTT H-32",
    supplierName: "PTT Lubricants",
    stock: 300,
    unit: "ลิตร",
    packSize: 1,
    unitPkg: "ลิตร",
  },
  {
    itemCode: "BEARING-6205",
    itemName: "ตลับลูกปืน 6205-2Z",
    supplierName: "SKF Thailand",
    stock: 150,
    unit: "ชิ้น",
    packSize: 1,
    unitPkg: "ชิ้น",
  },
  {
    itemCode: "SAFETY-GLOV",
    itemName: "ถุงมือหนังกันบาด (ขนาด L)",
    supplierName: "Safety Pro",
    stock: 10,
    unit: "โหล",
    packSize: 12,
    unitPkg: "คู่",
  },
  {
    itemCode: "V-BELT-B50",
    itemName: "สายพาน V-Belt B50",
    supplierName: "Mitsuboshi Belting",
    stock: 80,
    unit: "เส้น",
    packSize: 1,
    unitPkg: "เส้น",
  },
  {
    itemCode: "AIR-FILTER-01",
    itemName: "ไส้กรองอากาศ Compressor P-01",
    supplierName: "Atlas Copco",
    stock: 20,
    unit: "ชิ้น",
    packSize: 1,
    unitPkg: "ชิ้น",
  },
  {
    itemCode: "GREASE-H1",
    itemName: "จาระบีทนความร้อน Food Grade",
    supplierName: "SKF Thailand",
    stock: 20,
    unit: "กระป๋อง",
    packSize: 1,
    unitPkg: "กระป๋อง",
  },
];

// ===============================================
// MAIN PAGE COMPONENT LOGIC
// ===============================================

const allStatusNames = ["รออนุมัติ", "อนุมัติ", "ไม่อนุมัติ", "ยกเลิก"];

export default function Page() {
  const [view, setView] = useState("list");
  const [selectedItem, setSelectedItem] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inventoryData, setInventoryData] = useState(mockOrderData);
  const [stockData, setStockData] = useState(initialStockData);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [tempSelectedStatuses, setTempSelectedStatuses] =
    useState(allStatusNames);
  const [isAllSelected, setIsAllSelected] = useState(true);

  const [collapsedGroups, setCollapsedGroups] = useState(new Set());

  const handleStatusChange = (status, checked) => {
    if (status === "all") {
      setIsAllSelected(checked);
      setTempSelectedStatuses(checked ? allStatusNames : []);
    } else {
      let newStatuses;
      if (checked) {
        newStatuses = [...tempSelectedStatuses, status];
      } else {
        newStatuses = tempSelectedStatuses.filter((s) => s !== status);
      }
      setTempSelectedStatuses(newStatuses);
      setIsAllSelected(newStatuses.length === allStatusNames.length);
    }
  };

  const handleResetDates = () => {
    setTempStartDate("");
    setTempEndDate("");
  };

  const filteredData = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase().trim();
    const noStatusFilter = tempSelectedStatuses.length === 0;
    const noSearchFilter = normalizedSearch === "";
    const noDateFilter = tempStartDate === "" && tempEndDate === "";

    if (noStatusFilter && noSearchFilter && noDateFilter) {
      return inventoryData;
    }

    const newFilteredData = [];
    inventoryData.forEach((group) => {
      const matchingOrders = group.orders.filter((order) => {
        const matchesStatus =
          noStatusFilter || tempSelectedStatuses.includes(order.status);
        const matchesSearch =
          noSearchFilter ||
          (order.id && order.id.toLowerCase().includes(normalizedSearch)) ||
          (order.supplier &&
            order.supplier.toLowerCase().includes(normalizedSearch)) ||
          (order.orderbookId &&
            order.orderbookId.toLowerCase().includes(normalizedSearch)) ||
          (order.vendorName &&
            order.vendorName.toLowerCase().includes(normalizedSearch)) ||
          (group.groupName &&
            group.groupName.toLowerCase().includes(normalizedSearch));
        let matchesDate = true;
        if (!noDateFilter) {
          const orderISO = convertDateToISO(order.orderDate);
          if (!orderISO) {
            matchesDate = false;
          } else {
            if (tempStartDate && orderISO < tempStartDate) {
              matchesDate = false;
            }
            if (tempEndDate && orderISO > tempEndDate) {
              matchesDate = false;
            }
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

  const handleViewDetails = (order) => {
    setSelectedItem(order);
    setView("detail");
  };
  const handleBackToList = () => {
    setSelectedItem(null);
    setView("list");
  };
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

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };
  const handleSaveNewInventory = (newData) => {
    setInventoryData((currentData) => {
      const targetGroupCode = "LINE-A";
      let addedToExistingGroup = false;
      const updatedData = currentData.map((group) => {
        if (group.groupCode === targetGroupCode) {
          addedToExistingGroup = true;
          return { ...group, orders: [newData, ...group.orders] };
        }
        return group;
      });
      if (!addedToExistingGroup) {
        return [
          {
            groupName: "กลุ่มใหม่ (โปรดแก้ไข)",
            groupCode: "NEW-GROUP",
            orders: [newData],
          },
          ...currentData,
        ];
      }
      return updatedData;
    });
  };

  const handleOpenEditModal = (order) => {
    setEditingItem(order);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setEditingItem(null);
    setShowEditModal(false);
  };
  const handleSaveEditInventory = (updatedData) => {
    setInventoryData((currentData) =>
      currentData.map((group) => ({
        ...group,
        orders: group.orders.map((order) =>
          order.orderbookId === updatedData.orderbookId ? updatedData : order
        ),
      }))
    );
    if (selectedItem && selectedItem.orderbookId === updatedData.orderbookId) {
      setSelectedItem(updatedData);
    }
    handleCloseEditModal();
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
    ) {
      return;
    }

    if (orderToDelete.status === "อนุมัติ") {
      orderToDelete.items.forEach((item) => {
        const itemCode = item.itemCode;
        const quantity = parseFloat(item.qty);
        setStockData((prevStockData) =>
          prevStockData.map((stockItem) =>
            stockItem.itemCode === itemCode
              ? { ...stockItem, stock: stockItem.stock + quantity }
              : stockItem
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
      handleBackToList();
    }
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedItem) return;
    let confirmationMessage = "";
    const orderId = selectedItem.orderbookId;
    const orderToUpdate = selectedItem;
    const oldStatus = orderToUpdate.status;

    if (newStatus === "อนุมัติ") {
      confirmationMessage = `คุณแน่ใจหรือไม่ว่าต้องการ "อนุมัติ" ใบเบิก: ${orderId}?\n(Stock จะถูกหักทันที)`;
    } else if (newStatus === "ไม่อนุมัติ") {
      confirmationMessage = `คุณแน่ใจหรือไม่ว่าต้องการ "ไม่อนุมัติ" ใบเบิก: ${orderId}?`;
    } else if (newStatus === "ยกเลิก") {
      const stockAction =
        selectedItem.status === "อนุมัติ"
          ? "Stock จะถูกคืน"
          : "ไม่มีการคืน Stock";
      confirmationMessage = `คุณแน่ใจหรือไม่ว่าต้องการ "ยกเลิก" ใบเบิก: ${orderId}?\n(${stockAction})`;
    }

    if (confirmationMessage && !window.confirm(confirmationMessage)) {
      return;
    }

    orderToUpdate.items.forEach((item) => {
      const itemCode = item.itemCode;
      const quantity = parseFloat(item.qty);
      if (newStatus === "อนุมัติ" && oldStatus !== "อนุมัติ") {
        setStockData((prevStockData) =>
          prevStockData.map((stockItem) =>
            stockItem.itemCode === itemCode
              ? { ...stockItem, stock: stockItem.stock - quantity }
              : stockItem
          )
        );
      } else if (
        (newStatus === "ยกเลิก" || newStatus === "ไม่อนุมัติ") &&
        oldStatus === "อนุมัติ"
      ) {
        setStockData((prevStockData) =>
          prevStockData.map((stockItem) =>
            stockItem.itemCode === itemCode
              ? { ...stockItem, stock: stockItem.stock + quantity }
              : stockItem
          )
        );
      }
    });

    setInventoryData((currentData) =>
      currentData.map((group) => ({
        ...group,
        orders: group.orders.map((order) =>
          order.orderbookId === orderId
            ? {
                ...order,
                status: newStatus,
                details: {
                  ...order.details,
                  approver:
                    newStatus === "อนุมัติ"
                      ? "ผู้ใช้ปัจจุบัน"
                      : order.details.approver,
                  approveDate:
                    newStatus === "อนุมัติ"
                      ? format(new Date(), "dd/MM/yyyy HH:mm:ss")
                      : order.details.approveDate,
                },
              }
            : order
        ),
      }))
    );
    setSelectedItem((prev) => ({
      ...prev,
      status: newStatus,
      details: {
        ...prev.details,
        approver:
          newStatus === "อนุมัติ" ? "ผู้ใช้ปัจจุบัน" : prev.details.approver,
        approveDate:
          newStatus === "อนุมัติ"
            ? format(new Date(), "dd/MM/yyyy HH:mm:ss")
            : prev.details.approveDate,
      },
    }));
  };

  const renderListView = () => (
    <>
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
            <Button
              variant="outline"
              size="icon"
              // FIX: ลบ "mt-6" ออก
              onClick={handleResetDates}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">สถานะ:</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-all"
                checked={isAllSelected}
                onCheckedChange={(checked) =>
                  handleStatusChange("all", checked)
                }
              />
              <label htmlFor="status-all" className="text-sm font-medium">
                สถานะทั้งหมด
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-pending"
                checked={tempSelectedStatuses.includes("รออนุมัติ")}
                onCheckedChange={(checked) =>
                  handleStatusChange("รออนุมัติ", checked)
                }
              />
              <label htmlFor="status-pending" className="text-sm font-medium">
                รออนุมัติ
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-approved"
                checked={tempSelectedStatuses.includes("อนุมัติ")}
                onCheckedChange={(checked) =>
                  handleStatusChange("อนุมัติ", checked)
                }
              />
              <label htmlFor="status-approved" className="text-sm font-medium">
                อนุมัติ
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-rejected"
                checked={tempSelectedStatuses.includes("ไม่อนุมัติ")}
                onCheckedChange={(checked) =>
                  handleStatusChange("ไม่อนุมัติ", checked)
                }
              />
              <label htmlFor="status-rejected" className="text-sm font-medium">
                ไม่อนุมัติ
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-cancelled"
                checked={tempSelectedStatuses.includes("ยกเลิก")}
                onCheckedChange={(checked) =>
                  handleStatusChange("ยกเลิก", checked)
                }
              />
              <label htmlFor="status-cancelled" className="text-sm font-medium">
                ยกเลิก
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="product" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="product">รายการเบิกวัสดุ/อุปกรณ์</TabsTrigger>
            <TabsTrigger value="supplier">คลังวัสดุ (Stock Master)</TabsTrigger>
          </TabsList>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleOpenCreateModal}
          >
            <Plus className="mr-2 h-4 w-4" /> สร้างรายการเบิก
          </Button>
        </div>
        <TabsContent value="product">
          <Card className=" p-0 overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className=" bg-blue-900 hover:bg-blue-900">
                    <TableHead className="text-white w-[150px]">
                      รหัสการเบิก
                    </TableHead>
                    <TableHead className="text-white w-[250px]">
                      JOB ID/JOB TITLE
                    </TableHead>
                    <TableHead className="text-white w-[150px]">
                      เลขที่เอกสาร
                    </TableHead>
                    <TableHead className="text-white w-[120px]">
                      วันที่เบิก
                    </TableHead>
                    <TableHead className="text-white w-[150px]">
                      รหัสอะไหล่หลัก
                    </TableHead>
                    <TableHead className="text-white w-[200px]">
                      ชื่ออะไหล่หลัก
                    </TableHead>
                    <TableHead className="text-white w-[100px]">
                      จำนวนรายการที่เบิก
                    </TableHead>
                    <TableHead className="text-white w-[120px]">
                      วันที่คาดว่าจะได้รับ
                    </TableHead>
                    <TableHead className="text-white w-[100px]">
                      สถานะ
                    </TableHead>
                    <TableHead className="text-white w-[100px]">
                      จัดการ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((group) => {
                      const isCollapsed = collapsedGroups.has(group.groupCode);
                      return (
                        <React.Fragment key={group.groupCode}>
                          <TableRow
                            className="bg-yellow-500 hover:bg-yellow-500 border-none cursor-pointer"
                            onClick={() => handleToggleGroup(group.groupCode)}
                          >
                            <TableCell
                              colSpan={10}
                              className="font-bold text-yellow-800"
                            >
                              <ChevronDown
                                className={cn(
                                  "inline-block mr-2 h-4 w-4 transition-transform",
                                  isCollapsed && "-rotate-90"
                                )}
                              />
                              {group.groupCode} {group.groupName}
                            </TableCell>
                          </TableRow>

                          {!isCollapsed &&
                            group.orders.map((order) => (
                              <TableRow
                                key={order.id + order.orderbookId}
                                className=""
                              >
                                <TableCell
                                  className="font-medium cursor-pointer"
                                  onClick={() => handleViewDetails(order)}
                                >
                                  {order.id}
                                </TableCell>
                                <TableCell
                                  className="cursor-pointer"
                                  onClick={() => handleViewDetails(order)}
                                >
                                  {order.supplier}
                                </TableCell>
                                <TableCell
                                  className="cursor-pointer"
                                  onClick={() => handleViewDetails(order)}
                                >
                                  {order.orderbookId}
                                </TableCell>
                                <TableCell
                                  className="cursor-pointer"
                                  onClick={() => handleViewDetails(order)}
                                >
                                  {order.orderDate}
                                </TableCell>
                                <TableCell
                                  className="cursor-pointer"
                                  onClick={() => handleViewDetails(order)}
                                >
                                  {order.vendorCode}
                                </TableCell>
                                <TableCell
                                  className="cursor-pointer"
                                  onClick={() => handleViewDetails(order)}
                                >
                                  {order.vendorName}
                                </TableCell>
                                <TableCell
                                  className="cursor-pointer font-bold"
                                  onClick={() => handleViewDetails(order)}
                                >
                                  {order.items.length} รายการ
                                </TableCell>
                                <TableCell
                                  className="cursor-pointer"
                                  onClick={() => handleViewDetails(order)}
                                >
                                  {order.deliveryDate}
                                </TableCell>
                                <TableCell
                                  className="cursor-pointer"
                                  onClick={() => handleViewDetails(order)}
                                >
                                  <StatusBadge status={order.status} />
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-yellow-600 hover:text-yellow-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEditModal(order);
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteInventory(order);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center text-muted-foreground h-24"
                      >
                        ไม่พบข้อมูลที่ตรงกับตัวกรอง
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="supplier">
          <Card className="mt-4  p-0 overflow-hidden">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                รายการวัสดุคงคลัง (Master Stock)
              </h3>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="">
                    <TableHead>รหัสอะไหล่</TableHead>
                    <TableHead>ชื่ออะไหล่</TableHead>
                    <TableHead>ผู้จำหน่าย</TableHead>

                    <TableHead>หน่วยสั่ง</TableHead>
                    <TableHead>ขนาดบรรจุ (หน่วยย่อย)</TableHead>
                    <TableHead>Stock คงเหลือ (หน่วยสั่ง)</TableHead>
                    <TableHead>Stock คงเหลือรวม (หน่วยย่อย)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockData.map((item) => {
                    const totalStockInUnitPkg =
                      item.stock * parseFloat(item.packSize);
                    return (
                      <TableRow key={item.itemCode}>
                        <TableCell className="font-medium">
                          {item.itemCode}
                        </TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.supplierName}</TableCell>

                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          {item.packSize} {item.unitPkg}
                        </TableCell>
                        <TableCell className="font-bold text-blue-700">
                          {item.stock}
                        </TableCell>

                        {/* ** แก้ไข: ใช้สีน้ำเงินเข้ม (text-blue-700) และแสดงเฉพาะตัวเลข ** */}
                        <TableCell className="font-bold text-blue-700">
                          {totalStockInUnitPkg}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderDetailView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            เลขที่เอกสาร {selectedItem?.orderbookId} ({selectedItem?.id})
          </h2>
          <p className="text-lg text-muted-foreground">
            {selectedItem?.supplier}
          </p>
        </div>
        <StatusBadge status={selectedItem?.status} />
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
              <label className="text-sm font-medium">JOB ID/JOB TITLE</label>
              <Input disabled value={selectedItem?.supplier || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">ผู้รับผิดชอบ</label>
              <Input disabled value={selectedItem?.details?.contact || ""} />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">เลขที่เอกสาร</label>
              <Input disabled value={selectedItem?.orderbookId || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">แผนก</label>
              <Input disabled value={selectedItem?.details?.department || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">รหัสอ้างอิง</label>
              <Input
                disabled
                value={selectedItem?.details?.vendorInvoice || ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">ผู้แจ้งซ่อม</label>
              <Input disabled value={selectedItem?.details?.requester || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">วันที่แจ้งซ่อม</label>
              <Input
                disabled
                value={selectedItem?.details?.requestDate || ""}
              />
            </div>
            <div>
              <label className="text-sm font-medium">ผู้อนุมัติ</label>
              <Input disabled value={selectedItem?.details?.approver || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">วันที่อนุมัติ</label>
              <Input
                disabled
                value={selectedItem?.details?.approveDate || ""}
              />
            </div>
            <div>
              <label className="text-sm font-medium">ผู้แก้ไขล่าสุด</label>
              <Input disabled value={selectedItem?.details?.lastEditor || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">วันที่แก้ไข</label>
              <Input
                disabled
                value={selectedItem?.details?.lastEditDate || ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-green-700">
          <h3 className="text-lg font-semibold text-white">
            รายละเอียดอะไหล่/วัสดุ
          </h3>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-100">
                <TableHead>#</TableHead>
                <TableHead>รหัสอะไหล่</TableHead>
                <TableHead>ชื่ออะไหล่</TableHead>
                <TableHead>รหัสอะไหล่ (ผู้จำหน่าย)</TableHead>
                {/* ** เพิ่มชื่อทางการค้า ** */}
                <TableHead>ชื่อทางการค้า</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead>จำนวนสั่ง</TableHead>
                <TableHead>หน่วยสั่ง</TableHead>
                <TableHead>ขนาดบรรจุ</TableHead>
                <TableHead>หน่วยบรรจุ</TableHead>
                <TableHead>Stock คงเหลือ (หน่วยย่อย)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedItem?.items.map((item) => {
                const stockItem = stockData.find(
                  (s) => s.itemCode === item.itemCode
                );
                const totalStockInUnitPkg = stockItem
                  ? stockItem.stock * parseFloat(stockItem.packSize)
                  : null;
                const currentStockDisplay = stockItem
                  ? `${totalStockInUnitPkg} ${stockItem.unitPkg}`
                  : "N/A";
                return (
                  <TableRow key={item["#"]}>
                    <TableCell>{item["#"]}</TableCell>
                    <TableCell>{item.itemCode}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.vendorItemCode}</TableCell>
                    {/* ** แสดงผลชื่อทางการค้า ** */}
                    <TableCell>{item.itemNameVendor}</TableCell>
                    <TableCell>{item.itemNameDetail}</TableCell>
                    <TableCell className="font-bold text-red-700">
                      {item.qty}
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.packSize}</TableCell>
                    <TableCell>{item.unitPkg}</TableCell>
                    <TableCell className="font-medium text-blue-600">
                      {currentStockDisplay}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          className="bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200"
          onClick={handleBackToList}
        >
          ย้อนกลับ
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-yellow-600 border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700"
            onClick={() => handleOpenEditModal(selectedItem)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            แก้ไข
          </Button>
          {selectedItem?.status === "รออนุมัติ" && (
            <>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleUpdateStatus("อนุมัติ")}
              >
                อนุมัติ
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleUpdateStatus("ไม่อนุมัติ")}
              >
                ไม่อนุมัติ
              </Button>
            </>
          )}
          {selectedItem?.status !== "ยกเลิก" && (
            <Button
              variant="outline"
              className="text-gray-600 border-gray-500 hover:bg-gray-100"
              onClick={() => handleUpdateStatus("ยกเลิก")}
            >
              ยกเลิกใบเบิก
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <main className=" min-h-screen">
      <SiteHeader title="Inventory" />
      <section className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Inventory</h1>
            <p className="text-muted-foreground">Manage all</p>
          </div>
        </div>

        {view === "list" ? renderListView() : renderDetailView()}
      </section>

      {showCreateModal && (
        <CreateInventoryModal
          onClose={handleCloseCreateModal}
          onSubmit={handleSaveNewInventory}
          stockData={stockData}
          findStockInfo={findStockInfo}
        />
      )}
      {showEditModal && editingItem && (
        <EditInventoryModal
          onClose={handleCloseEditModal}
          onSubmit={handleSaveEditInventory}
          inventoryData={editingItem}
          stockData={stockData}
          findStockInfo={findStockInfo}
        />
      )}
    </main>
  );
}
