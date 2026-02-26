"use client"

import * as React from "react"
import {
  BotMessageSquare,
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
      name: "Chat",
      url: "/chat",
      icon: BotMessageSquare,
    },
    {
      name: "Dashboard",
      url: "/chat/dashboard",
      icon: Frame,
    },
    {
      name: "Api Keys",
      url: "/chat/api-keys",
      icon: Key,
    },
    {
      name: "Credits",
      url: "/chat/credits",
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
