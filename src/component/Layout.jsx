import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto bg-[#0c0e14]">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
