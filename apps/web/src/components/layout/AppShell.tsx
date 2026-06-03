import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../routes";
import { Button } from "../ui/Button";

const nav = [
  { to: ROUTES.dashboard, label: "Home", end: true },
  { to: ROUTES.onboarding, label: "Add CV" },
  { to: ROUTES.generate, label: "Tailor CV" },
  { to: ROUTES.profile, label: "Master profile" },
  { to: ROUTES.settings, label: "Settings" },
];

function NavItem({ to, label, end }: { to: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-sidebar-hover text-sidebar-active"
            : "text-sidebar-text hover:bg-sidebar-hover hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="border-b border-sidebar-border px-5 py-6">
          <Link to={ROUTES.dashboard} className="block">
            <span className="font-display text-xl font-semibold text-white">CV Tailor</span>
            <span className="mt-1 block text-xs text-sidebar-text">
              Job-matched resumes
            </span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {nav.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <p className="truncate text-xs text-sidebar-text">{user?.email}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start text-sidebar-text hover:bg-sidebar-hover hover:text-white"
            onClick={async () => {
              await signOut();
              navigate(ROUTES.login);
            }}
          >
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-surface-sunken/80 bg-surface-raised/80 px-4 py-3 backdrop-blur-md lg:hidden">
          <Link to={ROUTES.dashboard} className="font-display text-lg font-semibold text-ink">
            CV Tailor
          </Link>
          <select
            className="rounded-lg border border-surface-sunken bg-surface px-2 py-1.5 text-sm"
            onChange={(e) => {
              if (e.target.value) navigate(e.target.value);
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Menu
            </option>
            {nav.map((n) => (
              <option key={n.to} value={n.to}>
                {n.label}
              </option>
            ))}
          </select>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
