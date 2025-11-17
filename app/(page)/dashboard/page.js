"use client";

import { useEffect } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { ChartPieLabel } from "@/components/pie-chart";
import { getAdminSession } from "@/lib/adminSession";


export default function Page() {


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
            <SectionCards />
            <div className="grid grid-cols-2">
              <div className="px-4 lg:pl-6">
                <ChartAreaInteractive />
              </div>
              <div className="px-4 lg:pr-6">
                <ChartPieLabel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
