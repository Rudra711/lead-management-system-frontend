// ─────────────────────────────────────────────
//  UI.jsx — LeadPro Design System
// ─────────────────────────────────────────────

export const Button = ({ children, onClick, variant = "primary", size = "md", className = "", disabled = false }) => {
  const variants = {
    primary:   "bg-[#6c8eff] hover:bg-[#839fff] text-white shadow-[0_0_20px_rgba(108,142,255,0.25)]",
    secondary: "bg-[#1a1d2a] hover:bg-[#252836] text-[#a0a8c0] border border-[#252836] hover:border-[#353849]",
    danger:    "bg-[#f87171]/10 hover:bg-[#f87171]/20 text-[#f87171] border border-[#f87171]/20",
    ghost:     "bg-transparent hover:bg-[#1a1d2a] text-[#a0a8c0]",
    success:   "bg-[#4ade80]/10 hover:bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/20",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-5 py-2.5 text-sm rounded-xl",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-1.5 font-medium
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = "", hover = false }) => (
  <div className={`
    bg-[#13151e] border border-[#252836] rounded-2xl
    ${hover ? "hover:border-[#353849] hover:bg-[#161924] transition-all duration-200 cursor-pointer" : ""}
    ${className}
  `}>
    {children}
  </div>
);

export const Input = ({ label, icon, className = "", ...props }) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-xs font-medium text-[#6b7390] mb-1.5">{label}</label>}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5070] text-sm">{icon}</span>
      )}
      <input
        {...props}
        className={`
          w-full bg-[#1a1d2a] border border-[#252836] text-[#e8ecf8]
          placeholder:text-[#4a5070] rounded-xl transition-all duration-200
          focus:outline-none focus:border-[#6c8eff] focus:bg-[#1d2035]
          focus:ring-2 focus:ring-[#6c8eff]/15
          ${icon ? "pl-9 pr-4 py-2.5" : "px-4 py-2.5"}
          text-sm
        `}
      />
    </div>
  </div>
);

export const Select = ({ label, className = "", children, ...props }) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-xs font-medium text-[#6b7390] mb-1.5">{label}</label>}
    <select
      {...props}
      className={`
        w-full bg-[#1a1d2a] border border-[#252836] text-[#e8ecf8]
        rounded-xl px-4 py-2.5 text-sm transition-all duration-200
        focus:outline-none focus:border-[#6c8eff] focus:ring-2 focus:ring-[#6c8eff]/15
        cursor-pointer appearance-none
      `}
    >
      {children}
    </select>
  </div>
);

export const Modal = ({ children, onClose, title, wide = false }) => (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className={`bg-[#13151e] border border-[#252836] w-full rounded-2xl shadow-2xl animate-scaleIn ${wide ? "max-w-xl" : "max-w-md"}`}>
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#252836]">
          <h3 className="text-base font-semibold text-[#e8ecf8]" style={{ fontFamily: "'Syne', sans-serif" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#252836] text-[#6b7390] hover:text-[#e8ecf8] transition-all duration-150"
          >
            ✕
          </button>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export const Empty = ({ text = "Nothing here yet", icon = "○" }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-[#1a1d2a] border border-[#252836] flex items-center justify-center text-2xl mb-4">
      {icon}
    </div>
    <p className="text-[#6b7390] text-sm">{text}</p>
  </div>
);

export const Badge = ({ children, variant = "default" }) => {
  const v = {
    default:    "bg-[#252836] text-[#a0a8c0]",
    success:    "bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20",
    warning:    "bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20",
    danger:     "bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20",
    accent:     "bg-[#6c8eff]/10 text-[#6c8eff] border border-[#6c8eff]/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${v[variant]}`}>
      {children}
    </span>
  );
};

export const Divider = () => <div className="border-t border-[#252836] my-4" />;

export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex items-start justify-between mb-8 animate-fadeUp">
    <div>
      <h1 className="text-2xl font-bold text-[#e8ecf8]" style={{ fontFamily: "'Syne', sans-serif" }}>
        {title}
      </h1>
      {subtitle && <p className="text-[#6b7390] text-sm mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);