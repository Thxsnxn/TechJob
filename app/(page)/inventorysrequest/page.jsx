"use client";

import React, { useState, useMemo } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Eye, Pencil } from "lucide-react";

import CreateInventoryModal from "../inventorysmanagement/CreateInventoryModal";
import EditInventoryModal from "../inventorysmanagement/EditInventoryModal";
import {
  initialStockData,
  mockOrderData,
  findStockInfo,
  StatusBadge,
} from "@/lib/inventoryUtils";

export default function Page() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stockData] = useState(initialStockData);
  const [requests, setRequests] = useState(
    mockOrderData.flatMap((group) => group.orders)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesStatus =
        activeTab === "all" || req.status === activeTab;

      const matchesSearch =
        searchQuery === "" ||
        req.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.orderbookId.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [requests, searchQuery, activeTab]);

  const handleSaveNewInventory = (newData) => {
    setRequests([newData, ...requests]);
    setShowCreateModal(false);
  };

  const handleOpenEditModal = (request) => {
    setEditingItem(request);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditingItem(null);
    setShowEditModal(false);
  };

  const handleSaveEdit = (updatedData) => {
    setRequests((currentRequests) =>
      currentRequests.map((req) =>
        req.orderbookId === updatedData.orderbookId ? updatedData : req
      )
    );
    handleCloseEditModal();
  };

  return (
    <>
      <SiteHeader title="Inventory Request" />
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Inventory Requests</h1>
            <p className="text-muted-foreground">
              ติดตามสถานะคำขอเบิก และสร้างใบเบิกใหม่
            </p>
          </div>
          <Button
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            สร้างใบเบิกใหม่
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาด้วย Job ID, ชื่องาน หรือ เลขที่เอกสาร..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs
              defaultValue="all"
              className="w-full md:w-auto"
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="all" className="flex-1 md:flex-initial">
                  ทั้งหมด
                </TabsTrigger>
                <TabsTrigger
                  value="รออนุมัติ"
                  className="flex-1 md:flex-initial"
                >
                  รออนุมัติ
                </TabsTrigger>
                <TabsTrigger value="อนุมัติ" className="flex-1 md:flex-initial">
                  อนุมัติแล้ว
                </TabsTrigger>
                <TabsTrigger
                  value="ไม่อนุมัติ"
                  className="flex-1 md:flex-initial"
                >
                  ไม่อนุมัติ
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <Card key={req.orderbookId} className="flex flex-col justify-between">
                <CardHeader className="flex flex-row justify-between items-start pb-4">
                  <div className="max-w-[80%]">
                    <CardTitle className="text-lg leading-tight">
                      {req.supplier}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground pt-1">
                      {req.orderbookId}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    ยื่นขอเมื่อ: {req.orderDate}
                  </p>
                  
                  {(req.status === "ไม่อนุมัติ" || req.status === "ยกเลิก") && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-red-600">เหตุผล:</p>
                      <p className="text-sm text-red-700 bg-red-50 p-2 rounded-md">
                        {req.details?.rejectionReason || "ไม่ระบุเหตุผล"}
                      </p>
                    </div>
                  )}

                  <p className="text-sm font-medium mt-3 mb-1">
                    รายการที่เบิก ({req.items.length}):
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {req.items.slice(0, 2).map((item) => (
                      <li key={item.itemCode} className="truncate">
                        {item.itemName}
                      </li>
                    ))}
                    {req.items.length > 2 && (
                      <li className="font-medium">
                        ...และอีก {req.items.length - 2} รายการ
                      </li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter className={
                  req.status === "รออนุมัติ" 
                  ? "grid grid-cols-2 gap-2" 
                  : "grid grid-cols-1"
                }>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4" />
                    <span className="ml-2">ดูรายละเอียด</span>
                  </Button>
                  
                  {req.status === "รออนุมัติ" && (
                    <Button 
                      variant="default"
                      className="w-full" 
                      onClick={() => handleOpenEditModal(req)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="ml-2">แก้ไข</span>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground col-span-3 text-center">
              ไม่พบรายการคำขอที่ตรงกับตัวกรอง
            </p>
          )}
        </div>
      </main>

      {showCreateModal && (
        <CreateInventoryModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleSaveNewInventory}
          stockData={stockData}
          findStockInfo={findStockInfo}
        />
      )}

      {showEditModal && editingItem && (
        <EditInventoryModal
          onClose={handleCloseEditModal}
          onSubmit={handleSaveEdit}
          inventoryData={editingItem}
          stockData={stockData}
          findStockInfo={findStockInfo}
          mode="user"
        />
      )}
    </>
  );
}