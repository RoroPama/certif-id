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
  ChevronRight,
  Shield,
  LogOut,
} from "lucide-react";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";

interface SidebarItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
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
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]"></div>
    )}
    <Icon
      className={`w-5 h-5 transition-transform group-hover:scale-110 ${
        active
          ? "text-emerald-300"
          : "text-slate-500 group-hover:text-slate-300"
      }`}
    />
    <span className="tracking-wide font-serif">{label}</span>
    {active && (
      <ChevronRight className="w-4 h-4 ml-auto text-emerald-400 opacity-80" />
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
    // TODO: Implement logout logic
    window.location.href = "/login";
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-300 flex flex-col fixed h-full z-30 shadow-[4px_0_24px_rgba(0,0,0,0.3)] border-r border-white/5">
      {/* Branding */}
      <div className="p-6 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-serif tracking-tight">
              {government.branding.appName}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-bold">
              {government.branding.subtitle}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/30">
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white truncate">
              {government.branding.adminTitle}
            </p>
            <p className="text-[10px] text-emerald-400/70 font-medium">
              {government.branding.adminSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-6 py-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {government.sidebar.sections.supervision}
          </p>
        </div>
        <SidebarItem
          href={GOVERNMENT_ROUTES.OVERVIEW}
          icon={LayoutDashboard}
          label={government.sidebar.menu.overview}
          active={isActive(GOVERNMENT_ROUTES.OVERVIEW)}
        />
        <SidebarItem
          href={GOVERNMENT_ROUTES.CERTIFICATIONS}
          icon={FileCheck}
          label={government.sidebar.menu.certifications}
          active={isActive(GOVERNMENT_ROUTES.CERTIFICATIONS)}
        />
        <SidebarItem
          href={GOVERNMENT_ROUTES.REGISTRY}
          icon={Database}
          label={government.sidebar.menu.registry}
          active={isActive(GOVERNMENT_ROUTES.REGISTRY)}
        />

        <div className="px-6 py-3 pt-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {government.sidebar.sections.administration}
          </p>
        </div>
        <SidebarItem
          href={GOVERNMENT_ROUTES.UNIVERSITIES}
          icon={Building2}
          label={government.sidebar.menu.universities}
          active={isActive(GOVERNMENT_ROUTES.UNIVERSITIES)}
        />
        <SidebarItem
          href={GOVERNMENT_ROUTES.CONFIG}
          icon={Settings}
          label={government.sidebar.menu.config}
          active={isActive(GOVERNMENT_ROUTES.CONFIG)}
        />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-slate-900/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
        >
          <LogOut className="w-4 h-4 group-hover:text-rose-400 transition-colors" />
          <span className="font-medium">{MESSAGES.auth.logout.button}</span>
        </button>
      </div>
    </aside>
  );
}
