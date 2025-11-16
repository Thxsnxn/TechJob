"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Menu, X, Briefcase, FileText, Calendar, Clock, CheckCircle, AlertCircle, Plus, ChevronRight, Home, Settings, LogOut } from 'lucide-react';

export default function EmployeeDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('work');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  const stats = [
    { icon: Briefcase, label: 'งานวันนี้', value: '5', color: 'bg-blue-50 text-blue-600' },
    { icon: Clock, label: 'ชั่วโมงทำงาน', value: '6.5', color: 'bg-green-50 text-green-600' },
    { icon: CheckCircle, label: 'งานเสร็จ', value: '12', color: 'bg-purple-50 text-purple-600' },
  ];

  const works = [
    { id: 1, title: 'ติดตั้งระบบไฟฟ้า A-101', status: 'in-progress', priority: 'high', dueDate: '16 พ.ย. 2025', location: 'อาคาร A ชั้น 1' },
    { id: 2, title: 'ตรวจสอบเครื่องจักร Line 3', status: 'pending', priority: 'medium', dueDate: '17 พ.ย. 2025', location: 'โรงงาน 3' },
    { id: 3, title: 'บำรุงรักษาประจำเดือน', status: 'pending', priority: 'low', dueDate: '20 พ.ย. 2025', location: 'ทุกพื้นที่' },
  ];

  const reports = [
    { id: 1, title: 'รายงานปัญหาเครื่องจักร #234', date: '15 พ.ย. 2025', status: 'pending' },
    { id: 2, title: 'รายงานงานเสร็จ - A101', date: '14 พ.ย. 2025', status: 'approved' },
    { id: 3, title: 'รายงานการใช้วัสดุ', date: '13 พ.ย. 2025', status: 'approved' },
  ];

  const calendarEvents = [
    { id: 1, title: 'ประชุมทีม Safety', time: '09:00', date: '17 พ.ย.' },
    { id: 2, title: 'Training: New Equipment', time: '14:00', date: '18 พ.ย.' },
    { id: 3, title: 'Maintenance Schedule', time: '10:00', date: '20 พ.ย.' },
  ];

  const notifications = [
    { id: 1, title: 'งานใหม่: ติดตั้งระบบไฟฟ้า A-101', message: 'คุณได้รับมอบหมายงานใหม่', time: '10 นาทีที่แล้ว', type: 'work', unread: true },
    { id: 2, title: 'รายงานได้รับการอนุมัติ', message: 'รายงานงานเสร็จ - A101 ได้รับการอนุมัติแล้ว', time: '1 ชั่วโมงที่แล้ว', type: 'report', unread: true },
    { id: 3, title: 'การแจ้งเตือนงาน', message: 'งานตรวจสอบเครื่องจักร Line 3 ใกล้ถึงกำหนดส่ง', time: '2 ชั่วโมงที่แล้ว', type: 'work', unread: true },
    { id: 4, title: 'ประชุมทีม Safety', message: 'มีการประชุมทีม Safety ในวันพรุ่งนี้ เวลา 09:00', time: '3 ชั่วโมงที่แล้ว', type: 'calendar', unread: false },
    { id: 5, title: 'รายงานการใช้วัสดุ', message: 'รายงานการใช้วัสดุได้รับการอนุมัติแล้ว', time: '1 วันที่แล้ว', type: 'report', unread: false },
  ];

  // Close notification popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  const menuItems = [
    { icon: Home, label: 'หน้าหลัก', badge: null },
    { icon: Briefcase, label: 'งานของฉัน', badge: '5' },
    { icon: FileText, label: 'รายงาน', badge: null },
    { icon: Calendar, label: 'ปฏิทิน', badge: '3' },
    { icon: Settings, label: 'ตั้งค่า', badge: null },
    { icon: LogOut, label: 'ออกจากระบบ', badge: null },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'in-progress': 'bg-blue-100 text-blue-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'completed': 'bg-green-100 text-green-700',
      'approved': 'bg-green-100 text-green-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (status) => {
    const texts = {
      'in-progress': 'กำลังดำเนินการ',
      'pending': 'รอดำเนินการ',
      'completed': 'เสร็จสิ้น',
      'approved': 'อนุมัติแล้ว'
    };
    return texts[status] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'text-red-600',
      'medium': 'text-orange-600',
      'low': 'text-gray-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center">
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
            <span className="font-bold text-lg" style={{ color: '#2857F2' }}>Tech Job</span>
          </div>

          {/* Notification */}
          <div className="flex items-center gap-2 relative" ref={notificationRef}>
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
                <div className="p-4 border-b flex items-center justify-between rounded-t-2xl" style={{ backgroundColor: '#2857F2' }}>
                  <h3 className="font-bold text-white">การแจ้งเตือน</h3>
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
                            notification.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              notification.type === 'work' ? 'bg-blue-100' :
                              notification.type === 'report' ? 'bg-green-100' :
                              'bg-purple-100'
                            }`}>
                              {notification.type === 'work' ? (
                                <Briefcase className={`w-5 h-5 ${
                                  notification.type === 'work' ? 'text-blue-600' : ''
                                }`} />
                              ) : notification.type === 'report' ? (
                                <FileText className="w-5 h-5 text-green-600" />
                              ) : (
                                <Calendar className="w-5 h-5 text-purple-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`font-semibold text-sm text-gray-800 ${
                                  notification.unread ? 'font-bold' : ''
                                }`}>
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
                  <div className="p-3 border-t">
                    <button 
                      className="w-full py-2 text-sm font-medium text-[#2857F2] hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setNotificationOpen(false)}
                    >
                      ดูทั้งหมด
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
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
          onClick={() => setMenuOpen(false)}
        />
        )}

        {/* Hamburger Menu */}
        <div 
  className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 z-40 ${
    menuOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
  onClick={(e) => e.stopPropagation()}
>
          <div className="p-4 border-b" style={{ backgroundColor: '#2857F2' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="https://i.pinimg.com/736x/50/f3/9f/50f39feefd36f890e9a9754dcc09610a.jpg" 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-white">พนักงาน</p>
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
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between px-4 py-3 mb-2 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-600 group-hover:text-[#2857F2]" />
                  <span className="text-gray-700 group-hover:text-[#2857F2] font-medium">
                    {item.label}
                  </span>
                </div>
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
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
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
              onClick={() => setSelectedTab('work')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                selectedTab === 'work' 
                  ? 'bg-[#2857F2] text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              งาน
            </button>
            <button
              onClick={() => setSelectedTab('report')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                selectedTab === 'report' 
                  ? 'bg-[#2857F2] text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              รายงาน
            </button>
            <button
              onClick={() => setSelectedTab('calendar')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                selectedTab === 'calendar' 
                  ? 'bg-[#2857F2] text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              ปฏิทิน
            </button>
          </div>

          {/* Work Tab */}
          {selectedTab === 'work' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800">งานของคุณ</h2>
                <button 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white shadow-md hover:shadow-lg transition-all"
                  style={{ backgroundColor: '#2857F2' }}
                >
                  <Plus className="w-4 h-4" />
                  รับงานใหม่
                </button>
              </div>
              {works.map((work) => (
                <div key={work.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{work.title}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {work.dueDate} • {work.location}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(work.status)}`}>
                      {getStatusText(work.status)}
                    </span>
                    <span className={`text-xs font-medium ${getPriorityColor(work.priority)}`}>
                      {work.priority === 'high' ? '🔴 สำคัญ' : work.priority === 'medium' ? '🟡 ปานกลาง' : '🟢 ทั่วไป'}
                    </span>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#2857F2] hover:text-[#2857F2] transition-colors">
                ดูงานทั้งหมด →
              </button>
            </div>
          )}

          {/* Report Tab */}
          {selectedTab === 'report' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800">รายงานของคุณ</h2>
                <button 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white shadow-md hover:shadow-lg transition-all"
                  style={{ backgroundColor: '#2857F2' }}
                >
                  <Plus className="w-4 h-4" />
                  สร้างรายงาน
                </button>
              </div>
              {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{report.title}</h3>
                      <p className="text-xs text-gray-500">{report.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#2857F2] hover:text-[#2857F2] transition-colors">
                ดูรายงานทั้งหมด →
              </button>
            </div>
          )}

          {/* Calendar Tab */}
          {selectedTab === 'calendar' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800">กิจกรรมที่กำลังจะมาถึง</h2>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <div className="text-center py-2 border-b">
                  <p className="text-sm text-gray-500">พฤศจิกายน 2025</p>
                  <p className="text-3xl font-bold" style={{ color: '#2857F2' }}>16</p>
                  <p className="text-sm text-gray-600">วันอาทิตย์</p>
                </div>
              </div>
              {calendarEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex flex-col items-center justify-center">
                      <p className="text-xs text-gray-500">{event.date}</p>
                      <Clock className="w-4 h-4 text-[#2857F2]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{event.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{event.time} น.</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#2857F2] hover:text-[#2857F2] transition-colors">
                ดูปฏิทินเต็ม →
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="font-bold text-gray-800 mb-3">เครื่องมือด่วน</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">เช็คอิน</span>
              </button>
              <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">รายงานปัญหา</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}