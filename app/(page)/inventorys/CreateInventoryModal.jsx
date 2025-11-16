// --- START: Create Inventory Modal Component ---
// (วางส่วนนี้ไว้เหนือ 'export default function Page()')
//
// import { X, Plus, Trash2 } from "lucide-react"; // (อย่าลืมเพิ่ม 'Plus' และ 'Trash2' ใน imports)

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

  // --- Functions
  
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
      {/* 1. Modal Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40" 
        onClick={onClose}
      ></div>

      {/* 2. Modal Content */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        bg-white dark:bg-gray-900 rounded-lg shadow-lg z-50 
        w-[95%] max-w-5xl max-h-[90vh] flex flex-col"
      >
        
        {/* Modal Header */}
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <h2 className="text-2xl font-bold text-black dark:text-white">สร้าง Inventory ใหม่</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6 text-gray-500" />
          </Button>
        </CardHeader>

        {/* Modal Body (Scrollable) */}
        <CardContent className="p-6 space-y-6 overflow-y-auto">
          
          {/* ส่วนที่ 1: รายละเอียดหลัก */}
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
          
          {/* ส่วนที่ 2: รายการสินค้า */}
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

        {/* Modal Footer */}
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