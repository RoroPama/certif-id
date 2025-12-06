"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck,
  Building2,
  Database,
  Settings,
  LogOut,
  Landmark,
  ShieldCheck,
  ChevronRight,
  PieChart,
} from "lucide-react";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";

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

export default function GovernmentSidebar() {
  const pathname = usePathname();
  const { government } = MESSAGES;

  const isActive = (href: string) => {
    if (href === GOVERNMENT_ROUTES.OVERVIEW) {
      return (
        pathname === GOVERNMENT_ROUTES.OVERVIEW ||
        pathname === GOVERNMENT_ROUTES.ROOT
      );
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-[#0B1120] text-slate-300 flex flex-col fixed h-full z-30 border-r border-slate-800/60 shadow-2xl">
      {/* --- BRANDING INSTITUTIONNEL --- */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/60 bg-[#0B1120]">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 shadow-inner">
            <Landmark className="w-5 h-5 text-slate-200" />
            {/* Petit point de statut */}
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0B1120] rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif font-bold text-white text-sm tracking-tight leading-none">
              CERTIF-GOUV
            </h1>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">
              République
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
              href={GOVERNMENT_ROUTES.OVERVIEW}
              icon={PieChart}
              label="Vue d'ensemble"
              active={isActive(GOVERNMENT_ROUTES.OVERVIEW)}
            />
            <SidebarItem
              href={GOVERNMENT_ROUTES.CERTIFICATIONS}
              icon={FileCheck}
              label="Certifications"
              active={isActive(GOVERNMENT_ROUTES.CERTIFICATIONS)}
            />
            <SidebarItem
              href={GOVERNMENT_ROUTES.REGISTRY}
              icon={Database}
              label="Registre National"
              active={isActive(GOVERNMENT_ROUTES.REGISTRY)}
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
              href={GOVERNMENT_ROUTES.UNIVERSITIES}
              icon={Building2}
              label="Établissements"
              active={isActive(GOVERNMENT_ROUTES.UNIVERSITIES)}
            />
            <SidebarItem
              href={GOVERNMENT_ROUTES.CONFIG}
              icon={Settings}
              label="Paramètres"
              active={isActive(GOVERNMENT_ROUTES.CONFIG)}
            />
          </div>
        </div>
      </nav>

      {/* --- FOOTER SÉCURISÉ --- */}
      <div className="p-4 border-t border-slate-800/60 bg-[#0F172A]/50">
        <div className="rounded-lg bg-slate-900/50 border border-slate-800/50 p-3 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Système Sécurisé
            </span>
          </div>
          <p className="text-[10px] text-slate-600 leading-tight">
            Connexion chiffrée de bout en bout. ID:{" "}
            <span className="font-mono text-slate-500">CG-8842</span>
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-rose-500/10 transition-all text-left"
        >
          <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
          <span className="text-xs font-medium text-slate-400 group-hover:text-rose-300 transition-colors">
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  );
}
