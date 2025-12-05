"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  Upload,
  Plus,
  Trash2,
  FileSpreadsheet,
  Download,
  Loader2,
} from "lucide-react";
import { MESSAGES } from "@/lib/utils/messages";
import { configService } from "@/lib/services/config.service";
import type { UniversityFormData, Filiere } from "../types";
import type {
  ParcoursEntity,
  DocumentTypeEntity,
} from "@/lib/services/config.service";

interface CreateUniversityModalProps {
  onClose: () => void;
  onSubmit: (data: UniversityFormData) => Promise<void>;
}

export default function CreateUniversityModal({
  onClose,
  onSubmit,
}: CreateUniversityModalProps) {
  const [mode, setMode] = useState<"manual" | "bulk">("manual");
  const [formData, setFormData] = useState<UniversityFormData>({
    name: "",
    type: "PUBLIC",
    rector: "",
    email: "",
    city: "",
    phone: "",
    address: "",
    filieres: [],
  });
  const [availableParcours, setAvailableParcours] = useState<ParcoursEntity[]>(
    []
  );
  const [availableDiplomes, setAvailableDiplomes] = useState<
    DocumentTypeEntity[]
  >([]);
  const [selectedParcoursId, setSelectedParcoursId] = useState<string>("");
  const [selectedDiplomeIds, setSelectedDiplomeIds] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { government } = MESSAGES;
  const createMsg = government.pages.universities.create;

  // Charger les parcours et diplômes disponibles
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const [parcours, diplomes] = await Promise.all([
          configService.getAllParcours(),
          configService.getAllDocumentTypes(),
        ]);
        setAvailableParcours(parcours);
        setAvailableDiplomes(diplomes);
      } catch (err) {
        console.error(
          "Erreur lors du chargement des parcours et diplômes:",
          err
        );
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  const handleAddParcoursAndDiplomes = () => {
    if (selectedParcoursId && selectedDiplomeIds.length > 0) {
      const parcours = availableParcours.find((p) => p.id === selectedParcoursId);
      if (parcours) {
        const selectedDiplomes = availableDiplomes.filter((d) =>
          selectedDiplomeIds.includes(d.id)
        );
        const parcoursData: Filiere = {
          id: parcours.id,
          name: parcours.nom,
          diplomas: selectedDiplomes.map((d) => d.nom),
        };
        setFormData((prev) => ({
          ...prev,
          filieres: [...(prev.filieres || []), parcoursData],
        }));
        setSelectedParcoursId("");
        setSelectedDiplomeIds([]);
      }
    }
  };

  const handleRemoveParcours = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      filieres: prev.filieres?.filter((f) => f.id !== id) || [],
    }));
  };

  const handleDiplomeToggle = (diplomeId: string) => {
    setSelectedDiplomeIds((prev) =>
      prev.includes(diplomeId)
        ? prev.filter((id) => id !== diplomeId)
        : [...prev, diplomeId]
    );
  };

  // Tous les diplômes sont disponibles (les parcours ne filtrent pas les diplômes)
  const availableDiplomesForParcours = availableDiplomes;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setSubmitError("Le nom, l'email et le téléphone sont requis");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onSubmit(formData);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Erreur lors de la création"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-emerald-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Building2 className="w-5 h-5 text-emerald-700" />
            </div>
            <h2 className="text-xl font-serif font-bold text-slate-900">
              {createMsg.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            onClick={() => setMode("manual")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "manual"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {createMsg.manualMode}
          </button>
          <button
            onClick={() => setMode("bulk")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "bulk"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {createMsg.bulkMode}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {mode === "manual" ? (
            <>
              {/* Section Fiche Institutionnelle */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  {createMsg.institutionSection}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      {createMsg.fields.name}
                    </label>
                    <input
                      type="text"
                      placeholder={createMsg.placeholders.name}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      {createMsg.fields.type}
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          type: e.target.value as "PUBLIC" | "PRIVE",
                        }))
                      }
                    >
                      <option value="PUBLIC">Public</option>
                      <option value="PRIVE">Privé</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      {createMsg.fields.city}
                    </label>
                    <input
                      type="text"
                      placeholder={createMsg.placeholders.city}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, city: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      {createMsg.fields.rector}
                    </label>
                    <input
                      type="text"
                      placeholder={createMsg.placeholders.rector}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                      value={formData.rector}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, rector: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      {createMsg.fields.email}
                    </label>
                    <input
                      type="email"
                      placeholder={createMsg.placeholders.email}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      {createMsg.emailNotice}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      placeholder="+242 06 XXX XX XX"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, phone: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      Adresse
                    </label>
                    <input
                      type="text"
                      placeholder="Adresse complète de l'établissement"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                      value={formData.address || ""}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, address: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Section Paramètres Académiques */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  {createMsg.academicSection}
                </h3>

                {isLoadingData ? (
                  <div className="bg-slate-50 rounded-lg p-6 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-slate-400 animate-spin mr-2" />
                    <span className="text-slate-500">
                      Chargement des filières et diplômes...
                    </span>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        Sélectionner un parcours
                      </label>
                      <select
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
                        value={selectedParcoursId}
                        onChange={(e) => {
                          setSelectedParcoursId(e.target.value);
                          setSelectedDiplomeIds([]);
                        }}
                      >
                        <option value="">Sélectionner un parcours</option>
                        {availableParcours.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nom} ({p.duree})
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedParcoursId && (
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                          Sélectionner les diplômes autorisés
                        </label>
                        <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg bg-white p-2 space-y-2">
                          {availableDiplomesForParcours.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-2">
                              Aucun diplôme disponible
                            </p>
                          ) : (
                            availableDiplomesForParcours.map((diplome) => (
                              <label
                                key={diplome.id}
                                className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedDiplomeIds.includes(
                                    diplome.id
                                  )}
                                  onChange={() =>
                                    handleDiplomeToggle(diplome.id)
                                  }
                                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                />
                                <span className="text-sm text-slate-700">
                                  {diplome.nom}
                                  {diplome.description && (
                                    <span className="text-xs text-slate-500 ml-2">
                                      - {diplome.description}
                                    </span>
                                  )}
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                        {selectedDiplomeIds.length > 0 && (
                          <p className="text-xs text-slate-500 mt-2">
                            {selectedDiplomeIds.length} diplôme
                            {selectedDiplomeIds.length > 1 ? "s" : ""}{" "}
                            sélectionné
                            {selectedDiplomeIds.length > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    )}

                    <button
                      onClick={handleAddParcoursAndDiplomes}
                      disabled={
                        !selectedParcoursId || selectedDiplomeIds.length === 0
                      }
                      className="w-full py-2.5 border-2 border-dashed border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Ajouter le parcours et ses diplômes
                    </button>
                  </div>
                )}

                {/* Liste des filières ajoutées */}
                {formData.filieres && formData.filieres.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {createMsg.configuredFilieres}
                    </p>
                    {formData.filieres.map((filiere) => (
                      <div
                        key={filiere.id}
                        className="bg-white border border-slate-200 rounded-lg p-3 flex justify-between items-start"
                      >
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {filiere.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {filiere.diplomas.join(", ")}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveParcours(filiere.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {(!formData.filieres || formData.filieres.length === 0) && (
                  <p className="text-sm text-slate-400 text-center py-4">
                    {createMsg.noFilieres}
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Mode Import Bulk */
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {createMsg.bulkTitle}
                </h3>
                <p className="text-sm text-slate-500">
                  {createMsg.bulkDescription}
                </p>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer bg-slate-50">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-sm text-slate-600 mb-2">
                  {createMsg.bulkUploadText}
                </p>
                <p className="text-xs text-slate-400">
                  {createMsg.bulkFormats}
                </p>
              </div>

              <button className="w-full py-3 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                {createMsg.downloadTemplate}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-3">
          {submitError && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
              <p className="text-sm text-rose-700">{submitError}</p>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {MESSAGES.common.cancel}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Création..."
                : mode === "manual"
                ? createMsg.validateButton
                : createMsg.importButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

