"use client";

import { ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClockPlus } from 'lucide-react';

export default function BeforeOTPage() {
  const router = useRouter();

  const handleSubmit = () => {
    // Add your form submission logic here
    
    // Navigate to home page
    router.push('/mobile/home');
  };

  return (
    <div className="min-h-screen bg-background max-w-[402px] mx-auto relative">
      {/* Header */}
      <header className="fixed w-full max-w-[402px] top-0 bg-white border-b z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link href="/mobile/home">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 class="text-xl font-semibold text-blue-600">Tech Job</h1>
          </div>
          {/* <Bell className="h-6 w-6" /> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 px-4 pb-20 max-w-[402px] mx-auto">
        <div className="space-y-6 bg-white rounded-xl p-4">
          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
                <ClockPlus className="w-9 h-9 text-white" />
              </div>
              <div>
                <h2 className="font-medium text-lg">แจ้งทำโอที</h2>
                <p className="text-sm text-gray-600">กรอกรายละเอียดแจ้งทำโอที</p>
              </div>
            </div>
          </div>
          <div>
            <Input 
              placeholder="ฟอร์มบันทึกแจ้งทำโอที..." 
              className="bg-gray-50 border-0 shadow-sm"
            />
          </div>
          <div>
            <Textarea 
              placeholder="รายละเอียด..." 
              className="min-h-[120px] bg-gray-50 border-0 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <Input 
              type="datetime-local" 
              placeholder="วันเวลาเริ่มทำงาน..." 
              className="bg-gray-50 border-0 shadow-sm"
            />
            <Input 
              type="datetime-local" 
              placeholder="วันเวลาสิ้นสุดงาน..." 
              className="bg-gray-50 border-0 shadow-sm"
            />
          </div>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={handleSubmit}
          >
            บันทึก
          </Button>
        </div>
      </main>
    </div>
  );
}
