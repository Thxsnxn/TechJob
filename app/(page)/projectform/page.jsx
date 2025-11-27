"use client";

import React, { useState } from 'react';
import JobTable from './JobTable';
import ViewJobModal from './ViewJobModal';
import EditJobModal from './EditJobModal';
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

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
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 flex flex-col">
            <SiteHeader />
            <div className="flex-1 p-4 md:p-6 space-y-6 mx-auto w-full">
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-lg">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">
                                Project Form
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                งานที่ได้รับมอบหมายจากลูกค้า
                            </p>
                        </div>
                    </div>
                </div>

                <Card className="border shadow-sm bg-white dark:bg-slate-900">
                    <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-800/50 pb-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">งานทั้งหมด</CardTitle>
                            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                                <div className="relative w-full md:w-[300px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                                    <Input
                                        placeholder="ค้นหารหัสงาน, หัวข้องาน หรือลูกค้า..."
                                        className="pl-9 bg-white dark:bg-slate-800"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <Select>
                                    <SelectTrigger className="w-full md:w-[150px] bg-white dark:bg-slate-800">
                                        <SelectValue placeholder="เลือกบทบาท" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">ทั้งหมด</SelectItem>
                                        <SelectItem value="lead">หัวหน้างาน</SelectItem>
                                        <SelectItem value="staff">พนักงาน</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select>
                                    <SelectTrigger className="w-full md:w-[150px] bg-white dark:bg-slate-800">
                                        <SelectValue placeholder="เลือกสถานะ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">ทั้งหมด</SelectItem>
                                        <SelectItem value="completed">เสร็จสมบูรณ์</SelectItem>
                                        <SelectItem value="in-progress">กำลังดำเนินการ</SelectItem>
                                        <SelectItem value="pending">รอดำเนินการ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <JobTable jobs={currentJobs} onView={handleView} onEdit={handleEdit} />

                        {/* Pagination */}
                        {filteredJobs.length > 0 && (
                            <div className="flex justify-between items-center px-6 py-4 border-t bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="text-sm text-slate-500">
                                    แสดง {indexOfFirstJob + 1} ถึง {Math.min(indexOfLastJob, filteredJobs.length)} จากทั้งหมด {filteredJobs.length} รายการ
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="h-8"
                                    >
                                        ก่อนหน้า
                                    </Button>

                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <Button
                                            key={index + 1}
                                            variant={currentPage === index + 1 ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => paginate(index + 1)}
                                            className={`h-8 w-8 p-0 ${currentPage === index + 1 ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                                        >
                                            {index + 1}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="h-8"
                                    >
                                        ถัดไป
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

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
        </div>
    );
}