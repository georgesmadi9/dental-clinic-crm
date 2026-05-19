"use client";

import { useState } from "react";
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

import { AppointmentModal } from "@/app/components/AppointmentModal";
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
    title: "Appointments",
    url: "/appointments",
    icon: "CalendarCheck",
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: "CalendarDays",
  },
];

export function AppSidebar() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const handleScheduleAppointment = () => {
    setIsAppointmentModalOpen(true);
  };

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
                <SidebarMenuButton onClick={handleScheduleAppointment}>
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

      {/* Appointment Modal */}
      <AppointmentModal
        open={isAppointmentModalOpen}
        onOpenChange={setIsAppointmentModalOpen}
      />
    </Sidebar>
  );
}
