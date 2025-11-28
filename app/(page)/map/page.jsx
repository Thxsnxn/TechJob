/**
 * ============================================================================
 * หน้าแผนที่งาน (Map Overview Page)
 * ============================================================================
 * 
 * เปรียบเทียบ: เหมือนแผนที่ Google Maps ที่แสดงตำแหน่งร้านอาหารทั้งหมด
 * - ด้านบนมีปุ่มให้เลือกประเภทร้าน (ก๋วยเตี๋ยว, ข้าวมันไก่, สเต็ก)
 * - แผนที่ตรงกลางแสดงหมุดตำแหน่งร้าน
 * - ด้านข้างมีรายการร้านให้เลือกดู
 * 
 * ในระบบนี้:
 * - ด้านบนแสดงจำนวนงานแบ่งตามสถานะ (รอดำเนินการ, กำลังทำ, เสร็จแล้ว)
 * - แผนที่แสดงตำแหน่งที่ติดตั้ง/ซ่อมแซม
 * - ด้านข้างมีรายการงานให้เลือก
 */

'use client'
import React, { useState } from 'react'
import StatusSummary from './components/StatusSummary'
import JobList from './components/JobList'
import WorkMap from './components/WorkMap'
import ViewJobModal from '../jobmanagement/ViewJobModal'
import { SiteHeader } from '@/components/site-header'
import { MapPin } from 'lucide-react'

const MapOverviewPage = () => {



  // ============================================================
  // State Management (การจัดการข้อมูล)
  // ============================================================

  /**
   * selectedJob: งานที่กำลังเลือกอยู่
   * เปรียบเทียบ: เหมือนการกดเลือกร้านอาหารในแผนที่ ร้านนั้นจะไฮไลท์
   */
  const [selectedJob, setSelectedJob] = useState(null)

  /**
   * viewJob: งานที่ต้องการดูรายละเอียดเต็ม
   * เปรียบเทียบ: เหมือนการกดดูรายละเอียดร้าน (เมนู, รีวิว, เบอร์โทร)
   * แยกจาก selectedJob เพราะ:
   * - selectedJob = แค่ไฮไลท์บนแผนที่
   * - viewJob = เปิดหน้าต่างแสดงรายละเอียดเต็ม
   */
  const [viewJob, setViewJob] = useState(null)

  /**
   * allJobs: งานทั้งหมดที่โหลดมา
   * เปรียบเทียบ: เหมือนรายการร้านอาหารทั้งหมดในเมือง
   * ทำไมต้องเก็บไว้ที่หน้าหลัก?
   * - เพื่อส่งให้ WorkMap แสดงหมุดบนแผนที่
   * - เพื่อให้ StatusSummary นับจำนวนได้
   * - เพื่อให้ JobList กรองและแสดงได้
   */
  const [allJobs, setAllJobs] = useState([])

  /**
   * statusFilter: สถานะที่เลือกกรอง (PENDING, IN_PROGRESS, COMPLETED, etc.)
   * เปรียบเทียบ: เหมือนการเลือกดูเฉพาะร้านก๋วยเตี๋ยว (ไม่แสดงร้านอื่น)
   * null = ไม่กรอง แสดงทั้งหมด
   * 
   * ทำไมใช้ state?
   * - เพราะต้องส่งไปหลายที่พร้อมกัน (StatusSummary, WorkMap, JobList)
   * - เมื่อเปลี่ยนค่า จะทำให้ทุก component อัพเดตพร้อมกัน
   */
  const [statusFilter, setStatusFilter] = useState(null)

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 flex flex-col">
      {/* ============================================================
          Header - ส่วนหัวของหน้า
          ============================================================ */}
      <SiteHeader title="แผนที่งาน" />

      <main className="flex-1 p-4 md:p-2 space-y-4 max-w-[1600px] mx-auto w-full flex flex-col">

        {/* ============================================================
            Banner Section - แบนเนอร์ต้อนรับ
            ============================================================
            เปรียบเทียบ: เหมือนป้ายหน้าร้านที่บอกว่า "ยินดีต้อนรับ"
            มี gradient สวยๆ เพื่อดึงดูดสายตา
        */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 p-3 shadow-lg shrink-0">
          {/* Decorative blurred circles - วงกลมเบลอตัวประดับ
              เหมือนแสงไฟประดับในร้านอาหาร เพิ่มบรรยากาศ */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                <MapPin className="h-8 w-8" /> แผนที่งาน
              </h1>
              <p className="text-cyan-100 mt-2 text-lg">
                ติดตามตำแหน่งและสถานะงานทั้งหมดบนแผนที่แบบ Real-time
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================
            Status Summary - การ์ดแสดงสถิติแต่ละสถานะ
            ============================================================
            เปรียบเทียบ: เหมือนป้ายหน้าซูเปอร์มาร์เก็ตที่บอกว่า
            "แคชเชียร์ 1 - ว่าง, แคชเชียร์ 2 - มีคนต่อคิว 5 คน"
            
            Props ที่ส่งให้:
            - selectedStatus: สถานะที่เลือกอยู่ (เพื่อไฮไลท์)
            - onStatusClick: ฟังก์ชันที่จะรันเมื่อกดเลือกสถานะ
        */}
        <div className="shrink-0">
          <StatusSummary
            selectedStatus={statusFilter}
            onStatusClick={setStatusFilter}
          />
        </div>

        {/* ============================================================
            Main Content - แผนที่ + รายการงาน
            ============================================================
            ใช้ Grid Layout แบ่งเป็น 3 ส่วน (เหมือนแบ่งที่นั่งในห้องประชุม)
            - 2 ส่วนซ้าย = แผนที่
            - 1 ส่วนขวา = รายการงาน
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-[600px]">

          {/* ============================================================
              Left Side - แผนที่ (ครอบคลุม 2/3 ของพื้นที่)
              ============================================================
              lg:col-span-2 = ในหน้าจอใหญ่ ให้แผนที่กว้าง 2 column
          */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative min-h-[500px]">
            <WorkMap
              selectedJob={selectedJob}      // งานที่เลือก → ไฮไลท์บนแผนที่
              allJobs={allJobs}               // งานทั้งหมด → แสดงเป็นหมุด
              statusFilter={statusFilter}     // สถานะที่กรอง → แสดงเฉพาะหมุดที่ตรงกับสถานะ
            />
          </div>

          {/* ============================================================
              Right Side - รายการงาน (ครอบคลุม 1/3 ของพื้นที่)
              ============================================================
              เหมือนลิสต์เพลงใน Spotify ให้เลือกฟัง
          */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
            <JobList
              onJobSelect={setSelectedJob}      // เมื่อเลือกงาน → update selectedJob
              onViewJob={setViewJob}            // เมื่อกดดูรายละเอียด → เปิด modal
              onJobsLoaded={setAllJobs}         // เมื่อโหลดงานสำเร็จ → เก็บไว้ใน allJobs
              statusFilter={statusFilter}       // กรองตามสถานะที่เลือก
            />
          </div>
        </div>
      </main>

      {/* ============================================================
          View Job Modal - หน้าต่างแสดงรายละเอียดงาน
          ============================================================
          เปรียบเทียบ: เหมือน popup รายละเอียดสินค้าใน Shopee
          จะแสดงก็ต่อเมื่อ viewJob มีค่า (ไม่ใช่ null)
          
          การทำงาน:
          1. กดที่ปุ่ม "ดูรายละเอียด" ในรายการงาน
          2. JobList เรียก onViewJob(job)
          3. setViewJob(job) ทำให้ viewJob มีค่า
          4. Modal แสดงขึ้นมา
          5. กดปิด Modal → onClose() → setViewJob(null) → Modal หายไป
      */}
      {viewJob && (
        <ViewJobModal
          job={viewJob}
          onClose={() => setViewJob(null)}
        />
      )}
    </div>
  )
}

export default MapOverviewPage