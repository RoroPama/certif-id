"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Building2,
  Upload,
  FileText,
  Download,
  Loader2,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";
import { configService } from "@/lib/services/config.service";
import type { UniversityFormData } from "../types";
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
  // État pour le montage du portail (Client-side only)
  const [mounted, setMounted] = useState(false);

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

  // États académiques
  const [availableParcours, setAvailableParcours] = useState<ParcoursEntity[]>(
    []
  );
  const [availableDiplomes, setAvailableDiplomes] = useState<
    DocumentTypeEntity[]
  >([]);
  const [selectedDiplomeId, setSelectedDiplomeId] = useState<string>("");
  const [selectedParcoursIds, setSelectedParcoursIds] = useState<string[]>([]);
  const [diplomeParcoursMap, setDiplomeParcoursMap] = useState<{
    [diplomeId: string]: string[];
  }>({});

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // Empêcher le scroll du body quand la modale est ouverte
    document.body.style.overflow = "hidden";

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
        console.error("Erreur chargement ref:", err);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();

    return () => {
      // Réactiver le scroll à la fermeture
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleAddDiplomeAndParcours = () => {
    if (selectedDiplomeId && selectedParcoursIds.length > 0) {
      setDiplomeParcoursMap((prev) => ({
        ...prev,
        [selectedDiplomeId]: selectedParcoursIds,
      }));
      setSelectedDiplomeId("");
      setSelectedParcoursIds([]);
    }
  };

  const handleRemoveDiplome = (diplomeId: string) => {
    setDiplomeParcoursMap((prev) => {
      const newMap = { ...prev };
      delete newMap[diplomeId];
      return newMap;
    });
  };

  const handleParcoursToggle = (parcoursId: string) => {
    setSelectedParcoursIds((prev) =>
      prev.includes(parcoursId)
        ? prev.filter((id) => id !== parcoursId)
        : [...prev, parcoursId]
    );
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setSubmitError(
        "Les champs marqués d'un astérisque (*) sont obligatoires."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const documentTypeParcours: { [documentTypeId: string]: string[] } = {};
      Object.entries(diplomeParcoursMap).forEach(([diplomeId, parcoursIds]) => {
        documentTypeParcours[diplomeId] = parcoursIds;
      });

      const documentTypeNames = Object.keys(diplomeParcoursMap)
        .map((id) => {
          return availableDiplomes.find((d) => d.id === id)?.nom || "";
        })
        .filter(Boolean);

      const submitData: UniversityFormData = {
        ...formData,
        documentTypeParcours,
        documentTypeNames,
      };

      await onSubmit(submitData);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur technique");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si pas monté côté client, ne rien rendre
  if (!mounted) return null;

  // Utilisation de Portal pour rendre la modale au niveau du body
  // Z-index 100 pour être sûr de passer au-dessus du Header (z-20) et Sidebar (z-30)
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay sombre avec flou */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Contenu de la modale */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200">
        {/* Header Modale */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-900">
              Enregistrement Établissement
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Nouvelle entité académique dans le registre national.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Onglets de Mode */}
        <div className="px-8 pt-6 pb-2">
          <div className="flex p-1 bg-slate-100 rounded-lg w-fit">
            <button
              onClick={() => setMode("manual")}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                mode === "manual"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Saisie Manuelle
            </button>
            <button
              onClick={() => setMode("bulk")}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                mode === "bulk"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Import en Masse (CSV)
            </button>
          </div>
        </div>

        {/* Contenu Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {mode === "manual" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Colonne 1: Identité */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Identité Institutionnelle
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Nom Officiel *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-slate-400 focus:ring-0 transition-all outline-none"
                      placeholder="Ex: Université Marien Ngouabi"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Type *
                      </label>
                      <select
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-slate-400 focus:ring-0 outline-none cursor-pointer"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            type: e.target.value as any,
                          }))
                        }
                      >
                        <option value="PUBLIC">Public (État)</option>
                        <option value="PRIVE">Privé</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Ville *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-slate-400 focus:ring-0 outline-none"
                        placeholder="Ex: Brazzaville"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, city: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Recteur / Directeur
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-slate-400 focus:ring-0 outline-none"
                      placeholder="Nom complet du responsable"
                      value={formData.rector}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, rector: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Email Officiel *
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-slate-400 focus:ring-0 outline-none"
                        placeholder="contact@univ.cg"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, email: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-slate-400 focus:ring-0 outline-none"
                        placeholder="+242..."
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, phone: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Adresse Physique
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-slate-400 focus:ring-0 outline-none"
                      placeholder="Adresse complète"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, address: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>


              {/* Colonne 2: Académique */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Habilitations Académiques
                  </h3>
                </div>

                {isLoadingData ? (
                  <div className="flex items-center justify-center h-40 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/60">
                      <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                          Diplôme Habilité
                        </label>
                        <select
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm focus:border-blue-400 focus:ring-0 outline-none"
                          value={selectedDiplomeId}
                          onChange={(e) => {
                            setSelectedDiplomeId(e.target.value);
                            setSelectedParcoursIds([]);
                          }}
                        >
                          <option value="">Sélectionner un diplôme...</option>
                          {availableDiplomes.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.nom}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedDiplomeId && (
                        <div className="mb-4 animate-in fade-in slide-in-from-top-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                            Parcours Associés
                          </label>
                          <div className="max-h-32 overflow-y-auto bg-white border border-slate-200 rounded p-2 space-y-1">
                            {availableParcours.map((p) => (
                              <label
                                key={p.id}
                                className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer group"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedParcoursIds.includes(p.id)}
                                  onChange={() => handleParcoursToggle(p.id)}
                                  className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-0"
                                />
                                <span className="text-sm text-slate-600 group-hover:text-slate-900">
                                  {p.nom}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleAddDiplomeAndParcours}
                        disabled={
                          !selectedDiplomeId || selectedParcoursIds.length === 0
                        }
                        className="w-full py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold uppercase rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Ajouter l'habilitation
                      </button>
                    </div>

                    {/* Liste des diplômes ajoutés */}
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {Object.keys(diplomeParcoursMap).length === 0 ? (
                        <p className="text-center text-xs text-slate-400 py-4 italic">
                          Aucune habilitation configurée
                        </p>
                      ) : (
                        Object.entries(diplomeParcoursMap).map(
                          ([diplomeId, parcoursIds]) => {
                            const diplome = availableDiplomes.find(
                              (d) => d.id === diplomeId
                            );
                            const count = parcoursIds.length;
                            return (
                              <div
                                key={diplomeId}
                                className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg group"
                              >
                                <div>
                                  <p className="text-sm font-bold text-slate-800">
                                    {diplome?.nom}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {count} parcours associé
                                    {count > 1 ? "s" : ""}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleRemoveDiplome(diplomeId)}
                                  className="text-slate-300 hover:text-rose-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          }
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          ) : (
            // Mode Bulk
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                <FileText className="w-10 h-10 text-slate-300" />
              </div>
              <div className="text-center max-w-md">
                <h3 className="text-lg font-bold text-slate-900">
                  Importation de masse
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Téléchargez le modèle CSV officiel, remplissez-le avec les
                  données des établissements et réimportez-le ici.
                </p>
              </div>

              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  <Download className="w-4 h-4" /> Modèle CSV
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                  <Upload className="w-4 h-4" /> Uploader le fichier
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            {submitError && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {submitError}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-white transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "manual"
                ? "Enregistrer l'établissement"
                : "Lancer l'importation"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body // Cible du portail : le body du document
  );
}
