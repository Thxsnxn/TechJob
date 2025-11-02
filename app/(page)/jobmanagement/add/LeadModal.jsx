"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function LeadModal({ onClose, onConfirm }) {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(null)

  const employees = [
    { id: "6717261", name: "Thastanon Kaisomsat", position: "Fireguard" },
    { id: "6717262", name: "Korn P.", position: "Supervisor" },
    { id: "6717263", name: "Beam T.", position: "Manager" },
  ]

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] md:w-[700px] rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Assigned Lead</h2>
        <Input
          placeholder="Search for existing Assigned Lead..."
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
                    type="radio"
                    name="lead"
                    checked={selected?.id === emp.id}
                    onChange={() => setSelected(emp)}
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
              if (selected) onConfirm([selected])
              else alert("Please select a Lead")
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
