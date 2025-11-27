/**
 * ============================================================================
 * Notifications Page - หน้าการแจ้งเตือน
 * ============================================================================
 * 
 * ฟีเจอร์:
 * - ดึงการแจ้งเตือนจาก API
 * - แสดงทั้งหมด หรือเฉพาะที่ยังไม่ได้อ่าน
 * - กดอ่านแจ้งเตือน → ส่ง API mark as read
 * - อ่านทั้งหมดในคลิกเดียว
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { Card, CardContent } from '@/components/ui/card'
import apiClient from '@/lib/apiClient'
import { getAdminSession } from '@/lib/adminSession'
import NotificationHeader from './components/NotificationHeader'
import NotificationList from './components/NotificationList'

export default function NotificationsPage() {
  const router = useRouter()

  // ============================================================
  // State Management
  // ============================================================

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [unreadCount, setUnreadCount] = useState(0)

  // ============================================================
  // Data Fetching
  // ============================================================

  /**
   * fetchNotifications: ดึงการแจ้งเตือนจาก API
   */
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      // ดึง empCode จาก session
      const session = getAdminSession()
      const empCode = session?.code

      if (!empCode) {
        setError('ไม่พบรหัสพนักงาน กรุณาเข้าสู่ระบบใหม่')
        setLoading(false)
        return
      }

      // เรียก API
      const response = await apiClient.get(`/notifications?empCode=${empCode}`)

      // อัพเดท state
      setNotifications(response.data.items || [])
      setUnreadCount(response.data.unreadCount || 0)

    } catch (err) {
      console.error('Failed to fetch notifications:', err)
      setError('ไม่สามารถโหลดการแจ้งเตือนได้')
    } finally {
      setLoading(false)
    }
  }

  // โหลดครั้งแรกเมื่อเปิดหน้า
  useEffect(() => {
    fetchNotifications()
  }, [])

  // ============================================================
  // Event Handlers
  // ============================================================

  /**
   * handleMarkAsRead: อ่านการแจ้งเตือน 1 รายการ
   * - ถ้ามี workOrderId → ไปหน้างาน
   */
  const handleMarkAsRead = async (notification) => {
    try {
      console.log('🔔 Clicked notification:', notification)
      const id = notification.id

      // 1. เรียก API mark as read (PUT)
      if (!notification.isRead) {
        console.log('📝 Marking as read:', id)
        await apiClient.put(`/notifications/${id}/read`)

        router.push(`/work`)


        // อัพเดท UI ทันที
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        )

        // ลดจำนวน unread
        setUnreadCount(prev => Math.max(0, prev - 1))
      }

      // 2. ถ้ามี workOrderId ให้ไปหน้างาน
      if (notification.workOrderId) {
        console.log('🚀 Navigating to work:', notification.workOrderId)
        router.push(`/work?openWorkId=${notification.workOrderId}`)
      } else {
        console.log('⚠️ No workOrderId found in notification')
      }

      console.log('✅ อ่านการแจ้งเตือนสำเร็จ')
    } catch (err) {
      console.error('❌ อ่านการแจ้งเตือนไม่สำเร็จ:', err)
      // ถ้า error ให้โหลดใหม่เพื่อ sync กับ server
      fetchNotifications()
    }
  }

  /**
   * handleMarkAllAsRead: อ่านทั้งหมด
   */
  const handleMarkAllAsRead = async () => {
    try {
      // หาการแจ้งเตือนที่ยังไม่ได้อ่าน
      const unreadNotifications = notifications.filter(n => !n.isRead)

      if (unreadNotifications.length === 0) return

      // เรียก API ทีละตัว (PUT)
      await Promise.all(
        unreadNotifications.map(n =>
          apiClient.put(`/notifications/${n.id}/read`)
        )
      )

      // อัพเดท UI ทันที
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      )

      setUnreadCount(0)

      console.log('✅ อ่านทั้งหมดสำเร็จ')
    } catch (err) {
      console.error('❌ อ่านทั้งหมดไม่สำเร็จ:', err)
      // ถ้า error ให้โหลดใหม่
      fetchNotifications()
    }
  }

  // ============================================================
  // Filtered Data
  // ============================================================

  /**
   * กรองการแจ้งเตือนตาม tab ที่เลือก
   */
  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 flex flex-col">
      <SiteHeader title="การแจ้งเตือน" />

      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-[1200px] mx-auto w-full">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-6 shadow-lg">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              การแจ้งเตือน
            </h1>
            <p className="text-purple-100 mt-2">
              ติดตามการอัพเดทและข้อความสำคัญทั้งหมด
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Notifications Card */}
        <div>
          <NotificationHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            unreadCount={unreadCount}
            onMarkAllAsRead={handleMarkAllAsRead}
          />

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Tab Content: All */}
              {activeTab === 'all' && (
                <NotificationList
                  notifications={notifications}
                  loading={loading}
                  onMarkAsRead={handleMarkAsRead}
                />
              )}

              {/* Tab Content: Unread */}
              {activeTab === 'unread' && (
                <NotificationList
                  notifications={filteredNotifications}
                  loading={loading}
                  onMarkAsRead={handleMarkAsRead}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}