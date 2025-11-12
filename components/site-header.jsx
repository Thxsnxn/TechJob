import React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function SiteHeader({ title = "Dashboard" }) {
  const pathname = usePathname() || "/"

  const prettyTitle = (segment) => {
    const map = {
      dashboard: "Dashboard",
      jobmanagement: "Job Management",
      userscustomers: "Users Customers",
      otmanagement: "OT Management",
      create: "Create New Job",
      edit: "Edit Job",
      new: "Create New",
      otrequests: "OT Requests",
    }
    if (map[segment]) return map[segment]
    // fallback: capitalize words split by -
    return segment
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ")
  }

  const segments = pathname.split("/").filter(Boolean)
  const crumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/")
    return { href, label: prettyTitle(seg) }
  })

  return (
    <header
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className=" -ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

        <div className="flex flex-col gap-0.5">
          {/* <h1 className="text-2xl font-bold leading-none">{title}</h1> */}
          <Breadcrumb>
            <BreadcrumbList>
              {/* Home crumb */}
              <BreadcrumbItem>
              </BreadcrumbItem>
             
              {crumbs.map((c, i) => {
                const isLast = i === crumbs.length - 1
                return (
                  <React.Fragment key={c.href}>
                    {!isLast ? (
                      <>
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link href={c.href}>{c.label}</Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </>
                    ) : (
                      <BreadcrumbItem>
                        <BreadcrumbPage>{c.label}</BreadcrumbPage>
                      </BreadcrumbItem>
                    )}
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </header>
  );
}
