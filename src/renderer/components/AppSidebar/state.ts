import { removeFirstByProp } from "@/utils/arrayHelpers";
import { create } from "zustand";

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

export const useAppSidebarState = create<AppSidebarState & AppSidebarActions>((set) => ({
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
}))