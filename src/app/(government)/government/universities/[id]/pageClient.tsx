"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Save,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  X,
  Loader2,
  Mail,
  Phone,
  MapPin,
  FileText,
  GraduationCap,
} from "lucide-react";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import {
  governmentService,
  type EtablissementEntity,
  type UpdateEtablissementDto,
} from "@/lib/services/government.service";
import {
  configService,
  type DocumentTypeEntity,
  type ParcoursEntity,
} from "@/lib/services/config.service";

interface UniversityDetailPageClientProps {
  universityId: string;
}

export default function UniversityDetailPageClient({
  universityId,
}: UniversityDetailPageClientProps) {
  const router = useRouter();
  const [etablissement, setEtablissement] =
    useState<EtablissementEntity | null>(null);
  const [allDocumentTypes, setAllDocumentTypes] = useState<
    DocumentTypeEntity[]
  >([]);
  const [allParcours, setAllParcours] = useState<ParcoursEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // État pour les modifications
  const [editedData, setEditedData] = useState<UpdateEtablissementDto>({});
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState<string[]>(
    []
  );
  const [selectedParcours, setSelectedParcours] = useState<string[]>([]);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showAddParcours, setShowAddParcours] = useState(false);

  // Récupérer le cookie pour l'authentification
  const getCookieHeader = () => {
    if (typeof document !== "undefined") {
      return document.cookie;
    }
    return "";
  };

  useEffect(() => {
    loadData();
  }, [universityId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const cookieHeader = getCookieHeader();

      // Charger l'établissement, les types de documents et les parcours en parallèle
      const [etablissementData, documentTypesData, parcoursData] =
        await Promise.all([
          governmentService.getEtablissementById(universityId, cookieHeader),
          configService.getAllDocumentTypes(cookieHeader),
          configService.getAllParcours(cookieHeader),
        ]);

      setEtablissement(etablissementData);
      setAllDocumentTypes(documentTypesData);
      setAllParcours(parcoursData);

      // Initialiser les données modifiables
      setEditedData({
        nom: etablissementData.nom,
        numeroDecret: etablissementData.numeroDecret,
        type: etablissementData.type,
        adresse: etablissementData.adresse || undefined,
        telephone: etablissementData.telephone,
        email: etablissementData.email,
      });

      // Initialiser les types de documents sélectionnés
      const docTypeNames =
        etablissementData.documentsAutorises?.map(
          (da) => da.documentType.nom
        ) || [];
      setSelectedDocumentTypes(docTypeNames);

      // Initialiser les parcours sélectionnés (si disponibles dans la réponse)
      // Note: Le backend retourne les parcours dans etablissement.parcours
      const etablissementParcours = etablissementData.parcours || [];
      const parcoursNames = etablissementParcours.map((p) => p.parcours.nom);
      setSelectedParcours(parcoursNames);
    } catch (err: any) {
      console.error("Erreur lors du chargement:", err);
      setError(err.message || "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const cookieHeader = getCookieHeader();

      // Préparer les données de mise à jour
      const updateData: UpdateEtablissementDto = {
        ...editedData,
        documentTypeNames: selectedDocumentTypes,
        parcoursNames: selectedParcours,
      };

      const updated = await governmentService.updateEtablissement(
        universityId,
        updateData,
        cookieHeader
      );

      setEtablissement(updated);
      setSuccess("Établissement mis à jour avec succès !");

      // Recharger les données pour avoir les dernières informations
      setTimeout(() => {
        loadData();
      }, 1000);
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleAddDocumentType = (docTypeName: string) => {
    if (!selectedDocumentTypes.includes(docTypeName)) {
      setSelectedDocumentTypes([...selectedDocumentTypes, docTypeName]);
    }
    setShowAddDocument(false);
  };

  const handleRemoveDocumentType = (docTypeName: string) => {
    setSelectedDocumentTypes(
      selectedDocumentTypes.filter((name) => name !== docTypeName)
    );
  };

  const handleAddParcours = (parcoursName: string) => {
    if (!selectedParcours.includes(parcoursName)) {
      setSelectedParcours([...selectedParcours, parcoursName]);
    }
    setShowAddParcours(false);
  };

  const handleRemoveParcours = (parcoursName: string) => {
    setSelectedParcours(
      selectedParcours.filter((name) => name !== parcoursName)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <p className="ml-3 text-slate-500">{MESSAGES.common.loading}</p>
      </div>
    );
  }

  if (error && !etablissement) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <p className="text-rose-600 font-medium">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!etablissement) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Établissement introuvable</p>
      </div>
    );
  }

  const availableDocumentTypes = allDocumentTypes.filter(
    (dt) => !selectedDocumentTypes.includes(dt.nom)
  );
  const availableParcours = allParcours.filter(
    (p) => !selectedParcours.includes(p.nom)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Messages de succès/erreur */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <p>{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={GOVERNMENT_ROUTES.UNIVERSITIES}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900">
                {etablissement.nom}
              </h2>
              <p className="text-sm text-slate-500">
                {etablissement.adresse || "Adresse non renseignée"} •{" "}
                <span className="font-medium text-blue-600">
                  {etablissement.type}
                </span>
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Enregistrer
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Configuration Générale */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-serif font-bold text-lg text-slate-900 mb-6">
            Informations générales
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Nom de l'établissement
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                value={editedData.nom || ""}
                onChange={(e) =>
                  setEditedData((p) => ({ ...p, nom: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Numéro de décret
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                value={editedData.numeroDecret || ""}
                onChange={(e) =>
                  setEditedData((p) => ({ ...p, numeroDecret: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Type
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  value={editedData.type || etablissement.type}
                  onChange={(e) =>
                    setEditedData((p) => ({
                      ...p,
                      type: e.target.value as any,
                    }))
                  }
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVE">Privé</option>
                  <option value="UNIVERSITE">Université</option>
                  <option value="ECOLE_TECHNIQUE">École Technique</option>
                  <option value="LYCEE">Lycée</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    value={editedData.telephone || ""}
                    onChange={(e) =>
                      setEditedData((p) => ({
                        ...p,
                        telephone: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  value={editedData.email || ""}
                  onChange={(e) =>
                    setEditedData((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Adresse
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  value={editedData.adresse || ""}
                  onChange={(e) =>
                    setEditedData((p) => ({ ...p, adresse: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Types de documents autorisés */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Types de documents autorisés
              </h3>
            </div>
            <button
              onClick={() => setShowAddDocument(!showAddDocument)}
              className="px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>

          {/* Liste déroulante pour ajouter un type de document */}
          {showAddDocument && (
            <div className="bg-slate-50 rounded-lg p-4 mb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-slate-700">
                  Sélectionner un type de document
                </p>
                <button
                  onClick={() => setShowAddDocument(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddDocumentType(e.target.value);
                  }
                }}
                value=""
              >
                <option value="">Sélectionner un type de document</option>
                {availableDocumentTypes.map((dt) => (
                  <option key={dt.id} value={dt.nom}>
                    {dt.nom}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Liste des types de documents sélectionnés */}
          <div className="space-y-3">
            {selectedDocumentTypes.length > 0 ? (
              selectedDocumentTypes.map((docTypeName) => {
                const docType = allDocumentTypes.find(
                  (dt) => dt.nom === docTypeName
                );
                return (
                  <div
                    key={docTypeName}
                    className="border border-slate-200 rounded-lg p-4 hover:border-emerald-200 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-900">
                          {docTypeName}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveDocumentType(docTypeName)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">
                Aucun type de document autorisé
              </p>
            )}
          </div>
        </div>

        {/* Parcours associés */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Parcours d'études
              </h3>
            </div>
            <button
              onClick={() => setShowAddParcours(!showAddParcours)}
              className="px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>

          {/* Liste déroulante pour ajouter un parcours */}
          {showAddParcours && (
            <div className="bg-slate-50 rounded-lg p-4 mb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-slate-700">
                  Sélectionner un parcours
                </p>
                <button
                  onClick={() => setShowAddParcours(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddParcours(e.target.value);
                  }
                }}
                value=""
              >
                <option value="">Sélectionner un parcours</option>
                {availableParcours.map((p) => (
                  <option key={p.id} value={p.nom}>
                    {p.nom} - {p.duree}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Liste des parcours sélectionnés */}
          <div className="space-y-3">
            {selectedParcours.length > 0 ? (
              selectedParcours.map((parcoursName) => {
                const parcours = allParcours.find(
                  (p) => p.nom === parcoursName
                );
                return (
                  <div
                    key={parcoursName}
                    className="border border-slate-200 rounded-lg p-4 hover:border-emerald-200 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-900">
                          {parcoursName}
                        </p>
                        {parcours && (
                          <p className="text-sm text-slate-500 mt-1">
                            Durée: {parcours.duree}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveParcours(parcoursName)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">
                Aucun parcours associé
              </p>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-serif font-bold text-lg text-slate-900 mb-6">
            Statistiques
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Utilisateurs</span>
              <span className="font-bold text-slate-900">
                {etablissement._count?.users || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Demandes</span>
              <span className="font-bold text-slate-900">
                {etablissement._count?.demandes || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">
                Documents autorisés
              </span>
              <span className="font-bold text-slate-900">
                {etablissement._count?.documentsAutorises || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
