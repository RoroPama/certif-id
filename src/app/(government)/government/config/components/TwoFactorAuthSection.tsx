"use client";

import React, { useState, useEffect } from "react";
import { Shield, ShieldCheck, ShieldOff, QrCode, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authService } from "@/lib/services/auth.service";

export default function TwoFactorAuthSection() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    check2FAStatus();
  }, []);

  const check2FAStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      setIs2FAEnabled(user.is2FAEnabled || false);
    } catch (err: any) {
      console.error("Erreur lors de la vérification du statut 2FA:", err);
      let errorMessage = "Erreur lors de la vérification du statut 2FA";
      
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      // Note: Le backend devrait retourner qrCode et secret
      const response = await authService.enable2FA();
      // Pour l'instant, on simule - à adapter selon la réponse réelle du backend
      if (response.qrCode) {
        setQrCode(response.qrCode);
        setSecret(response.secret);
      }
    } catch (err: any) {
      console.error("Erreur lors de l'activation du 2FA:", err);
      setError(err.message || "Erreur lors de l'activation du 2FA");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Veuillez entrer un code de vérification valide (6 chiffres)");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      // TODO: Implémenter la vérification du code et l'activation finale
      // await authService.verify2FACode(verificationCode);
      setIs2FAEnabled(true);
      setQrCode(null);
      setSecret(null);
      setVerificationCode("");
    } catch (err: any) {
      console.error("Erreur lors de la vérification:", err);
      setError(err.message || "Code de vérification invalide");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm("Êtes-vous sûr de vouloir désactiver le 2FA ? Cette action réduira la sécurité de votre compte.")) {
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      await authService.disable2FA();
      setIs2FAEnabled(false);
      setQrCode(null);
      setSecret(null);
    } catch (err: any) {
      console.error("Erreur lors de la désactivation du 2FA:", err);
      setError(err.message || "Erreur lors de la désactivation du 2FA");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin mr-2" />
        <span className="text-slate-500">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-slate-900">
            Statut de l'authentification à deux facteurs
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {is2FAEnabled
              ? "Le 2FA est activé sur votre compte"
              : "Le 2FA n'est pas activé sur votre compte"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {is2FAEnabled ? (
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          ) : (
            <ShieldOff className="w-6 h-6 text-slate-400" />
          )}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {qrCode && !is2FAEnabled && (
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <p className="text-sm font-medium text-slate-900 mb-3">
            Scannez ce QR code avec votre application d'authentification
          </p>
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex-shrink-0">
              <img
                src={qrCode}
                alt="QR Code 2FA"
                className="w-48 h-48 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">
                  Code secret (à sauvegarder en lieu sûr) :
                </p>
                <code className="text-xs bg-slate-100 px-3 py-2 rounded font-mono block break-all">
                  {secret}
                </code>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-2">
                  Code de vérification (6 chiffres)
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setVerificationCode(value);
                  }}
                  placeholder="000000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono text-center tracking-widest"
                  maxLength={6}
                />
                <button
                  onClick={handleVerifyAndEnable}
                  disabled={isProcessing || verificationCode.length !== 6}
                  className="mt-2 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Vérification..." : "Vérifier et activer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {!is2FAEnabled && !qrCode ? (
          <button
            onClick={handleEnable2FA}
            disabled={isProcessing}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Activation...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Activer le 2FA
              </>
            )}
          </button>
        ) : is2FAEnabled ? (
          <button
            onClick={handleDisable2FA}
            disabled={isProcessing}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Désactivation...
              </>
            ) : (
              <>
                <ShieldOff className="w-4 h-4" />
                Désactiver le 2FA
              </>
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}

