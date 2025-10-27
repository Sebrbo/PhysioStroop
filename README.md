# PhysioStroop
Version rééducative et interactive du test de Stroop / A therapeutic adaptation of the classic Stroop test
*(Bilingual README — Français / English)*

---

## 🇫🇷 Version française

### Objectif
**PhysioStroop** est une application web open-source inspirée du **test de Stroop** classique, conçue comme **outil de distraction cognitive** pour accompagner les exercices de rééducation.  
L’objectif n’est pas de mesurer les temps de réaction, mais de stimuler **l’attention** et la **flexibilité cognitive** pendant des activités motrices ou cognitives.

> ⚠️ **Note** : PhysioStroop est une adaptation libre inspirée du test de Stroop classique.  
> Cette application n’a pas pour vocation de réaliser un diagnostic ni une mesure clinique, mais d’offrir un support d’exercices cognitifs et attentionnels.

### Fonctionnalités principales
- Deux modes : **Automatique** (changement toutes les X s) et **Manuel** (toucher pour suivant)
- **Incongruent uniquement** (mot et couleur toujours différents)
- **Deux jeux de couleurs** : standard (rouge, bleu, vert, jaune) + étendu (orange, violet)
- **Deux langues** : Français / Anglais (auto + choix manuel)
- **Fond blanc** ou **mode sombre**
- **Paramètres** : durée totale (défaut 45 s), affichage par stimulus (défaut 2 s, 0,5–10 s), redémarrage auto (défaut 15 s, 0–30 s)
- **Position du mot** légèrement variable, **STOP** discret
- **PWA** : iPad, iPhone, Android, desktop, fonctionnement **hors ligne** après installation
- **Sans dépendances externes** (HTML, CSS, JS)

### Technologies
HTML5 · CSS3 · JavaScript (vanilla)

### Installation rapide
1. Ouvrez la page hébergée (GitHub Pages ou autre serveur).  
2. Sur iPad/iPhone/Android : **Ajouter à l’écran d’accueil** pour installer la Web App.  
3. Une fois installée, fonctionne **hors ligne**.

### Feuille de route (exemples)
- [ ] Préférences de thème (clair/sombre) dans le menu  
- [ ] PWA manifest + service worker (cache hors ligne)  
- [ ] Wake Lock pendant la session  
- [ ] Export local des paramètres (JSON)

### Contributions
Les contributions sont bienvenues (issues, pull requests). Merci de rester aligné avec l’objectif non clinique.

### Licence
**CC BY-NC 4.0** — utilisation non commerciale avec attribution.  
➡️ Détails dans le fichier `LICENSE`.

---

## 🇬🇧 English version

### Purpose
**PhysioStroop** is an open-source web app inspired by the **classic Stroop test**, designed as a **cognitive distraction tool** to support rehabilitation exercises.  
It does not measure reaction times; it aims to stimulate **attention** and **cognitive flexibility** during physical or mental activities.

> ⚠️ **Note:** PhysioStroop is a freely adapted version inspired by the classic Stroop test.  
> It is **not intended for diagnostic or clinical measurement**, but as a **support tool for cognitive and attentional exercises**.

### Main features
- Two modes: **Automatic** (changes every X s) and **Manual** (tap for next)
- **Incongruent only** (word and ink color never match)
- **Two color sets**: standard (red, blue, green, yellow) + extended (orange, purple)
- **Two languages**: French / English (auto + manual switch)
- **White** or **dark** background
- **Parameters**: total duration (default 45 s), per-stimulus display (default 2 s, 0.5–10 s), auto-restart (default 15 s, 0–30 s)
- Slightly randomized **word position**, discreet **STOP** button
- **PWA**: iPad, iPhone, Android, desktop, **offline** after install
- **No external dependencies** (HTML, CSS, JS)

### Built with
HTML5 · CSS3 · Vanilla JavaScript

### Quick start
1. Open the hosted page (GitHub Pages or any server).  
2. On iPad/iPhone/Android: **Add to Home Screen** to install the Web App.  
3. Runs **offline** once installed.

### Roadmap (examples)
- [ ] Theme preferences (light/dark) in menu  
- [ ] PWA manifest + service worker (offline cache)  
- [ ] Wake Lock during sessions  
- [ ] Local export of settings (JSON)

### Contributing
Issues and PRs are welcome. Please keep the non-clinical scope in mind.

### License
**CC BY-NC 4.0** — non-commercial use with attribution.  
➡️ See the `LICENSE` file for details.
