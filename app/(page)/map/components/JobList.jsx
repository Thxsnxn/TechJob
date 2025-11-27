'use client'
import React, { useState, useEffect, useCallback } from 'react'
import apiClient, { setAuthToken } from '@/lib/apiClient'
import { getAdminSession } from '@/lib/adminSession'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, MapPin, Calendar, User, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// --- Helper Functions (Adapted from jobmanagement/page.jsx) ---

const apiToUiStatus = {
    PENDING: "รอดำเนินการ",
    IN_PROGRESS: "กำลังดำเนินการ",
    PENDING_REVIEW: "รอตรวจสอบ",
    NEED_FIX: "ต้องแก้ไข",
    COMPLETED: "เสร็จสิ้น",
};

function extractCustomerName(customer) {
    if (!customer) return "ไม่ระบุชื่อลูกค้า";
    if (typeof customer === "string") return customer;
    const { companyName, contactName, firstName, lastName, code } = customer;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    return companyName || fullName || contactName || code || "ไม่ระบุชื่อลูกค้า";
}

function extractCustomerAddress(customer, fallback) {
    if (!customer || typeof customer === "string") return fallback || "-";
    return customer.address || fallback || "-";
}

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

function mapApiWorkToUi(work, index) {
    const uiStatus = apiToUiStatus[work.status] || work.status || "กำลังดำเนินการ";
    const customerObj = work.customer || null;
    const customerName = extractCustomerName(customerObj);
    const address = extractCustomerAddress(
        customerObj,
        work.locationAddress || "ไม่ระบุที่อยู่"
    );

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
        raw: work,
    };
}

const JobList = ({ onJobSelect, initialSelectedJob, onViewJob, onJobsLoaded, statusFilter }) => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState("")
    const [selectedJobId, setSelectedJobId] = useState(initialSelectedJob?.id || null)

    // Fetch jobs
    const fetchJobs = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const session = getAdminSession()

            if (!session || !session.code) {
                console.warn("No admin session or empCode found")
                setError("ไม่พบเซสชัน กรุณาเข้าสู่ระบบใหม่")
                setLoading(false)
                return
            }

            const empCode = session.code

            // Set auth token if available
            if (session.token) {
                setAuthToken(session.token)
            }

            const payload = {
                empCode: empCode,
                search: search || undefined,
                page: 1,
                pageSize: 50, // Limit to 50 for list view
            }

            console.log("Fetching jobs with payload:", payload)
            const response = await apiClient.post('/supervisor/by-code', payload)
            console.log("API Response:", response.data)

            const rawItems = response.data?.items || response.data?.data || response.data?.rows || []
            console.log("Raw Items:", rawItems)

            const mappedJobs = rawItems.map((job, index) => mapApiWorkToUi(job, index))
            setJobs(mappedJobs)

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

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchJobs()
        }, 500)
        return () => clearTimeout(timer)
    }, [fetchJobs])

    const handleJobClick = (job) => {
        setSelectedJobId(job.id)
        if (onJobSelect) {
            onJobSelect(job)
        }
    }

    const handleViewDetails = (e, job) => {
        e.stopPropagation()
        if (onViewJob) {
            onViewJob(job)
        }
    }

    const getStatusColor = (status) => {
        const s = status?.toLowerCase() || ""
        if (s === "completed" || s === "เสร็จสิ้น") return "bg-green-500/10 text-green-500 border-green-500/20"
        if (s.includes("progress") || s.includes("กำลังดำเนินการ")) return "bg-blue-500/10 text-blue-500 border-blue-500/20"
        if (s.includes("review") || s.includes("รอตรวจสอบ")) return "bg-purple-500/10 text-purple-500 border-purple-500/20"
        if (s.includes("fix") || s.includes("ต้องแก้ไข")) return "bg-red-500/10 text-red-500 border-red-500/20"
        if (s.includes("pending") || s.includes("รอดำเนินการ")) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        return "bg-muted text-muted-foreground border-border"
    }

    // Filter jobs based on statusFilter
    const filteredJobs = jobs.filter(job => {
        if (!statusFilter) return true
        return job.raw?.status === statusFilter
    })

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-full max-h-[calc(100vh-200px)] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold text-card-foreground mb-4">
                    งานทั้งหมด
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
            </div>

            {/* Scrollable Job List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {loading ? (
                    // Skeleton Loading
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
                    <div className="flex flex-col items-center justify-center py-10 text-destructive space-y-2">
                        <AlertCircle className="w-8 h-8" />
                        <p>{error}</p>
                    </div>
                ) : filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => handleJobClick(job)}
                            className={`relative p-4 border rounded-xl transition-all cursor-pointer group ${selectedJobId === job.id
                                ? 'border-primary/50 bg-primary/10 ring-1 ring-primary/20'
                                : 'border-border hover:border-primary/30 hover:bg-accent/50'
                                }`}
                        >
                            {/* View Details Button */}
                            <button
                                onClick={(e) => handleViewDetails(e, job)}
                                className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full hover:bg-primary/90 transition-all z-10 opacity-0 group-hover:opacity-100"
                            >
                                ดูรายละเอียด
                            </button>

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

                            <div className="mb-2">
                                <Badge variant="outline" className={`${getStatusColor(job.status)} whitespace-nowrap`}>
                                    {job.status}
                                </Badge>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <User className="w-3 h-3 mr-2 shrink-0 text-muted-foreground" />
                                    <span className="truncate">{job.customer}</span>
                                </div>

                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3 mr-2 shrink-0 text-muted-foreground" />
                                    <span className="truncate" title={job.locationName || job.address}>
                                        {job.locationName || job.address}
                                    </span>
                                </div>

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
                    <div className="text-center py-10 text-muted-foreground">
                        <p>ไม่พบงาน{statusFilter ? "ในสถานะนี้" : ""}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default JobList
