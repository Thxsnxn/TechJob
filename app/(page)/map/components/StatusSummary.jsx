'use client'
import React, { useState, useEffect } from 'react'
import apiClient from '@/lib/apiClient'
import { getAdminSession } from '@/lib/adminSession'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

const StatusSummary = ({ selectedStatus, onStatusClick }) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [counts, setCounts] = useState({
        pending: 0,
        inProgress: 0,
        pendingReview: 0,
        needFix: 0,
        completed: 0,
    })

    // Mapping for API status to our internal keys
    const statusMapping = {
        'PENDING': 'pending',
        'IN_PROGRESS': 'inProgress',
        'PENDING_REVIEW': 'pendingReview',
        'NEED_FIX': 'needFix',
        'COMPLETED': 'completed',
    }

    // UI Configuration for each status box
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
            key: 'pendingReview',
            title: 'รอตรวจสอบ',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            borderColor: 'border-purple-200'
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

    useEffect(() => {
        const fetchStatusCounts = async () => {
            try {
                setLoading(true)
                setError(null)

                const session = getAdminSession()
                const empCode = session?.code

                if (!empCode) {
                    console.warn("No empCode found for StatusSummary")
                }

                const payload = {
                    empCode: empCode,
                    page: 1,
                    pageSize: 1000,
                }

                const response = await apiClient.post('/supervisor/by-code', payload)
                const items = response.data?.items || response.data?.data || response.data?.rows || []

                const newCounts = {
                    pending: 0,
                    inProgress: 0,
                    pendingReview: 0,
                    needFix: 0,
                    completed: 0,
                }

                items.forEach(item => {
                    const status = item.status

                    if (status === 'PENDING') newCounts.pending++
                    else if (status === 'IN_PROGRESS') newCounts.inProgress++
                    else if (status === 'PENDING_REVIEW') newCounts.pendingReview++
                    else if (status === 'NEED_FIX') newCounts.needFix++
                    else if (status === 'COMPLETED') newCounts.completed++
                })

                setCounts(newCounts)

            } catch (err) {
                console.error("Failed to fetch status summary:", err)
                setError("Failed to load data")
            } finally {
                setLoading(false)
            }
        }

        fetchStatusCounts()
    }, [])

    if (error) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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

    // Helper to get API status from our UI key
    const getApiStatus = (key) => {
        const mapping = {
            'pending': 'PENDING',
            'inProgress': 'IN_PROGRESS',
            'pendingReview': 'PENDING_REVIEW',
            'needFix': 'NEED_FIX',
            'completed': 'COMPLETED',
        }
        return mapping[key]
    }

    const handleStatusClick = (statusKey) => {
        const apiStatus = getApiStatus(statusKey)
        // If clicking the same status, deselect it (show all)
        if (selectedStatus === apiStatus) {
            onStatusClick(null)
        } else {
            onStatusClick(apiStatus)
        }
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {statusConfig.map((config, index) => {
                const apiStatus = getApiStatus(config.key)
                const isSelected = selectedStatus === apiStatus

                return (
                    <div
                        key={index}
                        onClick={() => handleStatusClick(config.key)}
                        className={`border rounded-xl p-6 shadow-sm transition-all cursor-pointer ${isSelected
                                ? 'border-primary bg-primary/10 ring-2 ring-primary/30 scale-105'
                                : 'border-zinc-800 hover:bg-zinc-800/50 hover:border-primary/50'
                            }`}
                    >
                        <p className="text-sm font-medium mb-2">
                            {config.title}
                        </p>
                        {loading ? (
                            <Skeleton className="h-10 w-16 bg-zinc-800" />
                        ) : (
                            <p className={`text-4xl font-bold ${config.textColor}`}>
                                {counts[config.key]}
                            </p>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default StatusSummary
