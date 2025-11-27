/**
 * ============================================================================
 * Job List Component - รายการงานทั้งหมด
 * ============================================================================
 * 
 * เปรียบเทียบ: เหมือนรายการเพลงใน Spotify
 * - มี search bar ด้านบนเพื่อค้นหา
 * - scroll ดูรายการได้
 * - กดเพลงไหน → เล่นเพลงนั้น (ไฮไลท์บนแผนที่)
 * - กดปุ่มดูรายละเอียด → เปิดหน้าเต็ม
 * 
 * คุณสมบัติ:
 * 1. ค้นหางานด้วยชื่อ/ลูกค้า
 * 2. กรองตามสถานะที่เลือกจาก StatusSummary
 * 3. แสดง loading skeleton ขณะโหลด
 * 4. เลือกงาน → ไฮไลท์บนแผนที่
 * 5. ดูรายละเอียด → เปิด modal
 */

'use client'
import React, { useState, useEffect, useCallback } from 'react'
import apiClient, { setAuthToken } from '@/lib/apiClient'
import { getAdminSession } from '@/lib/adminSession'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, MapPin, Calendar, User, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// ============================================================
// Helper Functions - ฟังก์ชันช่วยแปลงข้อมูล
// ============================================================

/**
 * apiToUiStatus: แปลงสถานะจาก API เป็นภาษาไทย
 * 
 * เปรียบเทียบ: เหมือนพจนานุกรมแปลภาษา
 * - API พูดภาษาอังกฤษ "IN_PROGRESS"
 * - UI แสดงภาษาไทย "กำลังดำเนินการ"
 */
const apiToUiStatus = {
    PENDING: "รอดำเนินการ",
    IN_PROGRESS: "กำลังดำเนินการ",
    PENDING_REVIEW: "รอตรวจสอบ",
    NEED_FIX: "ต้องแก้ไข",
    COMPLETED: "เสร็จสิ้น",
};

/**
 * extractCustomerName: ดึงชื่อลูกค้าจากข้อมูล
 * 
 * ทำไมต้องมี?
 * - ข้อมูลลูกค้าจาก API มีหลายรูปแบบ
 *   อาจเป็น string ธรรมดา หรือ object ที่มี companyName, firstName, lastName
 * - function นี้จัดการทุกกรณี แล้วคืนค่าชื่อที่ดีที่สุด
 * 
 * เปรียบเทียบ: เหมือนพนักงานต้อนรับที่ต้องเรียกชื่อแขก
 * - ถ้ามีชื่อบริษัท → เรียก "บริษัท ABC"
 * - ถ้าไม่มี แต่มีชื่อ-นามสกุล → เรียก "คุณสมชาย ใจดี"
 * - ถ้าไม่มีอะไรเลย → เรียก "คุณลูกค้า" (fallback)
 */
function extractCustomerName(customer) {
    if (!customer) return "ไม่ระบุชื่อลูกค้า";
    if (typeof customer === "string") return customer;
    const { companyName, contactName, firstName, lastName, code } = customer;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    return companyName || fullName || contactName || code || "ไม่ระบุชื่อลูกค้า";
}

/**
 * extractCustomerAddress: ดึงที่อยู่ลูกค้า
 * 
 * เปรียบเทียบ: ดึงที่อยู่จัดส่งสินค้า
 * - ถ้ามี → ใช้ที่อยู่นั้น
 * - ถ้าไม่มี → ใช้ที่อยู่สำรอง (fallback)
 */
function extractCustomerAddress(customer, fallback) {
    if (!customer || typeof customer === "string") return fallback || "-";
    return customer.address || fallback || "-";
}

/**
 * formatWorkDateRange: แปลงวันที่เป็นข้อความ
 * 
 * เปรียบเทียบ: แปลงรูปแบบวันที่ให้อ่านง่าย
 * - มีทั้งวันเริ่ม-จบ → "01/01/2024 - 05/01/2024"
 * - มีแค่วันเริ่ม → "01/01/2024"
 * - ไม่มีเลย → null
 * 
 * toLocaleDateString("th-TH"):
 * - แปลงเป็นรูปแบบภาษาไทย (พ.ศ.)
 */
function formatWorkDateRange(start, end) {
    if (!start && !end) return null;
    const fmt = (d) =>
        new Date(d).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    if (start && end) return `${fmt(start)} - ${fmt(end)}`;
    if (start) return fmt(start);
    if (end) return fmt(end);
    return null;
}

/**
 * mapApiWorkToUi: แปลงข้อมูลงานจาก API เป็นรูปแบบที่ UI ใช้
 * 
 * ทำไมต้องแปลง?
 * - API ออกแบบให้เก็บข้อมูลครบถ้วน (เน้นความสมบูรณ์)
 * - UI ต้องการข้อมูลที่พร้อมแสดง (เน้นความสะดวก)
 * 
 * เปรียบเทียบ: เหมือนการแกะกล่องพัสดุ Amazon
 * - API ส่งกล่องใหญ่มาเต็มไปด้วยของ (raw data)
 * - เราแกะออกมา จัดเรียงใหม่ในตู้เก็บของ (UI format)
 * - ทิ้งกล่องเก่าไป (ไม่ใช้ field ที่ไม่จำเป็น)
 */
function mapApiWorkToUi(work, index) {
    const uiStatus = apiToUiStatus[work.status] || work.status || "กำลังดำเนินการ";
    const customerObj = work.customer || null;
    const customerName = extractCustomerName(customerObj);
    const address = extractCustomerAddress(
        customerObj,
        work.locationAddress || "ไม่ระบุที่อยู่"
    );

    // แปลงพิกัดเป็นตัวเลข (บาง API ส่งมาเป็น string)
    const latRaw = work.locationLat ?? work.lat ?? null;
    const lngRaw = work.locationLng ?? work.lng ?? null;
    const lat = latRaw !== null && latRaw !== undefined && latRaw !== "" ? Number(latRaw) : null;
    const lng = lngRaw !== null && lngRaw !== undefined && lngRaw !== "" ? Number(lngRaw) : null;

    const locationName =
        (typeof work.locationName === "string" &&
            work.locationName.trim() !== "" &&
            work.locationName.trim()) ||
        customerName;

    return {
        id: work.id ?? work.workOrderId ?? index + 1,
        jobCode: work.jobCode || work.code || `JOB-${String(work.id).padStart(4, '0')}`,
        title: work.title || "ไม่ระบุชื่องาน",
        customer: customerName,
        status: uiStatus,
        dateRange: work.dateRange || formatWorkDateRange(work.startDate, work.endDate),
        address,
        locationName,
        lat,
        lng,
        raw: work,  // เก็บข้อมูลดิบไว้ด้วย (เผื่อต้องการใช้ภายหลัง)
    };
}

// ============================================================
// Main Component
// ============================================================

const JobList = ({ onJobSelect, initialSelectedJob, onViewJob, onJobsLoaded, statusFilter }) => {
    // ============================================================
    // State Management
    // ============================================================

    /**
     * jobs: รายการงานทั้งหมดที่โหลดมา
     * เปรียบเทียบ: เหมือนรายการเพลงใน playlist
     */
    const [jobs, setJobs] = useState([])

    /**
     * loading: สถานะการโหลด
     * เปรียบเทียบ: ไอคอนหมุนๆ ตอนโหลดเพลง
     */
    const [loading, setLoading] = useState(false)

    /**
     * error: ข้อความ error (ถ้ามี)
     * เปรียบเทียบ: ข้อความ "ขัดข้อง ลองใหม่อีกครั้ง"
     */
    const [error, setError] = useState(null)

    /**
     * search: คำค้นหา
     * เปรียบเทียบ: ข้อความใน search bar ของ YouTube
     */
    const [search, setSearch] = useState("")

    /**
     * selectedJobId: ID งานที่เลือกอยู่
     * เปรียบเทียบ: เพลงที่กำลังเล่นอยู่ (ไฮไลท์)
     */
    const [selectedJobId, setSelectedJobId] = useState(initialSelectedJob?.id || null)

    // ============================================================
    // Data Fetching
    // ============================================================

    /**
     * fetchJobs: ดึงข้อมูลงานจาก API
     * 
     * ทำไมใช้ useCallback?
     * - ป้องกันฟังก์ชันถูกสร้างใหม่ทุกครั้งที่ component render
     * - เปรียบเทียบ: จำสูตรอาหารไว้ในหัว ไม่ต้องเปิดหนังสือทุกครั้ง
     * 
     * Dependencies [search, onJobsLoaded]:
     * - เมื่อ search เปลี่ยน → สร้างฟังก์ชันใหม่ที่ search ด้วยคำใหม่
     * - onJobsLoaded เปลี่ยน → อัพเดทฟังก์ชัน callback
     */
    const fetchJobs = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            // 1. ดึง session เพื่อพิสูจน์ตัวตน
            const session = getAdminSession()

            if (!session || !session.code) {
                console.warn("No admin session or empCode found")
                setError("ไม่พบเซสชัน กรุณาเข้าสู่ระบบใหม่")
                setLoading(false)
                return
            }

            const empCode = session.code

            // 2. ตั้งค่า auth token (บัตรผ่านประตู)
            if (session.token) {
                setAuthToken(session.token)
            }

            // 3. เตรียม payload
            const payload = {
                empCode: empCode,
                search: search || undefined,  // ถ้า search ว่าง → ไม่ส่ง
                page: 1,
                pageSize: 50,
            }

            console.log("Fetching jobs with payload:", payload)

            // 4. เรียก API
            const response = await apiClient.post('/supervisor/by-code', payload)
            console.log("API Response:", response.data)

            // 5. ดึงรายการงานจาก response
            const rawItems = response.data?.items || response.data?.data || response.data?.rows || []
            console.log("Raw Items:", rawItems)

            // 6. แปลงเป็นรูปแบบ UI
            const mappedJobs = rawItems.map((job, index) => mapApiWorkToUi(job, index))
            setJobs(mappedJobs)

            // 7. แจ้ง parent ว่าโหลดเสร็จแล้ว (ส่งข้อมูลกลับไป)
            if (onJobsLoaded) {
                onJobsLoaded(mappedJobs)
            }

        } catch (error) {
            console.error("Failed to fetch jobs:", error)
            setError("ไม่สามารถโหลดข้อมูลงานได้ กรุณาลองใหม่อีกครั้ง")
        } finally {
            setLoading(false)
        }
    }, [search, onJobsLoaded])

    /**
     * Debounced Search Effect
     * 
     * เปรียบเทียบ: เหมือนรอให้พิมพ์เสร็จก่อนค้นหา
     * - พิมพ์ "ติ" → ยังไม่ค้นหา รอก่อน
     * - พิมพ์ "ติด" → ยังไม่ค้นหา รอก่อน
     * - พิมพ์ "ติดตั้ง" → หยุดพิมพ์ 500ms → เริ่มค้นหา
     * 
     * ทำไม?
     * - ป้องกันเรียก API บ่อยเกินไป (ทุกตัวอักษร)
     * - ประหยัด bandwidth และ server load
     * 
     * setTimeout + clearTimeout:
     * - ตั้งนาฬิกาปลุก 500ms
     * - ถ้าพิมพ์ใหม่ก่อนครบ → ยกเลิกปลุกเดิม ตั้งใหม่
     * - ถ้าครบ 500ms → ปลุก → ค้นหา
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchJobs()
        }, 500)

        // Cleanup: ยกเลิก timer เมื่อ component unmount หรือ search เปลี่ยน
        return () => clearTimeout(timer)
    }, [fetchJobs])

    // ============================================================
    // Event Handlers
    // ============================================================

    /**
     * handleJobClick: จัดการเมื่อกดเลือกงาน
     * 
     * เปรียบเทียบ: กดเพลงใน Spotify
     * - ไฮไลท์เพลงนั้น (setSelectedJobId)
     * - เล่นเพลง (onJobSelect → บินไปบนแผนที่)
     */
    const handleJobClick = (job) => {
        setSelectedJobId(job.id)
        if (onJobSelect) {
            onJobSelect(job)
        }
    }

    /**
     * handleViewDetails: จัดการเมื่อกดดูรายละเอียด
     * 
     * e.stopPropagation():
     * - ป้องกัน event bubble ขึ้นไปถึง parent
     * 
     * เปรียบเทียบ: กดปุ่ม "i" ข้อมูลเพลงบน Spotify
     * - ไม่ต้องการให้เล่นเพลง แค่ดูข้อมูล
     * - ต้อง stop event ไม่ให้ trigger handleJobClick
     */
    const handleViewDetails = (e, job) => {
        e.stopPropagation()
        if (onViewJob) {
            onViewJob(job)
        }
    }

    /**
     * getStatusColor: คืนค่า class สีตามสถานะ
     * 
     * เปรียบเทียบ: เหมือนสีป้ายจราจร
     * - สีเขียว = ผ่าน (เสร็จสิ้น)
     * - สีเหลือง = ระวัง (รอดำเนินการ)
     * - สีแดง = หยุด (ต้องแก้ไข)
     */
    const getStatusColor = (status) => {
        const s = status?.toLowerCase() || ""
        if (s === "completed" || s === "เสร็จสิ้น") return "bg-green-500/10 text-green-500 border-green-500/20"
        if (s.includes("progress") || s.includes("กำลังดำเนินการ")) return "bg-blue-500/10 text-blue-500 border-blue-500/20"
        if (s.includes("review") || s.includes("รอตรวจสอบ")) return "bg-purple-500/10 text-purple-500 border-purple-500/20"
        if (s.includes("fix") || s.includes("ต้องแก้ไข")) return "bg-red-500/10 text-red-500 border-red-500/20"
        if (s.includes("pending") || s.includes("รอดำเนินการ")) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        return "bg-muted text-muted-foreground border-border"
    }

    /**
     * filteredJobs: กรองงานตาม statusFilter
     * 
     * ทำไมไม่ filter ตอนดึงข้อมูล?
     * - API ดึงข้อมูลทั้งหมดมาครั้งเดียว
     * - Filter ฝั่ง frontend เร็วกว่า (ไม่ต้องเรียก API ใหม่)
     * 
     * เปรียบเทียบ: มีหนังสือ 100 เล่มในชั้น
     * - แทนที่จะเดินไปห้องสมุดทุกครั้ง (API call)
     * - เอามาวางไว้บนโต๊ะ แล้วเลือกดูเฉพาะที่สนใจ (filter)
     */
    const filteredJobs = jobs.filter(job => {
        if (!statusFilter) return true
        return job.raw?.status === statusFilter
    })

    // ============================================================
    // Render
    // ============================================================

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-full max-h-[calc(100vh-200px)] overflow-hidden">
            {/* Header Section */}
            <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold text-card-foreground mb-4">
                    งานทั้งหมด
                    {/* แสดงจำนวนงานที่กรอง */}
                    {statusFilter && <span className="text-sm font-normal text-muted-foreground ml-2">({filteredJobs.length} งาน)</span>}
                </h2>

                {/* Search Bar */}
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="ค้นหางาน..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                    />
                    {/* ไอคอนแว่นขยาย */}
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
            </div>

            {/* Scrollable Job List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {loading ? (
                    // Loading State: แสดง skeleton placeholder
                    // เปรียบเทียบ: กล่องสีเทากระพริบตอนรูปกำลังโหลด
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 border border-border rounded-xl space-y-3 bg-card/50">
                            <Skeleton className="h-5 w-3/4 bg-muted" />
                            <Skeleton className="h-4 w-1/2 bg-muted" />
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-20 bg-muted" />
                                <Skeleton className="h-6 w-6 rounded-full bg-muted" />
                            </div>
                        </div>
                    ))
                ) : error ? (
                    // Error State: แสดงข้อความ error
                    <div className="flex flex-col items-center justify-center py-10 text-destructive space-y-2">
                        <AlertCircle className="w-8 h-8" />
                        <p>{error}</p>
                    </div>
                ) : filteredJobs.length > 0 ? (
                    // Success State: แสดงรายการงาน
                    filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => handleJobClick(job)}
                            className={`relative p-4 border rounded-xl transition-all cursor-pointer group ${selectedJobId === job.id
                                ? 'border-primary/50 bg-primary/10 ring-1 ring-primary/20'
                                : 'border-border hover:border-primary/30 hover:bg-accent/50'
                                }`}
                        >
                            {/* ปุ่ม "ดูรายละเอียด" ที่แสดงตอน hover */}
                            {/* 
                                opacity-0 group-hover:opacity-100:
                                - ปกติซ่อนไว้ (opacity-0)
                                - เมื่อ hover ที่ card → แสดง (opacity-100)
                                
                                เปรียบเทียบ: ปุ่มลับที่ปรากฏเมื่อเอาเมาส์ชี้
                            */}
                            <button
                                onClick={(e) => handleViewDetails(e, job)}
                                className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full hover:bg-primary/90 transition-all z-10 opacity-0 group-hover:opacity-100"
                            >
                                ดูรายละเอียด
                            </button>

                            {/* ชื่องานและรหัส */}
                            <div className="flex items-start justify-between mb-2 pr-12">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-card-foreground line-clamp-1" title={job.title}>
                                        {job.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {job.jobCode}
                                    </p>
                                </div>
                            </div>

                            {/* Badge สถานะ */}
                            <div className="mb-2">
                                <Badge variant="outline" className={`${getStatusColor(job.status)} whitespace-nowrap`}>
                                    {job.status}
                                </Badge>
                            </div>

                            {/* ข้อมูลเพิ่มเติม */}
                            <div className="space-y-1">
                                {/* ชื่อลูกค้า */}
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <User className="w-3 h-3 mr-2 shrink-0 text-muted-foreground" />
                                    <span className="truncate">{job.customer}</span>
                                </div>

                                {/* ที่อยู่ */}
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3 mr-2 shrink-0 text-muted-foreground" />
                                    <span className="truncate" title={job.locationName || job.address}>
                                        {job.locationName || job.address}
                                    </span>
                                </div>

                                {/* วันที่ (ถ้ามี) */}
                                {job.dateRange && (
                                    <div className="flex items-center text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                                        <Calendar className="w-3 h-3 mr-2 shrink-0" />
                                        <span>{job.dateRange}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    // Empty State: ไม่มีงาน
                    <div className="text-center py-10 text-muted-foreground">
                        <p>ไม่พบงาน{statusFilter ? "ในสถานะนี้" : ""}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default JobList
