// projectform/EditJobModal.jsx

"use client";

import React, { useState } from 'react';

// ปรับปรุง FormSection ให้รองรับ Light/Dark mode
const FormSection = ({ title, children }) => (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            {title === 'Job Information' && <span className="mr-2">📁</span>}
            {title === 'Customer Information' && <span className="mr-2">👤</span>}
            {title === 'Location' && <span className="mr-2">📍</span>}
            {title === 'Notes' && <span className="mr-2">📄</span>}
            {title}
        </h3>
        {children}
    </div>
);

export default function EditJobModal({ job, onSave, onClose }) {
    // Initial state setup
    const [formData, setFormData] = useState({
        ...job,
        title: job.title, // Ensure title is correctly set
        jobDescription: 'Details about the job scope and requirements.',
        startDate: '2025-11-20',
        dueDate: '2025-12-30',
        customerName: job.customer,
        contactNumber: '081-XXX-XXXX',
        address: '123/4 Business Park',
        location: 'Bangkok, Thailand',
        notes: 'Initial meeting completed. Awaiting client confirmation for phase 2.'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const updatedJob = {
            id: formData.id,
            title: formData.title,
            customer: formData.customerName,
            lead: formData.lead,
            date: formData.date,
            status: formData.status
        };
        onSave(updatedJob);
    };

    // สร้างตัวแปร Class สำหรับ Input เพื่อความสะอาดของโค้ดและรองรับ Theme
    const inputClass = "w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-400 transition-colors";

    return (
        // ใช้ style inline เพื่อบังคับ Overlay ให้เป็นสีดำโปร่งใสเสมอ (ไม้ตายแก้จอดำ)
        <div 
            className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 transition-all"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
            {/* ตัว Modal Card: รองรับ Light/Dark Mode */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Edit Job: {job.id} - {job.title}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg font-bold p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 overflow-y-auto">
                    
                    {/* Job Information */}
                    <FormSection title="Job Information">
                        <div className="mb-4">
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Job Title"
                            />
                        </div>
                        <div className="mb-4">
                            <textarea
                                name="jobDescription"
                                value={formData.jobDescription}
                                onChange={handleChange}
                                className={`${inputClass} resize-none`}
                                placeholder="Job Description"
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Start Date (mm/dd/yyyy)"
                            />
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Due Date (mm/dd/yyyy)"
                            />
                        </div>
                    </FormSection>

                    {/* Customer Information */}
                    <FormSection title="Customer Information">
                        <div className="mb-4">
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Customer Name"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Contact Number"
                            />
                        </div>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`${inputClass} resize-none`}
                            placeholder="Address"
                            rows="2"
                        ></textarea>
                    </FormSection>

                    {/* Location */}
                    <FormSection title="Location">
                         <textarea
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className={`${inputClass} resize-none`}
                            placeholder="Enter location..."
                            rows="2"
                        ></textarea>
                    </FormSection>

                    {/* Notes */}
                    <FormSection title="Notes">
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className={`${inputClass} resize-none`}
                            placeholder="Enter notes..."
                            rows="3"
                        ></textarea>
                    </FormSection>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between border-t border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={onClose} 
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <div className="space-x-4">
                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
                            Delete
                        </button>
                        <button 
                            onClick={handleSave} 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* คลิกพื้นหลังเพื่อปิด */}
            <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
}