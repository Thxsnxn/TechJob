/**
 * NotificationList Component - รายการการแจ้งเตือนทั้งหมด
 * 
 * จัดการ:
 * - แสดง loading skeleton
 * - แสดง empty state
 * - แสดงรายการ notifications
 */

'use client'

import NotificationItem from "./NotificationItem"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell } from "lucide-react"
import { useRouter } from "next/navigation"



const NotificationList = ({ notifications, loading, onMarkAsRead }) => {
    
    const router = useRouter()
    
    // Loading State
    if (loading) {
        return (
            <div className="divide-y">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-4">
                        <Skeleton className="w-5 h-5 rounded-full shrink-0 mt-1" />
                        <div className="grow space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Empty State
    if (!notifications || notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Bell className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">ไม่มีการแจ้งเตือน</p>
                <p className="text-sm">คุณได้อ่านการแจ้งเตือนทั้งหมดแล้ว</p>
            </div>
        )
    }

    // Render Notifications
    return (
        <div className="divide-y">
            
            {notifications.map((notification) => (
                <NotificationItem
                    onClick={() => router.push(`/work`)}
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                />
            ))}
        </div>
    )
}

export default NotificationList
