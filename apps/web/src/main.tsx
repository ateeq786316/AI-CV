import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ConfigError } from "./components/ConfigError";
import { isSupabaseConfigured } from "./lib/env";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

if (!isSupabaseConfigured()) {
  root.render(<ConfigError />);
} else {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}
