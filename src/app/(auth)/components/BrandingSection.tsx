import { School, Shield, Award } from "lucide-react";

export default function BrandingSection() {
  return (
    <div className="lg:w-1/2 relative z-10 flex flex-col justify-between p-10 lg:p-20 lg:border-r border-slate-200/60 bg-white/40 backdrop-blur-sm-glass lg:bg-white">
      <div className="space-y-8">
        <div className="inline-flex items-center gap-4 border-b border-slate-200 pb-6 pr-12">
          <div className="w-14 h-14 bg-primary text-white flex items-center justify-center rounded-lg shadow-lg ring-4 ring-white">
            <School className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-primary leading-none">
              CERTIF-ID
            </h1>
            <div className="h-0.5 w-12 bg-accent my-1"></div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
              République du Congo
            </p>
          </div>
        </div>

        <div className="space-y-6 max-w-lg">
          <h2 className="text-4xl lg:text-5xl font-serif font-medium text-slate-900 leading-tight">
            Portail National de <br />
            <span className="italic text-primary-dark font-semibold relative inline-block">
              Certification
              <svg
                className="absolute w-full h-2 bottom-0 left-0 text-accent/30"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </span>
          </h2>
          <p className="text-slate-600 text-lg font-light leading-relaxed border-l-2 border-accent/50 pl-6">
            Accédez à la plateforme souveraine de gestion des titres académiques
            et de vérification des diplômes de l'Enseignement Supérieur.
          </p>
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-2 gap-8 mt-12">
        <div className="group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-50 rounded-md group-hover:bg-primary-lighter transition-smooth">
              <Shield className="w-5 h-5 text-primary-dark" />
            </div>
            <h3 className="font-serif font-semibold text-slate-900">
              Souveraineté
            </h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed pl-12 border-l border-slate-100">
            Infrastructure hébergée localement garantissant l'intégrité des
            données nationales.
          </p>
        </div>

        <div className="group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent-light rounded-md group-hover:bg-accent-100 transition-smooth">
              <Award className="w-5 h-5 text-accent-dark" />
            </div>
            <h3 className="font-serif font-semibold text-slate-900">
              Authentification
            </h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed pl-12 border-l border-slate-100">
            Vérification cryptographique instantanée de chaque diplôme émis.
          </p>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-4 text-xs text-slate-400 mt-12 font-medium tracking-wide uppercase">
        <span>
          © {new Date().getFullYear()} Ministère de l'Enseignement Supérieur
        </span>
        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
        <span>Tous droits réservés</span>
      </div>
    </div>
  );
}
