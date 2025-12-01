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
    // Branding
    branding: {
      appName: "CERTIF-GOUV",
      subtitle: "Ministère Ens. Sup.",
      adminTitle: "Direction Examens",
      adminSubtitle: "Admin. National",
    },

    // Sidebar
    sidebar: {
      sections: {
        supervision: "Supervision",
        administration: "Administration",
      },
      menu: {
        overview: "Vue d'ensemble",
        certifications: "Demandes de Certif.",
        universities: "Établissements",
        registry: "Registre National",
        config: "Paramètres Système",
      },
    },

    // Header
    header: {
      breadcrumbPrefix: "Espace Gouvernemental",
      searchPlaceholder: "Rechercher (réf, nom, ID)...",
    },

    // Pages
    pages: {
      overview: {
        title: "Tableau de Bord National",
        breadcrumb: "Vue d'ensemble",
        filtersTitle: "Filtres & Analyses",
        filtersDescription: "Affiner les données du tableau de bord",
        filtersCriteria: "Critères de sélection",
        resetFilters: "Réinitialiser tout",
        placeholders: {
          allUniversities: "Toutes les Universités",
          allTypes: "Tous Types",
          allYears: "Toutes Années",
          allFilieres: "Toutes Filières",
        },
        charts: {
          activityTitle: "Activité de Certification",
          activityDescription: "Diplômes certifiés par année",
          topFilieresTitle: "Top Filières",
          noData: "Aucune donnée pour cette sélection",
          diplomas: "Diplômes",
          public: "Public",
          private: "Privé",
        },
      },
      universities: {
        title: "Gestion des Établissements",
        breadcrumb: "Établissements",
        listTitle: "Liste des Établissements",
        addButton: "Ajouter Établissement",
        filters: {
          allTypes: "Tous les types",
          public: "Public",
          private: "Privé",
        },
        columns: {
          institution: "Institution",
          type: "Type",
          contact: "Contact",
          activity: "Activité",
          status: "Statut",
          actions: "Actions",
        },
        diplomasIssued: "Diplômes émis",
        manage: "Gérer",
        create: {
          title: "Nouvel Établissement",
          manualMode: "Formulaire Unique",
          bulkMode: "Import Excel",
          institutionSection: "Fiche Institutionnelle",
          academicSection: "Paramètres Académiques",
          fields: {
            name: "Nom de l'établissement",
            type: "Type",
            city: "Ville",
            rector: "Recteur / Directeur",
            email: "Email Officiel (pour activation)",
            filiereName: "Nom de la Filière",
            addDiplomas: "Ajouter les Diplômes associés",
          },
          placeholders: {
            name: "Ex: Université de ...",
            city: "Ex: Brazzaville",
            rector: "Nom complet",
            email: "contact@etablissement.cg",
            filiere: "Ex: Sciences Juridiques",
            diploma: "Ex: Licence en Droit Public",
          },
          emailNotice: "Un email contenant les accès sera envoyé à cette adresse.",
          addFiliere: "Ajouter cette filière au catalogue",
          configuredFilieres: "Filières configurées",
          noFilieres: "Aucune filière n'a encore été ajoutée.",
          noDiplomas: "Aucun diplôme ajouté pour l'instant.",
          bulkTitle: "Importation en Masse",
          bulkDescription: "Ajoutez plusieurs établissements simultanément en utilisant le fichier modèle Excel officiel.",
          bulkUploadText: "Cliquez pour upload ou glissez le fichier ici",
          bulkFormats: "Formats acceptés: .xlsx, .csv",
          downloadTemplate: "Télécharger le modèle Excel",
          validateButton: "Valider l'enregistrement",
          importButton: "Lancer l'importation",
        },
        detail: {
          backToList: "Retour à la liste",
          suspend: "Suspendre",
          activate: "Activer l'accès",
          save: "Sauvegarder",
          generalConfig: "Configuration Générale",
          academicPrograms: "Offre de Formation",
          addNewFiliere: "Ajouter une nouvelle filière",
          saveFiliere: "Enregistrer la filière",
          noFilieres: "Aucune filière configurée pour le moment.",
        },
      },
      certifications: {
        title: "Validation des Diplômes",
        breadcrumb: "Demandes de certification",
        listTitle: "Demandes de Certification",
        listDescription: "Cliquez sur un bordereau pour examiner les diplômes étudiants.",
        filters: {
          all: "Tout afficher",
          pending: "En attente / Partiel",
          completed: "Terminé",
        },
        progression: "Progression",
        submitted: "Soumis le",
        students: "Étudiants",
        detail: {
          title: "Validation",
          reference: "Réf",
          bulkValidate: "Tout Valider",
          bulkReject: "Tout Rejeter",
          validated: "Validés",
          rejected: "Rejetés",
          columns: {
            detail: "Détail",
            student: "Étudiant",
            diploma: "Diplôme Demandé",
            mention: "Mention",
            status: "Statut",
            action: "Action Individuelle",
          },
          promo: "Promo",
          validate: "Valider",
          reject: "Rejeter",
          processed: "Traité",
          toProcess: "À traiter",
        },
        studentDetail: {
          title: "Détails Candidat",
          backToRequest: "Retour à la demande",
          verification: "Vérification des pièces justificatives",
          sections: {
            identity: "Identité",
            academic: "Dossier Académique",
            status: "Statut Actuel",
          },
          fields: {
            fullName: "Nom Complet",
            birthDate: "Date de Naissance",
            notProvided: "Non renseigné",
            diploma: "Diplôme Visé",
            matricule: "Matricule",
            promotion: "Promotion",
            mention: "Mention",
          },
          preview: {
            fileName: "Piece_Jointe_Releve.pdf",
            readOnly: "Lecture Seule",
            title: "Aperçu du relevé de notes",
            description: "Document soumis pour certification",
          },
        },
        rejectionModal: {
          title: "Motif du Rejet",
          description: "Veuillez justifier le rejet pour l'université.",
          placeholder: "Ex: Document manquant, Scan illisible...",
          confirm: "Confirmer",
        },
        bulkRejectionModal: {
          title: "Rejet Global",
          description: "Vous êtes sur le point de rejeter tous les éléments en attente. Ce motif sera appliqué à l'ensemble du lot.",
          placeholder: "Ex: Dossier non conforme au nouveau standard...",
          confirm: "Tout Rejeter",
        },
      },
      registry: {
        title: "Registre National Centralisé",
        breadcrumb: "Registre national",
        listTitle: "Registre National des Diplômes",
        listDescription: "Base de données centralisée de tous les titres certifiés.",
        filterButton: "Filtrer",
        exportButton: "Exporter Données",
        columns: {
          serialNumber: "Numéro Série",
          recipient: "Récipiendaire",
          university: "Université émettrice",
          title: "Titre",
          issueDate: "Date Émission",
          status: "État",
        },
        detail: {
          backToRegistry: "Retour au registre",
          documentInfo: "Document certifié - Archives Nationales",
          download: "Télécharger",
          print: "Imprimer",
          metadata: "Métadonnées Officielles",
          sections: {
            recipient: "Récipiendaire",
            academic: "Cursus Académique",
            authentication: "Authentification",
          },
          fields: {
            fullName: "Nom Complet",
            diplomaTitle: "Intitulé du Diplôme",
            university: "Université",
            filiere: "Filière",
            promotion: "Promotion",
            mention: "Mention",
            serialNumber: "Numéro de Série Unique",
            issueDate: "Date d'émission",
            status: "Statut",
          },
          preview: {
            title: "Aperçu du diplôme certifié",
            description: "Document officiel généré par le système",
            openPdf: "Ouvrir le PDF",
          },
        },
      },
    },

    // Stats
    stats: {
      certifiedDiplomas: "Diplômes Certifiés",
      activeUniversities: "Universités Actives",
      pendingStudents: "Étudiants en Attente",
      rejectionRate: "Taux de Rejet",
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
