import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  BookPlus,
  CalendarPlus2,
  MenuIcon,
  UserPlus2,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const UtilityMenuButton = () => {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="fixed bottom-4 right-4 z-50 p-3 menu-btn">
          <MenuIcon className="w-7 h-7" />
        </MenubarTrigger>

        <MenubarContent side="top" align="end">
          <MenubarItem asChild>
            <Link
              href={`/cases/new`}
              className="flex gap-2 hover:bg-[#0C8F8F50] cursor-pointer"
            >
              <BookPlus /> New Case
            </Link>
          </MenubarItem>
          <MenubarItem asChild>
            <Link
              href={`/patients/new`}
              className="flex gap-2 hover:bg-[#0C8F8F50] cursor-pointer"
            >
              <UserPlus2 /> New Patient
            </Link>
          </MenubarItem>
          <MenubarItem className="flex gap-2 hover:bg-[#0C8F8F50] cursor-pointer">
            <CalendarPlus2 /> Schedule Appointment
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default UtilityMenuButton;
