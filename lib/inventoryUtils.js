// import { Badge } from "@/components/ui/badge";

// // ==========================================
// // 1. MASTER DATA (ข้อมูลหลัก)
// // ==========================================

// /**
//  * @typedef {Object} Unit
//  * @property {number} id
//  * @property {string} name
//  */
// export const mockUnits = [
//   { id: 1, name: "ชิ้น" }, { id: 2, name: "อัน" }, { id: 3, name: "ชุด" },
//   { id: 4, name: "เครื่อง" }, { id: 5, name: "ตัว" }, { id: 6, name: "กล่อง" },
//   { id: 7, name: "แพ็ค" }, { id: 8, name: "ม้วน" }, { id: 9, name: "เมตร" },
//   { id: 10, name: "ลิตร" }, { id: 11, name: "เส้น" }, { id: 12, name: "คู่" },
//   { id: 13, name: "ใบ" }, { id: 14, name: "ด้าม" }, { id: 15, name: "แกลลอน" },
//   { id: 16, name: "ถัง" }, { id: 17, name: "หลอด" }, { id: 18, name: "กระป๋อง" },
//   { id: 19, name: "ขวด" }, { id: 20, name: "รีม" }, { id: 21, name: "กิโลกรัม" }
// ];

// /**
//  * @typedef {Object} Department
//  * @property {number} id
//  * @property {string} code
//  * @property {string} name
//  */
// export const mockDepartments = [
//   { id: 1, code: "MA", name: "ซ่อมบำรุง (Maintenance)" },
//   { id: 2, code: "PD-1", name: "ฝ่ายผลิต ไลน์ 1 (Production 1)" },
//   { id: 3, code: "PD-2", name: "ฝ่ายผลิต ไลน์ 2 (Production 2)" },
//   { id: 4, code: "WH", name: "คลังสินค้า (Warehouse)" },
//   { id: 5, code: "AD", name: "ธุรการ (Admin)" },
//   { id: 6, code: "HR", name: "ทรัพยากรบุคคล (HR)" },
//   { id: 7, code: "IT", name: "ไอที (IT Support)" },
//   { id: 8, code: "LOG", name: "โลจิสติกส์ (Logistics)" },
//   { id: 9, code: "PUR", name: "จัดซื้อ (Purchasing)" },
//   { id: 10, code: "ENG", name: "วิศวกรรม (Engineering)" },
//   { id: 11, code: "SHE", name: "ความปลอดภัย (Safety)" },
//   { id: 12, code: "QC", name: "ควบคุมคุณภาพ (QC)" },
// ];

// /**
//  * @typedef {Object} Category
//  * @property {number} id
//  * @property {string} name
//  * @property {string} description
//  */
// export const mockCategories = [
//   { id: 1, name: "เครื่องมือทั่วไป (Hand Tools)", description: "ค้อน, ประแจ, ไขควง" },
//   { id: 2, name: "เครื่องมือไฟฟ้า (Power Tools)", description: "สว่าน, หินเจียร" },
//   { id: 3, name: "วัสดุสิ้นเปลือง (Consumables)", description: "น็อต, ตะปู, เทป, กาว" },
//   { id: 4, name: "อุปกรณ์ความปลอดภัย (PPE)", description: "หมวก, รองเท้า, ถุงมือ" },
//   { id: 5, name: "วัสดุไฟฟ้า (Electrical)", description: "สายไฟ, หลอดไฟ, เบรกเกอร์" },
//   { id: 6, name: "อะไหล่เครื่องจักร (Mechanical)", description: "ลูกปืน, สายพาน, ซีล" },
//   { id: 7, name: "เคมีภัณฑ์ (Chemicals)", description: "น้ำมัน, จารบี, สเปรย์" },
//   { id: 8, name: "อุปกรณ์ทำความสะอาด (Cleaning)", description: "ไม้กวาด, น้ำยา, ถุงขยะ" },
//   { id: 9, name: "เครื่องเขียน (Stationery)", description: "กระดาษ, ปากกา, แฟ้ม" },
//   { id: 10, name: "อุปกรณ์ไอที (IT Equipment)", description: "เมาส์, คีย์บอร์ด, สายแลน" },
// ];

// /**
//  * @typedef {Object} Supplier
//  * @property {number} id
//  * @property {string} name
//  * @property {string} contact
//  * @property {string} phone
//  */
// export const mockSuppliers = [
//   { id: 1, name: "Thai Watsadu", contact: "คุณสมชาย", phone: "02-100-1000" },
//   { id: 2, name: "Makita Thailand", contact: "Service", phone: "02-987-6543" },
//   { id: 3, name: "Hardware House", contact: "คุณวิชัย", phone: "081-234-5678" },
//   { id: 4, name: "Siam Steel", contact: "คุณปราณี", phone: "02-555-8888" },
//   { id: 5, name: "Electric Pro", contact: "ช่างเอก", phone: "089-999-0000" },
//   { id: 6, name: "Safety First", contact: "คุณนิรภัย", phone: "02-444-5555" },
//   { id: 7, name: "Office Mate", contact: "Call Center", phone: "1281" },
//   { id: 8, name: "SKF Thailand", contact: "Technical", phone: "02-666-7777" },
//   { id: 9, name: "Paints Hub", contact: "คุณเคมี", phone: "02-333-4444" },
//   { id: 10, name: "IT City", contact: "Corporate Sale", phone: "02-999-8888" },
// ];

// // ==========================================
// // 2. STOCK DATA (MOCK-UP: Generate 350+ Items)
// // ==========================================

// /**
//  * ข้อมูลต้นแบบ (Base Data) ใช้สำหรับเป็นแม่แบบในการปั๊มข้อมูล
//  */
// const baseStockItems = [
//   // Hand Tools
//   { itemCode: "HT-001", itemName: "ค้อนหงอน ด้ามไฟเบอร์ 16oz", category: "เครื่องมือทั่วไป (Hand Tools)", itemType: "Returnable", supplierName: "Thai Watsadu", stock: 20, unit: "อัน", packSize: 1, unitPkg: "อัน" },
//   { itemCode: "HT-002", itemName: "ชุดประแจแหวนข้าง 8-24mm", category: "เครื่องมือทั่วไป (Hand Tools)", itemType: "Returnable", supplierName: "Hardware House", stock: 10, unit: "ชุด", packSize: 1, unitPkg: "ชุด" },
//   { itemCode: "HT-003", itemName: "ไขควงตอกกระแทก", category: "เครื่องมือทั่วไป (Hand Tools)", itemType: "Returnable", supplierName: "Hardware House", stock: 15, unit: "ชุด", packSize: 1, unitPkg: "ชุด" },
//   { itemCode: "HT-004", itemName: "คีมล็อค 10 นิ้ว", category: "เครื่องมือทั่วไป (Hand Tools)", itemType: "Returnable", supplierName: "Thai Watsadu", stock: 25, unit: "อัน", packSize: 1, unitPkg: "อัน" },
//   { itemCode: "HT-005", itemName: "ประแจเลื่อน 12 นิ้ว", category: "เครื่องมือทั่วไป (Hand Tools)", itemType: "Returnable", supplierName: "Hardware House", stock: 12, unit: "อัน", packSize: 1, unitPkg: "อัน" },
//   { itemCode: "HT-006", itemName: "ตลับเมตร 5 เมตร", category: "เครื่องมือทั่วไป (Hand Tools)", itemType: "Returnable", supplierName: "Thai Watsadu", stock: 30, unit: "อัน", packSize: 1, unitPkg: "อัน" },
//   { itemCode: "HT-007", itemName: "เลื่อยลันดา 24 นิ้ว", category: "เครื่องมือทั่วไป (Hand Tools)", itemType: "Returnable", supplierName: "Thai Watsadu", stock: 8, unit: "ปื้น", packSize: 1, unitPkg: "ปื้น" },
//   { itemCode: "HT-008", itemName: "คัตเตอร์ใหญ่", category: "เครื่องมือทั่วไป (Hand Tools)", itemType: "Consumable", supplierName: "Office Mate", stock: 50, unit: "อัน", packSize: 1, unitPkg: "อัน" },

//   // Power Tools
//   { itemCode: "PT-001", itemName: "สว่านกระแทก Makita HP1630", category: "เครื่องมือไฟฟ้า (Power Tools)", itemType: "Returnable", supplierName: "Makita Thailand", stock: 5, unit: "เครื่อง", packSize: 1, unitPkg: "เครื่อง" },
//   { itemCode: "PT-002", itemName: "เครื่องเจียร 4 นิ้ว 9553NB", category: "เครื่องมือไฟฟ้า (Power Tools)", itemType: "Returnable", supplierName: "Makita Thailand", stock: 8, unit: "เครื่อง", packSize: 1, unitPkg: "เครื่อง" },
//   { itemCode: "PT-003", itemName: "สว่านไร้สาย 18V", category: "เครื่องมือไฟฟ้า (Power Tools)", itemType: "Returnable", supplierName: "Makita Thailand", stock: 6, unit: "ชุด", packSize: 1, unitPkg: "ชุด" },
//   { itemCode: "PT-004", itemName: "เครื่องเป่าลม (Blower)", category: "เครื่องมือไฟฟ้า (Power Tools)", itemType: "Returnable", supplierName: "Makita Thailand", stock: 4, unit: "เครื่อง", packSize: 1, unitPkg: "เครื่อง" },
//   { itemCode: "PT-005", itemName: "ตู้เชื่อม Inverter 160A", category: "เครื่องมือไฟฟ้า (Power Tools)", itemType: "Returnable", supplierName: "Thai Watsadu", stock: 2, unit: "เครื่อง", packSize: 1, unitPkg: "เครื่อง" },

//   // Electrical
//   { itemCode: "EL-001", itemName: "สายไฟ VCT 2x2.5 sq.mm", category: "วัสดุไฟฟ้า (Electrical)", itemType: "Consumable", supplierName: "Electric Pro", stock: 500, unit: "เมตร", packSize: 100, unitPkg: "เมตร" },
//   { itemCode: "EL-002", itemName: "สายไฟ THW 1x4 sq.mm (ดำ)", category: "วัสดุไฟฟ้า (Electrical)", itemType: "Consumable", supplierName: "Electric Pro", stock: 300, unit: "เมตร", packSize: 100, unitPkg: "เมตร" },
//   { itemCode: "EL-003", itemName: "หลอดไฟ LED T8 18W", category: "วัสดุไฟฟ้า (Electrical)", itemType: "Consumable", supplierName: "Electric Pro", stock: 100, unit: "หลอด", packSize: 1, unitPkg: "หลอด" },
//   { itemCode: "EL-004", itemName: "เบรกเกอร์ 20A", category: "วัสดุไฟฟ้า (Electrical)", itemType: "Consumable", supplierName: "Electric Pro", stock: 30, unit: "ตัว", packSize: 1, unitPkg: "ตัว" },
//   { itemCode: "EL-005", itemName: "เทปพันสายไฟ 3M", category: "วัสดุไฟฟ้า (Electrical)", itemType: "Consumable", supplierName: "Electric Pro", stock: 200, unit: "ม้วน", packSize: 10, unitPkg: "ม้วน" },
//   { itemCode: "EL-006", itemName: "แมกเนติก SN-21", category: "วัสดุไฟฟ้า (Electrical)", itemType: "Consumable", supplierName: "Electric Pro", stock: 10, unit: "ตัว", packSize: 1, unitPkg: "ตัว" },
//   { itemCode: "EL-007", itemName: "เคเบิ้ลไทร์ 6 นิ้ว (ถุง)", category: "วัสดุไฟฟ้า (Electrical)", itemType: "Consumable", supplierName: "Electric Pro", stock: 100, unit: "ถุง", packSize: 100, unitPkg: "เส้น" },
//   { itemCode: "EL-008", itemName: "ปลั๊กตัวผู้ยาง", category: "วัสดุไฟฟ้า (Electrical)", itemType: "Consumable", supplierName: "Electric Pro", stock: 50, unit: "อัน", packSize: 1, unitPkg: "อัน" },
//   { itemCode: "EL-009", itemName: "รางเก็บสายไฟ 2 เมตร", category: "วัสดุไฟฟ้า (Electrical)", itemType: "Consumable", supplierName: "Electric Pro", stock: 40, unit: "เส้น", packSize: 1, unitPkg: "เส้น" },

//   // Mechanical
//   { itemCode: "MEC-001", itemName: "ตลับลูกปืน 6205-2Z", category: "อะไหล่เครื่องจักร (Mechanical)", itemType: "Consumable", supplierName: "SKF Thailand", stock: 100, unit: "ชิ้น", packSize: 1, unitPkg: "ชิ้น" },
//   { itemCode: "MEC-002", itemName: "ตลับลูกปืน 6309-2RS", category: "อะไหล่เครื่องจักร (Mechanical)", itemType: "Consumable", supplierName: "SKF Thailand", stock: 50, unit: "ชิ้น", packSize: 1, unitPkg: "ชิ้น" },
//   { itemCode: "MEC-003", itemName: "สายพานร่อง B52", category: "อะไหล่เครื่องจักร (Mechanical)", itemType: "Consumable", supplierName: "Hardware House", stock: 30, unit: "เส้น", packSize: 1, unitPkg: "เส้น" },
//   { itemCode: "MEC-004", itemName: "ออยซีล 35x50x10", category: "อะไหล่เครื่องจักร (Mechanical)", itemType: "Consumable", supplierName: "Hardware House", stock: 60, unit: "ชิ้น", packSize: 1, unitPkg: "ชิ้น" },
//   { itemCode: "MEC-005", itemName: "ประเก็นเหลว", category: "อะไหล่เครื่องจักร (Mechanical)", itemType: "Consumable", supplierName: "Paints Hub", stock: 20, unit: "หลอด", packSize: 1, unitPkg: "หลอด" },
//   { itemCode: "MEC-006", itemName: "โซ่เบอร์ 40 (กล่อง)", category: "อะไหล่เครื่องจักร (Mechanical)", itemType: "Consumable", supplierName: "Hardware House", stock: 10, unit: "กล่อง", packSize: 1, unitPkg: "เส้น" },
//   { itemCode: "MEC-007", itemName: "ข้อต่อโซ่ #40", category: "อะไหล่เครื่องจักร (Mechanical)", itemType: "Consumable", supplierName: "Hardware House", stock: 50, unit: "ตัว", packSize: 1, unitPkg: "ตัว" },

//   // Consumables
//   { itemCode: "CON-001", itemName: "น็อต M6x25mm (ถุง)", category: "วัสดุสิ้นเปลือง (Consumables)", itemType: "Consumable", supplierName: "Siam Steel", stock: 50, unit: "ถุง", packSize: 100, unitPkg: "ตัว" },
//   { itemCode: "CON-002", itemName: "น็อตตัวเมีย M6 (ถุง)", category: "วัสดุสิ้นเปลือง (Consumables)", itemType: "Consumable", supplierName: "Siam Steel", stock: 50, unit: "ถุง", packSize: 100, unitPkg: "ตัว" },
//   { itemCode: "CON-003", itemName: "แหวนอีแปะ M6 (ถุง)", category: "วัสดุสิ้นเปลือง (Consumables)", itemType: "Consumable", supplierName: "Siam Steel", stock: 40, unit: "ถุง", packSize: 200, unitPkg: "ตัว" },
//   { itemCode: "CON-004", itemName: "ใบตัดเหล็ก 4 นิ้ว", category: "วัสดุสิ้นเปลือง (Consumables)", itemType: "Consumable", supplierName: "Hardware House", stock: 300, unit: "ใบ", packSize: 25, unitPkg: "ใบ" },
//   { itemCode: "CON-005", itemName: "ใบเจียร 4 นิ้ว", category: "วัสดุสิ้นเปลือง (Consumables)", itemType: "Consumable", supplierName: "Hardware House", stock: 150, unit: "ใบ", packSize: 25, unitPkg: "ใบ" },
//   { itemCode: "CON-006", itemName: "ลวดเชื่อม 2.6mm", category: "วัสดุสิ้นเปลือง (Consumables)", itemType: "Consumable", supplierName: "Thai Watsadu", stock: 40, unit: "กล่อง", packSize: 2, unitPkg: "กก." },
//   { itemCode: "CON-007", itemName: "สกรูเกลียวปล่อย #7 (ถุง)", category: "วัสดุสิ้นเปลือง (Consumables)", itemType: "Consumable", supplierName: "Siam Steel", stock: 60, unit: "ถุง", packSize: 100, unitPkg: "ตัว" },
//   { itemCode: "CON-008", itemName: "พุกพลาสติก #7 (ถุง)", category: "วัสดุสิ้นเปลือง (Consumables)", itemType: "Consumable", supplierName: "Siam Steel", stock: 60, unit: "ถุง", packSize: 100, unitPkg: "ตัว" },

//   // PPE
//   { itemCode: "PPE-001", itemName: "ถุงมือผ้าเคลือบยาง", category: "อุปกรณ์ความปลอดภัย (PPE)", itemType: "Consumable", supplierName: "Safety First", stock: 200, unit: "คู่", packSize: 12, unitPkg: "คู่" },
//   { itemCode: "PPE-002", itemName: "หมวกนิรภัยขาว", category: "อุปกรณ์ความปลอดภัย (PPE)", itemType: "Returnable", supplierName: "Safety First", stock: 30, unit: "ใบ", packSize: 1, unitPkg: "ใบ" },
//   { itemCode: "PPE-003", itemName: "แว่นตานิรภัยใส", category: "อุปกรณ์ความปลอดภัย (PPE)", itemType: "Consumable", supplierName: "Safety First", stock: 100, unit: "อัน", packSize: 1, unitPkg: "อัน" },
//   { itemCode: "PPE-004", itemName: "รองเท้าเซฟตี้ #42", category: "อุปกรณ์ความปลอดภัย (PPE)", itemType: "Returnable", supplierName: "Safety First", stock: 10, unit: "คู่", packSize: 1, unitPkg: "คู่" },
//   { itemCode: "PPE-005", itemName: "ที่อุดหูมีสาย", category: "อุปกรณ์ความปลอดภัย (PPE)", itemType: "Consumable", supplierName: "Safety First", stock: 300, unit: "คู่", packSize: 100, unitPkg: "คู่" },
//   { itemCode: "PPE-006", itemName: "หน้ากาก N95", category: "อุปกรณ์ความปลอดภัย (PPE)", itemType: "Consumable", supplierName: "Safety First", stock: 500, unit: "ชิ้น", packSize: 20, unitPkg: "ชิ้น" },
//   { itemCode: "PPE-007", itemName: "เสื้อสะท้อนแสง", category: "อุปกรณ์ความปลอดภัย (PPE)", itemType: "Returnable", supplierName: "Safety First", stock: 40, unit: "ตัว", packSize: 1, unitPkg: "ตัว" },

//   // Chemicals
//   { itemCode: "CHM-001", itemName: "น้ำมันไฮดรอลิก 68 (20L)", category: "เคมีภัณฑ์ (Chemicals)", itemType: "Consumable", supplierName: "Paints Hub", stock: 15, unit: "ถัง", packSize: 20, unitPkg: "ลิตร" },
//   { itemCode: "CHM-002", itemName: "จารบีทนความร้อน", category: "เคมีภัณฑ์ (Chemicals)", itemType: "Consumable", supplierName: "Paints Hub", stock: 30, unit: "กระปุก", packSize: 1, unitPkg: "กก." },
//   { itemCode: "CHM-003", itemName: "สเปรย์ WD-40", category: "เคมีภัณฑ์ (Chemicals)", itemType: "Consumable", supplierName: "Paints Hub", stock: 60, unit: "กระป๋อง", packSize: 1, unitPkg: "กระป๋อง" },
//   { itemCode: "CHM-004", itemName: "ทินเนอร์ AAA", category: "เคมีภัณฑ์ (Chemicals)", itemType: "Consumable", supplierName: "Paints Hub", stock: 15, unit: "ปี๊บ", packSize: 1, unitPkg: "ปี๊บ" },
//   { itemCode: "CHM-005", itemName: "น้ำยาล้างสนิม", category: "เคมีภัณฑ์ (Chemicals)", itemType: "Consumable", supplierName: "Paints Hub", stock: 20, unit: "แกลลอน", packSize: 1, unitPkg: "แกลลอน" },

//   // Cleaning
//   { itemCode: "CLN-001", itemName: "ไม้กวาดดอกหญ้า", category: "อุปกรณ์ทำความสะอาด (Cleaning)", itemType: "Consumable", supplierName: "Thai Watsadu", stock: 30, unit: "ด้าม", packSize: 1, unitPkg: "ด้าม" },
//   { itemCode: "CLN-002", itemName: "น้ำยาถูพื้น (5L)", category: "อุปกรณ์ทำความสะอาด (Cleaning)", itemType: "Consumable", supplierName: "Thai Watsadu", stock: 20, unit: "แกลลอน", packSize: 5, unitPkg: "ลิตร" },
//   { itemCode: "CLN-003", itemName: "ถุงขยะดำ 36x45", category: "อุปกรณ์ทำความสะอาด (Cleaning)", itemType: "Consumable", supplierName: "Thai Watsadu", stock: 80, unit: "แพ็ค", packSize: 1, unitPkg: "กก." },
//   { itemCode: "CLN-004", itemName: "ผ้าขี้ริ้ว (กิโล)", category: "อุปกรณ์ทำความสะอาด (Cleaning)", itemType: "Consumable", supplierName: "Thai Watsadu", stock: 50, unit: "กิโลกรัม", packSize: 1, unitPkg: "กก." },
//   { itemCode: "CLN-005", itemName: "ไม้ถูพื้นไมโครไฟเบอร์", category: "อุปกรณ์ทำความสะอาด (Cleaning)", itemType: "Returnable", supplierName: "Thai Watsadu", stock: 15, unit: "ด้าม", packSize: 1, unitPkg: "ด้าม" },

//   // Stationery
//   { itemCode: "OFF-001", itemName: "กระดาษ A4 80gsm", category: "เครื่องเขียน (Stationery)", itemType: "Consumable", supplierName: "Office Mate", stock: 200, unit: "รีม", packSize: 500, unitPkg: "แผ่น" },
//   { itemCode: "OFF-002", itemName: "ปากกาลูกลื่น (น้ำเงิน)", category: "เครื่องเขียน (Stationery)", itemType: "Consumable", supplierName: "Office Mate", stock: 50, unit: "กล่อง", packSize: 50, unitPkg: "ด้าม" },
//   { itemCode: "OFF-003", itemName: "แฟ้มสันกว้าง 3 นิ้ว", category: "เครื่องเขียน (Stationery)", itemType: "Consumable", supplierName: "Office Mate", stock: 60, unit: "เล่ม", packSize: 1, unitPkg: "เล่ม" },
//   { itemCode: "OFF-004", itemName: "เทปใส 2 นิ้ว", category: "เครื่องเขียน (Stationery)", itemType: "Consumable", supplierName: "Office Mate", stock: 40, unit: "ม้วน", packSize: 1, unitPkg: "ม้วน" },
//   { itemCode: "OFF-005", itemName: "แม็กเย็บกระดาษ (#10)", category: "เครื่องเขียน (Stationery)", itemType: "Returnable", supplierName: "Office Mate", stock: 20, unit: "อัน", packSize: 1, unitPkg: "อัน" },
//   { itemCode: "OFF-006", itemName: "ลูกแม็ก #10", category: "เครื่องเขียน (Stationery)", itemType: "Consumable", supplierName: "Office Mate", stock: 100, unit: "กล่อง", packSize: 1, unitPkg: "กล่อง" },

//   // IT
//   { itemCode: "IT-001", itemName: "เมาส์ไร้สาย Logitech", category: "อุปกรณ์ไอที (IT Equipment)", itemType: "Returnable", supplierName: "IT City", stock: 15, unit: "อัน", packSize: 1, unitPkg: "อัน" },
//   { itemCode: "IT-002", itemName: "คีย์บอร์ด USB", category: "อุปกรณ์ไอที (IT Equipment)", itemType: "Returnable", supplierName: "IT City", stock: 10, unit: "อัน", packSize: 1, unitPkg: "อัน" },
//   { itemCode: "IT-003", itemName: "สาย LAN CAT6 (3m)", category: "อุปกรณ์ไอที (IT Equipment)", itemType: "Consumable", supplierName: "IT City", stock: 30, unit: "เส้น", packSize: 1, unitPkg: "เส้น" },
//   { itemCode: "IT-004", itemName: "สาย HDMI 2.0", category: "อุปกรณ์ไอที (IT Equipment)", itemType: "Returnable", supplierName: "IT City", stock: 10, unit: "เส้น", packSize: 1, unitPkg: "เส้น" },
//   { itemCode: "IT-005", itemName: "รางปลั๊กไฟ 5 ช่อง", category: "อุปกรณ์ไอที (IT Equipment)", itemType: "Returnable", supplierName: "IT City", stock: 12, unit: "อัน", packSize: 1, unitPkg: "อัน" },
// ];

// /**
//  * ฟังก์ชันสร้างข้อมูลจำลองเพิ่ม (Mock Generator)
//  * เพื่อให้มีรายการสินค้าเยอะๆ (350+ รายการ) สำหรับทดสอบ Pagination 50 รายการ/หน้า
//  */
// const generateLargeStockData = () => {
//   let largeData = [...baseStockItems]; // เริ่มต้นด้วยข้อมูลจริงที่มีอยู่
//   const multipliers = 10; // จำนวนรอบที่จะปั๊มข้อมูล (ประมาณ 40 รายการ * 10 = 400 รายการ)

//   for (let i = 1; i <= multipliers; i++) {
//     baseStockItems.forEach((item) => {
//       // สร้าง ID ใหม่ เช่น HT-001-V1, HT-001-V2
//       const newCode = `${item.itemCode}-V${i}`;
      
//       // สร้างชื่อใหม่เล็กน้อยเพื่อให้แตกต่างกัน
//       const variants = ["(Grade A)", "(Grade B)", "(Import)", "(Spare)", "(OEM)", "(Old Stock)"];
//       const randomVariant = variants[Math.floor(Math.random() * variants.length)];
//       const newName = `${item.itemName} ${randomVariant} #Set${i}`;

//       // สุ่มจำนวน Stock เพื่อความสมจริง
//       const randomStock = Math.floor(Math.random() * 100) + 1;

//       largeData.push({
//         ...item,
//         itemCode: newCode,
//         itemName: newName,
//         stock: randomStock,
//       });
//     });
//   }

//   return largeData;
// };

// // Export ข้อมูลชุดใหญ่ (จะแทนที่ initialStockData เดิม)
// export const initialStockData = generateLargeStockData();

// // ==========================================
// // 3. TRANSACTION DATA (เพิ่ม Mock Data เป็น 10 กลุ่ม)
// // ==========================================

// // ข้อมูลเริ่มต้น 5 กลุ่ม (MA, PD, AD, WH, ENG)
// const initialMockOrders = [
//   {
//     groupName: "แผนกซ่อมบำรุง (Maintenance)",
//     groupCode: "MA",
//     orders: [
//       {
//         id: "REQ-2501-001",
//         supplier: "PM เครื่องจักรไลน์ผลิต 1 (งานใหญ่)",
//         orderbookId: "WO-2501-001",
//         orderDate: "10/01/2025",
//         vendorCode: "MIXED",
//         vendorName: "รายการอะไหล่ซ่อมบำรุง",
//         unit: "15",
//         packSize: "รายการ",
//         deliveryDate: "11/01/2025",
//         status: "อนุมัติ",
//         details: { requester: "สมชาย ใจดี", department: "ซ่อมบำรุง (MA)", requestDate: "10/01/2025 08:00", approver: "หน.วิศวกร", approveDate: "10/01/2025 09:00", contact: "ทีม PM1", vendorInvoice: "REF-MA-001", rejectionReason: null },
//         items: [
//           { "#": 1, itemCode: "MEC-001", itemName: "ตลับลูกปืน 6205-2Z", qty: "8", unit: "ชิ้น", itemType: "Consumable" },
//           { "#": 2, itemCode: "MEC-002", itemName: "ตลับลูกปืน 6309-2RS", qty: "4", unit: "ชิ้น", itemType: "Consumable" },
//           { "#": 3, itemCode: "MEC-004", itemName: "ออยซีล 35x50x10", qty: "6", unit: "ชิ้น", itemType: "Consumable" },
//           { "#": 4, itemCode: "MEC-005", itemName: "ประเก็นเหลว", qty: "2", unit: "หลอด", itemType: "Consumable" },
//           { "#": 5, itemCode: "CHM-002", itemName: "จารบีทนความร้อน", qty: "3", unit: "กระปุก", itemType: "Consumable" },
//           { "#": 6, itemCode: "CHM-003", itemName: "สเปรย์ WD-40", qty: "4", unit: "กระป๋อง", itemType: "Consumable" },
//           { "#": 7, itemCode: "CON-001", itemName: "น็อต M6x25mm (ถุง)", qty: "2", unit: "ถุง", itemType: "Consumable" },
//           { "#": 8, itemCode: "CON-002", itemName: "น็อตตัวเมีย M6 (ถุง)", qty: "2", unit: "ถุง", itemType: "Consumable" },
//           { "#": 9, itemCode: "CON-003", itemName: "แหวนอีแปะ M6 (ถุง)", qty: "2", unit: "ถุง", itemType: "Consumable" },
//           { "#": 10, itemCode: "CLN-004", itemName: "ผ้าขี้ริ้ว (กิโล)", qty: "5", unit: "กิโลกรัม", itemType: "Consumable" },
//           { "#": 11, itemCode: "HT-002", itemName: "ชุดประแจแหวนข้าง 8-24mm", qty: "1", unit: "ชุด", itemType: "Returnable", returnDate: "15/01/2025" },
//           { "#": 12, itemCode: "HT-004", itemName: "คีมล็อค 10 นิ้ว", qty: "1", unit: "อัน", itemType: "Returnable", returnDate: "15/01/2025" },
//           { "#": 13, itemCode: "PPE-001", itemName: "ถุงมือผ้าเคลือบยาง", qty: "6", unit: "คู่", itemType: "Consumable" },
//           { "#": 14, itemCode: "MEC-003", itemName: "สายพานร่อง B52", qty: "2", unit: "เส้น", itemType: "Consumable" },
//           { "#": 15, itemCode: "CHM-005", itemName: "น้ำยาล้างสนิม", qty: "1", unit: "แกลลอน", itemType: "Consumable" }
//         ]
//       },
//       {
//         id: "REQ-2501-005",
//         supplier: "ซ่อมระบบไฟฟ้าโรงงานโซน B",
//         orderbookId: "WO-2501-005",
//         orderDate: "12/01/2025",
//         vendorCode: "EL-LOT",
//         vendorName: "อุปกรณ์ไฟฟ้า",
//         unit: "12",
//         packSize: "รายการ",
//         deliveryDate: "13/01/2025",
//         status: "รออนุมัติ",
//         details: { requester: "วิชัย ไฟฟ้า", department: "ซ่อมบำรุง (MA)", requestDate: "12/01/2025 10:30", approver: "-", approveDate: "-", contact: "ช่างไฟ", vendorInvoice: "-", rejectionReason: null },
//         items: [
//           { "#": 1, itemCode: "EL-001", itemName: "สายไฟ VCT 2x2.5 sq.mm", qty: "100", unit: "เมตร", itemType: "Consumable" },
//           { "#": 2, itemCode: "EL-002", itemName: "สายไฟ THW 1x4 sq.mm (ดำ)", qty: "50", unit: "เมตร", itemType: "Consumable" },
//           { "#": 3, itemCode: "EL-003", itemName: "หลอดไฟ LED T8 18W", qty: "20", unit: "หลอด", itemType: "Consumable" },
//           { "#": 4, itemCode: "EL-005", itemName: "เทปพันสายไฟ 3M", qty: "10", unit: "ม้วน", itemType: "Consumable" },
//           { "#": 5, itemCode: "EL-007", itemName: "เคเบิ้ลไทร์ 6 นิ้ว (ถุง)", qty: "5", unit: "ถุง", itemType: "Consumable" },
//           { "#": 6, itemCode: "EL-004", itemName: "เบรกเกอร์ 20A", qty: "4", unit: "ตัว", itemType: "Consumable" },
//           { "#": 7, itemCode: "CON-007", itemName: "สกรูเกลียวปล่อย #7 (ถุง)", qty: "2", unit: "ถุง", itemType: "Consumable" },
//           { "#": 8, itemCode: "CON-008", itemName: "พุกพลาสติก #7 (ถุง)", qty: "2", unit: "ถุง", itemType: "Consumable" },
//           { "#": 9, itemCode: "PT-001", itemName: "สว่านกระแทก Makita HP1630", qty: "1", unit: "เครื่อง", itemType: "Returnable", returnDate: "14/01/2025" },
//           { "#": 10, itemCode: "PT-003", itemName: "สว่านไร้สาย 18V", qty: "1", unit: "ชุด", itemType: "Returnable", returnDate: "14/01/2025" },
//           { "#": 11, itemCode: "HT-003", itemName: "ไขควงตอกกระแทก", qty: "1", unit: "ชุด", itemType: "Returnable", returnDate: "14/01/2025" },
//           { "#": 12, itemCode: "PPE-002", itemName: "หมวกนิรภัยขาว", qty: "2", unit: "ใบ", itemType: "Returnable", returnDate: "14/01/2025" }
//         ]
//       },
//       {
//         id: "REQ-2501-010",
//         supplier: "เบิกอะไหล่สำรองเข้า Stock Maintenance",
//         orderbookId: "WO-2501-010",
//         orderDate: "27/01/2025",
//         vendorCode: "MIX-SPARE",
//         vendorName: "อะไหล่สำรอง",
//         unit: "10",
//         packSize: "รายการ",
//         deliveryDate: "28/01/2025",
//         status: "อนุมัติ",
//         details: { requester: "หน.วิศวกร", department: "ซ่อมบำรุง (MA)", requestDate: "27/01/2025 09:00", approver: "ผจก.โรงงาน", approveDate: "27/01/2025 14:00", contact: "MA Office", vendorInvoice: "REF-MA-STK", rejectionReason: null },
//         items: [
//           { "#": 1, itemCode: "MEC-001", itemName: "ตลับลูกปืน 6205-2Z", qty: "20", unit: "ชิ้น", itemType: "Consumable" },
//           { "#": 2, itemCode: "MEC-003", itemName: "สายพานร่อง B52", qty: "10", unit: "เส้น", itemType: "Consumable" },
//           { "#": 3, itemCode: "CON-004", itemName: "ใบตัดเหล็ก 4 นิ้ว", qty: "50", unit: "ใบ", itemType: "Consumable" },
//           { "#": 4, itemCode: "CON-005", itemName: "ใบเจียร 4 นิ้ว", qty: "30", unit: "ใบ", itemType: "Consumable" },
//           { "#": 5, itemCode: "CON-006", itemName: "ลวดเชื่อม 2.6mm", qty: "10", unit: "กล่อง", itemType: "Consumable" },
//           { "#": 6, itemCode: "CHM-003", itemName: "สเปรย์ WD-40", qty: "24", unit: "กระป๋อง", itemType: "Consumable" },
//           { "#": 7, itemCode: "EL-005", itemName: "เทปพันสายไฟ 3M", qty: "20", unit: "ม้วน", itemType: "Consumable" },
//           { "#": 8, itemCode: "HT-006", itemName: "ตลับเมตร 5 เมตร", qty: "5", unit: "อัน", itemType: "Returnable", returnDate: "28/02/2025" },
//           { "#": 9, itemCode: "HT-001", itemName: "ค้อนหงอน", qty: "2", unit: "อัน", itemType: "Returnable", returnDate: "28/02/2025" },
//           { "#": 10, itemCode: "PPE-001", itemName: "ถุงมือผ้าเคลือบยาง", qty: "50", unit: "คู่", itemType: "Consumable" }
//         ]
//       },
//       {
//         id: "REQ-2501-013",
//         supplier: "ซ่อมปั๊มน้ำโรงอาหาร",
//         orderbookId: "WO-2501-013",
//         orderDate: "30/01/2025",
//         vendorCode: "PLUMBING",
//         vendorName: "อุปกรณ์ประปา",
//         unit: "5",
//         packSize: "รายการ",
//         deliveryDate: "30/01/2025",
//         status: "ไม่อนุมัติ",
//         details: { requester: "ช่างประปา", department: "ซ่อมบำรุง (MA)", requestDate: "30/01/2025 08:00", approver: "หน.วิศวกร", approveDate: "30/01/2025 09:30", contact: "โรงอาหาร", vendorInvoice: "-", rejectionReason: "รอตรวจสอบงบประมาณ" },
//         items: [
//           { "#": 1, itemCode: "CON-003", itemName: "แหวนอีแปะ M6", qty: "1", unit: "ถุง", itemType: "Consumable" },
//           { "#": 2, itemCode: "EL-005", itemName: "เทปพันสายไฟ", qty: "2", unit: "ม้วน", itemType: "Consumable" },
//           { "#": 3, itemCode: "HT-005", itemName: "ประแจเลื่อน 12 นิ้ว", qty: "1", unit: "อัน", itemType: "Returnable" },
//           { "#": 4, itemCode: "PPE-001", itemName: "ถุงมือผ้า", qty: "2", unit: "คู่", itemType: "Consumable" },
//           { "#": 5, itemCode: "MEC-005", itemName: "ประเก็นเหลว", qty: "1", unit: "หลอด", itemType: "Consumable" }
//         ]
//       },
//       {
//         id: "REQ-2501-016",
//         supplier: "เปลี่ยนถ่ายน้ำมันเครื่องรถโฟล์คลิฟท์",
//         orderbookId: "WO-2501-016",
//         orderDate: "02/02/2025",
//         vendorCode: "FORKLIFT",
//         vendorName: "อะไหล่รถโฟล์คลิฟท์",
//         unit: "6",
//         packSize: "รายการ",
//         deliveryDate: "03/02/2025",
//         status: "รออนุมัติ",
//         details: { requester: "ช่างยนต์", department: "ซ่อมบำรุง (MA)", requestDate: "02/02/2025 13:00", approver: "-", approveDate: "-", contact: "Garage", vendorInvoice: "-", rejectionReason: null },
//         items: [
//           { "#": 1, itemCode: "CHM-001", itemName: "น้ำมันไฮดรอลิก 68", qty: "2", unit: "ถัง", itemType: "Consumable" },
//           { "#": 2, itemCode: "CHM-002", itemName: "จารบี", qty: "1", unit: "กระปุก", itemType: "Consumable" },
//           { "#": 3, itemCode: "CHM-003", itemName: "WD-40", qty: "2", unit: "กระป๋อง", itemType: "Consumable" },
//           { "#": 4, itemCode: "CLN-004", itemName: "ผ้าขี้ริ้ว", qty: "5", unit: "กก.", itemType: "Consumable" },
//           { "#": 5, itemCode: "HT-002", itemName: "ชุดประแจ", qty: "1", unit: "ชุด", itemType: "Returnable", returnDate: "03/02/2025" },
//           { "#": 6, itemCode: "PPE-001", itemName: "ถุงมือผ้า", qty: "4", unit: "คู่", itemType: "Consumable" }
//         ]
//       }
//     ]
//   },
//   {
//     groupName: "ฝ่ายผลิต (Production)",
//     groupCode: "PD",
//     orders: [
//       {
//         id: "REQ-2501-002",
//         supplier: "เบิก PPE และวัสดุสิ้นเปลือง Line 1",
//         orderbookId: "MR-2501-002",
//         orderDate: "11/01/2025",
//         vendorCode: "SUP-PD1",
//         vendorName: "วัสดุสิ้นเปลืองฝ่ายผลิต",
//         unit: "10",
//         packSize: "รายการ",
//         deliveryDate: "11/01/2025",
//         status: "อนุมัติ",
//         details: { requester: "หัวหน้าไลน์ 1", department: "ฝ่ายผลิต ไลน์ 1 (PD-1)", requestDate: "11/01/2025 08:15", approver: "ผจก.โรงงาน", approveDate: "11/01/2025 08:45", contact: "Line 1", vendorInvoice: "REF-PD-002", rejectionReason: null },
//         items: [
//           { "#": 1, itemCode: "PPE-001", itemName: "ถุงมือผ้าเคลือบยาง", qty: "50", unit: "คู่", itemType: "Consumable" },
//           { "#": 2, itemCode: "PPE-005", itemName: "ที่อุดหูมีสาย", qty: "100", unit: "คู่", itemType: "Consumable" },
//           { "#": 3, itemCode: "PPE-006", itemName: "หน้ากาก N95", qty: "200", unit: "ชิ้น", itemType: "Consumable" },
//           { "#": 4, itemCode: "CON-004", itemName: "ใบตัดเหล็ก 4 นิ้ว", qty: "50", unit: "ใบ", itemType: "Consumable" },
//           { "#": 5, itemCode: "CON-005", itemName: "ใบเจียร 4 นิ้ว", qty: "30", unit: "ใบ", itemType: "Consumable" },
//           { "#": 6, itemCode: "CHM-003", itemName: "สเปรย์ WD-40", qty: "12", unit: "กระป๋อง", itemType: "Consumable" },
//           { "#": 7, itemCode: "CLN-001", itemName: "ไม้กวาดดอกหญ้า", qty: "5", unit: "ด้าม", itemType: "Consumable" },
//           { "#": 8, itemCode: "CLN-003", itemName: "ถุงขยะดำ 36x45", qty: "10", unit: "แพ็ค", itemType: "Consumable" },
//           { "#": 9, itemCode: "HT-008", itemName: "คัตเตอร์ใหญ่", qty: "10", unit: "อัน", itemType: "Consumable" },
//           { "#": 10, itemCode: "OFF-002", itemName: "ปากกาลูกลื่น (น้ำเงิน)", qty: "5", unit: "กล่อง", itemType: "Consumable" }
//         ]
//       },
//       {
//         id: "REQ-2501-006",
//         supplier: "อุปกรณ์ความปลอดภัยพนักงานใหม่ (Line 2)",
//         orderbookId: "MR-2501-006",
//         orderDate: "18/01/2025",
//         vendorCode: "PPE-NEW",
//         vendorName: "ชุด PPE พนักงานใหม่",
//         unit: "8",
//         packSize: "รายการ",
//         deliveryDate: "18/01/2025",
//         status: "อนุมัติ",
//         details: { requester: "หัวหน้าไลน์ 2", department: "ฝ่ายผลิต ไลน์ 2 (PD-2)", requestDate: "18/01/2025 09:00", approver: "จป.วิชาชีพ", approveDate: "18/01/2025 09:30", contact: "HR Recruit", vendorInvoice: "REF-PPE-006", rejectionReason: null },
//         items: [
//           { "#": 1, itemCode: "PPE-002", itemName: "หมวกนิรภัยขาว", qty: "5", unit: "ใบ", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 2, itemCode: "PPE-004", itemName: "รองเท้าเซฟตี้ #42", qty: "5", unit: "คู่", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 3, itemCode: "PPE-007", itemName: "เสื้อสะท้อนแสง", qty: "5", unit: "ตัว", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 4, itemCode: "PPE-003", itemName: "แว่นตานิรภัยใส", qty: "5", unit: "อัน", itemType: "Consumable" },
//           { "#": 5, itemCode: "PPE-001", itemName: "ถุงมือผ้าเคลือบยาง", qty: "10", unit: "คู่", itemType: "Consumable" },
//           { "#": 6, itemCode: "PPE-005", itemName: "ที่อุดหูมีสาย", qty: "5", unit: "คู่", itemType: "Consumable" },
//           { "#": 7, itemCode: "OFF-002", itemName: "ปากกาลูกลื่น (น้ำเงิน)", qty: "1", unit: "กล่อง", itemType: "Consumable" },
//           { "#": 8, itemCode: "HT-008", itemName: "คัตเตอร์ใหญ่", qty: "5", unit: "อัน", itemType: "Consumable" }
//         ]
//       },
//       {
//         id: "REQ-2501-012",
//         supplier: "ขอเบิกอุปกรณ์แพ็คสินค้าด่วน",
//         orderbookId: "MR-2501-012",
//         orderDate: "29/01/2025",
//         vendorCode: "PACKING",
//         vendorName: "อุปกรณ์แพ็ค",
//         unit: "6",
//         packSize: "รายการ",
//         deliveryDate: "29/01/2025",
//         status: "รออนุมัติ",
//         details: { requester: "หน.แพ็คกิ้ง", department: "ฝ่ายผลิต (PD)", requestDate: "29/01/2025 15:00", approver: "-", approveDate: "-", contact: "Packing Zone", vendorInvoice: "-", rejectionReason: null },
//         items: [
//           { "#": 1, itemCode: "OFF-004", itemName: "เทปใส 2 นิ้ว", qty: "50", unit: "ม้วน", itemType: "Consumable" },
//           { "#": 2, itemCode: "HT-008", itemName: "คัตเตอร์ใหญ่", qty: "10", unit: "อัน", itemType: "Consumable" },
//           { "#": 3, itemCode: "OFF-002", itemName: "ปากกาลูกลื่น", qty: "5", unit: "กล่อง", itemType: "Consumable" },
//           { "#": 4, itemCode: "PPE-001", itemName: "ถุงมือผ้า", qty: "20", unit: "คู่", itemType: "Consumable" },
//           { "#": 5, itemCode: "EL-007", itemName: "เคเบิ้ลไทร์", qty: "10", unit: "ถุง", itemType: "Consumable" },
//           { "#": 6, itemCode: "OFF-006", itemName: "ลูกแม็ก #10", qty: "20", unit: "กล่อง", itemType: "Consumable" }
//         ]
//       },
//       {
//         id: "REQ-2501-015",
//         supplier: "เบิกของใช้ล่วงหน้า Line 2",
//         orderbookId: "MR-2501-015",
//         orderDate: "01/02/2025",
//         vendorCode: "PD-FUTURE",
//         vendorName: "วัสดุล่วงหน้า",
//         unit: "5",
//         packSize: "รายการ",
//         deliveryDate: "-",
//         status: "ยกเลิก",
//         details: { requester: "หัวหน้าไลน์ 2", department: "ฝ่ายผลิต (PD-2)", requestDate: "01/02/2025 08:00", approver: "-", approveDate: "-", contact: "Line 2", vendorInvoice: "-", rejectionReason: "ยกเลิกแผนการผลิต" },
//         items: [
//           { "#": 1, itemCode: "PPE-001", itemName: "ถุงมือผ้า", qty: "100", unit: "คู่", itemType: "Consumable" },
//           { "#": 2, itemCode: "PPE-005", itemName: "ที่อุดหู", qty: "100", unit: "คู่", itemType: "Consumable" },
//           { "#": 3, itemCode: "CON-004", itemName: "ใบตัด 4 นิ้ว", qty: "50", unit: "ใบ", itemType: "Consumable" },
//           { "#": 4, itemCode: "CLN-003", itemName: "ถุงขยะดำ", qty: "20", unit: "แพ็ค", itemType: "Consumable" },
//           { "#": 5, itemCode: "CHM-003", itemName: "WD-40", qty: "12", unit: "กระป๋อง", itemType: "Consumable" }
//         ]
//       }
//     ]
//   },
//   // 3. Admin & Office
//   {
//     groupName: "ธุรการและสำนักงาน (Admin & Office)",
//     groupCode: "AD",
//     orders: [
//       {
//         id: "REQ-2501-004",
//         supplier: "เบิกเครื่องเขียนและอุปกรณ์สำนักงาน Q1",
//         orderbookId: "OFF-2501-004",
//         orderDate: "15/01/2025",
//         vendorCode: "OFFICE",
//         vendorName: "อุปกรณ์สำนักงานรวม",
//         unit: "14",
//         packSize: "รายการ",
//         deliveryDate: "16/01/2025",
//         status: "ไม่อนุมัติ",
//         details: { requester: "สุดา ธุรการ", department: "ธุรการ (AD)", requestDate: "15/01/2025 10:30", approver: "ผจก.ทั่วไป", approveDate: "15/01/2025 11:00", contact: "Admin Room", vendorInvoice: "-", rejectionReason: "เบิกกระดาษเกินโควต้า (ปกติ 20 รีม)" },
//         items: [
//           { "#": 1, itemCode: "OFF-001", itemName: "กระดาษ A4 80gsm", qty: "50", unit: "รีม", itemType: "Consumable" },
//           { "#": 2, itemCode: "OFF-002", itemName: "ปากกาลูกลื่น (น้ำเงิน)", qty: "10", unit: "กล่อง", itemType: "Consumable" },
//           { "#": 3, itemCode: "OFF-003", itemName: "แฟ้มสันกว้าง 3 นิ้ว", qty: "20", unit: "เล่ม", itemType: "Consumable" },
//           { "#": 4, itemCode: "OFF-004", itemName: "เทปใส 2 นิ้ว", qty: "12", unit: "ม้วน", itemType: "Consumable" },
//           { "#": 5, itemCode: "OFF-005", itemName: "แม็กเย็บกระดาษ (#10)", qty: "5", unit: "อัน", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 6, itemCode: "OFF-006", itemName: "ลูกแม็ก #10", qty: "20", unit: "กล่อง", itemType: "Consumable" },
//           { "#": 7, itemCode: "CLN-003", itemName: "ถุงขยะดำ 36x45", qty: "10", unit: "แพ็ค", itemType: "Consumable" },
//           { "#": 8, itemCode: "CLN-002", itemName: "น้ำยาถูพื้น (5L)", qty: "2", unit: "แกลลอน", itemType: "Consumable" },
//           { "#": 9, itemCode: "IT-001", itemName: "เมาส์ไร้สาย Logitech", qty: "2", unit: "อัน", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 10, itemCode: "IT-002", itemName: "คีย์บอร์ด USB", qty: "1", unit: "อัน", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 11, itemCode: "IT-005", itemName: "รางปลั๊กไฟ 5 ช่อง", qty: "3", unit: "อัน", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 12, itemCode: "HT-008", itemName: "คัตเตอร์ใหญ่", qty: "5", unit: "อัน", itemType: "Consumable" },
//           { "#": 13, itemCode: "HT-006", itemName: "ตลับเมตร 5 เมตร", qty: "1", unit: "อัน", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 14, itemCode: "EL-003", itemName: "หลอดไฟ LED T8 18W", qty: "10", unit: "หลอด", itemType: "Consumable" }
//         ]
//       },
//       {
//         id: "REQ-2501-007",
//         supplier: "ติดตั้งคอมพิวเตอร์พนักงานใหม่ 3 ท่าน",
//         orderbookId: "IT-2501-007",
//         orderDate: "20/01/2025",
//         vendorCode: "IT-SET",
//         vendorName: "อุปกรณ์ไอที",
//         unit: "10",
//         packSize: "รายการ",
//         deliveryDate: "21/01/2025",
//         status: "รออนุมัติ",
//         details: { requester: "เอก ไอที", department: "ไอที (IT)", requestDate: "20/01/2025 09:00", approver: "-", approveDate: "-", contact: "IT Support", vendorInvoice: "-", rejectionReason: null },
//         items: [
//           { "#": 1, itemCode: "IT-001", itemName: "เมาส์ไร้สาย Logitech", qty: "3", unit: "อัน", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 2, itemCode: "IT-002", itemName: "คีย์บอร์ด USB", qty: "3", unit: "อัน", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 3, itemCode: "IT-003", itemName: "สาย LAN CAT6 (3m)", qty: "5", unit: "เส้น", itemType: "Consumable" },
//           { "#": 4, itemCode: "IT-004", itemName: "สาย HDMI 2.0", qty: "3", unit: "เส้น", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 5, itemCode: "IT-005", itemName: "รางปลั๊กไฟ 5 ช่อง", qty: "3", unit: "อัน", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 6, itemCode: "EL-007", itemName: "เคเบิ้ลไทร์ 6 นิ้ว (ถุง)", qty: "1", unit: "ถุง", itemType: "Consumable" },
//           { "#": 7, itemCode: "OFF-001", itemName: "กระดาษ A4 80gsm", qty: "3", unit: "รีม", itemType: "Consumable" },
//           { "#": 8, itemCode: "OFF-002", itemName: "ปากกาลูกลื่น (น้ำเงิน)", qty: "1", unit: "กล่อง", itemType: "Consumable" },
//           { "#": 9, itemCode: "OFF-003", itemName: "แฟ้มสันกว้าง 3 นิ้ว", qty: "3", unit: "เล่ม", itemType: "Consumable" },
//           { "#": 10, itemCode: "CLN-004", itemName: "ผ้าขี้ริ้ว (กิโล)", qty: "1", unit: "กิโลกรัม", itemType: "Consumable" }
//         ]
//       },
//       {
//         id: "REQ-2501-014",
//         supplier: "เบิกของใช้ HR",
//         orderbookId: "HR-2501-014",
//         orderDate: "31/01/2025",
//         vendorCode: "HR-SUP",
//         vendorName: "ของใช้ทั่วไป",
//         unit: "5",
//         packSize: "รายการ",
//         deliveryDate: "31/01/2025",
//         status: "อนุมัติ",
//         details: { requester: "นารี HR", department: "ทรัพยากรบุคคล (HR)", requestDate: "31/01/2025 08:30", approver: "ผจก.HR", approveDate: "31/01/2025 09:00", contact: "HR Dept", vendorInvoice: "-", rejectionReason: null },
//         items: [
//           { "#": 1, itemCode: "OFF-001", itemName: "กระดาษ A4", qty: "5", unit: "รีม", itemType: "Consumable" },
//           { "#": 2, itemCode: "OFF-002", itemName: "ปากกา", qty: "2", unit: "กล่อง", itemType: "Consumable" },
//           { "#": 3, itemCode: "OFF-004", itemName: "เทปใส", qty: "5", unit: "ม้วน", itemType: "Consumable" },
//           { "#": 4, itemCode: "CLN-003", itemName: "ถุงขยะ", qty: "5", unit: "แพ็ค", itemType: "Consumable" },
//           { "#": 5, itemCode: "PPE-006", itemName: "หน้ากาก N95", qty: "2", unit: "กล่อง", itemType: "Consumable" }
//         ]
//       }
//     ]
//   },
//   // 4. Warehouse & Cleaning
//   {
//     groupName: "คลังสินค้าและความสะอาด (WH & Cleaning)",
//     groupCode: "WH",
//     orders: [
//       {
//         id: "REQ-2501-008",
//         supplier: "Big Cleaning Day ประจำเดือน",
//         orderbookId: "CL-2501-008",
//         orderDate: "25/01/2025",
//         vendorCode: "CLN-MIX",
//         vendorName: "อุปกรณ์ทำความสะอาด",
//         unit: "11",
//         packSize: "รายการ",
//         deliveryDate: "25/01/2025",
//         status: "อนุมัติ",
//         details: { requester: "ป้าสมศรี", department: "ธุรการ (แม่บ้าน)", requestDate: "25/01/2025 07:00", approver: "หน.ธุรการ", approveDate: "25/01/2025 07:30", contact: "แม่บ้าน", vendorInvoice: "REF-CL-008", rejectionReason: null },
//         items: [
//           { "#": 1, itemCode: "CLN-001", itemName: "ไม้กวาดดอกหญ้า", qty: "10", unit: "ด้าม", itemType: "Consumable" },
//           { "#": 2, itemCode: "CLN-002", itemName: "น้ำยาถูพื้น (5L)", qty: "5", unit: "แกลลอน", itemType: "Consumable" },
//           { "#": 3, itemCode: "CLN-003", itemName: "ถุงขยะดำ 36x45", qty: "20", unit: "แพ็ค", itemType: "Consumable" },
//           { "#": 4, itemCode: "CLN-004", itemName: "ผ้าขี้ริ้ว (กิโล)", qty: "10", unit: "กิโลกรัม", itemType: "Consumable" },
//           { "#": 5, itemCode: "CLN-005", itemName: "ไม้ถูพื้นไมโครไฟเบอร์", qty: "5", unit: "ด้าม", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 6, itemCode: "PPE-001", itemName: "ถุงมือผ้าเคลือบยาง", qty: "12", unit: "คู่", itemType: "Consumable" },
//           { "#": 7, itemCode: "PPE-006", itemName: "หน้ากาก N95", qty: "20", unit: "ชิ้น", itemType: "Consumable" },
//           { "#": 8, itemCode: "CHM-005", itemName: "น้ำยาล้างสนิม", qty: "2", unit: "แกลลอน", itemType: "Consumable" },
//           { "#": 9, itemCode: "HT-008", itemName: "คัตเตอร์ใหญ่", qty: "3", unit: "อัน", itemType: "Consumable" },
//           { "#": 10, itemCode: "CON-003", itemName: "แหวนอีแปะ M6 (ถุง)", qty: "1", unit: "ถุง", itemType: "Consumable" },
//           { "#": 11, itemCode: "EL-003", itemName: "หลอดไฟ LED T8 18W", qty: "5", unit: "หลอด", itemType: "Consumable" }
//         ]
//       },
//       {
//         id: "REQ-2501-009",
//         supplier: "จัดระเบียบสต็อกใหม่ (ยกเลิก)",
//         orderbookId: "WH-2501-009",
//         orderDate: "26/01/2025",
//         vendorCode: "ORG-SET",
//         vendorName: "อุปกรณ์จัดเก็บ",
//         unit: "8",
//         packSize: "รายการ",
//         deliveryDate: "-",
//         status: "ยกเลิก",
//         details: { requester: "สมศักดิ์ คลัง", department: "คลังสินค้า (WH)", requestDate: "26/01/2025 10:00", approver: "-", approveDate: "-", contact: "Warehouse", vendorInvoice: "-", rejectionReason: "เปลี่ยนไปใช้วัสดุที่มีอยู่เดิม" },
//         items: [
//           { "#": 1, itemCode: "OFF-004", itemName: "เทปใส 2 นิ้ว", qty: "20", unit: "ม้วน", itemType: "Consumable" },
//           { "#": 2, itemCode: "OFF-002", itemName: "ปากกาลูกลื่น (น้ำเงิน)", qty: "5", unit: "กล่อง", itemType: "Consumable" },
//           { "#": 3, itemCode: "HT-008", itemName: "คัตเตอร์ใหญ่", qty: "10", unit: "อัน", itemType: "Consumable" },
//           { "#": 4, itemCode: "PPE-001", itemName: "ถุงมือผ้าเคลือบยาง", qty: "10", unit: "คู่", itemType: "Consumable" },
//           { "#": 5, itemCode: "EL-007", itemName: "เคเบิ้ลไทร์ 6 นิ้ว (ถุง)", qty: "20", unit: "ถุง", itemType: "Consumable" },
//           { "#": 6, itemCode: "CON-007", itemName: "สกรูเกลียวปล่อย #7 (ถุง)", qty: "5", unit: "ถุง", itemType: "Consumable" },
//           { "#": 7, itemCode: "CON-008", itemName: "พุกพลาสติก #7 (ถุง)", qty: "5", unit: "ถุง", itemType: "Consumable" },
//           { "#": 8, itemCode: "PT-003", itemName: "สว่านไร้สาย 18V", qty: "1", unit: "ชุด", itemType: "Returnable" }
//         ]
//       },
//       {
//         id: "REQ-2501-011",
//         supplier: "ซ่อมพาเลทและชั้นวาง",
//         orderbookId: "WH-2501-011",
//         orderDate: "28/01/2025",
//         vendorCode: "WH-REPAIR",
//         vendorName: "วัสดุซ่อมแซม",
//         unit: "6",
//         packSize: "รายการ",
//         deliveryDate: "28/01/2025",
//         status: "อนุมัติ",
//         details: { requester: "สมศักดิ์ คลัง", department: "คลังสินค้า (WH)", requestDate: "28/01/2025 11:00", approver: "ผจก.คลัง", approveDate: "28/01/2025 11:30", contact: "Warehouse", vendorInvoice: "REF-WH-011", rejectionReason: null },
//         items: [
//           { "#": 1, itemCode: "HT-001", itemName: "ค้อนหงอน", qty: "2", unit: "อัน", itemType: "Returnable", returnDate: "05/02/2025" },
//           { "#": 2, itemCode: "HT-007", itemName: "เลื่อยลันดา", qty: "1", unit: "ปื้น", itemType: "Returnable", returnDate: "05/02/2025" },
//           { "#": 3, itemCode: "CON-001", itemName: "น็อต M6", qty: "5", unit: "ถุง", itemType: "Consumable" },
//           { "#": 4, itemCode: "CON-003", itemName: "แหวนอีแปะ", qty: "2", unit: "ถุง", itemType: "Consumable" },
//           { "#": 5, itemCode: "PPE-001", itemName: "ถุงมือผ้า", qty: "5", unit: "คู่", itemType: "Consumable" },
//           { "#": 6, itemCode: "CHM-003", itemName: "WD-40", qty: "2", unit: "กระป๋อง", itemType: "Consumable" }
//         ]
//       }
//     ]
//   },
//   // 5. Engineering & Safety (New Group)
//   {
//     groupName: "วิศวกรรมและความปลอดภัย (Engineering & Safety)",
//     groupCode: "ENG",
//     orders: [
//       {
//         id: "REQ-2501-017",
//         supplier: "ตรวจสอบความปลอดภัยโรงงาน Q1",
//         orderbookId: "SF-2501-017",
//         orderDate: "03/02/2025",
//         vendorCode: "SAFETY",
//         vendorName: "อุปกรณ์ตรวจสอบ",
//         unit: "7",
//         packSize: "รายการ",
//         deliveryDate: "03/02/2025",
//         status: "อนุมัติ",
//         details: { requester: "จป.สมชาย", department: "ความปลอดภัย (SHE)", requestDate: "03/02/2025 08:00", approver: "ผจก.โรงงาน", approveDate: "03/02/2025 08:30", contact: "Safety Office", vendorInvoice: "REF-SF-017", rejectionReason: null },
//         items: [
//           { "#": 1, itemCode: "PPE-002", itemName: "หมวกนิรภัยขาว", qty: "10", unit: "ใบ", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 2, itemCode: "PPE-007", itemName: "เสื้อสะท้อนแสง", qty: "10", unit: "ตัว", itemType: "Returnable", returnDate: "31/12/2025" },
//           { "#": 3, itemCode: "PPE-003", itemName: "แว่นตานิรภัย", qty: "20", unit: "อัน", itemType: "Consumable" },
//           { "#": 4, itemCode: "HT-006", itemName: "ตลับเมตร", qty: "2", unit: "อัน", itemType: "Returnable", returnDate: "05/02/2025" },
//           { "#": 5, itemCode: "EL-003", itemName: "หลอดไฟ LED", qty: "10", unit: "หลอด", itemType: "Consumable" },
//           { "#": 6, itemCode: "OFF-002", itemName: "ปากกา", qty: "1", unit: "กล่อง", itemType: "Consumable" },
//           { "#": 7, itemCode: "OFF-003", itemName: "แฟ้ม", qty: "5", unit: "เล่ม", itemType: "Consumable" }
//         ]
//       },
//       {
//         id: "REQ-2501-018",
//         supplier: "ทดลองเครื่องมือใหม่",
//         orderbookId: "EN-2501-018",
//         orderDate: "04/02/2025",
//         vendorCode: "TEST-TOOL",
//         vendorName: "เครื่องมือทดสอบ",
//         unit: "3",
//         packSize: "รายการ",
//         deliveryDate: "05/02/2025",
//         status: "รออนุมัติ",
//         details: { requester: "วิศวกรใหม่", department: "วิศวกรรม (ENG)", requestDate: "04/02/2025 14:00", approver: "-", approveDate: "-", contact: "Eng Room", vendorInvoice: "-", rejectionReason: null },
//         items: [
//           { "#": 1, itemCode: "PT-003", itemName: "สว่านไร้สาย 18V", qty: "1", unit: "ชุด", itemType: "Returnable", returnDate: "10/02/2025" },
//           { "#": 2, itemCode: "HT-002", itemName: "ชุดประแจ", qty: "1", unit: "ชุด", itemType: "Returnable", returnDate: "10/02/2025" },
//           { "#": 3, itemCode: "MEC-001", itemName: "ตลับลูกปืน", qty: "2", unit: "ชิ้น", itemType: "Consumable" }
//         ]
//       }
//     ]
//   }
// ];

// // --- Mock Data Duplicates เพื่อให้ครบ 10 กลุ่มหลัก ---
// const duplicatedOrders = JSON.parse(JSON.stringify(initialMockOrders)).map((group, index) => ({
//     groupName: `${group.groupName} (D#${index + 1})`,
//     groupCode: `${group.groupCode}D`,
//     orders: group.orders.map((order, oIndex) => ({
//         ...order,
//         id: `D${index}-${oIndex}-${order.id}`,
//         orderbookId: `D${index}-${order.orderbookId}`,
//         // เปลี่ยนสถานะให้หลากหลายขึ้นในกลุ่ม Duplicate
//         status: oIndex % 3 === 0 ? 'อนุมัติ' : 'รออนุมัติ', 
//     }))
// }));


// export const mockOrderData = [...initialMockOrders, ...duplicatedOrders];


// // ==========================================
// // 4. HELPER FUNCTIONS
// // ==========================================

// /**
//  * ค้นหาข้อมูลสินค้าในสต็อกตาม itemCode
//  * @param {StockItem[]} stockData - ข้อมูลสต็อกทั้งหมด
//  * @param {string} itemCode - รหัสสินค้าที่ต้องการค้นหา
//  * @returns {StockItem | undefined} ข้อมูลสินค้า หรือ undefined หากไม่พบ
//  */
// export function findStockInfo(stockData, itemCode) {
//   return stockData.find((s) => s.itemCode === itemCode);
// }

// // ==========================================
// // 5. COMPONENTS
// // ==========================================

// /**
//  * Component สำหรับแสดงสถานะของใบเบิก/รายการ
//  * @param {Object} props
//  * @param {'อนุมัติ' | 'รออนุมัติ' | 'ไม่อนุมัติ' | 'ยกเลิก'} props.status - สถานะของรายการ
//  * @param {boolean} [props.small=false] - กำหนดให้ Badge มีขนาดเล็กหรือไม่
//  * @returns {JSX.Element}
//  */
// export const StatusBadge = ({ status, small = false }) => {
//   const sizeClass = small ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2.5 py-0.5";

//   switch (status) {
//     case "อนุมัติ":
//       return (
//         <Badge className={`bg-green-100 text-green-700 hover:bg-green-100 border-green-200 ${sizeClass}`}>
//           {status}
//         </Badge>
//       );
//     case "รออนุมัติ":
//       return (
//         <Badge className={`bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 ${sizeClass}`}>
//           {status}
//         </Badge>
//       );
//     case "ไม่อนุมัติ":
//       return (
//         <Badge className={`bg-red-100 text-red-700 hover:bg-red-100 border-red-200 ${sizeClass}`}>
//           {status}
//         </Badge>
//       );
//     case "ยกเลิก":
//       return (
//         <Badge className={`bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200 ${sizeClass}`}>
//           {status}
//         </Badge>
//       );
//     default:
//       return <Badge variant="secondary" className={sizeClass}>{status}</Badge>;
//   }
// };