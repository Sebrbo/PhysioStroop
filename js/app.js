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

function onModeChange() {
  // Affichage du champ "affichage par mot" uniquement si mode auto
  els.autoOnly.style.display = (els.mode.value === 'auto') ? 'flex' : 'none';
}

function detectLanguage() {
  if (els.lang.value !== 'auto') return els.lang.value;
  const sys = (navigator.language || 'fr').slice(0,2).toLowerCase();
  return (sys === 'en') ? 'en' : 'fr';
}

// -------- Navigation de base
els.mode.addEventListener('change', onModeChange);
onModeChange();

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

// Pour l’instant, juste alterner le mot (on branchera la vraie logique Stroop ensuite)
let demo = 0;
function renderStimulusPlaceholder() {
  const lang = detectLanguage();
  const words = (lang === 'en')
    ? ['RED','BLUE','GREEN','YELLOW','ORANGE','PURPLE']
    : ['ROUGE','BLEU','VERT','JAUNE','ORANGE','VIOLET'];

  demo = (demo + 1) % words.length;
  els.stim.textContent = words[demo];

  // Position aléatoire légère (±10% écran)
  const dx = (Math.random() * 20 - 10); // -10 à +10 vw
  const dy = (Math.random() * 20 - 10); // -10 à +10 vh
  els.stim.style.position = 'relative';
  els.stim.style.left = dx + 'vw';
  els.stim.style.top = dy + 'vh';

  // Couleur: pour l’instant noir ; couleur réelle viendra à l’étape Stroop
  els.stim.style.color = 'currentColor';
}
