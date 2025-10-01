import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="way-esports-theme">
    <App />
  </ThemeProvider>
);
