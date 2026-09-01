import { RouterProvider } from "react-router/dom";
import { createHashRouter } from "react-router";
import { AppLayout } from "./AppLayout";

const router = createHashRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
                    <h1>Welcome to Dev Mux</h1>
                    <p>Electron + Vite + React + TypeScript is officially up and running!</p>
                </div>,
            }
        ],
    },
]);

export function App() {
    return <RouterProvider router={router} />;
}