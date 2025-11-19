"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
  FileText,
  X,
  Trash2,
  PackagePlus,
  Save,
  Pencil,
  Search,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ManageStockModal from "./ManageStockModal";
import { SiteHeader } from "@/components/site-header";
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

const allStatusNames = ["รออนุมัติ", "อนุมัติ", "ไม่อนุมัติ", "ยกเลิก"];

export default function Page() {
  const [view, setView] = useState("list");
  const [selectedItem, setSelectedItem] = useState(null);

  const [detailSearchQuery, setDetailSearchQuery] = useState("");
  const [detailFilterType, setDetailFilterType] = useState("all");

  const [inventoryData, setInventoryData] = useState(() => {
      const modifiedData = JSON.parse(JSON.stringify(mockOrderData));
      modifiedData.forEach(group => {
          group.orders.forEach(order => {
              if (order.id === "EQM-1002") {
                  for (let i = 1; i <= 15; i++) { 
                      order.items.push({ 
                          "#": 2 + i, 
                          itemCode: `TEST-ITEM-${i}`, 
                          itemName: `รายการทดสอบการเลื่อน ${i}`, 
                          qty: 5, 
                          unit: "ชิ้น", 
                          itemType: "Non-Returnable",
                          requestQty: 5
                      });
                  }
              }
          });
      });
      return modifiedData;
  });

  const [stockData, setStockData] = useState(initialStockData);
  const [showManageStockModal, setShowManageStockModal] = useState(false);
  const [editingStockItem, setEditingStockItem] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState(allStatusNames);
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUnit, setSelectedUnit] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
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
        const matchesStatus = noStatusFilter || tempSelectedStatuses.includes(order.status);
        const matchesSearch = noSearchFilter ||
          (order.id && order.id.toLowerCase().includes(normalizedSearch)) ||
          (order.supplier && order.supplier.toLowerCase().includes(normalizedSearch)) ||
          (order.orderbookId && order.orderbookId.toLowerCase().includes(normalizedSearch));
        
        let matchesDate = true;
        if (!noDateFilter) {
          const [d, m, y] = order.orderDate.split('/');
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
  }, [inventoryData, tempSelectedStatuses, searchQuery, tempStartDate, tempEndDate]);

  const stockCategories = useMemo(() => ["all", ...new Set(stockData.map((item) => item.category))], [stockData]);
  const stockUnits = useMemo(() => ["all", ...new Set(stockData.map((item) => item.unit))], [stockData]);
  const stockTypes = useMemo(() => ["all", ...new Set(stockData.map((item) => item.itemType))], [stockData]);

  const filteredStockData = useMemo(() => {
    return stockData.filter((item) => {
      const normalizedQuery = stockSearchQuery.toLowerCase();
      const matchesSearch = item.itemName.toLowerCase().includes(normalizedQuery) || item.itemCode.toLowerCase().includes(normalizedQuery);
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesUnit = selectedUnit === "all" || item.unit === selectedUnit;
      const matchesType = selectedType === "all" || item.itemType === selectedType;
      return matchesSearch && matchesCategory && matchesUnit && matchesType;
    });
  }, [stockData, stockSearchQuery, selectedCategory, selectedUnit, selectedType]);

  const handleViewDetails = (order) => {
    const orderClone = JSON.parse(JSON.stringify(order));
    orderClone.items = orderClone.items.map(item => ({
        ...item,
        requestQty: item.requestQty || item.qty
    }));
    setSelectedItem(orderClone);
    setDetailSearchQuery("");
    setDetailFilterType("all");
    setView("detail");
  };

  const handleBackToList = () => {
    setSelectedItem(null);
    setView("list");
  };

  const handleToggleGroup = (groupCode) => {
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupCode)) newSet.delete(groupCode);
      else newSet.add(groupCode);
      return newSet;
    });
  };

  const handleOpenCreateStock = () => { setEditingStockItem(null); setShowManageStockModal(true); };
  const handleOpenEditStock = (item) => { setEditingStockItem(item); setShowManageStockModal(true); };

  const handleSaveStockItem = (itemData, isEditMode) => {
    if (isEditMode) {
      setStockData((prev) => prev.map((item) => item.itemCode === itemData.itemCode ? itemData : item));
    } else {
      if (stockData.some((s) => s.itemCode === itemData.itemCode)) {
        alert("รหัสอะไหล่นี้มีอยู่แล้วในระบบ กรุณาใช้รหัสอื่น");
        return;
      }
      setStockData([itemData, ...stockData]);
    }
    setShowManageStockModal(false);
  };

  const handleDeleteStockItem = (itemCode) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า: ${itemCode}?`)) {
      setStockData((prev) => prev.filter((item) => item.itemCode !== itemCode));
    }
  };

  const handleDeleteInventory = (orderToDelete) => {
    const stockAction = orderToDelete.status === "อนุมัติ" ? "(Stock จะถูกคืน)" : "(ไม่มีการคืน Stock)";
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ: ${orderToDelete.orderbookId}?\n${stockAction}`)) return;

    if (orderToDelete.status === "อนุมัติ") {
      orderToDelete.items.forEach((item) => {
        const itemCode = item.itemCode;
        const quantity = parseFloat(item.qty);
        setStockData((prev) => prev.map((s) => s.itemCode === itemCode ? { ...s, stock: s.stock + quantity } : s));
      });
    }

    setInventoryData((currentData) =>
      currentData.map((group) => ({
        ...group,
        orders: group.orders.filter((order) => order.orderbookId !== orderToDelete.orderbookId),
      })).filter((group) => group.orders.length > 0)
    );

    if (selectedItem && selectedItem.orderbookId === orderToDelete.orderbookId) handleBackToList();
  };

  const handleSaveChanges = () => {
      if(!selectedItem) return;
      if(!window.confirm("ยืนยันการบันทึกการเปลี่ยนแปลง?")) return;

      setInventoryData((currentData) =>
        currentData.map((group) => ({
          ...group,
          orders: group.orders.map((order) => order.orderbookId === selectedItem.orderbookId ? selectedItem : order),
        }))
      );
      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
  }

  const handleUpdateStatus = (newStatus) => {
    if (!selectedItem) return;
    const orderId = selectedItem.orderbookId;
    const orderToUpdate = { ...selectedItem };
    const oldStatus = orderToUpdate.status;
    let reason = null;

    if (newStatus === "อนุมัติ") {
      if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการ "อนุมัติ" ใบเบิก: ${orderId}?\n(Stock จะถูกหักตามยอดเบิกทันที)`)) return;
    } else if (newStatus === "ไม่อนุมัติ") {
      reason = window.prompt(`โปรดระบุเหตุผลที่ "ไม่อนุมัติ" ใบเบิก: ${orderId}`);
      if (reason === null || reason.trim() === "") return alert("กรุณาระบุเหตุผล");
    } else if (newStatus === "ยกเลิก") {
      reason = window.prompt(`โปรดระบุเหตุผลที่ "ยกเลิก" ใบเบิก: ${orderId}?`);
      if (reason === null || reason.trim() === "") return alert("กรุณาระบุเหตุผล");
    }

    orderToUpdate.items.forEach((item) => {
      const itemCode = item.itemCode;
      const quantity = parseFloat(item.qty);
      if (newStatus === "อนุมัติ" && oldStatus !== "อนุมัติ") {
        setStockData((prev) => prev.map((s) => s.itemCode === itemCode ? { ...s, stock: s.stock - quantity } : s));
      } else if ((newStatus === "ยกเลิก" || newStatus === "ไม่อนุมัติ") && oldStatus === "อนุมัติ") {
        setStockData((prev) => prev.map((s) => s.itemCode === itemCode ? { ...s, stock: s.stock + quantity } : s));
      }
    });

    const updatedOrder = {
        ...orderToUpdate,
        status: newStatus,
        details: {
          ...orderToUpdate.details,
          approver: newStatus === "อนุมัติ" ? "ผู้ใช้ปัจจุบัน" : orderToUpdate.details.approver,
          approveDate: newStatus === "อนุมัติ" ? format(new Date(), "dd/MM/yyyy HH:mm:ss") : orderToUpdate.details.approveDate,
          rejectionReason: reason || orderToUpdate.details.rejectionReason,
        },
      };

    setInventoryData((currentData) =>
      currentData.map((group) => ({
        ...group,
        orders: group.orders.map((order) => order.orderbookId === orderId ? updatedOrder : order),
      }))
    );
    setSelectedItem(updatedOrder);
  };

  const handleDetailChange = (field, value, isNested = false) => {
    setSelectedItem((prev) => {
        if (isNested) return { ...prev, details: { ...prev.details, [field]: value } };
        return { ...prev, [field]: value };
    });
  };

  const handleItemChange = (index, field, value) => {
      setSelectedItem(prev => {
          const newItems = [...prev.items];
          newItems[index] = { ...newItems[index], [field]: value };
          return { ...prev, items: newItems };
      });
  }

  const renderListView = () => (
    <>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-end gap-4">
             <Input placeholder="ค้นหา รหัสการเบิก, JOB, เลขที่เอกสาร..." className="w-full md:w-[250px]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <div className="w-full md:w-[200px]">
              <label className="text-sm font-medium">วันที่เริ่มต้น</label>
              <DatePicker placeholder="เลือกวันที่" value={tempStartDate} onChange={setTempStartDate} />
            </div>
            <div className="w-full md:w-[200px]">
              <label className="text-sm font-medium">วันที่สิ้นสุด</label>
              <DatePicker placeholder="เลือกวันที่" value={tempEndDate} onChange={setTempEndDate} />
            </div>
            <Button variant="outline" size="icon" onClick={handleResetDates}><X className="h-4 w-4" /></Button>
          </div>
           <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2"><label className="text-sm font-medium">สถานะ:</label></div>
            <div className="flex items-center space-x-2">
              <Checkbox id="status-all" checked={isAllSelected} onCheckedChange={(c) => handleStatusChange("all", c)} />
              <label htmlFor="status-all" className="text-sm font-medium">ทั้งหมด</label>
            </div>
             {allStatusNames.map(status => (
                 <div key={status} className="flex items-center space-x-2">
                    <Checkbox id={`status-${status}`} checked={tempSelectedStatuses.includes(status)} onCheckedChange={(c) => handleStatusChange(status, c)} />
                    <label htmlFor={`status-${status}`} className="text-sm font-medium">{status}</label>
                 </div>
             ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="product" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="product">รายการเบิกวัสดุ/อุปกรณ์</TabsTrigger>
            <TabsTrigger value="supplier">คลังวัสดุ (Stock Master)</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="product">
          <Card className=" p-0 overflow-hidden mt-4">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar relative">
              <Table className="min-w-full border-collapse">
                <TableHeader className="sticky top-0 z-50 bg-blue-900 shadow-md">
                  <TableRow className="bg-blue-900 hover:bg-blue-900 border-b border-blue-800">
                    <TableHead className="text-white font-semibold w-[150px]">รหัสการเบิก</TableHead>
                    <TableHead className="text-white font-semibold w-[250px]">JOB ID/JOB TITLE</TableHead>
                    <TableHead className="text-white font-semibold w-[150px]">เลขที่เอกสาร</TableHead>
                    <TableHead className="text-white font-semibold w-[120px]">วันที่เบิก</TableHead>
                    <TableHead className="text-white font-semibold w-[150px]">รหัสอะไหล่หลัก</TableHead>
                    <TableHead className="text-white font-semibold w-[200px]">ชื่ออะไหล่หลัก</TableHead>
                    <TableHead className="text-white font-semibold w-[100px]">จำนวนรายการ</TableHead>
                    <TableHead className="text-white font-semibold w-[120px]">คาดว่าจะได้รับ</TableHead>
                    <TableHead className="text-white font-semibold w-[100px]">สถานะ</TableHead>
                    <TableHead className="text-white font-semibold w-[100px]">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((group) => {
                      const isCollapsed = collapsedGroups.has(group.groupCode);
                      return (
                        <React.Fragment key={group.groupCode}>
                          <TableRow className="bg-yellow-500 hover:bg-yellow-500 border-none cursor-pointer" onClick={() => handleToggleGroup(group.groupCode)}>
                             <TableCell colSpan={10} className="font-bold text-yellow-800">
                              <ChevronDown className={cn("inline-block mr-2 h-4 w-4 transition-transform", isCollapsed && "-rotate-90")} />
                              {group.groupCode} {group.groupName}
                            </TableCell>
                          </TableRow>
                          {!isCollapsed && group.orders.map((order) => (
                              <TableRow key={order.id + order.orderbookId}>
                                <TableCell onClick={() => handleViewDetails(order)} className="cursor-pointer">{order.id}</TableCell>
                                <TableCell onClick={() => handleViewDetails(order)} className="cursor-pointer">{order.supplier}</TableCell>
                                <TableCell onClick={() => handleViewDetails(order)} className="cursor-pointer">{order.orderbookId}</TableCell>
                                <TableCell onClick={() => handleViewDetails(order)} className="cursor-pointer">{order.orderDate}</TableCell>
                                <TableCell onClick={() => handleViewDetails(order)} className="cursor-pointer">{order.vendorCode}</TableCell>
                                <TableCell onClick={() => handleViewDetails(order)} className="cursor-pointer">{order.vendorName}</TableCell>
                                <TableCell onClick={() => handleViewDetails(order)} className="cursor-pointer font-bold">{order.items.length} รายการ</TableCell>
                                <TableCell onClick={() => handleViewDetails(order)} className="cursor-pointer">{order.deliveryDate || "-"}</TableCell>
                                <TableCell onClick={() => handleViewDetails(order)} className="cursor-pointer"><StatusBadge status={order.status} /></TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700" onClick={(e) => { e.stopPropagation(); handleViewDetails(order); }}>
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={(e) => { e.stopPropagation(); handleDeleteInventory(order); }}>
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
                    <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground h-24">ไม่พบข้อมูลที่ตรงกับตัวกรอง</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="supplier">
           <Card className="mt-4 p-0 overflow-hidden border">
            <div className="sticky top-0 z-30 bg-background border-b shadow-sm">
                <CardHeader>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">รายการวัสดุคงคลัง (Master Stock)</h3>
                    <Button onClick={handleOpenCreateStock}><PackagePlus className="mr-2 h-4 w-4" /> เพิ่มของใหม่เข้าคลัง</Button>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                    <Input placeholder="ค้นหารหัส หรือ ชื่ออะไหล่..." className="w-full md:w-[250px]" value={stockSearchQuery} onChange={(e) => setStockSearchQuery(e.target.value)} />
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="เลือกประเภท" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">ทุกประเภท</SelectItem>
                            {stockTypes.filter(t => t !== "all").map(type => (<SelectItem key={type} value={type}>{type === "Returnable" ? "อุปกรณ์ (ต้องคืน)" : "วัสดุ (เบิกเลย)"}</SelectItem>))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="เลือกหมวดหมู่" /></SelectTrigger>
                        <SelectContent>{stockCategories.map((c) => (<SelectItem key={c} value={c}>{c === "all" ? "ทุกหมวดหมู่" : c}</SelectItem>))}</SelectContent>
                    </Select>
                    <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                        <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="เลือกหน่วย" /></SelectTrigger>
                        <SelectContent>{stockUnits.map((u) => (<SelectItem key={u} value={u}>{u === "all" ? "ทุกหน่วย" : u}</SelectItem>))}</SelectContent>
                    </Select>
                </div>
                </CardHeader>
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[65vh] overflow-y-auto custom-scrollbar relative">
                 <Table className="min-w-full border-collapse">
                  <TableHeader className="sticky top-0 z-20 bg-gray-100 dark:bg-slate-800 shadow-sm">
                    <TableRow className="border-b border-gray-200 dark:border-gray-700">
                      <TableHead className="font-semibold">รหัสอะไหล่</TableHead>
                      <TableHead className="font-semibold">ชื่ออะไหล่</TableHead>
                      <TableHead className="font-semibold">ประเภท</TableHead>
                      <TableHead className="font-semibold">หมวดหมู่</TableHead>
                      <TableHead className="font-semibold">ผู้จำหน่าย</TableHead>
                      <TableHead className="font-semibold">หน่วยสั่ง</TableHead>
                      <TableHead className="font-semibold">ขนาดบรรจุ (หน่วยย่อย)</TableHead>
                      <TableHead className="font-semibold">Stock คงเหลือ (หน่วยสั่ง)</TableHead>
                      <TableHead className="font-semibold">Stock คงเหลือรวม (หน่วยย่อย)</TableHead>
                      <TableHead className="font-semibold">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStockData.map((item) => {
                        const totalStock = item.stock * parseFloat(item.packSize);
                        return (
                        <TableRow key={item.itemCode}>
                             <TableCell className="font-medium">{item.itemCode}</TableCell>
                             <TableCell>{item.itemName}</TableCell>
                             <TableCell>{item.itemType === "Returnable" ? <Badge variant="outline" className="text-blue-600 border-blue-400">อุปกรณ์ (ต้องคืน)</Badge> : <Badge variant="secondary">วัสดุ (เบิกเลย)</Badge>}</TableCell>
                             <TableCell>{item.category}</TableCell>
                             <TableCell>{item.supplierName}</TableCell>
                             <TableCell>{item.unit}</TableCell>
                             <TableCell>{item.packSize} {item.unitPkg}</TableCell>
                             <TableCell className="font-bold text-blue-700">{item.stock}</TableCell>
                             <TableCell className="font-bold text-blue-700">{totalStock}</TableCell>
                             <TableCell>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenEditStock(item)} className="text-yellow-600 hover:text-yellow-700"><Pencil className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteStockItem(item.itemCode)} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                             </TableCell>
                        </TableRow>
                        )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderDetailView = () => {
    const filteredDetailItems = selectedItem?.items.filter(item => {
        const matchesSearch = detailSearchQuery === "" || 
                              item.itemCode.toLowerCase().includes(detailSearchQuery.toLowerCase()) || 
                              item.itemName.toLowerCase().includes(detailSearchQuery.toLowerCase());
        const stockItem = stockData.find(s => s.itemCode === item.itemCode);
        const itemType = item.itemType || (stockItem ? stockItem.itemType : "Non-Returnable");
        const matchesType = detailFilterType === "all" || itemType === detailFilterType;
        return matchesSearch && matchesType;
    });

    return (
    <div className="space-y-4">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">เลขที่เอกสาร {selectedItem?.orderbookId} ({selectedItem?.id})</h2>
          <p className="text-lg text-muted-foreground">{selectedItem?.supplier}</p>
        </div>
        <StatusBadge status={selectedItem?.status} />
      </div>

      <Card>
        <CardHeader><h3 className="text-lg font-semibold">รายละเอียด</h3></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-2">
                <div><label className="text-sm font-medium">รหัสการเบิก</label><Input disabled value={selectedItem?.id || ""} /></div>
                <div><label className="text-sm font-medium">JOB ID/JOB TITLE (User)</label><Input disabled value={selectedItem?.supplier || ""} /></div>
                <div><label className="text-sm font-medium">ผู้รับผิดชอบ (User)</label><Input disabled value={selectedItem?.details?.contact || ""} /></div>
            </div>
             <div className="space-y-2">
                <div><label className="text-sm font-medium">เลขที่เอกสาร</label><Input disabled value={selectedItem?.orderbookId || ""} /></div>
                <div><label className="text-sm font-medium">แผนก (User)</label><Input disabled value={selectedItem?.details?.department || ""} /></div>
                 <div>
                    <label className="text-sm font-medium text-blue-600">รหัสอ้างอิง (แก้ไขได้)</label>
                    <Input value={selectedItem?.details?.vendorInvoice || ""} onChange={(e) => handleDetailChange("vendorInvoice", e.target.value, true)} />
                </div>
                <div>
                    <label className="text-sm font-medium text-blue-600">วันที่คาดว่าจะได้รับ (แก้ไขได้)</label>
                    <Input type="date" value={selectedItem?.deliveryDate || ""} onChange={(e) => handleDetailChange("deliveryDate", e.target.value)} />
                </div>
            </div>
            <div className="space-y-2">
                 <div><label className="text-sm font-medium">ผู้ขอเบิก (User)</label><Input disabled value={selectedItem?.details?.requester || ""} /></div>
                 <div><label className="text-sm font-medium">วันที่ขอเบิก (System)</label><Input disabled value={selectedItem?.details?.requestDate || ""} /></div>
                <div><label className="text-sm font-medium">ผู้อนุมัติ (System)</label><Input disabled placeholder="ระบบจะบันทึกอัตโนมัติ" value={selectedItem?.details?.approver || ""} /></div>
                 <div><label className="text-sm font-medium">วันที่อนุมัติ (System)</label><Input disabled placeholder="ระบบจะบันทึกอัตโนมัติ" value={selectedItem?.details?.approveDate || ""} /></div>
            </div>
        </CardContent>
        <div className="p-4 border-t flex justify-end">
             <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveChanges}>
                 <Save className="mr-2 h-4 w-4" /> บันทึกการแก้ไข
             </Button>
        </div>
      </Card>

      <Card className="overflow-hidden border">
        {/* ✅ Sticky Green Header Container */}
        <div className="sticky top-0 z-30 shadow-md">
            <CardHeader className="bg-emerald-600 text-white space-y-4 p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                    <PackagePlus className="h-5 w-5" /> 
                    รายละเอียดอะไหล่/วัสดุ ({selectedItem?.items.length})
                    </h3>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-[250px]">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                            <Input 
                                placeholder="ค้นหาอะไหล่ในใบเบิก..." 
                                className="pl-8 !bg-white !text-black !placeholder-gray-500 border-none h-9 ring-offset-transparent focus-visible:ring-0"
                                value={detailSearchQuery}
                                onChange={(e) => setDetailSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={detailFilterType} onValueChange={setDetailFilterType}>
                            <SelectTrigger className="w-[150px] !bg-white !text-black border-none h-9 ring-offset-transparent focus:ring-0">
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
            
            {/* ✅ Sticky Table Header (Black) */}
            <div className="bg-gray-900">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="hover:bg-gray-900 border-none">
                            <TableHead className="text-white w-[50px]">#</TableHead>
                            <TableHead className="text-white w-[150px]">รหัสอะไหล่</TableHead>
                            <TableHead className="text-white w-[200px]">ชื่ออะไหล่</TableHead>
                            <TableHead className="text-white w-[100px]">ประเภท</TableHead>
                            <TableHead className="text-white w-[100px]">Stock คงเหลือ</TableHead>
                            <TableHead className="text-white w-[120px]">จำนวนที่เบิก</TableHead>
                            <TableHead className="text-white w-[100px]">หน่วยสั่ง</TableHead>
                            <TableHead className="text-white w-[180px]">กำหนดคืน (แก้ไขได้)</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>
        </div>
        
        <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[350px] overflow-y-auto custom-scrollbar">
            <Table>
                <TableBody>
                    {filteredDetailItems.map((item, index) => {
                        const stockItem = stockData.find(s => s.itemCode === item.itemCode);
                        const currentStock = stockItem ? stockItem.stock : '-';
                        const itemType = item.itemType || (stockItem ? stockItem.itemType : null);
                        const packSize = stockItem ? stockItem.packSize : '';
                        const unitPkg = stockItem ? stockItem.unitPkg : '';

                        return (
                        <TableRow key={index}>
                             <TableCell className="w-[50px]">{item["#"]}</TableCell>
                             <TableCell className="w-[150px]">{item.itemCode}</TableCell>
                             <TableCell className="w-[200px]">{item.itemName}</TableCell>
                             <TableCell className="w-[100px]">
                                {itemType === "Returnable" ? (
                                    <Badge variant="outline" className="text-blue-600 border-blue-400 text-xs">อุปกรณ์ (คืน)</Badge>
                                ) : (
                                    <Badge variant="secondary" className="text-xs">วัสดุ</Badge>
                                )}
                             </TableCell>
                             <TableCell className="w-[100px] font-bold text-blue-600">{currentStock}</TableCell>
                             <TableCell className="w-[120px] font-bold text-red-700 text-lg">
                                 {item.qty}
                             </TableCell>
                             <TableCell className="w-[100px]">
                                <div>{item.unit}</div>
                                {packSize && unitPkg && (
                                    <div className="text-xs text-muted-foreground">
                                        (1 {item.unit} = {packSize} {unitPkg})
                                    </div>
                                )}
                             </TableCell>
                             <TableCell className="w-[180px]">
                                  {itemType === "Returnable" ? (
                                    <Input 
                                        type="date" 
                                        className="w-36 h-8" 
                                        value={item.returnDate || ""}
                                        onChange={(e) => handleItemChange(index, 'returnDate', e.target.value)}
                                    />
                                  ) : (
                                    <span className="text-gray-400 ml-4">-</span>
                                  )}
                             </TableCell>
                        </TableRow>
                        );
                    })}
                    {filteredDetailItems.length === 0 && (
                         <TableRow><TableCell colSpan={8} className="text-center h-24 text-muted-foreground">ไม่พบรายการที่ค้นหา</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-4">
        <Button variant="outline" className="bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200" onClick={handleBackToList}>ย้อนกลับ</Button>
        <div className="flex gap-2">
           {selectedItem?.status === "รออนุมัติ" && (
           <>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus("อนุมัติ")}>อนุมัติ</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleUpdateStatus("ไม่อนุมัติ")}>ไม่อนุมัติ</Button>
           </>
           )}
            {selectedItem?.status !== "ยกเลิก" && (
                 <Button variant="outline" className="text-gray-600 border-gray-500 hover:bg-gray-100" onClick={() => handleUpdateStatus("ยกเลิก")}>ยกเลิกใบเบิก</Button>
            )}
        </div>
      </div>
    </div>
  );
  }

  return (
    <main className=" min-h-screen">
      <SiteHeader title="Inventory Management" />
      <section className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Inventory</h1>
            <p className="text-muted-foreground">Manage all requests and stock</p>
          </div>
        </div>

        {view === "list" ? renderListView() : renderDetailView()}
      </section>

      {showManageStockModal && (
        <ManageStockModal
          onClose={() => setShowManageStockModal(false)}
          onSubmit={handleSaveStockItem}
          initialData={editingStockItem}
        />
      )}
    </main>
  );
}