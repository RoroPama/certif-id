"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, FilePlus, X } from "lucide-react";
import { useNewRequest } from "../hooks/useNewRequest";
import PdfUploadField from "../components/PdfUploadField";
import type { Filiere } from "../types";

interface NewRequestPageClientProps {
  initialFilieres: Filiere[];
  foundationYear: number;
}

export default function NewRequestPageClient({
  initialFilieres,
  foundationYear,
}: NewRequestPageClientProps) {
  const router = useRouter();

  const {
    draftList,
    currentEntry,
    years,
    setCurrentEntry,
    handleAddDraft,
    handleRemoveDraft,
    handleSubmit,
  } = useNewRequest({
    filieres: initialFilieres,
    foundationYear,
    onSubmitSuccess: () => {
      // Rediriger vers la page des demandes après soumission
      router.push("/dashboard/requests");
    },
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
      <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-100 p-6">
          <h3 className="font-serif font-bold text-lg text-slate-900">
            Saisie des informations
          </h3>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                Année Académique
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium outline-none"
                value={currentEntry.yearId || ""}
                onChange={(e) =>
                  setCurrentEntry({
                    ...currentEntry,
                    yearId: e.target.value,
                  })
                }
              >
                <option value="">Sélectionner...</option>
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                Filière
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium outline-none"
                value={currentEntry.filiereId || ""}
                onChange={(e) => {
                  const selected = initialFilieres.find(
                    (f) => f.id === e.target.value
                  );
                  setCurrentEntry({
                    ...currentEntry,
                    filiereId: e.target.value,
                    diplomaId: "",
                    diplomaName: "",
                  });
                }}
              >
                <option value="">Sélectionner...</option>
                {initialFilieres.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full"></div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
              Intitulé du Diplôme
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium outline-none"
              value={currentEntry.diplomaId || ""}
              onChange={(e) => {
                const selected = initialFilieres
                  .find((f) => f.id === currentEntry.filiereId)
                  ?.diplomas.find((d) => d.id === e.target.value);
                setCurrentEntry({
                  ...currentEntry,
                  diplomaId: e.target.value,
                  diplomaName: selected ? selected.name : "",
                });
              }}
              disabled={!currentEntry.filiereId}
            >
              <option value="">Sélectionner un diplôme...</option>
              {currentEntry.filiereId &&
                initialFilieres
                  .find((f) => f.id === currentEntry.filiereId)
                  ?.diplomas.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
            </select>
          </div>

          <div className="space-y-6">
            <h4 className="font-serif font-semibold text-slate-800 text-sm">
              Identité du Récipiendaire
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                  Nom
                </label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 outline-none"
                  placeholder="EX: MABIALA"
                  value={currentEntry.firstName || ""}
                  onChange={(e) =>
                    setCurrentEntry({
                      ...currentEntry,
                      firstName: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <div className="md:col-span-5 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                  Prénoms
                </label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 outline-none"
                  placeholder="Ex: Jean"
                  value={currentEntry.lastName || ""}
                  onChange={(e) =>
                    setCurrentEntry({
                      ...currentEntry,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                  Sexe
                </label>
                <div className="flex items-center gap-2">
                  {["M", "F"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() =>
                        setCurrentEntry({
                          ...currentEntry,
                          sex: g as "M" | "F",
                        })
                      }
                      className={`flex-1 py-3 rounded-lg border font-bold text-sm transition-all ${
                        currentEntry.sex === g
                          ? "bg-blue-900 text-white border-blue-900 shadow-md"
                          : "bg-white text-slate-400 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                Mention
              </label>
              <select
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 outline-none"
                value={currentEntry.mention || "Passable"}
                onChange={(e) =>
                  setCurrentEntry({
                    ...currentEntry,
                    mention: e.target.value,
                  })
                }
              >
                <option value="Passable">Passable</option>
                <option value="Assez Bien">Assez Bien</option>
                <option value="Bien">Bien</option>
                <option value="Très Bien">Très Bien</option>
                <option value="Excellent">Excellent</option>
              </select>
            </div>
          </div>

          <PdfUploadField
            fileName={currentEntry.fileName}
            onFileChange={(file, fileName) => {
              setCurrentEntry({
                ...currentEntry,
                pdfFile: file,
                fileName: fileName,
              });
            }}
          />

          <div className="pt-6 flex justify-end">
            <button
              type="button"
              onClick={handleAddDraft}
              className="bg-blue-950 text-white px-8 py-3.5 rounded-lg hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5 text-amber-500" />
              Ajouter au Bordereau
            </button>
          </div>
        </div>
      </div>

      <div className="xl:col-span-1">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-28 overflow-hidden">
          <div className="p-6 bg-blue-950 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-2xl rounded-full pointer-events-none"></div>
            <div className="flex justify-between items-center mb-1 relative z-10">
              <h3 className="font-serif font-bold text-lg">Votre Bordereau</h3>
              <span className="bg-amber-500 text-blue-950 px-2 py-0.5 rounded text-xs font-bold">
                {draftList.length}
              </span>
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto p-3 space-y-3 bg-slate-50 min-h-[300px]">
            {draftList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <FilePlus className="w-12 h-12 opacity-20 mb-2" />
                <p className="text-sm font-medium">Bordereau vide</p>
              </div>
            ) : (
              draftList.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm group hover:border-amber-400 transition-all relative"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveDraft(draft.id)}
                    className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 p-1 hover:bg-rose-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded bg-blue-50 text-blue-800 text-xs font-bold flex items-center justify-center">
                      {draft.sex}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {draft.firstName} {draft.lastName}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {draft.diplomaName}
                  </p>
                  {draft.fileName && (
                    <p className="text-xs text-green-600 font-medium mt-2">
                      📄 {draft.fileName}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-white">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={draftList.length === 0}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Soumettre ({draftList.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

