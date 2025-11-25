"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default function LeadModal({ onClose, onConfirm }) {
  const [search, setSearch] = useState("")
  const [selectedLead, setSelectedLead] = useState(null)

  // ข้อมูลจำลอง (Mock Data)
  const employees = [
    { id: "1504341", name: "ภูริทัต จิตรมณี", position: "-", role: "SUPERVISOR", status: "ติดงาน (BUSY)" },
    { id: "4905902", name: "กนกวรรณ ปัทมวิชัย", position: "-", role: "SUPERVISOR", status: "ติดงาน (BUSY)" },
    { id: "9660759", name: "สิรวิชญ์ คงอรุณ", position: "-", role: "SUPERVISOR", status: "ว่าง (FREE)" },
    { id: "6990398", name: "Siradech Srium", position: "-", role: "SUPERVISOR", status: "ติดงาน (BUSY)" },
  ]

  // ระบบค้นหา
  const filtered = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.id.includes(search)
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-sans">
      <div className="bg-white rounded-xl shadow-lg w-[90%] md:w-[900px] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-blue-600 p-4 rounded-t-xl flex justify-between items-center text-white shrink-0">
            <h2 className="text-lg font-bold">เลือก Assigned Lead (Supervisor)</h2>
            <button onClick={onClose} className="hover:text-gray-200 text-xl font-bold">✕</button>
        </div>

        <div className="p-6 flex flex-col overflow-hidden">
            {/* Search Input */}
            <Input
                placeholder="ค้นหา ชื่อ, รหัสพนักงาน..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4"
            />

            {/* Table Area */}
            <div className="overflow-auto border rounded-md">
                <Table>
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                    <TableRow>
                    <TableHead className="w-[50px]">เลือก</TableHead>
                    <TableHead>รหัสพนักงาน</TableHead>
                    <TableHead>ชื่อ-นามสกุล</TableHead>
                    <TableHead>ตำแหน่ง</TableHead>
                    <TableHead>ROLE</TableHead>
                    <TableHead>STATUS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filtered.map((emp) => {
                    // ตรวจสอบสถานะเพื่อแสดงสี (แต่ไม่มีผลต่อการเลือก)
                    const isBusy = emp.status.includes("BUSY") || emp.status.includes("ติดงาน");
                    
                    return (
                        <TableRow 
                            key={emp.id} 
                            // จุดสำคัญ 1: ให้คลิกที่แถวได้เลย และเมาส์เป็นรูปมือเสมอ
                            className="hover:bg-blue-50 cursor-pointer"
                            onClick={() => setSelectedLead(emp)} 
                        >
                        <TableCell>
                            <input
                            type="radio"
                            name="lead"
                            checked={selectedLead?.id === emp.id}
                            onChange={() => setSelectedLead(emp)}
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                            // จุดสำคัญ 2: ต้องไม่มี attribute disabled
                            />
                        </TableCell>
                        <TableCell>{emp.id}</TableCell>
                        <TableCell>{emp.name}</TableCell>
                        <TableCell>{emp.position}</TableCell>
                        <TableCell className="text-gray-500 font-medium text-xs uppercase">{emp.role}</TableCell>
                        <TableCell>
                            {/* แสดง Badge สีตามสถานะ */}
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                isBusy 
                                ? "bg-red-100 text-red-600" 
                                : "bg-green-100 text-green-600"
                            }`}>
                                {emp.status}
                            </span>
                        </TableCell>
                        </TableRow>
                    )
                    })}
                </TableBody>
                </Table>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t shrink-0">
                <span className="text-sm text-gray-700 font-medium">
                    เลือกแล้ว {selectedLead ? 1 : 0} รายการ 
                    {selectedLead && <span className="text-blue-600 ml-2">({selectedLead.name})</span>}
                </span>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose} className="min-w-[80px]">
                    ยกเลิก
                    </Button>
                    <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                    onClick={() => {
                        // จุดสำคัญ 3: เช็คแค่ว่าเลือกหรือยัง ไม่เช็คสถานะ BUSY
                        if (!selectedLead) {
                            alert("กรุณาเลือก Lead ก่อนยืนยัน")
                            return
                        }
                        onConfirm(selectedLead)
                        onClose()
                    }}
                    >
                    บันทึกการเลือก
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}