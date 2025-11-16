"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Eye,
  ChevronDown,
  Search,
  Calendar as CalendarIcon,
  Pencil,
  X,
  Plus, // (เพิ่ม)
  Trash2, // (เพิ่ม)
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


// --- MOCK DATA (Industrial Theme) ---
// (ข้อมูล Mockup Data ที่คุณให้มา... ถูกย่อไว้เพื่อความกระชับ)
const mockOrderData = [
  {
    groupName: "เหล็กม้วนรีดร้อน (Hot Rolled Coil Steel)",
    groupCode: "STL-HRC",
    orders: [
      {
        id: "PROD-001",
        supplier: "บริษัท ไทยสตีล จำกัด (มหาชน)",
        orderbookId: "PO-2568-11-001",
        orderDate: "15/11/2568", // (DD/MM/YYYY Buddhist)
        vendorCode: "HRC-SS400-3MM",
        vendorName: "เหล็กม้วนรีดร้อน SS400 หนา 3mm",
        unit: "50 ตัน",
        packSize: "1",
        totalQty: "50",
        unitPkg: "ม้วน",
        pricePerUnit: "24500",
        deliveryDate: "30/11/2568",
        status: "อนุมัติ",
        details: {
          requester: "นายสมชาย ใจดี (ฝ่ายผลิต)",
          requestDate: "14/11/2568 10:30:00",
          approver: "นางสาวสมหญิง มุ่งมั่น (ผู้จัดการฝ่ายจัดซื้อ)",
          approveDate: "15/11/2568 09:00:15",
          lastEditor: "นางสาวสมหญิง มุ่งมั่น",
          lastEditDate: "15/11/2568 09:00:15",
          department: "ฝ่ายผลิต",
          contact: "คุณวิรัช (Sales @ Thai Steel)",
          vendorInvoice: "INV-TSC-6811-050",
        },
        items: [
          {
            "#": 1,
            itemCode: "HRC-SS400-3MM",
            itemName: "เหล็กม้วนรีดร้อน SS400 3mm",
            vendorItemCode: "TSC-SS400-3",
            itemNameVendor: "เหล็กม้วน SS400 3mm",
            itemNameDetail: "เหล็กม้วนรีดร้อน SS400 หนา 3mm กว้าง 1219mm",
            qty: "50",
            unit: "ตัน",
            packSize: "1",
            unitPkg: "ม้วน",
          },
        ],
      },
      {
        id: "PROD-002",
        supplier: "บริษัท สยามเมทัล เวิร์ค จำกัด",
        orderbookId: "PO-2568-11-002",
        orderDate: "16/11/2568", // (DD/MM/YYYY Buddhist)
        vendorCode: "STL-PLATE-10MM",
        vendorName: "เหล็กแผ่นรีดร้อน หนา 10mm",
        unit: "10 แผ่น",
        packSize: "1",
        totalQty: "10",
        unitPkg: "แผ่น",
        pricePerUnit: "3200",
        deliveryDate: "20/11/2568",
        status: "รออนุมัติ",
        details: {
          requester: "นายสมชาย ใจดี (ฝ่ายผลิต)",
          requestDate: "16/11/2568 11:00:00",
          approver: "-",
          approveDate: "-",
          lastEditor: "นายสมชาย ใจดี",
          lastEditDate: "16/11/2568 11:00:00",
          department: "ฝ่ายผลิต",
          contact: "คุณเก่ง (Siam Metal)",
          vendorInvoice: "-",
        },
        items: [
          {
            "#": 1,
            itemCode: "STL-PLATE-10MM",
            itemName: "เหล็กแผ่น 10mm",
            vendorItemCode: "SMP-10",
            itemNameVendor: "เหล็กแผ่น 10mm (4'x8')",
            itemNameDetail: "เหล็กแผ่นรีดร้อน หนา 10mm ขนาด 4 x 8 ฟุต",
            qty: "10",
            unit: "แผ่น",
            packSize: "1",
            unitPkg: "แผ่น",
          },
        ],
      },
      {
        id: "PROD-003",
        supplier: "บริษัท สยามเมทัล เวิร์ค จำกัด",
        orderbookId: "PO-2568-11-005",
        orderDate: "17/11/2568", // (DD/MM/YYYY Buddhist)
        vendorCode: "STL-PIPE-2IN",
        vendorName: "ท่อเหล็กดำ 2 นิ้ว",
        unit: "30 เส้น",
        packSize: "1",
        totalQty: "30",
        unitPkg: "เส้น",
        pricePerUnit: "450",
        deliveryDate: "25/11/2568",
        status: "ไม่อนุมัติ",
        details: {
          requester: "นายสมชาย ใจดี (ฝ่ายผลิต)",
          requestDate: "17/11/2568 09:00:00",
          approver: "นางสาวสมหญิง มุ่งมั่น",
          approveDate: "17/11/2568 10:00:00",
          lastEditor: "นางสาวสมหญิง มุ่งมั่น",
          lastEditDate: "17/11/2568 10:00:00",
          department: "ฝ่ายผลิต",
          contact: "คุณเก่ง (Siam Metal)",
          vendorInvoice: "-",
        },
        items: [
          {
            "#": 1,
            itemCode: "STL-PIPE-2IN",
            itemName: "ท่อเหล็กดำ 2 นิ้ว",
            vendorItemCode: "SMP-PIPE-2",
            itemNameVendor: "ท่อเหล็กดำ 2\"",
            itemNameDetail: "ท่อเหล็กดำ 2 นิ้ว (หนา 2.3mm)",
            qty: "30",
            unit: "เส้น",
            packSize: "1",
            unitPkg: "เส้น",
          },
        ],
      },
    ],
  },
  {
    groupName: "ชิ้นส่วนเครื่องจักรและอะไหล่ (Machine Parts & Spares)",
    groupCode: "MCP-BEARING",
    orders: [
      {
        id: "SPARE-015",
        supplier: "บริษัท เอสเคเอฟ (ประเทศไทย) จำกัด",
        orderbookId: "PO-2568-11-003",
        orderDate: "14/11/2568", // (DD/MM/YYYY Buddhist)
        vendorCode: "BEARING-6205",
        vendorName: "ตลับลูกปืน (Bearing) 6205-2Z",
        unit: "200 ชิ้น",
        packSize: "10",
        totalQty: "200",
        unitPkg: "20 กล่อง",
        pricePerUnit: "85",
        deliveryDate: "17/11/2568",
        status: "อนุมัติ",
        details: {
          requester: "นายวิศิษฐ์ ช่างซ่อม (ฝ่ายซ่อมบำรุง)",
          requestDate: "13/11/2568 14:20:11",
          approver: "นางสาวสมหญิง มุ่งมั่น (ผู้จัดการฝ่ายจัดซื้อ)",
          approveDate: "14/11/2568 09:15:00",
          lastEditor: "นางสาวสมหญิง มุ่งมั่น",
          lastEditDate: "14/11/2568 09:15:00",
          department: "ฝ่ายซ่อมบำรุง",
          contact: "คุณแอน (SKF)",
          vendorInvoice: "INV-SKF-6811-102",
        },
        items: [
          {
            "#": 1,
            itemCode: "BEARING-6205",
            itemName: "ตลับลูกปืน 6205-2Z",
            vendorItemCode: "SKF-6205-2Z/C3",
            itemNameVendor: "SKF Bearing 6205-2Z/C3",
            itemNameDetail: "ตลับลูกปืนเม็ดกลมร่องลึก ฝาเหล็ก 2 ข้าง",
            qty: "200",
            unit: "ชิ้น",
            packSize: "10",
            unitPkg: "กล่อง",
          },
        ],
      },
      {
        id: "SPARE-016",
        supplier: "บริษัท เอสเคเอฟ (ประเทศไทย) จำกัด",
        orderbookId: "PO-2568-11-006",
        orderDate: "18/11/2568", // (DD/MM/YYYY Buddhist)
        vendorCode: "BEARING-6207",
        vendorName: "ตลับลูกปืน (Bearing) 6207-2Z",
        unit: "50 ชิ้น",
        packSize: "10",
        totalQty: "50",
        unitPkg: "5 กล่อง",
        pricePerUnit: "110",
        deliveryDate: "22/11/2568",
        status: "ยกเลิก",
        details: {
          requester: "นายวิศิษฐ์ ช่างซ่อม (ฝ่ายซ่อมบำรุง)",
          requestDate: "18/11/2568 11:00:00",
          approver: "นางสาวสมหญิง มุ่งมั่น",
          approveDate: "18/11/2568 13:00:00",
          lastEditor: "นางสาวสมหญิง มุ่งมั่น",
          lastEditDate: "18/11/2568 14:00:00",
          department: "ฝ่ายซ่อมบำรุง",
          contact: "คุณแอน (SKF)",
          vendorInvoice: "-",
        },
        items: [
           {
            "#": 1,
            itemCode: "BEARING-6207",
            itemName: "ตลับลูกปืน 6207-2Z",
            vendorItemCode: "SKF-6207-2Z/C3",
            itemNameVendor: "SKF Bearing 6207-2Z/C3",
            itemNameDetail: "ตลับลูกปืนเม็ดกลมร่องลึก ฝาเหล็ก 2 ข้าง",
            qty: "50",
            unit: "ชิ้น",
            packSize: "10",
            unitPkg: "กล่อง",
          },
        ],
      },
    ],
  },
  {
    groupName: "เคมีภัณฑ์อุตสาหกรรม (Industrial Chemicals)",
    groupCode: "CHEM-SOLVENT",
    orders: [
      {
        id: "CHEM-004",
        supplier: "บริษัท พีทีที โกลบอล เคมิคอล จำกัด (มหาชน)",
        orderbookId: "PO-2568-11-004",
        orderDate: "12/11/2568", // (DD/MM/YYYY Buddhist)
        vendorCode: "SOL-TOLUENE",
        vendorName: "โซลเว้นท์ โทลูอีน (Toluene)",
        unit: "5 ถัง",
        packSize: "200",
        totalQty: "1000",
        unitPkg: "5 ถัง",
        pricePerUnit: "6000",
        deliveryDate: "15/11/2568",
        status: "อนุมัติ",
        details: {
          requester: "นายสมชาย ใจดี (ฝ่ายผลิต)",
          requestDate: "11/11/2568 16:00:00",
          approver: "นางสาวสมหญิง มุ่งมั่น (ผู้จัดการฝ่ายจัดซื้อ)",
          approveDate: "12/11/2568 10:00:00",
          lastEditor: "นางสาวสมหญิง มุ่งมั่น",
          lastEditDate: "12/11/2568 10:00:00",
          department: "ฝ่ายผลิต",
          contact: "คุณปิติ (PTTGC)",
          vendorInvoice: "INV-PTT-6811-998",
        },
        items: [
          {
            "#": 1,
            itemCode: "SOL-TOLUENE",
            itemName: "โซลเว้นท์ โทลูอีน",
            vendorItemCode: "GC-TOLUENE-200L",
            itemNameVendor: "โทลูอีน (Toluene) 200 ลิตร",
            itemNameDetail: "สารละลายโทลูอีน บรรจุถังเหล็ก 200 ลิตร",
            qty: "5",
            unit: "ถัง",
            packSize: "200",
            unitPkg: "ลิตร",
          },
        ],
      },
    ],
  },
];

// --- Status Badge Component (อัปเดตแล้ว) ---
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
  // State สำหรับข้อมูลหลัก
  const [supplierId, setSupplierId] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [contact, setContact] = useState("");
  const [department, setDepartment] = useState("");
  const [refId, setRefId] = useState("");
  const [requester, setRequester] = useState(""); // (อาจจะดึงมาจาก user ที่ login)

  // State สำหรับรายการสินค้า (Items)
  const [items, setItems] = useState([
    { itemCode: '', itemName: '', qty: 1, unit: 'ชิ้น', packSize: 1, unitPkg: 'ชิ้น' }
  ]);
  
  // อัปเดตข้อมูลในแถวของ Item
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // เพิ่มแถว Item ใหม่
  const handleAddItem = () => {
    setItems([
      ...items,
      { itemCode: '', itemName: '', qty: 1, unit: 'ชิ้น', packSize: 1, unitPkg: 'ชิ้น' }
    ]);
  };

  // ลบแถว Item
  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // ส่งข้อมูล (จำลอง)
  const handleSubmit = () => {
    const newInventoryOrder = {
      supplierId,
      supplierName,
      contact,
      department,
      refId,
      requester,
      items,
      // (ข้อมูลอื่นๆ เช่น วันที่, สถานะ จะถูกสร้างโดยระบบ)
    };
    console.log("Saving new inventory:", newInventoryOrder);
    onSubmit(newInventoryOrder); // (ส่งข้อมูลกลับไป (ถ้าต้องการ))
    onClose(); // ปิด Modal
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
          <h2 className="text-2xl font-bold text-black dark:text-white">สร้าง Inventory ใหม่</h2>
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
                <label className="text-sm font-medium text-black dark:text-white">รหัสผู้จำหน่าย</label>
                <Input value={supplierId} onChange={(e) => setSupplierId(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-black dark:text-white">ชื่อผู้จำหน่าย</label>
                <Input value={supplierName} onChange={(e) => setSupplierName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-black dark:text-white">ชื่อผู้ติดต่อ</label>
                <Input value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-black dark:text-white">ประเภท (แผนก)</label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-black dark:text-white">รหัสอ้างอิง</label>
                <Input value={refId} onChange={(e) => setRefId(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-black dark:text-white">ผู้ขอซื้อ</label>
                <Input value={requester} onChange={(e) => setRequester(e.target.value)} />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold text-black dark:text-white">รายการสินค้า</h3>
              <Button size="sm" onClick={handleAddItem}>
                <Plus className="mr-2 h-4 w-4" /> เพิ่มรายการ
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัสสินค้า</TableHead>
                    <TableHead>ชื่อสินค้า</TableHead>
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
                      <TableCell><Input value={item.unitPkg} onChange={(e) => handleItemChange(index, 'unitPkg', e.target.value)} /></TableCell>
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
  const [view, setView] = useState("list"); // 'list' or 'detail'
  const [selectedItem, setSelectedItem] = useState(null);
  
  // --- (อัปเดต) State สำหรับ Modal ---
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

  // --- (อัปเดต) Function สำหรับ Modal ---
  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };
  
  const handleSaveNewInventory = (newData) => {
    // (ในอนาคต: คุณจะต้องส่ง newData นี้ไปที่ API)
    console.log("Data to save:", newData);
    // (ชั่วคราว: อาจจะเพิ่มเข้าไปใน mockOrderData (แต่จะซับซ้อน))
  };

  // --- RENDER LIST VIEW ---
  const renderListView = () => (
    <>
      {/* Filters */}
      <Card className="bg-white">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            
            <Input
              placeholder="ค้นหา ID, ชื่อ, ผู้จำหน่าย..."
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

      {/* Tabs */}
      <Tabs defaultValue="product" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="product">Inventory by Product</TabsTrigger>
            <TabsTrigger value="supplier">Inventory by Supplier</TabsTrigger>
          </TabsList>
          {/* --- (อัปเดต) เชื่อมปุ่มนี้ --- */}
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleOpenCreateModal}
          >
            + สร้าง Inventory
          </Button>
        </div>
        <TabsContent value="product">
          
          {/* Table */}
          <Card className="mt-4">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-blue-900 hover:bg-blue-900">
                    <TableHead className="text-white w-[250px]">ชื่อสินค้า</TableHead>
                    <TableHead className="text-white w-[150px]">ผู้จำหน่าย</TableHead>
                    <TableHead className="text-white w-[150px]">เลขที่เอกสาร</TableHead>
                    <TableHead className="text-white w-[120px]">วันที่เอกสาร</TableHead>
                    <TableHead className="text-white w-[150px]">รหัสสินค้า</TableHead>
                    <TableHead className="text-white w-[200px]">ชื่อสินค้าผู้จำหน่าย</TableHead>
                    <TableHead className="text-white w-[100px]">จำนวน/ต่อ</TableHead>
                    <TableHead className="text-white w-[100px]">แพ็ค/หน่วย</TableHead>
                    <TableHead className="text-white w-[100px]">จำนวนรวม</TableHead>
                    <TableHead className="text-white w-[100px]">จำนวนแพ็ค</TableHead>
                    <TableHead className="text-white w-[100px]">ราคา/หน่วย</TableHead>
                    <TableHead className="text-white w-[120px]">วันที่คาดว่าจะได้รับ</TableHead>
                    <TableHead className="text-white w-[100px]">สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((group) => (
                      <React.Fragment key={group.groupCode}>
                        <TableRow className="bg-yellow-100 hover:bg-yellow-200 border-none">
                          <TableCell colSpan={13} className="font-bold text-yellow-800">
                            <ChevronDown className="inline-block mr-2 h-4 w-4" />
                            {group.groupCode} {group.groupName}
                          </TableCell>
                        </TableRow>
                        
                        {group.orders.map((order) => (
                          <TableRow 
                            key={order.id} 
                            className="bg-green-50 hover:bg-green-100 cursor-pointer"
                            onClick={() => handleViewDetails(order)}
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
                            <TableCell>{order.unitPkg}</TableCell>
                            <TableCell>{order.pricePerUnit}</TableCell>
                            <TableCell>{order.deliveryDate}</TableCell>
                            <TableCell>
                              <StatusBadge status={order.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={13} className="text-center text-muted-foreground h-24">
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
          <Card className="mt-4 p-4">
            <p>หน้า Inventory by Supplier</p>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );

  // --- RENDER DETAIL VIEW ---
  const renderDetailView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Inventory {selectedItem?.orderbookId} {selectedItem?.supplier}
        </h2>
        <StatusBadge status={selectedItem?.status} />
      </div>

      <Card className="bg-white">
        <CardHeader>
          <h3 className="text-lg font-semibold">รายละเอียด</h3>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">รหัสผู้จำหน่าย</label>
              <Input disabled value={selectedItem?.id || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">ชื่อผู้จำหน่าย</label>
              <Input disabled value={selectedItem?.supplier || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">ชื่อผู้ติดต่อ</label>
              <Input disabled value={selectedItem?.details?.contact || ""} />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">เลขที่</label>
              <Input disabled value={selectedItem?.orderbookId || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">ประเภท</label>
              <Input disabled value={selectedItem?.details?.department || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">รหัสอ้างอิง</label>
              <Input disabled value={selectedItem?.details?.vendorInvoice || ""} />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">ผู้ขอซื้อ</label>
              <Input disabled value={selectedItem?.details?.requester || ""} />
            </div>
             <div>
              <label className="text-sm font-medium">วันที่ทำรายการ</label>
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
          <h3 className="text-lg font-semibold text-white">รายละเอียดสินค้า/ทั้งหมด</h3>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-100">
                <TableHead>#</TableHead>
                <TableHead>รหัสสินค้า</TableHead>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead>รหัสสินค้าผู้จำหน่าย</TableHead>
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
        {/* Header (จากโค้ด Inventory เดิม) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Inventory</h1>
            <p className="text-muted-foreground">Manage all</p>
          </div>
        </div>

        {/* --- ส่วน UI ที่เพิ่มเข้ามา --- */}
        {view === "list" ? renderListView() : renderDetailView()}

      </section>
      
      {/* --- (อัปเดต) แสดง Modal ที่นี่ --- */}
      {showCreateModal && (
        <CreateInventoryModal 
          onClose={handleCloseCreateModal}
          onSubmit={handleSaveNewInventory}
        />
      )}
    </main>
  );
}