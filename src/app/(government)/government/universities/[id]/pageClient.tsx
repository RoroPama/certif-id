"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Save,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import { useUniversities } from "../../hooks";
import type { University, Filiere } from "../../types";

interface UniversityDetailPageClientProps {
  universityId: string;
}

export default function UniversityDetailPageClient({
  universityId,
}: UniversityDetailPageClientProps) {
  const {
    getUniversityById,
    updateUniversity,
    updateUniversityStatus,
    addFiliereToUniversity,
    removeFiliereFromUniversity,
  } = useUniversities();

  const [university, setUniversity] = useState<University | null>(null);
  const [editedData, setEditedData] = useState<Partial<University>>({});
  const [showAddFiliere, setShowAddFiliere] = useState(false);
  const [newFiliere, setNewFiliere] = useState({ name: "", diploma: "" });
  const [tempDiplomas, setTempDiplomas] = useState<string[]>([]);
  const { government } = MESSAGES;
  const detailMsg = government.pages.universities.detail;

  useEffect(() => {
    const data = getUniversityById(universityId);
    if (data) {
      setUniversity(data);
      setEditedData(data);
    }
  }, [universityId, getUniversityById]);

  if (!university) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">{MESSAGES.common.loading}</p>
      </div>
    );
  }

  const handleSave = () => {
    updateUniversity(universityId, editedData);
    alert("Modifications enregistrées !");
  };

  const handleStatusChange = (status: "ACTIVE" | "SUSPENDED") => {
    updateUniversityStatus(universityId, status);
    setUniversity((prev) => (prev ? { ...prev, status } : null));
  };

  const handleAddDiploma = () => {
    if (newFiliere.diploma.trim()) {
      setTempDiplomas((prev) => [...prev, newFiliere.diploma.trim()]);
      setNewFiliere((prev) => ({ ...prev, diploma: "" }));
    }
  };

  const handleSaveFiliere = () => {
    if (newFiliere.name.trim() && tempDiplomas.length > 0) {
      const filiere: Filiere = {
        id: `fil-${Date.now()}`,
        name: newFiliere.name.trim(),
        diplomas: tempDiplomas,
      };
      addFiliereToUniversity(universityId, filiere);
      setUniversity((prev) =>
        prev ? { ...prev, filieres: [...prev.filieres, filiere] } : null
      );
      setNewFiliere({ name: "", diploma: "" });
      setTempDiplomas([]);
      setShowAddFiliere(false);
    }
  };

  const handleRemoveFiliere = (filiereId: string) => {
    removeFiliereFromUniversity(universityId, filiereId);
    setUniversity((prev) =>
      prev
        ? { ...prev, filieres: prev.filieres.filter((f) => f.id !== filiereId) }
        : null
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                {university.name}
              </h2>
              <p className="text-sm text-slate-500">
                {university.city} •{" "}
                <span
                  className={`font-medium ${
                    university.type === "PUBLIC"
                      ? "text-blue-600"
                      : "text-purple-600"
                  }`}
                >
                  {university.type}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {university.status === "ACTIVE" ? (
            <button
              onClick={() => handleStatusChange("SUSPENDED")}
              className="px-4 py-2 border border-rose-200 text-rose-700 rounded-lg hover:bg-rose-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              {detailMsg.suspend}
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange("ACTIVE")}
              className="px-4 py-2 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {detailMsg.activate}
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {detailMsg.save}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Configuration Générale */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-serif font-bold text-lg text-slate-900 mb-6">
            {detailMsg.generalConfig}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                {government.pages.universities.create.fields.name}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                value={editedData.name || ""}
                onChange={(e) =>
                  setEditedData((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  {government.pages.universities.create.fields.rector}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  value={editedData.rector || ""}
                  onChange={(e) =>
                    setEditedData((p) => ({ ...p, rector: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  {government.pages.universities.create.fields.email}
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  value={editedData.email || ""}
                  onChange={(e) =>
                    setEditedData((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  {government.pages.universities.create.fields.city}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  value={editedData.city || ""}
                  onChange={(e) =>
                    setEditedData((p) => ({ ...p, city: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  {government.pages.universities.create.fields.type}
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  value={editedData.type || "PUBLIC"}
                  onChange={(e) =>
                    setEditedData((p) => ({
                      ...p,
                      type: e.target.value as "PUBLIC" | "PRIVE",
                    }))
                  }
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVE">Privé</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Offre de Formation */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {detailMsg.academicPrograms}
            </h3>
            <button
              onClick={() => setShowAddFiliere(!showAddFiliere)}
              className="px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              {detailMsg.addNewFiliere}
            </button>
          </div>

          {/* Formulaire d'ajout de filière */}
          {showAddFiliere && (
            <div className="bg-slate-50 rounded-lg p-4 mb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-slate-700">
                  {detailMsg.addNewFiliere}
                </p>
                <button
                  onClick={() => setShowAddFiliere(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder={
                  government.pages.universities.create.placeholders.filiere
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
                value={newFiliere.name}
                onChange={(e) =>
                  setNewFiliere((p) => ({ ...p, name: e.target.value }))
                }
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={
                    government.pages.universities.create.placeholders.diploma
                  }
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
                  value={newFiliere.diploma}
                  onChange={(e) =>
                    setNewFiliere((p) => ({ ...p, diploma: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleAddDiploma()}
                />
                <button
                  onClick={handleAddDiploma}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {tempDiplomas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tempDiplomas.map((d, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs flex items-center gap-1"
                    >
                      {d}
                      <button
                        onClick={() =>
                          setTempDiplomas((p) => p.filter((_, idx) => idx !== i))
                        }
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={handleSaveFiliere}
                disabled={!newFiliere.name || tempDiplomas.length === 0}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {detailMsg.saveFiliere}
              </button>
            </div>
          )}

          {/* Liste des filières */}
          <div className="space-y-3">
            {university.filieres.length > 0 ? (
              university.filieres.map((filiere) => (
                <div
                  key={filiere.id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-emerald-200 transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900">{filiere.name}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {filiere.diplomas.map((diploma, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                          >
                            {diploma}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFiliere(filiere.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">
                {detailMsg.noFilieres}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

