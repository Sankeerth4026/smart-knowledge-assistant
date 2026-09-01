import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../apis/authApi";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, Loader2, Eye, EyeOff, Terminal } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(formData);
      login(data.access_token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 selection:bg-accent">
      <div className="noise-texture" />

      {/* Main card chassis */}
      <div className="chassis-panel w-full max-w-sm p-8 sm:p-10">
        {/* Corner Bolts */}
        <div className="absolute top-3 left-3"><div className="screw-head" /></div>
        <div className="absolute top-3 right-3"><div className="screw-head" /></div>
        <div className="absolute bottom-3 left-3"><div className="screw-head" /></div>
        <div className="absolute bottom-3 right-3"><div className="screw-head" /></div>

        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center justify-center w-10 h-10 border border-border-dark rounded bg-recessed mb-4 shadow-[inset_2px_2px_4px_var(--color-shadow-dark)]">
            <Terminal size={16} className="text-accent" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-text-primary mb-1 font-mono uppercase">
            Sign In
          </h1>
          <p className="telemetry-label">
            Sign in to your account
          </p>
        </div>

        {/* Error Message recessed panel */}
        {error && (
          <div className="flex items-start gap-2.5 mb-6 rounded bg-red-950/15 border border-red-500/20 px-4 py-3 text-xs text-red-700">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span className="font-mono">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="telemetry-label block">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="name@example.com"
              className="chassis-input w-full px-4 py-3 text-xs"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="telemetry-label block">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="chassis-input w-full px-4 py-3 pr-10 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit (Safety Orange Key) */}
          <button
            type="submit"
            disabled={loading}
            className="chassis-btn chassis-btn-active w-full py-3 mt-6 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                <span>Signing In…</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Registry Switch */}
        <p className="mt-8 text-center text-xs text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-text-primary hover:text-accent font-bold underline underline-offset-4 transition-colors"
          >
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;