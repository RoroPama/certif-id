"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Printer,
  User,
  GraduationCap,
  Shield,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import type { RegistryEntry } from "../../types";

interface RegistryDetailPageClientProps {
  entry: RegistryEntry;
}

export default function RegistryDetailPageClient({
  entry,
}: RegistryDetailPageClientProps) {
  const { government } = MESSAGES;
  const detailMsg = government.pages.registry.detail;

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href={GOVERNMENT_ROUTES.REGISTRY}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> {detailMsg.backToRegistry}
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              {entry.serialNumber}
            </h3>
            <p className="text-xs text-slate-500">{detailMsg.documentInfo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            {detailMsg.download}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Printer className="w-4 h-4" />
            {detailMsg.print}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Metadata Panel */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-emerald-50 border-b border-emerald-100">
            <h4 className="font-bold text-emerald-900 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {detailMsg.metadata}
            </h4>
          </div>
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-400px)]">
            {/* Récipiendaire */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="w-3 h-3" />
                {detailMsg.sections.recipient}
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">
                    {detailMsg.fields.fullName}
                  </p>
                  <p className="font-bold text-slate-900">{entry.studentName}</p>
                </div>
              </div>
            </div>

            {/* Cursus Académique */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <GraduationCap className="w-3 h-3" />
                {detailMsg.sections.academic}
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">
                    {detailMsg.fields.diplomaTitle}
                  </p>
                  <p className="font-bold text-slate-900">{entry.diplomaTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    {detailMsg.fields.university}
                  </p>
                  <p className="font-medium text-slate-700">
                    {entry.universityName}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">
                      {detailMsg.fields.filiere}
                    </p>
                    <p className="font-medium text-slate-700">{entry.filiere}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">
                      {detailMsg.fields.promotion}
                    </p>
                    <p className="font-medium text-slate-700">{entry.promotion}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    {detailMsg.fields.mention}
                  </p>
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm font-bold">
                    {entry.mention}
                  </span>
                </div>
              </div>
            </div>

            {/* Authentification */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Shield className="w-3 h-3" />
                {detailMsg.sections.authentication}
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">
                    {detailMsg.fields.serialNumber}
                  </p>
                  <p className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                    {entry.serialNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    {detailMsg.fields.issueDate}
                  </p>
                  <p className="font-medium text-slate-700">{entry.issueDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    {detailMsg.fields.status}
                  </p>
                  {entry.status === "VALIDE" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      {MESSAGES.status.active}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-bold">
                      <XCircle className="w-4 h-4" />
                      {MESSAGES.status.revoked}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-800">
                {detailMsg.preview.title}
              </h4>
              <p className="text-xs text-slate-500">
                {detailMsg.preview.description}
              </p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-medium transition-colors">
              <ExternalLink className="w-4 h-4" />
              {detailMsg.preview.openPdf}
            </button>
          </div>
          <div className="flex-1 bg-slate-100 flex items-center justify-center p-8 min-h-[400px]">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl aspect-[1/1.414] flex flex-col items-center justify-center text-center border border-slate-200">
              {/* Simulated diploma preview */}
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-emerald-600" />
              </div>
              <p className="text-lg font-serif font-bold text-slate-800 mb-2">
                RÉPUBLIQUE DU CONGO
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Ministère de l&apos;Enseignement Supérieur
              </p>
              <div className="border-t border-b border-slate-200 py-4 px-8 mb-6">
                <p className="text-2xl font-serif font-bold text-emerald-800">
                  {entry.diplomaTitle}
                </p>
              </div>
              <p className="text-slate-600 mb-2">Décerné à</p>
              <p className="text-xl font-bold text-slate-900 mb-4">
                {entry.studentName}
              </p>
              <p className="text-sm text-slate-500">
                Mention: <span className="font-bold">{entry.mention}</span> •
                Promotion: <span className="font-bold">{entry.promotion}</span>
              </p>
              <div className="mt-8 pt-4 border-t border-slate-100 w-full">
                <p className="text-xs text-slate-400">
                  N° {entry.serialNumber} • Émis le {entry.issueDate}
                </p>
                <p className="text-xs text-emerald-600 font-bold mt-1">
                  ✓ Document authentifié par CERTIF-GOUV
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

