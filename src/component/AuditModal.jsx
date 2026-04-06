import { Modal } from "./UI";

function formatDate(ts) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const ACTION_META = {
  CREATE: { color: "text-[#4ade80]",  bg: "bg-[#4ade80]/10 border-[#4ade80]/20",  label: "Created" },
  UPDATE: { color: "text-[#6c8eff]",  bg: "bg-[#6c8eff]/10 border-[#6c8eff]/20",  label: "Updated" },
  DELETE: { color: "text-[#f87171]",  bg: "bg-[#f87171]/10 border-[#f87171]/20",  label: "Deleted" },
};

export default function AuditModal({ logs, onClose }) {
  return (
    <Modal onClose={onClose} title="Audit Timeline">
      {logs.length === 0 ? (
        <p className="text-center text-[#6b7390] py-8 text-sm">No audit logs found.</p>
      ) : (
        <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1">
          {logs.map((l, i) => {
            const meta = ACTION_META[l.action] || ACTION_META.UPDATE;
            return (
              <div
                key={i}
                className="relative pl-4 border-l-2 border-[#6c8eff]/40 animate-fadeUp"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {/* Timeline dot */}
                <div className="absolute -left-1.5 top-3 w-2.5 h-2.5 rounded-full bg-[#6c8eff] ring-4 ring-[#13151e]" />

                <div className="bg-[#1a1d2a] border border-[#252836] rounded-xl p-3">
                  {/* Top row: field name + action badge */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-semibold text-[#e8ecf8] bg-[#252836] px-2 py-0.5 rounded-lg">
                      {l.field}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>

                  {/* Old → New values */}
                  <div className="flex items-center gap-2 text-xs flex-wrap mb-2">
                    <span className="text-[#f87171] line-through">{l.oldValue || "—"}</span>
                    <span className="text-[#4a5070]">→</span>
                    <span className="text-[#4ade80]">{l.newValue || "—"}</span>
                  </div>

                  {/* Footer: who + when */}
                  <div className="flex items-center justify-between flex-wrap gap-1 pt-1.5 border-t border-[#252836]">
                    {/* Changed by */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-[#6c8eff]/20 flex items-center justify-center text-[8px] text-[#6c8eff] font-bold">
                        {(l.changedByEmail || "?")[0].toUpperCase()}
                      </div>
                      <span className="text-[10px] text-[#6b7390]">
                        by{" "}
                        <span className="text-[#a0a8c0] font-medium">{l.changedByEmail || "Unknown"}</span>
                      </span>
                    </div>
                    {/* Timestamp */}
                    <p className="text-[10px] text-[#4a5070]">{formatDate(l.timestamp)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}