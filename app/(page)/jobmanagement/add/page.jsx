"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import LeadModal from "./LeadModal"
import EngineerModal from "./EngineerModal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"

export default function CreateJobModal({ onClose }) {
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showEngineerModal, setShowEngineerModal] = useState(false)
  const [lead, setLead] = useState(null)
  const [engineers, setEngineers] = useState([])

  const handleConfirmLead = (selected) => {
    setLead(selected[0])
    setShowLeadModal(false)
  }

  const handleConfirmEngineer = (selected) => {
    setEngineers(selected)
    setShowEngineerModal(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-auto">
      <div className="bg-white rounded-xl shadow-lg w-[95%] md:w-[900px] max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Create New Job</h2>

        {/* --- Job Information --- */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">🧾 Job Information</h3>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input placeholder="Job Title" />
            <Textarea placeholder="Job Description" />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Start Date (DD/MM/YYYY)" />
              <Input placeholder="Due Date (DD/MM/YYYY)" />
            </div>
          </CardContent>
        </Card>

        {/* --- Customer Information --- */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">👥 Customer Information</h3>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input placeholder="Customer Name" />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Contact Number" />
              <Input placeholder="Address" />
            </div>
          </CardContent>
        </Card>

        {/* --- Job Ownership & Assignment --- */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">🧑‍🔧 Job Ownership & Assignment</h3>
          </CardHeader>
          <CardContent>
            {/* Lead Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Assigned Lead</h4>
                <Button onClick={() => setShowLeadModal(true)}>+ Add Lead</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lead ? (
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell>{lead.id}</TableCell>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.position}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setLead(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No Lead Assigned
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Engineer Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Assign Engineer(s)</h4>
                <Button onClick={() => setShowEngineerModal(true)}>+ Add Engineer</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {engineers.length > 0 ? (
                    engineers.map((eng, i) => (
                      <TableRow key={eng.id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{eng.id}</TableCell>
                        <TableCell>{eng.name}</TableCell>
                        <TableCell>{eng.position}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setEngineers(engineers.filter((e) => e.id !== eng.id))
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No Engineers Assigned
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* --- Location --- */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">📍 Location Details</h3>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="border border-dashed rounded-lg h-48 flex items-center justify-center text-muted-foreground">
              Interactive Map Component
            </div>
            <Textarea placeholder="Full Address..." />
          </CardContent>
        </Card>

        {/* --- Notes --- */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">📝 Notes</h3>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Enter Notes..." />
          </CardContent>
        </Card>

        {/* --- Buttons --- */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose} className="bg-gray-200 hover:bg-gray-300">
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create</Button>
        </div>
      </div>

      {/* Popup ซ้อน */}
      {showLeadModal && (
        <LeadModal onClose={() => setShowLeadModal(false)} onConfirm={handleConfirmLead} />
      )}
      {showEngineerModal && (
        <EngineerModal
          onClose={() => setShowEngineerModal(false)}
          onConfirm={handleConfirmEngineer}
        />
      )}
    </div>
  )
}
