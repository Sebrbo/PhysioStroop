// PhysioStroop — app.js (stable)

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
    stop: "STOP",
    endTitle: "Session complete",
    restart: "Restart",
    menu: "Main menu"
  }
};

let timers = { session: null, countdown: null, autorestart: null };
let wakeLock = null; // Empêche la mise en veille

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
  const setText = (sel, text) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = text;
  };

  setText('label[for="lang-select"]', t.lang);
  setText('label[for="mode-select"]', t.mode);
  setText('label[for="colors-select"]', t.colors);
  setText('label[for="session-duration"]', t.session);
  setText('label[for="stim-duration"]', t.stim);
  setText('label[for="autorestart"]', t.autorestart);
  setText('label[for="darkmode"]', t.dark);

  const setById = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setById('start-btn', t.start);
  setById('stop-btn', t.stop);
  const endTitle = document.querySelector('#screen-end h2');
  if (endTitle) endTitle.textContent = t.endTitle;
  setById('restart-btn', t.restart);
  setById('menu-btn', t.menu);
}

// --- Affichage de l'introduction, des notes et du bloc "À propos" selon la langue ---
function applyIntro(lang) {
  const isEn = (lang === 'en');

  // Intro (À propos / About)
  const introFr = document.getElementById('intro-fr');
  const introEn = document.getElementById('intro-en');
  const introSum = document.getElementById('intro-summary');
  if (introFr && introEn && introSum) {
    introFr.style.display = isEn ? 'none' : 'block';
    introEn.style.display = isEn ? 'block' : 'none';
    introSum.textContent = isEn ? 'About' : 'À propos';
  }

  // Notes d’installation (FR/EN)
  const noteFr = document.querySelector('.install-note');
  const noteEn = document.querySelector('.install-note-en');
  if (noteFr && noteEn) {
    noteFr.style.display = isEn ? 'none' : 'block';
    noteEn.style.display = isEn ? 'block' : 'none';
  }

  // Bloc "À propos de PhysioStroop" (FR/EN)
  const aboutFr = document.getElementById('about-fr');
  const aboutEn = document.getElementById('about-en');
  const aboutSum = document.getElementById('about-summary');
  if (aboutFr && aboutEn && aboutSum) {
    aboutFr.style.display = isEn ? 'none' : 'block';
    aboutEn.style.display = isEn ? 'block' : 'none';
    aboutSum.textContent = isEn ? 'About PhysioStroop' : 'À propos de PhysioStroop';
  }
}

function onModeChange() {
  if (!els.autoOnly) return;
  els.autoOnly.style.display = (els.mode.value === 'auto') ? 'flex' : 'none';
}

function detectLanguage() {
  // 1) Priorité à ?lang=
  const params = new URLSearchParams(window.location.search);
  const qlang = (params.get('lang') || '').toLowerCase();
  if (qlang === 'fr' || qlang === 'en') return qlang;

  // 2) Valeur sélectionnée
  if (els.lang && els.lang.value !== 'auto') return els.lang.value;

  // 3) Langue système
  const sys = (navigator.language || 'fr').slice(0,2).toLowerCase();
  return (sys === 'en') ? 'en' : 'fr';
}

// Synchroniser le menu langue avec l'URL (si ?lang=fr ou ?lang=en)
(function syncLangSelectFromURL(){
  const params = new URLSearchParams(window.location.search);
  const qlang = (params.get('lang') || '').toLowerCase();
  if (els.lang) {
    els.lang.value = (qlang === 'fr' || qlang === 'en') ? qlang : 'auto';
  }
})();

// -------- Listeners de base
if (els.mode) els.mode.addEventListener('change', onModeChange);
onModeChange();

// --- Appliquer les textes d'interface + blocs selon la langue (init unique)
function initLanguageUI() {
  const lang = detectLanguage();
  applyUIText(lang);
  applyIntro(lang);
}
initLanguageUI();

// --- Changement de langue (un seul listener, recharge pour garder ?lang=)
if (els.lang) {
  els.lang.addEventListener('change', () => {
    const val = els.lang.value; // 'auto' | 'fr' | 'en'
    const url = new URL(window.location.href);
    if (val === 'auto') url.searchParams.delete('lang');
    else url.searchParams.set('lang', val);
    window.location.href = url.toString();
  });
}

// --- Dark mode live
if (els.dark) els.dark.addEventListener('change', () => applyDarkMode(els.dark.checked));

// --- Démarrage / navigation
if (els.start) els.start.addEventListener('click', () => {
  applyDarkMode(els.dark && els.dark.checked);
  startCountdown();
});

if (els.stop) els.stop.addEventListener('click', stopSessionToEnd);
if (els.restart) els.restart.addEventListener('click', () => {
  clearAutorestart();
  startCountdown();
});
if (els.menuBtn) els.menuBtn.addEventListener('click', () => {
  clearAutorestart();
  show('menu');
});

// -------- Countdown 4-3-2-1-Go (noir)
function startCountdown() {
  show('countdown');
  const seq = ['4','3','2','1','Go'];
  let i = 0;
  if (els.countdown) els.countdown.textContent = seq[i];
  clearInterval(timers.countdown);
  timers.countdown = setInterval(() => {
    i++;
    if (i >= seq.length) {
      clearInterval(timers.countdown);
      startSession();
      return;
    }
    if (els.countdown) els.countdown.textContent = seq[i];
  }, 1000);
}

// -------- Session --------
let sessionEndAt = 0;
let sessionTickTimer = null;

function startSession() {
  show('session');

  const total = clamp(parseFloat(els.sessionDuration?.value) || 45, 5, 3600);
  sessionEndAt = Date.now() + total * 1000;

  // Empêcher la mise en veille
  if ('wakeLock' in navigator) {
    try {
      navigator.wakeLock.request('screen').then(lock => {
        wakeLock = lock;
        wakeLock.addEventListener('release', () => { wakeLock = null; });
      });
    } catch (err) {
      console.warn('WakeLock non disponible :', err);
    }
  }

  attachStimulusHandlers();
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

  // Libérer le Wake Lock
  if (wakeLock) {
    try { wakeLock.release(); } catch (err) { /* ignore */ }
    wakeLock = null;
  }

  show('end');

  const delay = clamp(parseFloat(els.autorestart?.value) || 0, 0, 30);
  if (delay > 0) startAutorestartCountdown(delay);
  else if (els.endAutorestart) els.endAutorestart.textContent = '';
}

function startAutorestartCountdown(sec) {
  let remain = Math.round(sec);
  if (els.endAutorestart) els.endAutorestart.textContent = `Redémarrage automatique dans ${remain}s…`;
  clearInterval(timers.autorestart);
  timers.autorestart = setInterval(() => {
    remain--;
    if (remain <= 0) {
      clearInterval(timers.autorestart);
      startCountdown();
    } else {
      if (els.endAutorestart) els.endAutorestart.textContent = `Redémarrage automatique dans ${remain}s…`;
    }
  }, 1000);
}

function clearAutorestart() {
  clearInterval(timers.autorestart);
  if (els.endAutorestart) els.endAutorestart.textContent = '';
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// ------- Gestion du stimulus
function attachStimulusHandlers() {
  if (els.mode?.value === 'manual') {
    screens.session.addEventListener('click', onManualNext);
  } else {
    const step = clamp(parseFloat(els.stimDuration?.value) || 2, 0.5, 10);
    sessionTickTimer = setInterval(onAutoNext, step * 1000);
  }
}
function detachStimulusHandlers() {
  screens.session.removeEventListener('click', onManualNext);
  clearInterval(sessionTickTimer);
  sessionTickTimer = null;
}

function onManualNext(e) {
  if (e.target === els.stop) return;
  renderStimulusPlaceholder();
}
function onAutoNext() {
  renderStimulusPlaceholder();
}

// --------- Logique Stroop incongruente ---------
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

let lastPair = null;

function renderStimulusPlaceholder() {
  const lang = detectLanguage();
  const count = parseInt(els.colors?.value, 10) || 4;
  const set = COLOR_SETS[lang][count];

  const wordIndex = Math.floor(Math.random() * set.length);
  const word = set[wordIndex].name;

  let colorIndex;
  do {
    colorIndex = Math.floor(Math.random() * set.length);
  } while (colorIndex === wordIndex);

  const color = set[colorIndex].color;

  if (lastPair && lastPair.word === word && lastPair.color === color) {
    return renderStimulusPlaceholder();
  }
  lastPair = { word, color };

  if (els.stim) {
    els.stim.textContent = word;
    els.stim.style.color = color;

    // Position aléatoire légère (±10%)
    const dx = (Math.random() * 20 - 10);
    const dy = (Math.random() * 20 - 10);
    els.stim.style.position = 'relative';
    els.stim.style.left = dx + 'vw';
    els.stim.style.top = dy + 'vh';
  }
}
