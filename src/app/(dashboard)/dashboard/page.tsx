"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  Building2,
  FilePlus,
  Scroll,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  UploadCloud,
  FileText,
  Calendar,
  Save,
  AlertCircle,
  X,
  FileClock,
  Clock,
  Ban,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  BellRing,
  School,
  Award,
  Download,
  Printer,
  History,
  Eye,
  ArrowLeft,
  AlertTriangle,
  FileCheck,
  Maximize2,
  File,
} from "lucide-react";

// --- Types ---
type Filiere = { id: string; name: string; diplomaName: string };
type AcademicYear = { id: string; label: string; isCurrent: boolean };
type StudentDraft = {
  id: string;
  firstName: string;
  lastName: string;
  sex: "M" | "F";
  yearId: string;
  filiereId: string;
  diplomaName: string;
  mention: string;
  file: File | null;
};
type ApprovedDiploma = {
  id: string;
  studentName: string;
  diplomaTitle: string;
  year: string;
  issueDate: string;
  serialNumber: string;
  status: "active" | "revoked";
  mention: string;
  filiere: string;
};

// Types pour la gestion détaillée des demandes
type RequestItemStatus = "PENDING" | "APPROVED" | "REJECTED";

type RequestItem = {
  id: string;
  studentName: string;
  diplomaName: string;
  status: RequestItemStatus;
  rejectionReason?: string;
};

type SubmittedRequest = {
  id: string;
  reference: string;
  submissionDate: string;
  academicYear: string;
  // Totaux calculés
  totalCount: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  // Items détaillés
  items: RequestItem[];
};

// --- DATA GENERATORS ---
const generateMockRegistry = () => {
  const names = [
    "MABIALA",
    "NGUESSO",
    "OKEMBA",
    "IBARA",
    "LOUBASSOU",
    "MAKOSSO",
    "TCHIBINDA",
    "SASSOU",
    "MILONGO",
    "KOLA",
    "BOUKA",
    "GOMA",
  ];
  const firstNames = [
    "Jean",
    "Sarah",
    "Michel",
    "Grace",
    "Paul",
    "Esther",
    "David",
    "Ruth",
    "Moise",
    "Divine",
  ];
  const diplomas = [
    "Licence en Droit Public",
    "Master en Informatique",
    "Licence en Économie",
    "Master en Gestion",
    "Licence en Sociologie",
  ];

  return Array.from({ length: 45 }).map((_, i) => ({
    id: `D-2024-${100 + i}`,
    studentName: `${names[Math.floor(Math.random() * names.length)]} ${
      firstNames[Math.floor(Math.random() * firstNames.length)]
    }`,
    diplomaTitle: diplomas[Math.floor(Math.random() * diplomas.length)],
    year: Math.random() > 0.3 ? "2023-2024" : "2022-2023",
    issueDate: `1${Math.floor(Math.random() * 9)}/06/2024`,
    serialNumber: `UMNG-24-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`,
    status: Math.random() > 0.05 ? "active" : "revoked",
    mention: Math.random() > 0.5 ? "Bien" : "Assez Bien",
    filiere: "Sciences Juridiques et Administratives",
  })) as ApprovedDiploma[];
};

const generateMockHistory = () => {
  return Array.from({ length: 18 }).map((_, i) => {
    const total = Math.floor(Math.random() * 20) + 5;
    const items: RequestItem[] = [];

    // Génération des items individuels pour chaque demande
    let approved = 0;
    let rejected = 0;
    let pending = 0;

    const requestState = Math.random();

    for (let j = 0; j < total; j++) {
      let status: RequestItemStatus = "PENDING";
      let reason = undefined;

      if (requestState > 0.6) {
        if (Math.random() > 0.1) status = "APPROVED";
        else {
          status = "REJECTED";
          reason = "Scan illisible";
        }
      } else if (requestState > 0.3) {
        status = "PENDING";
      } else {
        if (Math.random() > 0.5) status = "APPROVED";
        else {
          status = "REJECTED";
          reason = "Non-conformité académique";
        }
      }

      if (status === "APPROVED") approved++;
      if (status === "REJECTED") rejected++;
      if (status === "PENDING") pending++;

      items.push({
        id: `ITM-${i}-${j}`,
        studentName: `Étudiant ${j + 1}`,
        diplomaName: "Licence en Droit",
        status,
        rejectionReason: reason,
      });
    }

    return {
      id: `REQ-${i}`,
      reference: `BORD-2024-${800 - i}`,
      submissionDate: `${Math.floor(Math.random() * 28) + 1}/11/2024`,
      academicYear: Math.random() > 0.4 ? "2023-2024" : "2022-2023",
      totalCount: total,
      approvedCount: approved,
      rejectedCount: rejected,
      pendingCount: pending,
      items,
    };
  }) as SubmittedRequest[];
};

export default function UniversityDashboard() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "institution"
    | "config"
    | "new-request"
    | "requests-history"
    | "registry"
  >("overview");

  // --- STATE DES DONNÉES ---
  const [universityName, setUniversityName] = useState(
    "Université Marien Ngouabi"
  );
  const [institutionData, setInstitutionData] = useState({
    address: "B.P. 69, Brazzaville",
    email: "contact@umng.cg",
    rector: "Pr. Gontran Ondzotto",
  });

  const [foundationYear, setFoundationYear] = useState<number>(2010);
  const [newFiliere, setNewFiliere] = useState({ name: "", diplomaName: "" });

  const [registryData, setRegistryData] = useState<ApprovedDiploma[]>(
    generateMockRegistry()
  );
  const [historyData, setHistoryData] = useState<SubmittedRequest[]>(
    generateMockHistory()
  );
  const [draftList, setDraftList] = useState<StudentDraft[]>([]);

  // States de navigation détaillée
  const [selectedRequest, setSelectedRequest] =
    useState<SubmittedRequest | null>(null);
  const [selectedDiploma, setSelectedDiploma] =
    useState<ApprovedDiploma | null>(null);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const generated: AcademicYear[] = [];
    for (let y = currentYear; y >= foundationYear; y--) {
      generated.push({
        id: y.toString(),
        label: `${y}-${y + 1}`,
        isCurrent: y === currentYear,
      });
    }
    return generated;
  }, [foundationYear]);

  const [filieres, setFilieres] = useState<Filiere[]>([
    { id: "1", name: "Droit Public", diplomaName: "Licence en Droit Public" },
    {
      id: "2",
      name: "Informatique de Gestion",
      diplomaName: "Master en Informatique Appliquée",
    },
    {
      id: "3",
      name: "Sciences Économiques",
      diplomaName: "Licence en Économie du Développement",
    },
    { id: "4", name: "Sociologie", diplomaName: "Licence en Sociologie" },
  ]);

  // --- FILTRES & PAGINATION ---
  const [registryPage, setRegistryPage] = useState(1);
  const [registrySearch, setRegistrySearch] = useState("");
  const [registryFilterYear, setRegistryFilterYear] = useState("all");
  const itemsPerRegistryPage = 8;

  const [historyPage, setHistoryPage] = useState(1);
  const [historyFilterType, setHistoryFilterType] = useState("all");
  const itemsPerHistoryPage = 6;

  const [currentEntry, setCurrentEntry] = useState<Partial<StudentDraft>>({
    sex: "M",
    mention: "Passable",
  });

  // --- LOGIQUE DE FILTRAGE ---
  const filteredRegistry = useMemo(() => {
    return registryData.filter((item) => {
      const matchesSearch =
        item.studentName.toLowerCase().includes(registrySearch.toLowerCase()) ||
        item.serialNumber
          .toLowerCase()
          .includes(registrySearch.toLowerCase()) ||
        item.diplomaTitle.toLowerCase().includes(registrySearch.toLowerCase());
      const matchesYear =
        registryFilterYear === "all" || item.year === registryFilterYear;
      return matchesSearch && matchesYear;
    });
  }, [registryData, registrySearch, registryFilterYear]);

  const paginatedRegistry = useMemo(() => {
    const start = (registryPage - 1) * itemsPerRegistryPage;
    return filteredRegistry.slice(start, start + itemsPerRegistryPage);
  }, [filteredRegistry, registryPage]);

  const totalRegistryPages = Math.ceil(
    filteredRegistry.length / itemsPerRegistryPage
  );

  const filteredHistory = useMemo(() => {
    return historyData.filter((item) => {
      if (historyFilterType === "all") return true;
      if (historyFilterType === "attention") return item.rejectedCount > 0;
      if (historyFilterType === "completed") return item.pendingCount === 0;
      return true;
    });
  }, [historyData, historyFilterType]);

  const paginatedHistory = useMemo(() => {
    const start = (historyPage - 1) * itemsPerHistoryPage;
    return filteredHistory.slice(start, start + itemsPerHistoryPage);
  }, [filteredHistory, historyPage]);

  const totalHistoryPages = Math.ceil(
    filteredHistory.length / itemsPerHistoryPage
  );

  // --- HANDLERS ---
  const handleAddFiliere = () => {
    if (!newFiliere.name || !newFiliere.diplomaName) {
      alert("Veuillez remplir le nom de la filière et l'intitulé du diplôme.");
      return;
    }
    setFilieres([...filieres, { id: Date.now().toString(), ...newFiliere }]);
    setNewFiliere({ name: "", diplomaName: "" });
  };

  const handleDeleteFiliere = (id: string) => {
    if (
      confirm(
        "Supprimer cette filière ? Cela n'affectera pas les diplômes déjà émis."
      )
    ) {
      setFilieres(filieres.filter((f) => f.id !== id));
    }
  };

  const handleAddDraft = () => {
    if (
      !currentEntry.firstName ||
      !currentEntry.lastName ||
      !currentEntry.filiereId ||
      !currentEntry.yearId
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const filiere = filieres.find((f) => f.id === currentEntry.filiereId);
    const newDraft: StudentDraft = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: currentEntry.firstName!,
      lastName: currentEntry.lastName!,
      sex: currentEntry.sex as "M" | "F",
      yearId: currentEntry.yearId!,
      filiereId: currentEntry.filiereId!,
      diplomaName: filiere ? filiere.diplomaName : "",
      mention: currentEntry.mention || "Passable",
      file: currentEntry.file || null,
    };
    setDraftList([...draftList, newDraft]);
    setCurrentEntry({
      ...currentEntry,
      firstName: "",
      lastName: "",
      file: null,
    });
  };

  const handleRemoveDraft = (id: string) => {
    setDraftList(draftList.filter((d) => d.id !== id));
  };

  const submitDraft = () => {
    const total = draftList.length;
    const items: RequestItem[] = draftList.map((d, i) => ({
      id: `NEW-${i}`,
      studentName: `${d.firstName} ${d.lastName}`,
      diplomaName: d.diplomaName,
      status: "PENDING",
    }));

    const newRequest: SubmittedRequest = {
      id: Math.random().toString(),
      reference: `BORD-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      submissionDate: new Date().toLocaleDateString("fr-FR"),
      academicYear:
        years.find((y) => y.id === draftList[0]?.yearId)?.label || "2023-2024",
      totalCount: total,
      approvedCount: 0,
      rejectedCount: 0,
      pendingCount: total,
      items,
    };

    setHistoryData([newRequest, ...historyData]);
    setDraftList([]);
    setActiveTab("requests-history");
    setHistoryPage(1);
  };

  const handleUpdateInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Paramètres de l'institution mis à jour avec succès !");
  };

  // --- UI HELPERS ---
  const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (p: number) => void;
  }) => (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
        >
          Précédent
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-700">
            Page <span className="font-medium">{currentPage}</span> sur{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700">
              {currentPage}
            </span>
            <button
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );

  const SidebarItem = ({
    id,
    icon: Icon,
    label,
  }: {
    id: typeof activeTab;
    icon: any;
    label: string;
  }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setSelectedRequest(null);
        setSelectedDiploma(null);
      }}
      className={`group w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all duration-300 relative ${
        activeTab === id
          ? "text-white bg-white/10"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {activeTab === id && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]"></div>
      )}
      <Icon
        className={`w-5 h-5 transition-transform group-hover:scale-110 ${
          activeTab === id
            ? "text-amber-400"
            : "text-slate-500 group-hover:text-slate-300"
        }`}
      />
      <span className="tracking-wide font-serif">{label}</span>
      {activeTab === id && (
        <ChevronRight className="w-4 h-4 ml-auto text-amber-500 opacity-80" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-blue-950 text-slate-300 flex flex-col fixed h-full z-30 shadow-[4px_0_24px_rgba(0,0,0,0.2)] border-r border-white/5">
        <div className="p-8 relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-blue-950 rounded-lg flex items-center justify-center shadow-lg ring-2 ring-amber-500/50">
                <School className="w-6 h-6" />
              </div>
              <div className="h-8 w-[1px] bg-white/20"></div>
              <Award className="w-8 h-8 text-amber-500 opacity-80" />
            </div>
            <div className="mt-2">
              <h1 className="font-serif font-bold text-white text-xl tracking-tight leading-none">
                CERTIF-ID
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold mt-1.5 border-t border-white/10 pt-1.5 inline-block">
                République du Congo
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-6 py-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Pilotage
            </p>
          </div>
          <SidebarItem
            id="overview"
            icon={LayoutDashboard}
            label="Tableau de bord"
          />
          <SidebarItem
            id="requests-history"
            icon={FileClock}
            label="Suivi des demandes"
          />
          <SidebarItem
            id="registry"
            icon={Scroll}
            label="Registre des diplômes"
          />
          <div className="px-6 py-3 mt-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Administration
            </p>
          </div>
          <SidebarItem
            id="new-request"
            icon={FilePlus}
            label="Émettre un diplôme"
          />
          <SidebarItem
            id="config"
            icon={Settings}
            label="Paramètres académiques"
          />
          <SidebarItem
            id="institution"
            icon={Building2}
            label="Fiche institutionnelle"
          />
        </nav>

        <div className="p-4 border-t border-white/10 bg-blue-950/50">
          <div className="flex items-center gap-3 mb-3 bg-blue-900/30 p-2 rounded-lg border border-white/5">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              UM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-serif font-medium text-white truncate">
                {universityName}
              </p>
              <p className="text-[10px] text-amber-400/80 truncate">
                Compte certifié
              </p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 text-xs text-rose-300 hover:text-white hover:bg-rose-900/30 transition-colors w-full py-2 rounded border border-transparent hover:border-rose-900/50">
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion sécurisée
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-72 relative">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, #0f172a 10px), repeating-linear-gradient(#0f172a55, #0f172a55)`,
          }}
        ></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#F8FAFC]/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-5 flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
              {activeTab === "overview" && "Vue d'ensemble"}
              {activeTab === "institution" && "Fiche Institutionnelle"}
              {activeTab === "config" && "Configuration Académique"}
              {activeTab === "new-request" && "Émission de Titres"}
              {activeTab === "requests-history" && "Historique des Demandes"}
              {activeTab === "registry" && "Registre Central"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <span className="font-serif italic text-blue-900">
                Espace Université
              </span>
              <ChevronRight className="w-3 h-3 text-amber-500" />
              <span className="text-slate-800 font-medium">
                {activeTab.replace("-", " ")}
              </span>
              {selectedRequest && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-500 font-mono">
                    {selectedRequest.reference}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-900 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 shadow-sm w-64 transition-all"
              />
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-white hover:text-blue-900 rounded-full transition-all hover:shadow-md active:scale-95">
              <BellRing className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4 relative z-10">
          {/* --- DASHBOARD OVERVIEW --- */}
          {activeTab === "overview" && (
            <>
              {/* Cartes Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Diplômes Certifiés",
                    value: registryData.length,
                    trend: "+12%",
                    color: "blue",
                    icon: Award,
                  },
                  {
                    title: "Demandes en Cours",
                    value: historyData.reduce(
                      (acc, curr) => acc + curr.pendingCount,
                      0
                    ),
                    trend: "Étudiants en attente",
                    color: "amber",
                    icon: Clock,
                  },
                  {
                    title: "Filières Actives",
                    value: filieres.length,
                    trend: "Année 2023-24",
                    color: "emerald",
                    icon: Scroll,
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="group bg-white p-6 rounded-xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden"
                  >
                    <div
                      className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 opacity-50`}
                    ></div>
                    <div className="flex justify-between items-start mb-4 relative">
                      <div
                        className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-700 ring-1 ring-${stat.color}-100`}
                      >
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="relative">
                      <h3 className="text-slate-500 text-sm font-serif font-medium">
                        {stat.title}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-3xl font-bold text-slate-900 tracking-tight">
                          {stat.value}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md bg-${stat.color}-50 text-${stat.color}-700 border border-${stat.color}-100`}
                        >
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Section d'activité */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif font-bold text-slate-800 text-lg">
                      Activité Récente
                    </h3>
                    <button
                      onClick={() => setActiveTab("requests-history")}
                      className="text-sm text-blue-900 font-medium hover:underline flex items-center gap-1"
                    >
                      Tout voir <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {historyData.slice(0, 3).map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-[#F8FAFC] border border-slate-100 hover:border-blue-200 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-white flex items-center justify-center border border-slate-200 shadow-sm text-slate-400 group-hover:text-blue-900 transition-colors">
                            <FileClock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 font-serif">
                              Demande {req.reference}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {req.submissionDate} • {req.totalCount} diplômes
                            </p>
                          </div>
                        </div>
                        {req.rejectedCount > 0 ? (
                          <span className="text-xs font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
                            <AlertTriangle className="w-3 h-3" /> Rejets
                          </span>
                        ) : req.pendingCount > 0 ? (
                          <span className="text-xs font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                            <Clock className="w-3 h-3" /> En cours
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                            <CheckCircle2 className="w-3 h-3" /> Validé
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 rounded-xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden border border-white/10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                  <h3 className="font-serif font-bold text-xl mb-1 relative z-10">
                    Espace Rapide
                  </h3>
                  <p className="text-blue-200/80 text-sm mb-8 relative z-10">
                    Accès direct aux fonctions clés
                  </p>
                  <div className="space-y-3 relative z-10">
                    <button
                      onClick={() => setActiveTab("new-request")}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 rounded-lg p-3 flex items-center gap-3 transition-all group"
                    >
                      <div className="bg-amber-500/20 p-1.5 rounded text-amber-400 group-hover:text-amber-300">
                        <FilePlus className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">
                        Nouvelle Demande
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("registry")}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 rounded-lg p-3 flex items-center gap-3 transition-all group"
                    >
                      <div className="bg-amber-500/20 p-1.5 rounded text-amber-400 group-hover:text-amber-300">
                        <Search className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">
                        Rechercher un Titre
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* --- NEW REQUEST TAB --- */}
          {activeTab === "new-request" && (
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
                        value={currentEntry.yearId}
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
                        value={currentEntry.filiereId}
                        onChange={(e) => {
                          const selected = filieres.find(
                            (f) => f.id === e.target.value
                          );
                          setCurrentEntry({
                            ...currentEntry,
                            filiereId: e.target.value,
                            diplomaName: selected ? selected.diplomaName : "",
                          });
                        }}
                      >
                        <option value="">Sélectionner...</option>
                        {filieres.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 w-full"></div>

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
                          value={currentEntry.firstName}
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
                          value={currentEntry.lastName}
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                        Intitulé Officiel
                      </label>
                      <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-500 font-serif italic">
                        {currentEntry.diplomaName ||
                          "En attente de sélection de filière..."}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                        Mention
                      </label>
                      <select
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 outline-none"
                        value={currentEntry.mention}
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

                  <div className="pt-6 flex justify-end">
                    <button
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
                      <h3 className="font-serif font-bold text-lg">
                        Votre Bordereau
                      </h3>
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
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-4 border-t border-slate-200 bg-white">
                    <button
                      onClick={submitDraft}
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
          )}

          {/* --- HISTORY TAB (DRILL DOWN) --- */}
          {activeTab === "requests-history" && !selectedRequest && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
              <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Suivi des Transmissions
                </h3>
                <div className="flex gap-2">
                  <select
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none"
                    value={historyFilterType}
                    onChange={(e) => {
                      setHistoryFilterType(e.target.value);
                      setHistoryPage(1);
                    }}
                  >
                    <option value="all">Tout l'historique</option>
                    <option value="attention">
                      Attention requise (Rejets)
                    </option>
                    <option value="completed">100% Validés</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left">Référence</th>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-left">Synthèse</th>
                      <th className="px-6 py-4 text-left">Statut Global</th>
                      <th className="px-6 py-4 text-right">Détails</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedHistory.map((req) => (
                      <tr
                        key={req.id}
                        className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedRequest(req)}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-blue-900 bg-blue-50 border border-blue-100 px-2 py-1 rounded text-xs">
                            {req.reference}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {req.submissionDate}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 text-xs font-medium">
                            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                              <CheckCircle2 className="w-3 h-3" />{" "}
                              {req.approvedCount}
                            </span>
                            <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                              <Clock className="w-3 h-3" /> {req.pendingCount}
                            </span>
                            {req.rejectedCount > 0 && (
                              <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
                                <Ban className="w-3 h-3" /> {req.rejectedCount}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {req.rejectedCount > 0 ? (
                            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Attention
                              requise
                            </span>
                          ) : req.pendingCount > 0 ? (
                            <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> En traitement
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Finalisé
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-blue-900 hover:bg-blue-100 p-2 rounded-full transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                currentPage={historyPage}
                totalPages={totalHistoryPages}
                onPageChange={setHistoryPage}
              />
            </div>
          )}

          {/* --- REQUEST DETAIL VIEW (DRILL DOWN) --- */}
          {activeTab === "requests-history" && selectedRequest && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px] animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-500 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900">
                      Détail du Bordereau {selectedRequest.reference}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {selectedRequest.items.length} étudiants • Soumis le{" "}
                      {selectedRequest.submissionDate}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Validés
                    </span>
                    <span className="text-lg font-bold text-emerald-600 leading-none">
                      {selectedRequest.approvedCount}
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Rejetés
                    </span>
                    <span className="text-lg font-bold text-rose-600 leading-none">
                      {selectedRequest.rejectedCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto p-6">
                <table className="w-full text-sm">
                  <thead className="text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left">Étudiant</th>
                      <th className="px-4 py-3 text-left">Diplôme Demandé</th>
                      <th className="px-4 py-3 text-left">Statut</th>
                      <th className="px-4 py-3 text-left">Observation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedRequest.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {item.studentName}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {item.diplomaName}
                        </td>
                        <td className="px-4 py-3">
                          {item.status === "APPROVED" && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <CheckCircle2 className="w-3 h-3" /> Validé
                            </span>
                          )}
                          {item.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              <Clock className="w-3 h-3" /> En attente
                            </span>
                          )}
                          {item.status === "REJECTED" && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                              <Ban className="w-3 h-3" /> Rejeté
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {item.status === "REJECTED" ? (
                            <span className="text-rose-600 text-xs font-medium">
                              {item.rejectionReason}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- REGISTRY TAB (Visualisation) --- */}
          {activeTab === "registry" && !selectedDiploma && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
              {/* ... (Header et Filtres identiques) ... */}
              <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Registre Central
                </h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900/10 outline-none w-64"
                      value={registrySearch}
                      onChange={(e) => {
                        setRegistrySearch(e.target.value);
                        setRegistryPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left">N° Série</th>
                      <th className="px-6 py-4 text-left">Récipiendaire</th>
                      <th className="px-6 py-4 text-left">Titre Délivré</th>
                      <th className="px-6 py-4 text-left">Statut</th>
                      <th className="px-6 py-4 text-right">Détails</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedRegistry.map((dip) => (
                      <tr
                        key={dip.id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-bold text-slate-500">
                            {dip.serialNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {dip.studentName}
                        </td>
                        <td className="px-6 py-4 text-blue-900 font-medium">
                          {dip.diplomaTitle}
                        </td>
                        <td className="px-6 py-4">
                          {dip.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Valide
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                              Révoqué
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedDiploma(dip)}
                            className="text-slate-400 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-full transition-colors"
                            title="Voir le diplôme"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                currentPage={registryPage}
                totalPages={totalRegistryPages}
                onPageChange={setRegistryPage}
              />
            </div>
          )}

          {/* --- VUE DÉTAIL DIPLÔME (FILE PREVIEW) --- */}
          {activeTab === "registry" && selectedDiploma && (
            <div className="flex flex-col h-[calc(100vh-140px)] animate-in zoom-in-95 duration-300">
              {/* Header Navigation */}
              <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedDiploma(null)}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-900 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" /> Retour au registre
                  </button>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Dossier {selectedDiploma.serialNumber}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Document original certifié
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-blue-950 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-900 flex items-center gap-2 text-sm transition-colors">
                    <Download className="w-4 h-4" /> Télécharger
                  </button>
                  <button className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-2 text-sm transition-colors">
                    <Printer className="w-4 h-4" /> Imprimer
                  </button>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                {/* Colonne Gauche: Métadonnées */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-900" />
                      Métadonnées
                    </h3>
                  </div>
                  <div className="p-6 overflow-y-auto space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                        Récipiendaire
                      </h4>
                      <div>
                        <p className="text-sm text-slate-500">Nom Complet</p>
                        <p className="font-medium text-slate-900 text-lg">
                          {selectedDiploma.studentName}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                        Cursus Académique
                      </h4>
                      <div>
                        <p className="text-sm text-slate-500">
                          Intitulé du Diplôme
                        </p>
                        <p className="font-medium text-blue-900">
                          {selectedDiploma.diplomaTitle}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Filière</p>
                        <p className="font-medium text-slate-800">
                          {selectedDiploma.filiere}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500">Promotion</p>
                          <p className="font-medium text-slate-800">
                            {selectedDiploma.year}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Mention</p>
                          <span className="inline-block bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded font-bold mt-1">
                            {selectedDiploma.mention}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                        Certification
                      </h4>
                      <div>
                        <p className="text-sm text-slate-500">
                          Numéro de Série Unique
                        </p>
                        <p className="font-mono text-sm font-bold text-slate-900 bg-slate-100 p-2 rounded border border-slate-200 mt-1">
                          {selectedDiploma.serialNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">
                          Date d'émission
                        </p>
                        <p className="font-medium text-slate-800">
                          {selectedDiploma.issueDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Statut</p>
                        <div className="mt-1">
                          {selectedDiploma.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Valide &
                              Authentique
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                              Révoqué
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colonne Droite: Prévisualisation Fichier */}
                <div className="lg:col-span-2 bg-slate-900 rounded-xl shadow-inner border border-slate-800 flex flex-col overflow-hidden relative group">
                  {/* PDF Viewer Toolbar */}
                  <div className="bg-slate-950 text-slate-400 px-4 py-3 flex justify-between items-center text-xs border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <File className="w-4 h-4" />
                      <span className="font-mono text-slate-300">
                        {selectedDiploma.serialNumber}.pdf
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>Page 1 / 1</span>
                      <div className="h-4 w-px bg-white/10"></div>
                      <div className="flex gap-2">
                        <button className="hover:text-white transition-colors">
                          -
                        </button>
                        <span>100%</span>
                        <button className="hover:text-white transition-colors">
                          +
                        </button>
                      </div>
                      <div className="h-4 w-px bg-white/10"></div>
                      <button
                        className="hover:text-white transition-colors"
                        title="Plein écran"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* PDF Canvas Area (Simulated) */}
                  <div className="flex-1 bg-slate-800 overflow-auto flex items-center justify-center p-8 relative">
                    {/* Document Simulation */}
                    <div className="bg-white w-full max-w-[500px] aspect-[1/1.414] shadow-2xl flex flex-col relative transition-transform duration-300 group-hover:scale-[1.01]">
                      {/* Loading / Placeholder State */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-slate-300" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-400">
                            Aperçu du document
                          </p>
                          <p className="text-xs text-slate-300 mt-1">
                            Fichier original uploadé par l'établissement
                          </p>
                        </div>
                      </div>
                      {/* Overlay Action */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button className="bg-white text-slate-900 px-4 py-2 rounded-full shadow-lg font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                          <Eye className="w-4 h-4" /> Ouvrir le PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- INSTITUTION TAB --- */}
          {activeTab === "institution" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                <div className="w-16 h-16 bg-blue-950 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-2xl text-slate-900">
                    Fiche Institutionnelle
                  </h3>
                  <p className="text-slate-500">
                    Gérez les informations officielles de votre établissement.
                  </p>
                </div>
              </div>
              <form onSubmit={handleUpdateInstitution} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Nom Officiel
                    </label>
                    <input
                      type="text"
                      value={universityName}
                      onChange={(e) => setUniversityName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 text-slate-500 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Certifié par l'État
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Recteur / Directeur
                    </label>
                    <input
                      type="text"
                      value={institutionData.rector}
                      onChange={(e) =>
                        setInstitutionData({
                          ...institutionData,
                          rector: e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-900/10 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Email de contact
                    </label>
                    <input
                      type="email"
                      value={institutionData.email}
                      onChange={(e) =>
                        setInstitutionData({
                          ...institutionData,
                          email: e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-900/10 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Adresse Postale
                    </label>
                    <input
                      type="text"
                      value={institutionData.address}
                      onChange={(e) =>
                        setInstitutionData({
                          ...institutionData,
                          address: e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-900/10 outline-none"
                    />
                  </div>
                </div>
                <div className="pt-6 flex justify-end border-t border-slate-100">
                  <button
                    type="submit"
                    className="bg-blue-950 text-white px-6 py-3 rounded-lg hover:bg-blue-900 shadow-lg flex items-center gap-2 font-medium"
                  >
                    <Save className="w-4 h-4" /> Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- CONFIG TAB --- */}
          {activeTab === "config" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    Catalogue des Filières
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Ajoutez les filières et associez les diplômes
                    correspondants.
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto max-h-[500px] p-6 space-y-4">
                  {filieres.map((f) => (
                    <div
                      key={f.id}
                      className="group flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{f.name}</p>
                        <p className="text-xs text-blue-800 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
                          {f.diplomaName}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteFiliere(f.id)}
                        className="text-slate-300 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {filieres.length === 0 && (
                    <p className="text-center text-slate-400 py-4">
                      Aucune filière configurée.
                    </p>
                  )}
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
                  <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wide">
                    Nouvelle Filière
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nom de la filière (ex: Géographie)"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900/10 outline-none"
                      value={newFiliere.name}
                      onChange={(e) =>
                        setNewFiliere({ ...newFiliere, name: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Intitulé du diplôme (ex: Licence en Géographie)"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900/10 outline-none"
                      value={newFiliere.diplomaName}
                      onChange={(e) =>
                        setNewFiliere({
                          ...newFiliere,
                          diplomaName: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={handleAddFiliere}
                      className="w-full bg-blue-950 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-900 flex justify-center items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Ajouter au catalogue
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                      <History className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-slate-900">
                        Historique Académique
                      </h3>
                      <p className="text-sm text-slate-500">
                        Définissez la profondeur de l'historique disponible.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">
                      Année de la première promotion
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-900/10 outline-none"
                        value={foundationYear}
                        onChange={(e) =>
                          setFoundationYear(Number(e.target.value))
                        }
                      />
                      <div className="px-6 py-3 bg-slate-100 rounded-lg text-slate-500 text-sm flex items-center font-medium">
                        à {new Date().getFullYear()}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      Cette action mettra à jour automatiquement toutes les
                      listes de sélection d'années dans l'application.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-h-[300px] overflow-hidden flex flex-col">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">
                    Aperçu des années actives ({years.length})
                  </h3>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                    {years.map((y) => (
                      <div
                        key={y.id}
                        className={`flex justify-between items-center p-2 rounded text-sm ${
                          y.isCurrent
                            ? "bg-green-50 text-green-700 font-bold border border-green-200"
                            : "bg-slate-50 text-slate-600 border border-slate-100"
                        }`}
                      >
                        <span>{y.label}</span>
                        {y.isCurrent && (
                          <span className="text-[10px] uppercase tracking-wider">
                            En cours
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
