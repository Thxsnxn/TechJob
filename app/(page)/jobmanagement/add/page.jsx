"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { SiteHeader } from "@/components/site-header"
import { CircleUserRound, UserRoundSearch, MapPinned, NotebookPen, NotebookText, Trash2 } from 'lucide-react'
import LeadModal from "./LeadModal"
import EngineerModal from "./EngineerModal"

export default function CreateJobPage() {
  const [lead, setLead] = useState(null)
  const [engineers, setEngineers] = useState([])
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showEngineerModal, setShowEngineerModal] = useState(false)
  const router = useRouter()

  return (
    <main className="">
      <SiteHeader title="Job Management" />

      <div className="p-6 space-y-4">
        {/* --- Job Information --- */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <NotebookText className="text-blue-600" />Job Information
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Enter Job Title..." />
            <Textarea placeholder="Enter Job Description..." />
            <div className="grid grid-cols-2 gap-4">
              <Input type="date" placeholder="Start Date" />
              <Input type="date" placeholder="Due Date" />
            </div>
          </CardContent>
        </Card>

        {/* --- Customer Information --- */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <CircleUserRound className="text-blue-600" /> Customer Information
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Search for existing customer..." />
            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="Auto filled upon selection" />
              <Input placeholder="Auto filled upon selection" />
              <Input placeholder="Auto filled add dress" />
            </div>
          </CardContent>
        </Card>

        {/* --- Job Ownership & Assignment --- */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <UserRoundSearch className="text-blue-600" /> Job Ownership & Assignment
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Lead Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
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
              <div className="flex justify-between items-center mb-2">
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
                        No Engineer Assigned
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* --- Location Details --- */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <MapPinned className="text-blue-600" /> Location Details
            </h2>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Textarea placeholder="Full Address..." />
          </CardContent>
        </Card>

        {/* --- Notes --- */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <NotebookPen className="text-blue-600" />
              Notes
            </h2>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Enter Notes..." />
          </CardContent>
        </Card>

        {/* --- Footer Buttons --- */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            className="bg-gray-200 hover:bg-gray-300"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              // TODO: validate / save form here (call API or update state)
              router.push("/jobmanagement")
            }}
          >
            Create
          </Button>
        </div>
      </div>

      {/* Popup Modals */}
      {showLeadModal && <LeadModal onClose={() => setShowLeadModal(false)} onConfirm={setLead} />}
      {showEngineerModal && (
        <EngineerModal
          onClose={() => setShowEngineerModal(false)}
          onConfirm={setEngineers}
        />
      )}
    </main>
  )
}
