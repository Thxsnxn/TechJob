"use client";

import React, { useState } from "react";
import { X, Calendar } from "lucide-react"; // 👈 Import icons ที่ไฟล์นี้ต้องใช้

// --- START: NewTaskModal ---
export default function NewTaskModal({ onClose, onSubmit }) {
  // "กล่องสมมติ" (Dummy Data)
  const [assignedTasks, setAssignedTasks] = useState([
    {
      id: 101,
      title: "ซ่อมบำรุงด่วน Line 1",
      priority: "high",
      dueDate: "18 Nov. 2025",
      location: "Factory 1",
    },
    {
      id: 102,
      title: "อบรมการใช้งานเครื่องจักรใหม่",
      priority: "medium",
      dueDate: "19 Nov. 2025",
      location: "Training Room",
    },
    {
      id: 103,
      title: "เคลียร์สต็อกอะไหล่",
      priority: "low",
      dueDate: "20 Nov. 2025",
      location: "Warehouse B",
    },
  ]);

  // (ฟังก์ชันเมื่อกด "รับงาน")
  const handleAccept = (taskToAccept) => {
    // 1.1: ส่ง Task ที่เลือกกลับไปที่ EmployeeDashboard (page.jsx)
    onSubmit(taskToAccept);

    // 1.2: ลบงานที่รับแล้ว ออกจากรายการใน Modal นี้
    setAssignedTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskToAccept.id)
    );
  };

  return (
    // Backdrop
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Content (กล่องสีขาว) */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-[402px] p-6 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            งานที่ได้รับมอบหมาย
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* รายการงาน */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {assignedTasks.length > 0 ? (
            assignedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  {/* ส่วนแสดงข้อมูล */}
                  <div className="flex-1 mr-4">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {task.title}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <Calendar className="w-3 h-3" />
                      {task.dueDate} • {task.location}
                    </p>
                    <span
                      className={`text-xs font-medium ${
                        task.priority === "high"
                          ? "text-red-600"
                          : task.priority === "medium"
                          ? "text-orange-600"
                          : "text-gray-600"
                      }`}
                    >
                      {task.priority === "high"
                        ? "🔴 Important"
                        : task.priority === "medium"
                        ? "🟡 Moderate"
                        : "🟢 General"}
                    </span>
                  </div>

                  {/* ปุ่ม "รับงาน" */}
                  <button
                    onClick={() => handleAccept(task)}
                    className="flex-shrink-0 px-3 py-2 bg-[#2857F2] text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    รับงาน
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              ไม่มีงานที่มอบหมายในขณะนี้
            </p>
          )}
        </div>

        {/* Footer (ปุ่มปิด) */}
        <div className="flex justify-end pt-4 mt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
// --- END: NewTaskModal ---