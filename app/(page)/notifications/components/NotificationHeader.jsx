/**
 * NotificationHeader Component - ส่วนหัวของหน้า Notifications
 * 
 * ประกอบด้วย:
 * - Tabs (All/Unread) พร้อม badge แสดงจำนวน
 * - ปุ่ม "Mark all as read"
 */

'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCheck } from "lucide-react"

const NotificationHeader = ({
    activeTab,
    onTabChange,
    unreadCount,
    onMarkAllAsRead
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full sm:w-auto">
                <TabsList>
                    <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                    <TabsTrigger value="unread" className="relative">
                        ยังไม่ได้อ่าน
                        {unreadCount > 0 && (
                            <Badge className="ml-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded-full">
                                {unreadCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Mark all as read button */}
            <Button
                variant="outline"
                size="sm"
                onClick={onMarkAllAsRead}
                disabled={unreadCount === 0}
                className="w-full sm:w-auto"
            >
                <CheckCheck className="w-4 h-4 mr-2" />
                อ่านทั้งหมด
            </Button>
        </div>
    )
}

export default NotificationHeader
