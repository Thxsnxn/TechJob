"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  Home,
  Calendar,
  User,
  Settings,
  Menu,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Briefcase,
  Compass,
  Signal,
  Battery,
} from "lucide-react";

export default function ResponsivePage() {
  const [activeTab, setActiveTab] = useState("home");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Mobile Device Frame */}
      <div className="relative">
        {/* Phone Frame */}
        <div
          className="bg-white rounded-[2.5rem] p-2 shadow-2xl"
          style={{
            width: "402px",
            height: "874px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          {/* Status Bar */}
          <div className="bg-white rounded-t-[2rem] px-4 pt-3 pb-2 flex items-center justify-between text-xs font-semibold relative border-b border-red-200">
            {/* Time - Left */}
            <span className="text-black font-semibold">{formatTime(currentTime)}</span>
            
            {/* Dynamic Island - Center */}
            {/* <div className="absolute left-1/2 transform -translate-x-1/2 top-2">
              <div className="bg-black rounded-full px-6 py-2.5 flex items-center justify-center min-w-[126px] h-[30px]">
              </div> */}
            {/* </div> */}

            {/* Right side - Signal & Battery */}
            <div className="flex items-center gap-2">
              {/* Signal Strength */}
              <div className="flex items-end gap-0.5">
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1.5 bg-black rounded-full"></div>
                <div className="w-1 h-2 bg-black rounded-full"></div>
                <div className="w-1 h-2.5 bg-black rounded-full"></div>
              </div>
              
              {/* Battery */}
              <div className="flex items-center gap-0.5">
                <div className="w-6 h-3 border border-black rounded-sm relative">
                  <div className="absolute left-0.5 top-0.5 w-4 h-2 bg-black rounded-sm"></div>
                </div>
                <div className="w-0.5 h-1.5 bg-black rounded-r-sm"></div>
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div
            className="bg-white rounded-b-[2rem] overflow-hidden flex flex-col"
            style={{ height: "calc(100% - 60px)" }}
          >
            {/* Header */}
            <div className="text-white px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: "#2857F2" }}>
              <div className="flex items-center gap-3">
                <Menu className="w-6 h-6" />
                <h1 className="text-lg font-bold">Tech Job</h1>
              </div>
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6" />
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarFallback className="bg-white text-red-600 font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="px-4 py-6 space-y-4 overflow-y-auto flex-1">
              {/* Dashboard Cards */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="text-white border-0" style={{ background: `linear-gradient(to bottom right, #2857F2, #1a42c4)` }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Briefcase className="w-5 h-5 opacity-80" />
                      <Badge className="bg-white/20 text-white">12</Badge>
                    </div>
                    <p className="text-xs opacity-90">Active Jobs</p>
                    <p className="text-2xl font-bold mt-1">8</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle2 className="w-5 h-5 opacity-80" />
                      <Badge className="bg-white/20 text-white">24</Badge>
                    </div>
                    <p className="text-xs opacity-90">Completed</p>
                    <p className="text-2xl font-bold mt-1">16</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <h2 className="text-lg font-semibold">Quick Actions</h2>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Job
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    OT Request
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Schedule
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Jobs */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recent Jobs</h2>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      id: "JB-10023",
                      title: "Site Survey",
                      status: "In Progress",
                      time: "2h ago",
                    },
                    {
                      id: "JB-10021",
                      title: "Equipment Install",
                      status: "Completed",
                      time: "1d ago",
                    },
                    {
                      id: "JB-10020",
                      title: "Maintenance Check",
                      status: "Pending",
                      time: "2d ago",
                    },
                  ].map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{job.id}</span>
                          <Badge
                            className={`text-xs ${
                              job.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : job.status === "In Progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{job.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{job.time}</p>
                      </div>
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Notifications Preview */}
              <Card style={{ backgroundColor: "#E8EDFF", borderColor: "#B8C9FF" }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#2857F2" }}>
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">3 New Notifications</p>
                        <p className="text-xs text-gray-600">You have unread messages</p>
                      </div>
                    </div>
                    <Badge className="bg-red-500 text-white">3</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Navigation */}
            <div className="border-t bg-white px-4 py-2 flex-shrink-0">
              <div className="flex items-center justify-around">
                {[
                  { icon: Home, label: "Home", id: "home" },
                  { icon: Calendar, label: "Schedule", id: "schedule" },
                  { icon: Plus, label: "Add", id: "add" },
                  { icon: Users, label: "Team", id: "team" },
                  { icon: User, label: "Profile", id: "profile" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                    style={activeTab === item.id ? { color: "#2857F2", backgroundColor: "#E8EDFF" } : {}}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
