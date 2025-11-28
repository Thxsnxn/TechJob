/**
 * ============================================================================
 * Status Summary Component - การ์ดแสดงสรุปสถานะงาน
 * ============================================================================
 * 
 * เปรียบเทียบ: เหมือนแดชบอร์ดของร้านอาหารที่แสดง
 * - ออเดอร์รอทำ: 5 รายการ (สีเหลือง)
 * - กำลังทำอยู่: 3 รายการ (สีน้ำเงิน)
 * - ทำเสร็จแล้ว: 10 รายการ (สีเขียว)
 * 
 * วิธีการทำงาน:
 * 1. โหลดข้อมูลงานทั้งหมดจาก API
 * 2. นับจำนวนงานในแต่ละสถานะ
 * 3. แสดงเป็นการ์ดสีสันสวยงาม
 * 4. เมื่อกดการ์ด → กรองแผนที่และรายการงาน
 */

'use client'
import React, { useState, useEffect } from 'react'
import apiClient from '@/lib/apiClient'
import { getAdminSession } from '@/lib/adminSession'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const StatusSummary = ({ selectedStatus, onStatusClick }) => {
    const router = useRouter()
    // ============================================================
    // State Management
    // ============================================================

    /**
     * loading: สถานะการโหลดข้อมูล
     * เปรียบเทียบ: เหมือนไฟสัญญาณโหลดในลิฟต์ 
     * - true = กำลังนับคน
     * - false = นับเสร็จแล้ว แสดงตัวเลข
     */
    const [loading, setLoading] = useState(true)

    /**
     * error: ข้อความ error (ถ้ามี)
     * เปรียบเทียบ: เหมือนป้าย "เครื่องเสีย" หน้าตู้เติมเงิน ATM
     */
    const [error, setError] = useState(null)

    /**
     * counts: จำนวนงานในแต่ละสถานะ
     * เปรียบเทียบ: เหมือนตัวนับคนในห้างสรรพสินค้า
     * - ชั้น 1: 50 คน
     * - ชั้น 2: 30 คน
     * - ชั้น 3: 20 คน
     */
    const [counts, setCounts] = useState({
        pending: 0,
        inProgress: 0,
        needFix: 0,
        completed: 0,
    })

    // ============================================================
    // Configuration - การตั้งค่า
    // ============================================================

    /**
     * statusMapping: แปลสถานะจาก API เป็นชื่อ key ที่เราใช้
     * 
     * ทำไมต้องแปล?
     * เปรียบเทียบ: เหมือนการแปลชื่อเมนูจากภาษาอังกฤษเป็นไทย
     * API บอกว่า "IN_PROGRESS" แต่เราเรียกภายในว่า "inProgress" (camelCase)
     * เพื่อให้โค้ดอ่านง่ายและเป็นมาตรฐาน JavaScript
     */
    const statusMapping = {
        'PENDING': 'pending',
        'IN_PROGRESS': 'inProgress',
        'NEED_FIX': 'needFix',
        'COMPLETED': 'completed',
    }

    /**
     * statusConfig: คอนฟิกสีและข้อความของแต่ละสถานะ
     * 
     * ทำไมต้องแยกเป็น array?
     * เปรียบเทียบ: เหมือนสูตรอาหารที่เขียนไว้ล่วงหน้า
     * แทนที่จะเขียนโค้ดสร้างการ์ดซ้ำๆ 5 ครั้ง
     * เราวนลูป array นี้ 1 รอบ → สร้างการ์ดออกมา 5 อัน
     * 
     * ข้อดี:
     * - เพิ่มสถานะใหม่ง่าย แค่เพิ่มใน array
     * - แก้ไขสีทีเดียว ไม่ต้องไล่แก้ทีละที่
     */
    const statusConfig = [
        {
            key: 'pending',
            title: 'รอดำเนินการ',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600',
            borderColor: 'border-yellow-200'
        },
        {
            key: 'inProgress',
            title: 'กำลังดำเนินการ',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            borderColor: 'border-blue-200'
        },
        {
            key: 'needFix',
            title: 'ต้องแก้ไข',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600',
            borderColor: 'border-red-200'
        },
        {
            key: 'completed',
            title: 'เสร็จสิ้น',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            borderColor: 'border-green-200'
        },
    ]

    // ============================================================
    // Data Fetching - การดึงข้อมูล
    // ============================================================

    /**
     * useEffect: รันครั้งเดียวเมื่อ component โหลด
     * 
     * เปรียบเทียบ: เหมือนการตั้งนาฬิกาปลุก
     * [] = dependencies ว่าง → ตั้งปลุกครั้งเดียวตอนเปิดหน้า
     * ไม่ตั้งปลุกซ้ำอีก เว้นแต่จะปิดหน้าแล้วเปิดใหม่
     * 
     * ทำไมต้องใช้ useEffect?
     * เพราะ fetch API เป็น "side effect" (การกระทำที่มีผลกับโลกภายนอก)
     * ห้ามเรียก API ตรงๆ ใน component body เด็ดขาด!
     * เหมือนห้ามกินข้าวขณะกำลังทำมือ ต้องล้างมือก่อน (ใช้ useEffect wrap ไว้)
     */
    useEffect(() => {
        const fetchStatusCounts = async () => {
            try {
                // 1. เริ่มโหลด → แสดง loading skeleton
                setLoading(true)
                setError(null)

                // 2. ดึง session ของ user ที่ล็อกอินอยู่
                // เปรียบเทียบ: ดึงบัตรประชาชนเพื่อพิสูจน์ตัวตน
                const session = getAdminSession()
                const empCode = session?.code

                if (!empCode) {
                    console.warn("No empCode found for StatusSummary")
                    router.push('/auth/login')
                    return
                    // ไม่มี empCode แต่ลองดึงต่อ (บาง API อาจไม่ต้องการ)
                }

                // 3. เตรียม payload ส่งไป API
                const payload = {
                    empCode: empCode,
                    page: 1,
                    pageSize: 1000,  // ดึงมาเยอะๆ เพื่อนับสถิติให้ครบ
                }

                // 4. เรียก API ดึงงานทั้งหมด
                // เปรียบเทียบ: โทรไปถามร้านอาหารว่า "วันนี้มีออเดอร์อะไรบ้าง"
                const response = await apiClient.post('/supervisor/by-code', payload)
                const items = response.data?.items || response.data?.data || response.data?.rows || []

                // 5. เตรียมตัวแปรนับ (เริ่มจาก 0 ทุกสถานะ)
                // เปรียบเทียบ: เตรียมตัวนับคนที่ 5 ช่องทาง (แต่ละช่องเริ่มที่ 0)
                const newCounts = {
                    pending: 0,
                    inProgress: 0,
                    needFix: 0,
                    completed: 0,
                }

                // 6. วนลูปนับจำนวนแต่ละสถานะ
                // เปรียบเทียบ: นับคนในห้างฯ 
                // - เจอคนในฝั่งเสื้อผ้า → +1 ที่เคาน์เตอร์เสื้อผ้า
                // - เจอคนในฝั่งอาหาร → +1 ที่เคาน์เตอร์อาหาร
                items.forEach(item => {
                    const status = item.status

                    if (status === 'PENDING') newCounts.pending++
                    else if (status === 'IN_PROGRESS') newCounts.inProgress++
                    else if (status === 'NEED_FIX') newCounts.needFix++
                    else if (status === 'COMPLETED') newCounts.completed++
                })

                // 7. อัพเดท state ด้วยตัวเลขที่นับได้
                // เปรียบเทียบ: ติดป้ายจำนวนคนหน้าแต่ละชั้น
                setCounts(newCounts)

            } catch (err) {
                // ถ้า API error → เก็บข้อความ error ไว้แสดง
                console.error("Failed to fetch status summary:", err)
                setError("Failed to load data")
            } finally {
                // ไม่ว่าจะสำเร็จหรือ error → หยุด loading
                // finally = รันเสมอไม่ว่ายังไง (เหมือนต้องปิดไฟก่อนออกจากห้องเสมอ)
                setLoading(false)
            }
        }

        fetchStatusCounts()
    }, []) // [] = รันครั้งเดียวพอ

    // ============================================================
    // Error State - กรณี error
    // ============================================================

    /**
     * ถ้า error → แสดงการ์ด error 4 อัน
     * เปรียบเทียบ: ลิฟต์เสีย → แสดงป้าย "ขออภัย ระบบขัดข้อง" ทุกชั้น
     */
    if (error) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statusConfig.map((config, index) => (
                    <div
                        key={index}
                        className="bg-zinc-900 border-zinc-800 border rounded-xl p-6 shadow-sm flex items-center justify-center"
                    >
                        <span className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> เกิดข้อผิดพลาด
                        </span>
                    </div>
                ))}
            </div>
        )
    }

    // ============================================================
    // Helper Functions - ฟังก์ชันช่วย
    // ============================================================

    /**
     * getApiStatus: แปล key UI เป็น API status
     * 
     * เปรียบเทียบ: แปลเมนูไทยเป็นอังกฤษเพื่อส่งไปครัว
     * - UI บอกว่า "inProgress" (ชื่อที่เราใช้ในโค้ด)
     * - API ต้องการ "IN_PROGRESS" (ชื่อที่ backend กำหนด)
     * 
     * ทำไมต้องแปล 2 ทาง?
     * - statusMapping: API → UI (ตอนดึงข้อมูล)
     * - getApiStatus: UI → API (ตอนส่งข้อมูล)
     */
    const getApiStatus = (key) => {
        const mapping = {
            'pending': 'PENDING',
            'inProgress': 'IN_PROGRESS',
            'needFix': 'NEED_FIX',
            'completed': 'COMPLETED',
        }
        return mapping[key]
    }

    /**
     * handleStatusClick: จัดการเมื่อกดการ์ดสถานะ
     * 
     * เปรียบเทียบ: เหมือนการกดปุ่มแสดงเฉพาะหนังประเภทหนึ่งใน Netflix
     * - กดปุ่ม "แอคชั่น" → แสดงแต่หนังแอคชั่น
     * - กดปุ่ม "แอคชั่น" ซ้ำอีกครั้ง → ยกเลิก กลับแสดงทุกประเภท
     * 
     * Logic:
     * 1. แปล key เป็น API status
     * 2. ถ้ากดสถานะเดิมซ้ำ → ส่ง null (ยกเลิกฟิลเตอร์)
     * 3. ถ้ากดสถานะใหม่ → ส่ง API status ไปกรอง
     * 4. เรียก onStatusClick (ที่ parent ส่งมาให้) เพื่ออัพเดท statusFilter
     */
    const handleStatusClick = (statusKey) => {
        const apiStatus = getApiStatus(statusKey)

        if (selectedStatus === apiStatus) {
            onStatusClick(null)  // กดซ้ำ = ยกเลิก
        } else {
            onStatusClick(apiStatus)  // กดใหม่ = เลือกสถานะนี้
        }
    }

    // ============================================================
    // Render - แสดงผล
    // ============================================================

    /**
     * Grid Layout: จัดการ์ดเป็นแถว
     * - มือถือ (sm): 2 การ์ดต่อแถว
     * - คอมพิวเตอร์ (lg): 5 การ์ดในแถวเดียว
     * 
     * เปรียบเทียบ: เหมือนจัดของใส่ชั้นวาง
     * - ชั้นเล็ก (มือถือ): วางได้แค่ 2 ชิ้นต่อชั้น
     * - ชั้นใหญ่ (คอม): วางได้ 5 ชิ้นในแถวเดียว
     */
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statusConfig.map((config, index) => {
                const apiStatus = getApiStatus(config.key)
                const isSelected = selectedStatus === apiStatus

                return (
                    <div
                        key={index}
                        onClick={() => handleStatusClick(config.key)}
                        className={`border rounded-xl  p-6 shadow-sm transition-all cursor-pointer ${isSelected
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/30 scale-105'
                            : 'border-zinc-800 hover:bg-zinc-800/50 hover:border-primary/50'
                            }`}
                    /**
                     * Conditional Styling (การใส่สีแบบมีเงื่อนไข):
                     * 
                     * เปรียบเทียบ: เหมือนไฟสัญญาณจราจร
                     * - ถ้าเป็นสถานะที่เลือก (isSelected) → เปิดไฟเขียว (border สี primary, background, ring)
                     * - ถ้าไม่ใช่สถานะที่เลือก → ไฟดับ (สีเทาธรรมดา)
                     * - เมื่อ hover → ไฟกระพริบ (เปลี่ยนสีนิดหน่อย)
                     * 
                     * ทำไมใช้ scale-105?
                     * เพื่อให้การ์ดโตขึ้น 5% เมื่อเลือก (ดูโดดเด่น)
                     * เหมือนปุ่มที่กดแล้วนูนขึ้นมา
                     */
                    >
                        <div className="flex items-center justify-between w-full">
                            {/* ชื่อสถานะ */}
                            <p className="text-sm font-medium opacity-90">
                                {config.title}
                            </p>

                            {/* ตัวเลขหรือ skeleton */}
                            {loading ? (
                                // ถ้ายังโหลดอยู่ → แสดงกล่องสีเทากระพริบ (skeleton)
                                // เปรียบเทียบ: placeholder ในรูปกำลังโหลด
                                <Skeleton className="h-10 w-16 bg-zinc-800" />
                            ) : (
                                // โหลดเสร็จ → แสดงตัวเลขจริง
                                <p className={`text-4xl font-extrabold tracking-tight ${config.textColor}`}>
                                    {counts[config.key]}
                                </p>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default StatusSummary
