import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "../component/Layout";
import InvitationsSidebar from "../component/InvitationsSidebar";
import { Button } from "../component/UI";

const DashCard = ({ icon, title, description, action, onClick, delay = "" }) => (
  <button
    onClick={onClick}
    className={`
      group text-left w-full bg-[#13151e] border border-[#252836]
      hover:border-[#353849] hover:bg-[#161924]
      rounded-2xl p-6 transition-all duration-200 animate-fadeUp ${delay}
    `}
  >
    <div className="w-11 h-11 rounded-xl bg-[#1a1d2a] border border-[#252836]
      group-hover:border-[#6c8eff]/30 group-hover:bg-[#6c8eff]/10
      flex items-center justify-center text-xl mb-4 transition-all duration-200">
      {icon}
    </div>
    <h3 className="text-[#e8ecf8] font-semibold text-base mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
      {title}
    </h3>
    <p className="text-[#6b7390] text-sm leading-relaxed mb-4">{description}</p>
    <span className="text-xs font-medium text-[#6c8eff] group-hover:underline">
      {action} →
    </span>
  </button>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 animate-fadeUp">
        <p className="text-[#6b7390] text-sm mb-1">Good to see you back 👋</p>
        <h1 className="text-3xl font-bold text-[#e8ecf8]" style={{ fontFamily: "'Syne', sans-serif" }}>
          Dashboard
        </h1>
      </div>

      {/* Pending invites banner */}
      <InvitationsSidebar />

      {/* Quick actions */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-[#3d4260] uppercase tracking-widest mb-4">Quick Actions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <DashCard
          icon="+"
          title="New Lead List"
          description="Create a fresh list to organize and track a new set of leads."
          action="Create"
          onClick={() => navigate("/create")}
          delay="delay-1"
        />
        <DashCard
          icon="≡"
          title="My Lists"
          description="View and manage all the lead lists you've created."
          action="View lists"
          onClick={() => navigate("/lists/owned")}
          delay="delay-2"
        />
        <DashCard
          icon="⊕"
          title="Shared With Me"
          description="Access lead lists that teammates have shared with you."
          action="Browse"
          onClick={() => navigate("/lists/shared")}
          delay="delay-3"
        />
      </div>

      {/* Tips */}
      <div className="bg-[#6c8eff]/5 border border-[#6c8eff]/15 rounded-2xl p-5 animate-fadeUp delay-4">
        <p className="text-xs font-semibold text-[#6c8eff] uppercase tracking-widest mb-3">Getting Started</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { step: "1", text: "Create a lead list to start organizing contacts" },
            { step: "2", text: "Add leads manually with name, phone, and status" },
            { step: "3", text: "Invite teammates with Editor or Viewer roles" },
            { step: "4", text: "Filter by status and track changes via audit logs" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#6c8eff]/20 text-[#6c8eff] text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                {step}
              </span>
              <p className="text-[#6b7390] text-sm">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
