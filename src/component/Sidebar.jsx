import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";

const NavItem = ({ icon, label, path, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
      transition-all duration-200 text-left group
      ${active
        ? "bg-[#6c8eff]/15 text-[#6c8eff] border border-[#6c8eff]/20"
        : "text-[#6b7390] hover:bg-[#1a1d2a] hover:text-[#a0a8c0]"}
    `}
  >
    <span className={`text-base w-5 text-center transition-transform duration-200 group-hover:scale-110 ${active ? "text-[#6c8eff]" : ""}`}>
      {icon}
    </span>
    {label}
    {badge > 0 && (
      <span className="ml-auto bg-[#6c8eff] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
        {badge > 9 ? "9+" : badge}
      </span>
    )}
    {active && !badge && (
      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6c8eff]" />
    )}
  </button>
);

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logout } = useContext(AuthContext);

  const [inviteCount, setInviteCount] = useState(0);

  const path = location.pathname;

  // Poll pending invitations count for badge
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await API.get("/invitations");
        setInviteCount(res.data?.length || 0);
      } catch {
        setInviteCount(0);
      }
    };
    fetchCount();
    // Refresh every 30s so badge stays up to date
    const interval = setInterval(fetchCount, 30_000);
    return () => clearInterval(interval);
  }, [location.pathname]); // also refresh when navigating

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-60 min-h-screen bg-[#0f1118] border-r border-[#1e2030] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#1e2030]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#6c8eff] flex items-center justify-center text-white font-bold text-sm"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            L
          </div>
          <span className="text-[#e8ecf8] font-bold text-base" style={{ fontFamily: "'Syne', sans-serif" }}>
            LeadPro
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 animate-slideRight">
        <p className="text-[10px] font-semibold text-[#3d4260] uppercase tracking-widest px-3 mb-2">
          Main
        </p>
        <NavItem icon="⬡" label="Dashboard"     active={path === "/dashboard"}     onClick={() => navigate("/dashboard")} />
        <NavItem icon="≡" label="My Lists"       active={path === "/lists/owned"}   onClick={() => navigate("/lists/owned")} />
        <NavItem icon="⊕" label="Shared With Me" active={path === "/lists/shared"}  onClick={() => navigate("/lists/shared")} />

        <p className="text-[10px] font-semibold text-[#3d4260] uppercase tracking-widest px-3 mb-2 mt-5">
          Team
        </p>
        <NavItem
          icon="✉"
          label="Invitations"
          active={path === "/invitations"}
          onClick={() => navigate("/invitations")}
          badge={inviteCount}
        />
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#1e2030]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-[#6b7390] hover:bg-[#f87171]/10 hover:text-[#f87171]
            transition-all duration-200"
        >
          <span className="text-base">↩</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}