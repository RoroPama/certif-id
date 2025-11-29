"use client";

import React, { useRef } from "react";
import { Upload, File, X } from "lucide-react";

interface PdfUploadFieldProps {
  fileName?: string;
  onFileChange: (file: File | null, fileName: string) => void;
}

export default function PdfUploadField({
  fileName,
  onFileChange,
}: PdfUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileChange(file, file.name);
    } else if (file) {
      alert("Seuls les fichiers PDF sont acceptés");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file, file.name);
    }
  };

  const handleClear = () => {
    onFileChange(null, "");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
        Fichier PDF du Diplôme
      </label>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
      />

      {!fileName ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative w-full border-2 border-dashed rounded-xl px-6 py-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-200/50"
              : "border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/30"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className={`p-3 rounded-full transition-all ${
                isDragActive
                  ? "bg-blue-100 text-blue-600 scale-110"
                  : "bg-slate-100 text-slate-400 group-hover:bg-blue-100"
              }`}
            >
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Glissez-déposez votre PDF ici
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ou cliquez pour parcourir
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Formats acceptés: PDF • Taille max: 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-full bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl px-6 py-6 shadow-sm hover:shadow-md transition-all">
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4 pr-8">
            <div className="p-3 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
              <File className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate">
                {fileName}
              </p>
              <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                ✓ Fichier prêt à être soumis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-4 w-full text-sm font-medium text-green-700 hover:text-green-800 py-2 px-3 rounded-lg hover:bg-green-100 transition-all"
          >
            Remplacer le fichier
          </button>
        </div>
      )}
    </div>
  );
}
