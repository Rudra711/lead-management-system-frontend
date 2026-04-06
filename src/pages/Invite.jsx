import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { Input, Button, PageHeader, Badge } from "../component/UI";
import Layout from "../component/Layout";

const ROLES = {
  EDITOR: {
    label: "Editor",
    desc:  "Can add, edit, and view leads",
    icon:  "✏️",
    variant: "accent",
  },
  VIEWER: {
    label: "Viewer",
    desc:  "Can only view leads — no edits",
    icon:  "👁️",
    variant: "default",
  },
};

export default function Invite() {
  const { leadListId } = useParams();
  const navigate = useNavigate();

  const [listName, setListName] = useState("");
  const [email, setEmail]       = useState("");
  const [role, setRole]         = useState("EDITOR");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  // Fetch the lead list name to show in the header
  useEffect(() => {
    API.get(`/leadlists/${leadListId}`)
      .then(res => setListName(res.data?.name || ""))
      .catch(() => {});
  }, [leadListId]);

  const invite = async () => {
    if (!email.trim()) { setError("Please enter an email address."); return; }
    setError(""); setSuccess(false); setLoading(true);
    try {
      await API.post(`/leadlists/${leadListId}/invite`, {
        email: email.trim(),
        role,
      });
      setSuccess(true);
      setEmail("");
    } catch (e) {
      setError(e.response?.data?.message || "Invitation failed. Make sure the email is registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center gap-2 mb-1 animate-fadeUp">
        <button
          onClick={() => navigate(-1)}
          className="text-[#6b7390] hover:text-[#e8ecf8] text-sm transition-colors"
        >
          ← Back
        </button>
      </div>

      <PageHeader
        title="Invite Teammate"
        subtitle={listName ? `Sharing "${listName}" with a collaborator` : "Share this list with a collaborator"}
      />

      <div className="max-w-lg animate-fadeUp delay-1">
        <div className="bg-[#13151e] border border-[#252836] rounded-2xl p-6">

          {success && (
            <div className="bg-[#4ade80]/10 border border-[#4ade80]/20 text-[#4ade80]
              rounded-xl px-4 py-3 mb-5 text-sm">
              ✓ Invitation sent! They'll see it in their Invitations page and can accept or decline.
            </div>
          )}
          {error && (
            <div className="bg-[#f87171]/10 border border-[#f87171]/20 text-[#f87171]
              rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          {/* Info callout */}
          <div className="bg-[#1a1d2a] border border-[#252836] rounded-xl px-4 py-3 mb-5 text-xs text-[#6b7390]">
            💡 The person must have an account registered with this email. They'll receive a
            pending invitation and can accept or decline it.
          </div>

          <div className="space-y-5">
            <Input
              label="Registered Email Address"
              type="email"
              placeholder="teammate@company.com"
              icon="@"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); setSuccess(false); }}
              onKeyDown={e => e.key === "Enter" && invite()}
            />

            {/* Role picker */}
            <div>
              <label className="block text-xs font-medium text-[#6b7390] mb-2">
                Permission Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(ROLES).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setRole(key)}
                    className={`
                      text-left p-4 rounded-xl border transition-all duration-200
                      ${role === key
                        ? "border-[#6c8eff] bg-[#6c8eff]/10"
                        : "border-[#252836] bg-[#1a1d2a] hover:border-[#353849]"}
                    `}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span>{info.icon}</span>
                      <span className={`text-sm font-semibold ${role === key ? "text-[#6c8eff]" : "text-[#e8ecf8]"}`}>
                        {info.label}
                      </span>
                      {role === key && (
                        <span className="ml-auto w-4 h-4 rounded-full bg-[#6c8eff] flex items-center justify-center text-white text-[10px]">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-[#6b7390]">{info.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              className="flex-1 justify-center"
              onClick={invite}
              disabled={loading}
              size="lg"
            >
              {loading ? "Sending…" : "Send Invitation →"}
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}