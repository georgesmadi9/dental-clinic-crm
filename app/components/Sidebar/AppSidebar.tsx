import { CalendarPlus } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";

import { SideBarUser } from "./SideBarUser";
import { SideBarItem } from "./SideBarItem";

const sidebarItems = [
  {
    title: "Cases",
    url: "/cases",
    icon: "NotepadText", // string name of the icon
  },
  {
    title: "Patients",
    url: "/patients",
    icon: "User",
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: "CalendarDays",
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="bg-white" collapsible="icon">
      <SidebarHeader className="flex flex-col items-center">
        <Image src={`/logo.png`} alt="Logo" width={100} height={50} />
        <Separator className="my-3" />
      </SidebarHeader>
      <SidebarContent>
        {/* Main Menus */}
        <SideBarItem items={sidebarItems} />

        {/* Appointment Scheduling  aligned at the bottom of the side bar*/}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <CalendarPlus className="mr-2 shrink-0 scale-125" />
                  <span className="text-md font-semibold">Schedule Appointment</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SideBarUser
              user={{
                name: "Jad Madi",
                email: "jad.madi@net.usj.edu.lb",
                avatar: "/avatar-jad.png",
              }}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
