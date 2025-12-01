/**
 * Constantes de messages et textes de l'application
 * Stocke tous les messages, labels, textes affichés dans l'UI
 */

export const MESSAGES = {
  // ============================================================================
  // MESSAGES D'ERREUR GÉNÉRAUX
  // ============================================================================
  errors: {
    generic: "Une erreur est survenue",
    network: "Une erreur réseau est survenue",
    unauthorized: "Vous n'êtes pas autorisé à effectuer cette action",
    forbidden: "Accès interdit",
    notFound: "Ressource introuvable",
    serverError: "Erreur serveur",
    timeout: "La requête a expiré",
  },

  // ============================================================================
  // MESSAGES D'AUTHENTIFICATION
  // ============================================================================
  auth: {
    login: {
      title: "Connexion",
      emailLabel: "Adresse Email Institutionnelle",
      emailPlaceholder: "exemple@universite.cg",
      passwordLabel: "Mot de Passe",
      passwordPlaceholder: "Entrez votre mot de passe",
      submitButton: "Accéder à l'espace sécurisé",
      incorrectCredentials: "Email ou mot de passe incorrect",
      success: "Connexion réussie",
      forgotPassword: "Mot de passe oublié ?",
      noAccount: "Pas encore de compte ?",
      register: "Demander un accès",
    },
    otp: {
      title: "Double Authentification",
      description: "Un code temporaire a été envoyé à",
      codeLabel: "Code de Vérification",
      codePlaceholder: "Ex: 123456",
      codeExpiry: "Code valide pendant 5 minutes.",
      resendCode: "Renvoyer le code",
      submitButton: "Valider l'authentification",
      backToLogin: "Retour à la connexion",
      incorrectCode: "Code de sécurité incorrect. Veuillez réessayer.",
      success: "Double authentification réussie",
    },
    register: {
      title: "Inscription",
      firstNamePlaceholder: "Entrez votre prénom",
      lastNamePlaceholder: "Entrez votre nom",
      emailPlaceholder: "Entrez votre email",
      passwordPlaceholder: "Entrez votre mot de passe",
      submitButton: "S'inscrire",
      success: "Inscription réussie",
    },
    logout: {
      button: "Déconnexion sécurisée",
      success: "Déconnexion réussie",
    },
  },

  // ============================================================================
  // BRANDING
  // ============================================================================
  branding: {
    appName: "CERTIF-ID",
    country: "République du Congo",
    tagline: "Plateforme Nationale de Certification des Diplômes",
    subtitle: "Ministère de l'Enseignement Supérieur",
    securityBadge: "Connexion Sécurisée",
    officialPlatform: "Plateforme officielle de certification des diplômes",
    securityNotice: "Vos données sont protégées par un chiffrement de bout en bout",
  },

  // ============================================================================
  // MODULE INSTITUTION (Établissements)
  // ============================================================================
  institution: {
    // Sidebar
    sidebar: {
      sections: {
        pilotage: "Pilotage",
        administration: "Administration",
      },
      menu: {
        overview: "Tableau de bord",
        requests: "Suivi des demandes",
        registry: "Registre des diplômes",
        newRequest: "Émettre un diplôme",
        config: "Paramètres académiques",
        institutionProfile: "Fiche institutionnelle",
      },
      accountStatus: "Compte certifié",
    },

    // Header
    header: {
      breadcrumbPrefix: "Espace Université",
      searchPlaceholder: "Rechercher un diplôme, étudiant...",
    },

    // Pages
    pages: {
      overview: {
        title: "Vue d'ensemble",
        breadcrumb: "Tableau de bord",
      },
      requests: {
        title: "Historique des Demandes",
        breadcrumb: "Suivi des demandes",
        tableTitle: "Suivi des Transmissions",
        filters: {
          all: "Tout l'historique",
          attention: "Attention requise (Rejets)",
          completed: "100% Validés",
        },
        columns: {
          reference: "Référence",
          date: "Date",
          summary: "Synthèse",
          status: "Statut Global",
          details: "Détails",
        },
      },
      requestDetail: {
        title: "Détail de la Demande",
        breadcrumb: "Détail demande",
        bordereau: "Détail du Bordereau",
        students: "étudiants",
        submittedOn: "Soumis le",
        validated: "Validés",
        rejected: "Rejetés",
        columns: {
          student: "Étudiant",
          diploma: "Diplôme Demandé",
          status: "Statut",
          observation: "Observation",
        },
      },
      registry: {
        title: "Registre Central",
        breadcrumb: "Registre des diplômes",
        columns: {
          serialNumber: "N° Série",
          recipient: "Récipiendaire",
          title: "Titre Délivré",
          status: "Statut",
          details: "Détails",
        },
      },
      registryDetail: {
        title: "Détail du Diplôme",
        breadcrumb: "Détail diplôme",
        backToRegistry: "Retour au registre",
        documentInfo: "Document original certifié",
        metadata: "Métadonnées",
        sections: {
          recipient: "Récipiendaire",
          academic: "Cursus Académique",
          certification: "Certification",
        },
        fields: {
          fullName: "Nom Complet",
          diplomaTitle: "Intitulé du Diplôme",
          filiere: "Filière",
          promotion: "Promotion",
          mention: "Mention",
          serialNumber: "Numéro de Série Unique",
          issueDate: "Date d'émission",
          status: "Statut",
        },
        actions: {
          download: "Télécharger",
          print: "Imprimer",
          openPdf: "Ouvrir le PDF",
        },
        preview: {
          title: "Aperçu du document",
          description: "Fichier original uploadé par l'établissement",
        },
      },
      newRequest: {
        title: "Émission de Titres",
        breadcrumb: "Émettre un diplôme",
        formTitle: "Saisie des informations",
        fields: {
          academicYear: "Année Académique",
          filiere: "Filière",
          diplomaTitle: "Intitulé du Diplôme",
          recipientIdentity: "Identité du Récipiendaire",
          lastName: "Nom",
          firstName: "Prénoms",
          sex: "Sexe",
          mention: "Mention",
        },
        placeholders: {
          select: "Sélectionner...",
          selectDiploma: "Sélectionner un diplôme...",
          lastName: "EX: MABIALA",
          firstName: "Ex: Jean",
        },
        bordereau: {
          title: "Votre Bordereau",
          empty: "Bordereau vide",
          addButton: "Ajouter au Bordereau",
          submitButton: "Soumettre",
        },
        pdfUpload: {
          title: "Document justificatif",
          description: "Téléversez le scan du diplôme original (PDF uniquement)",
          button: "Sélectionner un fichier PDF",
          selected: "Fichier sélectionné",
        },
      },
      config: {
        title: "Configuration Académique",
        breadcrumb: "Paramètres académiques",
      },
      institutionProfile: {
        title: "Fiche Institutionnelle",
        breadcrumb: "Fiche institutionnelle",
      },
    },

    // Statistiques
    stats: {
      certifiedDiplomas: "Diplômes Certifiés",
      pendingRequests: "Demandes en Cours",
      activeFilieres: "Filières Actives",
      studentsWaiting: "Étudiants en attente",
    },

    // Actions rapides
    quickActions: {
      title: "Espace Rapide",
      description: "Accès direct aux fonctions clés",
      newRequest: "Nouvelle Demande",
      searchTitle: "Rechercher un Titre",
    },

    // Activité
    activity: {
      title: "Activité Récente",
      viewAll: "Tout voir",
      request: "Demande",
      diplomas: "diplômes",
    },
  },

  // ============================================================================
  // MODULE GOVERNMENT (Ministère)
  // ============================================================================
  government: {
    sidebar: {
      sections: {
        pilotage: "Pilotage",
        certification: "Certification",
        administration: "Administration",
      },
      menu: {
        overview: "Tableau de bord",
        certifications: "Demandes de certification",
        registry: "Registre national",
        statistics: "Statistiques",
        config: "Configuration",
      },
    },
    header: {
      breadcrumbPrefix: "Espace Ministère",
    },
  },

  // ============================================================================
  // STATUTS
  // ============================================================================
  status: {
    approved: "Validé",
    pending: "En attente",
    rejected: "Rejeté",
    active: "Valide",
    revoked: "Révoqué",
    inProgress: "En cours",
    processing: "En traitement",
    finalized: "Finalisé",
    attentionRequired: "Attention requise",
    validAuthentic: "Valide & Authentique",
  },

  // ============================================================================
  // MESSAGES GÉNÉRAUX
  // ============================================================================
  common: {
    loading: "Chargement...",
    saving: "Enregistrement...",
    delete: "Supprimer",
    edit: "Modifier",
    cancel: "Annuler",
    confirm: "Confirmer",
    save: "Enregistrer",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    search: "Rechercher",
    filter: "Filtrer",
    noResults: "Aucun résultat trouvé",
    page: "Page",
    of: "sur",
    rejections: "Rejets",
  },

  // ============================================================================
  // PAGINATION
  // ============================================================================
  pagination: {
    previous: "Précédent",
    next: "Suivant",
    page: "Page",
    of: "sur",
  },
} as const;

// Type helper pour accéder aux messages
export type Messages = typeof MESSAGES;
