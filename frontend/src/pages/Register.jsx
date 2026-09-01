import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../apis/authApi";
import { AlertCircle, Loader2, Eye, EyeOff, Shield, Terminal } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = useMemo(() => {
    const len = formData.password.length;
    if (len === 0) return { label: "EMPTY", level: 0, ledClass: "" };
    if (len < 6) return { label: "WEAK", level: 1, ledClass: "led-red-active" };
    if (len < 8) return { label: "MEDIUM", level: 2, ledClass: "led-amber-active" };
    return { label: "SECURE", level: 3, ledClass: "led-green-active" };
  }, [formData.password]);

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
            Create Account
          </h1>
          <p className="telemetry-label">
            Create a new account to get started
          </p>
        </div>

        {/* Error message recessed panel */}
        {error && (
          <div className="flex items-start gap-2.5 mb-6 rounded bg-red-950/15 border border-red-500/20 px-4 py-3 text-xs text-red-700">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span className="font-mono">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="telemetry-label block">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="chassis-input w-full px-4 py-3 text-xs"
            />
          </div>

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
              placeholder="name@example.com"
              required
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
                placeholder="••••••••"
                required
                className="chassis-input w-full px-4 py-3 pr-10 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Tactile LED Password Strength Indicator */}
            {formData.password.length > 0 && (
              <div className="well-recessed p-3 mt-2 flex items-center justify-between animate-fade-in border border-border-dark/30">
                <div className="flex items-center gap-1.5">
                  <Shield size={12} className="text-text-secondary" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
                    Strength: {passwordStrength.label}
                  </span>
                </div>
                <div className="flex gap-1.5 items-center">
                  {/* Red Light */}
                  <span className={`led-lamp ${passwordStrength.level >= 1 ? (passwordStrength.level === 1 ? 'led-red-active animate-pulse' : 'led-red-active') : ''}`} />
                  {/* Yellow Light */}
                  <span className={`led-lamp ${passwordStrength.level >= 2 ? (passwordStrength.level === 2 ? 'led-amber-active animate-pulse' : 'led-amber-active') : ''}`} />
                  {/* Green Light */}
                  <span className={`led-lamp ${passwordStrength.level >= 3 ? 'led-green-active animate-pulse' : ''}`} />
                </div>
              </div>
            )}
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
                <span>Registering…</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Redirect */}
        <p className="text-center text-xs text-text-secondary mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-text-primary hover:text-accent font-bold underline underline-offset-4 transition-colors"
          >
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;