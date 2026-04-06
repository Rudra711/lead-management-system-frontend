import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { Input, Button, PageHeader } from "../component/UI";
import Layout from "../component/Layout";

export default function CreateLeadList() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const create = async () => {
    if (!name.trim()) { setError("Please enter a name for the list."); return; }
    setLoading(true);
    setError("");
    try {
      await API.post("/leadlists", { name: name.trim() });
      navigate("/lists/owned");
    } catch (e) {
      setError(e.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="New Lead List"
        subtitle="Create a list to organize and track a group of leads"
      />

      <div className="max-w-lg animate-fadeUp delay-1">
        <div className="bg-[#13151e] border border-[#252836] rounded-2xl p-6">
          <div className="mb-6">
            <Input
              label="List Name"
              placeholder="e.g. Q3 Prospects, Cold Outreach..."
              icon="="
              onChange={e => { setName(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && create()}
              autoFocus
            />
            {error && (
              <p className="text-[#f87171] text-xs mt-2">{error}</p>
            )}
          </div>

          {/* Tips */}
          <div className="bg-[#1a1d2a] border border-[#252836] rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-[#6b7390] uppercase tracking-widest mb-2">Tips</p>
            <ul className="space-y-1.5">
              {[
                "Use descriptive names like Q3 Enterprise Leads",
                "You can invite teammates as Editors or Viewers later",
                "All changes are logged in the audit trail",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#6b7390]">
                  <span className="text-[#6c8eff] mt-0.5">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 justify-center"
              onClick={create}
              disabled={loading}
              size="lg"
            >
              {loading ? "Creating..." : "Create List"}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}