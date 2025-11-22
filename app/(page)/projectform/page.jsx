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
        <main className="">
             {/* SiteHeader ควรมีการจัดการ Theme Toggle ภายใน */}
             <SiteHeader title="" />

        {/* ปรับ Main Container: 
            Light: bg-gray-50, text-gray-900 
            Dark: bg-gray-900, text-white 
        */}
        <div className="min-h-screen p-6 transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
            
            {/* Header Section */}
            <header className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <h1 className="text-3xl font-bold">Project Form</h1>
                    <p className="text-gray-500 dark:text-gray-400">งานที่ได้รับหมอบหมายจากลูกค้า</p>
                </div>
                <div className="flex space-x-4">
                </div>
            </header>

            {/* Card Container */}
            <div className="mt-6 p-4 rounded-lg shadow-md border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="ค้นหารหัสงาน, หัวข้องาน หรือลูกค้า..."
                        className="p-2 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                   bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500
                                   dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    {/* Select Inputs */}
                    <select className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                       bg-gray-50 border border-gray-300 text-gray-900
                                       dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option>เลือกบทบาท</option>
                    </select>
                    <select className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                       bg-gray-50 border border-gray-300 text-gray-900
                                       dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option>เลือกสถานะ</option>
                    </select>
                </div>

                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">งานทั้งหมด</h2>
                
                {/* JobTable อาจจะต้องเข้าไปแก้ภายใน Component นั้นด้วยเพื่อให้รองรับ Dark Mode */}
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
        </main>
    );
}