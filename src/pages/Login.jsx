import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "../component/UI";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handle = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.token);
      navigate("/dashboard");
    } catch (e) {
      setError(e.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handle(); };

  return (
    <div className="min-h-screen w-full flex bg-[#0c0e14]">
      {/* Left — decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0f1118] border-r border-[#1e2030] p-12 relative overflow-hidden">
        {/* Background orb */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#6c8eff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-80 h-80 bg-[#4ade80]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-[#6c8eff] flex items-center justify-center text-white font-bold text-lg"
            style={{ fontFamily: "'Syne', sans-serif" }}>L</div>
          <span className="text-[#e8ecf8] font-bold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>LeadPro</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 animate-fadeUp">
          <h2 className="text-4xl font-bold text-[#e8ecf8] leading-tight mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Manage your leads<br />
            <span className="text-[#6c8eff]">with precision.</span>
          </h2>
          <p className="text-[#6b7390] text-sm leading-relaxed max-w-sm">
            Organize, track, and collaborate on your leads with your team.
            Role-based access, audit logs, and smart filtering — all in one place.
          </p>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-2 relative z-10">
          {["Role-based Access", "Audit Logs", "Team Collaboration", "Smart Filters"].map(f => (
            <span key={f} className="text-xs bg-[#1a1d2a] border border-[#252836] text-[#6b7390] px-3 py-1.5 rounded-xl">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fadeUp">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-[#6c8eff] flex items-center justify-center text-white font-bold text-sm">L</div>
            <span className="text-[#e8ecf8] font-bold text-base" style={{ fontFamily: "'Syne', sans-serif" }}>LeadPro</span>
          </div>

          <h1 className="text-2xl font-bold text-[#e8ecf8] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
            Welcome back
          </h1>
          <p className="text-[#6b7390] text-sm mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="bg-[#f87171]/10 border border-[#f87171]/20 text-[#f87171] text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon="@"
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon="🔒"
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <Button
            className="w-full mt-6 justify-center py-3"
            onClick={handle}
            disabled={loading}
            size="lg"
          >
            {loading ? "Signing and Starting server… please wait 2–3 minutes" : "Sign In →"}
          </Button>

          <p className="text-center text-sm text-[#6b7390] mt-6">
            Don't have an account?{" "}
            <span
              className="text-[#6c8eff] hover:text-[#839fff] cursor-pointer font-medium transition-colors"
              onClick={() => navigate("/register")}
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
