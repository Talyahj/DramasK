# DramasK - Application web de gestion de dramas coréens

## 📝 Description

DramasK est une application web complète permettant aux utilisateurs de découvrir, consulter et gérer leurs dramas coréens préférés. L'application offre une interface intuitive pour parcourir les dramas, les ajouter à ses favoris, les noter, et pour les administrateurs, gérer le contenu du site.

## Fonctionnalités

### Utilisateurs non connectés
- Consulter la liste des dramas disponibles
- Filtrer les dramas par genre
- Rechercher des dramas par titre, acteur ou synopsis
- Consulter les détails d'un drama (synopsis, acteurs, année, notes)

### Utilisateurs connectés
- Tout ce que peuvent faire les utilisateurs non connectés
- Ajouter/retirer des dramas à leurs favoris
- Noter les dramas (système de 1 à 5 étoiles)
- Consulter leur liste de favoris personnalisée

### Administrateurs
- Tout ce que peuvent faire les utilisateurs connectés
- Ajouter de nouveaux dramas
- Modifier les dramas existants
- Supprimer des dramas

## Technologies utilisées

### Frontend
- **Vue.js** - Framework JavaScript pour construire l'interface utilisateur
- **Vuex** - Gestion de l'état centralisé
- **Vue Router** - Routage côté client
- **Axios** - Client HTTP pour les requêtes API
- **Bootstrap** - Framework CSS pour le design responsive

### Backend
- **Node.js** - Environnement d'exécution JavaScript côté serveur
- **Express** - Framework web pour Node.js
- **MySQL** - Base de données relationnelle
- **JWT** - Authentification par tokens
- **Bcrypt** - Hachage sécurisé des mots de passe

## Architecture

L'application suit une architecture client-serveur avec une séparation claire entre le frontend et le backend :

### Backend (API REST)
- **Contrôleurs** - Gestion des requêtes et réponses HTTP
- **Modèles** - Accès et manipulation des données
- **Routes** - Définition des points d'entrée de l'API
- **Middleware** - Fonctionnalités transversales (authentification, gestion des erreurs)

### Frontend (SPA)
- **Composants** - Éléments d'interface réutilisables
- **Vues** - Pages de l'application
- **Store** - Gestion centralisée de l'état
- **Services** - Communication avec l'API backend
- **Router** - Navigation entre les pages

## Structure de la base de données

```
+----------------+       +----------------+       +----------------+
|   Utilisateur  |       |     Drama      |       |     Avis       |
+----------------+       +----------------+       +----------------+
| ID_Utilisateur |<----->| ID_Drama       |<----->| ID_Avis        |
| Nom            |       | Titre          |       | ID_Utilisateur |
| Email          |       | Synopsis       |       | ID_Drama       |
| MotDePasse     |       | Genre          |       | Note           |
| Type_Utilisateur       | Acteurs        |       +----------------+
+----------------+       | Annee          |
        |                +----------------+
        |                        |
        v                        v
+----------------+
|    Favoris     |
+----------------+
| ID_Favoris     |
| ID_Utilisateur |
| ID_Drama       |
+----------------+
```

## Installation et démarrage

### Prérequis
- Node.js (v14 ou supérieur)
- MySQL (v5.7 ou supérieur)
- npm ou yarn

### Configuration de la base de données
1. Créer une base de données MySQL nommée `DramasK`
2. Importer le fichier `backend/db.sql` pour créer les tables et insérer les données initiales

### Backend
1. Naviguer vers le dossier backend
```bash
cd backend
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement (créer un fichier `.env` basé sur `.env.example`)
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=DramasK
JWT_SECRET=votre_secret_jwt
```

4. Démarrer le serveur
```bash
npm start
```

### Frontend
1. Naviguer vers le dossier frontend
```bash
cd frontend
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement (créer un fichier `.env` basé sur `.env.example`)
```
VUE_APP_API_URL=http://localhost:3000/api
```

4. Démarrer le serveur de développement
```bash
npm run serve
```

5. Pour construire la version de production
```bash
npm run build
```

## 👤 Comptes utilisateur

### Administrateur
- Email: admin@dramask.com
- Mot de passe: admin123

### Utilisateur standard
- Email: jean@example.com
- Mot de passe: password123


## Sécurité

- Hachage des mots de passe avec bcrypt
- Authentification par tokens JWT
- Protection des routes sensibles
- Validation des entrées utilisateur
- Requêtes SQL paramétrées pour éviter les injections

## Tests

Des tests unitaires ont été implémentés pour le backend avec Jest:

```bash
cd backend
npm test
```

## Auteur

**Talyah JUSTINE** - Projet réalisé dans le cadre du BTS SIO option SLAM
