import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function InvitationsSidebar() {
  const [invites, setInvites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/invitations").then(r => setInvites(r.data)).catch(() => {});
  }, []);

  if (invites.length === 0) return null;

  return (
    <div className="mb-6 animate-fadeUp delay-4">
      <div className="bg-[#6c8eff]/10 border border-[#6c8eff]/20 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#6c8eff] uppercase tracking-widest">
            Pending Invites
          </span>
          <span className="bg-[#6c8eff] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {invites.length}
          </span>
        </div>
        <div className="space-y-2">
          {invites.slice(0, 3).map(i => (
            <div key={i.id} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6c8eff] shrink-0" />
              <span className="text-sm text-[#a0a8c0] truncate">{i.leadListName}</span>
            </div>
          ))}
        </div>
        <button
          className="mt-3 text-xs text-[#6c8eff] hover:text-[#839fff] font-medium transition-colors duration-150"
          onClick={() => navigate("/invitations")}
        >
          View all invitations →
        </button>
      </div>
    </div>
  );
}
