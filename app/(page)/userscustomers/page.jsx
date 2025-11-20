"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SiteHeader } from "@/components/site-header"
import { Eye, Loader2, Trash } from "lucide-react"
import apiClient from "@/lib/apiClient"
import { toast } from "sonner"

// shadcn components
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// ==================================================================================
// 🟡 PART 1: CreateUserModal Component
// ==================================================================================
function CreateUserModal({ isOpen, onClose, onSuccess, defaultTab }) {
  const [loading, setLoading] = useState(false)
  
  const [viewMode, setViewMode] = useState("CUSTOMER") // CUSTOMER | EMPLOYEE
  const [errors, setErrors] = useState({}) 

  const [formData, setFormData] = useState({
    // Common
    username: "",
    email: "",
    phone: "",
    address: "",
    
    // Person / Employee specific
    firstName: "",
    lastName: "",
    gender: "", 

    // Customer: Company specific
    customerType: "PERSON",
    companyName: "",
    taxId: "",
    branch: "",
    contactName: "",

    // Employee specific
    role: "EMPLOYEE",
    status: "", // 🔥 เพิ่ม Status ใน state (เริ่มต้นเป็นค่าว่าง)
  })

  // Logic: ตั้งค่า Default เมื่อเปิด Modal
  useEffect(() => {
    if (isOpen) {
      // Reset Form & Errors
      setFormData({
        username: "", email: "", phone: "", address: "",
        firstName: "", lastName: "", 
        gender: "", 
        customerType: "PERSON", companyName: "", taxId: "", branch: "", contactName: "",
        role: "EMPLOYEE",
        status: "" // 🔥 Reset เป็นค่าว่าง
      })
      setErrors({})

      // เช็คว่ากดมาจาก Tab ไหน
      if (defaultTab === "customer") {
        setViewMode("CUSTOMER")
      } else {
        setViewMode("EMPLOYEE")
        
        let defaultRole = "EMPLOYEE"
        if (defaultTab === "lead") defaultRole = "SUPERVISOR"
        if (defaultTab === "engineer") defaultRole = "EMPLOYEE"
        if (defaultTab === "admin") defaultRole = "ADMIN"

        setFormData(prev => ({ ...prev, role: defaultRole }))
      }
    }
  }, [isOpen, defaultTab])

  // ฟังก์ชันเปลี่ยนค่าใน Form
  const handleChange = (key, value) => {
    let finalValue = value

    if (key === "phone") {
      const raw = value.replace(/\D/g, "")
      const limited = raw.slice(0, 10)
      if (limited.length > 6) {
        finalValue = `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`
      } else if (limited.length > 3) {
        finalValue = `${limited.slice(0, 3)}-${limited.slice(3)}`
      } else {
        finalValue = limited
      }
    }
    else if (key === "taxId") {
      finalValue = value.replace(/[^0-9]/g, "")
    }

    setFormData((prev) => ({ ...prev, [key]: finalValue }))
    
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }))
    }
  }

  // 🛡️ Validation Logic
  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    // 1. Username
    if (!formData.username.trim()) {
      newErrors.username = "กรุณากรอก Username"
      isValid = false
    }

    // 2. Email
    if (!formData.email) {
        newErrors.email = "กรุณากรอกอีเมล"
        isValid = false
    } else if (!formData.email.includes("@")) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง"
      isValid = false
    }

    // 3. Phone
    const rawPhone = formData.phone.replace(/-/g, "") 
    if (!rawPhone) {
        newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์"
        isValid = false
    } else if (rawPhone.length !== 10) {
        newErrors.phone = "เบอร์โทรศัพท์ต้องมี 10 หลัก"
        isValid = false
    }

    // 4. Name & Gender
    if (viewMode === "EMPLOYEE" || (viewMode === "CUSTOMER" && formData.customerType === "PERSON")) {
      if (!formData.firstName.trim()) { newErrors.firstName = "กรุณากรอกชื่อจริง"; isValid = false; }
      if (!formData.lastName.trim()) { newErrors.lastName = "กรุณากรอกนามสกุล"; isValid = false; }
      
      if (!formData.gender) { 
        newErrors.gender = "กรุณาระบุเพศ"; 
        isValid = false; 
      }
    }

    // 5. Company
    if (viewMode === "CUSTOMER" && formData.customerType === "COMPANY") {
      if (!formData.companyName.trim()) {
        newErrors.companyName = "กรุณากรอกชื่อบริษัท"
        isValid = false
      }
      if (!formData.taxId) {
        newErrors.taxId = "กรุณากรอกเลขผู้เสียภาษี"
        isValid = false
      } else if (formData.taxId.length !== 13) {
        newErrors.taxId = "เลขผู้เสียภาษีต้องมี 13 หลัก"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง")
      return
    }

    try {
      setLoading(true)
      
      const cleanPhone = formData.phone.replace(/-/g, "")

      // CASE 1: Customer (/add-customer)
      if (viewMode === "CUSTOMER") {
        const payload = {
          type: formData.customerType,
          username: formData.username,
          email: formData.email,
          phone: cleanPhone, 
          address: formData.address,
        }

        if (formData.customerType === "PERSON") {
          payload.firstName = formData.firstName
          payload.lastName = formData.lastName
          payload.gender = formData.gender
        } else {
          payload.companyName = formData.companyName
          payload.taxId = formData.taxId
          payload.branch = formData.branch
          payload.contactName = formData.contactName
        }

        await apiClient.post("/add-customer", payload)
      } 
      
      // CASE 2: Employee (/add-employee)
      else {
        const payload = {
           firstName: formData.firstName,
           lastName: formData.lastName,
           username: formData.username,
           email: formData.email,
           phone: cleanPhone, 
           gender: formData.gender,
           address: formData.address,
           role: formData.role,
           status: formData.status // ส่ง status ไปด้วย (ถ้าหลังบ้านรองรับ)
        }
        
        console.log("Sending Employee Payload:", payload)
        await apiClient.post("/add-employee", payload) 
      }
      
      toast.success("สร้างข้อมูลสำเร็จ")
      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
      const errMsg = error?.response?.data?.message || error?.message || "เกิดข้อผิดพลาดในการสร้างข้อมูล"
      toast.error(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Create New {viewMode === "CUSTOMER" ? "Customer" : "Employee"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 1. Type Selection */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">Type</Label>
            <div className="col-span-3">
              <Select 
                value={viewMode} 
                onValueChange={(val) => {
                   setViewMode(val)
                   if (val === "EMPLOYEE") {
                     let defaultRole = "EMPLOYEE"
                     if (defaultTab === "lead") defaultRole = "SUPERVISOR"
                     if (defaultTab === "admin") defaultRole = "ADMIN"
                     setFormData(prev => ({ ...prev, role: defaultRole }))
                   }
                   setErrors({}) 
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Create Customer</SelectItem>
                  <SelectItem value="EMPLOYEE">Create Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* --- Common Fields --- */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">Username <span className="text-red-500">*</span></Label>
            <div className="col-span-3">
              <Input 
                value={formData.username} 
                onChange={(e) => handleChange("username", e.target.value)} 
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && <span className="text-xs text-red-500">{errors.username}</span>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">Email <span className="text-red-500">*</span></Label>
            <div className="col-span-3">
              <Input 
                value={formData.email} 
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="example@mail.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">Phone <span className="text-red-500">*</span></Label>
            <div className="col-span-3">
              <Input 
                value={formData.phone} 
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="0XX-XXX-XXXX"
                maxLength={12} 
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
            </div>
          </div>
          
          {/* ================= CUSTOMER FORM ================= */}
          {viewMode === "CUSTOMER" && (
            <>
             <div className="my-2 border-t border-gray-100"></div>
             <div className="grid grid-cols-4 items-start gap-4">
               <Label className="text-right mt-2 font-semibold text-blue-600">Cust. Type</Label>
               <div className="col-span-3">
                 <Select value={formData.customerType} onValueChange={(val) => {
                    handleChange("customerType", val)
                    setErrors({}) 
                 }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERSON">บุคคล (Person)</SelectItem>
                      <SelectItem value="COMPANY">บริษัท (Company)</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
             </div>

             {/* --> Sub-form: PERSON */}
             {formData.customerType === "PERSON" && (
                <>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right mt-2">First Name <span className="text-red-500">*</span></Label>
                    <div className="col-span-3">
                      <Input 
                        value={formData.firstName} 
                        onChange={(e) => handleChange("firstName", e.target.value)} 
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right mt-2">Last Name <span className="text-red-500">*</span></Label>
                    <div className="col-span-3">
                      <Input 
                        value={formData.lastName} 
                        onChange={(e) => handleChange("lastName", e.target.value)} 
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right mt-2">Gender <span className="text-red-500">*</span></Label>
                    <div className="col-span-3">
                      <Select value={formData.gender} onValueChange={(val) => handleChange("gender", val)}>
                          <SelectTrigger className={errors.gender ? "border-red-500" : ""}><SelectValue placeholder="Select Gender" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Male (ชาย)</SelectItem>
                            <SelectItem value="FEMALE">Female (หญิง)</SelectItem>
                            <SelectItem value="OTHER">Other (อื่นๆ)</SelectItem>
                          </SelectContent>
                      </Select>
                      {errors.gender && <span className="text-xs text-red-500">{errors.gender}</span>}
                    </div>
                  </div>
                </>
             )}

             {/* --> Sub-form: COMPANY */}
             {formData.customerType === "COMPANY" && (
               <>
                 <div className="grid grid-cols-4 items-start gap-4">
                   <Label className="text-right mt-2">Company Name <span className="text-red-500">*</span></Label>
                   <div className="col-span-3">
                     <Input 
                        value={formData.companyName} 
                        onChange={(e) => handleChange("companyName", e.target.value)} 
                        className={errors.companyName ? "border-red-500" : ""}
                     />
                     {errors.companyName && <span className="text-xs text-red-500">{errors.companyName}</span>}
                   </div>
                 </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                   <Label className="text-right mt-2">Tax ID <span className="text-red-500">*</span></Label>
                   <div className="col-span-3">
                     <Input 
                        value={formData.taxId} 
                        onChange={(e) => handleChange("taxId", e.target.value)} 
                        placeholder="13 digits"
                        maxLength={13}
                        className={errors.taxId ? "border-red-500" : ""}
                     />
                     {errors.taxId && <span className="text-xs text-red-500">{errors.taxId}</span>}
                   </div>
                 </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                   <Label className="text-right mt-2">Branch</Label>
                   <div className="col-span-3">
                     <Input placeholder="e.g. สำนักงานใหญ่" value={formData.branch} onChange={(e) => handleChange("branch", e.target.value)} />
                   </div>
                 </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                   <Label className="text-right mt-2">Contact Name</Label>
                   <div className="col-span-3">
                     <Input placeholder="ชื่อผู้ติดต่อ" value={formData.contactName} onChange={(e) => handleChange("contactName", e.target.value)} />
                   </div>
                 </div>
               </>
             )}
             
             <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Address</Label>
                <div className="col-span-3">
                  <Textarea value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
                </div>
             </div>
            </>
          )}

          {/* ================= EMPLOYEE FORM ================= */}
          {viewMode === "EMPLOYEE" && (
            <>
              <div className="my-2 border-t border-gray-100"></div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">First Name <span className="text-red-500">*</span></Label>
                <div className="col-span-3">
                  <Input 
                    value={formData.firstName} 
                    onChange={(e) => handleChange("firstName", e.target.value)} 
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Last Name <span className="text-red-500">*</span></Label>
                <div className="col-span-3">
                  <Input 
                    value={formData.lastName} 
                    onChange={(e) => handleChange("lastName", e.target.value)} 
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
                </div>
              </div>
              
              {/* Gender (สำหรับ Employee) */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Gender <span className="text-red-500">*</span></Label>
                <div className="col-span-3">
                  <Select value={formData.gender} onValueChange={(val) => handleChange("gender", val)}>
                      <SelectTrigger className={errors.gender ? "border-red-500" : ""}><SelectValue placeholder="Select Gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male (ชาย)</SelectItem>
                        <SelectItem value="FEMALE">Female (หญิง)</SelectItem>
                        <SelectItem value="OTHER">Other (อื่นๆ)</SelectItem>
                      </SelectContent>
                  </Select>
                  {errors.gender && <span className="text-xs text-red-500">{errors.gender}</span>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Role</Label>
                <div className="col-span-3">
                  <Select value={formData.role} onValueChange={(val) => handleChange("role", val)}>
                    <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                    <SelectContent>
                      {["EMPLOYEE", "SUPERVISOR", "ADMIN", "CEO"].filter(r => r !== "CEO").map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 🔥 เพิ่มกล่อง Status สำหรับ Employee (ข้างในยังไม่มีค่าอะไร ตามที่ขอ) */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Status</Label>
                <div className="col-span-3">
                  <Select value={formData.status} onValueChange={(val) => handleChange("status", val)}>
                    <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                    <SelectContent>
                         {/* ตรงนี้ใส่ว่างๆ ไว้ก่อนตามที่ขอ หรือจะใส่ placeholder option ก็ได้ */}
                         <SelectItem value="ACTIVE">Active</SelectItem>
                         <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Address for Employee */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Address</Label>
                <div className="col-span-3">
                  <Textarea value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
                </div>
             </div>
            </>
          )}

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==================================================================================
// 🟡 PART 2: Main Page
// ==================================================================================
export default function UserCustomersPage() {
  const [currentTab, setCurrentTab] = useState("customer")
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState([])
  const [viewData, setViewData] = useState(null);

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")

  const [loading, setLoading] = useState(false)

  const fetchUsers = async (override = {}) => {
    try {
      setLoading(true)

      const effectiveSearch = override.search !== undefined ? override.search : search
      const activeTab = override.tab || currentTab

      let items = []

      // --- CASE 1: Customer ---
      if (activeTab === "customer") {
        const effectiveType = override.type !== undefined ? override.type : typeFilter
        const apiType = effectiveType === "ALL" ? "" : effectiveType

        const response = await apiClient.post("/filter-users", {
          search: effectiveSearch || "",
          type: apiType,
          page: 1,
          pageSize: 100,
        })
        items = response.data?.items || []
      }
      // --- CASE 2: Lead/Engineer/Admin ---
      else {
        let roleToSend = ""
        if (activeTab === "lead") roleToSend = "SUPERVISOR"
        if (activeTab === "engineer") roleToSend = "EMPLOYEE"
        if (activeTab === "admin") roleToSend = "ADMIN" 

        const response = await apiClient.post("/filter-employees", {
          search: effectiveSearch || "",
          role: roleToSend,
          page: 1,
          pageSize: 100,
        })
        items = response.data?.items || []
      }

      console.log("Fetched users:", items)

      const normalized = items.map((u) => {
        if (activeTab === "customer") {
          return {
            rawId: u.id,
            code: u.code || "",
            name: u.type === "COMPANY" ? u.companyName : `${u.firstName || ""} ${u.lastName || ""}`.trim(),
            email: u.email || "-",
            phone: u.phone || "-",
            address: u.address || "-",
            type: u.type,
            status: u.status,
            role: "-",
            position: "-",
            isCustomer: true
          }
        } else {
          return {
            rawId: u.id,
            code: u.code || "",
            name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
            email: u.email || "-",
            phone: u.phone || "-",
            address: "-",
            type: "-",
            status: u.status ?? true,
            role: u.role || "-",
            position: u.position || "-", 
            isCustomer: false
          }
        }
      })

      setUsers(normalized)
    } catch (error) {
      console.error("Error fetching users:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSearch("")
    fetchUsers({ search: "", tab: currentTab })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab])

  const roleLabel = {
    customer: "Customer",
    lead: "Supervisor",
    engineer: "Engineer",
    admin: "Admin", 
  }

  const getCustomerTypeLabel = (t) =>
    t === "PERSON" ? "บุคคล" : t === "COMPANY" ? "บริษัท" : "-"

  const renderStatusText = (status) => {
    if (status === true) return "ใช้งาน"
    if (status === false) return "ปิดใช้งาน"
    return "-"
  }

  const handleDelete = async (item) => {
    try {
      const confirmDelete = confirm(`ต้องการลบ "${item.name}" จริงไหม?`)
      if (!confirmDelete) return;

      let endpoint = ""

      if (currentTab === "customer") {
        endpoint = `/delete-customer/${item.rawId}`
      } else {
        endpoint = `/delete-employee/${item.rawId}`
      }

      const res = await apiClient.delete(endpoint)

      toast.success(res?.data?.message || "ลบข้อมูลสำเร็จ")

      fetchUsers({ tab: currentTab })

    } catch (error) {
      console.error("Delete Error:", error?.response?.data)
      toast.error(
        error?.response?.data?.message ||
        "ไม่สามารถลบข้อมูลได้"
      )
    }
  }



  return (
    <main>
      <SiteHeader title="Users Customers" />

      <section className="p-4 sm:p-6 space-y-4 max-w-full lg:max-w-[90%] xl:max-w-[1200px] mx-auto">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Users & Customers Management
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage employees and customer information
          </p>
        </div>

        {/* Tabs + Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {["customer", "lead", "engineer", "admin"].map((role) => (
              <Button
                key={role}
                variant={currentTab === role ? "default" : "outline"}
                className={
                  currentTab === role
                    ? "bg-blue-600 text-white flex-1 sm:flex-none whitespace-nowrap"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1 sm:flex-none whitespace-nowrap"
                }
                onClick={() => setCurrentTab(role)}
              >
                {roleLabel[role]}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            + Create New {roleLabel[currentTab]}
          </Button>
        </div>

        {/* 🔎 Search + Type Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex flex-1 gap-2 w-full">
            <Input
              placeholder={
                currentTab === "customer"
                  ? "ค้นหา companyName, taxId, contactName, firstName..."
                  : "ค้นหา รหัสพนักงาน, ชื่อ-นามสกุล, อีเมล, เบอร์โทร..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchUsers({ search: e.currentTarget.value })
                }
              }}
              disabled={loading}
            />

            {/* Dropdown แสดงเฉพาะ Customer */}
            {currentTab === "customer" && (
              <Select
                value={typeFilter}
                onValueChange={(val) => {
                  setTypeFilter(val)
                  fetchUsers({ type: val })
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="เลือกประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="PERSON">บุคคล</SelectItem>
                  <SelectItem value="COMPANY">บริษัท</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => fetchUsers({ search, type: typeFilter })}
            disabled={loading}
          >
            {loading ? "กำลังค้นหา..." : "ค้นหา"}
          </Button>
        </div>

        {/* Table */}
        <Card className="rounded-xl">
          <CardHeader>
            <h2 className="text-lg font-semibold">
              All {roleLabel[currentTab]}s
            </h2>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>
                    {currentTab === "customer" ? "รหัสลูกค้า" : "รหัสพนักงาน"}
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>

                  {/* 🟢 Columns สำหรับ CUSTOMER */}
                  {currentTab === "customer" && (
                    <>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                    </>
                  )}

                  {/* 🔵 Columns สำหรับ EMPLOYEE */}
                  {currentTab !== "customer" && (
                    <>
                      <TableHead>Position</TableHead>
                      <TableHead>Role</TableHead>
                    </>
                  )}

                  {/* 🔥 แก้ไข: ไม่ต้องโชว์หัว Status ถ้าเป็น Customer (เพราะโจทย์บอกเอาออก) */}
                  {currentTab !== "customer" && <TableHead>Status</TableHead>}
                  
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground"
                    >
                      กำลังโหลดข้อมูล...
                    </TableCell>
                  </TableRow>
                ) : users.length > 0 ? (
                  users.map((u, i) => (
                    <TableRow key={u.rawId ?? i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{u.code || "-"}</TableCell>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.phone}</TableCell>

                      {/* 🟢 ข้อมูลสำหรับ CUSTOMER */}
                      {currentTab === "customer" && (
                        <>
                          <TableCell>{u.address || "-"}</TableCell>
                          <TableCell>{getCustomerTypeLabel(u.type)}</TableCell>
                        </>
                      )}

                      {/* 🔵 ข้อมูลสำหรับ EMPLOYEE */}
                      {currentTab !== "customer" && (
                        <>
                          <TableCell>{u.position || "-"}</TableCell>
                          <TableCell>{u.role || "-"}</TableCell>
                        </>
                      )}

                      {/* 🔥 Status: โชว์เฉพาะ Employee (แต่ข้างในว่างๆ) / Customer ไม่ต้องโชว์ */}
                      {currentTab !== "customer" && (
                         <TableCell></TableCell>
                      )}

                      <TableCell className="flex justify-end ">

                        {/* View */}
                        <Button
                        className="cursor-pointer"
                          variant="outline"
                          size="icon"
                          onClick={() => setViewData(u)}  // ← เก็บข้อมูล row นี้ไว้ใน state
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="cursor-pointer ml-2 text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(u)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>

                      </TableCell>

                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground"
                    >
                      No {roleLabel[currentTab]} found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <CreateUserModal
          isOpen={showModal}
          defaultTab={currentTab}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchUsers({ tab: currentTab })
          }}
        />

        {/* 🟦 VIEW MODAL */}
        {viewData && (
          <Dialog open={true} onOpenChange={() => setViewData(null)}>
            <DialogContent className="max-w-[600px] sm:max-w-[650px] bg-card text-foreground">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  รายละเอียดข้อมูล
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  ข้อมูลของ {viewData.name || "-"}
                </p>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-lg p-4 bg-muted/30">
                <div><p className="text-xs text-muted-foreground">ID</p><p className="font-medium">{viewData.rawId}</p></div>
                <div><p className="text-xs text-muted-foreground">Code</p><p className="font-medium">{viewData.code || "-"}</p></div>
                <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{viewData.name}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{viewData.email}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{viewData.phone}</p></div>

                {viewData.isCustomer && (
                  <>
                    <div className="sm:col-span-2"><p className="text-xs text-muted-foreground">Address</p><p className="font-medium">{viewData.address}</p></div>
                    <div><p className="text-xs text-muted-foreground">Customer Type</p><p className="font-medium">{viewData.type === "PERSON" ? "บุคคล" : "บริษัท"}</p></div>
                  </>
                )}

                {!viewData.isCustomer && (
                  <>
                    <div><p className="text-xs text-muted-foreground">Position</p><p className="font-medium">{viewData.position}</p></div>
                    <div><p className="text-xs text-muted-foreground">Role</p><p className="font-medium">{viewData.role}</p></div>
                  </>
                )}
                
                {/* ถ้าเป็น Employee โชว์ Status ว่างๆ ใน View ด้วยก็ได้ หรือจะซ่อนก็ได้ตามต้องการ */}
                 {!viewData.isCustomer && (
                    <div><p className="text-xs text-muted-foreground">Status</p><p className="font-medium"></p></div>
                 )}

              </div>

              <DialogFooter className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setViewData(null)} className="cursor-pointer">Close</Button>
                <Button onClick={() => { setViewData(null); handleDelete(viewData); }} className="cursor-pointer bg-red-600 hover:bg-red-700 text-white">
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

      </section>
    </main>
  )
}