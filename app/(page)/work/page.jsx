"use client";

import React, { useState } from "react"; // ✨ 1. Import useState
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // 👈 1. Import Card
import { Badge } from "@/components/ui/badge"; // 👈 2. Import Badge
import { ChevronRight } from "lucide-react"; // 👈 3. Import Icon
import { Button } from "@/components/ui/button"; // ✨ 1. Import Button
import { WorkDetailModal } from "./WorkDetailModal"; // (Import Modal ใหม่)

// ✨ 2. อัปเดตข้อมูลสมมติ ให้มีรายละเอียดครบ
const workItems = [
  {
    id: 1,
    title: "Big C | สาขา ลาดพร้าว",
    customer: "ปลาทูนึ่ง ตัวใหญ่ๆ",
    leadEngineer: "Cynthialyn",
    assignedBy: "แจ็กแปปโฮ",
    status: "Pending",
    dateRange: null,
    description:
      "ติดตั้งระบบปรับอากาศโซนสินค้าแช่แข็ง ตรวจสอบการเดินสายไฟ และทดสอบการทำงานของคอมเพรสเซอร์ 3 ตัว",
    address: "1234 ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900",
    assignedStaff: [
      {
        id: "s1",
        name: "สมศักดิ์",
        role: "ช่างไฟ",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=SS",
      },
      {
        id: "s2",
        name: "มานะ",
        role: "ช่างแอร์",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=MN",
      },
      {
        id: "s3",
        name: "วิชัย",
        role: "ผู้ช่วย",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=VC",
      },
      {
        id: "s4",
        name: "สุชาติ",
        role: "ผู้ช่วย",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=SC",
      },
    ],
  },
  {
    id: 2,
    title: "Lotus's | สาขา รามอินทรา",
    customer: "แมวน้ำ อุ๋งๆ",
    leadEngineer: "David",
    assignedBy: "สมชาย",
    status: "In Progress",
    dateRange: "เริ่ม 12/11/68",
    description:
      "เปลี่ยนตู้ MDB (Main Distribution Board) เก่า และเดินรางไฟใหม่สำหรับโซนอาหารสดทั้งหมด",
    address: "5678 ถนนรามอินทรา แขวงคันนายาว เขตคันนายาว กรุงเทพมหานคร 10230",
    assignedStaff: [
      {
        id: "s5",
        name: "ประเสริฐ",
        role: "หัวหน้าช่างไฟ",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=PS",
      },
      {
        id: "s6",
        name: "อดิศร",
        role: "ช่างไฟ",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=AS",
      },
      {
        id: "s7",
        name: "ธีระ",
        role: "ช่างไฟ",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=TR",
      },
      {
        id: "s8",
        name: "เกรียงไกร",
        role: "ผู้ช่วย",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=KK",
      },
    ],
  },
  {
    id: 3,
    title: "The Mall | สาขา บางกะปิ",
    customer: "ไก่ทอด หาดใหญ่",
    leadEngineer: "Cynthialyn",
    assignedBy: "สมหญิง",
    status: "Reject",
    dateRange: "เริ่ม 13/11/68 - สิ้นสุด 14/11/68",
    description:
      "ลูกค้าแจ้ง Reject งานติดตั้งระบบ Hood ดูดควันร้านอาหาร เนื่องจากสเปคท่อลมไม่ตรงตามที่ตกลงในสัญญา",
    address: "3522 ถนนลาดพร้าว แขวงคลองจั่น เขตบางกะปิ กรุงเทพมหานคร 10240",
    assignedStaff: [
      {
        id: "s1",
        name: "สมศักดิ์",
        role: "ช่างแอร์",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=SS",
      },
      {
        id: "s3",
        name: "วิชัย",
        role: "ผู้ช่วย",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=VC",
      },
    ],
  },
  {
    id: 4,
    title: "Central | สาขา พระราม 9",
    customer: "หนูแฮมสเตอร์",
    leadEngineer: "Michael",
    assignedBy: "แจ็กแปปโฮ",
    status: "Completed",
    dateRange: "สิ้นสุด 10/11/68",
    description: "งานเสร็จสิ้น ตรวจสอบระบบเรียบร้อย",
    address: "9/9 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310",
    assignedStaff: [
      {
        id: "s1",
        name: "สมศักดิ์",
        role: "ช่างไฟ",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=SS",
      },
      {
        id: "s2",
        name: "มานะ",
        role: "ช่างแอร์",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=MN",
      },
    ],
  },
  {
    id: 5,
    title: "Tops | สาขา สุขุมวิท",
    customer: "ช้างน้อย",
    leadEngineer: "Sarah",
    assignedBy: "สมชาย",
    status: "Pending",
    dateRange: null,
    description: "รอลูกค้าอนุมัติใบเสนอราคา",
    address:
      "199/1-2 ซอยสุขุมวิท 49 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110",
    assignedStaff: [],
  },
  {
    id: 6,
    title: "Villa Market | สาขา อารีย์",
    customer: "กุ้งเต้น",
    leadEngineer: "David",
    assignedBy: "สมหญิง",
    status: "In Progress",
    dateRange: "เริ่ม 15/11/68",
    description: "กำลังดำเนินการ",
    address: "428 ซอยพหลโยธิน 7 แขวงสามเสนใน เขตพญาไท กรุงเทพมหานคร 10400",
    assignedStaff: [
      {
        id: "s5",
        name: "ประเสริฐ",
        role: "หัวหน้าช่างไฟ",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=PS",
      },
      {
        id: "s6",
        name: "อดิศร",
        role: "ช่างไฟ",
        avatar: "https://placehold.co/40x40/d1d5db/374151?text=AS",
      },
    ],
  },
];

// 5. ฟังก์ชันสำหรับเปลี่ยนสี Badge ตาม Status (อิงจากสีในรูปของคุณ)
const getStatusVariant = (status) => {
  switch (status) {
    case "Pending":
      return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100";
    case "Reject":
      return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100";
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100";
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
    default:
      return "secondary"; // (shadcn default)
  }
};

const filterOptions = ["All", "Pending", "In Progress", "Reject", "Completed"];

export default function Page() {
  // ✨ 3. เพิ่ม State สำหรับ Filter
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedWork, setSelectedWork] = useState(null); // ✨ 3. เพิ่ม State นี้

  // ✨ 4. สร้าง Logic สำหรับกรองข้อมูล
  const filteredWorks = workItems.filter((item) => {
    if (activeFilter === "All") {
      return true; // ถ้าเลือก "All" ให้แสดงทั้งหมด
    }
    return item.status === activeFilter; // ถ้าไม่ ให้แสดงเฉพาะ Status ที่ตรงกัน
  });

  return (
    <>
      <SiteHeader />
      {/* 6. สร้าง Layout หลัก (Responsive Container) */}
      <div className="container mx-auto max-w-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* --- ✨ 5. เพิ่ม UI ของปุ่ม Filter (Responsive) --- */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {filterOptions.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"} // 'default' = ปุ่มทึบ, 'outline' = ปุ่มขอบ
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
        {/* --- สิ้นสุดส่วน Filter --- */}

        {/* 7. สร้าง Grid (Responsive) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {/* 8. วน Loop สร้าง Card */}
          {filteredWorks.map((item) => (
            <Card
              key={item.id}
              className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedWork(item)} // (เพิ่ม onClick)
            >
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg font-bold">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {/* ส่วนข้อมูลหลัก (Flex + Chevron) */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Customer : {item.customer}</p>
                    <p>Lead Engineer : {item.leadEngineer}</p>
                    <p>Assigned by : {item.assignedBy}</p>
                  </div>
                  <ChevronRight className="h-6 w-6 flex-shrink-0 text-gray-400" />
                </div>

                {/* ส่วนล่าง (Status + Date) */}
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <Badge className={getStatusVariant(item.status)}>
                    {item.status}
                  </Badge>
                  {item.dateRange && (
                    <span className="text-xs text-gray-500">
                      {item.dateRange}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}


          
        </div>
      </div>

      <WorkDetailModal 
        open={!!selectedWork} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedWork(null);
          }
        }}
        work={selectedWork} 
      />
    </>
  );
}
