"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Search, BellRing, ChevronRight } from "lucide-react";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";

const getPageInfo = (
  pathname: string
): { title: string; breadcrumb: string } => {
  const { government } = MESSAGES;
  const routes: Record<string, { title: string; breadcrumb: string }> = {
    [GOVERNMENT_ROUTES.OVERVIEW]: {
      title: government.pages.overview.title,
      breadcrumb: government.pages.overview.breadcrumb,
    },
    [GOVERNMENT_ROUTES.UNIVERSITIES]: {
      title: government.pages.universities.title,
      breadcrumb: government.pages.universities.breadcrumb,
    },
    [GOVERNMENT_ROUTES.CERTIFICATIONS]: {
      title: government.pages.certifications.title,
      breadcrumb: government.pages.certifications.breadcrumb,
    },
    [GOVERNMENT_ROUTES.REGISTRY]: {
      title: government.pages.registry.title,
      breadcrumb: government.pages.registry.breadcrumb,
    },
  };

  // Check for dynamic routes
  if (pathname.startsWith(GOVERNMENT_ROUTES.UNIVERSITIES + "/")) {
    return {
      title: government.pages.universities.detail.backToList,
      breadcrumb: government.pages.universities.breadcrumb,
    };
  }
  if (pathname.startsWith(GOVERNMENT_ROUTES.CERTIFICATIONS + "/")) {
    return {
      title: government.pages.certifications.detail.title,
      breadcrumb: government.pages.certifications.breadcrumb,
    };
  }
  if (pathname.startsWith(GOVERNMENT_ROUTES.REGISTRY + "/")) {
    return {
      title: government.pages.registry.detail.metadata,
      breadcrumb: government.pages.registry.breadcrumb,
    };
  }

  return (
    routes[pathname] || {
      title: government.pages.overview.title,
      breadcrumb: government.pages.overview.breadcrumb,
    }
  );
};

export default function GovernmentHeader() {
  const pathname = usePathname();
  const { title, breadcrumb } = getPageInfo(pathname);
  const { government } = MESSAGES;

  return (
    <header className="fixed top-0 right-0 left-72 z-20 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-4 flex justify-between items-center">
      <div className="flex flex-col">
        <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
          <span className="font-serif italic text-emerald-800">
            {government.header.breadcrumbPrefix}
          </span>
          <ChevronRight className="w-3 h-3 text-emerald-500" />
          <span className="text-slate-800 font-medium">{breadcrumb}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-700 transition-colors" />
          <input
            type="text"
            placeholder={government.header.searchPlaceholder}
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm w-96 transition-all placeholder:text-slate-400"
          />
        </div>
        <button className="relative p-2.5 text-slate-500 hover:bg-white hover:text-emerald-700 rounded-lg transition-all hover:shadow-md active:scale-95">
          <BellRing className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
}

