/*
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

console.log("main---------")
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
*/

/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')

render(() => <App />, root!)
