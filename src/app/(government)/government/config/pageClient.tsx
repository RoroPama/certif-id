"use client";

import React from "react";
import { Shield, GraduationCap, Award } from "lucide-react";
import TwoFactorAuthSection from "./components/TwoFactorAuthSection";
import FiliereManager from "./components/FiliereManager";
import DiplomeManager from "./components/DiplomeManager";

export default function ConfigPageClient() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h2 className="font-serif font-bold text-xl text-slate-900">
            Configuration de la Plateforme
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gérez les paramètres généraux, la sécurité et les référentiels académiques
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Section 2FA */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Authentification à deux facteurs (2FA)
                </h3>
                <p className="text-sm text-slate-500">
                  Configurez l'authentification à deux facteurs pour votre compte
                </p>
              </div>
            </div>
            <TwoFactorAuthSection />
          </div>

          {/* Section Filières */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Gestion des Filières
                </h3>
                <p className="text-sm text-slate-500">
                  Définissez les filières académiques disponibles dans la plateforme
                </p>
              </div>
            </div>
            <FiliereManager />
          </div>

          {/* Section Diplômes */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Gestion des Diplômes
                </h3>
                <p className="text-sm text-slate-500">
                  Configurez les types de diplômes et leurs associations aux filières
                </p>
              </div>
            </div>
            <DiplomeManager />
          </div>
        </div>
      </div>
    </div>
  );
}


