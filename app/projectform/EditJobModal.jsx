// projectform/EditJobModal.jsx

"use client";

import React, { useState, useEffect } from 'react';

const FormSection = ({ title, children }) => (
    <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl text-white overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <h2 className="text-2xl font-bold p-4 border-b border-gray-700">Edit Job: {job.id} - {job.title}</h2>

                {/* Content */}
                <div className="p-6 space-y-4 overflow-y-auto">
                    
                    {/* Job Information */}
                    <FormSection title="Job Information">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Job Title"
                        />
                        <textarea
                            name="jobDescription"
                            value={formData.jobDescription}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Job Description"
                            rows="3"
                        ></textarea>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Start Date (mm/dd/yyyy)"
                            />
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Due Date (mm/dd/yyyy)"
                            />
                        </div>
                    </FormSection>

                    {/* Customer Information */}
                    <FormSection title="Customer Information">
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Customer Name"
                        />
                        <input
                            type="text"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contact Number"
                        />
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Enter notes..."
                            rows="3"
                        ></textarea>
                    </FormSection>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-800 flex justify-between border-t border-gray-700">
                    <button onClick={onClose} className="text-white hover:text-gray-400 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <div className="space-x-4">
                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Delete</button>
                        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}