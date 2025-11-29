import BrandingSection from "../components/BrandingSection";
import AuthFormWrapper from "../components/AuthFormWrapper";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row relative font-sans text-slate-900 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-secure-paper"></div>

      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-lighter/50 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-light/50 blur-[120px] rounded-full pointer-events-none"></div>

      <BrandingSection />

      <AuthFormWrapper />
    </div>
  );
}
