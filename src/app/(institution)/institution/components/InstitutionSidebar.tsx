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
  Award,
  FileClock,
} from "lucide-react";
import { INSTITUTION_ROUTES, APP_CONFIG } from "@/lib/utils/constants";
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
    className={`group w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all duration-300 relative ${
      active
        ? "text-white bg-white/10"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`}
  >
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]"></div>
    )}
    <Icon
      className={`w-5 h-5 transition-transform group-hover:scale-110 ${
        active ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"
      }`}
    />
    <span className="tracking-wide font-serif">{label}</span>
    {active && (
      <ChevronRight className="w-4 h-4 ml-auto text-amber-500 opacity-80" />
    )}
  </Link>
);

export default function InstitutionSidebar() {
  const pathname = usePathname();
  const universityName = "Université Marien Ngouabi"; // TODO: Get from user context

  const { sidebar, pages } = MESSAGES.institution;

  const isActive = (href: string) => {
    if (href === INSTITUTION_ROUTES.OVERVIEW) {
      return pathname === INSTITUTION_ROUTES.OVERVIEW || pathname === INSTITUTION_ROUTES.ROOT;
    }
    return pathname.startsWith(href);
  };

  // Configuration du menu
  const pilotageMenu = [
    {
      href: INSTITUTION_ROUTES.OVERVIEW,
      icon: LayoutDashboard,
      label: sidebar.menu.overview,
    },
    {
      href: INSTITUTION_ROUTES.REQUESTS,
      icon: FileClock,
      label: sidebar.menu.requests,
    },
    {
      href: INSTITUTION_ROUTES.REGISTRY,
      icon: Scroll,
      label: sidebar.menu.registry,
    },
  ];

  const administrationMenu = [
    {
      href: INSTITUTION_ROUTES.NEW_REQUEST,
      icon: FilePlus,
      label: sidebar.menu.newRequest,
    },
    {
      href: INSTITUTION_ROUTES.CONFIG,
      icon: Settings,
      label: sidebar.menu.config,
    },
    {
      href: INSTITUTION_ROUTES.INSTITUTION_PROFILE,
      icon: Building2,
      label: sidebar.menu.institutionProfile,
    },
  ];

  return (
    <aside className="w-72 bg-blue-950 text-slate-300 flex flex-col fixed h-full z-30 shadow-[4px_0_24px_rgba(0,0,0,0.2)] border-r border-white/5">
      <div className="p-8 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-blue-950 rounded-lg flex items-center justify-center shadow-lg ring-2 ring-amber-500/50">
              <School className="w-6 h-6" />
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <Award className="w-8 h-8 text-amber-500 opacity-80" />
          </div>
          <div className="mt-2">
            <h1 className="font-serif font-bold text-white text-xl tracking-tight leading-none">
              {APP_CONFIG.NAME}
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold mt-1.5 border-t border-white/10 pt-1.5 inline-block">
              {APP_CONFIG.COUNTRY}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {/* Section Pilotage */}
        <div className="px-6 py-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {sidebar.sections.pilotage}
          </p>
        </div>
        {pilotageMenu.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href)}
          />
        ))}

        {/* Section Administration */}
        <div className="px-6 py-3 mt-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {sidebar.sections.administration}
          </p>
        </div>
        {administrationMenu.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href)}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 bg-blue-950/50">
        <div className="flex items-center gap-3 mb-3 bg-blue-900/30 p-2 rounded-lg border border-white/5">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            UM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-serif font-medium text-white truncate">
              {universityName}
            </p>
            <p className="text-[10px] text-amber-400/80 truncate">
              {sidebar.accountStatus}
            </p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 text-xs text-rose-300 hover:text-white hover:bg-rose-900/30 transition-colors w-full py-2 rounded border border-transparent hover:border-rose-900/50">
          <LogOut className="w-3.5 h-3.5" />
          {MESSAGES.auth.logout.button}
        </button>
      </div>
    </aside>
  );
}
