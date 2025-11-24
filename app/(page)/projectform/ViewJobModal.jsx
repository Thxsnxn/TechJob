// projectform/ViewJobModal.jsx

"use client";

import React from 'react';

const SectionTitle = ({ children }) => (
    <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 flex items-center text-gray-900 dark:text-white">
        {children}
    </h3>
);

const DetailItem = ({ label, value }) => (
    <div className="mb-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
        <p className="text-gray-900 dark:text-white text-base font-medium">{value || '-'}</p>
    </div>
);

export default function ViewJobModal({ job, onClose }) {
    // ข้อมูลเพิ่มเติมสำหรับ View/Edit (จำลอง)
    const viewJobDetails = {
        jobId: job.id,
        jobTitle: job.title,
        startDate: 'ยังไม่ระบุ',
        dueDate: 'ยังไม่ระบุ',
        description: 'รายละเอียดขอบเขตงานและข้อกำหนด',
        customerName: job.customer,
        customerContact: '081-XXX-XXXX',
        customerAddress: '123/4 Business Park',
        location: 'กรุงเทพมหานคร, ประเทศไทย',
        notes: 'การประชุมเริ่มต้นเสร็จสิ้นแล้ว รอการยืนยันจากลูกค้าสำหรับเฟส 2'
    };

    return (
        // ใช้ style inline เพื่อบังคับ Overlay ให้เป็นสีดำโปร่งใสเสมอ (ดูดีที่สุดสำหรับ Popup) 
        // แต่เนื้อหาข้างในจะเปลี่ยนตาม Theme
        <div 
            className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 transition-all"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} 
        >
            
            {/* ตัว Modal Card: รองรับ Light/Dark Mode */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50">
                    <h2 className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
                        ดูรายละเอียดงาน 
                        <span className="ml-3 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            เสร็จสมบูรณ์
                        </span>
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg font-bold p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Job Information */}
                    <div>
                        <SectionTitle><span className="mr-2">📁</span> ข้อมูลงาน</SectionTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="รหัสงาน" value={viewJobDetails.jobId} />
                            <DetailItem label="หัวข้องาน" value={viewJobDetails.jobTitle} />
                            <DetailItem label="วันที่เริ่มต้น" value={viewJobDetails.startDate} />
                            <DetailItem label="วันที่ครบกำหนด" value={viewJobDetails.dueDate} />
                            <div className="col-span-2">
                                <DetailItem label="คำอธิบาย" value={viewJobDetails.description} />
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div>
                        <SectionTitle><span className="mr-2">👤</span> ข้อมูลลูกค้า</SectionTitle>
                        <div className="grid grid-cols-3 gap-4">
                            <DetailItem label="ชื่อ" value={viewJobDetails.customerName} />
                            <DetailItem label="ติดต่อ" value={viewJobDetails.customerContact} />
                            <DetailItem label="ที่อยู่" value={viewJobDetails.customerAddress} />
                        </div>
                    </div>
                    
                    {/* Location Details */}
                    <div>
                        <SectionTitle><span className="mr-2">📍</span> รายละเอียดสถานที่</SectionTitle>
                        <DetailItem label="สถานที่" value={viewJobDetails.location} />
                    </div>

                    {/* Notes */}
                    <div>
                        <SectionTitle><span className="mr-2">📄</span> หมายเหตุ</SectionTitle>
                        <DetailItem label="หมายเหตุ" value={viewJobDetails.notes} />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg">
                        อนุมัติ
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg">
                        ปฏิเสธ
                    </button>
                </div>
            </div>

            {/* คลิกพื้นหลังเพื่อปิด */}
            <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
}