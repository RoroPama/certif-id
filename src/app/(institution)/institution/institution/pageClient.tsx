"use client";

import React from "react";
import { Building2, Save, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useInstitution } from "../hooks/useInstitution";

export default function InstitutionPageClient() {
  const {
    universityName,
    numeroDecret,
    institutionData,
    isLoading,
    isSaving,
    error,
    successMessage,
    handleUpdateInstitution,
    handleFieldChange,
  } = useInstitution();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          <span className="ml-3 text-slate-500">Chargement du profil...</span>
        </div>
      </div>
    );
  }

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

      {/* Messages d'erreur et de succès */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-semibold">Erreur</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-800 font-semibold">Succès</p>
            <p className="text-green-600 text-sm mt-1">{successMessage}</p>
          </div>
        </div>
      )}

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
              Numéro de Décret
            </label>
            <input
              type="text"
              value={numeroDecret}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 text-slate-500 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-slate-400">
              Identifiant officiel de l'établissement
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Email de contact
            </label>
            <input
              type="email"
              value={institutionData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-400 outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Téléphone
            </label>
            <input
              type="tel"
              value={institutionData.telephone}
              onChange={(e) => handleFieldChange("telephone", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-400 outline-none transition-all"
              required
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Adresse Postale
            </label>
            <input
              type="text"
              value={institutionData.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-400 outline-none transition-all"
            />
          </div>
        </div>
        <div className="pt-6 flex justify-end border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-950 text-white px-6 py-3 rounded-lg hover:bg-blue-900 shadow-lg flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

