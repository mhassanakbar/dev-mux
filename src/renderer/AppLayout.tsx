import { Outlet } from "react-router";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";

export function AppLayout() {
    return (
        <SidebarProvider className="fixed inset-0 min-h-0 overflow-hidden">
            <AppSidebar />
            <SidebarInset className="min-w-0 overflow-auto">
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}
