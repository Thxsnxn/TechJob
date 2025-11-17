"use client";

import { SiteHeader } from "@/components/site-header";

export default function Page() {


    return (
        <>
            <SiteHeader />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 p-4 justify-between  ">
               <div className="border-2  h-15">
                <h1 className="text-sm sm:text-lg sm:text-red  md:text-50 md:text-3xl md:text-blue-500">korn</h1>
               </div>
               <div className="border-2  h-15"></div>
               <div className="border-2  h-15"></div>
               <div className="border-2  h-15"></div>
               <div className="border-2  h-15"></div>
          
            </div>
        </>
    );
}
