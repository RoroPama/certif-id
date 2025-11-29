/**
 * Constantes de messages et textes de l'application
 * Stocke tous les messages, labels, textes affichés dans l'UI
 */

export const MESSAGES = {
  // Messages d'erreur généraux
  errors: {
    generic: "Une erreur est survenue",
    network: "Une erreur réseau est survenue",
    unauthorized: "Vous n'êtes pas autorisé à effectuer cette action",
    forbidden: "Accès interdit",
    notFound: "Ressource introuvable",
    serverError: "Erreur serveur",
    timeout: "La requête a expiré",
  },

  // Messages d'authentification
  auth: {
    login: {
      title: "Connexion",
      emailPlaceholder: "Entrez votre email",
      passwordPlaceholder: "Entrez votre mot de passe",
      submitButton: "Se connecter",
      incorrectCredentials: "Email ou mot de passe incorrect",
      success: "Connexion réussie",
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
      button: "Déconnexion",
      success: "Déconnexion réussie",
    },
  },

  // Messages pour les certificats
  certificates: {
    title: "Certificats",
    list: {
      title: "Mes certificats",
      empty: "Aucun certificat trouvé",
      loading: "Chargement des certificats...",
    },
    detail: {
      title: "Détails du certificat",
      notFound: "Certificat introuvable",
    },
    create: {
      title: "Créer un certificat",
      success: "Certificat créé avec succès",
      error: "Erreur lors de la création du certificat",
    },
    update: {
      success: "Certificat mis à jour avec succès",
      error: "Erreur lors de la mise à jour du certificat",
    },
    delete: {
      success: "Certificat supprimé avec succès",
      error: "Erreur lors de la suppression du certificat",
      confirm: "Êtes-vous sûr de vouloir supprimer ce certificat ?",
    },
  },

  // Messages pour le dashboard
  dashboard: {
    title: "Tableau de bord",
    welcome: "Bienvenue",
  },

  // Messages généraux
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
  },
} as const;
