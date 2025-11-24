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
    // ลองเพิ่มข้อมูลจำลองเพื่อให้เห็นผลลัพธ์การแบ่งหน้าชัดเจนขึ้น (Optional)
    { id: '#J006', title: 'ออกแบบเว็บไซต์', customer: 'สมชาย', lead: 'วิชัย', date: '2025-12-20', status: 'รอดำเนินการ' },
];

export default function JobManagementPage() {
    const [jobs, setJobs] = useState(initialJobs);
    const [searchTerm, setSearchTerm] = useState('');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // กำหนดจำนวนรายการต่อหน้า

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

    // กรองข้อมูล
    const filteredJobs = jobs.filter(job =>
        job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Pagination Logic ---
    const indexOfLastJob = currentPage * itemsPerPage;
    const indexOfFirstJob = indexOfLastJob - itemsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    // Handle Search Change (Reset to Page 1)
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };

    return (
        <main className="">
             <SiteHeader title="" />

            <div className="min-h-screen p-6 transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
                
                {/* Header Section */}
                <header className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h1 className="text-3xl font-bold">Project Form</h1>
                        <p className="text-gray-500 dark:text-gray-400">งานที่ได้รับมอบหมายจากลูกค้า</p>
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
                            onChange={handleSearchChange}
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
                    
                    {/* ส่ง currentJobs แทน filteredJobs ไปแสดงผล */}
                    <JobTable jobs={currentJobs} onView={handleView} onEdit={handleEdit} />

                    {/* --- Pagination Section --- */}
                    {filteredJobs.length > 0 && (
                        <div className="flex flex-col md:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            
                            {/* ข้อมูลการแสดงผล */}
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-0">
                                แสดง {indexOfFirstJob + 1} ถึง {Math.min(indexOfLastJob, filteredJobs.length)} จากทั้งหมด {filteredJobs.length} รายการ
                            </div>

                            {/* ปุ่มควบคุม */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded-md border text-sm font-medium transition-colors
                                        ${currentPage === 1 
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700' 
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    ก่อนหน้า
                                </button>

                                {/* Loop สร้างปุ่มตัวเลขหน้า */}
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginate(index + 1)}
                                        className={`px-3 py-1 rounded-md border text-sm font-medium transition-colors
                                            ${currentPage === index + 1
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded-md border text-sm font-medium transition-colors
                                        ${currentPage === totalPages 
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700' 
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    ถัดไป
                                </button>
                            </div>
                        </div>
                    )}
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