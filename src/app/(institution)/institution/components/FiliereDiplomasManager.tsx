"use client";

import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { Filiere } from "../types";

interface FiliereDiplomasManagerProps {
  filieres: Filiere[];
  onAddFiliere: (name: string) => void;
  onAddDiploma: (filiereId: string, diplomaName: string) => void;
  onDeleteDiploma: (filiereId: string, diplomaId: string) => void;
  onDeleteFiliere: (filiereId: string) => void;
}

export default function FiliereDiplomasManager({
  filieres,
  onAddFiliere,
  onAddDiploma,
  onDeleteDiploma,
  onDeleteFiliere,
}: FiliereDiplomasManagerProps) {
  const [newFiliereName, setNewFiliereName] = useState("");
  const [expandedFiliereId, setExpandedFiliereId] = useState<string | null>(null);
  const [newDiplomaInputs, setNewDiplomaInputs] = useState<{
    [key: string]: string;
  }>({});

  const handleAddFiliere = () => {
    if (newFiliereName.trim()) {
      onAddFiliere(newFiliereName);
      setNewFiliereName("");
    }
  };

  const handleAddDiploma = (filiereId: string) => {
    const diplomaName = newDiplomaInputs[filiereId];
    if (diplomaName?.trim()) {
      onAddDiploma(filiereId, diplomaName);
      setNewDiplomaInputs({ ...newDiplomaInputs, [filiereId]: "" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Nouvelle Filière */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-serif font-bold text-base text-slate-900">
            Ajouter une nouvelle Filière
          </h3>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 block mb-2">
              Nom de la Filière
            </label>
            <input
              type="text"
              placeholder="Ex: Sciences Juridiques"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 transition-all"
              value={newFiliereName}
              onChange={(e) => setNewFiliereName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddFiliere()}
            />
          </div>
          <button
            type="button"
            onClick={handleAddFiliere}
            className="w-full bg-blue-950 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 text-amber-500" /> Créer la Filière
          </button>
        </div>
      </div>

      {/* Liste des Filières */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-serif font-bold text-base text-slate-900">
            Filières et Diplômes
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Expandez pour ajouter/supprimer
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

                  <button
                    type="button"
                    onClick={() => onDeleteFiliere(filiere.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Contenu déroulant */}
                {expandedFiliereId === filiere.id && (
                  <div className="px-4 pb-4 space-y-3 border-t border-slate-200 pt-3 bg-white">
                    {/* Diplômes existants */}
                    {filiere.diplomas.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                          Intitulés
                        </p>
                        <div className="space-y-1.5">
                          {filiere.diplomas.map((diploma) => (
                            <div
                              key={diploma.id}
                              className="flex items-center justify-between gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-6 h-6 rounded bg-blue-200 flex items-center justify-center flex-shrink-0">
                                  <span className="text-[10px] font-bold text-blue-900">D</span>
                                </div>
                                <p className="text-xs font-medium text-slate-900 truncate">
                                  {diploma.name}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  onDeleteDiploma(filiere.id, diploma.id)
                                }
                                className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-all flex-shrink-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ajout d'un nouveau diplôme */}
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                        Ajouter
                      </p>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Nouveau diplôme"
                          className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
                          value={newDiplomaInputs[filiere.id] || ""}
                          onChange={(e) =>
                            setNewDiplomaInputs({
                              ...newDiplomaInputs,
                              [filiere.id]: e.target.value,
                            })
                          }
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            handleAddDiploma(filiere.id)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => handleAddDiploma(filiere.id)}
                          className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-all flex items-center gap-1 flex-shrink-0"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
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
