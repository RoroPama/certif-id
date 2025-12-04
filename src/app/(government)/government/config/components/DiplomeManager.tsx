"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  Loader2,
  X,
  Save,
} from "lucide-react";
import {
  configService,
  type DocumentTypeEntity,
} from "@/lib/services/config.service";
import type {
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
} from "@/lib/services/config.service";

export default function DiplomeManager() {
  const [diplomes, setDiplomes] = useState<DocumentTypeEntity[]>([]);
  const [filieres, setFilieres] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateDocumentTypeDto>({
    nom: "",
    description: "",
    prix: 0,
    filiereId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [diplomesData, filieresData] = await Promise.all([
        configService.getAllDocumentTypes(),
        configService.getAllFilieres(),
      ]);
      setDiplomes(diplomesData || []);
      setFilieres(filieresData || []);
    } catch (err: any) {
      console.error("Erreur lors du chargement des données:", err);
      let errorMessage = "Erreur lors du chargement des données";
      
      if (err?.statusCode === 503 || err?.error === 'NETWORK_ERROR') {
        errorMessage = "Impossible de se connecter au serveur. Vérifiez que le backend est démarré.";
      } else if (err?.statusCode === 408 || err?.error === 'TIMEOUT') {
        errorMessage = "La requête a expiré. Le serveur met trop de temps à répondre.";
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setDiplomes([]);
      setFilieres([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      nom: "",
      description: "",
      prix: 0,
      filiereId: "",
    });
    setShowForm(true);
  };

  const handleEdit = (diplome: DocumentTypeEntity) => {
    setEditingId(diplome.id);
    setFormData({
      nom: diplome.nom,
      description: diplome.description || "",
      prix: diplome.prix,
      filiereId: diplome.filiereId || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce diplôme ?")) {
      return;
    }

    try {
      await configService.deleteDocumentType(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingId) {
        await configService.updateDocumentType(
          editingId,
          formData as UpdateDocumentTypeDto
        );
      } else {
        await configService.createDocumentType(formData);
      }
      setShowForm(false);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin mr-2" />
        <span className="text-slate-500">Chargement des diplômes...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-slate-900">
            {diplomes.length} diplôme{diplomes.length !== 1 ? "s" : ""} configuré{diplomes.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-slate-500">
            Gérez les types de diplômes et leurs associations aux filières
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un diplôme
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-900">
              {editingId ? "Modifier le diplôme" : "Nouveau diplôme"}
            </h4>
            <button
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Nom du diplôme *
              </label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Ex: Licence en Informatique"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Filière (optionnel)
              </label>
              <select
                value={formData.filiereId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, filiereId: e.target.value || undefined })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="">Aucune filière</option>
                {filieres
                  .filter((f) => f.actif)
                  .map((filiere) => (
                    <option key={filiere.id} value={filiere.id}>
                      {filiere.nom} {filiere.code && `(${filiere.code})`}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Prix de signature (XAF) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.prix}
                onChange={(e) =>
                  setFormData({ ...formData, prix: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Description (optionnel)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                rows={2}
                placeholder="Description du diplôme"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Enregistrer" : "Créer"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2">
        {diplomes.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center border border-slate-200">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Aucun diplôme configuré</p>
          </div>
        ) : (
          diplomes.map((diplome) => (
            <div
              key={diplome.id}
              className="bg-white rounded-lg p-4 border border-slate-200 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">{diplome.nom}</h4>
                  {diplome.filiere && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                      {diplome.filiere.nom}
                    </span>
                  )}
                </div>
                {diplome.description && (
                  <p className="text-sm text-slate-500 mt-1">{diplome.description}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  Prix: {diplome.prix.toLocaleString()} XAF
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(diplome)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(diplome.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

