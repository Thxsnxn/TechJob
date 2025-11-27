"use client";

import { useEffect, useState } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { ChartPieLabel } from "@/components/pie-chart";
import { getAdminSession } from "@/lib/adminSession";
import { mockDashboardData } from "@/lib/mockDashboardData";
import apiClient, { setAuthToken } from "@/lib/apiClient";

export default function Page() {
  const [selectedCard, setSelectedCard] = useState("totalJobs");
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getAdminSession();
    console.log("Existing session ->>>>>", session);

    if (session && session.code) {
      fetchDashboardData(session);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async (session) => {
    try {
      setLoading(true);

      // Set auth token if available
      if (session.token) {
        setAuthToken(session.token);
      }

      const payload = {
        empCode: session.code,
        page: 1,
        pageSize: 1000, // Get all jobs to calculate stats
      };

      console.log("Fetching dashboard data with payload:", payload);
      const response = await apiClient.post("/supervisor/by-code", payload);
      console.log("API Response:", response.data);

      const jobs =
        response.data?.items ||
        response.data?.data ||
        response.data?.rows ||
        [];

      // Calculate statistics from real data
      const totalJobs = jobs.length;
      const inProgress = jobs.filter(
        (job) => job.status === "IN_PROGRESS"
      ).length;
      const pending = jobs.filter((job) => job.status === "PENDING").length;
      const completed = jobs.filter((job) => job.status === "COMPLETED").length;

      // Update dashboard data with real values
      setDashboardData({
        ...mockDashboardData,
        totalJobs: {
          ...mockDashboardData.totalJobs,
          value: totalJobs,
        },
        inProgress: {
          ...mockDashboardData.inProgress,
          value: inProgress,
        },
        pending: {
          ...mockDashboardData.pending,
          value: pending,
        },
        completed: {
          ...mockDashboardData.completed,
          value: completed,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Keep using mock data on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards
              data={dashboardData}
              selectedCard={selectedCard}
              onCardClick={setSelectedCard}
            />
            <div className="grid grid-cols-2">
              <div className="px-4 lg:pl-6">
                <ChartAreaInteractive
                  data={dashboardData[selectedCard].chartData}
                  title={dashboardData[selectedCard].label}
                />
              </div>
              <div className="px-4 lg:pr-6">
                <ChartPieLabel data={dashboardData.pieChartData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
