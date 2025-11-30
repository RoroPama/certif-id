"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  FileCheck,
  Scroll,
  Settings,
  LogOut,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  BellRing,
  Landmark,
  ShieldCheck,
  Eye,
  Ban,
  Save,
  GraduationCap,
  FileText,
  Clock,
  Download,
  Plus,
  Trash2,
  Mail,
  Users,
  Printer,
  ArrowLeft,
  File,
  Maximize2,
  X,
  ListChecks,
  AlertTriangle,
  Send,
  UploadCloud,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
  RefreshCcw,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

// --- TYPES ---

type UniversityStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";
type RequestStatus = "PENDING" | "PARTIAL" | "COMPLETED";
type ItemStatus = "PENDING" | "APPROVED" | "REJECTED";

type Filiere = {
  id: string;
  name: string;
  diplomas: string[];
};

type University = {
  id: string;
  name: string;
  type: "PUBLIC" | "PRIVE";
  rector: string;
  email: string;
  city: string;
  status: UniversityStatus;
  diplomaCount: number;
  lastActivity: string;
  filieres: Filiere[];
  phone?: string;
  address?: string;
  description?: string;
};

type StudentItem = {
  id: string;
  firstName: string;
  lastName: string;
  diplomaTitle: string;
  mention: string;
  promotion: string;
  status: ItemStatus;
  rejectionReason?: string;
  birthDate?: string;
  matricule?: string;
  transcriptFile?: string;
};

type CertificationRequest = {
  id: string;
  reference: string;
  universityId: string;
  universityName: string;
  submissionDate: string;
  totalStudents: number;
  processedCount: number;
  status: RequestStatus;
  items: StudentItem[];
};

type RegistryEntry = {
  id: string;
  serialNumber: string;
  studentName: string;
  universityName: string;
  diplomaTitle: string;
  filiere: string;
  mention: string;
  promotion: string;
  issueDate: string;
  year: string;
  status: "VALIDE" | "REVOQUE";
};

// --- CUSTOM COMPONENTS ---

// NOUVEAU COMPOSANT: Selecteur avec recherche intégrée
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  icon: Icon,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  icon?: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState(""); // Texte affiché dans l'input
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchroniser l'input avec la valeur sélectionnée
  useEffect(() => {
    if (!isOpen) {
      if (value === "all") {
        setText("");
      } else {
        const selectedOption = options.find((o) => o.value === value);
        setText(selectedOption ? selectedOption.label : "");
      }
    }
  }, [value, isOpen, options]);

  // Fermer si on clique dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(text.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Zone de l'input / trigger */}
      <div
        className={`w-full px-3 py-2.5 bg-slate-50 border ${
          isOpen
            ? "border-blue-500 ring-1 ring-blue-500/20 bg-white"
            : "border-slate-200"
        } rounded-lg text-sm text-slate-700 flex items-center gap-2 transition-all cursor-text`}
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.select(), 0);
          }
          inputRef.current?.focus();
        }}
      >
        {Icon && (
          <Icon
            className={`w-4 h-4 flex-shrink-0 ${
              isOpen ? "text-blue-500" : "text-slate-400"
            }`}
          />
        )}

        <input
          ref={inputRef}
          type="text"
          className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-500 truncate font-medium"
          placeholder={placeholder}
          value={text}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto custom-scrollbar">
          <div
            className="px-3 py-2 hover:bg-slate-50 text-sm cursor-pointer text-slate-500 italic transition-colors"
            onClick={() => handleSelect("all")}
          >
            Tout afficher
          </div>
          {filteredOptions.map((opt) => (
            <div
              key={opt.value}
              className={`px-3 py-2 hover:bg-blue-50 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                value === opt.value
                  ? "bg-blue-50 text-blue-900 font-bold"
                  : "text-slate-700"
              }`}
              onClick={() => handleSelect(opt.value)}
            >
              <span className="truncate">{opt.label}</span>
              {value === opt.value && (
                <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />
              )}
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <div className="px-3 py-4 text-xs text-slate-400 text-center">
              Aucun résultat trouvé pour "{text}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- MOCK DATA ---

const MOCK_UNIVERSITIES: University[] = [
  {
    id: "U1",
    name: "Université Marien Ngouabi",
    type: "PUBLIC",
    rector: "Pr. Gontran Ondzotto",
    email: "contact@umng.cg",
    city: "Brazzaville",
    status: "ACTIVE",
    diplomaCount: 12500,
    lastActivity: "Aujourd'hui",
    description: "Principal établissement public d'enseignement supérieur.",
    filieres: [
      {
        id: "F1",
        name: "Droit Public",
        diplomas: [
          "Licence en Droit Public",
          "Master Droit Public",
          "Doctorat Droit",
        ],
      },
      {
        id: "F2",
        name: "Sciences Économiques",
        diplomas: ["Licence Économie", "Master Macroéconomie"],
      },
    ],
  },
  {
    id: "U2",
    name: "École Supérieure de Technologie",
    type: "PRIVE",
    rector: "Dr. Sarah Makosso",
    email: "info@est.cg",
    city: "Pointe-Noire",
    status: "ACTIVE",
    diplomaCount: 850,
    lastActivity: "Hier",
    description: "Institut privé spécialisé dans les nouvelles technologies.",
    filieres: [
      {
        id: "F3",
        name: "Génie Logiciel",
        diplomas: ["Licence Pro Dév. Web", "Master Ingénierie Logicielle"],
      },
    ],
  },
  {
    id: "U3",
    name: "Institut de Management",
    type: "PRIVE",
    rector: "M. Jean Bouka",
    email: "admin@img.cg",
    city: "Brazzaville",
    status: "PENDING",
    diplomaCount: 0,
    lastActivity: "20/11/2024",
    filieres: [],
  },
  {
    id: "U4",
    name: "Université Denis Sassou Nguesso",
    type: "PUBLIC",
    rector: "Pr. Ange Antoine Abena",
    email: "contact@udsn.cg",
    city: "Kintélé",
    status: "ACTIVE",
    diplomaCount: 3200,
    lastActivity: "Il y a 2 jours",
    filieres: [],
  },
];

const MOCK_REQUESTS: CertificationRequest[] = [
  {
    id: "REQ-101",
    reference: "BORD-UMNG-2024-001",
    universityId: "U1",
    universityName: "Université Marien Ngouabi",
    submissionDate: "30/11/2024",
    totalStudents: 5,
    processedCount: 0,
    status: "PENDING",
    items: [
      {
        id: "ST-1",
        firstName: "MABIALA",
        lastName: "Jean",
        diplomaTitle: "Licence en Droit",
        mention: "Bien",
        promotion: "2023-2024",
        status: "PENDING",
        birthDate: "12/04/1998",
        matricule: "24-UMNG-001",
      },
      {
        id: "ST-2",
        firstName: "NGUESSO",
        lastName: "Sarah",
        diplomaTitle: "Licence en Droit",
        mention: "Passable",
        promotion: "2023-2024",
        status: "PENDING",
        birthDate: "05/09/1999",
        matricule: "24-UMNG-002",
      },
      {
        id: "ST-3",
        firstName: "OKEMBA",
        lastName: "Paul",
        diplomaTitle: "Licence en Droit",
        mention: "Assez Bien",
        promotion: "2023-2024",
        status: "PENDING",
        birthDate: "23/11/1997",
        matricule: "24-UMNG-003",
      },
      {
        id: "ST-4",
        firstName: "IBARA",
        lastName: "Alice",
        diplomaTitle: "Licence en Droit",
        mention: "Bien",
        promotion: "2023-2024",
        status: "PENDING",
        birthDate: "10/02/1999",
        matricule: "24-UMNG-004",
      },
      {
        id: "ST-5",
        firstName: "LOUBASSOU",
        lastName: "Marc",
        diplomaTitle: "Licence en Droit",
        mention: "Très Bien",
        promotion: "2023-2024",
        status: "PENDING",
        birthDate: "15/07/1998",
        matricule: "24-UMNG-005",
      },
    ],
  },
  {
    id: "REQ-102",
    reference: "BORD-EST-2024-045",
    universityId: "U2",
    universityName: "École Supérieure de Technologie",
    submissionDate: "28/11/2024",
    totalStudents: 3,
    processedCount: 3,
    status: "COMPLETED",
    items: [
      {
        id: "ST-6",
        firstName: "MAKOSSO",
        lastName: "Pierre",
        diplomaTitle: "Master Info",
        mention: "Bien",
        promotion: "2023",
        status: "APPROVED",
        birthDate: "01/01/1995",
        matricule: "23-EST-88",
      },
      {
        id: "ST-7",
        firstName: "TCHIBINDA",
        lastName: "Lucie",
        diplomaTitle: "Master Info",
        mention: "Excellente",
        promotion: "2023",
        status: "APPROVED",
        birthDate: "14/03/1996",
        matricule: "23-EST-89",
      },
      {
        id: "ST-8",
        firstName: "SASSOU",
        lastName: "Denis Jr",
        diplomaTitle: "Master Info",
        mention: "Passable",
        promotion: "2023",
        status: "REJECTED",
        rejectionReason: "Relevé de notes manquant",
        birthDate: "20/05/1997",
        matricule: "23-EST-90",
      },
    ],
  },
];

const MOCK_REGISTRY: RegistryEntry[] = Array.from({ length: 150 }).map(
  (_, i) => {
    const years = ["2020", "2021", "2022", "2023", "2024"];
    const year = years[Math.floor(Math.random() * years.length)];

    return {
      id: `REG-${i}`,
      serialNumber: `CG-${year.slice(2)}-${1000 + i}`,
      studentName: `Étudiant ${i + 1}`,
      universityName:
        i % 3 === 0
          ? "Université Marien Ngouabi"
          : i % 3 === 1
          ? "École Supérieure de Technologie"
          : "Université Denis Sassou Nguesso",
      diplomaTitle:
        i % 4 === 0
          ? "Licence Droit"
          : i % 4 === 1
          ? "Master Gestion"
          : i % 4 === 2
          ? "Génie Civil"
          : "Médecine",
      filiere:
        i % 4 === 0
          ? "Sciences Juridiques"
          : i % 4 === 1
          ? "Sciences de Gestion"
          : i % 4 === 2
          ? "Polytechnique"
          : "Santé",
      mention: i % 3 === 0 ? "Bien" : "Passable",
      promotion: `${parseInt(year) - 1}-${year}`,
      issueDate: `15/06/${year}`,
      year: year,
      status: Math.random() > 0.95 ? "REVOQUE" : "VALIDE",
    };
  }
);

const ITEMS_PER_PAGE = 8;

// --- HELPERS ---
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white mt-auto">
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
          Page <span className="font-bold text-slate-900">{currentPage}</span>{" "}
          sur <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div>
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-bold text-blue-900">
            {currentPage}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
);

// --- COMPONENT ---

export default function GovernmentDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "universities" | "requests" | "registry"
  >("overview");

  // States
  const [universities, setUniversities] = useState(MOCK_UNIVERSITIES);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [registry, setRegistry] = useState(MOCK_REGISTRY);

  // Selection pour Drill-Down
  const [selectedRequest, setSelectedRequest] =
    useState<CertificationRequest | null>(null);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [selectedRegistryEntry, setSelectedRegistryEntry] =
    useState<RegistryEntry | null>(null);
  const [selectedStudentDetail, setSelectedStudentDetail] =
    useState<StudentItem | null>(null);

  // Mode création
  const [isCreatingUniversity, setIsCreatingUniversity] = useState(false);
  const [createMode, setCreateMode] = useState<"manual" | "bulk">("manual");

  // Form States for Creation/Edit
  const [newUniForm, setNewUniForm] = useState<Partial<University>>({
    type: "PRIVE",
    filieres: [],
  });
  const [newFiliereName, setNewFiliereName] = useState("");
  const [tempDiplomaInput, setTempDiplomaInput] = useState("");
  const [newFiliereDiplomasList, setNewFiliereDiplomasList] = useState<
    string[]
  >([]);

  // Rejection Modal
  const [rejectingItem, setRejectingItem] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Bulk Action Modal
  const [bulkRejectModalOpen, setBulkRejectModalOpen] = useState(false);
  const [bulkRejectionReason, setBulkRejectionReason] = useState("");

  // Pagination States
  const [requestPage, setRequestPage] = useState(1);
  const [registryPage, setRegistryPage] = useState(1);
  const [universityPage, setUniversityPage] = useState(1);

  // General Filters (Lists)
  const [searchQuery, setSearchQuery] = useState("");
  const [universityFilter, setUniversityFilter] = useState("all");
  const [requestFilterStatus, setRequestFilterStatus] = useState("all");

  // --- ADVANCED DASHBOARD FILTERS STATE ---
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advFilterUni, setAdvFilterUni] = useState("all");
  const [advFilterType, setAdvFilterType] = useState("all");
  const [advFilterYear, setAdvFilterYear] = useState("all");
  const [advFilterFiliere, setAdvFilterFiliere] = useState("all");

  // --- ANALYTICS CALCULATIONS (DYNAMIC) ---
  const dashboardStats = useMemo(() => {
    // 1. Global Filtering for Analytics
    let filteredReg = registry;
    let filteredReq = requests;
    let filteredUni = universities;

    if (advFilterUni !== "all") {
      filteredReg = filteredReg.filter(
        (r) => r.universityName === advFilterUni
      );
      filteredReq = filteredReq.filter(
        (r) => r.universityName === advFilterUni
      );
      filteredUni = filteredUni.filter((u) => u.name === advFilterUni);
    }

    if (advFilterType !== "all") {
      const matchingUniNames = universities
        .filter((u) => u.type === advFilterType)
        .map((u) => u.name);
      filteredReg = filteredReg.filter((r) =>
        matchingUniNames.includes(r.universityName)
      );
      filteredReq = filteredReq.filter((r) =>
        matchingUniNames.includes(r.universityName)
      );
      filteredUni = filteredUni.filter((u) => u.type === advFilterType);
    }

    if (advFilterYear !== "all") {
      filteredReg = filteredReg.filter((r) => r.year === advFilterYear);
      // Approximation for requests based on submission date
      filteredReq = filteredReq.filter((r) =>
        r.submissionDate.includes(advFilterYear)
      );
    }

    if (advFilterFiliere !== "all") {
      filteredReg = filteredReg.filter((r) => r.filiere === advFilterFiliere);
    }

    // 2. KPI Calculation
    const totalDiplomas = filteredReg.length;
    const activeUniversities = filteredUni.filter(
      (u) => u.status === "ACTIVE"
    ).length;
    const pendingRequests = filteredReq
      .filter((r) => r.status === "PENDING")
      .reduce((acc, r) => acc + (r.totalStudents - r.processedCount), 0);

    const totalItemsProcessed = filteredReq.reduce(
      (acc, r) => acc + r.processedCount,
      0
    );
    const rejectedItems = filteredReq.reduce(
      (acc, r) => acc + r.items.filter((i) => i.status === "REJECTED").length,
      0
    );
    const rejectionRate =
      totalItemsProcessed > 0
        ? ((rejectedItems / totalItemsProcessed) * 100).toFixed(1)
        : "0";

    // 3. Charts Data Preparation

    // Chart 1: Activity by Year (Dynamic)
    const activityByYear: { [key: string]: number } = {};
    filteredReg.forEach((r) => {
      activityByYear[r.year] = (activityByYear[r.year] || 0) + 1;
    });
    // Fill missing years for better visual
    const years = ["2020", "2021", "2022", "2023", "2024"];
    const chartData = years.map((year) => ({
      year,
      count: activityByYear[year] || 0,
      heightPercent: Math.max(
        10,
        Math.min(
          100,
          ((activityByYear[year] || 0) /
            Math.max(...Object.values(activityByYear), 1)) *
            100
        )
      ),
    }));

    // Chart 2: Top Filieres
    const filiereCounts: { [key: string]: number } = {};
    filteredReg.forEach((r) => {
      filiereCounts[r.filiere] = (filiereCounts[r.filiere] || 0) + 1;
    });
    const topFilieres = Object.entries(filiereCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / totalDiplomas) * 100) || 0,
      }));

    return {
      totalDiplomas,
      activeUniversities,
      pendingRequests,
      rejectionRate,
      topFilieres,
      chartData,
      publicCount: filteredUni.filter((u) => u.type === "PUBLIC").length,
      privateCount: filteredUni.filter((u) => u.type === "PRIVE").length,
    };
  }, [
    registry,
    universities,
    requests,
    advFilterUni,
    advFilterYear,
    advFilterType,
    advFilterFiliere,
  ]);

  // Extract unique values for filter dropdowns - Memoized options for SearchableSelect
  const uniOptions = useMemo(
    () => universities.map((u) => ({ value: u.name, label: u.name })),
    [universities]
  );
  const filiereOptions = useMemo(
    () =>
      Array.from(new Set(registry.map((r) => r.filiere))).map((f) => ({
        value: f,
        label: f,
      })),
    [registry]
  );
  const yearOptions = useMemo(
    () =>
      Array.from(new Set(registry.map((r) => r.year)))
        .sort()
        .map((y) => ({ value: y, label: `Année ${y}` })),
    [registry]
  );
  const typeOptions = useMemo(
    () => [
      { value: "PUBLIC", label: "Public" },
      { value: "PRIVE", label: "Privé" },
    ],
    []
  );

  const resetAdvancedFilters = () => {
    setAdvFilterUni("all");
    setAdvFilterType("all");
    setAdvFilterYear("all");
    setAdvFilterFiliere("all");
  };

  // --- FILTERS & PAGINATION LOGIC ---

  // Requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.reference.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        requestFilterStatus === "all"
          ? true
          : requestFilterStatus === "pending"
          ? req.status === "PENDING" || req.status === "PARTIAL"
          : req.status === "COMPLETED";
      return matchesSearch && matchesFilter;
    });
  }, [requests, searchQuery, requestFilterStatus]);

  const paginatedRequests = useMemo(() => {
    const start = (requestPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRequests, requestPage]);

  // Universities
  const filteredUniversities = useMemo(() => {
    return universities.filter((uni) => {
      const matchesSearch = uni.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        universityFilter === "all" ? true : uni.type === universityFilter;
      return matchesSearch && matchesFilter;
    });
  }, [universities, searchQuery, universityFilter]);

  const paginatedUniversities = useMemo(() => {
    const start = (universityPage - 1) * ITEMS_PER_PAGE;
    return filteredUniversities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUniversities, universityPage]);

  // Registry
  const filteredRegistry = useMemo(() => {
    return registry.filter(
      (reg) =>
        reg.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [registry, searchQuery]);

  const paginatedRegistry = useMemo(() => {
    const start = (registryPage - 1) * ITEMS_PER_PAGE;
    return filteredRegistry.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRegistry, registryPage]);

  // --- ACTIONS ---

  const handleCreateUniversity = () => {
    if (createMode === "manual") {
      if (!newUniForm.name || !newUniForm.email)
        return alert("Nom et Email obligatoires");

      const newUni: University = {
        id: `U${Date.now()}`,
        name: newUniForm.name,
        type: newUniForm.type as "PUBLIC" | "PRIVE",
        rector: newUniForm.rector || "",
        email: newUniForm.email,
        city: newUniForm.city || "",
        status: "PENDING",
        diplomaCount: 0,
        lastActivity: "Jamais",
        filieres: newUniForm.filieres || [],
      };

      setUniversities([newUni, ...universities]);
      alert(
        `Établissement créé avec succès.\nUn email d'activation a été envoyé à ${newUni.email}.`
      );
    } else {
      alert(
        "Importation de 5 établissements réussie depuis le fichier Excel.\nLes emails d'activation ont été envoyés."
      );
    }
    setIsCreatingUniversity(false);
    setNewUniForm({ type: "PRIVE", filieres: [] });
  };

  const handleUpdateUniversity = () => {
    if (!selectedUniversity) return;
    setUniversities((prev) =>
      prev.map((u) => (u.id === selectedUniversity.id ? selectedUniversity : u))
    );
    alert("Modifications enregistrées.");
  };

  const handleStatusChange = (status: UniversityStatus) => {
    if (!selectedUniversity) return;
    const updated = { ...selectedUniversity, status };
    setSelectedUniversity(updated);
    setUniversities((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );

    if (status === "ACTIVE") alert("Compte activé.");
    if (status === "SUSPENDED") alert("Compte suspendu.");
  };

  const handleAddDiplomaToList = () => {
    if (!tempDiplomaInput.trim()) return;
    setNewFiliereDiplomasList([
      ...newFiliereDiplomasList,
      tempDiplomaInput.trim(),
    ]);
    setTempDiplomaInput("");
  };

  const handleRemoveDiplomaFromList = (index: number) => {
    setNewFiliereDiplomasList(
      newFiliereDiplomasList.filter((_, i) => i !== index)
    );
  };

  const handleAddFiliere = (isEditing: boolean) => {
    if (!newFiliereName || newFiliereDiplomasList.length === 0) {
      return alert("Veuillez saisir un nom de filière et au moins un diplôme.");
    }

    const newFiliere: Filiere = {
      id: `F${Date.now()}`,
      name: newFiliereName,
      diplomas: [...newFiliereDiplomasList],
    };

    if (isEditing && selectedUniversity) {
      setSelectedUniversity({
        ...selectedUniversity,
        filieres: [...selectedUniversity.filieres, newFiliere],
      });
    } else {
      setNewUniForm({
        ...newUniForm,
        filieres: [...(newUniForm.filieres || []), newFiliere],
      });
    }
    setNewFiliereName("");
    setNewFiliereDiplomasList([]);
  };

  const handleRemoveFiliere = (filiereId: string, isEditing: boolean) => {
    if (isEditing && selectedUniversity) {
      setSelectedUniversity({
        ...selectedUniversity,
        filieres: selectedUniversity.filieres.filter((f) => f.id !== filiereId),
      });
    } else {
      setNewUniForm({
        ...newUniForm,
        filieres: (newUniForm.filieres || []).filter((f) => f.id !== filiereId),
      });
    }
  };

  const handleProcessItem = (
    reqId: string,
    itemId: string,
    status: ItemStatus,
    reason?: string
  ) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== reqId) return req;

        const updatedItems = req.items.map((item) =>
          item.id === itemId
            ? { ...item, status, rejectionReason: reason }
            : item
        );

        const processed = updatedItems.filter(
          (i) => i.status !== "PENDING"
        ).length;
        const reqStatus =
          processed === req.totalStudents ? "COMPLETED" : "PARTIAL";

        if (selectedRequest?.id === reqId) {
          setSelectedRequest({
            ...req,
            items: updatedItems,
            processedCount: processed,
            status: reqStatus,
          });
        }

        return {
          ...req,
          items: updatedItems,
          processedCount: processed,
          status: reqStatus,
        };
      })
    );

    setRejectingItem(null);
    setRejectionReason("");
  };

  const handleBulkValidate = () => {
    if (!selectedRequest) return;
    const reqId = selectedRequest.id;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== reqId) return req;
        const updatedItems = req.items.map((item) =>
          item.status === "PENDING"
            ? { ...item, status: "APPROVED" as ItemStatus }
            : item
        );
        const processed = updatedItems.length;
        const updatedReq = {
          ...req,
          items: updatedItems,
          processedCount: processed,
          status: "COMPLETED" as RequestStatus,
        };

        if (selectedRequest?.id === reqId) setSelectedRequest(updatedReq);
        return updatedReq;
      })
    );

    alert("Tous les éléments en attente ont été validés.");
  };

  const handleBulkReject = () => {
    if (!selectedRequest || !bulkRejectionReason) return;
    const reqId = selectedRequest.id;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== reqId) return req;
        const updatedItems = req.items.map((item) =>
          item.status === "PENDING"
            ? {
                ...item,
                status: "REJECTED" as ItemStatus,
                rejectionReason: bulkRejectionReason,
              }
            : item
        );
        const processed = updatedItems.length;
        const updatedReq = {
          ...req,
          items: updatedItems,
          processedCount: processed,
          status: "COMPLETED" as RequestStatus,
        };

        if (selectedRequest?.id === reqId) setSelectedRequest(updatedReq);
        return updatedReq;
      })
    );

    setBulkRejectModalOpen(false);
    setBulkRejectionReason("");
    alert("Tous les éléments en attente ont été rejetés.");
  };

  // --- UI COMPONENTS ---

  const SidebarItem = ({ id, icon: Icon, label, badge }: any) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setSelectedRequest(null);
        setSelectedUniversity(null);
        setIsCreatingUniversity(false);
        setSelectedRegistryEntry(null);
        setSelectedStudentDetail(null);
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
      {badge > 0 && (
        <span className="ml-auto bg-amber-500 text-blue-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-blue-950 text-slate-300 flex flex-col fixed h-full z-30 shadow-[4px_0_24px_rgba(0,0,0,0.2)] border-r border-white/5">
        <div className="p-8 relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-blue-950 rounded-lg flex items-center justify-center shadow-lg ring-2 ring-amber-500/50">
                <Landmark className="w-6 h-6" />
              </div>
              <div className="h-8 w-[1px] bg-white/20"></div>
              <ShieldCheck className="w-8 h-8 text-amber-500 opacity-80" />
            </div>
            <div className="mt-2">
              <h1 className="font-serif font-bold text-white text-xl tracking-tight leading-none">
                CERTIF-GOUV
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold mt-1.5 border-t border-white/10 pt-1.5 inline-block">
                Ministère Ens. Sup.
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-6 py-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Supervision
            </p>
          </div>
          <SidebarItem
            id="overview"
            icon={LayoutDashboard}
            label="Vue d'ensemble"
          />
          <SidebarItem
            id="requests"
            icon={FileCheck}
            label="Demandes de Certif."
            badge={requests.filter((r) => r.status === "PENDING").length}
          />
          <div className="px-6 py-3 mt-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Administration
            </p>
          </div>
          <SidebarItem
            id="universities"
            icon={Building2}
            label="Établissements"
            badge={universities.filter((u) => u.status === "PENDING").length}
          />
          <SidebarItem id="registry" icon={Scroll} label="Registre National" />
          <SidebarItem id="config" icon={Settings} label="Paramètres Système" />
        </nav>

        <div className="p-4 border-t border-white/10 bg-blue-950/50">
          <div className="flex items-center gap-3 mb-3 bg-blue-900/30 p-2 rounded-lg border border-white/5">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              MIN
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-serif font-medium text-white truncate">
                Direction Examens
              </p>
              <p className="text-[10px] text-amber-400/80 truncate">
                Admin. National
              </p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 text-xs text-rose-300 hover:text-white hover:bg-rose-900/30 transition-colors w-full py-2 rounded border border-transparent hover:border-rose-900/50">
            <LogOut className="w-3.5 h-3.5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-72 relative">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, #0f172a 10px), repeating-linear-gradient(#0f172a55, #0f172a55)`,
          }}
        ></div>

        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#F8FAFC]/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-5 flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
              {activeTab === "overview" && "Tableau de Bord National"}
              {activeTab === "universities" && "Gestion des Établissements"}
              {activeTab === "requests" && "Validation des Diplômes"}
              {activeTab === "registry" && "Registre National Centralisé"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <span className="font-serif italic text-blue-900">
                Espace Gouvernemental
              </span>
              <ChevronRight className="w-3 h-3 text-amber-500" />
              <span className="text-slate-800 font-medium">
                République du Congo
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-900 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher (réf, nom, ID)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
          {/* --- OVERVIEW 2.0 (DYNAMIQUE) --- */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* ADVANCED FILTERS BAR (TOGGLEABLE) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-500 ease-in-out">
                <div
                  className="p-4 bg-white flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors rounded-xl"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        showAdvancedFilters
                          ? "bg-blue-900 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">
                        Filtres & Analyses
                      </h3>
                      <p className="text-xs text-slate-500">
                        Affiner les données du tableau de bord
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      showAdvancedFilters ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* IMPORTANT FIX: Removed 'overflow-hidden' from container and this div 
                    to allow dropdowns to overflow correctly 
                 */}
                {showAdvancedFilters && (
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Critères de sélection
                      </span>
                      <button
                        onClick={resetAdvancedFilters}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium transition-colors px-3 py-1 rounded hover:bg-rose-50"
                      >
                        <RefreshCcw className="w-3 h-3" /> Réinitialiser tout
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <SearchableSelect
                        options={uniOptions}
                        value={advFilterUni}
                        onChange={setAdvFilterUni}
                        placeholder="Toutes les Universités"
                        icon={Building2}
                      />
                      <SearchableSelect
                        options={typeOptions}
                        value={advFilterType}
                        onChange={setAdvFilterType}
                        placeholder="Tous Types"
                        icon={Landmark}
                      />
                      <SearchableSelect
                        options={yearOptions}
                        value={advFilterYear}
                        onChange={setAdvFilterYear}
                        placeholder="Toutes Années"
                        icon={Clock}
                      />
                      <SearchableSelect
                        options={filiereOptions}
                        value={advFilterFiliere}
                        onChange={setAdvFilterFiliere}
                        placeholder="Toutes Filières"
                        icon={GraduationCap}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* KEY STATS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    title: "Diplômes Certifiés",
                    value: dashboardStats.totalDiplomas,
                    color: "blue",
                    icon: GraduationCap,
                    trend: "+12%",
                  },
                  {
                    title: "Universités Actives",
                    value: dashboardStats.activeUniversities,
                    color: "emerald",
                    icon: Building2,
                    trend: "Stable",
                  },
                  {
                    title: "Étudiants en Attente",
                    value: dashboardStats.pendingRequests,
                    color: "amber",
                    icon: Users,
                    trend: "Urgent",
                  },
                  {
                    title: "Taux de Rejet",
                    value: `${dashboardStats.rejectionRate}%`,
                    color: "rose",
                    icon: Ban,
                    trend: "-0.5%",
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="group bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
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
                      <span
                        className={`flex items-center text-xs font-bold px-2 py-1 rounded bg-${stat.color}-50 text-${stat.color}-700`}
                      >
                        <Activity className="w-3 h-3 mr-1" /> {stat.trend}
                      </span>
                    </div>
                    <div className="relative">
                      <h3 className="text-slate-500 text-sm font-serif font-medium">
                        {stat.title}
                      </h3>
                      <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ANALYTICS SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Chart Dynamic */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-900" />
                        Activité de Certification
                      </h3>
                      <p className="text-sm text-slate-500">
                        Diplômes certifiés par année
                      </p>
                    </div>
                  </div>
                  {/* Dynamic Bar Chart */}
                  <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-2 border-b border-slate-100 min-h-[250px]">
                    {dashboardStats.chartData.map((item, i) => (
                      <div
                        key={i}
                        className="w-full flex flex-col items-center gap-2 group relative"
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-10 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg font-bold">
                          {item.count} Diplômes
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                        </div>

                        <div className="w-full bg-slate-50 rounded-t-sm relative h-56 overflow-hidden group-hover:bg-blue-50 transition-colors flex flex-col justify-end">
                          <div
                            className="w-full bg-blue-900 rounded-t-sm transition-all duration-1000 hover:bg-blue-700 relative"
                            style={{ height: `${item.heightPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-500 font-bold">
                          {item.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distribution / Top Filieres */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
                  <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-blue-900" />
                    Top Filières
                  </h3>

                  <div className="flex-1 flex flex-col justify-center space-y-6">
                    {dashboardStats.topFilieres.map((f, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-700 truncate max-w-[150px]">
                            {f.name}
                          </span>
                          <span className="font-bold text-slate-900">
                            {f.percent}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              i === 0
                                ? "bg-emerald-500"
                                : i === 1
                                ? "bg-blue-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${f.percent}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {f.count} diplômes
                        </p>
                      </div>
                    ))}
                    {dashboardStats.topFilieres.length === 0 && (
                      <p className="text-center text-slate-400 text-sm">
                        Aucune donnée pour cette sélection
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        Public
                      </p>
                      <p className="text-xl font-bold text-slate-800">
                        {dashboardStats.publicCount}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        Privé
                      </p>
                      <p className="text-xl font-bold text-slate-800">
                        {dashboardStats.privateCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- UNIVERSITIES MANAGEMENT --- */}
          {activeTab === "universities" &&
            !isCreatingUniversity &&
            !selectedUniversity && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    Liste des Établissements
                  </h3>
                  <div className="flex gap-2">
                    <select
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none"
                      value={universityFilter}
                      onChange={(e) => setUniversityFilter(e.target.value)}
                    >
                      <option value="all">Tous les types</option>
                      <option value="PUBLIC">Public</option>
                      <option value="PRIVE">Privé</option>
                    </select>
                    <button
                      onClick={() => setIsCreatingUniversity(true)}
                      className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Ajouter Établissement
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Institution</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Activité</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedUniversities.map((uni) => (
                        <tr
                          key={uni.id}
                          className="hover:bg-slate-50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                                {uni.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">
                                  {uni.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {uni.city}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                uni.type === "PUBLIC"
                                  ? "bg-slate-100 text-slate-700"
                                  : "bg-indigo-50 text-indigo-700"
                              }`}
                            >
                              {uni.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            <p className="font-medium">{uni.rector}</p>
                            <p className="text-xs">{uni.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">
                              {uni.diplomaCount}
                            </p>
                            <p className="text-xs text-slate-400">
                              Diplômes émis
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            {uni.status === "ACTIVE" ? (
                              <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-100 w-fit">
                                <CheckCircle2 className="w-3 h-3" /> Actif
                              </span>
                            ) : uni.status === "SUSPENDED" ? (
                              <span className="flex items-center gap-1 text-rose-600 text-xs font-bold bg-rose-50 px-2 py-1 rounded border border-rose-100 w-fit">
                                <Ban className="w-3 h-3" /> Suspendu
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded border border-amber-100 w-fit">
                                <Clock className="w-3 h-3" /> En attente
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setSelectedUniversity(uni)}
                              className="text-slate-400 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors flex items-center gap-2 ml-auto"
                            >
                              <Settings className="w-4 h-4" /> Gérer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={universityPage}
                  totalPages={Math.ceil(
                    filteredUniversities.length / ITEMS_PER_PAGE
                  )}
                  onPageChange={setUniversityPage}
                />
              </div>
            )}

          {/* --- CREATE UNIVERSITY VIEW (COMPLET) --- */}
          {activeTab === "universities" && isCreatingUniversity && (
            <div className="max-w-4xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsCreatingUniversity(false)}
                    className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-blue-900 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    Nouvel Établissement
                  </h3>
                </div>
                {/* Switch Mode Creation */}
                <div className="flex bg-slate-200 rounded-lg p-1">
                  <button
                    onClick={() => setCreateMode("manual")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      createMode === "manual"
                        ? "bg-white shadow text-slate-900"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Formulaire Unique
                  </button>
                  <button
                    onClick={() => setCreateMode("bulk")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
                      createMode === "bulk"
                        ? "bg-white shadow text-slate-900"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Import Excel
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {createMode === "manual" ? (
                  <>
                    {/* Section Fiche Institutionnelle */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Building2 className="w-5 h-5 text-blue-900" /> Fiche
                        Institutionnelle
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nom de l'établissement
                          </label>
                          <input
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900/10 outline-none"
                            value={newUniForm.name || ""}
                            onChange={(e) =>
                              setNewUniForm({
                                ...newUniForm,
                                name: e.target.value,
                              })
                            }
                            placeholder="Ex: Université de ..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Type
                          </label>
                          <select
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900/10 outline-none"
                            value={newUniForm.type}
                            onChange={(e) =>
                              setNewUniForm({
                                ...newUniForm,
                                type: e.target.value as any,
                              })
                            }
                          >
                            <option value="PUBLIC">Public</option>
                            <option value="PRIVE">Privé</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Ville
                          </label>
                          <input
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900/10 outline-none"
                            value={newUniForm.city || ""}
                            onChange={(e) =>
                              setNewUniForm({
                                ...newUniForm,
                                city: e.target.value,
                              })
                            }
                            placeholder="Ex: Brazzaville"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Recteur / Directeur
                          </label>
                          <input
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900/10 outline-none"
                            value={newUniForm.rector || ""}
                            onChange={(e) =>
                              setNewUniForm({
                                ...newUniForm,
                                rector: e.target.value,
                              })
                            }
                            placeholder="Nom complet"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email Officiel (pour activation)
                          </label>
                          <input
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900/10 outline-none"
                            value={newUniForm.email || ""}
                            onChange={(e) =>
                              setNewUniForm({
                                ...newUniForm,
                                email: e.target.value,
                              })
                            }
                            placeholder="contact@etablissement.cg"
                            type="email"
                          />
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> Un email contenant les
                            accès sera envoyé à cette adresse.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section Paramètres Académiques (Refonte UI) */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <GraduationCap className="w-5 h-5 text-blue-900" />{" "}
                        Paramètres Académiques
                      </h4>
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <div className="flex flex-col gap-6">
                          {/* Étape 1 : Nom de la filière */}
                          <div>
                            <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">
                              1. Nom de la Filière
                            </label>
                            <input
                              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-900/10 outline-none"
                              placeholder="Ex: Sciences Juridiques"
                              value={newFiliereName}
                              onChange={(e) =>
                                setNewFiliereName(e.target.value)
                              }
                            />
                          </div>

                          {/* Étape 2 : Ajout des diplômes */}
                          <div className="p-4 bg-white border border-slate-100 rounded-lg">
                            <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">
                              2. Ajouter les Diplômes associés
                            </label>
                            <div className="flex gap-2 mb-3">
                              <input
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors"
                                placeholder="Ex: Licence en Droit Public"
                                value={tempDiplomaInput}
                                onChange={(e) =>
                                  setTempDiplomaInput(e.target.value)
                                }
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleAddDiplomaToList()
                                }
                              />
                              <button
                                onClick={handleAddDiplomaToList}
                                className="bg-slate-200 text-slate-700 hover:bg-slate-300 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Liste visuelle des diplômes */}
                            {newFiliereDiplomasList.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {newFiliereDiplomasList.map((dip, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 text-xs font-medium flex items-center gap-2"
                                  >
                                    {dip}
                                    <button
                                      onClick={() =>
                                        handleRemoveDiplomaFromList(idx)
                                      }
                                      className="hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic">
                                Aucun diplôme ajouté pour l'instant.
                              </p>
                            )}
                          </div>

                          {/* Étape 3 : Validation Filière */}
                          <button
                            onClick={() => handleAddFiliere(false)}
                            className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-800 transition-all shadow-md flex justify-center items-center gap-2"
                            disabled={
                              !newFiliereName ||
                              newFiliereDiplomasList.length === 0
                            }
                          >
                            <Plus className="w-4 h-4" /> Ajouter cette filière
                            au catalogue
                          </button>
                        </div>

                        {/* Liste des filières déjà ajoutées */}
                        <div className="mt-8 space-y-3">
                          <h5 className="text-xs font-bold text-slate-400 uppercase">
                            Filières configurées (
                            {newUniForm.filieres?.length || 0})
                          </h5>
                          {newUniForm.filieres?.map((f) => (
                            <div
                              key={f.id}
                              className="flex flex-col gap-2 bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-blue-200 transition-colors"
                            >
                              <div className="flex justify-between items-center border-b border-slate-50 pb-2 mb-1">
                                <span className="font-bold text-slate-900">
                                  {f.name}
                                </span>
                                <button
                                  onClick={() =>
                                    handleRemoveFiliere(f.id, false)
                                  }
                                  className="text-slate-300 hover:text-rose-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {f.diplomas.map((dip, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 font-medium"
                                  >
                                    {dip}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                          {(!newUniForm.filieres ||
                            newUniForm.filieres.length === 0) && (
                            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
                              <p className="text-sm text-slate-400">
                                Aucune filière n'a encore été ajoutée.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // BULK UPLOAD VIEW
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                      <FileSpreadsheet className="w-10 h-10 text-blue-900" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">
                        Importation en Masse
                      </h4>
                      <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                        Ajoutez plusieurs établissements simultanément en
                        utilisant le fichier modèle Excel officiel.
                      </p>
                    </div>

                    <div className="w-full max-w-md bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group">
                      <UploadCloud className="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:text-blue-500 transition-colors" />
                      <p className="font-medium text-slate-700">
                        Cliquez pour upload ou glissez le fichier ici
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        Formats acceptés: .xlsx, .csv
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline">
                        <Download className="w-4 h-4" /> Télécharger le modèle
                        Excel
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setIsCreatingUniversity(false)}
                    className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreateUniversity}
                    className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all flex items-center gap-2 transform active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    {createMode === "manual"
                      ? "Valider l'enregistrement"
                      : "Lancer l'importation"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- MANAGE UNIVERSITY (EDIT) --- */}
          {activeTab === "universities" && selectedUniversity && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
              {/* Top Navigation & Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedUniversity(null)}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Retour à la liste</span>
                </button>
                <div className="flex items-center gap-3">
                  {selectedUniversity.status === "ACTIVE" ? (
                    <button
                      onClick={() => handleStatusChange("SUSPENDED")}
                      className="bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all"
                    >
                      <Ban className="w-4 h-4" /> Suspendre
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange("ACTIVE")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Activer l'accès
                    </button>
                  )}
                  <button
                    onClick={handleUpdateUniversity}
                    className="bg-blue-950 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-900 flex items-center gap-2 transition-all"
                  >
                    <Save className="w-4 h-4" /> Sauvegarder
                  </button>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Identity Card */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                    <div className="h-24 bg-gradient-to-r from-blue-900 to-blue-950 relative">
                      <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-lg bg-white p-1 shadow-md">
                        <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center text-slate-400 font-bold text-xl">
                          {selectedUniversity.name
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="pt-10 pb-6 px-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-1">
                        {selectedUniversity.name}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="w-3 h-3" />{" "}
                          {selectedUniversity.city}
                        </span>
                        <span>•</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold text-slate-600">
                          {selectedUniversity.type}
                        </span>
                      </div>

                      <div className="space-y-3 mt-6 pt-6 border-t border-slate-100">
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase">
                            Recteur / Directeur
                          </label>
                          <p className="text-sm font-medium text-slate-800">
                            {selectedUniversity.rector}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase">
                            Email Contact
                          </label>
                          <p className="text-sm font-medium text-slate-800">
                            {selectedUniversity.email}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase">
                            Statut Actuel
                          </label>
                          <div className="mt-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                selectedUniversity.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {selectedUniversity.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Configuration & Academics */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Configuration Settings */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-blue-900" />{" "}
                      Configuration Générale
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Nom de l'établissement
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                          value={selectedUniversity.name}
                          onChange={(e) =>
                            setSelectedUniversity({
                              ...selectedUniversity,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Ville
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                          value={selectedUniversity.city}
                          onChange={(e) =>
                            setSelectedUniversity({
                              ...selectedUniversity,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Description (Fiche publique)
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-20 resize-none"
                          placeholder="Description courte..."
                          defaultValue={selectedUniversity.description || ""}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Programs */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-900" />{" "}
                        Offre de Formation
                      </h3>
                    </div>

                    {/* Add New Filiere UI */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">
                        Ajouter une nouvelle filière
                      </h4>
                      <div className="space-y-4">
                        <div className="flex-1">
                          <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">
                            Nom de la Filière
                          </label>
                          <input
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                            placeholder="Nom de la filière"
                            value={newFiliereName}
                            onChange={(e) => setNewFiliereName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">
                            Ajouter Diplômes (Un par un)
                          </label>
                          <div className="flex gap-2">
                            <input
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                              placeholder="Ex: Licence"
                              value={tempDiplomaInput}
                              onChange={(e) =>
                                setTempDiplomaInput(e.target.value)
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleAddDiplomaToList()
                              }
                            />
                            <button
                              onClick={handleAddDiplomaToList}
                              className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {newFiliereDiplomasList.map((dip, idx) => (
                              <span
                                key={idx}
                                className="bg-white border border-slate-300 text-slate-700 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                              >
                                {dip}
                                <button
                                  onClick={() =>
                                    handleRemoveDiplomaFromList(idx)
                                  }
                                  className="hover:text-red-500"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddFiliere(true)}
                          className="w-full bg-blue-950 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors"
                        >
                          Enregistrer la filière
                        </button>
                      </div>
                    </div>

                    {/* List Existing Filieres */}
                    <div className="space-y-4">
                      {selectedUniversity.filieres.map((f) => (
                        <div
                          key={f.id}
                          className="border border-slate-100 rounded-lg p-4 hover:border-slate-200 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-800">
                              {f.name}
                            </h4>
                            <button
                              onClick={() => handleRemoveFiliere(f.id, true)}
                              className="text-slate-300 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {f.diplomas.map((dip, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-100 font-medium"
                              >
                                {dip}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                      {selectedUniversity.filieres.length === 0 && (
                        <div className="text-center py-8 text-slate-400 italic">
                          Aucune filière configurée pour le moment.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- REQUESTS & VALIDATION (LISTE) --- */}
          {activeTab === "requests" &&
            !selectedRequest &&
            !selectedStudentDetail && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900">
                      Demandes de Certification
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Cliquez sur un bordereau pour examiner les diplômes
                      étudiants.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-900/10"
                      value={requestFilterStatus}
                      onChange={(e) => setRequestFilterStatus(e.target.value)}
                    >
                      <option value="all">Tout afficher</option>
                      <option value="pending">En attente / Partiel</option>
                      <option value="completed">Terminé</option>
                    </select>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 flex-1">
                  {paginatedRequests.map((req) => (
                    <div
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className="p-6 flex items-center justify-between hover:bg-blue-50/50 cursor-pointer transition-all group border-l-4 border-transparent hover:border-blue-900"
                    >
                      <div className="flex items-center gap-6">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm border ${
                            req.status === "PENDING"
                              ? "bg-amber-50 border-amber-100 text-amber-600"
                              : "bg-emerald-50 border-emerald-100 text-emerald-600"
                          }`}
                        >
                          <Scroll className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 text-lg">
                              {req.universityName}
                            </h4>
                            <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded border border-slate-200 font-mono">
                              {req.reference}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Soumis le{" "}
                              {req.submissionDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" /> {req.totalStudents}{" "}
                              Étudiants
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                            Progression
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-900 transition-all duration-500"
                                style={{
                                  width: `${
                                    (req.processedCount / req.totalStudents) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-slate-700">
                              {req.processedCount}/{req.totalStudents}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-900 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={requestPage}
                  totalPages={Math.ceil(
                    filteredRequests.length / ITEMS_PER_PAGE
                  )}
                  onPageChange={setRequestPage}
                />
              </div>
            )}

          {/* --- REQUEST DRILL DOWN (DETAILS) --- */}
          {activeTab === "requests" &&
            selectedRequest &&
            !selectedStudentDetail && (
              <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300">
                {/* Header Navigation */}
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-blue-900 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-slate-900">
                        Validation : {selectedRequest.universityName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Réf: {selectedRequest.reference} •{" "}
                        {selectedRequest.submissionDate}
                      </p>
                    </div>
                  </div>

                  {/* BULK ACTIONS BUTTONS */}
                  <div className="flex gap-3">
                    {selectedRequest.status !== "COMPLETED" && (
                      <>
                        <button
                          onClick={handleBulkValidate}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-colors"
                        >
                          <ListChecks className="w-4 h-4" /> Tout Valider
                        </button>
                        <button
                          onClick={() => setBulkRejectModalOpen(true)}
                          className="bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-colors"
                        >
                          <XCircle className="w-4 h-4" /> Tout Rejeter
                        </button>
                      </>
                    )}

                    {/* STATS INDICATORS */}
                    <div className="h-8 w-px bg-slate-200 mx-2"></div>
                    <div className="flex gap-2">
                      <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 text-xs font-bold flex flex-col items-center justify-center leading-none">
                        <span className="opacity-70 text-[9px] uppercase">
                          Validés
                        </span>
                        {
                          selectedRequest.items.filter(
                            (i) => i.status === "APPROVED"
                          ).length
                        }
                      </div>
                      <div className="px-3 py-1 bg-rose-50 text-rose-700 rounded border border-rose-100 text-xs font-bold flex flex-col items-center justify-center leading-none">
                        <span className="opacity-70 text-[9px] uppercase">
                          Rejetés
                        </span>
                        {
                          selectedRequest.items.filter(
                            (i) => i.status === "REJECTED"
                          ).length
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left">Détail</th>
                        <th className="px-6 py-4 text-left">Étudiant</th>
                        <th className="px-6 py-4 text-left">Diplôme Demandé</th>
                        <th className="px-6 py-4 text-left">Mention</th>
                        <th className="px-6 py-4 text-left">Statut</th>
                        <th className="px-6 py-4 text-right">
                          Action Individuelle
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedRequest.items.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedStudentDetail(item)}
                              className="p-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                              title="Voir dossier complet"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {item.firstName} {item.lastName}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {item.diplomaTitle}
                            <div className="text-xs text-slate-400">
                              Promo {item.promotion}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold">
                              {item.mention}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {item.status === "APPROVED" && (
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Validé
                              </span>
                            )}
                            {item.status === "REJECTED" && (
                              <span className="text-rose-600 font-bold flex items-center gap-1">
                                <Ban className="w-4 h-4" /> Rejeté
                              </span>
                            )}
                            {item.status === "PENDING" && (
                              <span className="text-amber-600 font-bold flex items-center gap-1">
                                <Clock className="w-4 h-4" /> À traiter
                              </span>
                            )}

                            {item.rejectionReason && (
                              <p className="text-xs text-rose-500 mt-1 italic">
                                "{item.rejectionReason}"
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {item.status === "PENDING" ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setRejectingItem(item.id)}
                                  className="p-2 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                  title="Rejeter"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleProcessItem(
                                      selectedRequest.id,
                                      item.id,
                                      "APPROVED"
                                    )
                                  }
                                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold text-xs shadow-sm flex items-center gap-2 transition-colors"
                                >
                                  <CheckCircle2 className="w-4 h-4" /> Valider
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs italic">
                                Traité
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MODAL: Individual Rejection Dialog */}
                {rejectingItem && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-96 animate-in zoom-in-95">
                      <h4 className="font-bold text-lg mb-2 text-rose-600 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" /> Motif du Rejet
                      </h4>
                      <p className="text-sm text-slate-500 mb-4">
                        Veuillez justifier le rejet pour l'université.
                      </p>
                      <textarea
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-rose-200 outline-none h-24 resize-none mb-4"
                        placeholder="Ex: Document manquant, Scan illisible..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        autoFocus
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setRejectingItem(null);
                            setRejectionReason("");
                          }}
                          className="text-slate-500 hover:bg-slate-100 px-3 py-2 rounded text-sm font-medium"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() =>
                            handleProcessItem(
                              selectedRequest.id,
                              rejectingItem,
                              "REJECTED",
                              rejectionReason
                            )
                          }
                          className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-700 shadow-sm"
                        >
                          Confirmer
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL: Bulk Rejection Dialog */}
                {bulkRejectModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-96 animate-in zoom-in-95 border-t-4 border-rose-600">
                      <h4 className="font-bold text-lg mb-2 text-rose-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />{" "}
                        Rejet Global
                      </h4>
                      <p className="text-sm text-slate-600 mb-4">
                        Vous êtes sur le point de rejeter{" "}
                        <strong>tous les éléments en attente</strong>. Ce motif
                        sera appliqué à l'ensemble du lot.
                      </p>
                      <textarea
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-rose-200 outline-none h-24 resize-none mb-4"
                        placeholder="Ex: Dossier non conforme au nouveau standard..."
                        value={bulkRejectionReason}
                        onChange={(e) => setBulkRejectionReason(e.target.value)}
                        autoFocus
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setBulkRejectModalOpen(false);
                            setBulkRejectionReason("");
                          }}
                          className="text-slate-500 hover:bg-slate-100 px-3 py-2 rounded text-sm font-medium"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleBulkReject}
                          className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-700 shadow-sm"
                        >
                          Tout Rejeter
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* --- STUDENT DETAIL IMMERSIVE VIEW (FULL SCREEN SPLIT - NO DOWNLOAD) --- */}
          {activeTab === "requests" && selectedStudentDetail && (
            <div className="flex flex-col h-[calc(100vh-140px)] animate-in zoom-in-95 duration-300">
              {/* Header Navigation */}
              <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedStudentDetail(null)}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-900 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" /> Retour à la demande
                  </button>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Détails Candidat: {selectedStudentDetail.firstName}{" "}
                      {selectedStudentDetail.lastName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Vérification des pièces justificatives
                    </p>
                  </div>
                </div>
                {/* No download buttons here as requested */}
              </div>

              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                {/* Colonne Gauche: Métadonnées */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-900" />
                      Informations Étudiant
                    </h3>
                  </div>
                  <div className="p-6 overflow-y-auto space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                        Identité
                      </h4>
                      <div>
                        <p className="text-sm text-slate-500">Nom Complet</p>
                        <p className="font-medium text-slate-900 text-lg">
                          {selectedStudentDetail.firstName}{" "}
                          {selectedStudentDetail.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">
                          Date de Naissance
                        </p>
                        <p className="font-medium text-slate-900">
                          {selectedStudentDetail.birthDate || "Non renseigné"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                        Dossier Académique
                      </h4>
                      <div>
                        <p className="text-sm text-slate-500">Diplôme Visé</p>
                        <p className="font-medium text-blue-900">
                          {selectedStudentDetail.diplomaTitle}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Matricule</p>
                        <p className="font-medium text-slate-800">
                          {selectedStudentDetail.matricule || "N/A"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500">Promotion</p>
                          <p className="font-medium text-slate-800">
                            {selectedStudentDetail.promotion}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Mention</p>
                          <span className="inline-block bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded font-bold mt-1">
                            {selectedStudentDetail.mention}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                        Statut Actuel
                      </h4>
                      <div>
                        <div className="mt-1">
                          {selectedStudentDetail.status === "APPROVED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Validé
                            </span>
                          )}
                          {selectedStudentDetail.status === "REJECTED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <Ban className="w-3 h-3" /> Rejeté
                            </span>
                          )}
                          {selectedStudentDetail.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3" /> En attente
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colonne Droite: Prévisualisation Fichier (Visualisation Seule) */}
                <div className="lg:col-span-2 bg-slate-900 rounded-xl shadow-inner border border-slate-800 flex flex-col overflow-hidden relative group">
                  <div className="bg-slate-950 text-slate-400 px-4 py-3 flex justify-between items-center text-xs border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <File className="w-4 h-4" />
                      <span className="font-mono text-slate-300">
                        Piece_Jointe_Releve.pdf
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-amber-500 font-bold uppercase tracking-wider text-[10px]">
                        Lecture Seule
                      </span>
                    </div>
                  </div>

                  {/* PDF Canvas Area (Simulated) */}
                  <div className="flex-1 bg-slate-800 overflow-auto flex items-center justify-center p-8 relative">
                    {/* Document Simulation */}
                    <div className="bg-white w-full max-w-[500px] aspect-[1/1.414] shadow-2xl flex flex-col relative">
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-slate-300" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-400">
                            Aperçu du relevé de notes
                          </p>
                          <p className="text-xs text-slate-300 mt-1">
                            Document soumis pour certification
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- REGISTRY TAB (NATIONAL VIEW) --- */}
          {activeTab === "registry" && !selectedRegistryEntry && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
              <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    Registre National des Diplômes
                  </h3>
                  <p className="text-sm text-slate-500">
                    Base de données centralisée de tous les titres certifiés.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-blue-300 hover:text-blue-900 transition-colors">
                    <Filter className="w-4 h-4" /> Filtrer
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-blue-950 text-white rounded-lg text-sm font-medium hover:bg-blue-900 shadow-sm transition-colors">
                    <Download className="w-4 h-4" /> Exporter Données
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Numéro Série</th>
                      <th className="px-6 py-4">Récipiendaire</th>
                      <th className="px-6 py-4">Université émettrice</th>
                      <th className="px-6 py-4">Titre</th>
                      <th className="px-6 py-4">Date Émission</th>
                      <th className="px-6 py-4">État</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedRegistry.map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                          {entry.serialNumber}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {entry.studentName}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {entry.universityName}
                        </td>
                        <td className="px-6 py-4 text-blue-900 font-medium">
                          {entry.diplomaTitle}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {entry.issueDate}
                        </td>
                        <td className="px-6 py-4">
                          {entry.status === "VALIDE" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase">
                              Valide
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold uppercase">
                              Révoqué
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedRegistryEntry(entry)}
                            className="text-blue-900 hover:bg-blue-50 p-2 rounded-full"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={registryPage}
                totalPages={Math.ceil(filteredRegistry.length / ITEMS_PER_PAGE)}
                onPageChange={setRegistryPage}
              />
            </div>
          )}

          {/* --- REGISTRY DETAIL IMMERSIVE VIEW (FULL SCREEN SPLIT) --- */}
          {activeTab === "registry" && selectedRegistryEntry && (
            <div className="flex flex-col h-[calc(100vh-140px)] animate-in zoom-in-95 duration-300">
              {/* Header Navigation */}
              <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedRegistryEntry(null)}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-900 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" /> Retour au registre
                  </button>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Dossier {selectedRegistryEntry.serialNumber}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Document certifié - Archives Nationales
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
                      Métadonnées Officielles
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
                          {selectedRegistryEntry.studentName}
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
                          {selectedRegistryEntry.diplomaTitle}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Université</p>
                        <p className="font-medium text-slate-800">
                          {selectedRegistryEntry.universityName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Filière</p>
                        <p className="font-medium text-slate-800">
                          {selectedRegistryEntry.filiere}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500">Promotion</p>
                          <p className="font-medium text-slate-800">
                            {selectedRegistryEntry.promotion}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Mention</p>
                          <span className="inline-block bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded font-bold mt-1">
                            {selectedRegistryEntry.mention}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                        Authentification
                      </h4>
                      <div>
                        <p className="text-sm text-slate-500">
                          Numéro de Série Unique
                        </p>
                        <p className="font-mono text-sm font-bold text-slate-900 bg-slate-100 p-2 rounded border border-slate-200 mt-1">
                          {selectedRegistryEntry.serialNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">
                          Date d'émission
                        </p>
                        <p className="font-medium text-slate-800">
                          {selectedRegistryEntry.issueDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Statut</p>
                        <div className="mt-1">
                          {selectedRegistryEntry.status === "VALIDE" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Valide
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
                        {selectedRegistryEntry.serialNumber}.pdf
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
                            Aperçu du diplôme certifié
                          </p>
                          <p className="text-xs text-slate-300 mt-1">
                            Document officiel généré par le système
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
        </div>
      </main>

      {/* MapPinIcon definition locally as it was missing in lucide-react import */}
      <div className="hidden">
        {/* Helper to fix potential missing icon error if not imported */}
      </div>
    </div>
  );
}

// Helper icon component since it wasn't imported initially
function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
