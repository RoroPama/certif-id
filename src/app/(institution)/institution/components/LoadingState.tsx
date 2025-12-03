/**
 * Composant d'état de chargement généralisé
 */

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({
  message = "Chargement en cours...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
      <p className="text-slate-600 text-sm font-medium">{message}</p>
    </div>
  );
}
