import { Badge } from "@/components/ui/badge";

// --- 1. ข้อมูลหลัก (Master Data) ---

export const mockUnits = [
  { id: 1, name: "ชิ้น" },
  { id: 2, name: "อัน" },
  { id: 3, name: "ชุด" },
  { id: 4, name: "เครื่อง" },
  { id: 5, name: "ตัว" },
  { id: 6, name: "กล่อง" },
  { id: 7, name: "แพ็ค" },
  { id: 8, name: "ม้วน" },
  { id: 9, name: "เมตร" },
  { id: 10, name: "ลิตร" },
  { id: 11, name: "เส้น" },
  { id: 12, name: "คู่" },
  { id: 13, name: "ใบ" },
  { id: 14, name: "ด้าม" },
  { id: 15, name: "แกลลอน" },
];

export const mockDepartments = [
  { id: 1, code: "MA", name: "ซ่อมบำรุง (Maintenance)" },
  { id: 2, code: "PD-A", name: "ฝ่ายผลิต A (Production A)" },
  { id: 3, code: "PD-B", name: "ฝ่ายผลิต B (Production B)" },
  { id: 4, code: "WH", name: "คลังสินค้า (Warehouse)" },
  { id: 5, code: "AD", name: "ธุรการ (Admin)" },
  { id: 6, code: "HR", name: "ทรัพยากรบุคคล (HR)" },
  { id: 7, code: "IT", name: "เทคโนโลยีสารสนเทศ (IT)" },
  { id: 8, code: "LOG", name: "โลจิสติกส์ (Logistics)" },
  { id: 9, code: "PUR", name: "จัดซื้อ (Purchasing)" },
  { id: 10, code: "ENG", name: "วิศวกรรม (Engineering)" },
];

export const mockCategories = [
  { id: 1, name: "เครื่องมือทั่วไป (Hand Tools)", description: "ค้อน, ประแจ, ไขควง" },
  { id: 2, name: "เครื่องมือไฟฟ้า (Power Tools)", description: "สว่าน, เครื่องเจียร" },
  { id: 3, name: "วัสดุสิ้นเปลือง (Consumables)", description: "น็อต, ตะปู, เทป, กาว" },
  { id: 4, name: "อุปกรณ์ความปลอดภัย (PPE)", description: "หมวก, รองเท้า, ถุงมือ, แว่นตา" },
  { id: 5, name: "วัสดุไฟฟ้า (Electrical)", description: "สายไฟ, หลอดไฟ, เบรกเกอร์" },
  { id: 6, name: "อะไหล่เครื่องจักร (Spare Parts)", description: "ลูกปืน, สายพาน, ซีล, โอริง" },
  { id: 7, name: "เคมีภัณฑ์ (Chemicals)", description: "น้ำมันเครื่อง, จารบี, ทินเนอร์" },
  { id: 8, name: "อุปกรณ์ทำความสะอาด (Cleaning)", description: "ไม้กวาด, น้ำยาถูพื้น" },
  { id: 9, name: "เครื่องเขียน (Stationery)", description: "ปากกา, กระดาษ, แฟ้ม" },
];

export const mockSuppliers = [
  { id: 1, name: "บริษัท ไทยวัสดุ จำกัด", contact: "คุณสมชาย", phone: "02-123-4567" },
  { id: 2, name: "Makita Thailand", contact: "ฝ่ายขาย", phone: "02-987-6543" },
  { id: 3, name: "Hardware House", contact: "คุณวิชัย", phone: "081-234-5678" },
  { id: 4, name: "Siam Steel", contact: "คุณปราณี", phone: "02-555-8888" },
  { id: 5, name: "Electric Pro", contact: "ช่างเอก", phone: "089-999-0000" },
  { id: 6, name: "Safety First Co.", contact: "คุณนิรภัย", phone: "02-444-5555" },
  { id: 7, name: "Office Supply Ltd.", contact: "คุณเลขา", phone: "02-111-2222" },
  { id: 8, name: "Bearings Center", contact: "คุณหมุน", phone: "02-666-7777" },
  { id: 9, name: "Paints & Chemical", contact: "คุณเคมี", phone: "02-333-4444" },
  { id: 10, name: "Global Tech", contact: "Engineer Team", phone: "099-888-7777" },
];

// --- 2. ข้อมูลสต็อก (เชื่อมโยงกับ Master Data) ---

export const initialStockData = [
  // Hand Tools
  { itemCode: "HT-001", itemName: "ค้อนหงอน ด้ามไฟเบอร์", category: "เครื่องมือทั่วไป (Hand Tools)", itemType: "Returnable", supplierName: "บริษัท ไทยวัสดุ จำกัด", stock: 15, unit: "อัน", packSize: 1, unitPkg: "อัน" },
  { itemCode: "HT-002", itemName: "ชุดประแจแหวนข้างปากตาย 8-24mm", category: "เครื่องมือทั่วไป (Hand Tools)", itemType: "Returnable", supplierName: "Hardware House", stock: 8, unit: "ชุด", packSize: 1, unitPkg: "ชุด" },
  { itemCode: "HT-003", itemName: "ไขควงชุด 6 ชิ้น", category: "เครื่องมือทั่วไป (Hand Tools)", itemType: "Returnable", supplierName: "Hardware House", stock: 12, unit: "ชุด", packSize: 1, unitPkg: "ชุด" },
  { itemCode: "HT-004", itemName: "คีมล็อค 10 นิ้ว", category: "เครื่องมือทั่วไป (Hand Tools)", itemType: "Returnable", supplierName: "บริษัท ไทยวัสดุ จำกัด", stock: 20, unit: "อัน", packSize: 1, unitPkg: "อัน" },
  
  // Power Tools
  { itemCode: "PT-001", itemName: "สว่านไฟฟ้า Makita M6001", category: "เครื่องมือไฟฟ้า (Power Tools)", itemType: "Returnable", supplierName: "Makita Thailand", stock: 5, unit: "เครื่อง", packSize: 1, unitPkg: "เครื่อง" },
  { itemCode: "PT-002", itemName: "เครื่องเจียร 4 นิ้ว", category: "เครื่องมือไฟฟ้า (Power Tools)", itemType: "Returnable", supplierName: "Makita Thailand", stock: 6, unit: "เครื่อง", packSize: 1, unitPkg: "เครื่อง" },
  { itemCode: "PT-003", itemName: "สว่านไร้สาย 18V", category: "เครื่องมือไฟฟ้า (Power Tools)", itemType: "Returnable", supplierName: "Global Tech", stock: 4, unit: "ชุด", packSize: 1, unitPkg: "ชุด" },

  // Consumables
  { itemCode: "CS-001", itemName: "น็อต M6x25mm (ถุง 100)", category: "วัสดุสิ้นเปลือง (Consumables)", itemType: "Consumable", supplierName: "Siam Steel", stock: 50, unit: "ถุง", packSize: 100, unitPkg: "ตัว" },
  { itemCode: "CS-002", itemName: "ตะปูคอนกรีต 2 นิ้ว", category: "วัสดุสิ้นเปลือง (Consumables)", itemType: "Consumable", supplierName: "Siam Steel", stock: 30, unit: "กล่อง", packSize: 1, unitPkg: "กล่อง" },
  { itemCode: "CS-003", itemName: "เทปพันสายไฟ 3M", category: "วัสดุสิ้นเปลือง (Consumables)", itemType: "Consumable", supplierName: "Electric Pro", stock: 100, unit: "ม้วน", packSize: 1, unitPkg: "ม้วน" },
  { itemCode: "CS-004", itemName: "ใบตัดเหล็ก 4 นิ้ว", category: "วัสดุสิ้นเปลือง (Consumables)", itemType: "Consumable", supplierName: "Hardware House", stock: 200, unit: "ใบ", packSize: 1, unitPkg: "ใบ" },
  { itemCode: "CS-005", itemName: "กาวร้อน", category: "วัสดุสิ้นเปลือง (Consumables)", itemType: "Consumable", supplierName: "Hardware House", stock: 50, unit: "หลอด", packSize: 1, unitPkg: "หลอด" },

  // PPE
  { itemCode: "PPE-001", itemName: "ถุงมือผ้าเคลือบยาง", category: "อุปกรณ์ความปลอดภัย (PPE)", itemType: "Consumable", supplierName: "Safety First Co.", stock: 150, unit: "คู่", packSize: 1, unitPkg: "คู่" },
  { itemCode: "PPE-002", itemName: "หมวกนิรภัยสีขาว", category: "อุปกรณ์ความปลอดภัย (PPE)", itemType: "Returnable", supplierName: "Safety First Co.", stock: 20, unit: "ใบ", packSize: 1, unitPkg: "ใบ" },
  { itemCode: "PPE-003", itemName: "รองเท้าเซฟตี้ เบอร์ 42", category: "อุปกรณ์ความปลอดภัย (PPE)", itemType: "Returnable", supplierName: "Safety First Co.", stock: 10, unit: "คู่", packSize: 1, unitPkg: "คู่" },
  { itemCode: "PPE-004", itemName: "หน้ากาก N95 (กล่อง)", category: "อุปกรณ์ความปลอดภัย (PPE)", itemType: "Consumable", supplierName: "Safety First Co.", stock: 30, unit: "กล่อง", packSize: 20, unitPkg: "ชิ้น" },

  // Electrical
  { itemCode: "EL-001", itemName: "สายไฟ VCT 2x2.5", category: "วัสดุไฟฟ้า (Electrical)", itemType: "Consumable", supplierName: "Electric Pro", stock: 500, unit: "เมตร", packSize: 1, unitPkg: "เมตร" },
  { itemCode: "EL-002", itemName: "หลอดไฟ LED T8 18W", category: "วัสดุไฟฟ้า (Electrical)", itemType: "Consumable", supplierName: "Electric Pro", stock: 40, unit: "หลอด", packSize: 1, unitPkg: "หลอด" },
  { itemCode: "EL-003", itemName: "เบรกเกอร์ 20A", category: "วัสดุไฟฟ้า (Electrical)", itemType: "Consumable", supplierName: "Electric Pro", stock: 15, unit: "ตัว", packSize: 1, unitPkg: "ตัว" },

  // Spare Parts
  { itemCode: "SP-001", itemName: "ตลับลูกปืน 6205-2Z", category: "อะไหล่เครื่องจักร (Spare Parts)", itemType: "Consumable", supplierName: "Bearings Center", stock: 150, unit: "ชิ้น", packSize: 1, unitPkg: "ชิ้น" },
  { itemCode: "SP-002", itemName: "สายพานร่อง B52", category: "อะไหล่เครื่องจักร (Spare Parts)", itemType: "Consumable", supplierName: "Bearings Center", stock: 20, unit: "เส้น", packSize: 1, unitPkg: "เส้น" },
  { itemCode: "SP-003", itemName: "ซีลน้ำมัน 30x50x10", category: "อะไหล่เครื่องจักร (Spare Parts)", itemType: "Consumable", supplierName: "Bearings Center", stock: 45, unit: "ชิ้น", packSize: 1, unitPkg: "ชิ้น" },

  // Chemicals
  { itemCode: "CH-001", itemName: "น้ำมันไฮดรอลิก #68 (20L)", category: "เคมีภัณฑ์ (Chemicals)", itemType: "Consumable", supplierName: "Paints & Chemical", stock: 10, unit: "ถัง", packSize: 20, unitPkg: "ลิตร" },
  { itemCode: "CH-002", itemName: "จารบีทนความร้อน (1kg)", category: "เคมีภัณฑ์ (Chemicals)", itemType: "Consumable", supplierName: "Paints & Chemical", stock: 25, unit: "กระปุก", packSize: 1, unitPkg: "กก." },
  { itemCode: "CH-003", itemName: "สเปรย์อเนกประสงค์ WD-40", category: "เคมีภัณฑ์ (Chemicals)", itemType: "Consumable", supplierName: "Paints & Chemical", stock: 60, unit: "กระป๋อง", packSize: 1, unitPkg: "กระป๋อง" },

  // Stationery
  { itemCode: "ST-001", itemName: "กระดาษ A4 80แกรม", category: "เครื่องเขียน (Stationery)", itemType: "Consumable", supplierName: "Office Supply Ltd.", stock: 100, unit: "รีม", packSize: 500, unitPkg: "แผ่น" },
  { itemCode: "ST-002", itemName: "ปากกาลูกลื่น สีน้ำเงิน", category: "เครื่องเขียน (Stationery)", itemType: "Consumable", supplierName: "Office Supply Ltd.", stock: 50, unit: "ด้าม", packSize: 1, unitPkg: "ด้าม" },
];

// --- 3. ข้อมูลใบเบิก (Transaction Data) ---

export const mockOrderData = [
  {
    groupName: "สายการผลิต A (Production Line A)",
    groupCode: "PD-A",
    orders: [
      {
        id: "REQ-2025-001",
        supplier: "PM เครื่องจักร Line A",
        orderbookId: "DOC-2501-001",
        orderDate: "10/01/2025",
        vendorCode: "MIXED",
        vendorName: "รายการอะไหล่รวม",
        unit: "3",
        packSize: "รายการ",
        deliveryDate: "10/01/2025",
        status: "อนุมัติ",
        details: { requester: "สมชาย ใจดี", department: "ซ่อมบำรุง (Maintenance)", requestDate: "10/01/2025 08:30", approver: "หัวหน้าวิศวกร", approveDate: "10/01/2025 09:00", contact: "ทีมซ่อมบำรุง 1" },
        items: [
          { "#": 1, itemCode: "SP-001", itemName: "ตลับลูกปืน 6205-2Z", qty: "4", unit: "ชิ้น", itemType: "Consumable" },
          { "#": 2, itemCode: "CH-002", itemName: "จารบีทนความร้อน (1kg)", qty: "1", unit: "กระปุก", itemType: "Consumable" },
          { "#": 3, itemCode: "HT-002", itemName: "ชุดประแจแหวนข้างปากตาย 8-24mm", qty: "1", unit: "ชุด", itemType: "Returnable", returnDate: "12/01/2025" },
        ]
      },
      {
        id: "REQ-2025-002",
        supplier: "เบิกอุปกรณ์ความปลอดภัยพนักงานใหม่",
        orderbookId: "DOC-2501-002",
        orderDate: "12/01/2025",
        vendorCode: "PPE-MIX",
        vendorName: "อุปกรณ์ PPE รวม",
        unit: "2",
        packSize: "รายการ",
        deliveryDate: "12/01/2025",
        status: "อนุมัติ",
        details: { requester: "สมหญิง รักดี", department: "ทรัพยากรบุคคล (HR)", requestDate: "12/01/2025 10:00", approver: "ผจก.ฝ่ายผลิต", approveDate: "12/01/2025 10:30", contact: "HR Team" },
        items: [
          { "#": 1, itemCode: "PPE-002", itemName: "หมวกนิรภัยสีขาว", qty: "2", unit: "ใบ", itemType: "Returnable", returnDate: "31/12/2025" },
          { "#": 2, itemCode: "PPE-001", itemName: "ถุงมือผ้าเคลือบยาง", qty: "12", unit: "คู่", itemType: "Consumable" },
        ]
      },
    ]
  },
  {
    groupName: "ฝ่ายซ่อมบำรุง (Maintenance)",
    groupCode: "MA",
    orders: [
      {
        id: "REQ-2025-003",
        supplier: "ซ่อมระบบไฟฟ้าโรงงาน",
        orderbookId: "DOC-2501-003",
        orderDate: "15/01/2025",
        vendorCode: "EL-MIX",
        vendorName: "วัสดุไฟฟ้า",
        unit: "4",
        packSize: "รายการ",
        deliveryDate: "15/01/2025",
        status: "รออนุมัติ",
        details: { requester: "วิชัย ช่างไฟ", department: "ซ่อมบำรุง (Maintenance)", requestDate: "15/01/2025 13:45", approver: "-", approveDate: "-", contact: "ช่างไฟ 1" },
        items: [
          { "#": 1, itemCode: "EL-001", itemName: "สายไฟ VCT 2x2.5", qty: "50", unit: "เมตร", itemType: "Consumable" },
          { "#": 2, itemCode: "EL-002", itemName: "หลอดไฟ LED T8 18W", qty: "10", unit: "หลอด", itemType: "Consumable" },
          { "#": 3, itemCode: "CS-003", itemName: "เทปพันสายไฟ 3M", qty: "5", unit: "ม้วน", itemType: "Consumable" },
          { "#": 4, itemCode: "PT-003", itemName: "สว่านไร้สาย 18V", qty: "1", unit: "ชุด", itemType: "Returnable", returnDate: "16/01/2025" },
        ]
      },
      {
        id: "REQ-2025-004",
        supplier: "เบิกวัสดุสิ้นเปลืองประจำสัปดาห์",
        orderbookId: "DOC-2501-004",
        orderDate: "18/01/2025",
        vendorCode: "CS-MIX",
        vendorName: "วัสดุสิ้นเปลือง",
        unit: "3",
        packSize: "รายการ",
        deliveryDate: "19/01/2025",
        status: "ไม่อนุมัติ",
        details: { requester: "อำนาจ จัดซื้อ", department: "จัดซื้อ (Purchasing)", requestDate: "18/01/2025 09:00", approver: "ผจก.โรงงาน", approveDate: "18/01/2025 11:00", rejectionReason: "เบิกเกินโควต้าประจำเดือน", contact: "Admin" },
        items: [
          { "#": 1, itemCode: "CS-005", itemName: "กาวร้อน", qty: "20", unit: "หลอด", itemType: "Consumable" },
          { "#": 2, itemCode: "ST-001", itemName: "กระดาษ A4 80แกรม", qty: "10", unit: "รีม", itemType: "Consumable" },
          { "#": 3, itemCode: "CH-003", itemName: "สเปรย์อเนกประสงค์ WD-40", qty: "12", unit: "กระป๋อง", itemType: "Consumable" },
        ]
      },
      {
        id: "REQ-2025-005",
        supplier: "ขอเบิกเครื่องมือพิเศษ (ยกเลิก)",
        orderbookId: "DOC-2501-005",
        orderDate: "20/01/2025",
        vendorCode: "PT-002",
        vendorName: "เครื่องเจียร 4 นิ้ว",
        unit: "1",
        packSize: "เครื่อง",
        deliveryDate: "-",
        status: "ยกเลิก",
        details: { requester: "สมชาย ใจดี", department: "ซ่อมบำรุง (Maintenance)", requestDate: "20/01/2025 14:00", approver: "-", approveDate: "-", rejectionReason: "ผู้ใช้แจ้งยกเลิกเอง (เจอของเก่าแล้ว)", contact: "ทีมซ่อมบำรุง 1" },
        items: [
          { "#": 1, itemCode: "PT-002", itemName: "เครื่องเจียร 4 นิ้ว", qty: "1", unit: "เครื่อง", itemType: "Returnable" },
        ]
      }
    ]
  }
];

// --- Helper Functions ---

export function findStockInfo(stockData, itemCode) {
  return stockData.find((s) => s.itemCode === itemCode);
}

export const StatusBadge = ({ status, small = false }) => {
  const sizeClass = small ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2.5 py-0.5";
  
  switch (status) {
    case "อนุมัติ":
      return (
        <Badge className={`bg-green-100 text-green-700 hover:bg-green-100 border-green-200 ${sizeClass}`}>
          {status}
        </Badge>
      );
    case "รออนุมัติ":
      return (
        <Badge className={`bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 ${sizeClass}`}>
          {status}
        </Badge>
      );
    case "ไม่อนุมัติ":
      return (
        <Badge className={`bg-red-100 text-red-700 hover:bg-red-100 border-red-200 ${sizeClass}`}>
          {status}
        </Badge>
      );
    case "ยกเลิก":
      return (
        <Badge className={`bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200 ${sizeClass}`}>
          {status}
        </Badge>
      );
    default:
      return <Badge variant="secondary" className={sizeClass}>{status}</Badge>;
  }
};