"use client";

import React from "react";
import { Building2, Save, AlertCircle } from "lucide-react";
import { useInstitution } from "../hooks/useInstitution";

export default function InstitutionPageClient() {
  const {
    universityName,
    institutionData,
    handleUpdateInstitution,
    handleFieldChange,
  } = useInstitution();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
        <div className="w-16 h-16 bg-blue-950 rounded-xl flex items-center justify-center text-white shadow-lg">
          <Building2 className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-2xl text-slate-900">
            Fiche Institutionnelle
          </h3>
          <p className="text-slate-500">
            Gérez les informations officielles de votre établissement.
          </p>
        </div>
      </div>
      <form onSubmit={handleUpdateInstitution} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Nom Officiel
            </label>
            <input
              type="text"
              value={universityName}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 text-slate-500 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Certifié par l'État
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Recteur / Directeur
            </label>
            <input
              type="text"
              value={institutionData.rector}
              onChange={(e) => handleFieldChange("rector", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-900/10 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Email de contact
            </label>
            <input
              type="email"
              value={institutionData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-900/10 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Adresse Postale
            </label>
            <input
              type="text"
              value={institutionData.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-900/10 outline-none"
            />
          </div>
        </div>
        <div className="pt-6 flex justify-end border-t border-slate-100">
          <button
            type="submit"
            className="bg-blue-950 text-white px-6 py-3 rounded-lg hover:bg-blue-900 shadow-lg flex items-center gap-2 font-medium"
          >
            <Save className="w-4 h-4" /> Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}

