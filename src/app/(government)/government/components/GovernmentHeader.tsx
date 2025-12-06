"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, ChevronRight, Slash, Command } from "lucide-react";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";

interface PageInfo {
  title: string;
  category: string;
}

const getPageInfo = (pathname: string): PageInfo => {
  if (pathname.includes("overview"))
    return { title: "Vue d'ensemble", category: "Pilotage" };
  if (pathname.includes("certifications"))
    return { title: "Certifications", category: "Opérations" };
  if (pathname.includes("registry"))
    return { title: "Registre National", category: "Archives" };
  if (pathname.includes("universities"))
    return { title: "Établissements", category: "Réseau" };
  if (pathname.includes("config"))
    return { title: "Configuration", category: "Système" };
  return { title: "Accueil", category: "Gouvernement" };
};

export default function GovernmentHeader() {
  const pathname = usePathname();
  const { title, category } = getPageInfo(pathname);

  return (
    <header className="fixed top-0 right-0 left-64 z-20 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex justify-between items-center px-8 transition-all duration-500">
      {/* Fil d'Ariane "Éditorial" */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase font-sans">
          <span>{category}</span>
          <Slash className="w-2.5 h-2.5 text-slate-300 -rotate-12" />
          <span className="text-slate-600">{title}</span>
        </div>
        <h1 className="text-xl font-serif font-medium text-slate-900 tracking-tight mt-0.5">
          {title}
        </h1>
      </div>

      {/* Zone Actions - Minimalisme Absolu */}
      <div className="flex items-center gap-6">
        {/* Barre de recherche "Spotlight" */}
        <div className="relative group w-64 focus-within:w-80 transition-all duration-300 ease-out hidden md:block">
          <div className="absolute inset-0 bg-slate-100/50 rounded-lg transition-all duration-300 group-focus-within:bg-white group-focus-within:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] group-focus-within:ring-1 group-focus-within:ring-slate-200"></div>
          <div className="relative flex items-center px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full bg-transparent border-none text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 ml-2 font-medium"
            />
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-white shadow-sm opacity-50 group-focus-within:opacity-100 transition-opacity">
              <Command className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500">K</span>
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-100"></div>

        {/* Notifications & User */}
        <div className="flex items-center gap-4">
          <button className="relative group p-2 rounded-full hover:bg-slate-50 transition-colors">
            <Bell className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white scale-0 group-hover:scale-100 transition-transform duration-200"></span>
          </button>

          <div className="flex items-center gap-3 pl-2 cursor-pointer group">
            <div className="text-right hidden xl:block">
              <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                Admin. National
              </p>
              <p className="text-[10px] text-slate-400 font-medium">Connecté</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-serif italic border-2 border-white shadow-md group-hover:shadow-lg transition-all">
              AN
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
