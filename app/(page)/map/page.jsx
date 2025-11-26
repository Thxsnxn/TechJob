'use client'
import React, { useState } from 'react'
import StatusSummary from './components/StatusSummary'
import JobList from './components/JobList'
import WorkMap from './components/WorkMap'
import ViewJobModal from '../jobmanagement/ViewJobModal'
import { SiteHeader } from '@/components/site-header'

const MapOverviewPage = () => {
  const [selectedJob, setSelectedJob] = useState(null)
  const [viewJob, setViewJob] = useState(null)
  const [allJobs, setAllJobs] = useState([])

  return (
    <>
      <SiteHeader title="Map Overview" />
      <div className="flex flex-col h-[calc(100vh-3rem)] bg-background overflow-hidden">
        <div className="flex-1 p-2 md:p-4 space-y-4 flex flex-col min-h-0">
          {/* Top Row - Status Summary */}
          <div className="flex-none">
            <StatusSummary />
          </div>

          {/* Main Content - Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0">
            {/* Left Side - Large Map Container */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden h-full">
              <WorkMap selectedJob={selectedJob} allJobs={allJobs} />
            </div>

            {/* Right Side - Job List Container */}
            <div className="lg:col-span-1 h-full overflow-hidden">
              <JobList
                onJobSelect={setSelectedJob}
                onViewJob={setViewJob}
                onJobsLoaded={setAllJobs}
              />
            </div>
          </div>
        </div>

        {/* View Job Modal */}
        {viewJob && (
          <ViewJobModal
            job={viewJob}
            onClose={() => setViewJob(null)}
          />
        )}
      </div>
    </>
  )
}

export default MapOverviewPage