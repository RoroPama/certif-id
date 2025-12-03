/**
 * Composant d'état vide (aucune donnée trouvée) généralisé
 */

import React from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title = "Aucune donnée trouvée",
  message = "Il n'y a actuellement aucune donnée à afficher.",
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      <Inbox className="w-12 h-12 text-slate-400 mb-4" />
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm text-center max-w-md mb-6">
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
