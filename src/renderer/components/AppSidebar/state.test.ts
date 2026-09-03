import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { useAppSidebarState } from "./state";

const workspaceId = "00000000-0000-4000-8000-000000000001";
const serviceId = "00000000-0000-4000-8000-000000000002";

describe("app sidebar state", () => {
  beforeAll(async () => {
    await useAppSidebarState.persist.rehydrate();
  });

  beforeEach(() => {
    useAppSidebarState.setState({
      workspaces: [],
      selectedWorkspaceId: null,
    });
  });

  it("adds a trimmed workspace and selects it", () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValueOnce(workspaceId);

    const result = useAppSidebarState
      .getState()
      .addWorkspace("  DevMux  ", "  C:\\projects\\dev-mux  ");

    expect(result).toBe(workspaceId);
    expect(useAppSidebarState.getState()).toMatchObject({
      selectedWorkspaceId: workspaceId,
      workspaces: [
        {
          id: workspaceId,
          name: "DevMux",
          rootDirectory: "C:\\projects\\dev-mux",
          services: [],
          selectedServiceId: null,
        },
      ],
    });
  });

  it("adds and selects a service only in the requested workspace", () => {
    vi.spyOn(crypto, "randomUUID")
      .mockReturnValueOnce(workspaceId)
      .mockReturnValueOnce(serviceId);
    const state = useAppSidebarState.getState();
    state.addWorkspace("DevMux", "");
    state.addService(workspaceId, "  Renderer  ");

    expect(useAppSidebarState.getState().workspaces[0]).toMatchObject({
      selectedServiceId: serviceId,
      services: [{ id: serviceId, name: "Renderer", running: false }],
    });
  });

  it("selects the first remaining service when the selected service is removed", () => {
    useAppSidebarState.setState({
      workspaces: [
        {
          id: workspaceId,
          name: "DevMux",
          rootDirectory: "",
          selectedServiceId: serviceId,
          services: [
            { id: serviceId, name: "Main", running: false },
            { id: "renderer", name: "Renderer", running: true },
          ],
        },
      ],
    });

    useAppSidebarState.getState().removeService(workspaceId, serviceId);

    expect(useAppSidebarState.getState().workspaces[0]).toMatchObject({
      selectedServiceId: "renderer",
      services: [{ id: "renderer" }],
    });
  });

  it("clears the workspace selection only when the selected workspace is removed", () => {
    useAppSidebarState.setState({
      selectedWorkspaceId: workspaceId,
      workspaces: [
        {
          id: workspaceId,
          name: "DevMux",
          rootDirectory: "",
          services: [],
          selectedServiceId: null,
        },
      ],
    });

    useAppSidebarState.getState().removeWorkspace(workspaceId);

    expect(useAppSidebarState.getState()).toMatchObject({
      selectedWorkspaceId: null,
      workspaces: [],
    });
  });
});
