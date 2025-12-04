/**
 * Composant réutilisable pour afficher les documents PDF
 */

import React, { useState } from "react";
import { File, FileText, Maximize2 } from "lucide-react";

interface PdfViewerProps {
  /**
   * URL du PDF à afficher
   */
  pdfUrl?: string | null;
  /**
   * URL du PDF original (pour switch entre original et signé)
   */
  originalPdfUrl?: string | null;
  /**
   * URL du PDF signé (pour switch entre original et signé)
   */
  signedPdfUrl?: string | null;
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
  originalPdfUrl,
  signedPdfUrl,
  fileName = "document.pdf",
  emptyStateMessage = "Document non disponible",
  emptyStateDescription = "Aucun document disponible",
  className = "",
}: PdfViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [showSigned, setShowSigned] = useState(true);

  // Déterminer quelle URL utiliser
  const hasBothDocuments = originalPdfUrl && signedPdfUrl;
  const currentPdfUrl = hasBothDocuments
    ? showSigned
      ? signedPdfUrl
      : originalPdfUrl
    : pdfUrl || signedPdfUrl || originalPdfUrl;

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const toggleDocument = () => {
    if (hasBothDocuments) {
      setShowSigned((prev) => !prev);
      setZoom(100); // Réinitialiser le zoom lors du changement de document
    }
  };

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
          {hasBothDocuments && (
            <>
              <div className="h-4 w-px bg-white/10 mx-2"></div>
              <button
                onClick={toggleDocument}
                className="px-2 py-1 rounded text-xs font-medium transition-colors hover:bg-white/10 hover:text-white"
                title={
                  showSigned
                    ? "Afficher le document original"
                    : "Afficher le document signé"
                }
              >
                {showSigned ? "Original" : "Signé"}
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* Contrôles de zoom */}
          <div className="flex gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Zoom arrière"
            >
              -
            </button>
            <span className="text-xs">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Zoom avant"
            >
              +
            </button>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <button
            className="hover:text-white transition-colors"
            title="Ouvrir en plein écran"
            onClick={() => {
              if (currentPdfUrl) {
                window.open(currentPdfUrl, "_blank");
              }
            }}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PDF Canvas Area */}
      <div className="flex-1 bg-slate-800 overflow-auto relative">
        {currentPdfUrl ? (
          <div
            className="w-full h-full flex justify-center"
            style={{ padding: "20px" }}
          >
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                width: `${100 / (zoom / 100)}%`,
                minHeight: `${100 / (zoom / 100)}%`,
              }}
            >
              <iframe
                key={currentPdfUrl} // Force la réinitialisation de l'iframe quand l'URL change
                src={`${currentPdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                className="border-0 w-full"
                title="Aperçu du document"
                style={{
                  minHeight: "800px",
                  display: "block",
                }}
              />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-4 p-8">
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
        )}
      </div>
    </div>
  );
}
