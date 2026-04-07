import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "../component/UI";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await API.post("/auth/register", { email, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0c0e14] p-8">
      <div className="w-full max-w-sm animate-fadeUp">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-[#6c8eff] flex items-center justify-center text-white font-bold text-sm"
            style={{ fontFamily: "'Syne', sans-serif" }}>L</div>
          <span className="text-[#e8ecf8] font-bold text-base" style={{ fontFamily: "'Syne', sans-serif" }}>LeadPro</span>
        </div>

        <h1 className="text-2xl font-bold text-[#e8ecf8] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
          Create account
        </h1>
        <p className="text-[#6b7390] text-sm mb-8">Start managing your leads today</p>

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
          />
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            icon="🔒"
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <Button
          className="w-full mt-6 justify-center py-3"
          onClick={handleSignup}
          disabled={loading}
          size="lg"
        >
          {loading ? "Creating account… pls wait 2-3 minutes, pls wait as hosting on free deployer" : "Create Account →"}
        </Button>

        <p className="text-center text-sm text-[#6b7390] mt-6">
          Already have an account?{" "}
          <span
            className="text-[#6c8eff] hover:text-[#839fff] cursor-pointer font-medium transition-colors"
            onClick={() => navigate("/")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
