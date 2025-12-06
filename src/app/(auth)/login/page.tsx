import BrandingSection from "../components/BrandingSection";
import AuthFormWrapper from "../components/AuthFormWrapper";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex font-sans text-slate-900 bg-white overflow-hidden">
      {/* Colonne Gauche : Identité Institutionnelle (Sombre) */}
      <BrandingSection />

      {/* Colonne Droite : Espace de Connexion (Clair) */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 relative z-10">
        <AuthFormWrapper />

        {/* Footer Discret */}
        <div className="absolute bottom-6 text-center w-full">
          <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
            Système Certifié Conforme • v2.4.0
          </p>
        </div>
      </div>
    </div>
  );
}
