"use client";

import React from "react";
import { History, AlertCircle } from "lucide-react";
import { useConfig } from "../hooks/useConfig";
import FiliereDiplomasManager from "../components/FiliereDiplomasManager";

export default function ConfigPageClient() {
  const {
    filieres,
    foundationYear,
    years,
    handleAddFiliere,
    handleAddDiploma,
    handleDeleteDiploma,
    handleDeleteFiliere,
    handleFoundationYearChange,
  } = useConfig();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Colonne gauche : Filières et Diplômes */}
      <div className="space-y-6">
        <FiliereDiplomasManager
          filieres={filieres}
          onAddFiliere={handleAddFiliere}
          onAddDiploma={handleAddDiploma}
          onDeleteDiploma={handleDeleteDiploma}
          onDeleteFiliere={handleDeleteFiliere}
        />
      </div>

      {/* Colonne droite : Historique Académique */}
      <div className="space-y-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Historique Académique
              </h3>
              <p className="text-sm text-slate-500">
                Définissez la profondeur de l'historique disponible.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">
              Année de la première promotion
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-900/10 outline-none"
                value={foundationYear}
                onChange={(e) =>
                  handleFoundationYearChange(Number(e.target.value))
                }
              />
              <div className="px-6 py-3 bg-slate-100 rounded-lg text-slate-500 text-sm flex items-center font-medium">
                à {new Date().getFullYear()}
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              Cette action mettra à jour automatiquement toutes les listes de
              sélection d'années dans l'application.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-h-[400px] overflow-hidden flex flex-col">
          <h3 className="font-bold text-slate-800 text-sm mb-4">
            Aperçu des années actives ({years.length})
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {years.map((y) => (
              <div
                key={y.id}
                className={`flex justify-between items-center p-2 rounded text-sm ${
                  y.isCurrent
                    ? "bg-green-50 text-green-700 font-bold border border-green-200"
                    : "bg-slate-50 text-slate-600 border border-slate-100"
                }`}
              >
                <span>{y.label}</span>
                {y.isCurrent && (
                  <span className="text-[10px] uppercase tracking-wider">
                    En cours
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

