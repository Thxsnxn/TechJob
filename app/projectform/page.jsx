// projectform/page.jsx

"use client";

import React, { useState } from 'react';
import JobTable from './JobTable';
import ViewJobModal from './ViewJobModal';
import EditJobModal from './EditJobModal';
import { SiteHeader } from "@/components/site-header";


// ข้อมูลจำลอง (Mock Data)
const initialJobs = [
    { id: '#J001', title: 'บำรุงรักษาซอฟต์แวร์', customer: 'บีม', lead: 'จอห์น', date: '2025-10-25', status: 'เสร็จสมบูรณ์' },
    { id: '#J002', title: 'ติดตั้งเครือข่าย', customer: 'กร', lead: 'ธรรศนนท์', date: '2025-11-20', status: 'กำลังดำเนินการ' },
    { id: '#J003', title: 'ตั้งค่าเซิร์ฟเวอร์', customer: 'หนิง', lead: 'มินา', date: '2025-12-15', status: 'รอดำเนินการ' },
    { id: '#J004', title: 'บำรุงรักษาซอฟต์แวร์', customer: 'มายด์', lead: 'จอห์น', date: '2025-10-28', status: 'เสร็จสมบูรณ์' },
    { id: '#J005', title: 'ติดตั้งเครือข่าย', customer: 'กร', lead: 'ธรรศนนท์', date: '2025-12-12', status: 'กำลังดำเนินการ' },
];

export default function JobManagementPage() {
    const [jobs, setJobs] = useState(initialJobs);
    const [searchTerm, setSearchTerm] = useState('');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const handleView = (jobId) => {
        const job = jobs.find(j => j.id === jobId);
        setSelectedJob(job);
        setIsViewModalOpen(true);
    };

    const handleEdit = (jobId) => {
        const job = jobs.find(j => j.id === jobId);
        setSelectedJob(job);
        setIsEditModal(true);
    };

    const handleSaveEdit = (editedJob) => {
        setJobs(jobs.map(j => (j.id === editedJob.id ? editedJob : j)));
        setIsEditModal(false);
        setSelectedJob(null);
    };

    const filteredJobs = jobs.filter(job =>
        job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <header className="flex justify-between items-center pb-4 border-b border-gray-700">
                <div>
                    <h1 className="text-3xl font-bold">Project Form</h1>
                    <p className="text-gray-400">งานที่ได้รับหมอบหมายจากลูกค้า</p>
                </div>
                {/* ปุ่ม 'Create New Job' และ 'Reset Data' ถูกนำออกตามคำขอ */}
                <div className="flex space-x-4">
                </div>
            </header>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="ค้นหารหัสงาน, หัวข้องาน หรือลูกค้า..."
                        className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>เลือกบทบาท</option>
                    </select>
                    <select className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>เลือกสถานะ</option>
                    </select>
                </div>

                <h2 className="text-xl font-semibold mb-4">งานทั้งหมด</h2>
                <JobTable jobs={filteredJobs} onView={handleView} onEdit={handleEdit} />
            </div>

            {/* View Job Modal */}
            {isViewModalOpen && selectedJob && (
                <ViewJobModal
                    job={selectedJob}
                    onClose={() => setIsViewModalOpen(false)}
                />
            )}

            {/* Edit Job Modal */}
            {isEditModalOpen && selectedJob && (
                <EditJobModal
                    job={selectedJob}
                    onSave={handleSaveEdit}
                    onClose={() => setIsEditModal(false)}
                />
            )}
        </div>
    );
}