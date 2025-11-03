"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default function LeadModal({ onClose, onConfirm }) {
  const [search, setSearch] = useState("")
  const [selectedLead, setSelectedLead] = useState(null)

  // mock ข้อมูล Lead
  const employees = [
    { id: "6717261", name: "Thastanon Kaisomsat", position: "Fireguard" },
    { id: "6717262", name: "Ning R.", position: "Supervisor" },
    { id: "6717263", name: "Beam P.", position: "Engineer" },
    { id: "6717264", name: "Korn K.", position: "Manager" },
  ]

  // ฟังก์ชัน filter
  const filtered = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] md:w-[700px] p-6">
        <h2 className="text-xl font-bold mb-4">Assigned Lead</h2>

        {/* Search Input */}
        <Input
          placeholder="Search for existing Assigned Lead..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>
                  <input
                    type="radio"
                    name="lead"
                    checked={selectedLead?.id === emp.id}
                    onChange={() => setSelectedLead(emp)}
                  />
                </TableCell>
                <TableCell>{emp.id}</TableCell>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.position}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              if (!selectedLead) {
                alert("Please select a lead before confirming.")
                return
              }
              onConfirm(selectedLead)
              onClose()
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
