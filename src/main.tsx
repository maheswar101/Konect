import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const initialTheme = localStorage.getItem("konect_theme");
document.documentElement.classList.add(initialTheme === "light" ? "light" : "dark");

createRoot(document.getElementById("root")!).render(<App />);
