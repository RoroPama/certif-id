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
import { configService, type ParcoursEntity } from "@/lib/services/config.service";
import type { CreateParcoursDto, UpdateParcoursDto } from "@/lib/services/config.service";

export default function ParcoursManager() {
  const [parcours, setParcours] = useState<ParcoursEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateParcoursDto>({
    nom: "",
    duree: "",
  });

  useEffect(() => {
    loadParcours();
  }, []);

  const loadParcours = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await configService.getAllParcours();
      setParcours(data || []);
    } catch (err: any) {
      console.error("Erreur lors du chargement des parcours:", err);
      let errorMessage = "Erreur lors du chargement des parcours";
      
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
      setParcours([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      nom: "",
      duree: "",
    });
    setShowForm(true);
  };

  const handleEdit = (parcoursItem: ParcoursEntity) => {
    setEditingId(parcoursItem.id);
    setFormData({
      nom: parcoursItem.nom,
      duree: parcoursItem.duree,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce parcours ?")) {
      return;
    }

    try {
      await configService.deleteParcours(id);
      await loadParcours();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingId) {
        await configService.updateParcours(editingId, formData as UpdateParcoursDto);
      } else {
        await configService.createParcours(formData);
      }
      setShowForm(false);
      await loadParcours();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin mr-2" />
        <span className="text-slate-500">Chargement des parcours...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-slate-900">
            {parcours.length} parcours configuré{parcours.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-slate-500">
            Gérez les parcours académiques de la plateforme
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un parcours
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
              {editingId ? "Modifier le parcours" : "Nouveau parcours"}
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
                Nom du parcours *
              </label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Ex: Génie logiciel"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Durée *
              </label>
              <input
                type="text"
                required
                value={formData.duree}
                onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Ex: 3 ans"
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
        {parcours.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center border border-slate-200">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Aucun parcours configuré</p>
          </div>
        ) : (
          parcours.map((parcoursItem) => (
            <div
              key={parcoursItem.id}
              className="bg-white rounded-lg p-4 border border-slate-200 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">{parcoursItem.nom}</h4>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {parcoursItem.duree}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(parcoursItem)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(parcoursItem.id)}
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

