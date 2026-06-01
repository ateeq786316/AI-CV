import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold text-brand-700">
            AI CV Enhancer
          </Link>
          {user && (
            <nav className="flex items-center gap-4 text-sm">
              <Link to="/" className="text-slate-600 hover:text-brand-600">
                Dashboard
              </Link>
              <Link to="/generate" className="text-slate-600 hover:text-brand-600">
                New CV
              </Link>
              <Link to="/profile" className="text-slate-600 hover:text-brand-600">
                Master profile
              </Link>
              <Link to="/settings" className="text-slate-600 hover:text-brand-600">
                Settings
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100"
              >
                Sign out
              </button>
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
