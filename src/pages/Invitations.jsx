import { useEffect, useState } from "react";
import API from "../api/api";
import { Button, Empty, PageHeader, Badge } from "../component/UI";
import Layout from "../component/Layout";

const ROLE_META = {
  EDITOR: { variant: "accent",   label: "Editor" },
  VIEWER: { variant: "default",  label: "Viewer" },
};

function InvitationCard({ inv, onAccept, onDecline, processing }) {
  const meta = ROLE_META[inv.role] || { variant: "default", label: inv.role };
  const busy = !!processing;

  return (
    <div className="bg-[#13151e] border border-[#252836] hover:border-[#353849]
      rounded-2xl px-5 py-4 flex items-center justify-between gap-4
      transition-all duration-200 animate-fadeUp">

      {/* Left */}
      <div className="flex items-center gap-4 min-w-0">
        {/* List icon */}
        <div className="w-11 h-11 rounded-xl bg-[#6c8eff]/10 border border-[#6c8eff]/20
          flex items-center justify-center text-[#6c8eff] font-bold text-base shrink-0"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          {(inv.leadListName || "?")[0].toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="text-[#e8ecf8] font-semibold text-sm truncate">
            {inv.leadListName}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[#6b7390] text-xs">
              From{" "}
              <span className="text-[#a0a8c0] font-medium">{inv.invitedByEmail}</span>
            </span>
            <Badge variant={meta.variant}>{meta.label}</Badge>
          </div>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="success"
          size="sm"
          disabled={busy}
          onClick={onAccept}
        >
          {processing === "accept" ? "…" : "✓ Accept"}
        </Button>
        <Button
          variant="danger"
          size="sm"
          disabled={busy}
          onClick={onDecline}
        >
          {processing === "decline" ? "…" : "✕ Decline"}
        </Button>
      </div>
    </div>
  );
}

export default function Invitations() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [processing, setProcessing]   = useState({}); // { [id]: "accept" | "decline" }
  const [toast, setToast]             = useState(null); // { msg, type }

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/invitations");
      setInvitations(res.data);
    } catch (e) {
      console.error("Failed to load invitations:", e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const respond = async (id, action) => {
    setProcessing(p => ({ ...p, [id]: action }));
    try {
      await API.post(`/invitations/${id}/${action}`);
      // Remove from list immediately
      setInvitations(prev => prev.filter(i => i.id !== id));
      showToast(
        action === "accept"
          ? "✓ Invitation accepted — list is now in Shared With Me"
          : "Invitation declined",
        action === "accept" ? "success" : "warning"
      );
    } catch (e) {
      showToast(e.response?.data?.message || "Something went wrong", "error");
    } finally {
      setProcessing(p => { const n = { ...p }; delete n[id]; return n; });
    }
  };

  return (
    <Layout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl
          border animate-fadeIn transition-all
          ${toast.type === "success" ? "bg-[#4ade80]/10 border-[#4ade80]/30 text-[#4ade80]"
          : toast.type === "warning" ? "bg-[#fbbf24]/10 border-[#fbbf24]/30 text-[#fbbf24]"
          : "bg-[#f87171]/10 border-[#f87171]/30 text-[#f87171]"}`}>
          {toast.msg}
        </div>
      )}

      <PageHeader
        title="Invitations"
        subtitle="Pending invitations from teammates to collaborate on lead lists"
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-[#13151e] border border-[#252836] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : invitations.length === 0 ? (
        <Empty
          icon="✉"
          text="No pending invitations — you're all caught up!"
        />
      ) : (
        <div className="space-y-3">
          {invitations.map((inv, i) => (
            <div key={inv.id} style={{ animationDelay: `${i * 0.06}s` }}>
              <InvitationCard
                inv={inv}
                processing={processing[inv.id]}
                onAccept={() => respond(inv.id, "accept")}
                onDecline={() => respond(inv.id, "decline")}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && invitations.length > 0 && (
        <p className="text-xs text-[#4a5070] text-center mt-6">
          {invitations.length} pending invitation{invitations.length !== 1 ? "s" : ""}
        </p>
      )}
    </Layout>
  );
}