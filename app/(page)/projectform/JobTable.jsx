// JobTable.jsx
import React from 'react';
import { Eye, Pencil } from 'lucide-react'; // หรือ import icon ที่คุณใช้อยู่

export default function JobTable({ jobs, onView, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* ส่วนหัวตาราง: สีเทาอ่อนใน Light Mode / สีเทาเข้มใน Dark Mode */}
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {['JOB ID', 'JOB TITLE', 'CUSTOMER', 'LEAD', 'DATE', 'STATUS', 'ACTIONS'].map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* ส่วนเนื้อหาตาราง: สีขาวใน Light Mode / สีดำใน Dark Mode */}
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {job.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {job.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {job.customer}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {job.lead}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {job.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* Badge สถานะ: ปรับสีให้อ่านง่ายทั้งสองโหมด */}
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${job.status === 'เสร็จสมบูรณ์'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : job.status === 'กำลังดำเนินการ'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                >
                  {job.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onView(job.id)}
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {/* ถ้าคุณใช้ icon library อื่น ให้เปลี่ยนตรงนี้ */}
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(job.id)}
                    className="text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  >
                    {/* ถ้าคุณใช้ icon library อื่น ให้เปลี่ยนตรงนี้ */}
                    <Pencil size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}