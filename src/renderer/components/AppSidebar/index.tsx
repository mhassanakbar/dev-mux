import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../ui/sidebar";
import { useAppSidebarState } from "./state";

type Service = {
    id: number;
    name: string;
    running: boolean;
};

export function AppSidebar() {
    const services = useAppSidebarState((state) => state.services);
    const selectedServiceId = useAppSidebarState((state) => state.selectedServiceId);
    const setSelectedServiceId = useAppSidebarState(state => state.setSelectedServiceId)
    const addService = useAppSidebarState(state => state.addService)
    const [isAddingService, setIsAddingService] = useState(false);
    const [serviceName, setServiceName] = useState("");

    function addServiceHandler(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        addService(serviceName);
        setServiceName("");
        setIsAddingService(false);
    }

    function cancelAddingService() {
        setServiceName("");
        setIsAddingService(false);
    }

    return (
        <Sidebar collapsible="none" className="border-r">
            <SidebarHeader className="h-14 justify-center border-b px-4">
                <span className="text-sm font-semibold">All Services</span>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Services</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {services.map((service) => (
                                <SidebarMenuItem key={service.id}>
                                    <SidebarMenuButton
                                        isActive={selectedServiceId === service.id}
                                        onClick={() => setSelectedServiceId(service.id)}
                                    >
                                        <span
                                            aria-label={service.running ? "Running" : "Stopped"}
                                            className={
                                                service.running
                                                    ? "size-2.5 rounded-full bg-emerald-500"
                                                    : "size-2.5 rounded-full border border-muted-foreground"
                                            }
                                        />
                                        <span>{service.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="pt-0">
                    {isAddingService ? (
                        <form className="space-y-2" onSubmit={addServiceHandler}>
                            <SidebarInput
                                autoFocus
                                aria-label="Service name"
                                placeholder="Service name"
                                value={serviceName}
                                onChange={(event) => setServiceName(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Escape") cancelAddingService();
                                }}
                            />
                            <div className="flex justify-end gap-2 text-xs">
                                <button
                                    className="rounded-md px-2 py-1 text-muted-foreground hover:bg-sidebar-accent"
                                    type="button"
                                    onClick={cancelAddingService}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="rounded-md bg-sidebar-primary px-2 py-1 text-sidebar-primary-foreground disabled:opacity-50"
                                    type="submit"
                                    disabled={!serviceName.trim()}
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            type="button"
                            onClick={() => setIsAddingService(true)}
                        >
                            <Plus className="size-4" />
                            <span>Service</span>
                        </button>
                    )}
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
