import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { AppSidebar } from "../components/Sidebar/AppSidebar";

import { PageTitleProvider } from "../lib/NavbarPageContext";

export default function Layout({ children }: { children: React.ReactNode }) {


  return (
    <SidebarProvider>
      <AppSidebar />
      <PageTitleProvider>
        <SidebarInset className="bg-[#f7f7f7]">
          <main>{children}</main>
        </SidebarInset>
      </PageTitleProvider>
    </SidebarProvider>
  );
}
