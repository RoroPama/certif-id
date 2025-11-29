import BrandingSection from "../components/BrandingSection";
import AuthFormWrapper from "../components/AuthFormWrapper";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row relative font-sans text-slate-900 overflow-hidden">
      {/* --- BACKGROUND TYPE "PAPIER SÉCURISÉ" --- */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, #0f172a 10px), repeating-linear-gradient(#0f172a55, #0f172a55)`,
        }}
      ></div>

      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-50/50 blur-[120px] rounded-full pointer-events-none"></div>

      {/* --- COLONNE GAUCHE : PRÉSENTATION INSTITUTIONNELLE --- */}
      <BrandingSection />

      {/* --- COLONNE DROITE : LOGIN & OTP --- */}
      <AuthFormWrapper />
    </div>
  );
}
