"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  Building2,
  Users,
  AlertTriangle,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  GraduationCap,
} from "lucide-react";
import { StatCard, SearchableSelect } from "@/components/shared";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import { useOverview } from "../hooks";

export default function OverviewPageClient() {
  const {
    stats,
    filters,
    universities,
    years,
    filieres,
    handleFilterChange,
    resetFilters,
  } = useOverview();
  const { government } = MESSAGES;

  const universityOptions = universities.map((u) => ({
    value: u.id,
    label: u.name,
  }));

  const yearOptions = years.map((y) => ({ value: y, label: y }));
  const filiereOptions = filieres.map((f) => ({ value: f.id, label: f.name }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title={government.stats.certifiedDiplomas}
          value={stats.totalDiplomas.toLocaleString()}
          trend={`${stats.publicCount} Public / ${stats.privateCount} Privé`}
          color="blue"
          icon={Award}
          showTrendIcon={false}
        />
        <StatCard
          title={government.stats.activeUniversities}
          value={stats.activeUniversities}
          trend={`${stats.publicCount} Publics`}
          color="emerald"
          icon={Building2}
          showTrendIcon={false}
        />
        <StatCard
          title={government.stats.pendingStudents}
          value={stats.pendingRequests}
          trend={MESSAGES.status.inProgress}
          color="amber"
          icon={Users}
        />
        <StatCard
          title={government.stats.rejectionRate}
          value={stats.rejectionRate}
          trend={MESSAGES.common.rejections}
          color="rose"
          icon={AlertTriangle}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Activity Chart */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {government.pages.overview.charts.activityTitle}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {government.pages.overview.charts.activityDescription}
                </p>
              </div>
              <Link
                href={GOVERNMENT_ROUTES.REGISTRY}
                className="text-sm text-emerald-700 font-medium hover:underline flex items-center gap-1"
              >
                {MESSAGES.common.viewAll || "Tout voir"}{" "}
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {stats.chartData.length > 0 ? (
              <div className="flex items-end justify-around h-64 px-4">
                {stats.chartData.map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className="w-16 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all hover:from-emerald-500 hover:to-emerald-300 relative group cursor-default shadow-lg"
                      style={{ height: `${item.heightPercent}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.count} {government.pages.overview.charts.diplomas}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-600">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <GraduationCap className="w-12 h-12 opacity-30 mb-2" />
                <p className="text-sm">{government.pages.overview.charts.noData}</p>
              </div>
            )}
          </div>

          {/* Top Filieres */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-serif font-bold text-lg text-slate-900 mb-6">
              {government.pages.overview.charts.topFilieresTitle}
            </h3>
            {stats.topFilieres.length > 0 ? (
              <div className="space-y-4">
                {stats.topFilieres.map((filiere, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-800">
                          {filiere.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {filiere.count} ({filiere.percent}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${filiere.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                <p className="text-sm">{government.pages.overview.charts.noData}</p>
              </div>
            )}
          </div>
        </div>

        {/* Filters Sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-28">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {government.pages.overview.filtersTitle}
              </h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              {government.pages.overview.filtersDescription}
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  {government.pages.universities.title}
                </label>
                <SearchableSelect
                  options={universityOptions}
                  value={filters.universityId}
                  onChange={(val) => handleFilterChange("universityId", val)}
                  placeholder={government.pages.overview.placeholders.allUniversities}
                  icon={Building2}
                  allOptionLabel={government.pages.overview.placeholders.allUniversities}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Type
                </label>
                <SearchableSelect
                  options={[
                    { value: "PUBLIC", label: government.pages.universities.filters.public },
                    { value: "PRIVE", label: government.pages.universities.filters.private },
                  ]}
                  value={filters.type}
                  onChange={(val) => handleFilterChange("type", val)}
                  placeholder={government.pages.overview.placeholders.allTypes}
                  allOptionLabel={government.pages.overview.placeholders.allTypes}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Année
                </label>
                <SearchableSelect
                  options={yearOptions}
                  value={filters.year}
                  onChange={(val) => handleFilterChange("year", val)}
                  placeholder={government.pages.overview.placeholders.allYears}
                  allOptionLabel={government.pages.overview.placeholders.allYears}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Filière
                </label>
                <SearchableSelect
                  options={filiereOptions}
                  value={filters.filiereId}
                  onChange={(val) => handleFilterChange("filiereId", val)}
                  placeholder={government.pages.overview.placeholders.allFilieres}
                  allOptionLabel={government.pages.overview.placeholders.allFilieres}
                />
              </div>

              <button
                onClick={resetFilters}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                {government.pages.overview.resetFilters}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

