import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { GuestRoute } from "./components/GuestRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { GeneratePage } from "./pages/GeneratePage";
import { PreviewPage } from "./pages/PreviewPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ROUTES, ROUTE_REDIRECTS, routeSegment } from "./routes";

export default function App() {
  return (
    <Routes>
      {/* Public marketing homepage — first URL visitors see */}
      <Route path={ROUTES.home} element={<LandingPage />} />

      <Route
        path={ROUTES.login}
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path={ROUTES.signup}
        element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        }
      />

      {Object.entries(ROUTE_REDIRECTS).map(([from, to]) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}

      {/* Authenticated app */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path={routeSegment(ROUTES.dashboard)} element={<DashboardPage />} />
        <Route path={routeSegment(ROUTES.onboarding)} element={<OnboardingPage />} />
        <Route path={routeSegment(ROUTES.profile)} element={<ProfilePage />} />
        <Route path={routeSegment(ROUTES.generate)} element={<GeneratePage />} />
        <Route path="preview/:id" element={<PreviewPage />} />
        <Route path={routeSegment(ROUTES.settings)} element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  );
}
