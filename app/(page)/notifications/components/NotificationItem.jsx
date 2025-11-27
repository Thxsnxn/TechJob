/**
 * NotificationItem Component - การ์ดแสดงการแจ้งเตือน 1 รายการ
 * 
 * แสดงข้อมูล:
 * - ไอคอนตามประเภท
 * - ข้อความแจ้งเตือน
 * - เวลาที่แจ้ง
 * - กดที่การ์ดเพื่อ mark as read (ส่ง id ไปหลังบ้าน)
 */

'use client'

import { Bell, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { th } from "date-fns/locale"
import { useRouter } from "next/navigation"

const NotificationItem = ({ notification, onMarkAsRead }) => {
    const router = useRouter()
    /**
     * formatTime: แปลงเวลาเป็นข้อความ "xx นาทีที่แล้ว"
     */
    const formatTime = (createdAt) => {
        try {
            return formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
                locale: th
            })
        } catch (error) {
            return "เมื่อสักครู่"
        }
    }

    /**
     * handleClick: เมื่อกดที่การ์ด
     * - ถ้ายังไม่ได้อ่าน → ส่ง API mark as read พร้อม id
     */
    const handleClick = () => {
        // ส่ง notification ทั้งก้อนกลับไป เพื่อให้ page.jsx ใช้ workOrderId ได้
        onMarkAsRead(notification)
        router.push(`/work`)
    }

    return (
        <div
            onClick={handleClick}
            className={`flex items-start gap-4 p-4 transition-all border-l-4 ${!notification.isRead
                ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-500 cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-950/30"
                : "bg-card border-transparent hover:bg-muted/30"
                }`}
        >
            {/* ไอคอน */}
            <div className="shrink-0 mt-1">
                {!notification.isRead ? (
                    <Bell className="w-5 h-5 text-blue-500" />
                ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
            </div>

            {/* เนื้อหา */}
            <div className="grow min-w-0">
                <p className={`text-sm ${!notification.isRead ? "font-medium" : ""}`}>
                    {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(notification.createdAt)}
                </p>
            </div>
        </div>
    )
}

export default NotificationItem
