"use client";

import React, { useState, useRef } from "react";
import { X, UploadCloud, Trash2, Paperclip, } from "lucide-react"; // (เราจะใช้ UploadCloud สำหรับกล่องอัปโหลด)

export default function ReportModal({ onClose, onSubmit }) {
  // 5 ตัวเลือกสำหรับ Dropdown
  const issueOptions = [
    "สถานที่การทำงาน",
    "เกี่ยวกับบุคคลากร",
    "ทางเทคนิคและระบบ",
    "เกี่ยวกับอุปกรณ์",
    "อื่นๆ",
  ];

  // State สำหรับเก็บข้อมูลในฟอร์มนี้
  const [issueType, setIssueType] = useState("");
  const [details, setDetails] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // 👈 State สำหรับจำไฟล์
  const inputRef = useRef(null); // 👈 Ref สำหรับ input ที่ซ่อนอยู่

// --- ✨ 3. เพิ่มฟังก์ชันสำหรับจัดการไฟล์ ---
  // ฟังก์ชันสำหรับคลิกกล่อง
  const handleBoxClick = () => {
    inputRef.current.click(); // สั่งให้ input ที่ซ่อนอยู่ทำงาน
  };

  // ฟังก์ชันเมื่อเลือกไฟล์แล้ว
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // ฟังก์ชันสำหรับลบไฟล์ที่เลือก
  const handleRemoveFile = (e) => {
    e.stopPropagation(); // ป้องกันไม่ให้ 'handleBoxClick' ทำงาน
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // เคลียร์ค่าใน input
    }
  };
  // ------------------------------------


  // Function เมื่อกด Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!issueType || !details) {
      alert("กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วน");
      return;
    }

    // ส่งข้อมูลกลับไปที่ page.jsx
    onSubmit({
      type: issueType,
      description: details,
      file: selectedFile, // 👈 เพิ่มไฟล์เข้าไปในข้อมูล
    });
  };

  return (
    // Backdrop
    <div
      className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-lg"
      onClick={onClose}
    >
      {/* Modal Content (ใช้ style จาก report.png) */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-[402px] p-6 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-xl font-bold text-gray-800">Submit a Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">อยากแจ้งอะไรแจ้งเลย</p>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ปัญหาเกี่ยวกับ (Dropdown) */}
          <div>
            <label
              htmlFor="issueType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ปัญหาเกี่ยวกับ <span className="text-red-500">*</span>
            </label>
            <select
              id="issueType"
              name="issueType"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2857F2]"
              required
            >
              <option value="" disabled>
                -
              </option>
              {issueOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* รายละเอียด */}
          <div>
            <label
              htmlFor="details"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              รายละเอียด <span className="text-red-500">*</span>
            </label>
            <textarea
              id="details"
              name="details"
              rows="5" // (เพิ่ม rows ให้นิดหน่อย)
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2857F2]"
              placeholder="Please provide a detailed description of your issue."
              required
            ></textarea>
          </div>

          {/* แนบภาพประกอบ */}
          <div>
            <label
              htmlFor="fileUpload"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              แนบภาพประกอบ (ถ้ามี)
            </label>

            <div
              onClick={handleBoxClick} // 👈 เพิ่ม onClick
              className="w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400"
            >
              <UploadCloud className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                ต้องการแนบภาพหรือไฟล์อื่นๆ คลิกที่นี่เพื่ออัปโหลด
              </p>
              <input
                id="fileUpload"
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf" // (จำกัดประเภทไฟล์ได้ตามต้องการ)
              />
            </div>
          </div>

          {/* Footer Button (ปุ่ม Submit สีแดง) */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg text-sm font-bold text-white shadow-md hover:shadow-lg transition-all bg-blue-500 hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
