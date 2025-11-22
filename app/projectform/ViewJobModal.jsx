// projectform/ViewJobModal.jsx

"use client";

import React from 'react';

const SectionTitle = ({ children }) => (
    <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-4 flex items-center">
        {children}
    </h3>
);

const DetailItem = ({ label, value }) => (
    <div className="mb-4">
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-base font-medium">{value || '-'}</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl text-white overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-xl font-bold flex items-center">
                        ดูรายละเอียดงาน <span className="ml-3 px-3 py-1 text-xs font-semibold rounded-full bg-green-700 text-green-100">เสร็จสมบูรณ์</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-lg font-bold">ปิด</button>
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
                <div className="p-4 bg-gray-800 flex justify-end space-x-3 border-t border-gray-700">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">อนุมัติ</button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">ปฏิเสธ</button>
                </div>
            </div>
        </div>
    );
}