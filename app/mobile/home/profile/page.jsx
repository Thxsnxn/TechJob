"use client"
import React from 'react'
import Link from 'next/link'

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ width: 402, margin: '0 auto' }}>
      {/* Header */}
      <header className="px-4 pt-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/mobile/home" className="text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0L3.586 10l4.707-4.707a1 1 0 011.414 1.414L6.414 10l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-blue-600">Tech Job</h1>
        </div>

        <button aria-label="notifications" className="text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </header>

      <main className="px-5 pb-24">
        <div className="mt-3 text-center">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg">
            <img src="https://i.pinimg.com/736x/50/f3/9f/50f39feefd36f890e9a9754dcc09610a.jpg" alt="avatar" className="w-full h-full object-cover" />
          </div>

          <h2 className="mt-3 text-sm font-semibold">กิตติวัฒน์ กุดั่น - พนักงาน</h2>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-700 mb-1">ชื่อ</label>
            <div className="rounded-lg border px-3 py-2 shadow-sm bg-white">กิตติวัฒน์</div>
          </div>

          <div>
            <label className="block text-xs text-gray-700 mb-1">นามสกุล</label>
            <div className="rounded-lg border px-3 py-2 shadow-sm bg-white">กุดั่น</div>
          </div>

          <div>
            <label className="block text-xs text-gray-700 mb-1">ตำแหน่ง</label>
            <div className="rounded-lg border px-3 py-2 shadow-sm bg-white">ช่างประปา</div>
          </div>

         <div>
            <label className="block text-xs text-gray-700 mb-1">เกี่ยวกับฉัน</label>
            <div className="rounded-lg border px-3 py-2 shadow-sm bg-white">67107666 Sripatum University | Bachelor of Science (Computer Science and Software Development Innovation)</div>
          </div>

          <div>
            <label className="block text-xs text-gray-700 mb-1">ติดต่อ</label>
            <div className="rounded-lg border px-3 py-2 shadow-sm bg-white">janedoe@gmail.com</div>
          </div>

          <div>
            <label className="block text-xs text-gray-700 mb-1">เบอร์โทร</label>
            <div className="rounded-lg border px-3 py-2 shadow-sm bg-white">099-2xxx-3xx3</div>
          </div>
        </div>
      </main>

    </div>
  )
}

export default ProfilePage
