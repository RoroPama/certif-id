/**
 * Composant réutilisable pour afficher les documents PDF
 */

import React from "react";
import { File, FileText, Maximize2 } from "lucide-react";
import { MESSAGES } from "@/lib/utils/messages";

interface PdfViewerProps {
  /**
   * URL du PDF à afficher
   */
  pdfUrl?: string | null;
  /**
   * Nom du fichier à afficher dans la toolbar
   */
  fileName?: string;
  /**
   * Message principal à afficher si le PDF n'est pas disponible
   */
  emptyStateMessage?: string;
  /**
   * Description à afficher si le PDF n'est pas disponible
   */
  emptyStateDescription?: string;
  /**
   * Classe CSS supplémentaire pour le conteneur
   */
  className?: string;
}

export default function PdfViewer({
  pdfUrl,
  fileName = "document.pdf",
  emptyStateMessage = "Document non disponible",
  emptyStateDescription = "Aucun document disponible",
  className = "",
}: PdfViewerProps) {
  return (
    <div
      className={`bg-slate-900 rounded-xl shadow-inner border border-slate-800 flex flex-col overflow-hidden relative group h-full min-h-0 ${className}`}
    >
      {/* PDF Viewer Toolbar */}
      <div className="bg-slate-950 text-slate-400 px-4 py-3 flex justify-between items-center text-xs border-b border-white/5">
        <div className="flex items-center gap-3">
          <File className="w-4 h-4" />
          <span className="font-mono text-slate-300">
            {fileName.replace(/\s+/g, "_")}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>{MESSAGES.pagination.page} 1 / 1</span>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex gap-2">
            <button className="hover:text-white transition-colors">-</button>
            <span>100%</span>
            <button className="hover:text-white transition-colors">+</button>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <button
            className="hover:text-white transition-colors"
            title="Plein écran"
            onClick={() => {
              if (pdfUrl) {
                window.open(pdfUrl, "_blank");
              }
            }}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PDF Canvas Area */}
      <div className="flex-1 bg-slate-800 overflow-auto flex items-center justify-center p-8 relative">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0 rounded"
            title="Aperçu du document"
          />
        ) : (
          <div className="bg-white w-full max-w-[500px] aspect-[1/1.414] shadow-2xl flex flex-col relative transition-transform duration-300 group-hover:scale-[1.01]">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-300" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-400">
                  {emptyStateMessage}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  {emptyStateDescription}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
