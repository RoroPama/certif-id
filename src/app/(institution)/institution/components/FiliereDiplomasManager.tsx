"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Filiere } from "../types";

interface FiliereDiplomasManagerProps {
  filieres: Filiere[];
}

export default function FiliereDiplomasManager({
  filieres,
}: FiliereDiplomasManagerProps) {
  const [expandedFiliereId, setExpandedFiliereId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Liste des Filières */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-serif font-bold text-base text-slate-900">
            Filières et Diplômes
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Configuration gérée par le ministère
          </p>
        </div>

        <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
          {filieres.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">
              <p>Aucune filière configurée</p>
            </div>
          ) : (
            filieres.map((filiere) => (
              <div key={filiere.id} className="bg-slate-50/50 hover:bg-slate-50 transition-colors">
                {/* En-tête Filière */}
                <div className="p-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedFiliereId(
                        expandedFiliereId === filiere.id ? null : filiere.id
                      )
                    }
                    className="flex-1 flex items-center gap-3 text-left group"
                  >
                    <div
                      className={`transition-transform flex-shrink-0 ${
                        expandedFiliereId === filiere.id ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                        {filiere.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {filiere.diplomas.length} diplôme{filiere.diplomas.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </button>
                </div>

                {/* Contenu déroulant */}
                {expandedFiliereId === filiere.id && (
                  <div className="px-4 pb-4 space-y-3 border-t border-slate-200 pt-3 bg-white">
                    {/* Diplômes existants */}
                    {filiere.diplomas.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                          Intitulés
                        </p>
                        <div className="space-y-1.5">
                          {filiere.diplomas.map((diploma) => (
                            <div
                              key={diploma.id}
                              className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100"
                            >
                              <div className="w-6 h-6 rounded bg-blue-200 flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] font-bold text-blue-900">D</span>
                              </div>
                              <p className="text-xs font-medium text-slate-900 truncate">
                                {diploma.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-2">
                        Aucun diplôme configuré
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
