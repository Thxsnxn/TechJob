"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default function EngineerModal({ onClose, onConfirm }) {
  const [search, setSearch] = useState("")
  const [selectedEngineers, setSelectedEngineers] = useState([])

  // Mock ข้อมูล Engineer
  const employees = [
    { id: "6717261", name: "Thastanon Kaisomsat", position: "Fireguard" },
    { id: "6717262", name: "Beam T.", position: "Technician" },
    { id: "6717263", name: "Mild R.", position: "Engineer" },
    { id: "6717264", name: "Korn P.", position: "Supervisor" },
    { id: "6717265", name: "Ning N.", position: "Assistant" },
  ]

  // filter ตามคำค้นหา
  const filtered = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  )

  // toggle การเลือก checkbox
  const toggleEngineer = (emp) => {
    if (selectedEngineers.some((e) => e.id === emp.id)) {
      setSelectedEngineers(selectedEngineers.filter((e) => e.id !== emp.id))
    } else {
      setSelectedEngineers([...selectedEngineers, emp])
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] md:w-[700px] p-6">
        <h2 className="text-xl font-bold mb-4">Assign Engineer(s)</h2>

        {/* Search Input */}
        <Input
          placeholder="Search for existing Engineer(s)..."
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
                    type="checkbox"
                    checked={selectedEngineers.some((e) => e.id === emp.id)}
                    onChange={() => toggleEngineer(emp)}
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
              if (selectedEngineers.length === 0) {
                alert("Please select at least one engineer.")
                return
              }
              onConfirm(selectedEngineers)
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
