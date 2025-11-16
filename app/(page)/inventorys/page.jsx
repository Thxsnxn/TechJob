"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Eye,
  ChevronDown,
  Search,
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
// import { SiteHeader } from "@/components/site-header";


// --- START: `cn` Utility Function ---
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
// --- END: `cn` Utility Function ---


// --- START: SiteHeader Mock ---
const SiteHeader = ({ title }) => {
  return (
    <header className="hidden">
      <h1>{title}</h1>
    </header>
  );
};
// --- END: SiteHeader Mock ---


// --- START: Date Picker Component ---
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
            "w-full justify-start text-left font-normal bg-white",
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
// --- END: Date Picker Component ---

// --- START: Date Conversion Helper ---
const convertDateToISO = (buddhistDate) => {
  if (!buddhistDate || buddhistDate.length !== 10) return null;
  try {
    const [day, month, year] = buddhistDate.split('/');
    const gregorianYear = parseInt(year) - 543;
    return `${gregorianYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } catch (e) {
    return null;
  }
};
// --- END: Date Conversion Helper ---


// --- 💥 MOCK DATA (อัปเดตข้อมูลและเพิ่มสถานะ "ยกเลิก") 💥 ---
const mockOrderData = [
  {
    groupName: "สายการผลิต A (Production Line A)",
    groupCode: "LINE-A",
    orders: [
      {
        id: "EQM-1001", // เลขอุปกรณ์
        supplier: "J-2568-001 / ตรวจสอบระบบไฮดรอลิก (PM)", // JOBID/JOB TITLE
        orderbookId: "WO-2568-11-001",
        orderDate: "15/11/2568", // วันที่เบิก
        vendorCode: "HYD-OIL-32", // รหัสอะไหล่
        vendorName: "น้ำมันไฮดรอลิก PTT H-32", // อุปกรณ์ที่เบิก
        unit: "200", // จำนวน
        packSize: "ลิตร", // หน่วยนับ
        totalQty: "200",
        deliveryDate: "16/11/2568",
        status: "อนุมัติ",
        details: {
          requester: "นายสมชาย ใจดี (ฝ่ายผลิต)",
          requestDate: "14/11/2568 10:30:00",
          approver: "นายวิศิษฐ์ ช่างซ่อม (หัวหน้าซ่อมบำรุง)",
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
        id: "EQM-1002", // เลขอุปกรณ์
        supplier: "J-2568-002 / ซ่อมมอเตอร์ขับเคลื่อน (CM)", // JOBID/JOB TITLE
        orderbookId: "WO-2568-11-002",
        orderDate: "16/11/2568", // วันที่เบิก
        vendorCode: "BEARING-6205", // รหัสอะไหล่
        vendorName: "ตลับลูกปืน 6205-2Z", // อุปกรณ์ที่เบิก
        unit: "2", // จำนวน
        packSize: "ชิ้น", // หน่วยนับ
        totalQty: "2",
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
        ],
      },
      {
        id: "EQM-1001", // เลขอุปกรณ์
        supplier: "J-2568-004 / มอเตอร์สายพานเสียงดัง (BD)", // JOBID/JOB TITLE
        orderbookId: "WO-2568-11-004",
        orderDate: "18/11/2568", // วันที่เบิก
        vendorCode: "V-BELT-B50", // รหัสอะไหล่
        vendorName: "สายพาน V-Belt B50", // อุปกรณ์ที่เบิก
        unit: "4", // จำนวน
        packSize: "เส้น", // หน่วยนับ
        totalQty: "4",
        deliveryDate: "19/11/2568",
        status: "ยกเลิก", // <-- เพิ่มสถานะ "ยกเลิก"
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
        id: "AIR-COMP-01", // เลขอุปกรณ์
        supplier: "J-2568-003 / ตรวจสอบ Air Compressor (PM)", // JOBID/JOB TITLE
        orderbookId: "WO-2568-11-003",
        orderDate: "17/11/2568", // วันที่เบิก
        vendorCode: "AIR-FILTER-01", // รหัสอะไหล่
        vendorName: "ไส้กรองอากาศ Compressor P-01", // อุปกรณ์ที่เบิก
        unit: "1", // จำนวน
        packSize: "ชิ้น", // หน่วยนับ
        totalQty: "1",
        deliveryDate: "20/11/2568",
        status: "ไม่อนุมัติ",
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
// --- END MOCK DATA ---


// --- Status Badge Component ---
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

// --- รายชื่อสถานะทั้งหมด ---
const allStatusNames = ['รออนุมัติ', 'อนุมัติ', 'ไม่อนุมัติ', 'ยกเลิก'];


// --- START: Create Inventory Modal Component ---
const CreateInventoryModal = ({ onClose, onSubmit }) => {
  const [equipmentId, setEquipmentId] = useState(""); // เลขอุปกรณ์
  const [jobId, setJobId] = useState(""); // JOBID
  const [jobTitle, setJobTitle] = useState(""); // JOB TITLE
  const [contact, setContact] = useState(""); // ผู้รับผิดชอบ
  const [department, setDepartment] = useState(""); // แผนก
  const [refId, setRefId] = useState(""); // รหัสอ้างอิง
  const [requester, setRequester] = useState(""); // ผู้แจ้งซ่อม

  const [items, setItems] = useState([
    { itemCode: '', itemName: '', qty: 1, unit: 'ชิ้น', packSize: 1, unitPkg: 'ชิ้น' }
  ]);
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { itemCode: '', itemName: '', qty: 1, unit: 'ชิ้น', packSize: 1, unitPkg: 'ชิ้น' }
    ]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = () => {
    const newInventoryOrder = {
      equipmentId,
      jobId,
      jobTitle,
      contact,
      department,
      refId,
      requester,
      items,
    };
    console.log("Saving new inventory:", newInventoryOrder);
    onSubmit(newInventoryOrder);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        bg-white dark:bg-gray-900 rounded-lg shadow-lg z-50 
        w-[95%] max-w-5xl max-h-[90vh] flex flex-col"
      >
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <h2 className="text-2xl font-bold text-black dark:text-white">สร้างใบงานใหม่</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6 text-gray-500" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-6 overflow-y-auto">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <h3 className="text-lg font-semibold text-black dark:text-white">รายละเอียดหลัก</h3>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-black dark:text-white">เลขอุปกรณ์</label>
                <Input value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-black dark:text-white">JOB ID</label>
                <Input value={jobId} onChange={(e) => setJobId(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-black dark:text-white">JOB TITLE</label>
                <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-black dark:text-white">ผู้รับผิดชอบ</label>
                <Input value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>
               <div>
                <label className="text-sm font-medium text-black dark:text-white">แผนก</label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-black dark:text-white">รหัสอ้างอิง</label>
                <Input value={refId} onChange={(e) => setRefId(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-black dark:text-white">ผู้แจ้งซ่อม</label>
                <Input value={requester} onChange={(e) => setRequester(e.target.value)} />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold text-black dark:text-white">รายการอะไหล่/วัสดุ</h3>
              <Button size="sm" onClick={handleAddItem}>
                <Plus className="mr-2 h-4 w-4" /> เพิ่มรายการ
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัสอะไหล่</TableHead>
                    <TableHead>ชื่ออะไหล่</TableHead>
                    <TableHead>จำนวน</TableHead>
                    <TableHead>หน่วย</TableHead>
                    <TableHead>ขนาดบรรจุ</TableHead>
                    <TableHead>หน่วยบรรจุ</TableHead>
                    <TableHead>ลบ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell><Input value={item.itemCode} onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)} /></TableCell>
                      <TableCell><Input value={item.itemName} onChange={(e) => handleItemChange(index, 'itemName', e.target.value)} /></TableCell>
                      <TableCell><Input type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} /></TableCell>
                      <TableCell><Input value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} /></TableCell>
                      <TableCell><Input type="number" value={item.packSize} onChange={(e) => handleItemChange(index, 'packSize', e.target.value)} /></TableCell>
                      <TableCell><Input value={item.unitPkg} onChange={(e) => handleItemChange(index, 'unitPkg', e.gtarget.value)} /></TableCell>
                      <TableCell>
                        <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CardContent>
        <CardContent className="border-t p-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
            บันทึก
          </Button>
        </CardContent>
      </div>
    </>
  );
};
// --- END: Create Inventory Modal Component ---


export default function Page() {
  const [view, setView] = useState("list");
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [activeStartDate, setActiveStartDate] = useState("");
  const [activeEndDate, setActiveEndDate] = useState("");
  const [activeSelectedStatuses, setActiveSelectedStatuses] = useState([]);
  
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  
  const handleStatusChange = (status, checked) => {
    if (status === 'all') {
      setIsAllSelected(checked);
      setTempSelectedStatuses(checked ? allStatusNames : []);
    } else {
      let newStatuses;
      if (checked) {
        newStatuses = [...tempSelectedStatuses, status];
      } else {
        newStatuses = tempSelectedStatuses.filter(s => s !== status);
      }
      setTempSelectedStatuses(newStatuses);
      setIsAllSelected(newStatuses.length === allStatusNames.length);
    }
  };

  const handleResetDates = () => {
    setTempStartDate("");
    setTempEndDate("");
  };

  const handleSearchClick = () => {
    setActiveSearchQuery(searchQuery);
    setActiveSelectedStatuses(tempSelectedStatuses);
    setActiveStartDate(tempStartDate);
    setActiveEndDate(tempEndDate);
  };


  const filteredData = useMemo(() => {
    const normalizedSearch = activeSearchQuery.toLowerCase().trim();

    const noStatusFilter = activeSelectedStatuses.length === 0;
    const noSearchFilter = normalizedSearch === "";
    const noDateFilter = activeStartDate === "" && activeEndDate === "";

    if (noStatusFilter && noSearchFilter && noDateFilter) {
      return mockOrderData;
    }

    const newFilteredData = [];
    mockOrderData.forEach(group => {
      const matchingOrders = group.orders.filter(order => {
        
        const matchesStatus =
          noStatusFilter || activeSelectedStatuses.includes(order.status);
        
        const matchesSearch = noSearchFilter || (
            (order.id && order.id.toLowerCase().includes(normalizedSearch)) ||
            (order.supplier && order.supplier.toLowerCase().includes(normalizedSearch)) ||
            (order.orderbookId && order.orderbookId.toLowerCase().includes(normalizedSearch)) ||
            (order.vendorName && order.vendorName.toLowerCase().includes(normalizedSearch)) ||
            (group.groupName && group.groupName.toLowerCase().includes(normalizedSearch))
          );
        
        let matchesDate = true;
        if (!noDateFilter) {
          const orderISO = convertDateToISO(order.orderDate);
          if (!orderISO) {
              matchesDate = false;
          } else {
            if (activeStartDate && orderISO < activeStartDate) {
              matchesDate = false;
            }
            if (activeEndDate && orderISO > activeEndDate) {
              matchesDate = false;
            }
          }
        }

        return matchesStatus && matchesSearch && matchesDate;
      });

      if (matchingOrders.length > 0) {
        newFilteredData.push({
          ...group,
          orders: matchingOrders,
        });
      }
    });
    
    return newFilteredData;

  }, [activeSelectedStatuses, activeSearchQuery, activeStartDate, activeEndDate]);


  const handleViewDetails = (order) => {
    setSelectedItem(order);
    setView("detail");
  };

  const handleBackToList = () => {
    setSelectedItem(null);
    setView("list");
  };

  const handleToggleGroup = (groupCode) => {
    setCollapsedGroups(prev => {
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
    console.log("Data to save:", newData);
  };

  // --- RENDER LIST VIEW ---
  const renderListView = () => (
    <>
      <Card className="bg-white">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            
            <Input
              placeholder="ค้นหา เลขอุปกรณ์, JOB, เลขที่เอกสาร..."
              className="w-full md:w-[250px] bg-white"
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
              className="mt-6"
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
                onCheckedChange={(checked) => handleStatusChange('all', checked)}
              />
              <label htmlFor="status-all" className="text-sm font-medium">สถานะทั้งหมด</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-pending"
                checked={tempSelectedStatuses.includes('รออนุมัติ')}
                onCheckedChange={(checked) => handleStatusChange('รออนุมัติ', checked)}
              />
              <label htmlFor="status-pending" className="text-sm font-medium">รออนุมัติ</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-approved"
                checked={tempSelectedStatuses.includes('อนุมัติ')}
                onCheckedChange={(checked) => handleStatusChange('อนุมัติ', checked)}
              />
              <label htmlFor="status-approved" className="text-sm font-medium">อนุมัติ</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-rejected"
                checked={tempSelectedStatuses.includes('ไม่อนุมัติ')}
                onCheckedChange={(checked) => handleStatusChange('ไม่อนุมัติ', checked)}
              />
              <label htmlFor="status-rejected" className="text-sm font-medium">ไม่อนุมัติ</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-cancelled"
                checked={tempSelectedStatuses.includes('ยกเลิก')}
                onCheckedChange={(checked) => handleStatusChange('ยกเลิก', checked)}
              />
              <label htmlFor="status-cancelled" className="text-sm font-medium">ยกเลิก</label>
            </div>
            
            <Button
              variant="outline"
              className="bg-purple-100 text-purple-700"
              onClick={handleSearchClick}
            >
              <Search className="mr-2 h-4 w-4" /> ค้นหา
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="product" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="product">Inventory by Product</TabsTrigger>
            <TabsTrigger value="supplier">Inventory by Supplier</TabsTrigger>
          </TabsList>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleOpenCreateModal}
          >
            + สร้าง Inventory
          </Button>
        </div>
        <TabsContent value="product">
          
          <Card className="mt-4">
            <div className="overflow-x-auto">
              {/* ----- 💥 โค้ดที่แก้ไข (Table Header) 💥 ----- */}
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-blue-900 hover:bg-blue-900">
                    <TableHead className="text-white w-[150px]">เลขอุปกรณ์</TableHead>
                    <TableHead className="text-white w-[250px]">JOBID/JOB TITLE</TableHead>
                    <TableHead className="text-white w-[150px]">เลขที่เอกสาร</TableHead>
                    <TableHead className="text-white w-[120px]">วันที่เบิก</TableHead>
                    <TableHead className="text-white w-[150px]">รหัสอะไหล่</TableHead>
                    <TableHead className="text-white w-[200px]">อุปกรณ์ที่เบิก</TableHead>
                    <TableHead className="text-white w-[100px]">จำนวน</TableHead>
                    <TableHead className="text-white w-[100px]">หน่วยนับ</TableHead>
                    <TableHead className="text-white w-[100px]">จำนวนรวม</TableHead>
                    <TableHead className="text-white w-[120px]">วันที่คาดว่าจะได้รับ</TableHead>
                    <TableHead className="text-white w-[100px]">สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((group) => {
                      
                      const isCollapsed = collapsedGroups.has(group.groupCode);

                      return (
                        <React.Fragment key={group.groupCode}>
                          
                          <TableRow
                            className="bg-yellow-100 hover:bg-yellow-200 border-none cursor-pointer"
                            onClick={() => handleToggleGroup(group.groupCode)}
                          >
                            <TableCell colSpan={11} className="font-bold text-yellow-800">
                              <ChevronDown
                                className={cn(
                                  "inline-block mr-2 h-4 w-4 transition-transform",
                                  isCollapsed && "-rotate-90"
                                )}
                              />
                              {group.groupCode} {group.groupName}
                            </TableCell>
                          </TableRow>

                          {!isCollapsed && group.orders.map((order) => (
                            <TableRow
                              key={order.id + order.orderbookId} // (ใช้ key ที่ unique มากขึ้น)
                              className="bg-green-50 hover:bg-green-100 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation(); 
                                handleViewDetails(order);
                              }}
                            >
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.supplier}</TableCell>
                              <TableCell>{order.orderbookId}</TableCell>
                              <TableCell>{order.orderDate}</TableCell>
                              <TableCell>{order.vendorCode}</TableCell>
                              <TableCell>{order.vendorName}</TableCell>
                              <TableCell>{order.unit}</TableCell>
                              <TableCell>{order.packSize}</TableCell>
                              <TableCell>{order.totalQty}</TableCell>
                              <TableCell>{order.deliveryDate}</TableCell>
                              <TableCell>
                                <StatusBadge status={order.status} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center text-muted-foreground h-24">
                        ไม่พบข้อมูลที่ตรงกับตัวกรอง
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {/* ----- 💥 สิ้นสุดโค้ดที่แก้ไข 💥 ----- */}

              </Table>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="supplier">
          <Card className="mt-4 p-4">
            <p>หน้า Inventory by Supplier</p>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );

  // --- RENDER DETAIL VIEW ---
  // (ปรับปรุง Label ให้สอดคล้องกับธีมงานซ่อมบำรุง)
  const renderDetailView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold">
            เลขที่เอกสาร {selectedItem?.orderbookId} ({selectedItem?.id})
          </h2>
          <p className="text-lg text-muted-foreground">{selectedItem?.supplier}</p>
        </div>
        <StatusBadge status={selectedItem?.status} />
      </div>

      <Card className="bg-white">
        <CardHeader>
          <h3 className="text-lg font-semibold">รายละเอียด</h3>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">เลขอุปกรณ์</label>
              <Input disabled value={selectedItem?.id || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">JOBID/JOB TITLE</label>
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
              <Input disabled value={selectedItem?.details?.vendorInvoice || ""} />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">ผู้แจ้งซ่อม</label>
              <Input disabled value={selectedItem?.details?.requester || ""} />
            </div>
              <div>
              <label className="text-sm font-medium">วันที่แจ้งซ่อม</label>
              <Input disabled value={selectedItem?.details?.requestDate || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">ผู้อนุมัติ</label>
              <Input disabled value={selectedItem?.details?.approver || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">วันที่อนุมัติ</label>
              <Input disabled value={selectedItem?.details?.approveDate || ""} />
            </div>
              <div>
              <label className="text-sm font-medium">ผู้แก้ไขล่าสุด</label>
              <Input disabled value={selectedItem?.details?.lastEditor || ""} />
            </div>
              <div>
              <label className="text-sm font-medium">วันที่แก้ไข</label>
              <Input disabled value={selectedItem?.details?.lastEditDate || ""} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader className="bg-green-700">
          <h3 className="text-lg font-semibold text-white">รายละเอียดอะไหล่/วัสดุ</h3>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-100">
                <TableHead>#</TableHead>
                <TableHead>รหัสอะไหล่</TableHead>
                <TableHead>ชื่ออะไหล่</TableHead>
                <TableHead>รหัสอะไหล่ (ผู้จำหน่าย)</TableHead>
                <TableHead>ชื่อทางการค้า</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead>จำนวนสั่ง</TableHead>
                <TableHead>หน่วย</TableHead>
                <TableHead>ขนาดบรรจุ</TableHead>
                <TableHead>หน่วยบรรจุ</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedItem?.items.map((item) => (
                <TableRow key={item["#"]}>
                  <TableCell>{item["#"]}</TableCell>
                  <TableCell>{item.itemCode}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.vendorItemCode}</TableCell>
                  <TableCell>{item.itemNameVendor}</TableCell>
                  <TableCell>{item.itemNameDetail}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.packSize}</TableCell>
                  <TableCell>{item.unitPkg}</TableCell>
                  <TableCell>{/* ... icons ... */}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          className="bg-purple-100 text-purple-700"
          onClick={handleBackToList}
        >
          ย้อนกลับ
        </Button>
        <Button className="bg-gray-300 text-gray-800">
          บันทึก
        </Button>
      </div>
    </div>
  );


  // --- MAIN RETURN (จากโค้ด Inventory เดิม) ---
  return (
    <main className="bg-gray-100 min-h-screen">
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
        />
      )}
    </main>
  );
}