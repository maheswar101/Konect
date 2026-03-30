import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const initialTheme = localStorage.getItem("medbuddy_theme");
document.documentElement.classList.add(initialTheme === "dark" ? "dark" : "light");

createRoot(document.getElementById("root")!).render(<App />);
