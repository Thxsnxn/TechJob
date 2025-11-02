"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EngineerModal({ onClose, onConfirm }) {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState([])

  const employees = [
    { id: "6717261", name: "Thastanon Kaisomsat", position: "Fireguard" },
    { id: "6717262", name: "Ning K.", position: "Technician" },
    { id: "6717263", name: "Beam T.", position: "Engineer" },
    { id: "6717264", name: "Mild R.", position: "Safety Officer" },
  ]

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (emp) => {
    setSelected((prev) =>
      prev.find((e) => e.id === emp.id)
        ? prev.filter((e) => e.id !== emp.id)
        : [...prev, emp]
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] md:w-[700px] rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Assign Engineer(s)</h2>
        <Input
          placeholder="Search for existing Assign Engineer(s)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

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
                    checked={selected.find((e) => e.id === emp.id)}
                    onChange={() => toggleSelect(emp)}
                  />
                </TableCell>
                <TableCell>{emp.id}</TableCell>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.position}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (selected.length > 0) onConfirm(selected)
              else alert("Please select at least one engineer")
            }}
            className="bg-blue-600 text-white"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
