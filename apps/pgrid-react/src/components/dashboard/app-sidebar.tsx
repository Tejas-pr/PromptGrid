"use client"

import * as React from "react"
import {
  Frame,
  HandCoins,
  Key,
} from "lucide-react"

import { NavProjects } from "@/components/dashboard/nav-projects"
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: Frame,
    },
    {
      name: "Api Keys",
      url: "/dashboard/api-keys",
      icon: Key,
    },
    {
      name: "Credits",
      url: "/dashboard/credits",
      icon: HandCoins,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
