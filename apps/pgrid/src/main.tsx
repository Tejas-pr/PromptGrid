import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import { ThemeProvider } from "./components/providers/theme-provider.tsx";
import App from "./App.tsx";
import { ElysiaClientProvider } from "./providers/elysiaProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ElysiaClientProvider>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </ElysiaClientProvider>
  </StrictMode>,
);
