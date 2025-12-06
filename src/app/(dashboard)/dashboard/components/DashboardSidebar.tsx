"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FilePlus,
  Scroll,
  Settings,
  LogOut,
  ChevronRight,
  School,
  FileClock,
  ShieldCheck,
  PieChart,
} from "lucide-react";

interface SidebarItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}

const SidebarItem = ({ href, icon: Icon, label, active }: SidebarItemProps) => (
  <Link
    href={href}
    className={`group relative flex items-center justify-between px-3 py-2 mx-3 rounded-md text-[13px] font-medium transition-all duration-300 ${
      active
        ? "bg-slate-800/40 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] ring-1 ring-white/5"
        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon
        className={`w-4 h-4 transition-colors duration-300 ${
          active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400"
        }`}
      />
      <span className={`tracking-wide ${active ? "font-semibold" : ""}`}>
        {label}
      </span>
    </div>

    {/* Indicateur Actif Minimaliste */}
    {active && (
      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
    )}
  </Link>
);

export default function DashboardSidebar() {
  const pathname = usePathname();
  // À remplacer par les données réelles de l'utilisateur connecté
  const universityName = "Univ. Marien Ngouabi";

  const isActive = (href: string) => {
    if (href === "/dashboard/overview") {
      return pathname === "/dashboard/overview" || pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-[#0B1120] text-slate-300 flex flex-col fixed h-full z-30 border-r border-slate-800/60 shadow-2xl">
      {/* --- BRANDING ÉTABLISSEMENT --- */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/60 bg-[#0B1120]">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-b from-blue-900 to-slate-900 border border-slate-700/50 shadow-inner group">
            <School className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors" />
            {/* Petit point de statut */}
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0B1120] rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif font-bold text-white text-sm tracking-tight leading-none">
              CERTIF-ID
            </h1>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">
              Institution
            </span>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 py-8 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Groupe Pilotage */}
        <div>
          <div className="px-6 mb-3 flex items-center justify-between group cursor-default">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
              Pilotage
            </p>
            <div className="h-px w-8 bg-slate-800 group-hover:w-12 transition-all"></div>
          </div>
          <div className="space-y-1">
            <SidebarItem
              href="/dashboard/overview"
              icon={PieChart}
              label="Tableau de bord"
              active={isActive("/dashboard/overview")}
            />
            <SidebarItem
              href="/dashboard/requests"
              icon={FileClock}
              label="Suivi des demandes"
              active={isActive("/dashboard/requests")}
            />
            <SidebarItem
              href="/dashboard/registry"
              icon={Scroll}
              label="Registre des diplômes"
              active={isActive("/dashboard/registry")}
            />
          </div>
        </div>

        {/* Groupe Administration */}
        <div>
          <div className="px-6 mb-3 flex items-center justify-between group cursor-default">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
              Administration
            </p>
            <div className="h-px w-8 bg-slate-800 group-hover:w-12 transition-all"></div>
          </div>
          <div className="space-y-1">
            <SidebarItem
              href="/dashboard/new-request"
              icon={FilePlus}
              label="Émettre un diplôme"
              active={isActive("/dashboard/new-request")}
            />
            <SidebarItem
              href="/dashboard/config"
              icon={Settings}
              label="Paramètres"
              active={isActive("/dashboard/config")}
            />
            <SidebarItem
              href="/dashboard/institution"
              icon={Building2}
              label="Fiche institutionnelle"
              active={isActive("/dashboard/institution")}
            />
          </div>
        </div>
      </nav>

      {/* --- FOOTER COMPTE --- */}
      <div className="p-4 border-t border-slate-800/60 bg-[#0F172A]/50">
        <div className="rounded-lg bg-slate-900/50 border border-slate-800/50 p-3 mb-3 flex items-center justify-between group hover:border-slate-700/50 transition-colors cursor-default">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-slate-300 truncate group-hover:text-white transition-colors">
              {universityName}
            </span>
            <span className="text-[9px] text-slate-600 uppercase tracking-wide">
              Compte Certifié
            </span>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
        </div>

        <button className="group flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-rose-500/10 transition-all text-left">
          <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
          <span className="text-xs font-medium text-slate-400 group-hover:text-rose-300 transition-colors">
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  );
}
