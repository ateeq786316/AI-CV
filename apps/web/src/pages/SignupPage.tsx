import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "../routes";

export function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { signedIn } = await signUp(email, password);
      if (signedIn) {
        navigate(ROUTES.onboarding, { replace: true });
        return;
      }
      setMessage("Account created. Check your email to confirm, then sign in.");
      setTimeout(() => navigate(ROUTES.login, { replace: true }), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Free to start. Upload your CV once, tailor it for every role."
      footer={
        <>
          Already registered?{" "}
          <Link to={ROUTES.login} className="font-semibold text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Card>
        <form onSubmit={onSubmit} className="space-y-5">
          {error && <Alert tone="error">{error}</Alert>}
          {message && <Alert tone="success">{message}</Alert>}
          <label className="label-text">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </label>
          <label className="label-text">
            Password
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </label>
          <p className="text-xs text-ink-faint">Minimum 8 characters</p>
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Create account
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
