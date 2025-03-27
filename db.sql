CREATE DATABASE DramasK;

USE DramasK;

-- Table Utilisateur (avec le nouveau champ Type_Utilisateur)
CREATE TABLE Utilisateur (
    ID_Utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    MotDePasse VARCHAR(255) NOT NULL,
    Type_Utilisateur ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);

-- Table Drama
CREATE TABLE Drama (
    ID_Drama INT AUTO_INCREMENT PRIMARY KEY,
    Titre VARCHAR(200) NOT NULL,
    Synopsis TEXT NOT NULL,
    Genre VARCHAR(50) NOT NULL,
    Acteurs TEXT NOT NULL,
    Annee INT NOT NULL
);

-- Table Favoris
CREATE TABLE Favoris (
    ID_Favoris INT AUTO_INCREMENT PRIMARY KEY,
    ID_Utilisateur INT NOT NULL,
    ID_Drama INT NOT NULL,
    FOREIGN KEY (ID_Utilisateur) REFERENCES Utilisateur(ID_Utilisateur),
    FOREIGN KEY (ID_Drama) REFERENCES Drama(ID_Drama),
    UNIQUE (ID_Utilisateur, ID_Drama) -- Contrainte d'unicité pour éviter les doublons
);

-- Table Avis
CREATE TABLE Avis (
    ID_Avis INT AUTO_INCREMENT PRIMARY KEY,
    ID_Utilisateur INT NOT NULL,
    ID_Drama INT NOT NULL,
    Note INT NOT NULL CHECK (Note BETWEEN 1 AND 5),
    FOREIGN KEY (ID_Utilisateur) REFERENCES Utilisateur(ID_Utilisateur),
    FOREIGN KEY (ID_Drama) REFERENCES Drama(ID_Drama)
);

-- Insertion des données pour la table Utilisateur
INSERT INTO Utilisateur (Nom, Email, MotDePasse, Type_Utilisateur) VALUES 
('Admin', 'admin@dramask.com', '$2a$10$8BdcWjP9JjQXbDnVXMl7UuhzwFQUiT/pX5VaOdcOz34TDfuYfJbOK', 'admin'), -- Password: admin123
('Jean Dupont', 'jean@example.com', '$2a$10$KYrlIqHrA4VK63Eu5b5bEOcGD1hXzAYSr/XoYnB4xMGHlINzWqcAa', 'user'), -- Password: password123
('Marie Martin', 'marie@example.com', '$2a$10$y26RkF7MNf.Jb6RXP8L3XeYo1ifdXLIw0eJDGpX6e1u8uxQYk2hn6', 'user'), -- Password: marie456
('Pierre Durand', 'pierre@example.com', '$2a$10$q.S6qRfZMpMTdkQX8JFkB.Ym1EfpE2s/hAJ5CWgw3bDxkZqijS3S2', 'user'); -- Password: pierre789

-- Insertion des données pour la table Drama
INSERT INTO Drama (Titre, Synopsis, Genre, Acteurs, Annee) VALUES  
('Crash Landing on You', 'Une héritière sud-coréenne atterrit accidentellement en Corée du Nord après un accident de parapente.', 'Romance', 'Hyun Bin, Son Ye-jin', 2019),
('Itaewon Class', 'Un ex-détenu ouvre un bar-restaurant à Itaewon pour se venger d''une puissante entreprise de restauration.', 'Drame', 'Park Seo-joon, Kim Da-mi', 2020),
('Hospital Playlist', 'La vie de cinq médecins qui sont amis depuis l''école de médecine.', 'Médical', 'Jo Jung-suk, Yoo Yeon-seok', 2020),
('Reply 1988', 'La vie quotidienne de cinq familles vivant dans le même quartier à Séoul en 1988.', 'Comédie', 'Lee Hye-ri, Ryu Jun-yeol', 2015),
('Signal', 'Un détective du présent communique avec un détective du passé à travers un talkie-walkie.', 'Thriller', 'Lee Je-hoon, Kim Hye-soo', 2016),
('Mr. Sunshine', 'Un garçon né dans l''esclavage revient en Corée en tant que soldat américain.', 'Historique', 'Lee Byung-hun, Kim Tae-ri', 2018);

-- Insertion des données pour la table Favoris
INSERT INTO Favoris (ID_Utilisateur, ID_Drama) VALUES  
(2, 1), -- Jean aime Crash Landing on You
(2, 2), -- Jean aime Itaewon Class
(3, 3), -- Marie aime Hospital Playlist
(3, 5); -- Marie aime Signal

-- Insertion des données pour la table Avis
INSERT INTO Avis (ID_Utilisateur, ID_Drama, Note) VALUES  
(2, 1, 5), -- Jean donne 5/5 à Crash Landing on You
(2, 2, 4), -- Jean donne 4/5 à Itaewon Class
(3, 3, 4), -- Marie donne 4/5 à Hospital Playlist
(3, 5, 5); -- Marie donne 5/5 à Signal