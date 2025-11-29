"use client";

import React from "react";
import { Plus, Trash2, History, AlertCircle } from "lucide-react";
import { useConfig } from "../hooks/useConfig";

export default function ConfigPageClient() {
  const {
    filieres,
    foundationYear,
    newFiliere,
    years,
    setNewFiliere,
    handleAddFiliere,
    handleDeleteFiliere,
    handleFoundationYearChange,
  } = useConfig();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-serif font-bold text-lg text-slate-900">
            Catalogue des Filières
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Ajoutez les filières et associez les diplômes correspondants.
          </p>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[500px] p-6 space-y-4">
          {filieres.map((f) => (
            <div
              key={f.id}
              className="group flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div>
                <p className="font-bold text-slate-800">{f.name}</p>
                <p className="text-xs text-blue-800 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
                  {f.diplomaName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteFiliere(f.id)}
                className="text-slate-300 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {filieres.length === 0 && (
            <p className="text-center text-slate-400 py-4">
              Aucune filière configurée.
            </p>
          )}
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
          <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wide">
            Nouvelle Filière
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nom de la filière (ex: Géographie)"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900/10 outline-none"
              value={newFiliere.name}
              onChange={(e) =>
                setNewFiliere({ ...newFiliere, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Intitulé du diplôme (ex: Licence en Géographie)"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900/10 outline-none"
              value={newFiliere.diplomaName}
              onChange={(e) =>
                setNewFiliere({
                  ...newFiliere,
                  diplomaName: e.target.value,
                })
              }
            />
            <button
              type="button"
              onClick={handleAddFiliere}
              className="w-full bg-blue-950 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-900 flex justify-center items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Ajouter au catalogue
            </button>
          </div>
        </div>
      </div>

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

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-h-[300px] overflow-hidden flex flex-col">
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

