"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Users, UserCog, UserCheck, FileText, Clock } from "lucide-react";
import { ReportDetailModal } from "./ReportDetailModal";
import { SiteHeader } from "@/components/site-header";


// ข้อมูล Mockup (เราไม่ต้องกำหนด Type แล้ว)
const mockReports = [
  {
    id: "R-1001",
    title: "ปัญหา: Server ห้อง A-201 ล่ม",
    details:
      "Server rack หมายเลข 3 ในห้อง A-201 ไม่สามารถเข้าถึงได้ตั้งแต่เวลา 14:30 น. ลองทำการ ping แล้วแต่ไม่สำเร็จ ตรวจสอบเบื้องต้นพบว่าไฟสถานะเป็นสีส้ม",
    submittedBy: "สมชาย ใจดี",
    date: "2 ชั่วโมงที่แล้ว",
    role: "Employee",
    imageUrl: "https://picsum.photos/seed/server/600/400",
  },
  {
    id: "R-1002",
    title: "ปัญหา: ระบบ Login ใช้งานไม่ได้",
    details:
      "User หลายคนแจ้งว่าไม่สามารถ login เข้าสู่ระบบ Production ได้ตั้งแต่ 15:00 น. ขึ้น Error 503 Service Unavailable.",
    submittedBy: "สมหญิง มั่นคง",
    date: "1 ชั่วโมงที่แล้ว",
    role: "Lead Engineer",
  },
  {
    id: "R-1003",
    title: "สรุปยอด: Quarterly Performance ต่ำกว่าเป้า",
    details:
      "รายงานสรุปผลการดำเนินงานไตรมาสที่ 3 พบว่ายอด KPI ต่ำกว่าเป้าหมายที่ตั้งไว้ 15% จำเป็นต้องมีการประชุมเพื่อวิเคราะห์หาสาเหตุและแนวทางแก้ไขโดยด่วน",
    submittedBy: "ฝ่ายกลยุทธ์",
    date: "เมื่อวานนี้",
    role: "CEO",
  },
  {
    id: "R-1004",
    title: "ปัญหา: อุปกรณ์สำนักงานไม่เพียงพอ",
    details:
      "แผนก Support แจ้งว่ากระดาษ A4 และหมึกพิมพ์สำหรับ Printer กลางหมดสต็อก ทำให้ไม่สามารถพิมพ์เอกสารสำคัญได้",
    submittedBy: "จินตนา สุขใจ",
    date: "3 วันที่แล้ว",
    role: "Employee",
  },
  {
    id: "R-1005",
    title: "วิเคราะห์: Root Cause Analysis - API Downtime",
    details:
      "จากการตรวจสอบเหตุการณ์ API ล่มเมื่อวันที่ 15 พ.ย. พบว่าเกิดจาก Memory Leak ใน service 'auth-service' ทำให้ pod crash และ restart วนลูป... (ดูรายละเอียดเพิ่มเติมในเอกสารแนบ)",
    submittedBy: "ทีม DevOps",
    date: "เมื่อวานนี้",
    role: "Lead Engineer",
    imageUrl: "https://picsum.photos/seed/graph/600/400",
  },
];

// ฟังก์ชันสำหรับกรอง Report ตาม Role
const filterReportsByRole = (role) => {
  return mockReports.filter((report) => report.role === role);
};

export function ReportManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // เราไม่ต้องบอก Type ว่าเป็น <Report | null> แล้ว
  const [selectedReport, setSelectedReport] = useState(null);

  // ฟังก์ชันสำหรับเปิด Modal (เอา Type "report: Report" ออก)
  const handleReportClick = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  // ฟังก์ชันสำหรับปิด Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  // Helper component (เอา Type ออก)
  const ReportItem = ({ report }) => (
    <div
      className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
      onClick={() => handleReportClick(report)}
    >
      <div className="flex-shrink-0 pt-1">
        <FileText className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none truncate">
          {report.title}
        </p>
        <p className="text-sm text-muted-foreground truncate mt-1">
          รายงานโดย: {report.submittedBy}
        </p>
      </div>
      <div className="flex-shrink-0 text-xs text-muted-foreground flex items-center space-x-1 pt-1">
        <Clock className="w-3 h-3" />
        <span>{report.date}</span>
      </div>
    </div>
  );

  return (
    
<main className="">
      {/* <SiteHeader title="Settings" /> */} {/* <-- Replaced this */}
      {/* Placeholder Header */}
      <SiteHeader title="Reportmanagement" />
      

    
      <Card className="container mx-auto max-w-auto px-4 py-8 sm:px-6 lg:px-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Report Management
          </CardTitle>
          <CardDescription>
            ตรวจสอบและจัดการรายงานที่ส่งเข้ามาในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employee" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="employee">
                <Users className="w-4 h-4 mr-2" />
                Employee
              </TabsTrigger>
              <TabsTrigger value="lead-engineer">
                <UserCog className="w-4 h-4 mr-2" />
                Lead Engineer
              </TabsTrigger>
              <TabsTrigger value="ceo">
                <UserCheck className="w-4 h-4 mr-2" />
                CEO
              </TabsTrigger>
            </TabsList>

            {/* Employee Tab */}
            <TabsContent value="employee">
              <div className="flex flex-col space-y-2 mt-4">
                {filterReportsByRole("Employee").map((report) => (
                  <ReportItem key={report.id} report={report} />
                ))}
              </div>
            </TabsContent>

            {/* Lead Engineer Tab */}
            <TabsContent value="lead-engineer">
              <div className="flex flex-col space-y-2 mt-4">
                {filterReportsByRole("Lead Engineer").map((report) => (
                  <ReportItem key={report.id} report={report} />
                ))}
              </div>
            </TabsContent>

            {/* CEO Tab */}
            <TabsContent value="ceo">
              <div className="flex flex-col space-y-2 mt-4">
                {filterReportsByRole("CEO").map((report) => (
                  <ReportItem key={report.id} report={report} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal Component */}
      <ReportDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        report={selectedReport}
      />
    </main>
  );
}

// ถ้าใช้เป็น page.jsx ใน app router อย่าลืม export default
export default ReportManagement;