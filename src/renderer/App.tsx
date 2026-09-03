import { RouterProvider } from "react-router/dom";
import { Navigate, createHashRouter } from "react-router";
import { AppLayout } from "./AppLayout";
import { Configuration } from "./components/Configuration";
import { Logs } from "./components/Logs";
import { Metrics } from "./components/Metrics";
import { Settings } from "./components/Settings";
import { ThemeProvider } from "./components/ThemeProvider";
import { Workspace } from "./components/Workspace";
import { WorkspaceList } from "./components/WorkspaceList";

const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <WorkspaceList />,
      },
      {
        path: "workspaces/:workspaceId",
        element: <Workspace />,
        children: [
          {
            index: true,
            element: <Navigate to="logs" replace />,
          },
          {
            path: "logs",
            element: <Logs />,
          },
          {
            path: "metrics",
            element: <Metrics />,
          },
          {
            path: "configuration",
            element: <Configuration />,
          },
        ],
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
