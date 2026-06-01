import { StrictMode, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ConfigError } from "./components/ConfigError";
import { loadPublicConfig } from "./lib/loadConfig";
import { initSupabase } from "./lib/supabase";

export function AppBootstrap() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPublicConfig()
      .then((config) => {
        initSupabase(config);
        setReady(true);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Configuration failed");
      });
  }, []);

  if (error) {
    return <ConfigError message={error} />;
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}
