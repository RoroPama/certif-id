import GovernmentSidebar from "./components/GovernmentSidebar";
import GovernmentHeader from "./components/GovernmentHeader";

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
      <GovernmentSidebar />
      <main className="flex-1 ml-72 relative">
        {/* Fond décoratif subtil */}
        <div className="fixed inset-0 ml-72 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/30 rounded-full blur-[100px] -ml-32 -mb-32"></div>
        </div>
        
        <GovernmentHeader />
        
        <div className="pt-24 pb-8 px-8 relative z-10">{children}</div>
        
        {/* Footer discret */}
        <div className="fixed bottom-0 right-0 left-72 py-2 px-8 text-xs text-slate-400 flex justify-between items-center backdrop-blur-sm border-t border-slate-100 bg-white/50">
          <span>© 2024 CERTIF-GOUV · Ministère Ens. Sup. Congo</span>
          <span>v1.0.0-beta</span>
        </div>
      </main>
    </div>
  );
}

