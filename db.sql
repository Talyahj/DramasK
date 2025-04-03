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

-- Note: Le mot de passe pour admin est "password123" en clair, mais stocké en version hashée
INSERT INTO Utilisateur (Nom, Email, MotDePasse, Type_Utilisateur) VALUES 
('Admin', 'admin@dramask.com', '$2y$10$pUe8WrIky7nGe17z6tUCIuXYCQfpFwhfChzeUa3ZKu9/mf7LzXaE.', 'admin'), -- Password: admin123
('Jean Dupont', 'jean@example.com', '$2b$10$NjdeJYu.waHINHCVc0UVJeas7YKRZ.ADHmphrrpLryLWTbk5KcEt2', 'user'), -- Password: password123
('Marie Martin', 'marie@example.com', '$2b$10$NjdeJYu.waHINHCVc0UVJeas7YKRZ.ADHmphrrpLryLWTbk5KcEt2', 'user'), -- Password: password123
('Pierre Durand', 'pierre@example.com', '$2b$10$NjdeJYu.waHINHCVc0UVJeas7YKRZ.ADHmphrrpLryLWTbk5KcEt2', 'user'); -- Password: password123

-- Insertion des données pour la table Drama
INSERT INTO Drama (Titre, Synopsis, Genre, Acteurs, Annee) VALUES  
('Crash Landing on You', 'Yoon Se-ri, une riche héritière sud-coréenne et PDG d''une entreprise de mode, se retrouve accidentellement en Corée du Nord après un accident de parapente lors d''une séance de vol. Elle y rencontre Ri Jeong-hyeok, un capitaine de l''armée nord-coréenne, qui décide de la cacher et de l''aider à retourner chez elle malgré les risques. Leur histoire d''amour improbable se développe dans un contexte géopolitique tendu, entourés de personnages attachants dans un village nord-coréen. La série offre un regard nuancé sur les différences culturelles entre les deux Corées tout en développant une romance touchante.', 'Romance', 'Hyun Bin, Son Ye-jin, Seo Ji-hye, Kim Jung-hyun, Yang Kyung-won, Yoo Su-bin', 2019),

('Itaewon Class', 'Park Sae-ro-yi voit sa vie basculer lorsque son père est tué dans un accident causé par le fils arrogant du PDG de Jangga Group, une puissante entreprise de restauration. Après avoir agressé le responsable, il passe plusieurs années en prison. À sa sortie, déterminé à se venger, il ouvre un petit bar-restaurant dans le quartier cosmopolite d''Itaewon à Séoul. Avec une équipe de marginaux et d''outsiders sociaux, dont la brillante mais socialement maladroite Jo Yi-seo, il se lance dans une compétition acharnée contre le conglomérat qui a détruit sa famille, tout en restant fidèle à ses principes d''égalité et de justice.', 'Drame', 'Park Seo-joon, Kim Da-mi, Yoo Jae-myung, Kwon Nara, Lee Joo-young, Chris Lyon', 2020),

('Squid Game', 'Des centaines de joueurs en difficultés financières acceptent une étrange invitation à participer à des jeux d''enfants. Une récompense tentante les attend, mais l''enjeu est mortel : chaque élimination signifie la mort réelle du joueur. Seong Gi-hun, un chauffeur divorcé et joueur compulsif, rejoint le jeu pour régler ses dettes et pouvoir subvenir aux besoins de sa fille. Au fil des épreuves, il se lie avec d''autres participants, dont un vieil homme atteint d''une tumeur au cerveau et son ami d''enfance devenu banquier d''investissement. La série offre une critique acerbe du capitalisme et des inégalités sociales en Corée du Sud à travers cette compétition meurtrière.', 'Thriller', 'Lee Jung-jae, Park Hae-soo, Jung Ho-yeon, Wi Ha-joon, O Yeong-su, Heo Sung-tae', 2021),

('Hospital Playlist', 'Cinq médecins qui sont amis depuis leurs années d''études à l''école de médecine se retrouvent à travailler dans le même hôpital près de vingt ans plus tard. Lee Ik-jun (chirurgien général), Ahn Jeong-won (pédiatre), Kim Jun-wan (cardiologue), Yang Seok-hyeong (obstétricien) et Chae Song-hwa (neurochirurgienne) affrontent ensemble les défis quotidiens du milieu hospitalier, jonglant entre cas médicaux complexes, relations avec les patients et leurs vies personnelles souvent compliquées. Leur passion commune pour la musique les amène à former un groupe de rock, leur offrant un exutoire à la pression de leur profession. La série explore avec justesse l''amitié, l''amour, la vie et la mort à travers le prisme de l''environnement médical.', 'Médical', 'Jo Jung-suk, Yoo Yeon-seok, Jung Kyung-ho, Kim Dae-myung, Jeon Mi-do, Shin Hyun-been', 2020),

('Mr. Sunshine', 'À la fin du 19e siècle, un jeune garçon coréen né dans l''esclavage fuit aux États-Unis après la mort tragique de ses parents. Des années plus tard, il revient dans son pays natal comme capitaine Eugene Choi du corps des Marines américains, alors que la Corée fait face à l''impérialisme japonais. Il rencontre Go Ae-shin, une noble aristocrate secrètement impliquée dans le mouvement de résistance pour l''indépendance. Leur histoire d''amour se développe dans un contexte historique tumultueux, où se mêlent complots politiques, espionnage international et lutte pour la liberté. La série dépeint magnifiquement cette période charnière de l''histoire coréenne, entre traditions séculaires et modernisation forcée.', 'Historique', 'Lee Byung-hun, Kim Tae-ri, Yoo Yeon-seok, Kim Min-jung, Byun Yo-han, Jo Woo-jin', 2018),

('It''s Okay to Not Be Okay', 'Moon Gang-tae, un soignant dévoué travaillant dans un hôpital psychiatrique, croise le chemin de Ko Moon-young, une célèbre auteure de contes pour enfants au comportement antisocial et aux tendances narcissiques. Gang-tae s''occupe de son frère aîné Moon Sang-tae, un artiste autiste traumatisé par le souvenir de la mort violente de leur mère. Moon-young, elle-même profondément blessée par son enfance avec une mère sociopathe, développe une obsession pour Gang-tae. Alors que leurs vies s''entremêlent, ces trois âmes brisées entament un voyage thérapeutique vers la guérison émotionnelle, confrontant leurs traumatismes passés et apprenant à s''ouvrir à l''amour et à la confiance.', 'Romance', 'Kim Soo-hyun, Seo Ye-ji, Oh Jung-se, Park Gyu-young, Park Jin-joo, Kim Joo-hun', 2020),

('Reply 1988', 'Dans le quartier de Ssangmun-dong à Séoul en 1988, cinq familles voisines partagent leurs joies et leurs peines au quotidien. La série suit particulièrement les adolescents de ces familles : Sung Deok-sun, une jeune fille énergique au milieu de quatre enfants ; Choi Taek, un prodige du baduk (jeu de go) timide et réservé ; Kim Jung-hwan, un garçon intelligent qui cache ses sentiments derrière une façade stoïque ; Ryu Dong-ryong, le clown du groupe issu d''une famille aisée ; et Sung Sun-woo, l''élève modèle qui prend soin de sa mère veuve et de sa sœur. À travers leurs histoires d''amitié, premiers amours et rêves d''avenir, la série capture avec nostalgie cette période marquante de l''histoire coréenne, entre les Jeux Olympiques de Séoul et d''importants changements sociaux et économiques.', 'Comédie dramatique', 'Lee Hye-ri, Ryu Jun-yeol, Go Kyung-pyo, Park Bo-gum, Lee Dong-hwi, Sung Dong-il', 2015),

('Signal', 'En 2015, le profileur criminel Park Hae-young découvre un vieux talkie-walkie qui lui permet mystérieusement de communiquer avec le détective Lee Jae-han en 1989. Avec l''aide de la détective Cha Soo-hyun dans le présent, qui connaissait Jae-han, ils commencent à résoudre des affaires criminelles non élucidées et à prévenir des crimes avant qu''ils ne se produisent. Cependant, chaque modification du passé entraîne des conséquences imprévues dans le présent, parfois dramatiques. La série aborde également la corruption policière et les défaillances du système judiciaire, tout en explorant la question éthique de savoir si on doit altérer le cours de l''histoire même pour sauver des vies.', 'Thriller', 'Lee Je-hoon, Kim Hye-soo, Cho Jin-woong, Kim Won-hae, Jung Hae-kyun, Jang Hyun-sung', 2016),

('Start-Up', 'Dans un centre technologique fictif de Corée du Sud appelé Sandbox, des jeunes entrepreneurs ambitieux tentent de réussir dans le monde compétitif des start-ups. Seo Dal-mi rêve de devenir la prochaine Steve Jobs et croit que Nam Do-san, un développeur maladroit et fondateur d''une petite entreprise d''intelligence artificielle, est son premier amour d''enfance grâce à des lettres qu''elle a reçues adolescente. En réalité, ces lettres ont été écrites par Han Ji-pyeong, désormais un investisseur en capital-risque prospère, à la demande de la grand-mère de Dal-mi. Lorsque les trois personnages se retrouvent à Sandbox, un triangle amoureux compliqué se forme, tandis qu''ils naviguent dans les défis professionnels et personnels du monde entrepreneurial.', 'Romance', 'Bae Suzy, Nam Joo-hyuk, Kim Seon-ho, Kang Han-na, Yoo Su-bin, Stephanie Lee', 2020),

('Vincenzo', 'Park Joo-hyung, adopté par une famille italienne pendant son enfance, devient Vincenzo Cassano, un avocat et consigliere pour la mafia. Lorsqu''une guerre interne éclate au sein de l''organisation, il fuit en Corée du Sud, cherchant à récupérer de l''or caché dans un immeuble commercial avant de partir pour un autre pays. À Séoul, il rencontre Hong Cha-young, une avocate déterminée, et les habitants excentriques de l''immeuble Geumga Plaza, menacés d''expulsion par une entreprise corrompue. Vincenzo décide d''utiliser ses compétences de mafieux et d''avocat pour aider ces résidents et se venger du conglomérat Babel Group et de son dirigeant psychopathe, tout en développant des sentiments inattendus pour sa nouvelle communauté.', 'Action', 'Song Joong-ki, Jeon Yeo-been, Ok Taec-yeon, Kim Yeo-jin, Kwak Dong-yeon, Jo Han-chul', 2021),

('Flower of Evil', 'Baek Hee-sung semble être un mari parfait et un père aimant, mais cache un passé sombre sous une identité usurpée. Sa femme, Cha Ji-won, est une détective compétente qui commence à enquêter sur une série de meurtres non résolus ayant des similitudes troublantes avec un cas vieux de 15 ans impliquant le père présumé de son mari. Alors que Ji-won se rapproche de la vérité, elle commence à soupçonner que l''homme qu''elle a épousé n''est pas celui qu''il prétend être. La série explore brillamment les thèmes de confiance, d''identité et de rédemption, remettant en question si l''amour peut vraiment tout pardonner et si les gens peuvent fondamentalement changer.', 'Thriller', 'Lee Joon-gi, Moon Chae-won, Jang Hee-jin, Seo Hyun-woo, Kim Ji-hoon, Son Jong-hak', 2020),

('Hometown Cha-Cha-Cha', 'Yoon Hye-jin, une dentiste perfectionniste de Séoul, perd son emploi après avoir dénoncé les pratiques non éthiques de son supérieur. Elle décide de s''installer dans le petit village côtier de Gongjin pour ouvrir son propre cabinet. Là, elle rencontre Hong Du-sik, un homme à tout faire populaire et mystérieux qui aide tous les villageois avec leurs problèmes. Initialement agacée par sa présence constante et son attitude décontractée, Hye-jin développe progressivement des sentiments pour Du-sik, dont le passé cache une tragédie douloureuse. La série dépeint avec chaleur et humour la vie dans une petite communauté, les guérisons émotionnelles et le pouvoir transformateur de l''amour et de l''acceptation.', 'Romance', 'Shin Min-a, Kim Seon-ho, Lee Sang-yi, Gong Min-jeung, Kim Young-ok, Oh Eui-sik', 2021),

('Moon Lovers: Scarlet Heart Ryeo', 'Pendant une éclipse solaire, Go Ha-jin, une femme moderne, est transportée dans le corps de Hae Soo dans la Corée de l''ère Goryeo. Elle se retrouve mêlée aux intrigues politiques de la famille royale et rencontre plusieurs princes, dont le froid et calculateur 4e Prince Wang So, dont le visage est partiellement caché par un masque en raison d''une cicatrice. Initialement effrayée par lui, Hae Soo développe des sentiments profonds pour Wang So alors qu''elle découvre son passé douloureux et sa vraie nature. Leur histoire d''amour se déroule dans un contexte de luttes de pouvoir, de trahisons et de tragédies, alors que Wang So s''efforce de devenir roi malgré l''opposition de sa propre famille et que Hae Soo tente de naviguer dans ce monde dangereux avec ses connaissances du futur.', 'Historique', 'Lee Joon-gi, IU, Kang Ha-neul, Hong Jong-hyun, Nam Joo-hyuk, Ji Soo', 2016),

('Business Proposal', 'Shin Ha-ri accepte de se faire passer pour son amie lors d''un rendez-vous arrangé afin de faire fuir le prétendant. Cependant, elle découvre avec horreur que l''homme en question est Kang Tae-moo, le PDG de l''entreprise où elle travaille. Pour compliquer les choses, Tae-moo, fatigué des rencontres arrangées par son grand-père, propose à Ha-ri un faux contrat de fiançailles pour les satisfaire tous les deux. Ce qui commence comme un accord professionnel se transforme progressivement en sentiments réels, tandis qu''une romance parallèle se développe entre le meilleur ami de Tae-moo et l''amie de Ha-ri pour qui elle s''était fait passer initialement. Remplie de moments drôles et de situations cocasses, cette comédie romantique revisite avec fraîcheur les tropes classiques du genre.', 'Comédie romantique', 'Ahn Hyo-seop, Kim Se-jeong, Kim Min-kyu, Seol In-ah, Lee Deok-hwa, Jung Young-joo', 2022),

('Extraordinary Attorney Woo', 'Woo Young-woo, une brillante avocate autiste avec un QI exceptionnel et une mémoire eidétique, rejoint un prestigieux cabinet d''avocats. Malgré ses compétences juridiques remarquables, elle doit surmonter les préjugés sociaux et les défis professionnels en raison de son neurodéveloppement atypique. Avec l''aide de son collègue et intérêt romantique Lee Jun-ho, et de son amie d''enfance Dong Geu-ra-mi, Woo navigue dans le monde complexe du droit tout en développant ses compétences sociales. Chaque épisode présente un cas juridique unique qui permet à Young-woo d''appliquer sa perspective particulière et sa passion pour les baleines (sa fixation spéciale) pour résoudre des problèmes d''une manière que ses collègues neurotypiques ne pourraient pas envisager.', 'Drame juridique', 'Park Eun-bin, Kang Tae-oh, Kang Ki-young, Jeon Bae-soo, Ha Yun-kyung, Joo Jong-hyuk', 2022),

('The Glory', 'Moon Dong-eun, ayant abandonné ses rêves après avoir subi un harcèlement scolaire brutal durant son adolescence, consacre sa vie adulte à élaborer un plan de vengeance méticuleux contre ses anciens tortionnaires et les personnes qui ont fermé les yeux sur les abus. Devenue enseignante de l''école primaire, elle devient la professeure de l''enfant de l''un de ses bourreaux. Parallèlement, elle se rapproche de Joo Yeo-jeong, un médecin issu d''une famille aisée qui devient son allié dans sa quête de justice. La série explore les conséquences durables du harcèlement scolaire, la corruption des élites et le prix psychologique de la vengeance, tout en offrant un regard implacable sur les inégalités sociales en Corée du Sud.', 'Thriller', 'Song Hye-kyo, Lee Do-hyun, Lim Ji-yeon, Yeom Hye-ran, Park Sung-hoon, Jung Sung-il', 2022),

('Snowdrop', 'Se déroulant en 1987, pendant la période de manifestations pour la démocratie en Corée du Sud, l''histoire suit Eun Young-ro, une étudiante universitaire qui aide secrètement Im Soo-ho, un mystérieux étudiant couvert de sang qu''elle trouve s''infiltrant dans sa résidence universitaire. Croyant qu''il est un activiste étudiant poursuivi par les autorités, elle le cache, ignorant qu''il est en réalité un espion nord-coréen en mission. Leur histoire d''amour se développe dans un contexte politique tendu, impliquant des agents de la sécurité nationale, des manipulations politiques et des sacrifices personnels. La série entremêle habilement drame romantique et thriller d''espionnage, tout en abordant une période controversée de l''histoire coréenne moderne.', 'Drame historique', 'Jung Hae-in, Jisoo, Yoo In-na, Jang Seung-jo, Yoon Se-ah, Kim Hye-yoon', 2021),

('2521', 'En 1998, pendant la crise financière asiatique, Na Hee-do, une talentueuse escrimeuse de 18 ans, voit son équipe lycéenne dissoute en raison de difficultés économiques. Elle rejoint finalement l''équipe de sa rivale, Go Yu-rim, médaillée d''or olympique. Parallèlement, Baek Yi-jin, 22 ans, issu d''une famille ruinée par la crise, lutte pour reconstruire sa vie en travaillant comme livreur de journaux. La rencontre fortuite de Hee-do et Yi-jin marque le début d''une profonde relation qui évolue de l''amitié à l''amour, alors qu''ils poursuivent leurs rêves respectifs dans le sport et le journalisme. La série, racontée à travers des flashbacks depuis 2021, explore avec nostalgie la jeunesse, les premiers amours et la résilience face aux défis économiques et personnels.', 'Romance', 'Kim Tae-ri, Nam Joo-hyuk, Bona, Choi Hyun-wook, Lee Joo-myung, Kim Hye-eun', 2022),

('D.P.', 'Ahn Jun-ho, un jeune soldat réservé effectuant son service militaire obligatoire, est recruté dans l''unité "D.P." (Deserter Pursuit), chargée de traquer et de capturer les déserteurs de l''armée. Avec son partenaire expérimenté, le caporal Han Ho-yeol, il part en mission dans le monde civil pour ramener les soldats en fuite. Chaque cas révèle les raisons profondes de la désertion - souvent liées au harcèlement brutal, aux abus de pouvoir et aux conditions inhumaines au sein de l''armée sud-coréenne. À travers ces missions, Jun-ho est confronté à la dure réalité du système militaire et aux dilemmes moraux de son rôle, tout en affrontant ses propres traumatismes et sa vie familiale dysfonctionnelle.', 'Drame', 'Jung Hae-in, Koo Kyo-hwan, Kim Sung-kyun, Son Seok-koo, Lee Jun-young, Shin Seung-ho', 2021),

('Our Beloved Summer', 'Choi Woong et Kook Yeon-soo, ex-petits amis qui s''étaient promis de ne plus jamais se revoir après leur rupture, sont contraints de se retrouver lorsque le documentaire scolaire qu''ils ont tourné ensemble dix ans plus tôt devient viral sur internet. Le réalisateur du documentaire original, désormais producteur, les convainc de participer à une suite pour montrer leur évolution. Woong est devenu un illustrateur populaire sous pseudonyme, tandis que Yeon-soo travaille dans le marketing d''entreprise. Forcés de revisiter leur passé et de confronter les sentiments non résolus, ils redécouvrent progressivement ce qui les a attirés l''un vers l''autre initialement, tout en surmontant les malentendus et blessures qui ont causé leur séparation.', 'Romance', 'Choi Woo-shik, Kim Da-mi, Kim Sung-cheol, Roh Jeong-eui, Ahn Dong-goo, Park Jin-joo', 2021);


-- Insertion des données pour la table Favoris
INSERT INTO Favoris (ID_Utilisateur, ID_Drama) VALUES  
-- Favoris de Jean (ID_Utilisateur = 2)
(2, 1),  -- Jean aime Crash Landing on You
(2, 2),  -- Jean aime Itaewon Class
(2, 6),  -- Jean aime Hospital Playlist
(2, 9),  -- Jean aime Squid Game
(2, 12), -- Jean aime Our Beloved Summer

-- Favoris de Marie (ID_Utilisateur = 3)
(3, 3),  -- Marie aime Sky Castle
(3, 5),  -- Marie aime Mr. Sunshine
(3, 8),  -- Marie aime Signal
(3, 14), -- Marie aime Flower of Evil
(3, 17), -- Marie aime The Glory

-- Favoris de Pierre (ID_Utilisateur = 4)
(4, 4),  -- Pierre aime My Sassy Girl
(4, 7),  -- Pierre aime Busted! Saison 1
(4, 10), -- Pierre aime Vincenzo
(4, 15), -- Pierre aime Hometown Cha-Cha-Cha
(4, 19), -- Pierre aime 2521
(4, 20); -- Pierre aime D.P.

-- Insertion des données pour la table Avis
INSERT INTO Avis (ID_Utilisateur, ID_Drama, Note) VALUES  
-- Avis de Jean (ID_Utilisateur = 2)
(2, 1, 5),  -- Jean donne 5/5 à Crash Landing on You
(2, 2, 4),  -- Jean donne 4/5 à Itaewon Class
(2, 6, 5),  -- Jean donne 5/5 à Hospital Playlist
(2, 9, 3),  -- Jean donne 3/5 à Squid Game
(2, 11, 4), -- Jean donne 4/5 à Start-Up
(2, 12, 5), -- Jean donne 5/5 à Our Beloved Summer
(2, 16, 4), -- Jean donne 4/5 à Business Proposal

-- Avis de Marie (ID_Utilisateur = 3)
(3, 3, 5),  -- Marie donne 5/5 à Sky Castle
(3, 5, 5),  -- Marie donne 5/5 à Mr. Sunshine
(3, 8, 5),  -- Marie donne 5/5 à Signal
(3, 14, 4), -- Marie donne 4/5 à Flower of Evil
(3, 17, 5), -- Marie donne 5/5 à The Glory
(3, 18, 3), -- Marie donne 3/5 à Snowdrop
(3, 20, 4), -- Marie donne 4/5 à D.P.

-- Avis de Pierre (ID_Utilisateur = 4)
(4, 4, 3),  -- Pierre donne 3/5 à My Sassy Girl
(4, 7, 4),  -- Pierre donne 4/5 à Busted! Saison 1
(4, 10, 5), -- Pierre donne 5/5 à Vincenzo
(4, 13, 4), -- Pierre donne 4/5 à Moon Lovers: Scarlet Heart Ryeo
(4, 15, 5), -- Pierre donne 5/5 à Hometown Cha-Cha-Cha 
(4, 16, 3), -- Pierre donne 3/5 à Business Proposal
(4, 19, 5), -- Pierre donne 5/5 à 2521
(4, 20, 4), -- Pierre donne 4/5 à D.P.

-- Avis de Admin (ID_Utilisateur = 1)
(1, 1, 5),  -- Admin donne 5/5 à Crash Landing on You
(1, 5, 5),  -- Admin donne 5/5 à Mr. Sunshine
(1, 6, 4),  -- Admin donne 4/5 à Hospital Playlist
(1, 8, 5),  -- Admin donne 5/5 à Signal
(1, 9, 4),  -- Admin donne 4/5 à Squid Game
(1, 10, 5), -- Admin donne 5/5 à Vincenzo
(1, 14, 5), -- Admin donne 5/5 à Flower of Evil
(1, 15, 4), -- Admin donne 4/5 à Hometown Cha-Cha-Cha
(1, 17, 5), -- Admin donne 5/5 à The Glory
(1, 19, 5); -- Admin donne 5/5 à 2521