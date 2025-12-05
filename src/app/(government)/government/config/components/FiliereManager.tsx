"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  GraduationCap,
  Loader2,
  X,
  Save,
} from "lucide-react";
import { configService, type FiliereEntity } from "@/lib/services/config.service";
import type { CreateFiliereDto, UpdateFiliereDto } from "@/lib/services/config.service";

export default function FiliereManager() {
  const [filieres, setFilieres] = useState<FiliereEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateFiliereDto>({
    nom: "",
    description: "",
    code: "",
    actif: true,
  });

  useEffect(() => {
    loadFilieres();
  }, []);

  const loadFilieres = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await configService.getAllFilieres();
      setFilieres(data || []);
    } catch (err: any) {
      console.error("Erreur lors du chargement des filières:", err);
      let errorMessage = "Erreur lors du chargement des filières";
      
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
      code: "",
      actif: true,
    });
    setShowForm(true);
  };

  const handleEdit = (filiere: FiliereEntity) => {
    setEditingId(filiere.id);
    setFormData({
      nom: filiere.nom,
      description: filiere.description || "",
      code: filiere.code || "",
      actif: filiere.actif,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette filière ?")) {
      return;
    }

    try {
      await configService.deleteFiliere(id);
      await loadFilieres();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingId) {
        await configService.updateFiliere(editingId, formData as UpdateFiliereDto);
      } else {
        await configService.createFiliere(formData);
      }
      setShowForm(false);
      await loadFilieres();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin mr-2" />
        <span className="text-slate-500">Chargement des filières...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-slate-900">
            {filieres.length} filière{filieres.length !== 1 ? "s" : ""} configurée{filieres.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-slate-500">
            Gérez les filières académiques de la plateforme
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter une filière
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
              {editingId ? "Modifier la filière" : "Nouvelle filière"}
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
                Nom de la filière *
              </label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Ex: Informatique"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Code (optionnel)
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Ex: INFO"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Description (optionnel)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                rows={2}
                placeholder="Description de la filière"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="actif"
                checked={formData.actif}
                onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="actif" className="text-sm text-slate-700">
                Filière active
              </label>
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
        {filieres.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center border border-slate-200">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Aucune filière configurée</p>
          </div>
        ) : (
          filieres.map((filiere) => (
            <div
              key={filiere.id}
              className="bg-white rounded-lg p-4 border border-slate-200 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">{filiere.nom}</h4>
                  {filiere.code && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                      {filiere.code}
                    </span>
                  )}
                  {!filiere.actif && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                      Inactive
                    </span>
                  )}
                </div>
                {filiere.description && (
                  <p className="text-sm text-slate-500 mt-1">{filiere.description}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  {filiere._count?.documentTypes || 0} diplôme{(filiere._count?.documentTypes || 0) !== 1 ? "s" : ""} associé{(filiere._count?.documentTypes || 0) !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(filiere)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(filiere.id)}
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

