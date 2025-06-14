"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Map string names to LucideIcon components (example)
import { CalendarDays, NotepadText, User } from "lucide-react";
const iconMap: Record<string, LucideIcon> = {
  CalendarDays,
  NotepadText,
  User,
};

export function SideBarItem({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string; // icon is a string now
    isActive?: boolean;
    items?: { title: string; url: string }[]; // submenu items
  }[];
}) {
  // Filter items without submenu
  const topLevelItems = items.filter((item) => !item.items || item.items.length === 0);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {topLevelItems.map((item) => {
          const Icon = item.icon ? iconMap[item.icon] : null;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url} className="flex items-center w-full">
                  {Icon && <Icon className="mr-2 scale-125" />}
                  <span className="text-md font-semibold">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
