import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "./ui/Spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner label="Checking session…" />;
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
