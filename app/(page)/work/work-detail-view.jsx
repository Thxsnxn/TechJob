import React, { useMemo } from "react"; // [เพิ่ม] import useMemo
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Info,
  Users,
  Package,
  Trash2,
  Loader2,
  History, // [เพิ่ม] import History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function WorkDetailView({
  work,
  onBack,
  onAddEquipment,
  onAddEmployee,
  onRemoveEmployee,
  onUpdateStatus,
  onRemoveAllEmployees,
  onRemoveAllSupervisors,
  loadingRequisitions = false,
}) {
  if (!work) return null;

  const hasEmployee =
    work.assignedStaff && work.assignedStaff.some((s) => s.role === "EMPLOYEE");

  // --- [LOGIC จัดกลุ่มรายการเบิก] แก้ไขส่วนนี้ ---
  const requisitionGroups = useMemo(() => {
    if (!work.requisitions || work.requisitions.length === 0) return [];

    // 1. แยกกอง (Group) โดยใช้ requisitionId หรือ createdAt
    const groups = work.requisitions.reduce((acc, req) => {
      // ใช้ ID ใบเบิกเป็นหลัก ถ้าไม่มีให้ใช้เวลา ถ้าไม่มีอีกให้กองรวมกันที่ Unknown
      // ตรงนี้ Frontend จัดการเอง ไม่ต้องแก้ API
      const key = req.requisitionId || req.createdAt || "Unknown";

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(req);
      return acc;
    }, {});

    // 2. แปลงเป็น Array และ รวมของซ้ำในแต่ละกอง (Merge Duplicates inside group)
    // เราใช้ Object.keys เพื่อดึงรายการกลุ่มออกมา
    const sortedGroups = Object.keys(groups).map((groupKey) => {
      const rawItems = groups[groupKey];

      // Logic รวมของซ้ำ: สร้าง Map เพื่อเช็คว่าในกองนี้มี Item ID นี้หรือยัง
      const mergedItemsMap = new Map();

      rawItems.forEach((item) => {
        const itemId = item.item?.id || item.itemId;
        if (!itemId) return;

        if (mergedItemsMap.has(itemId)) {
          // ถ้ามีแล้ว ให้บวกจำนวนเพิ่ม
          const existing = mergedItemsMap.get(itemId);
          existing.qtyRequest += item.qtyRequest || 0;
        } else {
          // ถ้ายังไม่มี ให้ Clone ข้อมูลมาใส่
          mergedItemsMap.set(itemId, { ...item });
        }
      });

      return {
        id: groupKey,
        // แปลง Map กลับเป็น Array เพื่อเอาไปแสดงผล
        items: Array.from(mergedItemsMap.values()),
      };
    });

    // (Optional) เรียงลำดับ ถ้า key เป็นเวลาหรือ ID ที่เรียงได้
    // ถ้าไม่เรียง มันจะขึ้นตามลำดับที่เจอใน array เดิม

    return sortedGroups;
  }, [work.requisitions]);

  // Helper functions (คงเดิม)
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "Reject":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-4 h-4 mr-1" />;
      case "In Progress":
        return <Clock className="w-4 h-4 mr-1" />;
      case "Pending":
        return <AlertCircle className="w-4 h-4 mr-1" />;
      case "Reject":
        return <XCircle className="w-4 h-4 mr-1" />;
      default:
        return <Info className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 flex-none">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 rounded-full border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {work.title}
            </h1>
            <Badge
              variant="outline"
              className={cn("px-3 py-1 border", getStatusColor(work.status))}
            >
              {getStatusIcon(work.status)}
              {work.status === "Pending"
                ? "รอดำเนินการ"
                : work.status === "In Progress"
                ? "กำลังดำเนินการ"
                : work.status === "Completed"
                ? "เสร็จสิ้น"
                : work.status === "Reject"
                ? "ยกเลิก"
                : work.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {work.dateRange || "ไม่ระบุวันที่"}
            {!hasEmployee && work.status === "Pending" && (
              <span className="flex items-center gap-1 text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-xs font-medium ml-2 animate-pulse">
                <AlertCircle className="w-3 h-3" /> กรุณาเพิ่มพนักงานปฏิบัติการ
              </span>
            )}
          </p>
        </div>
        {work.status === "Pending" && onUpdateStatus && (
          <Button
            className={cn(
              "bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all",
              !hasEmployee &&
                "opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400"
            )}
            onClick={() => onUpdateStatus("In Progress")}
            disabled={!hasEmployee}
          >
            เริ่มงาน
          </Button>
        )}
        {work.status === "In Progress" && onUpdateStatus && (
          <Button
            className="bg-green-600 hover:bg-green-700 text-white shadow-md"
            onClick={() => onUpdateStatus("Completed")}
          >
            จบงาน
          </Button>
        )}
      </div>

      {/* Content ScrollArea */}
      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
          {/* Left Column (Info & Staff) - คงเดิม */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-md bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-primary" /> รายละเอียดงาน
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-sm text-muted-foreground mb-1">ลูกค้า</p>
                    <div className="flex items-center gap-2 font-medium">
                      <User className="w-4 h-4 text-blue-500" />
                      {work.customer || "-"}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-sm text-muted-foreground mb-1">
                      หัวหน้างาน (Lead)
                    </p>
                    <div className="flex items-center gap-2 font-medium">
                      <User className="w-4 h-4 text-orange-500" />
                      {work.leadEngineer || "-"}
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-muted-foreground mb-2">
                    รายละเอียดเพิ่มเติม
                  </p>
                  <p className="text-sm leading-relaxed">
                    {work.description || "-"}
                  </p>
                </div>
                {work.note && (
                  <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30">
                    <p className="text-sm text-yellow-700 dark:text-yellow-500 font-medium mb-1 flex items-center gap-2">
                      <Info className="w-4 h-4" /> หมายเหตุ
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400/80">
                      {work.note}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-primary" />{" "}
                  ทีมงานที่ปฏิบัติหน้าที่
                </CardTitle>
                {work.status === "Pending" || work.status === "In Progress" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={onAddEmployee}
                  >
                    + เพิ่มทีมงาน
                  </Button>
                ) : null}
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  const supervisors =
                    work.assignedStaff?.filter(
                      (s) => s.role === "SUPERVISOR"
                    ) || [];
                  const employees =
                    work.assignedStaff?.filter((s) => s.role === "EMPLOYEE") ||
                    [];
                  const renderStaffList = (list, useScroll = false) => {
                    const shouldScroll = useScroll && list.length > 4;
                    const content = (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {list.map((staff, idx) => (
                          <div
                            key={staff.id || idx}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 hover:shadow-sm transition-shadow group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                {staff.name?.charAt(0) || "S"}
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {staff.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {staff.role || "Staff"}
                                </p>
                              </div>
                            </div>
                            {onRemoveEmployee && staff.isNew && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onRemoveEmployee(staff.id)}
                                title="ลบพนักงาน"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                    return shouldScroll ? (
                      <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {content}
                      </div>
                    ) : (
                      content
                    );
                  };
                  return (
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <User className="w-4 h-4" /> หัวหน้างาน (
                            {supervisors.length})
                          </h4>
                          {supervisors.length > 0 && onRemoveAllSupervisors && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={onRemoveAllSupervisors}
                            >
                              ลบทั้งหมด
                            </Button>
                          )}
                        </div>
                        {supervisors.length > 0 ? (
                          renderStaffList(supervisors, true)
                        ) : (
                          <div className="text-sm text-muted-foreground italic pl-1 py-2">
                            - ไม่มีหัวหน้างาน -
                          </div>
                        )}
                      </div>
                      <Separator />
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Users className="w-4 h-4" /> พนักงานปฏิบัติการ (
                            {employees.length})
                          </h4>
                          {employees.length > 0 && onRemoveAllEmployees && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={onRemoveAllEmployees}
                            >
                              ลบทั้งหมด
                            </Button>
                          )}
                        </div>
                        {employees.length > 0 ? (
                          renderStaffList(employees, true)
                        ) : (
                          <div className="text-sm text-muted-foreground italic pl-1 py-2">
                            - ไม่มีพนักงาน -
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-primary" /> สถานที่ปฏิบัติงาน
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-none" />
                  <div>
                    <p className="font-medium text-sm">
                      {work.locationName || "ไม่ระบุชื่อสถานที่"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {work.address || "ไม่ระบุที่อยู่"}
                    </p>
                  </div>
                </div>
                {(() => {
                  const hasCoord = work.lat && work.lng;
                  const hasAddress = Boolean(
                    work.address && work.address !== "-"
                  );
                  if (!hasCoord && !hasAddress)
                    return (
                      <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                        <MapPin className="w-8 h-8 mb-2 opacity-20" />
                        <span className="text-sm">ไม่พบพิกัดแผนที่</span>
                      </div>
                    );
                  const mapSrc = hasCoord
                    ? `https://maps.google.com/maps?q=${work.lat},${work.lng}&hl=th&z=15&output=embed`
                    : `https://maps.google.com/maps?q=${encodeURIComponent(
                        work.address
                      )}&hl=th&z=15&output=embed`;
                  return (
                    <div className="space-y-2">
                      <div className="h-64 w-full rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800 relative">
                        <iframe
                          title="location-map"
                          src={mapSrc}
                          width="100%"
                          height="100%"
                          loading="lazy"
                          style={{ border: 0 }}
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {work.locationName || work.address}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Equipment / Requisitions - [ส่วนที่แก้ไขการแสดงผล] */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-md bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="w-5 h-5 text-primary" />
                  ประวัติการเบิกอุปกรณ์
                </CardTitle>
                {work.status === "In Progress" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={onAddEquipment}
                  >
                    + เบิกเพิ่ม
                  </Button>
                ) : null}
              </CardHeader>
              <CardContent className="flex-1 p-4 space-y-6 overflow-y-auto max-h-[800px]">
                {loadingRequisitions ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      กำลังโหลดรายการ...
                    </p>
                  </div>
                ) : requisitionGroups.length > 0 ? (
                  // --- [แก้ไข] วนลูปแสดงตามกลุ่ม (ครั้งที่ 1, 2, ...) ---
                  requisitionGroups.map((group, index) => (
                    <div
                      key={group.id + index}
                      className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-800 pb-4 last:pb-0 last:border-l-transparent"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      </div>

                      {/* Header ของแต่ละรอบ */}
                      <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                          เบิกครั้งที่ {index + 1}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-normal px-2 bg-gray-100 text-gray-500 dark:bg-gray-800 flex items-center gap-1 w-fit"
                        >
                          <History className="w-3 h-3" />
                          บันทึกแล้ว
                        </Badge>
                      </div>

                      {/* Table ของแต่ละรอบ */}
                      <div className="rounded-lg border bg-white dark:bg-gray-950 overflow-hidden shadow-sm">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-900/50 border-b h-8">
                              <TableHead className="py-1 h-8 text-xs font-semibold pl-3">
                                รายการ
                              </TableHead>
                              <TableHead className="py-1 h-8 text-xs font-semibold text-right pr-3 w-20">
                                จำนวน
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.items.map((req, rIdx) => (
                              <TableRow
                                key={rIdx}
                                className="border-b last:border-0 hover:bg-transparent h-auto"
                              >
                                <TableCell className="py-2 text-xs pl-3 align-top">
                                  <div className="font-medium text-gray-700 dark:text-gray-300">
                                    {req.item?.name || "Unknown Item"}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                    {req.item?.code || "-"}
                                  </div>
                                </TableCell>
                                <TableCell className="py-2 text-xs text-right pr-3 align-top">
                                  <Badge
                                    variant="outline"
                                    className="font-mono text-[10px] px-1.5 h-5"
                                  >
                                    {req.qtyRequest}{" "}
                                    {typeof req.item?.unit === "object"
                                      ? req.item.unit?.name
                                      : req.item?.unit || "หน่วย"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-3">
                      <Package className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                      ไม่มีรายการเบิก
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      งานนี้ไม่มีการเบิกใช้อุปกรณ์
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
