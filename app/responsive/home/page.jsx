"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  User,
  Menu,
  X,
  Briefcase,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ChevronRight,
  Home,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- START: NewTaskModal (แก้ไข) ---
function NewTaskModal({ onClose, onSubmit }) {
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

  // 👇 --- ✨ 1. เพิ่มฟังก์ชันนี้เข้าไปครับ! ---
  // (ฟังก์ชันเมื่อกด "รับงาน")
  const handleAccept = (taskToAccept) => {
    // 1.1: ส่ง Task ที่เลือกกลับไปที่ EmployeeDashboard
    onSubmit(taskToAccept);

    // 1.2: ลบงานที่รับแล้ว ออกจากรายการใน Modal นี้
    setAssignedTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskToAccept.id)
    );
  };
  // 👆 --- สิ้นสุดฟังก์ชันที่เพิ่ม ---
  return (
    // Backdrop (พื้นหลังสีเทา)
    <div
      className="absolute inset-0 z-50 flex items-center justify-cente bg-opacity-50 backdrop-blur-xs"
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

                  {/* 2. ปุ่ม "รับงาน" (ตอนนี้จะเรียก 'handleAccept' ที่เราเพิ่งสร้าง) */}
                  <button
                    onClick={() => handleAccept(task)} // ✨ จุดนี้จะหาย Error
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

// 👇 ✨ เพิ่ม Component ใหม่ตรงนี้
// --- START: WorkDetailModal ---
function WorkDetailModal({
  work,
  onClose,
  getStatusColor,
  getStatusText,
  getPriorityColor,
}) {
  return (
    // Backdrop
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-xs"
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

// ... (โค้ด EmployeeDashboard ที่เหลือ)

export default function EmployeeDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("work");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const router = useRouter(); // 4. เรียกใช้งาน useRouter (ย้ายมาไว้รวมกันด้านบน)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllWorks, setShowAllWorks] = useState(false);
  const scrollContainerRef = useRef(null);
  const [selectedWork, setSelectedWork] = useState(null);

  

  // 👈 (4) เปลี่ยน 'works' เป็น 'useState'
  const [works, setWorks] = useState([
    {
      id: 1,
      title: "ติดตั้งระบบไฟฟ้า A-101",
      status: "in-progress",
      priority: "high",
      dueDate: "16 Nov. 2025",
      location: "Bulding A Floor 1",
    },
    {
      id: 2,
      title: "ตรวจสอบเครื่องจักร Line 3",
      status: "pending",
      priority: "medium",
      dueDate: "17 Nov. 2025",
      location: "Factory 3",
    },
    {
      id: 3,
      title: "บำรุงรักษาประจำเดือน",
      status: "pending",
      priority: "low",
      dueDate: "20 Nov. 2025",
      location: "All location",
    },
  ]);

const stats = [
    {
      icon: Briefcase,
      label: "Today Works",
      value: works.length.toString(), // 👈 ✨ เปลี่ยน "5" เป็น works.length
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Clock,
      label: "Working hr.",
      value: "6.5",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: CheckCircle,
      label: "Complete task",
      value: "12",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const reports = [
    {
      id: 1,
      title: "รายงานปัญหาเครื่องจักร #234",
      date: "15 Nov. 2025",
      status: "pending",
    },
    {
      id: 2,
      title: "รายงานงานเสร็จ - A101",
      date: "14 Nov. 2025",
      status: "approved",
    },
    {
      id: 3,
      title: "รายงานการใช้วัสดุ",
      date: "13 Nov. 2025",
      status: "approved",
    },
  ];

  const calendarEvents = [
    { id: 1, title: "ประชุมทีม Safety", time: "09:00", date: "17 พ.ย." },
    { id: 2, title: "Training: New Equipment", time: "08:00", date: "18 พ.ย." },
    { id: 3, title: "Maintenance Schedule", time: "10:00", date: "20 พ.ย." },
  ];

  const notifications = [
    {
      id: 1,
      title: "งานใหม่: ติดตั้งระบบไฟฟ้า A-101",
      message: "คุณได้รับมอบหมายงานใหม่",
      time: "10 min. ago",
      type: "work",
      unread: true,
    },
    {
      id: 2,
      title: "รายงานได้รับการอนุมัติ",
      message: "รายงานงานเสร็จ - A101 ได้รับการอนุมัติแล้ว",
      time: "1 hr. ago",
      type: "report",
      unread: true,
    },
    {
      id: 3,
      title: "การแจ้งเตือนงาน",
      message: "งานตรวจสอบเครื่องจักร Line 3 ใกล้ถึงกำหนดส่ง",
      time: "2 hr. agoว",
      type: "work",
      unread: true,
    },
    {
      id: 4,
      title: "ประชุมทีม Safety",
      message: "มีการประชุมทีม Safety ในวันพรุ่งนี้ เวลา 09:00",
      time: "3 hr. ago",
      type: "calendar",
      unread: false,
    },
    {
      id: 5,
      title: "รายงานการใช้วัสดุ",
      message: "รายงานการใช้วัสดุได้รับการอนุมัติแล้ว",
      time: "1 day ago",
      type: "report",
      unread: false,
    },
  ];

  // Close notification popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationOpen]);

  const menuItems = [
    { icon: Home, label: "Home", badge: null },
    { icon: Briefcase, label: "Works", badge: "5" },
    { icon: FileText, label: "Report", badge: null },
    { icon: Calendar, label: "Calendar", badge: "3" },
    { icon: Settings, label: "Setting", badge: null },
    { icon: LogOut, label: "Logout", badge: null },
  ];

  // 5. สร้างฟังก์ชันสำหรับจัดการการคลิก
  // เปลี่ยนเป็น
  const handleMenuClick = (label) => {
    if (label === "Logout") {
      console.log("Logging out...");
      router.push("/responsive/login");
    }
    // (คุณอาจจะอยากเพิ่มการสลับ Tab ที่นี่ด้วย)
    if (label === "Works") setSelectedTab("work");
    if (label === "Report") setSelectedTab("report");
    if (label === "Calendar") setSelectedTab("calendar");
    setMenuOpen(false); // ปิดเมนูเมื่อคลิก
  };

  // 👈 (5) เพิ่มฟังก์ชันสำหรับรับข้อมูลจาก Modal มาสร้าง Task
  // 👈 (5) วางทับฟังก์ชันเดิม (บรรทัด 301-326)

  const handleCreateTask = (acceptedTask) => {
    // acceptedTask คือ object ที่ส่งมาจาก NewTaskModal
    // (เช่น { id: 101, title: "ซ่อมบำรุงด่วน...", dueDate: "18 Nov. 2025", ... })

    const newWork = {
      id: acceptedTask.id,
      title: acceptedTask.title,
      status: "in-progress", // ✨ 1. นี่คือจุดที่เพิ่ม Status ให้ครับ
      priority: acceptedTask.priority,
      dueDate: acceptedTask.dueDate, // ✨ 2. นี่คือจุดที่แก้ Invalid Date (ใช้ค่าที่ส่งมาตรงๆ)
      location: acceptedTask.location || "N/A",
    };

    // เพิ่ม Task ใหม่เข้าไปด้านบนสุดของ "Your Works"
    setWorks([newWork, ...works]);

    // (เราจะไม่ปิด Modal ที่นี่ ให้ผู้ใช้กดยอมรับงานอื่นต่อได้)
  };

  const getStatusColor = (status) => {
    const colors = {
      "in-progress": "bg-blue-100 text-blue-700",
      pending: "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
      approved: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusText = (status) => {
    const texts = {
      "in-progress": "In-progres",
      pending: "Pending",
      completed: "Complete",
      approved: "Approved",
    };
    return texts[status] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-600",
      medium: "text-orange-600",
      low: "text-gray-600",
    };
    return colors[priority] || "text-gray-600";
  };

  // 👈 ✨ 2. เพิ่มฟังก์ชันนี้เข้าไป (ก่อน return)
  const handleScroll = () => {
    // 1. ตรวจสอบว่าเรากำลังแสดง "All Works" และ ref พร้อมใช้งาน
    if (!showAllWorks || !scrollContainerRef.current) {
      return;
    }

    const container = scrollContainerRef.current;

    // 2. คำนวณว่า scroll ถึงด้านล่างสุดหรือยัง
    // (ความสูงเนื้อหาทั้งหมด - ตำแหน่ง scroll - ความสูงกรอบ) < 1 คือถึงล่างสุด
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 1;

    // 3. ถ้า scroll ถึงล่างสุด
    if (isAtBottom) {
      setShowAllWorks(false); // 👈 สั่งให้กลับไปแสดง 3 รายการ
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
      <div className="w-[402px] h-[1080px] bg-gray-50 relative overflow-hidden flex flex-col shadow-2xl">
        {/* Navbar */}
        <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
            <span className="font-bold text-lg" style={{ color: "#2857F2" }}>
              Tech Job
            </span>
          </div>

          {/* Notification */}
          <div
            className="flex items-center gap-2 relative"
            ref={notificationRef}
          >
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notification Popup */}
            {notificationOpen && (
              <div className="absolute top-full right-0 mt-2 w-[360px] bg-white rounded-2xl shadow-2xl z-50 border border-gray-200 max-h-[500px] flex flex-col overflow-hidden">
                {/* Header */}
                <div
                  className="p-4 border-b flex items-center justify-between rounded-t-2xl"
                  style={{ backgroundColor: "#2857F2" }}
                >
                  <h3 className="font-bold text-white">Notification</h3>
                  <button
                    onClick={() => setNotificationOpen(false)}
                    className="p-1 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>ไม่มีการแจ้งเตือน</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                            notification.unread ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                notification.type === "work"
                                  ? "bg-blue-100"
                                  : notification.type === "report"
                                  ? "bg-green-100"
                                  : "bg-purple-100"
                              }`}
                            >
                              {notification.type === "work" ? (
                                <Briefcase
                                  className={`w-5 h-5 ${
                                    notification.type === "work"
                                      ? "text-blue-600"
                                      : ""
                                  }`}
                                />
                              ) : notification.type === "report" ? (
                                <FileText className="w-5 h-5 text-green-600" />
                              ) : (
                                <Calendar className="w-5 h-5 text-purple-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  className={`font-semibold text-sm text-gray-800 ${
                                    notification.unread ? "font-bold" : ""
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                {notification.unread && (
                                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}





                    </div>
                  )}
                </div>



                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t ">
                    <button
                      className="w-full py-2 text-sm font-medium text-[#2857F2] hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setNotificationOpen(false)}
                    >
                      See All
                    </button>
                  </div>
                )}
              </div>
            )}



            <button className="p-1 hover:bg-gray-100 rounded-lg">
              <img
                src="https://i.pinimg.com/736x/50/f3/9f/50f39feefd36f890e9a9754dcc09610a.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </button>
          </div>
        </div>

        {/* Hamburger Menu Overlay */}
        {menuOpen && (
          <div
            className="absolute inset-0 z-30 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Hamburger Menu */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 z-40 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b" style={{ backgroundColor: "#2857F2" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pinimg.com/736x/50/f3/9f/50f39feefd36f890e9a9754dcc09610a.jpg"
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-white">Employee</p>
                  <p className="text-xs text-blue-100">employee@techjob.com</p>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <nav className="p-4">
            {/* ✨ 1. แก้ไข: ย้าย onClick มาที่ button นอก และลบ button ใน */}
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item.label)} // ✨ ย้าย onClick มาไว้ที่นี่
                className="w-full flex items-center justify-between px-4 py-3 mb-2 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                {/* <button onClick={() => handleMenuClick(item.label)}> <-- ✨ ลบ button ที่ซ้อนกันออก */}
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-600 group-hover:text-[#2857F2]" />
                  <span className="text-gray-700 group-hover:text-[#2857F2] font-medium">
                    {item.label}
                  </span>
                </div>
                {/* </button> <-- ✨ ลบ button ที่ซ้อนกันออก */}
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-20">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-3 shadow-sm">
                <div
                  className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-4 bg-white rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setSelectedTab("work")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                selectedTab === "work"
                  ? "bg-[#2857F2] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Works
            </button>
            <button
              onClick={() => setSelectedTab("report")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                selectedTab === "report"
                  ? "bg-[#2857F2] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Reports
            </button>
            <button
              onClick={() => setSelectedTab("calendar")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                selectedTab === "calendar"
                  ? "bg-[#2857F2] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Calendar
            </button>
          </div>

          {/* Work Tab */}
          {selectedTab === "work" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800">Your Works</h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white shadow-md hover:shadow-lg transition-all"
                  style={{ backgroundColor: "#2857F2" }}
                >
                  <Plus className="w-4 h-4" />
                  New Task
                </button>
              </div>

              {/* ✨ 1. แก้ไข .map() ให้ใช้ slice(0, 3) ถ้า 'showAllWorks' เป็น false */}
              {(showAllWorks ? works : works.slice(0, 3)).map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => setSelectedWork(work)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {work.title}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {work.dueDate} • {work.location}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        work.status
                      )}`}
                    >
                      {getStatusText(work.status)}
                    </span>
                    <span
                      className={`text-xs font-medium ${getPriorityColor(
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
              ))}

              {/* --- ✨ 2. แก้ไขตรรกะปุ่มตรงนี้ --- */}

              {/* A. แสดงปุ่ม "All Works" 
                   เมื่อ (ยังไม่ได้กด 'showAll') และ (มีงานมากกว่า 3) */}
              {!showAllWorks && works.length > 3 && (
                <button
                  onClick={() => setShowAllWorks(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#2857F2] hover:text-[#2857F2] transition-colors"
                >
                  All Works →
                </button>
              )}

              {/* B. แสดงปุ่ม "Show Less" 
                   เมื่อ (กด 'showAll' ไปแล้ว) และ (มีงานมากกว่า 3) */}
              {showAllWorks && works.length > 3 && (
                <button
                  onClick={() => setShowAllWorks(false)} // 👈 กดแล้วหุบ
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  ↑ Show Less
                </button>
              )}
            </div>
          )}

          {/* ✨ 2. แก้ไข: เพิ่มการเรียกแสดง Modal ตรงนี้ */}
          {isModalOpen && (
            <NewTaskModal
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleCreateTask}
            />
          )}

          {selectedWork && (
            <WorkDetailModal
              work={selectedWork}
              onClose={() => setSelectedWork(null)}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getPriorityColor={getPriorityColor}
            />
          )}










          {/* Report Tab */}
          {selectedTab === "report" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800">Your reports</h2>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white shadow-md hover:shadow-lg transition-all"
                  style={{ backgroundColor: "#2857F2" }}
                >
                  <Plus className="w-4 h-4" />
                  Report ticket
                </button>
              </div>
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {report.title}
                      </h3>
                      <p className="text-xs text-gray-500">{report.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {getStatusText(report.status)}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#2857F2] hover:text-[#2857F2] transition-colors">
                All Reports →
              </button>
            </div>
          )}

          {/* Calendar Tab */}
          {selectedTab === "calendar" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800">Up coming Events</h2>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <div className="text-center py-2 border-b">
                  <p className="text-sm text-gray-500">November 2025</p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "#2857F2" }}
                  >
                    16
                  </p>
                  <p className="text-sm text-gray-600">Sunday</p>
                </div>
              </div>
              {calendarEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex flex-col items-center justify-center">
                      <p className="text-xs text-gray-500">{event.date}</p>
                      <Clock className="w-4 h-4 text-[#2857F2]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {event.time} am.
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#2857F2] hover:text-[#2857F2] transition-colors">
                Calendar →
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="font-bold text-gray-800 mb-3">Quick Action</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Check in
                </span>
              </button>
              <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Reports
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
