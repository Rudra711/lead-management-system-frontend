import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { Button, Input, Select, Modal, Empty, PageHeader, Badge } from "../component/UI";
import AuditModal from "../component/AuditModal";
import Layout from "../component/Layout";

const STATUS_VARIANTS = {
  NEW:       { label: "New",       variant: "accent" },
  CONTACTED: { label: "Contacted", variant: "warning" },
  QUALIFIED: { label: "Qualified", variant: "success" },
  CLOSED:    { label: "Closed",    variant: "default" },
  REJECTED:  { label: "Rejected",  variant: "danger" },
};

const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"];

// ── Reusable field row inside modals ──────────────────────────────
function FieldRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[#6b7390]">{label}</label>
      {children}
    </div>
  );
}

// ── Read-only value display ───────────────────────────────────────
function ReadValue({ value, mono = false }) {
  return (
    <p className={`text-sm text-[#e8ecf8] bg-[#1a1d2a] border border-[#252836] rounded-xl px-4 py-2.5 ${mono ? "font-mono" : ""}`}>
      {value || <span className="text-[#4a5070]">—</span>}
    </p>
  );
}

// ── Lead Detail / Edit Modal ──────────────────────────────────────
function LeadModal({ lead, role, onSave, onDelete, onAudit, onClose }) {
  const isViewer = role === "VIEWER";
  const isOwner  = role === "OWNER";
  const canEdit  = role === "OWNER" || role === "EDITOR";

  const [data, setData]       = useState({ ...lead });
  const [loading, setLoading] = useState(false);
  const [tab, setTab]         = useState("basic"); // "basic" | "extra"

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setLoading(true);
    try { await onSave(data); } finally { setLoading(false); }
  };

  const tabCls = (t) =>
    `px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer ${
      tab === t
        ? "bg-[#6c8eff] text-white shadow-[0_0_12px_rgba(108,142,255,0.3)]"
        : "text-[#6b7390] hover:text-[#a0a8c0] hover:bg-[#1a1d2a]"
    }`;

  return (
    <Modal
      onClose={onClose}
      title={isViewer ? "Lead Details" : "Edit Lead"}
      wide
    >
      {/* Role pill */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant={isOwner ? "success" : isViewer ? "default" : "accent"}>{role}</Badge>
        {isViewer && (
          <span className="text-xs text-[#6b7390]">View only — no edit access</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button className={tabCls("basic")}  onClick={() => setTab("basic")}>Basic Info</button>
        <button className={tabCls("extra")}  onClick={() => setTab("extra")}>Extra Details</button>
      </div>

      {/* ── BASIC TAB ── */}
      {tab === "basic" && (
        <div className="space-y-3">
          {isViewer ? (
            <>
              <FieldRow label="Full Name"><ReadValue value={data.name} /></FieldRow>
              <FieldRow label="Phone"><ReadValue value={data.phone} mono /></FieldRow>
              <FieldRow label="Email"><ReadValue value={data.email} /></FieldRow>
              <FieldRow label="Status">
                <ReadValue value={data.status} />
              </FieldRow>
              <FieldRow label="In Need">
                <ReadValue value={data.inNeed ? "Yes ✓" : "No"} />
              </FieldRow>
            </>
          ) : (
            <>
              <Input
                label="Full Name *"
                value={data.name || ""}
                placeholder="Jane Doe"
                onChange={e => set("name", e.target.value)}
              />
              <Input
                label="Phone"
                value={data.phone || ""}
                placeholder="+91 98244 50126"
                onChange={e => set("phone", e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={data.email || ""}
                placeholder="jane@example.com"
                onChange={e => set("email", e.target.value)}
              />
              <Select
                label="Status"
                value={data.status || "NEW"}
                onChange={e => set("status", e.target.value)}
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
              </Select>
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="inNeed-edit"
                  checked={!!data.inNeed}
                  onChange={e => set("inNeed", e.target.checked)}
                  className="w-4 h-4 accent-[#6c8eff] rounded cursor-pointer"
                />
                <label htmlFor="inNeed-edit" className="text-sm text-[#a0a8c0] cursor-pointer select-none">
                  Mark as <span className="text-[#4ade80] font-medium">In Need</span>
                </label>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── EXTRA TAB ── */}
      {tab === "extra" && (
        <div className="space-y-3">
          {isViewer ? (
            <>
              <FieldRow label="Address"><ReadValue value={data.address} /></FieldRow>
              <FieldRow label="Date of Birth"><ReadValue value={data.dob} /></FieldRow>
              <FieldRow label="Gender"><ReadValue value={data.gender} /></FieldRow>
              <FieldRow label="Annual Income">
                <ReadValue value={data.annualIncome != null ? `₹ ${Number(data.annualIncome).toLocaleString()}` : null} mono />
              </FieldRow>
            </>
          ) : (
            <>
              <Input
                label="Address"
                value={data.address || ""}
                placeholder="123 Main St, City"
                onChange={e => set("address", e.target.value)}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={data.dob || ""}
                onChange={e => set("dob", e.target.value)}
              />
              <Select
                label="Gender"
                value={data.gender || ""}
                onChange={e => set("gender", e.target.value || null)}
              >
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map(g => (
                  <option key={g} value={g}>{g.charAt(0) + g.slice(1).toLowerCase()}</option>
                ))}
              </Select>
              <Input
                label="Annual Income (₹)"
                type="number"
                value={data.annualIncome ?? ""}
                placeholder="500000"
                onChange={e => set("annualIncome", e.target.value ? Number(e.target.value) : null)}
              />
            </>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-6 flex-wrap border-t border-[#252836] pt-5">
        {canEdit && (
          <Button className="flex-1 justify-center" onClick={handleSave} disabled={loading}>
            {loading ? "Saving…" : "Save Changes"}
          </Button>
        )}

        {/* ── AUDIT LOG — only visible to OWNER ── */}
        {isOwner && (
          <Button
            variant="ghost"
            size="md"
            onClick={() => onAudit(lead.id)}
            className="border border-[#252836]"
          >
            📋 Audit Log
          </Button>
        )}

        {isOwner && (
          <Button variant="danger" size="md" onClick={() => onDelete(lead.id)}>
            Delete
          </Button>
        )}

        <Button variant="secondary" onClick={onClose}>
          {isViewer ? "Close" : "Cancel"}
        </Button>
      </div>
    </Modal>
  );
}

// ── Add Lead Modal ────────────────────────────────────────────────
function AddLeadModal({ onSave, onClose }) {
  const empty = {
    name: "", phone: "", email: "", address: "",
    dob: "", gender: "", annualIncome: "",
    status: "NEW", inNeed: false,
  };
  const [data, setData]   = useState(empty);
  const [loading, setL]   = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab]     = useState("basic");

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  const handle = async () => {
    if (!data.name.trim()) { setError("Name is required."); return; }
    setL(true); setError("");
    try {
      const payload = {
        ...data,
        dob:          data.dob          || null,
        gender:       data.gender        || null,
        annualIncome: data.annualIncome !== "" ? Number(data.annualIncome) : null,
      };
      await onSave(payload);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to add lead.");
    } finally {
      setL(false);
    }
  };

  const tabCls = (t) =>
    `px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer ${
      tab === t
        ? "bg-[#6c8eff] text-white shadow-[0_0_12px_rgba(108,142,255,0.3)]"
        : "text-[#6b7390] hover:text-[#a0a8c0] hover:bg-[#1a1d2a]"
    }`;

  return (
    <Modal onClose={onClose} title="Add New Lead" wide>
      {error && (
        <div className="bg-[#f87171]/10 border border-[#f87171]/20 text-[#f87171] text-xs rounded-xl px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button className={tabCls("basic")} onClick={() => setTab("basic")}>Basic Info</button>
        <button className={tabCls("extra")} onClick={() => setTab("extra")}>Extra Details</button>
      </div>

      {/* ── BASIC TAB ── */}
      {tab === "basic" && (
        <div className="space-y-3">
          <Input
            label="Full Name *"
            placeholder="Jane Doe"
            autoFocus
            value={data.name}
            onChange={e => set("name", e.target.value)}
          />
          <Input
            label="Phone"
            placeholder="+91 98244 50126"
            value={data.phone}
            onChange={e => set("phone", e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane@example.com"
            value={data.email}
            onChange={e => set("email", e.target.value)}
          />
          <Select label="Status" value={data.status} onChange={e => set("status", e.target.value)}>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </Select>
          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="inNeed-add"
              checked={data.inNeed}
              onChange={e => set("inNeed", e.target.checked)}
              className="w-4 h-4 accent-[#6c8eff] rounded cursor-pointer"
            />
            <label htmlFor="inNeed-add" className="text-sm text-[#a0a8c0] cursor-pointer select-none">
              Mark as <span className="text-[#4ade80] font-medium">In Need</span>
            </label>
          </div>
        </div>
      )}

      {/* ── EXTRA TAB ── */}
      {tab === "extra" && (
        <div className="space-y-3">
          <Input
            label="Address"
            placeholder="123 Main St, City"
            value={data.address}
            onChange={e => set("address", e.target.value)}
          />
          <Input
            label="Date of Birth"
            type="date"
            value={data.dob}
            onChange={e => set("dob", e.target.value)}
          />
          <Select label="Gender" value={data.gender} onChange={e => set("gender", e.target.value)}>
            <option value="">Select gender</option>
            {GENDER_OPTIONS.map(g => (
              <option key={g} value={g}>{g.charAt(0) + g.slice(1).toLowerCase()}</option>
            ))}
          </Select>
          <Input
            label="Annual Income (₹)"
            type="number"
            placeholder="500000"
            value={data.annualIncome}
            onChange={e => set("annualIncome", e.target.value)}
          />
        </div>
      )}

      <div className="flex gap-2 mt-6 border-t border-[#252836] pt-5">
        <Button className="flex-1 justify-center" onClick={handle} disabled={loading}>
          {loading ? "Adding…" : "Add Lead"}
        </Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function Leads() {
  const { leadListId } = useParams();
  const navigate       = useNavigate();

  const [leads, setLeads]               = useState([]);
  const [role, setRole]                 = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAdd, setShowAdd]           = useState(false);
  const [auditLogs, setAuditLogs]       = useState(null);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [status, setStatus]             = useState("");
  const [inNeed, setInNeed]             = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const [roleRes, leadsRes] = await Promise.all([
          API.get(`/leadlists/${leadListId}/role`),
          API.get(`/leadlists/${leadListId}/leads`),
        ]);
        setRole(roleRes.data.role);
        setLeads(leadsRes.data);
      } catch (e) {
        console.error("Failed to load:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [leadListId]);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (inNeed) params.inNeed = inNeed;
      const res = await API.get(`/leadlists/${leadListId}/leads`, { params });
      setLeads(res.data);
    } catch (e) {
      console.error("Failed to load leads:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    await API.put(`/leadlists/${leadListId}/leads/${data.id}`, data);
    setSelectedLead(null);
    load();
  };

  const handleAdd = async (data) => {
    await API.post(`/leadlists/${leadListId}/leads`, data);
    setShowAdd(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead? This cannot be undone.")) return;
    await API.delete(`/leadlists/${leadListId}/leads/${id}`);
    setSelectedLead(null);
    load();
  };

  const openAudit = async (id) => {
    try {
      const res = await API.get(`/leads/${id}/audit`);
      setAuditLogs(res.data);
      setSelectedLead(null);
    } catch (e) {
      console.error("Failed to load audit:", e);
    }
  };

  const initials = (name) =>
    (name || "?").split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

  const avatarColor = (name) => {
    const colors = ["#6c8eff", "#4ade80", "#f87171", "#fbbf24", "#c084fc", "#22d3ee"];
    return colors[(name || "").charCodeAt(0) % colors.length];
  };

  const canEdit = role === "OWNER" || role === "EDITOR";

  return (
    <Layout>
      {/* Back */}
      <div className="mb-1 animate-fadeUp">
        <button
          onClick={() => navigate(-1)}
          className="text-[#6b7390] hover:text-[#e8ecf8] text-sm transition-colors"
        >
          ← Back
        </button>
      </div>

      <PageHeader
        title="Leads"
        subtitle={`${leads.length} contact${leads.length !== 1 ? "s" : ""}${role ? ` · ${role}` : ""}`}
        actions={canEdit && (
          <Button onClick={() => setShowAdd(true)}>+ Add Lead</Button>
        )}
      />

      {/* Filters */}
      <div className="bg-[#13151e] border border-[#252836] rounded-2xl p-4 mb-5 animate-fadeUp delay-1">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <Input
              placeholder="Search by name, phone or email…"
              icon="🔍"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && load()}
            />
          </div>
          <div className="w-40">
            <Select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="CLOSED">Closed</option>
              <option value="REJECTED">Rejected</option>
            </Select>
          </div>
          <div className="w-36">
            <Select value={inNeed} onChange={e => setInNeed(e.target.value)}>
              <option value="">Any Need</option>
              <option value="true">In Need</option>
              <option value="false">Not In Need</option>
            </Select>
          </div>
          <Button onClick={load} variant="secondary">Apply</Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-14 bg-[#13151e] border border-[#252836] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <Empty
          icon="👤"
          text={canEdit ? "No leads yet — click '+ Add Lead' to get started" : "No leads in this list yet"}
        />
      ) : (
        <div className="bg-[#13151e] border border-[#252836] rounded-2xl overflow-hidden animate-fadeUp delay-2">
          {/* Column headers */}
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#252836]">
            {["Contact", "Phone", "Status", "In Need", ""].map((h, i) => (
              <p key={i} className="text-[10px] font-semibold text-[#3d4260] uppercase tracking-widest">{h}</p>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#1e2030]">
            {leads.map((l, i) => {
              const statusInfo = STATUS_VARIANTS[l.status] || { label: l.status, variant: "default" };
              return (
                <div
                  key={l.id}
                  onClick={() => setSelectedLead(l)}
                  className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center
                    hover:bg-[#161924] cursor-pointer transition-colors duration-150 animate-fadeUp"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: avatarColor(l.name) + "33", color: avatarColor(l.name) }}
                    >
                      {initials(l.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#e8ecf8] text-sm font-medium truncate">{l.name}</p>
                      {l.email && (
                        <p className="text-[#4a5070] text-xs truncate">{l.email}</p>
                      )}
                    </div>
                  </div>

                  <span className="text-[#6b7390] text-sm font-mono">{l.phone || "—"}</span>

                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>

                  <span className={`text-xs font-medium ${l.inNeed ? "text-[#4ade80]" : "text-[#6b7390]"}`}>
                    {l.inNeed ? "✓ Yes" : "No"}
                  </span>

                  <button
                    onClick={e => { e.stopPropagation(); setSelectedLead(l); }}
                    className="text-[#6b7390] hover:text-[#6c8eff] text-xs transition-colors px-2 py-1 rounded-lg hover:bg-[#6c8eff]/10 whitespace-nowrap"
                  >
                    {canEdit ? "Edit" : "View"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lead detail / edit modal */}
      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          role={role}
          onSave={handleSave}
          onDelete={handleDelete}
          onAudit={openAudit}
          onClose={() => setSelectedLead(null)}
        />
      )}

      {/* Add Lead modal */}
      {showAdd && (
        <AddLeadModal onSave={handleAdd} onClose={() => setShowAdd(false)} />
      )}

      {/* Audit timeline */}
      {auditLogs && (
        <AuditModal logs={auditLogs} onClose={() => setAuditLogs(null)} />
      )}
    </Layout>
  );
}