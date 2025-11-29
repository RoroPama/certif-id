/**
 * Layout partagé pour toutes les pages du dashboard
 * Server Component - enveloppe toutes les routes avec Sidebar et Header
 */

import DashboardSidebar from "./components/DashboardSidebar";
import DashboardHeader from "./components/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
      <DashboardSidebar />

      <main className="flex-1 ml-72 relative">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, #0f172a 10px), repeating-linear-gradient(#0f172a55, #0f172a55)`,
          }}
        ></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none"></div>

        <DashboardHeader />

        <div className="pt-20 p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}

