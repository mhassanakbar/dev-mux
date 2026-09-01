import { removeFirstByProp } from "@/utils/arrayHelpers";
import { electronJsonStorage } from "@/lib/electronJsonStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Service = {
    id: string;
    name: string;
    running: boolean;
};

type AppSidebarState = {
    services: Service[]
    selectedServiceId: string | null;
}

type AppSidebarActions = {
    addService: (name: string) => void
    removeService: (id: string) => void
    setSelectedServiceId: (id: string) => void
}

type AppSidebarStore = AppSidebarState & AppSidebarActions;

export const useAppSidebarState = create<AppSidebarStore>()(persist((set) => ({
    services: [],
    selectedServiceId: null,
    addService: (name) => {
        const id = crypto.randomUUID();
        set((state) => ({
            services: [...state.services, {
                id,
                name,
                running: false
            }],
            selectedServiceId: id
        }))
    },
    removeService: (id) => {
        set((state) => {
            const updatedServices = removeFirstByProp(state.services, "id", id);
            return {
                services: updatedServices
            }
        })
    },
    setSelectedServiceId: (id) => {
        set(() => ({ selectedServiceId: id }))
    }
}), {
    name: "app-sidebar",
    storage: createJSONStorage(() => electronJsonStorage),
    partialize: (state) => ({
        services: state.services,
        selectedServiceId: state.selectedServiceId,
    }),
}))
