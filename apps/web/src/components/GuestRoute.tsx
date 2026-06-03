import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "../routes";
import { Spinner } from "./ui/Spinner";

/** Login/signup only — signed-in users go to the app */
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner label="Loading…" />;
  if (user) return <Navigate to={ROUTES.dashboard} replace />;
  return <>{children}</>;
}
