import { useState, type FormEvent } from "react";
import { Boxes, FolderKanban, LayoutGrid, ListTree, Plus, Settings } from "lucide-react";
import { Link, matchPath, useLocation } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import { useAppSidebarState } from "./state";

export function AppSidebar() {
  const { pathname } = useLocation();
  const workspaceMatch = matchPath("/workspaces/:workspaceId/*", pathname);
  const activeWorkspaceId = workspaceMatch?.params.workspaceId ?? null;
  const workspaces = useAppSidebarState((state) => state.workspaces);
  const setSelectedWorkspaceId = useAppSidebarState((state) => state.setSelectedWorkspaceId);
  const addService = useAppSidebarState((state) => state.addService);
  const setSelectedServiceId = useAppSidebarState((state) => state.setSelectedServiceId);
  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceName, setServiceName] = useState("");

  function addServiceHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeWorkspaceId || !serviceName.trim()) return;

    addService(activeWorkspaceId, serviceName);
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
        <Link className="flex items-center gap-2 rounded-md px-1 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring" to="/">
          <span className="grid size-7 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Boxes className="size-4" />
          </span>
          <span className="text-sm font-semibold">DevMux</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/"} render={<Link to="/" />}>
                  <LayoutGrid />
                  <span>All workspaces</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {workspaces.map((workspace) => (
                <SidebarMenuItem key={workspace.id}>
                  <SidebarMenuButton
                    isActive={activeWorkspaceId === workspace.id}
                    render={
                      <Link
                        onClick={() => {
                          setSelectedWorkspaceId(workspace.id);
                          cancelAddingService();
                        }}
                        to={`/workspaces/${workspace.id}/logs`}
                      />
                    }
                  >
                    <FolderKanban />
                    <span>{workspace.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {activeWorkspace && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>{activeWorkspace.name} services</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeWorkspace.selectedServiceId === null}
                      onClick={() => setSelectedServiceId(activeWorkspace.id, null)}
                    >
                      <ListTree />
                      <span>All services</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {activeWorkspace.services.length > 0 ? (
                    <>
                    {activeWorkspace.services.map((service) => (
                      <SidebarMenuItem key={service.id}>
                        <SidebarMenuButton
                          isActive={activeWorkspace.selectedServiceId === service.id}
                          onClick={() => setSelectedServiceId(activeWorkspace.id, service.id)}
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
                    </>
                  ) : (
                    <li className="px-2 py-2 text-xs leading-5 text-muted-foreground">
                      No services in this workspace yet.
                    </li>
                  )}
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
                  <span>Add service</span>
                </button>
              )}
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname === "/settings"} render={<Link to="/settings" />}>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
