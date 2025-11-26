'use client'
import React, { useState } from 'react'
import StatusSummary from './components/StatusSummary'
import JobList from './components/JobList'
import WorkMap from './components/WorkMap'
import ViewJobModal from '../jobmanagement/ViewJobModal'
import { SiteHeader } from '@/components/site-header'
import { MapPin } from 'lucide-react'

const MapOverviewPage = () => {
  const [selectedJob, setSelectedJob] = useState(null)
  const [viewJob, setViewJob] = useState(null)
  const [allJobs, setAllJobs] = useState([])

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 flex flex-col">
      <SiteHeader title="แผนที่งาน" />

      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto w-full flex flex-col">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 p-8 shadow-lg shrink-0">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                <MapPin className="h-8 w-8" /> แผนที่งาน
              </h1>
              <p className="text-cyan-100 mt-2 text-lg">
                ติดตามตำแหน่งและสถานะงานทั้งหมดบนแผนที่แบบ Real-time
              </p>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="shrink-0">
          <StatusSummary />
        </div>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-[600px]">
          {/* Left Side - Large Map Container */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative min-h-[500px]">
            <WorkMap selectedJob={selectedJob} allJobs={allJobs} />
          </div>

          {/* Right Side - Job List Container */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
            <JobList
              onJobSelect={setSelectedJob}
              onViewJob={setViewJob}
              onJobsLoaded={setAllJobs}
            />
          </div>
        </div>
      </main>

      {/* View Job Modal */}
      {viewJob && (
        <ViewJobModal
          job={viewJob}
          onClose={() => setViewJob(null)}
        />
      )}
    </div>
  )
}

export default MapOverviewPage