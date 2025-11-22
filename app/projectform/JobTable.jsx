// projectform/JobTable.jsx

import React from 'react';

const StatusBadge = ({ status }) => {
    let colorClass = '';
    switch (status) {
        case 'Completed':
            colorClass = 'bg-green-700 text-green-100';
            break;
        case 'In Progress':
            colorClass = 'bg-yellow-600 text-yellow-100';
            break;
        case 'Pending':
            colorClass = 'bg-red-700 text-red-100';
            break;
        default:
            colorClass = 'bg-gray-600 text-white';
    }
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
            {status}
        </span>
    );
};

export default function JobTable({ jobs, onView, onEdit }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                    <tr>
                        {['Job ID', 'Job Title', 'Customer', 'Lead', 'Date', 'Status', 'Actions'].map(header => (
                            <th
                                key={header}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-700 transition duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{job.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{job.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{job.customer}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{job.lead}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{job.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <StatusBadge status={job.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {/* ปุ่ม View (รูปตา) */}
                                <button
                                    onClick={() => onView(job.id)}
                                    className="text-gray-400 hover:text-blue-400 focus:outline-none mr-3"
                                    title="View Job"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                </button>
                                {/* ปุ่ม Edit (รูปดินสอ) */}
                                <button
                                    onClick={() => onEdit(job.id)}
                                    className="text-gray-400 hover:text-yellow-400 focus:outline-none"
                                    title="Edit Job"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}