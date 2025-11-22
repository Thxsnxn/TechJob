"use client";

import { useEffect, useState } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { ChartPieLabel } from "@/components/pie-chart";
import { getAdminSession } from "@/lib/adminSession";
import { mockDashboardData } from "@/lib/mockDashboardData";

export default function Page() {
  const [selectedCard, setSelectedCard] = useState("totalJobs");

  useEffect(() => {
    // ถ้ามี session อยู่แล้ว ให้เด้งไปหน้าอื่น
    const session = getAdminSession();

    console.log("Existing session ->>>>>>", session);

  }, [getAdminSession]);

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards
              data={mockDashboardData}
              selectedCard={selectedCard}
              onCardClick={setSelectedCard}
            />
            <div className="grid grid-cols-2">
              <div className="px-4 lg:pl-6">
                <ChartAreaInteractive
                  data={mockDashboardData[selectedCard].chartData}
                  title={mockDashboardData[selectedCard].label}
                />
              </div>
              <div className="px-4 lg:pr-6">
                <ChartPieLabel data={mockDashboardData.pieChartData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
