import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import AuthLayout from "./AuthLayout";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  useDocumentTitle("Login");
  const navigate = useNavigate();
  const location = useLocation(); // holds the page the user came from
  const { login, isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Already logged in? Skip this page.
  if (isLoggedIn) {
    return <Navigate to={location.state?.from ?? "/"} replace />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /** Attempts login, then redirects back or to the right dashboard. */
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(formData.email, formData.password);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const from = location.state?.from;
    if (result.user.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate(from ?? "/", { replace: true });
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your account to continue shopping."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Demo credentials hint */}
        <div className="rounded-xl bg-neutral-100 px-4 py-3 text-xs leading-relaxed text-neutral-600">
          <strong className="text-neutral-900">Demo admin:</strong>{" "}
          admin@1shopnepal.com / admin123 — or register as a customer.
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-4 pl-11 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-11 pl-11 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-neutral-400 transition-colors hover:text-neutral-900"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <label htmlFor="remember" className="flex cursor-pointer items-center gap-2 text-sm text-neutral-600">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 rounded border-neutral-300 accent-neutral-950"
          />
          Remember me
        </label>

        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-900/30 focus-visible:outline-none"
        >
          Log in
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-neutral-950 underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
