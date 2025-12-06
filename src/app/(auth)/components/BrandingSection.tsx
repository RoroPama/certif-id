"use client";

import { Shield, Landmark, CheckCircle2 } from "lucide-react";

export default function BrandingSection() {
  return (
    <div className="hidden lg:flex lg:w-[45%] bg-[#0B1120] relative flex-col justify-between p-16 text-white overflow-hidden border-r border-slate-800">
      {/* Fond texturé subtil */}
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>

      {/* Effet de lumière "Spotlight" */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* En-tête Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white text-[#0B1120] rounded flex items-center justify-center shadow-lg">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">
              CERTIF-GOUV
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium mt-1">
              République du Congo
            </p>
          </div>
        </div>
      </div>

      {/* Contenu Central */}
      <div className="relative z-10 max-w-md space-y-8">
        <h2 className="text-4xl font-serif font-medium leading-tight text-white/90">
          Portail National de Certification
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-amber-500 pl-6">
          Accès réservé aux officiers ministériels et administrateurs
          d'établissements agréés. Ce système assure la traçabilité et
          l'authenticité des titres académiques nationaux.
        </p>

        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Chiffrement de bout en bout</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Signature numérique eIDAS</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Archivage légal sécurisé</span>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className="relative z-10 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
        <Shield className="w-3 h-3" />
        <span>ID SERVEUR: GOUV-SECURE-01</span>
      </div>
    </div>
  );
}
