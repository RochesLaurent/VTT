# 🎲 Projet J - Table Virtuelle de Jeu de Rôle

> Une plateforme web moderne et accessible pour jouer à Donjons & Dragons 5e en ligne


## 🌟 Vision du Projet

**Projet J** est une plateforme de table virtuelle (VTT) conçue pour révolutionner l'expérience du jeu de rôle en ligne. Notre objectif est de créer une solution **accessible**, **intuitive** et **complète** qui permette aux maîtres de jeu et aux joueurs de vivre des aventures épiques de D&D 5e sans les contraintes techniques habituelles.

### 🎯 Problématique Résolue

Les plateformes existantes (Roll20, Foundry VTT, etc.) présentent plusieurs limitations :
- **Coût élevé** : fonctionnalités essentielles payantes
- **Complexité** : courbe d'apprentissage importante
- **Rigidité** : peu de personnalisation sans connaissances techniques
- **Abandon** : certaines plateformes ne sont plus maintenues

**Notre solution** : une table virtuelle moderne, gratuite pour les fonctionnalités de base, simple d'utilisation mais puissante dans ses capacités.

## ✨ Fonctionnalités Principales

### 🚀 Version Actuelle (MVP 1.0.0)
- ✅ **Authentification sécurisée** - Création de compte et connexion
- ✅ **Gestion de parties** - Création, invitation par code unique
- ✅ **Chat temps réel** - WebSocket avec historique
- ✅ **Système de dés** - Lancers intégrés avec calculs automatiques
- ✅ **Interface de jeu** - Table virtuelle avec carte de base
- ✅ **Rôles MJ/Joueur** - Permissions et actions spécifiques

### 🔮 Feuille de Route

#### Phase 2 - Contenu D&D 5e (v2.0.0)
- 📚 **Intégration SRD complet** - Sorts, objets, monstres, règles
- 🔍 **Interface de consultation** - Navigation type "5etools"
- 📖 **Base de données enrichie** - Recherche et filtrage avancés

#### Phase 3 - Intelligence de Jeu (v3.0.0)
- 👤 **Fiches de personnage** - Création automatisée avec calculs
- ⚔️ **Combat automatisé** - Initiative, tours, calculs de dégâts
- 📐 **Grille tactique** - Déplacement et portées automatiques

#### Phase 4 - Immersion Totale (v4.0.0+)
- 🎲 **Dés 3D animés** - Rendu Three.js immersif
- 🎵 **Audio/Vidéo** - Communication WebRTC intégrée
- 💡 **Éclairage dynamique** - Brouillard de guerre et vision
- 🌐 **Parties publiques** - Matchmaking joueurs/MJ

## 🛠️ Stack Technique

### Backend
- **Framework** : Symfony 6+ (PHP 8.1+)
- **API** : API Platform (REST/GraphQL)
- **Base de données** : MySQL 8.0+ avec support JSON
- **Cache** : Redis pour sessions et performances
- **Temps réel** : WebSocket avec ReactPHP/Ratchet

### Frontend
- **Framework** : React 18+ avec TypeScript
- **State Management** : Redux Toolkit + RTK Query
- **UI/UX** : Tailwind CSS + composants personnalisés
- **Temps réel** : Socket.io-client pour WebSockets
- **PWA** : Application web progressive

### Infrastructure
- **Containerisation** : Docker + Docker Compose
- **CI/CD** : GitLab CI/CD automatisé
- **Reverse Proxy** : nginx avec SSL/TLS
- **Monitoring** : Grafana + Prometheus (prod)

## 🚀 Installation et Développement

### Prérequis
- Docker & Docker Compose
- Git
- Node.js 18+ (pour le développement frontend)
- PHP 8.1+ (pour le développement backend)

### Démarrage Rapide

```bash
# Cloner le repository
git clone https://github.com/votre-username/projet-j-vtt.git
cd projet-j-vtt

# Copier la configuration
cp .env.example .env

# Lancer l'environnement complet
docker-compose up -d

# Installer les dépendances et initialiser la DB
make install

# L'application sera accessible sur :
# - Frontend: http://localhost:3000
# - API: http://localhost:8000
# - WebSocket: ws://localhost:3001
```

### Développement Local

```bash
# Backend (Symfony)
cd backend
composer install
php bin/console doctrine:migrations:migrate
php bin/console server:run

# Frontend (React)
cd frontend
npm install
npm start

# WebSocket Server
cd websocket-server
npm install
npm run dev
```

## 🧪 Tests et Qualité

```bash
# Tests backend
cd backend
php bin/phpunit

# Tests frontend
cd frontend
npm test

# Tests E2E
npm run test:e2e

# Analyse qualité code
npm run lint
composer run cs-fixer
```

## 📊 Architecture et Performance

### Métriques Cibles
- ⚡ **Temps de réponse API** : < 200ms (p95)
- 🌐 **Latence WebSocket** : < 100ms
- 📱 **Temps de chargement** : < 3s première visite
- 📈 **Disponibilité** : > 99.5%

### Sécurité
- 🔐 **Authentification** : JWT avec refresh tokens
- 🛡️ **Protection** : CSRF, XSS, injection SQL
- 🔒 **Communications** : HTTPS/WSS obligatoires
- 🚨 **Monitoring** : Logs sécurisés et alertes

## 📈 Roadmap Temporelle

| Phase | Durée Estimée | Fonctionnalités Clés | Status |
|-------|---------------|----------------------|--------|
| **MVP (v1.0.0)** | 77-95h | Authentification, Parties, Chat, Dés | ✅ En cours |
| **D&D 5e (v2.0.0)** | 40-58h | SRD, Consultation données | 📋 Planifié |
| **Intelligence (v3.0.0)** | 72-97h | Fiches perso, Combat auto | 🔮 Futur |
| **Immersion (v4.0.0)** | 68-94h | 3D, Audio/Vidéo, Éclairage | 🌟 Vision |

**Total estimé** : 257-344 heures de développement

## 🤝 Contribution

Ce projet suit les principes de développement professionnel :

### Standards de Code
- **PHP** : PSR-12, PHPStan niveau 8
- **TypeScript** : ESLint + Prettier
- **Git** : Conventional Commits
- **Tests** : Coverage > 80%

### Workflow
1. 🍴 Fork le projet
2. 🌱 Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. 💾 Commit les changements (`git commit -m 'feat: add amazing feature'`)
4. 📤 Push la branche (`git push origin feature/amazing-feature`)
5. 🔄 Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🎖️ Contexte Académique

**Projet J** est développé dans le cadre du titre professionnel **Concepteur Développeur d'Applications (CDA)**. Il démontre la maîtrise de :

- 🏗️ **Conception d'architecture** technique moderne
- 💻 **Développement full-stack** avec technologies actuelles
- 🔒 **Sécurisation d'applications** web
- 🧪 **Tests et qualité** logicielle
- 🚀 **DevOps et déploiement** automatisé

## 📞 Contact et Support

- 📧 **Email** : [votre-email@domain.com]
- 💬 **Discord** : [Serveur communauté]
- 📚 **Documentation** : [Wiki du projet]
- 🐛 **Issues** : [GitHub Issues]

---

**Fait avec ❤️ pour la communauté du jeu de rôle**

> *"L'aventure commence par un simple clic"*

