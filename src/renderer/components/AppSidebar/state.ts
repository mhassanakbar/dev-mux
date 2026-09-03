import { electronJsonStorage } from "@/lib/electronJsonStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Service = {
  id: string;
  name: string;
  running: boolean;
};

export type Workspace = {
  id: string;
  name: string;
  rootDirectory: string;
  services: Service[];
  selectedServiceId: string | null;
};

type WorkspaceState = {
  workspaces: Workspace[];
  selectedWorkspaceId: string | null;
};

type WorkspaceActions = {
  addWorkspace: (name: string, rootDirectory: string) => string;
  removeWorkspace: (id: string) => void;
  setSelectedWorkspaceId: (id: string | null) => void;
  addService: (workspaceId: string, name: string) => void;
  removeService: (workspaceId: string, serviceId: string) => void;
  setSelectedServiceId: (workspaceId: string, serviceId: string | null) => void;
};

type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const useAppSidebarState = create<WorkspaceStore>()(
  persist(
    (set) => ({
      workspaces: [],
      selectedWorkspaceId: null,
      addWorkspace: (name, rootDirectory) => {
        const id = crypto.randomUUID();
        set((state) => ({
          workspaces: [
            ...state.workspaces,
            {
              id,
              name: name.trim(),
              rootDirectory: rootDirectory.trim(),
              services: [],
              selectedServiceId: null,
            },
          ],
          selectedWorkspaceId: id,
        }));
        return id;
      },
      removeWorkspace: (id) => {
        set((state) => ({
          workspaces: state.workspaces.filter((workspace) => workspace.id !== id),
          selectedWorkspaceId:
            state.selectedWorkspaceId === id ? null : state.selectedWorkspaceId,
        }));
      },
      setSelectedWorkspaceId: (id) => set({ selectedWorkspaceId: id }),
      addService: (workspaceId, name) => {
        const service: Service = {
          id: crypto.randomUUID(),
          name: name.trim(),
          running: false,
        };
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId
              ? {
                  ...workspace,
                  services: [...workspace.services, service],
                  selectedServiceId: service.id,
                }
              : workspace,
          ),
        }));
      },
      removeService: (workspaceId, serviceId) => {
        set((state) => ({
          workspaces: state.workspaces.map((workspace) => {
            if (workspace.id !== workspaceId) return workspace;

            const services = workspace.services.filter((service) => service.id !== serviceId);
            return {
              ...workspace,
              services,
              selectedServiceId:
                workspace.selectedServiceId === serviceId
                  ? (services[0]?.id ?? null)
                  : workspace.selectedServiceId,
            };
          }),
        }));
      },
      setSelectedServiceId: (workspaceId, serviceId) => {
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId
              ? { ...workspace, selectedServiceId: serviceId }
              : workspace,
          ),
        }));
      },
    }),
    {
      name: "app-sidebar",
      version: 1,
      storage: createJSONStorage(() => electronJsonStorage),
      partialize: (state) => ({
        workspaces: state.workspaces,
        selectedWorkspaceId: state.selectedWorkspaceId,
      }),
    },
  ),
);
