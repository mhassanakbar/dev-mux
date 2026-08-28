import React from 'react';
import { Button } from './components/ui/button';

export default function App() {
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Welcome to Dev Mux</h1>
            <p>Electron + Vite + React + TypeScript is officially up and running!</p>
            <Button > Hello World!</Button>
        </div>
    );
}
