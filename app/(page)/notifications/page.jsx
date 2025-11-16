"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
// import { SiteHeader } from "@/components/site-header"; // <-- Removed this problematic import
import {
  Eye,
  Pencil,
  Bell,
  MessageSquare,
  UserPlus,
  CheckCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";

// Mock data for notifications
const initialNotifications = [
  {
    id: 1,
    type: "mention",
    user: "Thastanon",
    content: "mentioned you in a comment on 'Project Alpha'",
    time: "15m ago",
    read: false,
  },
  {
    id: 2,
    type: "assign",
    user: "Manager",
    content: "assigned you to a new job 'JB-10023: Site Survey'",
    time: "1h ago",
    read: false,
  },
  {
    id: 3,
    type: "system",
    content: "Job 'JB-10021' has been marked as 'Completed'",
    time: "3h ago",
    read: true,
  },
  {
    id: 4,
    type: "mention",
    user: "Somsak",
    content: "replied to your comment on 'Safety Report'",
    time: "Yesterday",
    read: true,
  },
  {
    id: 5,
    type: "assign",
    user: "Manager",
    content: "assigned you to 'JB-10024: Equipment Install'",
    time: "2 days ago",
    read: false,
  },
];

export default function Page() {
  // --- State and Logic from your Jobs code ---
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showCreateModal, setShowCreateModal] = useState(false);

  // โหลดข้อมูลจาก jobs.json
  useEffect(() => {
    fetch("/data/jobs.json")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Failed to load jobs:", err));
  }, []);

  // ฟังก์ชันกรองข้อมูล
  const normalize = (s) =>
    String(s ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.id.toLowerCase().includes(search.toLowerCase()) ||
        job.customer.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        role === "" ||
        (role === "manager" && job.lead === "Thastanon") ||
        (role === "technician" && job.lead !== "Thastanon");

      const matchesStatus =
        status === "" || normalize(job.status) === normalize(status);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [jobs, search, role, status]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Normalize status and return consistent badge color classes
  const getStatusColor = (status) => {
    const s = String(status ?? "").trim().toLowerCase().replace(/\s+/g, "");
    switch (s) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "inprogress":
        return "bg-yellow-100 text-yellow-700";
      case "pending":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // --- State and Logic from my Notifications UI ---
  const [notifications, setNotifications] = useState(initialNotifications);

  // Function to get the correct icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "mention":
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case "assign":
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case "system":
        return <Bell className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  // Mark a single notification as read
  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Mark all unread notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Get count of unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Helper component to render a single notification item
  const NotificationItem = ({ notification }) => (
    <div
      className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted ${
        !notification.read 
          ? "bg-blue-50 dark:bg-blue-950/30" 
          : "bg-card"
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-grow">
        <p className="text-sm text-foreground">
          {notification.user && (
            <span className="font-semibold">{notification.user}</span>
          )}{" "}
          {notification.content}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {notification.time}
        </p>
      </div>

      {/* Unread indicator / Action */}
      <div className="flex-shrink-0">
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            onClick={() => handleMarkAsRead(notification.id)}
          >
            Mark as read
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <main className="bg-background">
      {/* <SiteHeader title="์Notifications" /> */} {/* <-- Replaced this */}
      {/* Placeholder Header */}
      <SiteHeader title="Notifications" />
      <section className="p-6 space-y-4">


        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">All Notifications</p>
          </div>
        </div>

        {/* --- Start of Notifications UI (Inserted here) --- */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Unread
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <TabsContent value="all" className="m-0">
                <div className="divide-y">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <NotificationItem key={n.id} notification={n} />
                    ))
                  ) : (
                    <p className="p-6 text-center text-muted-foreground">
                      No notifications yet.
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="unread" className="m-0">
                <div className="divide-y">
                  {notifications.filter((n) => !n.read).length > 0 ? (
                    notifications
                      .filter((n) => !n.read)
                      .map((n) => (
                        <NotificationItem key={n.id} notification={n} />
                      ))
                  ) : (
                    <p className="p-6 text-center text-muted-foreground">
                      You're all caught up!
                    </p>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
        {/* --- End of Notifications UI --- */}
      </section>

      {/* This modal is part of your original Jobs code */}
      {showCreateModal && (
        <CreateJobModal onClose={() => setShowCreateModal(false)} />
      )}
    </main>
  );
}