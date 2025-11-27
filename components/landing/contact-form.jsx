"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { th } from "date-fns/locale"; // ตรวจสอบว่ามี locale th แล้ว

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { sendContactRequest } from "@/lib/mockContactApi";
import { Upload, Calendar, Clock, MapPin, AlertCircle, FileText, Phone as PhoneIcon, X } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

export function ContactForm() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const [contactType, setContactType] = useState("person");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    taxId: "",
    email: "",
    phone: "",
    lineId: "",
    address: "",
    serviceType: "",
    budget: "",
    startDate: null,
    expectedDuration: "",
    siteLocation: "",
    urgencyLevel: "",
    facilityType: "",
    approximateArea: "",
    specialRequirements: "",
    preferredContactMethod: "",
    contactTime: "",
    description: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await sendContactRequest({
        contactType,
        ...formData,
        files: uploadedFiles,
      });

      console.log("Contact submission successful:", result);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          firstName: "",
          lastName: "",
          companyName: "",
          taxId: "",
          email: "",
          phone: "",
          lineId: "",
          address: "",
          serviceType: "",
          budget: "",
          startDate: null,
          expectedDuration: "",
          siteLocation: "",
          urgencyLevel: "",
          facilityType: "",
          approximateArea: "",
          specialRequirements: "",
          preferredContactMethod: "",
          contactTime: "",
          description: "",
        });
        setUploadedFiles([]);
      }, 2500);
    } catch (error) {
      console.error("Contact submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-32 px-6 bg-white text-black"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-black mb-6 tracking-tight">
            แจ้งรายละเอียดงาน / ขอใบเสนอราคา
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
            กรุณากรอกรายละเอียดโครงการของท่าน ทางทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-12"
        >
          {/* Contact type */}
          <div className="flex justify-center gap-6">
            <Button
              type="button"
              variant={contactType === "person" ? "default" : "outline"}
              className={`px-10 py-5 rounded-full text-base font-light transition-all ${contactType === "person"
                ? "bg-black text-white hover:bg-neutral-800"
                : "border-neutral-300 text-black hover:bg-neutral-100"
                }`}
              onClick={() => setContactType("person")}
            >
              บุคคลทั่วไป
            </Button>

            <Button
              type="button"
              variant={contactType === "company" ? "default" : "outline"}
              className={`px-10 py-5 rounded-full text-base font-light transition-all ${contactType === "company"
                ? "bg-black text-white hover:bg-neutral-800"
                : "border-neutral-300 text-black hover:bg-neutral-100"
                }`}
              onClick={() => setContactType("company")}
            >
              นิติบุคคล / บริษัท
            </Button>
          </div>

          {/* ========== SECTION 1: BASIC INFORMATION ========== */}
          <div className="space-y-8 border-t pt-8 border-neutral-200">
            <h3 className="text-2xl font-light text-neutral-800 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              ข้อมูลผู้ติดต่อ
            </h3>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-neutral-700 font-light text-lg">
                  ชื่อจริง <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                  placeholder="ระบุชื่อจริง"
                  className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-neutral-700 font-light text-lg">
                  นามสกุล <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                  placeholder="ระบุนามสกุล"
                  className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Company Name & Tax ID (Company Only) */}
            {contactType === "company" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label className="text-neutral-700 font-light text-lg">
                    ชื่อบริษัท / หน่วยงาน <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                    required={contactType === "company"}
                    placeholder="ระบุชื่อบริษัท"
                    className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-neutral-700 font-light text-lg">
                    เลขประจำตัวผู้เสียภาษี
                  </Label>
                  <Input
                    value={formData.taxId}
                    onChange={(e) => handleInputChange("taxId", e.target.value)}
                    placeholder="เลขประจำตัวผู้เสียภาษี 13 หลัก"
                    className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
                  />
                </div>
              </div>
            )}

            {/* Email / Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-neutral-700 font-light text-lg">
                  อีเมล <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  placeholder="example@email.com"
                  className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-neutral-700 font-light text-lg">
                  เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  placeholder="08x-xxx-xxxx"
                  className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* LINE ID */}
            <div className="space-y-3">
              <Label className="text-neutral-700 font-light text-lg">
                LINE ID
              </Label>
              <Input
                value={formData.lineId}
                onChange={(e) => handleInputChange("lineId", e.target.value)}
                placeholder="LINE ID สำหรับติดต่อกลับ"
                className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
              />
            </div>

            {/* Address */}
            <div className="space-y-3">
              <Label className="text-neutral-700 font-light text-lg">
                ที่อยู่
              </Label>
              <Input
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="ที่อยู่สำหรับออกใบเสนอราคา / ใบกำกับภาษี"
                className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* ========== SECTION 2: PROJECT DETAILS ========== */}
          <div className="space-y-8 border-t pt-8 border-neutral-200">
            <h3 className="text-2xl font-light text-neutral-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              รายละเอียดโครงการ
            </h3>

            {/* Service Type & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-neutral-700 font-light text-lg">
                  ประเภทงานบริการ <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) =>
                    handleInputChange("serviceType", value)
                  }
                  required
                >
                  <SelectTrigger className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light">
                    <SelectValue placeholder="เลือกประเภทงาน" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-neutral-300 z-[9999] max-h-[300px] overflow-y-auto shadow-lg">
                    <SelectItem value="electrical-installation">
                      งานติดตั้งระบบไฟฟ้า
                    </SelectItem>
                    <SelectItem value="power-distribution">
                      งานระบบจ่ายไฟ (Power Distribution)
                    </SelectItem>
                    <SelectItem value="control-panels">
                      งานตู้คอนโทรล / ตู้สวิทช์บอร์ด
                    </SelectItem>
                    <SelectItem value="maintenance">
                      งานซ่อมบำรุง / ตรวจเช็ค
                    </SelectItem>
                    <SelectItem value="automation">
                      ระบบอัตโนมัติ (Industrial Automation)
                    </SelectItem>
                    <SelectItem value="other">
                      อื่นๆ
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-neutral-700 font-light text-lg">
                  งบประมาณโดยประมาณ
                </Label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) =>
                    handleInputChange("budget", value)
                  }
                >
                  <SelectTrigger className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light">
                    <SelectValue placeholder="เลือกช่วงงบประมาณ" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-neutral-300 z-[9999] max-h-[300px] overflow-y-auto shadow-lg">
                    <SelectItem value="under-50k">ต่ำกว่า 50,000 บาท</SelectItem>
                    <SelectItem value="50k-100k">50,000 - 100,000 บาท</SelectItem>
                    <SelectItem value="100k-300k">100,000 - 300,000 บาท</SelectItem>
                    <SelectItem value="300k-500k">300,000 - 500,000 บาท</SelectItem>
                    <SelectItem value="500k-1m">500,000 - 1,000,000 บาท</SelectItem>
                    <SelectItem value="over-1m">มากกว่า 1,000,000 บาท</SelectItem>
                    <SelectItem value="not-sure">ยังไม่แน่ใจ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Facility Type & Area (Company Only) */}
            {contactType === "company" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label className="text-neutral-700 font-light text-lg">
                    ประเภทสถานที่ / อาคาร
                  </Label>
                  <Select
                    value={formData.facilityType}
                    onValueChange={(value) =>
                      handleInputChange("facilityType", value)
                    }
                  >
                    <SelectTrigger className="py-6 rounded-xl  border-neutral-300 bg-white font-light">
                      <SelectValue placeholder="เลือกประเภทสถานที่" />
                    </SelectTrigger>
                    <SelectContent className=" border-neutral-300 z-[9999] max-h-[300px] overflow-y-auto shadow-lg">
                      <SelectItem value="factory">โรงงานผลิต (Factory)</SelectItem>
                      <SelectItem value="warehouse">โกดังสินค้า (Warehouse)</SelectItem>
                      <SelectItem value="office">อาคารสำนักงาน (Office Building)</SelectItem>
                      <SelectItem value="hotel">โรงแรม/รีสอร์ท (Hotel/Resort)</SelectItem>
                      <SelectItem value="mall">ศูนย์การค้า (Shopping Mall)</SelectItem>
                      <SelectItem value="hospital">โรงพยาบาล (Hospital)</SelectItem>
                      <SelectItem value="data-center">Data Center</SelectItem>
                      <SelectItem value="other">อื่นๆ (Other)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-neutral-700 font-light text-lg">
                    ขนาดพื้นที่โดยประมาณ
                  </Label>
                  <Input
                    value={formData.approximateArea}
                    onChange={(e) =>
                      handleInputChange("approximateArea", e.target.value)
                    }
                    placeholder="เช่น 500 ตร.ม., อาคาร 3 ชั้น"
                    className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
                  />
                </div>
              </div>
            )}

            {/* Project Description */}
            <div className="space-y-3">
              <Label className="text-neutral-700 font-light text-lg">
                รายละเอียดงานที่ต้องการ <span className="text-red-500">*</span>
              </Label>
              <Textarea
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                required
                placeholder="โปรดอธิบายรายละเอียดงาน ปัญหาที่พบ หรือสิ่งที่ต้องการให้เราช่วย..."
                className="rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
              />
            </div>

            {/* Special Requirements */}
            <div className="space-y-3">
              <Label className="text-neutral-700 font-light text-lg">
                ข้อกำหนดพิเศษ / สเปคเพิ่มเติม
              </Label>
              <Textarea
                rows={4}
                value={formData.specialRequirements}
                onChange={(e) =>
                  handleInputChange("specialRequirements", e.target.value)
                }
                placeholder="เช่น ยี่ห้ออุปกรณ์ที่ต้องการ, มาตรฐานความปลอดภัย, ใบรับรองที่จำเป็น ฯลฯ"
                className="rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* ========== SECTION 3: TIMELINE & LOCATION ========== */}
          <div className="space-y-8 border-t pt-8 border-neutral-200">
            <h3 className="text-2xl font-light text-neutral-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              เวลาและสถานที่
            </h3>

            {/* Start Date & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-neutral-700 font-light text-lg flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  วันที่สะดวกให้เข้าหน้างาน / เริ่มงาน
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full py-6 rounded-xl text-black border-neutral-300 bg-white font-light justify-start text-left hover:bg-neutral-50",
                        !formData.startDate && "text-neutral-400"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.startDate ? (
                        format(formData.startDate, "PPP", { locale: th })
                      ) : (
                        <span>เลือกวันที่</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-neutral-300" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleInputChange("startDate", date)}
                      initialFocus
                      className="bg-white"
                      locale={th}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <Label className="text-neutral-700 font-light text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  ระยะเวลาดำเนินงานที่คาดหวัง
                </Label>
                <Select
                  value={formData.expectedDuration}
                  onValueChange={(value) =>
                    handleInputChange("expectedDuration", value)
                  }
                >
                  <SelectTrigger className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light">
                    <SelectValue placeholder="เลือกระยะเวลา" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-neutral-300 z-[9999] max-h-[300px] overflow-y-auto shadow-lg">
                    <SelectItem value="1-3-days">1-3 วัน</SelectItem>
                    <SelectItem value="1-week">1 สัปดาห์</SelectItem>
                    <SelectItem value="2-weeks">2 สัปดาห์</SelectItem>
                    <SelectItem value="1-month">1 เดือน</SelectItem>
                    <SelectItem value="2-3-months">2-3 เดือน</SelectItem>
                    <SelectItem value="over-3-months">มากกว่า 3 เดือน</SelectItem>
                    <SelectItem value="not-sure">ยังไม่แน่ใจ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Site Location & Urgency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-neutral-700 font-light text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  สถานที่หน้างาน / ชื่อโครงการ
                </Label>
                <Input
                  value={formData.siteLocation}
                  onChange={(e) =>
                    handleInputChange("siteLocation", e.target.value)
                  }
                  placeholder={contactType === "company" ? "เช่น โรงงานนิคมอมตะนคร, อาคาร ABC" : "เช่น บ้านเลขที่ 123 หมู่บ้าน..."}
                  className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-neutral-700 font-light text-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  ระดับความเร่งด่วน
                </Label>
                <Select
                  value={formData.urgencyLevel}
                  onValueChange={(value) =>
                    handleInputChange("urgencyLevel", value)
                  }
                >
                  <SelectTrigger className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light">
                    <SelectValue placeholder="เลือกระดับความเร่งด่วน" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-neutral-300 z-[9999] max-h-[300px] overflow-y-auto shadow-lg">
                    <SelectItem value="emergency">🔴 ด่วนมาก (Emergency)</SelectItem>
                    <SelectItem value="high">🟠 สูง (High Priority)</SelectItem>
                    <SelectItem value="medium">🟡 ปานกลาง (Medium)</SelectItem>
                    <SelectItem value="low">🟢 ทั่วไป / ไม่เร่งด่วน (Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* ========== SECTION 4: FILE UPLOAD ========== */}
          <div className="space-y-8 border-t pt-8 border-neutral-200">
            <h3 className="text-2xl font-light text-neutral-800 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              เอกสารแนบ
            </h3>

            <div className="space-y-3">
              <Label className="text-neutral-700 font-light text-lg">
                อัปโหลดไฟล์ (รูปภาพหน้างาน, แบบแปลน, เอกสารประกอบ)
              </Label>
              <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-neutral-400 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-neutral-400" />
                  <span className="text-neutral-600 font-light">
                    คลิกเพื่ออัปโหลด หรือลากไฟล์มาวางที่นี่
                  </span>
                  <span className="text-sm text-neutral-400">
                    รองรับ PNG, JPG, PDF, DOC (ขนาดไม่เกิน 10MB)
                  </span>
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
                      <span className="text-sm text-neutral-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        ลบ
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ========== SECTION 5: CONTACT PREFERENCES ========== */}
          <div className="space-y-8 border-t pt-8 border-neutral-200">
            <h3 className="text-2xl font-light text-neutral-800 flex items-center gap-2">
              <PhoneIcon className="w-5 h-5" />
              ช่องทางติดต่อกลับ
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-neutral-700 font-light text-lg">
                  ช่องทางที่สะดวกให้ติดต่อ
                </Label>
                <Select
                  value={formData.preferredContactMethod}
                  onValueChange={(value) =>
                    handleInputChange("preferredContactMethod", value)
                  }
                >
                  <SelectTrigger className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light">
                    <SelectValue placeholder="เลือกช่องทาง" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-neutral-300 z-[9999] max-h-[300px] overflow-y-auto shadow-lg">
                    <SelectItem value="phone">โทรศัพท์ (Phone)</SelectItem>
                    <SelectItem value="email">อีเมล (Email)</SelectItem>
                    <SelectItem value="line">LINE</SelectItem>
                    <SelectItem value="any">ช่องทางใดก็ได้</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-neutral-700 font-light text-lg">
                  ช่วงเวลาที่สะดวกให้ติดต่อ
                </Label>
                <Select
                  value={formData.contactTime}
                  onValueChange={(value) =>
                    handleInputChange("contactTime", value)
                  }
                >
                  <SelectTrigger className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light">
                    <SelectValue placeholder="เลือกช่วงเวลา" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-neutral-300 z-[9999] max-h-[300px] overflow-y-auto shadow-lg">
                    <SelectItem value="morning">ช่วงเช้า (9:00-12:00)</SelectItem>
                    <SelectItem value="afternoon">ช่วงบ่าย (13:00-16:00)</SelectItem>
                    <SelectItem value="evening">ช่วงเย็น (16:00-18:00)</SelectItem>
                    <SelectItem value="anytime">ทุกเวลาที่สะดวก</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="text-center pt-8">
            <Button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="bg-black text-white px-14 py-6 rounded-full text-base font-light hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSuccess
                ? "✅ ส่งข้อมูลเรียบร้อย!"
                : isSubmitting
                  ? "กำลังส่งข้อมูล..."
                  : "ส่งข้อมูล / ขอใบเสนอราคา"}
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}