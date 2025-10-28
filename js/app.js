// PhysioStroop — app.js (squelette)

const screens = {
  menu: document.getElementById('screen-menu'),
  countdown: document.getElementById('screen-countdown'),
  session: document.getElementById('screen-session'),
  end: document.getElementById('screen-end'),
};

const els = {
  lang: document.getElementById('lang-select'),
  mode: document.getElementById('mode-select'),
  colors: document.getElementById('colors-select'),
  sessionDuration: document.getElementById('session-duration'),
  stimDuration: document.getElementById('stim-duration'),
  autoOnly: document.getElementById('auto-only'),
  autorestart: document.getElementById('autorestart'),
  dark: document.getElementById('darkmode'),

  start: document.getElementById('start-btn'),
  stop: document.getElementById('stop-btn'),
  stim: document.getElementById('stimulus'),
  countdown: document.querySelector('.countdown'),
  endAutorestart: document.getElementById('end-autorestart'),
  restart: document.getElementById('restart-btn'),
  menuBtn: document.getElementById('menu-btn'),
};

// --- Textes d'interface multilingues ---
const UI_TEXT = {
  fr: {
    start: "Démarrer",
    mode: "Mode",
    lang: "Langue / Language",
    colors: "Jeu de couleurs",
    session: "Durée session (s)",
    stim: "Affichage par mot (s)",
    autorestart: "Redémarrage auto après fin (s)",
    dark: "Mode sombre",
    note: "Affichage incongruent uniquement. Texte en MAJUSCULES. Fond blanc (ou sombre).",
    stop: "STOP",
    endTitle: "Session terminée",
    restart: "Relancer",
    menu: "Menu principal"
  },
  en: {
    start: "Start",
    mode: "Mode",
    lang: "Language / Langue",
    colors: "Color set",
    session: "Session duration (s)",
    stim: "Word display time (s)",
    autorestart: "Auto restart after end (s)",
    dark: "Dark mode",
    note: "Incongruent display only. Uppercase text. White (or dark) background.",
    stop: "STOP",
    endTitle: "Session complete",
    restart: "Restart",
    menu: "Main menu"
  }
};

let timers = {
  session: null,
  countdown: null,
  autorestart: null,
};

function show(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

function applyDarkMode(on) {
  document.body.classList.toggle('dark', !!on);
}

function applyUIText(lang) {
  const t = UI_TEXT[lang] || UI_TEXT.fr;

  // Mettre à jour les labels
  document.querySelector('label[for="lang-select"]').textContent = t.lang;
  document.querySelector('label[for="mode-select"]').textContent = t.mode;
  document.querySelector('label[for="colors-select"]').textContent = t.colors;
  document.querySelector('label[for="session-duration"]').textContent = t.session;
  document.querySelector('label[for="stim-duration"]').textContent = t.stim;
  document.querySelector('label[for="autorestart"]').textContent = t.autorestart;
  document.querySelector('label[for="darkmode"]').textContent = t.dark;

  document.getElementById('start-btn').textContent = t.start;
  document.getElementById('stop-btn').textContent = t.stop;
  document.querySelector('#screen-end h2').textContent = t.endTitle;
  document.getElementById('restart-btn').textContent = t.restart;
  document.getElementById('menu-btn').textContent = t.menu;
  document.querySelector('.note').textContent = t.note;
}

function onModeChange() {
  // Affichage du champ "affichage par mot" uniquement si mode auto
  els.autoOnly.style.display = (els.mode.value === 'auto') ? 'flex' : 'none';
}

function detectLanguage() {
  // 1) Priorité au paramètre ?lang=fr|en dans l’URL
  const params = new URLSearchParams(window.location.search);
  const qlang = (params.get('lang') || '').toLowerCase();
  if (qlang === 'fr' || qlang === 'en') return qlang;

  // 2) Sinon, valeur du sélecteur (si pas "auto")
  if (els.lang.value !== 'auto') return els.lang.value;

  // 3) Sinon, langue système
  const sys = (navigator.language || 'fr').slice(0,2).toLowerCase();
  return (sys === 'en') ? 'en' : 'fr';
}

// Synchroniser le menu langue avec l'URL (si ?lang=fr ou ?lang=en)
(function syncLangSelectFromURL(){
  const params = new URLSearchParams(window.location.search);
  const qlang = (params.get('lang') || '').toLowerCase();
  if (qlang === 'fr' || qlang === 'en') {
    els.lang.value = qlang;
  } else {
    els.lang.value = 'auto';
  }
})();

// -------- Navigation de base
els.mode.addEventListener('change', onModeChange);
onModeChange();

// --- Appliquer les textes d'interface selon la langue ---
const currentLang = detectLanguage();
applyUIText(currentLang);

// Recharge la page quand on change la langue
els.lang.addEventListener('change', () => {
  const val = els.lang.value; // 'auto' | 'fr' | 'en'
  const url = new URL(window.location.href);
  if (val === 'auto') {
    url.searchParams.delete('lang');
  } else {
    url.searchParams.set('lang', val);
  }
  window.location.href = url.toString(); // recharge avec la bonne langue
});

els.dark.addEventListener('change', () => applyDarkMode(els.dark.checked));

// Démarrer flux: menu -> countdown -> session
els.start.addEventListener('click', () => {
  applyDarkMode(els.dark.checked);
  startCountdown();
});

els.stop.addEventListener('click', stopSessionToEnd);
els.restart.addEventListener('click', () => {
  clearAutorestart();
  startCountdown();
});
els.menuBtn.addEventListener('click', () => {
  clearAutorestart();
  show('menu');
});

// -------- Countdown 4-3-2-1-Go (noir)
function startCountdown() {
  show('countdown');
  const seq = ['4','3','2','1','Go'];
  let i = 0;
  els.countdown.textContent = seq[i];

  clearInterval(timers.countdown);
  timers.countdown = setInterval(() => {
    i++;
    if (i >= seq.length) {
      clearInterval(timers.countdown);
      startSession();
      return;
    }
    els.countdown.textContent = seq[i];
  }, 1000);
}

// -------- Session (on branchera la logique Stroop à l’étape suivante)
let sessionEndAt = 0;
let sessionTickTimer = null;

function startSession() {
  show('session');

  const total = clamp(parseFloat(els.sessionDuration.value) || 45, 5, 3600);
  sessionEndAt = Date.now() + total * 1000;

  // Pour le mode automatique, on tick toutes les X secondes.
  // Pour le mode manuel, on change au toucher.
  attachStimulusHandlers();

  // Afficher le premier stimulus (placeholder pour l’instant)
  renderStimulusPlaceholder();

  clearInterval(timers.session);
  timers.session = setInterval(() => {
    if (Date.now() >= sessionEndAt) {
      stopSessionToEnd();
    }
  }, 200);
}

function stopSessionToEnd() {
  clearInterval(timers.session);
  detachStimulusHandlers();
  show('end');

  const delay = clamp(parseFloat(els.autorestart.value) || 0, 0, 30);
  if (delay > 0) {
    startAutorestartCountdown(delay);
  } else {
    els.endAutorestart.textContent = '';
  }
}

function startAutorestartCountdown(sec) {
  let remain = Math.round(sec);
  els.endAutorestart.textContent = `Redémarrage automatique dans ${remain}s…`;
  clearInterval(timers.autorestart);
  timers.autorestart = setInterval(() => {
    remain--;
    if (remain <= 0) {
      clearInterval(timers.autorestart);
      startCountdown();
    } else {
      els.endAutorestart.textContent = `Redémarrage automatique dans ${remain}s…`;
    }
  }, 1000);
}
function clearAutorestart() {
  clearInterval(timers.autorestart);
  els.endAutorestart.textContent = '';
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// ------- Gestion du stimulus (placeholder pour valider l’UI)
function attachStimulusHandlers() {
  if (els.mode.value === 'manual') {
    // Tap anywhere to change
    screens.session.addEventListener('click', onManualNext);
  } else {
    // Auto advance
    const step = clamp(parseFloat(els.stimDuration.value) || 2, 0.5, 10);
    sessionTickTimer = setInterval(onAutoNext, step * 1000);
  }
}
function detachStimulusHandlers() {
  screens.session.removeEventListener('click', onManualNext);
  clearInterval(sessionTickTimer);
  sessionTickTimer = null;
}

function onManualNext(e) {
  // éviter de déclencher si on tape sur STOP
  if (e.target === els.stop) return;
  renderStimulusPlaceholder();
}
function onAutoNext() {
  renderStimulusPlaceholder();
}

// --------- Nouvelle logique Stroop incongruente ---------

// Codes couleur standard et étendu
const COLOR_SETS = {
  fr: {
    4: [
      { name: 'ROUGE', color: '#FF0000' },
      { name: 'BLEU',  color: '#0000FF' },
      { name: 'VERT',  color: '#008000' },
      { name: 'JAUNE', color: '#FFFF00' },
    ],
    6: [
      { name: 'ROUGE',  color: '#FF0000' },
      { name: 'BLEU',   color: '#0000FF' },
      { name: 'VERT',   color: '#008000' },
      { name: 'JAUNE',  color: '#FFFF00' },
      { name: 'ORANGE', color: '#FFA500' },
      { name: 'VIOLET', color: '#800080' },
    ]
  },
  en: {
    4: [
      { name: 'RED',   color: '#FF0000' },
      { name: 'BLUE',  color: '#0000FF' },
      { name: 'GREEN', color: '#008000' },
      { name: 'YELLOW',color: '#FFFF00' },
    ],
    6: [
      { name: 'RED',    color: '#FF0000' },
      { name: 'BLUE',   color: '#0000FF' },
      { name: 'GREEN',  color: '#008000' },
      { name: 'YELLOW', color: '#FFFF00' },
      { name: 'ORANGE', color: '#FFA500' },
      { name: 'PURPLE', color: '#800080' },
    ]
  }
};

let lastPair = null; // pour éviter même mot-couleur

function renderStimulusPlaceholder() {
  const lang = detectLanguage();
  const count = parseInt(els.colors.value, 10); // 4 ou 6
  const set = COLOR_SETS[lang][count];

  // Choisir un mot au hasard
  const wordIndex = Math.floor(Math.random() * set.length);
  const word = set[wordIndex].name;

  // Choisir une couleur d’encre différente (incongruente)
  let colorIndex;
  do {
    colorIndex = Math.floor(Math.random() * set.length);
  } while (colorIndex === wordIndex);

  const color = set[colorIndex].color;

  // Vérifier qu’on ne répète pas la même paire mot-couleur
  if (lastPair && lastPair.word === word && lastPair.color === color) {
    return renderStimulusPlaceholder(); // relance pour une nouvelle combinaison
  }
  lastPair = { word, color };

  // Appliquer affichage
  els.stim.textContent = word;
  els.stim.style.color = color;

  // Position aléatoire légère (±10 %)
  const dx = (Math.random() * 20 - 10);
  const dy = (Math.random() * 20 - 10);
  els.stim.style.position = 'relative';
  els.stim.style.left = dx + 'vw';
  els.stim.style.top = dy + 'vh';
}
