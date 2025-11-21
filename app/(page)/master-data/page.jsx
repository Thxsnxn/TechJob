"use client";

import React, { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter, // ✅ เพิ่มตัวนี้เข้ามาครับ
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Save,
  X,
  Database,
  Users,
  Ruler,
  Layers,
  Truck,
} from "lucide-react";

// Import Mock Data
import { 
  mockUnits as initialUnits, 
  mockDepartments as initialDepartments, 
  mockCategories as initialCategories, 
  mockSuppliers as initialSuppliers 
} from "@/lib/inventoryUtils";

export default function MasterDataPage() {
  // --- States ---
  const [activeTab, setActiveTab] = useState("units");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [units, setUnits] = useState(initialUnits);
  const [departments, setDepartments] = useState(initialDepartments);
  const [categories, setCategories] = useState(initialCategories);
  const [suppliers, setSuppliers] = useState(initialSuppliers);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    contact: "",
    phone: "",
  });

  // useEffect Reset Page
  useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery]);

  // Filter Data
  const filterData = (data) => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((item) => 
      (item.name && item.name.toLowerCase().includes(lowerQuery)) ||
      (item.code && item.code.toLowerCase().includes(lowerQuery)) ||
      (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
      (item.contact && item.contact.toLowerCase().includes(lowerQuery)) ||
      (item.phone && item.phone.toLowerCase().includes(lowerQuery))
    );
  };

  // Pagination Logic
  const getPaginatedData = (data) => {
    const filtered = filterData(data);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: filtered.slice(startIndex, endIndex),
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage)
    };
  };

  // Render Pagination
  const renderPagination = (totalPages) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-end items-center gap-2 p-4 border-t bg-white dark:bg-gray-900/50">
        <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          return <Button key={p} variant={page === p ? "default" : "outline"} size="sm" className={page === p ? "bg-blue-600 text-white hover:bg-blue-700" : ""} onClick={() => setPage(p)}>{p}</Button>;
        })}
        <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
      </div>
    );
  };

  // Handlers
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    if (item) {
      setEditingId(item.id);
      setFormData({
        code: item.code || "",
        name: item.name || "",
        description: item.description || "",
        contact: item.contact || "",
        phone: item.phone || "",
      });
    } else {
      setEditingId(null);
      setFormData({ code: "", name: "", description: "", contact: "", phone: "" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (type, id) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) return;
    if (type === "unit") setUnits(units.filter((i) => i.id !== id));
    if (type === "department") setDepartments(departments.filter((i) => i.id !== id));
    if (type === "category") setCategories(categories.filter((i) => i.id !== id));
    if (type === "supplier") setSuppliers(suppliers.filter((i) => i.id !== id));
  };

  const handleSave = () => {
    if (!formData.name.trim()) { alert("กรุณาระบุชื่อ"); return; }
    const newItem = { id: editingId || Date.now(), ...formData };
    if (modalType === "unit") { if (editingId) setUnits(units.map(u => u.id === editingId ? newItem : u)); else setUnits([...units, newItem]); }
    else if (modalType === "department") { if (editingId) setDepartments(departments.map(d => d.id === editingId ? newItem : d)); else setDepartments([...departments, newItem]); }
    else if (modalType === "category") { if (editingId) setCategories(categories.map(c => c.id === editingId ? newItem : c)); else setCategories([...categories, newItem]); }
    else if (modalType === "supplier") { if (editingId) setSuppliers(suppliers.map(s => s.id === editingId ? newItem : s)); else setSuppliers([...suppliers, newItem]); }
    setIsModalOpen(false);
  };

  const { data: paginatedUnits, totalPages: unitPages } = getPaginatedData(units);
  const { data: paginatedDepts, totalPages: deptPages } = getPaginatedData(departments);
  const { data: paginatedCats, totalPages: catPages } = getPaginatedData(categories);
  const { data: paginatedSuppliers, totalPages: supplierPages } = getPaginatedData(suppliers);

  return (
    <>
      <SiteHeader title="Master Data" />
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Database className="h-8 w-8 text-blue-600" /> จัดการข้อมูลหลัก (Master Data)</h1>
            <p className="text-muted-foreground">ตั้งค่าหน่วยนับ, แผนก, หมวดหมู่สินค้า และผู้จำหน่าย สำหรับใช้งานในระบบ</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <Tabs defaultValue="units" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <TabsList className="grid w-full md:w-[800px] grid-cols-4">
                  <TabsTrigger value="units" className="flex items-center gap-2"><Ruler className="h-4 w-4" /> หน่วยนับ</TabsTrigger>
                  <TabsTrigger value="departments" className="flex items-center gap-2"><Users className="h-4 w-4" /> แผนก</TabsTrigger>
                  <TabsTrigger value="categories" className="flex items-center gap-2"><Layers className="h-4 w-4" /> หมวดหมู่</TabsTrigger>
                  <TabsTrigger value="suppliers" className="flex items-center gap-2"><Truck className="h-4 w-4" /> ผู้จำหน่าย</TabsTrigger>
                </TabsList>
                <div className="flex w-full md:w-auto gap-2">
                  <div className="relative w-full md:w-[250px]">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={`ค้นหา...`} className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  <Button onClick={() => handleOpenModal(activeTab === "units" ? "unit" : activeTab === "departments" ? "department" : activeTab === "categories" ? "category" : "supplier")}> 
                    <Plus className="mr-2 h-4 w-4" /> เพิ่ม
                  </Button>
                </div>
              </div>

              {/* Units Tab */}
              <TabsContent value="units">
                <Card>
                  <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b py-3"><CardTitle className="text-base font-medium flex items-center gap-2"><Ruler className="h-4 w-4" /> รายการหน่วยนับ</CardTitle></CardHeader>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead className="w-[100px]">ID</TableHead><TableHead>ชื่อหน่วยนับ</TableHead><TableHead className="text-right w-[150px]">จัดการ</TableHead></TableRow></TableHeader>
                      <TableBody>{paginatedUnits.length > 0 ? paginatedUnits.map((u, i) => (<TableRow key={u.id}><TableCell className="font-medium">{u.id}</TableCell><TableCell>{u.name}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleOpenModal("unit", u)}><Pencil className="h-4 w-4 text-yellow-600" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete("unit", u.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button></TableCell></TableRow>)) : <TableRow><TableCell colSpan={3} className="text-center h-24 text-muted-foreground">ไม่พบข้อมูล</TableCell></TableRow>}</TableBody>
                    </Table>
                  </div>
                  {renderPagination(unitPages)}
                </Card>
              </TabsContent>

              {/* Departments Tab */}
              <TabsContent value="departments">
                <Card>
                  <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b py-3"><CardTitle className="text-base font-medium flex items-center gap-2"><Users className="h-4 w-4" /> รายการแผนก</CardTitle></CardHeader>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead className="w-[150px]">รหัสแผนก</TableHead><TableHead>ชื่อแผนก</TableHead><TableHead className="text-right w-[150px]">จัดการ</TableHead></TableRow></TableHeader>
                      <TableBody>{paginatedDepts.length > 0 ? paginatedDepts.map((d) => (<TableRow key={d.id}><TableCell className="font-medium">{d.code}</TableCell><TableCell>{d.name}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleOpenModal("department", d)}><Pencil className="h-4 w-4 text-yellow-600" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete("department", d.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button></TableCell></TableRow>)) : <TableRow><TableCell colSpan={3} className="text-center h-24 text-muted-foreground">ไม่พบข้อมูล</TableCell></TableRow>}</TableBody>
                    </Table>
                  </div>
                  {renderPagination(deptPages)}
                </Card>
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories">
                <Card>
                  <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b py-3"><CardTitle className="text-base font-medium flex items-center gap-2"><Layers className="h-4 w-4" /> รายการหมวดหมู่</CardTitle></CardHeader>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead className="w-[100px]">ID</TableHead><TableHead className="w-[300px]">ชื่อหมวดหมู่</TableHead><TableHead>รายละเอียด</TableHead><TableHead className="text-right w-[150px]">จัดการ</TableHead></TableRow></TableHeader>
                      <TableBody>{paginatedCats.length > 0 ? paginatedCats.map((c, i) => (<TableRow key={c.id}><TableCell className="font-medium">{(page-1)*itemsPerPage + i + 1}</TableCell><TableCell className="font-semibold">{c.name}</TableCell><TableCell className="text-muted-foreground">{c.description}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleOpenModal("category", c)}><Pencil className="h-4 w-4 text-yellow-600" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete("category", c.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button></TableCell></TableRow>)) : <TableRow><TableCell colSpan={4} className="text-center h-24 text-muted-foreground">ไม่พบข้อมูล</TableCell></TableRow>}</TableBody>
                    </Table>
                  </div>
                  {renderPagination(catPages)}
                </Card>
              </TabsContent>

              {/* Suppliers Tab */}
              <TabsContent value="suppliers">
                <Card>
                  <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b py-3"><CardTitle className="text-base font-medium flex items-center gap-2"><Truck className="h-4 w-4" /> รายชื่อผู้จำหน่าย</CardTitle></CardHeader>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead className="w-[100px]">ID</TableHead><TableHead className="w-[300px]">ชื่อบริษัท/ร้านค้า</TableHead><TableHead className="w-[200px]">ผู้ติดต่อ</TableHead><TableHead>เบอร์โทรศัพท์</TableHead><TableHead className="text-right w-[150px]">จัดการ</TableHead></TableRow></TableHeader>
                      <TableBody>{paginatedSuppliers.length > 0 ? paginatedSuppliers.map((s, i) => (<TableRow key={s.id}><TableCell className="font-medium">{(page-1)*itemsPerPage + i + 1}</TableCell><TableCell className="font-semibold">{s.name}</TableCell><TableCell>{s.contact || "-"}</TableCell><TableCell>{s.phone || "-"}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleOpenModal("supplier", s)}><Pencil className="h-4 w-4 text-yellow-600" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete("supplier", s.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button></TableCell></TableRow>)) : <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">ไม่พบข้อมูล</TableCell></TableRow>}</TableBody>
                    </Table>
                  </div>
                  {renderPagination(supplierPages)}
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-lg shadow-2xl z-50 w-[95%] max-w-md p-0 overflow-hidden">
            <CardHeader className="bg-gray-100 dark:bg-gray-800 border-b px-6 py-4 flex flex-row justify-between items-center">
              <CardTitle className="text-lg">{editingId ? "แก้ไข" : "เพิ่ม"} {modalType === "unit" ? "หน่วยนับ" : modalType === "department" ? "แผนก" : modalType === "category" ? "หมวดหมู่" : "ผู้จำหน่าย"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}><X className="h-5 w-5" /></Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {modalType === "department" && (<div className="space-y-2"><Label>รหัสแผนก (Code)</Label><Input placeholder="เช่น MA" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} /></div>)}
              <div className="space-y-2"><Label>ชื่อ</Label><Input placeholder="ระบุชื่อ..." value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} autoFocus /></div>
              {modalType === "supplier" && (<><div className="space-y-2"><Label>ชื่อผู้ติดต่อ</Label><Input placeholder="ระบุชื่อผู้ติดต่อ..." value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} /></div><div className="space-y-2"><Label>เบอร์โทรศัพท์</Label><Input placeholder="0xx-xxx-xxxx" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div></>)}
              {modalType === "category" && (<div className="space-y-2"><Label>รายละเอียด</Label><Input placeholder="คำอธิบาย..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>)}
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t p-4 flex justify-end gap-2"><Button variant="outline" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button><Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700"><Save className="mr-2 h-4 w-4" /> บันทึก</Button></CardFooter>
          </div>
        </>
      )}
    </>
  );
}