"use client";

import React from "react";
import { X, Calendar, MapPin } from "lucide-react"; // 👈 Import icons ที่ไฟล์นี้ต้องใช้

// --- START: WorkDetailModal ---
export default function WorkDetailModal({
  work,
  onClose,
  getStatusColor,
  getStatusText,
  getPriorityColor,
}) {
  return (
    // Backdrop
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-[402px] p-6 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">{work.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (แสดงรายละเอียด) */}
        <div className="space-y-4">
          {/* Status and Priority */}
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Status
              </label>
              <span
                className={`text-sm px-3 py-1 rounded-full ${getStatusColor(
                  work.status
                )}`}
              >
                {getStatusText(work.status)}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Priority
              </label>
              <span
                className={`text-sm font-medium ${getPriorityColor(
                  work.priority
                )}`}
              >
                {work.priority === "high"
                  ? "🔴 Important"
                  : work.priority === "medium"
                  ? "🟡 Moderate"
                  : "🟢 General"}
              </span>
            </div>
          </div>

          {/* Date and Location (เส้นคั่น) */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{work.dueDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{work.location}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: "#2857F2" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
// --- END: WorkDetailModal ---