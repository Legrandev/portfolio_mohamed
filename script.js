// script.js
class Portfolio {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.initNavigation();
        this.initThemeToggle();
        this.initModals();
        this.initSmoothScroll();
        this.initCVDownload();
    }

        
    // Gestion du thème
    initThemeToggle() {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    // Navigation smooth scroll
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Navigation fixe
    initNavigation() {
        const nav = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.style.background = 'var(--background)';
                nav.style.backdropFilter = 'blur(8px)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.8)';
                if (this.currentTheme === 'dark') {
                    nav.style.background = 'rgba(0, 0, 0, 0.5)';
                }
            }
        });
    }

    // Téléchargement CV
    initCVDownload() {
        const downloadBtn = document.getElementById('download-cv');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const link = document.createElement('a');
                link.href = 'assets/cv.pdf';
                link.download = 'CV_Mohamed_BOUSARGHINI.pdf';
                link.click();
            });
        }
    }

    // Gestion des modales
    initModals() {
        this.initProjetModals();
        this.initSAEModals();
    }

    initProjetModals() {
        document.addEventListener('click', (e) => {
            const projetCard = e.target.closest('.projet-card');
            if (projetCard) {
                const projetId = projetCard.dataset.projetId;
                this.openProjetModal(projetId);
            }
        });
    }

    initSAEModals() {
        document.addEventListener('click', (e) => {
            const saeCard = e.target.closest('.projet-card[data-sae-id]');
            if (saeCard) {
                const saeId = saeCard.dataset.saeId;
                this.openSAEModal(saeId);
            }
        });
    }

    openProjetModal(projetId) {
        const projet = this.getProjetById(projetId);
        if (!projet) return;

        const modal = document.getElementById('projet-modal');
        const title = modal.querySelector('#projet-modal-title');
        const body = modal.querySelector('#projet-modal-body');

        title.textContent = projet.titre;
        body.innerHTML = this.createProjetModalBody(projet);

        modal.style.display = 'flex';

        // Fermer la modal
        const closeBtn = modal.querySelector('#projet-modal-close');
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    openSAEModal(saeId) {
        const sae = this.getSAEById(saeId);
        if (!sae) return;

        const modal = document.getElementById('sae-modal');
        const title = modal.querySelector('#sae-modal-title');
        const body = modal.querySelector('#sae-modal-body');

        title.textContent = sae.intitule;
        body.innerHTML = this.createSAEModalBody(sae);

        modal.style.display = 'flex';

        // Fermer la modal
        const closeBtn = modal.querySelector('#sae-modal-close');
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    createProjetModalBody(projet) {
    // Fonction pour rendre les liens cliquables
    const makeLinksClickable = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, url => 
            `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">${url}</a>`
        );
    };

    let preuvesHTML = '';
    if (projet.preuves && projet.preuves.length > 0) {
        preuvesHTML = `
            <div>
                <h3>Preuves</h3>
                <div class="preuves-container">
                    ${projet.preuves.map(preuve => {
                        if (preuve.type === 'texte') {
                            const texteAvecLiens = makeLinksClickable(preuve.contenu);
                            return `
                                <div class="preuve-texte">
                                    ${texteAvecLiens.replace(/\n/g, '<br>')}
                                </div>
                            `;
                        } else {
                            return `
                                <div class="preuve-image">
                                    <img src="${preuve.contenu}" alt="${preuve.legende || 'Preuve'}" 
                                         style="max-width: 100%; height: auto; border-radius: 0.5rem; margin-bottom: 0.5rem;">
                                    ${preuve.legende ? `
                                        <p class="text-muted" style="text-align: center; font-style: italic; margin: 0;">
                                            ${preuve.legende}
                                        </p>
                                    ` : ''}
                                </div>
                            `;
                        }
                    }).join('')}
                </div>
            </div>
        `;
    }

    return `
        <div class="modal-image">
            <img src="${projet.image}" alt="${projet.titre}" style="width: 100%; height: 16rem; object-fit: cover;">
        </div>
        
        <div>
            <h3 style="margin-bottom: 0.5rem;">Technologies utilisées</h3>
            <p class="text-muted" style="margin: 0;">${projet.technologies}</p>
        </div>
        
        <div>
            <h3 style="margin-bottom: 0.5rem;">Description complète</h3>
            <div class="modal-description">
                ${projet.detailsComplets}
            </div>
        </div>
        
        <div>
            <h3 style="margin-bottom: 0.5rem;">Compétences développées</h3>
            <div class="projet-skills">
                ${projet.competences.map(comp => 
                    `<span class="projet-skill">${comp}</span>`
                ).join('')}
            </div>
        </div>
        
        ${preuvesHTML}
    `;
}

    createSAEModalBody(sae) {
    let preuvesHTML = '';
    if (sae.preuves && sae.preuves.length > 0) {
        preuvesHTML = `
            <div>
                <h3>Preuves</h3>
                <div class="preuves-container">
                    ${sae.preuves.map(preuve => {
                        if (preuve.type === 'texte') {
                            return `<p class="text-muted">${preuve.contenu}</p>`;
                        } else {
                            return `
                                <div class="preuve-image">
                                    <img src="${preuve.contenu}" alt="${preuve.legende || 'Preuve'}" style="max-width: 100%; border-radius: 0.5rem;">
                                    ${preuve.legende ? `<p class="text-muted" style="text-align: center; font-style: italic; margin-top: 0.5rem;">${preuve.legende}</p>` : ''}
                                </div>
                            `;
                        }
                    }).join('')}
                </div>
            </div>
        `;
    }

    return `
        <div class="modal-image">
            <img src="${sae.image}" alt="${sae.intitule}">
        </div>
        <div>
            <h3>Description</h3>
            <p class="text-muted">${sae.descriptionComplete}</p>
        </div>
        <div>
            <h3>Récit chronologique</h3>
            <ol style="padding-left: 1.5rem;">
                ${sae.recitChronologique.map(etape => 
                    `<li class="text-muted" style="margin-bottom: 0.5rem;">${etape}</li>`
                ).join('')}
            </ol>
        </div>
        <div>
            <h3>Compétences acquises</h3>
            <div class="projet-skills">
                ${sae.competences.map(comp => 
                    `<span class="projet-skill">${comp}</span>`
                ).join('')}
            </div>
        </div>
        ${preuvesHTML}
    `;
}

    getProjetById(id) {
        return this.getProjetsData().find(p => p.id == id);
    }

    getSAEById(id) {
        return this.getSAEsData().find(s => s.id == id);
    }

    getProjetsData() {
    return [
        {
            id: 1,
            titre: "LolBalancer",
            image: "https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/72B5ASZ2DNFWPJFJTKWTD644WA.jpg",
            description: "Développement d'une interface web moderne permettant d'ajouter des joueurs, générer des équipes et gérer les rôles avec un design clair/sombre personnalisable.",
            competences: ["Manipulation de données", "Organisation et modularité du code", "Interface web dynamique"],
            technologies: "HTML5, CSS3, JavaScript, JSON",
            detailsComplets: "J'ai conçu une application web pour des amis, centrée sur l'ergonomie et l'esthétique moderne. Elle intègre un mode clair adouci (fond gris clair non agressif) et un mode sombre avec une identité visuelle violette. Le site permet d'ajouter des joueurs, de générer des équipes équilibrées et d'exporter ou importer des données JSON. Une attention particulière a été portée à la personnalisation visuelle : logo modifiable, fond personnalisable et bannière dans le header. L'interface est réactive, fluide et agréable grâce à des animations CSS et des composants modulaires.",
            duree: "3 mois",
            preuves: [
                {
                    type: "texte",
                    contenu: "Code source disponible sur GitHub : https://github.com/Legrandev/lolbalancer"
                },
                {
                    type: "image",
                    contenu: "assets/images/lol_balancer1.png",
                    legende: "Interface principale de l'application LolBalancer"
                },
                {
                    type: "image",
                    contenu: "assets/images/lol_balancer2.png",
                    legende: "Interface principale de l'application LolBalancer"
                },
                {
                    type: "image",
                    contenu: "assets/images/lol_balancer3.png",
                    legende: "Résultat de l'équilibrage"
                }
            ]
        },

                {
            id: 2,
            titre: "Visualisateur d'Équations Différentielles",
            image: "assets/images/maths.jpg",
            description: "Application web interactive pour visualiser et résoudre des équations différentielles ordinaires avec différentes méthodes numériques.",
            competences: ["Python", "Flask", "Matplotlib", "NumPy", "HTML/CSS/JS", "Maths appliquées", "Analyse numérique"],
            technologies: "Python, Flask, Matplotlib, NumPy, HTML5, CSS3, JavaScript",
            detailsComplets: `
                <p>Ce projet démontre mon intérêt pour les mathématiques appliquées en créant un outil pédagogique interactif.</p>
                <p>L'application permet de visualiser la résolution d'équations différentielles ordinaires (EDO) en utilisant différentes méthodes numériques comme Euler et Runge-Kutta.</p>
                
                <h4>Fonctionnalités principales :</h4>
                <ul>
                    <li>Interface web intuitive pour saisir les équations</li>
                    <li>Résolution numérique avec méthodes d'Euler et Runge-Kutta d'ordre 4</li>
                    <li>Visualisation comparative des différentes méthodes</li>
                    <li>Gestion des conditions initiales et paramètres</li>
                    <li>Export des graphiques en format image</li>
                </ul>
                
                <h4>Aspect mathématique :</h4>
                <p>L'application résout des EDO du type dy/dt = f(t,y) en implémentant les algorithmes numériques étudiés en prépa MPSI, démontrant ainsi ma maîtrise des concepts mathématiques avancés.</p>
            `,
            duree: "2 semaines",
            preuves: [
                {
                    type: "texte",
                    contenu: "Code source disponible sur GitHub : https://github.com/Legrandev/visualiseur-equation-differentielle"
                },
                {
                    type: "image", 
                    contenu: "assets/images/edo_interface.png",
                    legende: "Interface principale de l'application"
                },
                {
                    type: "image",
                    contenu: "assets/images/edo_interface2.png",
                    legende: "Comparaison des méthodes Euler et Runge-Kutta"
                },
                {
                    type: "texte",
                    contenu: "Implémentation des algorithmes mathématiques :<br>- Méthode d'Euler explicite<br>- Méthode de Runge-Kutta d'ordre 4<br>- Gestion des erreurs numériques<br>- Optimisation des calculs avec NumPy"
                }
            ]
        }
    ];
}

    getSAEsData() {
    return [
        {
            id: 1,
            intitule: "SAE - Jeu d'échecs en Java",
            image: "https://www.apprendre-les-echecs-24h.com/wp-content/uploads/2019/10/comment-jouer-aux-echecs.png",
            descriptionCourte: "Création d'un jeu d'échecs en Java en console, intégrant un système de tours, une horloge et la gestion des déplacements, conçu selon une architecture orientée objet modulaire.",
            competences: ["JAVA", "Diagramme de classe", "Interface Console"],
            descriptionComplete: "Description générale complète de la SAE et de ses objectifs pédagogiques.",
            recitChronologique: [
                "Analyse des besoins et conception de l'architecture du jeu",
                "Implémentation des classes de base (Pièce, Plateau, Joueur)",
                "Développement de la logique de déplacement pour chaque type de pièce",
                "Intégration du système de tours et de l'horloge",
                "Tests et débogage des règles du jeu",
                "Finalisation et documentation du code",
            ],
            preuves: [
                {
                    type: "image",
                    contenu: "assets/images/echec.png",
                    legende: "Capture d'écran du jeu en cours d'exécution"
                }
            ],
            note: "16/20"
        },
        {
            id: 2,
            intitule: "SAE - Étude d'un réseau social",
            image: "https://st2.depositphotos.com/1267016/5599/v/450/depositphotos_55995307-stock-illustration-social-networks-internet-communication-vector.jpg",
            descriptionCourte: "Réalisation d'une base de données pour un réseau social et création de visualisations Python pour analyser l'engagement des utilisateurs.",
            competences: ["SQL", "Python", "Diagramme entité-association", "Matplotlib", "Pandas","Numpy", "DbDesigner", "Optimisation de requêtes","Looping"],
            descriptionComplete: "Dans ce projet, nous avons conçu et généré une base de données relationnelle à partir d'un fichier de données utilisateurs, en automatisant la création des tables SQL avec clés primaires et étrangères. Nous avons ensuite utilisé Python avec Pandas et Matplotlib pour produire plusieurs visualisations permettant d'analyser l'engagement des utilisateurs selon différents critères (commentaires, likes, partages, type d'abonnement). Les analyses ont mis en évidence des tendances comme la corrélation entre commentaires et engagement ou l'impact du type d'abonnement sur le temps passé sur la plateforme. Ce travail a mêlé des compétences techniques (préparation des données, scripts SQL et visualisation) et analytiques (interprétation et synthèse des résultats).",
            recitChronologique: [
                "Étude du cahier des charges et analyse des données du jeu d'essai.",
                "Génération automatisée des tables SQL à partir des fichiers de données (Python → script SQL).",
                "Implémentation de la base de données avec gestion des clés primaires et étrangères.",
                "Création de visualisations graphiques avec Pandas et Matplotlib pour interpréter les données.",
                "Analyse des résultats et mise en perspective des comportements des utilisateurs.",
            ],
            preuves: [
                {
                    type: "image",
                    contenu: "assets/images/diagramme_uml.png",
                    legende: "Diagramme UML de la base de données"
                },
                {
                    type: "image",
                    contenu: "assets/images/visualisation_reseau.png",
                    legende: "Visualisation des données du réseau social"
                }
            ],
            note: "16/20"
        },
        {
            id: 3,
            intitule: "SAE - Projet Exposition",
            image: "https://img.lemde.fr/2013/01/22/15/0/1024/512/1342/671/60/0/ill_1820382_c05d_archives-pierrefitte1.jpg",
            descriptionCourte: "Projet étudiant autour d'une exposition sur les manuels scolaires, travail en équipe de 6 pour découvrir l'événement, interviewer l'organisateur et créer un compte rendu et un site web.",
            competences: ["Travail en équipe", "HTML/CSS", "Javascript", "Chef d'équipe", "Organisation", "Esprit critique"],
            descriptionComplete: "Nous avons d'abord recherché un événement culturel gratuit et proche pour tout le groupe. En tant que chef d'équipe, j'ai aidé à organiser cette recherche en fixant des critères et en centralisant les propositions. Ensuite, j'ai pris en charge les premiers contacts avec l'organisateur et, avec le groupe, nous avons préparé des questions pour la visite. Lors de l'événement, j'ai posé les questions principales à l'organisateur, pendant que d'autres prenaient des notes et interrogeaient les visiteurs. Enfin, j'ai coordonné la rédaction du journal de bord et du compte rendu de l'interview, avant que nous terminions ensemble par la création du site web pour présenter l'événement et notre projet.",
            recitChronologique: [
                "Recherche d'événement : liens partagés sur Discord, critères sélectionnés, désignation du chef de groupe.",
                "Contact : mails aux musées et archives, prise de contact avec Thierry Claerr, suivi des réponses.",
                "Confirmation : réception et diffusion de la date du rendez-vous.",
                "Jour de l'événement : poser les questions préparées à l'organisateur, prise de notes.",
                "Feuille de route et affiche : finalisation des supports visuels et organisation des étapes.",
                "Journal de bord : rédaction de l'interview et compte rendu avec Dimitar, tri des données.",
                "Site web : création du site selon les consignes, intégration de contenu et photos.",
                "Soutenance : réalisation de la diapo et préparation de l'oral.",
            ],
            preuves: [
                {
                    type: "image",
                    contenu: "assets/images/exposition_photo.jpg",
                    legende: "Photo de l'exposition"
                }
            ],
            note: "18/20"
        },
        {
            id: 4,
            intitule: "SAE - Analyse et modélisation d'un réseau social en Python",
            image: "https://img.freepik.com/vecteurs-premium/schema-reseau-social-monde-reseau-social-connecter-gens-idee-connexion-symbole-personnes_797523-1990.jpg?w=360",
            descriptionCourte: "Projet Python visant à analyser et modéliser un réseau social à partir de données d'interactions entre individus.",
            competences: ["Python", "Optimisation", "Test"],
            descriptionComplete: "Dans ce projet, j'ai commencé par représenter un réseau social sous forme de tableau listant les interactions. J'ai ensuite développé des fonctions pour calculer le nombre d'amis d'une personne et la taille totale du réseau. J'ai travaillé sur la lecture de fichiers CSV et l'élimination des doublons pour obtenir des données fiables. La modélisation a été ensuite optimisée avec un dictionnaire pour faciliter l'analyse des relations. Enfin, j'ai identifié les personnes les plus populaires grâce à des fonctions spécifiques.",
            recitChronologique: [
                "Construction du tableau des interactions.",
                "Développement des fonctions d'analyse (nombre d'amis, taille du réseau).",
                "Lecture et nettoyage des fichiers CSV.",
                "Transformation du réseau en dictionnaire pour un accès optimisé.",
                "Identification des individus les plus populaires.",
            ],
            preuves: [],
            note: "19/20"
        }
    ];
}
}


// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
});