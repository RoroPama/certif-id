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
  const [documentTypeParcours, setDocumentTypeParcours] = useState<{
    [documentTypeId: string]: string[];
  }>({});
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showAddParcours, setShowAddParcours] = useState(false);
  const [currentDiplomeForParcours, setCurrentDiplomeForParcours] = useState<
    string | null
  >(null);
  const [diplomeFilter, setDiplomeFilter] = useState<string>("all");

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

      // Initialiser les associations diplôme-parcours depuis les données du backend
      const initialDocumentTypeParcours: {
        [documentTypeId: string]: string[];
      } = {};

      // Grouper les parcours par documentTypeId depuis documentTypeParcours
      const relations =
        etablissementData.documentTypeParcours ||
        etablissementData.etablissementDocumentTypeParcours;
      if (relations) {
        relations.forEach((relation) => {
          const docTypeId = relation.documentType.id;
          const parcoursId = relation.parcours.id;

          if (!initialDocumentTypeParcours[docTypeId]) {
            initialDocumentTypeParcours[docTypeId] = [];
          }

          if (!initialDocumentTypeParcours[docTypeId].includes(parcoursId)) {
            initialDocumentTypeParcours[docTypeId].push(parcoursId);
          }
        });
      }

      setDocumentTypeParcours(initialDocumentTypeParcours);
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
        documentTypeParcours: documentTypeParcours,
      };

      const updated = await governmentService.updateEtablissement(
        universityId,
        updateData,
        cookieHeader
      );

      setEtablissement(updated);

      // Mettre à jour documentTypeParcours immédiatement depuis la réponse
      const updatedRelations =
        updated.documentTypeParcours ||
        updated.etablissementDocumentTypeParcours;
      if (updatedRelations) {
        const updatedDocumentTypeParcours: {
          [documentTypeId: string]: string[];
        } = {};

        updatedRelations.forEach((relation) => {
          const docTypeId = relation.documentType.id;
          const parcoursId = relation.parcours.id;

          if (!updatedDocumentTypeParcours[docTypeId]) {
            updatedDocumentTypeParcours[docTypeId] = [];
          }

          if (!updatedDocumentTypeParcours[docTypeId].includes(parcoursId)) {
            updatedDocumentTypeParcours[docTypeId].push(parcoursId);
          }
        });

        setDocumentTypeParcours(updatedDocumentTypeParcours);
      }

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
      // Initialiser documentTypeParcours pour ce nouveau diplôme
      const docType = allDocumentTypes.find((dt) => dt.nom === docTypeName);
      if (docType) {
        setDocumentTypeParcours((prev) => ({
          ...prev,
          [docType.id]: [],
        }));
      }
    }
    setShowAddDocument(false);
  };

  const handleRemoveDocumentType = (docTypeName: string) => {
    const docType = allDocumentTypes.find((dt) => dt.nom === docTypeName);
    setSelectedDocumentTypes(
      selectedDocumentTypes.filter((name) => name !== docTypeName)
    );
    // Retirer aussi les associations parcours pour ce diplôme
    if (docType) {
      setDocumentTypeParcours((prev) => {
        const newMap = { ...prev };
        delete newMap[docType.id];
        return newMap;
      });
    }
  };

  const handleAddParcoursToDiplome = (docTypeId: string) => {
    setCurrentDiplomeForParcours(docTypeId);
    setShowAddParcours(true);
  };

  const handleRemoveParcoursFromDiplome = (
    docTypeId: string,
    parcoursId: string
  ) => {
    setDocumentTypeParcours((prev) => ({
      ...prev,
      [docTypeId]: prev[docTypeId]?.filter((id) => id !== parcoursId) || [],
    }));
  };

  const handleAddParcours = (parcoursId: string) => {
    if (currentDiplomeForParcours && parcoursId) {
      setDocumentTypeParcours((prev) => {
        const currentParcours = prev[currentDiplomeForParcours] || [];
        if (!currentParcours.includes(parcoursId)) {
          return {
            ...prev,
            [currentDiplomeForParcours]: [...currentParcours, parcoursId],
          };
        }
        return prev;
      });
      setCurrentDiplomeForParcours(null);
    }
    setShowAddParcours(false);
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
  // Pour les parcours disponibles, on vérifie ceux qui ne sont pas déjà associés à tous les diplômes
  const allSelectedParcoursIds = new Set(
    Object.values(documentTypeParcours).flat()
  );
  const availableParcours = allParcours.filter(
    (p) => !allSelectedParcoursIds.has(p.id)
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

        {/* Diplômes et Parcours groupés */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Diplômes et Parcours
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {selectedDocumentTypes.length > 0 && (
                <select
                  value={diplomeFilter}
                  onChange={(e) => setDiplomeFilter(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
                >
                  <option value="all">Tous les diplômes</option>
                  {selectedDocumentTypes.map((docTypeName) => {
                    const docType = allDocumentTypes.find(
                      (dt) => dt.nom === docTypeName
                    );
                    return docType ? (
                      <option key={docType.id} value={docType.id}>
                        {docTypeName}
                      </option>
                    ) : null;
                  })}
                </select>
              )}
              <button
                onClick={() => setShowAddDocument(!showAddDocument)}
                className="px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Ajouter un diplôme
              </button>
            </div>
          </div>

          {/* Liste déroulante pour ajouter un type de document */}
          {showAddDocument && (
            <div className="bg-slate-50 rounded-lg p-4 mb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-slate-700">
                  Sélectionner un diplôme
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
                <option value="">Sélectionner un diplôme</option>
                {availableDocumentTypes.map((dt) => (
                  <option key={dt.id} value={dt.nom}>
                    {dt.nom}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Liste déroulante pour ajouter un parcours à un diplôme */}
          {showAddParcours && currentDiplomeForParcours && (
            <div className="bg-slate-50 rounded-lg p-4 mb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-slate-700">
                  Sélectionner un parcours
                </p>
                <button
                  onClick={() => {
                    setShowAddParcours(false);
                    setCurrentDiplomeForParcours(null);
                  }}
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
                {allParcours
                  .filter(
                    (p) =>
                      !documentTypeParcours[
                        currentDiplomeForParcours
                      ]?.includes(p.id)
                  )
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nom} ({p.duree})
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Liste des diplômes avec leurs parcours */}
          <div className="space-y-4">
            {selectedDocumentTypes.length > 0 ? (
              selectedDocumentTypes
                .map((docTypeName) => {
                  const docType = allDocumentTypes.find(
                    (dt) => dt.nom === docTypeName
                  );
                  return docType;
                })
                .filter((docType) => {
                  // Filtrer selon diplomeFilter
                  if (diplomeFilter === "all") return true;
                  return docType?.id === diplomeFilter;
                })
                .map((docType) => {
                  if (!docType) return null;

                  const parcoursIds = documentTypeParcours[docType.id] || [];
                  const parcoursList = parcoursIds
                    .map((id) => allParcours.find((p) => p.id === id))
                    .filter(Boolean) as ParcoursEntity[];

                  return (
                    <div
                      key={docType.id}
                      className="border border-slate-200 rounded-lg p-4 hover:border-emerald-200 transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <h4 className="font-bold text-slate-900">
                            {docType.nom}
                          </h4>
                        </div>
                        <button
                          onClick={() => handleRemoveDocumentType(docType.nom)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Supprimer le diplôme"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="ml-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Parcours associés
                          </p>
                          <button
                            onClick={() =>
                              handleAddParcoursToDiplome(docType.id)
                            }
                            className="text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                          >
                            <Plus className="w-3 h-3 inline mr-1" />
                            Ajouter
                          </button>
                        </div>

                        {parcoursList.length > 0 ? (
                          <div className="space-y-2">
                            {parcoursList.map((parcours) => (
                              <div
                                key={parcours.id}
                                className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100 group/parcours"
                              >
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="w-3 h-3 text-blue-600" />
                                  <span className="text-sm text-slate-700">
                                    {parcours.nom}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    ({parcours.duree})
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    handleRemoveParcoursFromDiplome(
                                      docType.id,
                                      parcours.id
                                    )
                                  }
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover/parcours:opacity-100"
                                  title="Retirer ce parcours"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">
                            Aucun parcours associé à ce diplôme
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">
                Aucun diplôme configuré. Ajoutez un diplôme pour commencer.
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
