# 🏥 Atelier_PU — Système de Gestion de Rendez-vous Médicaux

<p align="center">

**TP1 – Processus Unifié (PU)**

_Conception et développement itératif d'un système de gestion de rendez-vous médicaux._

</p>

---

## 📌 1. Présentation du projet

Ce projet est réalisé dans le cadre du module **Processus Unifiés et Approches de Développement**, à l'Institut National des Sciences Appliquées et de Technologie (INSAT).

L'objectif est de mettre en pratique les principes du **Processus Unifié (PU)** à travers la conception et le développement progressif d'une application de gestion de rendez-vous médicaux.

Le système vise à faciliter la gestion des consultations médicales en permettant aux patients de consulter les disponibilités des médecins, de réserver ou d'annuler des rendez-vous, et aux médecins de gérer leurs plannings.

Le projet met particulièrement l'accent sur :

- Le développement itératif et incrémental.
- La modélisation des besoins à travers les cas d'utilisation.
- La gestion précoce des risques techniques.
- La conception d'une architecture logicielle en couches.
- La séparation des responsabilités entre frontend, backend et base de données.
- La vérification des fonctionnalités par des tests automatisés.
- La gestion du développement à travers Git et GitHub.

## 🎯 2. Objectifs du système

Le système doit permettre de :

- Simplifier la prise de rendez-vous médicaux.
- Réduire les conflits et les doubles réservations.
- Faciliter la gestion des disponibilités des médecins.
- Assurer la cohérence des plannings.
- Informer les patients des confirmations et des annulations.
- Garantir la fiabilité des opérations de réservation.
- Proposer une interface adaptée aux patients, médecins et administrateurs.

## 👥 3. Acteurs du système

| Acteur                      | Responsabilités                                                   |
| --------------------------- | ----------------------------------------------------------------- |
| **Patient**                 | Consulter les disponibilités, réserver et annuler un rendez-vous. |
| **Médecin**                 | Consulter son planning et gérer ses disponibilités.               |
| **Administrateur**          | Gérer les comptes et les informations de référence.               |
| **Service de notification** | Transmettre les confirmations et les notifications d'annulation.  |

## ⚙️ 4. Fonctionnalités — Cas d'utilisation

Le périmètre fonctionnel est organisé autour de six cas d'utilisation principaux.

| ID  | Cas d'utilisation            | Description                                                      |
| --- | ---------------------------- | ---------------------------------------------------------------- |
| UC1 | Consulter les disponibilités | Consulter les créneaux disponibles d'un médecin.                 |
| UC2 | Réserver un rendez-vous      | Réserver un créneau disponible et recevoir une confirmation.     |
| UC3 | Annuler un rendez-vous       | Annuler un rendez-vous existant et libérer le créneau.           |
| UC4 | Gérer les disponibilités     | Ajouter, modifier ou supprimer des créneaux.                     |
| UC5 | Consulter le planning        | Consulter les rendez-vous prévus sur une période.                |
| UC6 | Envoyer une notification     | Transmettre les confirmations et les notifications d'annulation. |

### 🔴 Cas d'utilisation prioritaire : UC2 — Réserver un rendez-vous

La réservation constitue le cas d'utilisation prioritaire en raison de son importance métier, de son risque technique et de son impact architectural.

**Risque principal : la double réservation.**

Deux patients peuvent tenter de réserver simultanément le même créneau. Une simple vérification côté interface ne suffit donc pas.

La solution doit garantir :

- Une validation côté serveur.
- Une vérification de disponibilité.
- Une opération atomique de réservation.
- Une contrainte d'unicité au niveau de la base de données.
- Une gestion contrôlée des erreurs.

Une indisponibilité du service de notification ne doit pas entraîner une deuxième réservation ni compromettre la cohérence des données. La notification doit pouvoir être réessayée indépendamment de la réservation.

## 🏗️ 5. Architecture logicielle

Le système adopte une architecture en couches avec une séparation entre le frontend, le backend et la couche de persistance.

### 5.1 Architecture technologique

La solution repose sur les technologies suivantes :

| Composant            | Technologie          | Responsabilité                                  |
| -------------------- | -------------------- | ----------------------------------------------- |
| Frontend             | Angular + TypeScript | Interface utilisateur et interactions.          |
| Backend              | NestJS + TypeScript  | API REST et logique métier.                     |
| ORM                  | TypeORM              | Mapping objet-relationnel et accès aux données. |
| Base de données      | MySQL                | Stockage persistant des données.                |
| Tests backend        | Jest + Supertest     | Tests unitaires et d'intégration.               |
| Documentation API    | Swagger / OpenAPI    | Documentation des endpoints REST.               |
| Intégration continue | GitHub Actions       | Exécution automatisée des tests.                |

### 5.2 Architecture globale

```text
             UTILISATEURS
       Patient / Médecin / Admin
                    |
                    v
        +-------------------------+
        |    FRONTEND ANGULAR     |
        |-------------------------|
        | Components              |
        | Pages / Routing         |
        | Angular Services        |
        | Forms / Validation      |
        +-------------------------+
                    |
                    | HTTP / REST API
                    v
        +-------------------------+
        |     BACKEND NESTJS      |
        |-------------------------|
        | Controllers             |
        | Services métier         |
        | Repositories            |
        | Validation              |
        +-------------------------+
                    |
                    v
        +-------------------------+
        |         TYPEORM         |
        |-------------------------|
        | Entities                |
        | Repositories             |
        | Transactions            |
        | Migrations              |
        +-------------------------+
                    |
                    v
        +-------------------------+
        |          MYSQL          |
        |-------------------------|
        | Patients                |
        | Médecins                |
        | Créneaux                |
        | Rendez-vous             |
        | Notifications           |
        +-------------------------+

             SERVICE EXTERNE
             DE NOTIFICATION
```

### 5.3 Architecture backend en couches

Le backend NestJS est organisé autour de trois couches principales :

**1. Couche présentation — Controllers**

- Réception des requêtes HTTP provenant du frontend Angular.
- Validation des paramètres et des données reçues.
- Appel des services métier.
- Retour des réponses HTTP appropriées.

Exemple : `AppointmentsController`.

**2. Couche métier — Services**

- Application des règles métier.
- Vérification de la disponibilité des créneaux.
- Gestion des réservations et des annulations.
- Contrôle des conflits.
- Coordination des opérations de réservation et des notifications.

Exemple : `AppointmentsService`.

**3. Couche d'accès aux données — Repositories**

- Communication avec la base de données à travers TypeORM.
- Lecture et écriture des rendez-vous.
- Gestion des entités et des relations.
- Exécution des opérations transactionnelles.

Exemple : `AppointmentRepository`.

### 5.4 Architecture frontend

Le frontend Angular est organisé en fonctionnalités afin de séparer les composants réutilisables et les fonctionnalités métier.

Les principales responsabilités sont :

- **Components :** affichage des interfaces et interactions utilisateur.
- **Services :** communication avec l'API REST NestJS.
- **Routing :** navigation entre les différentes pages.
- **Forms :** saisie et validation des données.
- **Core :** services et fonctionnalités globales.
- **Shared :** composants et éléments réutilisables.

### 5.5 Gestion du risque technique : double réservation

Le risque majeur est que deux patients tentent de réserver simultanément le même créneau.

Une simple vérification de disponibilité dans Angular ou dans le service métier ne suffit pas.

La protection doit être assurée côté backend et renforcée au niveau de MySQL.

Les mécanismes prévus sont :

- Vérification de disponibilité côté NestJS.
- Utilisation de transactions avec TypeORM.
- Contrainte d'unicité appropriée dans MySQL.
- Gestion des conflits et des erreurs de concurrence.

La vérification et l'enregistrement de la réservation doivent être réalisés de manière atomique afin d'empêcher deux patients de réserver le même créneau.

## 🔄 6. Méthodologie : Processus Unifié

Le développement suit les quatre phases du Processus Unifié.

| Phase                          | Objectifs                                                                    | Jalon               |
| ------------------------------ | ---------------------------------------------------------------------------- | ------------------- |
| Étude préliminaire (Inception) | Définition de la vision, du périmètre et des acteurs.                        | `v0.0-inception`    |
| Élaboration (Elaboration)      | Analyse des UC prioritaires, gestion des risques et architecture exécutable. | `v0.1-elaboration`  |
| Construction (Construction)    | Implémentation des fonctionnalités, diagrammes et tests.                     | `v0.2-construction` |
| Transition (Transition)        | Vérification finale, corrections, démonstration et livraison.                | `v1.0-release`      |

### Plan des itérations

Le projet est organisé en trois itérations.

**Itération 1 — Socle**

- UC1 : Consulter les disponibilités.
- UC2 : Réserver un rendez-vous.
- Mise en place du modèle de données.
- Mise en place de l'architecture Angular / NestJS / TypeORM / MySQL.
- Architecture de base exécutable.
- Premier test de réservation et détection des conflits.

**Itération 2 — Gestion**

- UC3 : Annuler un rendez-vous.
- UC4 : Gérer les disponibilités.
- Implémentation des règles métier.
- Tests unitaires et tests d'intégration.

**Itération 3 — Finalisation**

- UC5 : Consulter le planning.
- UC6 : Envoyer une notification.
- Gestion des scénarios d'erreur.
- Revue croisée.
- Préparation de la version de démonstration.

> Les phases du Processus Unifié et les itérations sont deux notions distinctes : les itérations permettent de produire progressivement des résultats au cours des différentes phases.

## 📊 7. Priorisation des cas d'utilisation

Les cas d'utilisation sont évalués selon trois critères :

1. **Valeur métier :** importance de la fonctionnalité pour les utilisateurs.
2. **Risque :** probabilité et impact des problèmes techniques ou fonctionnels.
3. **Impact architectural :** influence sur les composants, les données et les interfaces.

| Priorité | Cas d'utilisation                  | Valeur métier | Risque | Impact architectural |
| -------- | ---------------------------------- | ------------- | ------ | -------------------- |
| 1        | UC2 – Réserver un rendez-vous      | Élevée        | Élevé  | Élevé                |
| 2        | UC1 – Consulter les disponibilités | Élevée        | Moyen  | Moyen                |
| 3        | UC4 – Gérer les disponibilités     | Élevée        | Moyen  | Élevé                |
| 4        | UC6 – Envoyer une notification     | Moyenne       | Élevé  | Élevé                |
| 5        | UC3 – Annuler un rendez-vous       | Moyenne       | Moyen  | Moyen                |
| 6        | UC5 – Consulter le planning        | Moyenne       | Faible | Faible               |

## 🧪 8. Stratégie de test

La qualité du système sera vérifiée à travers plusieurs niveaux de tests.

| ID  | Scénario                                   | Résultat attendu                                                   |
| --- | ------------------------------------------ | ------------------------------------------------------------------ |
| T1  | Réserver un créneau libre                  | Réservation créée avec succès.                                     |
| T2  | Réserver un créneau déjà pris              | Réservation refusée, sans doublon.                                 |
| T3  | Réserver un créneau inexistant             | Erreur contrôlée.                                                  |
| T4  | Annuler un rendez-vous existant            | Rendez-vous annulé et créneau libéré selon les règles définies.    |
| T5  | Indisponibilité du service de notification | Cohérence de la réservation conservée et notification réessayable. |

**Types de tests prévus :**

- **Tests unitaires :** validation des règles métier dans les services NestJS.
- **Tests d'intégration :** vérification des interactions entre contrôleurs, services, repositories et base de données.
- **Tests API :** vérification des endpoints REST avec Supertest.
- **Tests frontend :** vérification des composants et services Angular.
- **Tests de non-régression :** vérification des fonctionnalités existantes après modification.
- **Intégration continue (CI) :** exécution automatisée des tests lors des changements du code.

Les résultats des tests seront documentés après leur exécution réelle.

## 📁 9. Organisation du dépôt

Structure cible proposée :

```text
Atelier_PU/
│
├── README.md
│
├── frontend/                         # Application Angular
│   ├── src/
│   │   └── app/
│   │       ├── core/
│   │       ├── shared/
│   │       ├── features/
│   │       │   ├── appointments/
│   │       │   ├── availability/
│   │       │   ├── patients/
│   │       │   ├── doctors/
│   │       │   └── admin/
│   │       └── app.routes.ts
│   └── package.json
│
├── backend/                          # API NestJS
│   ├── src/
│   │   ├── appointments/
│   │   │   ├── appointments.controller.ts
│   │   │   ├── appointments.service.ts
│   │   │   ├── appointments.module.ts
│   │   │   └── repositories/
│   │   ├── patients/
│   │   ├── doctors/
│   │   ├── availability/
│   │   ├── notifications/
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── test/
│   └── package.json
│
├── docs/
│   ├── compte-rendu.pdf
│   ├── use-cases.puml
│   ├── class-diagram.puml
│   └── sequence-reservation.puml
│
└── .github/
    └── workflows/
        └── tests.yml
```

Cette structure constitue une organisation cible. Les fichiers et dossiers seront ajoutés progressivement au cours de l'implémentation.

## 🌿 10. Gestion de versions et workflow Git

Le développement est organisé autour de branches fonctionnelles et de jalons.

### Convention de nommage des branches

Chaque cas d'utilisation dispose de sa propre branche créée à partir de `main`.

```text
main
│
├── feature/UC1-consulter-disponibilites
├── feature/UC2-reserver-rendez-vous
├── feature/UC3-annuler-rendez-vous
├── feature/UC4-gerer-disponibilites
├── feature/UC5-consulter-planning
└── feature/UC6-envoyer-notification
```

### Workflow de développement

1. Créer une issue GitHub correspondant au cas d'utilisation.
2. Définir sa priorité et ses critères d'acceptation.
3. Créer ou utiliser la branche dédiée.
4. Développer la fonctionnalité.
5. Ajouter et exécuter les tests correspondants.
6. Soumettre une Pull Request.
7. Effectuer une revue de code.
8. Fusionner après validation.
9. Mettre à jour les jalons du projet.

Les tags de version sont créés uniquement lorsque les livrables correspondants sont réellement validés.

## 👨‍💻 11. Équipe du projet

Projet réalisé par :

| Membre                | Rôle               |
| --------------------- | ------------------ |
| **EL JENZRI Yassine** | Membre de l'équipe |
| **LAMOUCHI Seif**     | Membre de l'équipe |
| **KHLIF Iheb**        | Membre de l'équipe |

**Encadrante :** Mme Hajer TAKTAK

**Établissement :** Institut National des Sciences Appliquées et de Technologie (INSAT)

**Module :** Processus Unifiés et Approches de Développement

**Année universitaire :** 2026–2027

## 📌 12. État d'avancement

Le projet évolue progressivement conformément aux phases et aux itérations du Processus Unifié.

Les livrables sont considérés comme terminés uniquement après leur réalisation et leur vérification.

| Livrable                                                   | État       |
| ---------------------------------------------------------- | ---------- |
| Définition de la vision et du périmètre                    | Conçu      |
| Identification des acteurs et des UC                       | Conçu      |
| Priorisation et planification                              | Conçu      |
| Architecture logicielle Angular / NestJS / TypeORM / MySQL | Proposée   |
| Diagramme de cas d'utilisation                             | Conçu      |
| Diagramme de classes                                       | Conçu      |
| Diagramme de séquence                                      | Conçu      |
| Mise en place du backend NestJS                            | À réaliser |
| Mise en place du frontend Angular                          | À réaliser |
| Configuration de TypeORM et MySQL                          | À réaliser |
| Implémentation de UC2                                      | À réaliser |
| Tests automatisés                                          | À réaliser |
| Pipeline CI/CD                                             | À réaliser |
| Version de démonstration                                   | À réaliser |

---

<p align="center">

**INSAT — Institut National des Sciences Appliquées et de Technologie**

_TP1 — Processus Unifié | Année universitaire 2026–2027_

</p>
