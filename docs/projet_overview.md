# Certif-ID - Vue d'ensemble du projet

## Contexte

Dans un monde où la falsification de diplômes devient de plus en plus courante, il est essentiel de disposer d'un système fiable et sécurisé pour certifier et vérifier l'authenticité des diplômes. Les entreprises et les institutions font face à des défis majeurs lors du processus de recrutement, où la vérification manuelle des diplômes est longue, coûteuse et peu fiable.

Certif-ID répond à ce besoin en proposant une plateforme numérique sécurisée qui permet de certifier les diplômes de manière officielle et de les vérifier instantanément via un simple scan de QR code.

## Définition

**Certif-ID** est une plateforme de certification et de vérification de diplômes numériques qui permet :

- **Aux établissements d'enseignement** de soumettre des diplômes pour certification
- **Au Ministère de l'Enseignement** de certifier et signer numériquement les diplômes
- **Aux entreprises** de vérifier instantanément l'authenticité des diplômes via un QR code

## Objectifs

### Objectif principal

Créer un écosystème numérique sécurisé et transparent pour la certification et la vérification des diplômes, réduisant ainsi la fraude documentaire et facilitant les processus de recrutement.

### Objectifs spécifiques

1. **Digitaliser le processus de certification** : Transformer le processus manuel de certification en un workflow numérique automatisé
2. **Garantir l'authenticité** : Assurer que chaque diplôme certifié est authentique et non falsifiable
3. **Faciliter la vérification** : Permettre une vérification instantanée et fiable des diplômes par les entreprises
4. **Réduire la fraude** : Lutter contre la falsification de diplômes grâce à un système sécurisé et traçable

## Architecture des modules

La plateforme Certif-ID est composée de **3 modules distincts**, chacun destiné à un acteur spécifique du processus de certification et de vérification des diplômes.

### Module 1 : Module de Soumission (Établissements d'enseignement)

Le module de soumission permet aux établissements d'enseignement (écoles, universités, etc.) de soumettre les diplômes de leurs étudiants pour certification.

#### Fonctionnalités principales

- **Upload de diplômes** : Téléversement des diplômes au format numérique (PDF, image, etc.)
- **Saisie des informations** : Ajout des informations du diplôme (étudiant, formation, date, **email de l'étudiant**, etc.)
- **Suivi des soumissions** : Visualisation du statut des diplômes soumis (en attente, certifié, rejeté)
- **Gestion des diplômes** : Liste et recherche des diplômes soumis
- **Notifications** : Alertes sur les changements de statut des diplômes

#### Cas d'usage

1. Un établissement d'enseignement se connecte au module de soumission
2. L'établissement upload un nouveau diplôme avec les informations nécessaires (incluant l'email de l'étudiant si disponible)
3. Le diplôme est soumis pour certification au Ministère
4. L'établissement suit le statut de certification en temps réel
5. Une notification est reçue lorsque le diplôme est certifié ou rejeté
6. Si l'email de l'étudiant a été fourni, l'étudiant reçoit également une notification

### Module 2 : Module État (Ministère de l'Enseignement)

Le module État est un dashboard administratif qui permet au Ministère de l'Enseignement de gérer l'ensemble du processus de certification.

#### Fonctionnalités principales

- **Gestion des diplômes soumis** : Visualisation de tous les diplômes uploadés par les établissements d'enseignement
- **Certification des diplômes** : Validation et certification officielle des diplômes
- **Rejet de diplômes** : Possibilité de rejeter un diplôme avec justification
- **Signature numérique** : Application d'une signature numérique sécurisée sur les diplômes certifiés
- **Génération de QR code** : Création automatique d'un QR code unique pour chaque diplôme certifié
- **Workflow de validation** : Processus de revue et d'approbation des diplômes soumis
- **Historique et traçabilité** : Suivi de tous les diplômes certifiés avec historique complet
- **Statistiques** : Tableaux de bord avec statistiques sur les certifications

#### Cas d'usage

1. Le Ministère reçoit une notification de nouveau diplôme soumis
2. Le Ministère examine le diplôme et vérifie sa validité
3. Le Ministère approuve ou rejette le diplôme
4. Si approuvé, le Ministère certifie et signe numériquement le diplôme
5. Un QR code unique est généré et associé au diplôme
6. Le diplôme certifié est disponible pour vérification
7. **Notifications automatiques** :
   - L'établissement qui a soumis le diplôme reçoit une notification
   - **L'étudiant concerné reçoit également une notification par email** (si son email a été fourni lors de la soumission)

### Module 3 : Module de Vérification (Entreprises)

Le module de vérification permet aux entreprises de vérifier l'authenticité des diplômes de manière rapide et fiable.

#### Fonctionnalités principales

- **Scan de QR code** : Lecture du QR code présent sur le diplôme via caméra ou upload
- **Vérification en temps réel** : Validation instantanée de l'authenticité du diplôme
- **Affichage des informations** : Consultation des détails du diplôme certifié (étudiant, formation, date, etc.)
- **Statut de certification** : Indication claire si le diplôme est certifié, valide ou invalide
- **Rapport de vérification** : Génération d'un rapport de vérification (optionnel)
- **Historique de vérification** : Traçabilité des vérifications effectuées (optionnel)

#### Cas d'usage

1. Un candidat postule pour un poste dans une entreprise
2. L'entreprise demande à voir le diplôme du candidat
3. Le candidat présente son diplôme avec le QR code
4. L'entreprise scanne le QR code via l'application Certif-ID (module de vérification)
5. La plateforme vérifie instantanément l'authenticité du diplôme
6. L'entreprise reçoit une confirmation de validité ou d'invalidité avec les détails du diplôme
7. L'entreprise peut générer un rapport de vérification pour ses archives

## Flux de données

```
┌─────────────────────────┐
│  MODULE 1 : SOUMISSION  │
│  Établissement          │
│  d'enseignement         │
└───────────┬─────────────┘
            │
            │ Upload + Soumission
            │ du diplôme
            ▼
┌─────────────────────────┐
│   Plateforme Certif-ID  │
│   (Backend)             │
└───────────┬─────────────┘
            │
            │ Diplôme en attente
            │ de certification
            ▼
┌─────────────────────────┐
│  MODULE 2 : ÉTAT        │
│  Ministère              │
│  de l'Enseignement      │
└───────────┬─────────────┘
            │
            │ Certification + Signature
            │ + Génération QR code
            ▼
┌─────────────────────────┐
│  Diplôme Certifié       │
│  avec QR code unique    │
└───────────┬─────────────┘
            │
            │ Diplôme présenté
            │ avec QR code
            ▼
┌─────────────────────────┐
│  MODULE 3 : VÉRIFICATION│
│  Entreprise             │
└───────────┬─────────────┘
            │
            │ Scan QR code
            │ + Requête API
            ▼
┌─────────────────────────┐
│  Résultat de            │
│  vérification           │
│  (Valide/Invalide)      │
└─────────────────────────┘
```

## Technologies

### Frontend

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4
- **HTTP Client** : Axios
- **État** : React Context / Zustand (à définir)

### Backend (à venir)

- **Framework** : NestJS
- **Base de données** : PostgreSQL
- **Authentification** : Cookie
- **Signature numérique** : SHA-256 avec certificat X.509 + horodatage

## Système de notifications

La plateforme Certif-ID dispose d'un système de notifications automatiques pour informer les différents acteurs des changements de statut des diplômes :

### Notifications lors de la certification

Lorsqu'un diplôme est certifié par le Ministère :

1. **Établissement d'enseignement** : Reçoit toujours une notification confirmant la certification ou le rejet du diplôme soumis
2. **Étudiant concerné** : Reçoit une notification par email **si son adresse email a été fournie lors de la soumission du diplôme**
   - La notification informe l'étudiant que son diplôme a été certifié
   - L'étudiant peut ainsi être informé directement sans passer par l'établissement

### Avantages

- **Transparence** : Tous les acteurs concernés sont informés en temps réel
- **Traçabilité** : Historique complet des notifications envoyées
- **Flexibilité** : L'email de l'étudiant est optionnel lors de la soumission

## Signature numérique

La plateforme Certif-ID utilise un système de signature numérique sécurisé basé sur **SHA-256** avec certificat X.509 et horodatage pour garantir l'authenticité et l'intégrité des diplômes certifiés.

### Processus de signature

1. **Génération du hash** : Le contenu du diplôme est haché avec l'algorithme SHA-256 pour créer une empreinte unique
2. **Signature avec certificat X.509** : Le hash est signé avec la clé privée du Ministère (certificat X.509)
3. **Horodatage** : Un horodatage certifié est ajouté pour prouver la date et l'heure de la signature
4. **Intégration dans le PDF** : La signature est intégrée dans le document PDF du diplôme
5. **Stockage** : Le hash et les métadonnées de signature sont stockés dans la base de données PostgreSQL

### Vérification de la signature

Lors de la vérification d'un diplôme via le QR code :

1. **Récupération du diplôme** : Le système récupère le diplôme et ses métadonnées de signature
2. **Recalcul du hash** : Le hash SHA-256 est recalculé à partir du contenu actuel du diplôme
3. **Vérification de la signature** : La signature est vérifiée avec la clé publique du Ministère
4. **Comparaison des hash** : Le hash recalculé est comparé avec le hash stocké
5. **Validation de l'horodatage** : L'horodatage est vérifié pour confirmer l'authenticité temporelle

### Technologies utilisées

- **SHA-256** : Algorithme de hachage cryptographique pour générer l'empreinte du diplôme
- **Certificat X.509** : Certificat numérique du Ministère pour signer les diplômes
- **Horodatage (RFC 3161)** : Service d'horodatage certifié pour garantir la date de signature
- **PKI (Public Key Infrastructure)** : Infrastructure à clés publiques pour la gestion des certificats

### Avantages

- **Intégrité** : Toute modification du diplôme invalide la signature
- **Authenticité** : La signature prouve que le diplôme a été certifié par le Ministère
- **Non-répudiation** : Le Ministère ne peut pas nier avoir signé le diplôme
- **Traçabilité** : L'horodatage garantit la date exacte de certification

## Sécurité

- **Signature numérique SHA-256** : Chaque diplôme certifié est signé numériquement avec SHA-256 et certificat X.509
- **QR code unique** : Chaque QR code est unique et non falsifiable
- **Traçabilité** : Toutes les actions sont tracées et enregistrées
- **Authentification** : Système d'authentification sécurisé pour chaque module

## Bénéfices

### Pour le Ministère de l'Enseignement

- Processus de certification automatisé et efficace
- Réduction du temps de traitement
- Traçabilité complète des diplômes certifiés
- Réduction de la fraude documentaire

### Pour les établissements d'enseignement

- Soumission simplifiée des diplômes
- Suivi en temps réel du statut de certification
- Réduction des démarches administratives

### Pour les entreprises

- Vérification instantanée et fiable
- Réduction du temps de recrutement
- Confiance accrue dans les diplômes vérifiés
- Réduction des risques de recrutement frauduleux

### Pour les étudiants

- Diplômes certifiés et vérifiables
- **Notifications directes** : Réception d'emails de notification lorsque leur diplôme est certifié (si email fourni)
- Facilité de présentation aux employeurs
- Protection contre la falsification
- Accès direct aux informations de certification

## Prochaines étapes

1. Finalisation de l'architecture frontend
2. Développement du Module 1 : Soumission (Établissements)
3. Développement du Module 2 : État (Ministère)
4. Développement du Module 3 : Vérification (Entreprises)
5. Intégration avec le backend NestJS
6. Implémentation de la signature numérique
7. Génération et gestion des QR codes
8. Tests et validation
9. Déploiement
