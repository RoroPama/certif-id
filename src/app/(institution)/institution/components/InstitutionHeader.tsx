"use client";

import React from "react";
import { Search, BellRing, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const getPageInfo = (
  pathname: string
): { title: string; breadcrumb: string } => {
  const routes: Record<string, { title: string; breadcrumb: string }> = {
    "/institution/overview": {
      title: "Vue d'ensemble",
      breadcrumb: "Tableau de bord",
    },
    "/institution/requests": {
      title: "Historique des Demandes",
      breadcrumb: "Suivi des demandes",
    },
    "/institution/registry": {
      title: "Registre Central",
      breadcrumb: "Registre des diplômes",
    },
    "/institution/new-request": {
      title: "Émission de Titres",
      breadcrumb: "Émettre un diplôme",
    },
    "/institution/institution": {
      title: "Fiche Institutionnelle",
      breadcrumb: "Fiche institutionnelle",
    },
    "/institution/config": {
      title: "Configuration Académique",
      breadcrumb: "Paramètres académiques",
    },
  };

  // Vérifier les routes dynamiques
  if (pathname.startsWith("/institution/requests/")) {
    return { title: "Détail de la Demande", breadcrumb: "Détail demande" };
  }
  if (pathname.startsWith("/institution/registry/")) {
    return { title: "Détail du Diplôme", breadcrumb: "Détail diplôme" };
  }

  return routes[pathname] || { title: "Institution", breadcrumb: "Institution" };
};

export default function InstitutionHeader() {
  const pathname = usePathname();
  const { title, breadcrumb } = getPageInfo(pathname);

  return (
    <header className="fixed top-0 right-0 left-72 z-20 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-4 flex justify-between items-center">
      {/* Titre et breadcrumb */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
          <span className="font-serif italic text-blue-900">
            Espace Université
          </span>
          <ChevronRight className="w-3 h-3 text-amber-500" />
          <span className="text-slate-800 font-medium">{breadcrumb}</span>
        </div>
      </div>

      {/* Recherche et notifications */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-900 transition-colors" />
          <input
            type="text"
            placeholder="Rechercher un diplôme, étudiant..."
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 shadow-sm w-96 transition-all placeholder:text-slate-400"
          />
        </div>
        <button className="relative p-2.5 text-slate-500 hover:bg-white hover:text-blue-900 rounded-lg transition-all hover:shadow-md active:scale-95">
          <BellRing className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
}
