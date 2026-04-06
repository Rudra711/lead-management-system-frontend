import { useEffect, useState } from "react";
import API from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Empty, PageHeader, Badge } from "../component/UI";
import Layout from "../component/Layout";

const ROLE_META = {
  EDITOR: { variant: "accent",   label: "Editor" },
  VIEWER: { variant: "default",  label: "Viewer" },
  OWNER:  { variant: "success",  label: "Owner" },
};

// Fetch the user's role for a given list (for shared lists)
async function fetchRole(leadListId) {
  try {
    const res = await API.get(`/leadlists/${leadListId}/role`);
    return res.data.role;
  } catch {
    return null;
  }
}

export default function LeadLists() {
  const { type }    = useParams();
  const navigate    = useNavigate();
  const isOwned     = type === "owned";

  const [lists, setLists]         = useState([]);
  const [roles, setRoles]         = useState({}); // { [listId]: role }
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState(null);

  useEffect(() => { load(); }, [type]);

  const load = async () => {
    setLoading(true);
    try {
      const res  = await API.get("/leadlists");
      const data = res.data || {};
      const fetched = isOwned ? (data.owned || []) : (data.shared || []);
      setLists(fetched);

      // For shared lists, fetch each list's role in parallel
      if (!isOwned && fetched.length > 0) {
        const roleEntries = await Promise.all(
          fetched.map(async l => [l.id, await fetchRole(l.id)])
        );
        setRoles(Object.fromEntries(roleEntries));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, listId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this lead list? All leads inside will also be deleted.")) return;
    setDeleting(listId);
    try {
      await API.delete(`/leadlists/${listId}`);
      setLists(prev => prev.filter(l => l.id !== listId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete list.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Layout>
      <PageHeader
        title={isOwned ? "My Lead Lists" : "Shared With Me"}
        subtitle={isOwned
          ? "Lead lists you've created and own"
          : "Lists teammates have shared with you — accepted invitations appear here"}
        actions={isOwned && (
          <Button onClick={() => navigate("/create")} size="md">
            + New List
          </Button>
        )}
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-[#13151e] border border-[#252836] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : lists.length === 0 ? (
        <Empty
          icon={isOwned ? "≡" : "⊕"}
          text={isOwned
            ? "No lists yet — create your first lead list"
            : "No shared lists — accept an invitation from the Invitations page"}
        />
      ) : (
        <div className="space-y-3">
          {lists.map((l, i) => {
            const role    = isOwned ? "OWNER" : roles[l.id];
            const roleMeta = ROLE_META[role] || null;

            return (
              <div
                key={l.id}
                className="group bg-[#13151e] border border-[#252836] hover:border-[#353849]
                  rounded-2xl px-5 py-4 flex items-center justify-between
                  transition-all duration-200 animate-fadeUp cursor-pointer"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => navigate(`/leads/${l.id}`)}
              >
                {/* Left */}
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl bg-[#1a1d2a] border border-[#252836]
                      group-hover:border-[#6c8eff]/30 group-hover:bg-[#6c8eff]/10
                      flex items-center justify-center text-sm font-bold text-[#6c8eff]
                      transition-all duration-200 shrink-0"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {l.name?.[0]?.toUpperCase() || "L"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#e8ecf8] font-semibold text-sm truncate">{l.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {roleMeta ? (
                        <Badge variant={roleMeta.variant}>{roleMeta.label}</Badge>
                      ) : (
                        <span className="text-[#4a5070] text-xs">Loading…</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right — actions */}
                <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                  {isOwned && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/invite/${l.id}`)}
                      >
                        👥 Invite
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={deleting === l.id}
                        onClick={(e) => handleDelete(e, l.id)}
                      >
                        {deleting === l.id ? "…" : "Delete"}
                      </Button>
                    </>
                  )}
                  <Button size="sm" onClick={() => navigate(`/leads/${l.id}`)}>
                    Open →
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}