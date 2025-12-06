"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Loader2,
} from "lucide-react";
import { governmentService, ImportEtablissementsResult } from "@/lib/services";

interface ImportEtablissementsModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportEtablissementsModal({
  onClose,
  onSuccess,
}: ImportEtablissementsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportEtablissementsResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const extension = selectedFile.name.split(".").pop()?.toLowerCase();
      if (
        extension === "xlsx" ||
        extension === "xls" ||
        extension === "csv"
      ) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError(
          "Format de fichier non supporté. Utilisez .xlsx, .xls ou .csv"
        );
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const importResult = await governmentService.importEtablissements(file);
      setResult(importResult);
      if (importResult.successCount > 0) {
        // Attendre un peu avant de fermer pour que l'utilisateur voie le résultat
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de l'import";
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Créer un template CSV
    const csvContent = `nom,numeroDecret,type,adresse,telephone,email,documentTypeNames,parcoursNames
Lycée Technique de Brazzaville,123/MENET/2024,LYCEE,123 Avenue de l'Indépendance,+242 06 123 45 67,contact@lycee-technique.cg,BEPC,BAC,Génie logiciel,Génie civil
Université Marien Ngouabi,456/MENET/2024,UNIVERSITE,456 Boulevard de la République,+242 06 234 56 78,contact@umng.cg,LICENCE,MASTER,Génie logiciel,Génie civil`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_etablissements.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-900">
              Importer des établissements
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Importez plusieurs établissements depuis un fichier Excel ou CSV
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!result ? (
            <>
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">
                  Format du fichier
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  Le fichier doit contenir les colonnes suivantes :
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>
                    <strong>nom</strong> : Nom de l'établissement (obligatoire)
                  </li>
                  <li>
                    <strong>numeroDecret</strong> : Numéro de décret
                    (obligatoire)
                  </li>
                  <li>
                    <strong>type</strong> : Type d'établissement (PRIVE, PUBLIC,
                    UNIVERSITE, ECOLE_TECHNIQUE, LYCEE, COLLEGE)
                  </li>
                  <li>
                    <strong>adresse</strong> : Adresse (optionnel)
                  </li>
                  <li>
                    <strong>telephone</strong> : Numéro de téléphone
                    (obligatoire)
                  </li>
                  <li>
                    <strong>email</strong> : Adresse email (obligatoire)
                  </li>
                  <li>
                    <strong>documentTypeNames</strong> : Types de documents
                    séparés par des virgules (optionnel)
                  </li>
                  <li>
                    <strong>parcoursNames</strong> : Parcours séparés par des
                    virgules (optionnel)
                  </li>
                </ul>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sélectionner un fichier
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {file ? (
                    <div className="space-y-2">
                      <FileSpreadsheet className="w-12 h-12 text-emerald-600 mx-auto" />
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="text-sm text-rose-600 hover:text-rose-700"
                      >
                        Changer de fichier
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                      <p className="text-sm text-slate-600">
                        Cliquez pour sélectionner un fichier ou glissez-déposez
                      </p>
                      <p className="text-xs text-slate-500">
                        Formats acceptés: .xlsx, .xls, .csv
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Sélectionner un fichier
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Template */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Besoin d'un modèle ?
                  </p>
                  <p className="text-xs text-slate-500">
                    Téléchargez un fichier CSV avec les colonnes requises
                  </p>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Télécharger le modèle
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-rose-900">Erreur</p>
                    <p className="text-sm text-rose-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Importer
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <p className="font-bold text-emerald-900">Succès</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-700">
                      {result.successCount}
                    </p>
                    <p className="text-xs text-emerald-600">
                      sur {result.totalRows} lignes
                    </p>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <p className="font-bold text-rose-900">Erreurs</p>
                    </div>
                    <p className="text-2xl font-bold text-rose-700">
                      {result.errorCount}
                    </p>
                    <p className="text-xs text-rose-600">
                      lignes avec erreurs
                    </p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <p className="font-bold text-amber-900">Doublons</p>
                    </div>
                    <p className="text-2xl font-bold text-amber-700">
                      {result.duplicates.length}
                    </p>
                    <p className="text-xs text-amber-600">
                      lignes ignorées
                    </p>
                  </div>
                </div>

                {/* Errors Details */}
                {result.errors.length > 0 && (
                  <div className="border border-rose-200 rounded-lg overflow-hidden">
                    <div className="bg-rose-50 px-4 py-2 border-b border-rose-200">
                      <p className="font-bold text-rose-900">
                        Détails des erreurs ({result.errors.length})
                      </p>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {result.errors.map((error, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-3 border-b border-rose-100 last:border-b-0"
                        >
                          <p className="text-sm font-medium text-slate-900">
                            Ligne {error.rowNumber}: {error.data.nom || "Sans nom"}
                          </p>
                          <ul className="text-xs text-rose-700 mt-1 space-y-0.5">
                            {error.errors.map((err, errIdx) => (
                              <li key={errIdx}>• {err}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Duplicates Details */}
                {result.duplicates.length > 0 && (
                  <div className="border border-amber-200 rounded-lg overflow-hidden">
                    <div className="bg-amber-50 px-4 py-2 border-b border-amber-200">
                      <p className="font-bold text-amber-900">
                        Doublons détectés ({result.duplicates.length})
                      </p>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {result.duplicates.map((duplicate, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-3 border-b border-amber-100 last:border-b-0"
                        >
                          <p className="text-sm font-medium text-slate-900">
                            Ligne {duplicate.rowNumber}: {duplicate.data.nom || "Sans nom"}
                          </p>
                          <p className="text-xs text-amber-700 mt-1">
                            {duplicate.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Details */}
                {result.successes.length > 0 && (
                  <div className="border border-emerald-200 rounded-lg overflow-hidden">
                    <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-200">
                      <p className="font-bold text-emerald-900">
                        Établissements créés ({result.successes.length})
                      </p>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {result.successes.map((success, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-3 border-b border-emerald-100 last:border-b-0"
                        >
                          <p className="text-sm font-medium text-slate-900">
                            {success.etablissement.nom}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            Email: {success.user.email} | Mot de passe temporaire:{" "}
                            {success.user.temporaryPassword}
                          </p>
                          {success.user.emailSent && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded">
                              Email envoyé
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                    setError(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Nouvel import
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Fermer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

