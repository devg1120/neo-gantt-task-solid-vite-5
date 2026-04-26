/*
import "./index.css";
import App from "./App";

console.log("index---------")
const container = document.getElementById("root");
if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error("Root container not found");
}
*/

/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')

render(() => <App />, root!)
