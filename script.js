/* ---------- Splash: a ray of light writes "licares" (once per session) ---------- */
(function () {
  if (sessionStorage.getItem('splashSeen')) return;
  sessionStorage.setItem('splashSeen', '1');
  // One continuous pen stroke, l -> s, following the cursive letterforms
  const D = 'M20 165 C50 160 85 70 98 28 C106 0 76 2 72 40 C66 95 80 150 118 150 C135 150 140 118 150 104 C156 100 148 150 172 150 ' +
    'C185 150 200 112 218 104 C190 90 180 150 215 150 C235 150 240 125 250 108 C225 90 215 150 252 148 C262 147 270 115 274 102 ' +
    'C274 125 272 150 300 150 C312 150 316 120 326 104 C336 98 346 104 352 108 C346 125 350 150 372 150 C386 150 398 118 410 106 ' +
    'C420 98 405 92 396 104 C388 116 398 150 440 148 C452 148 458 122 468 106 C476 98 484 100 480 110 C476 120 462 128 470 140 ' +
    'C476 150 500 150 520 142';
  const NS = 'http://www.w3.org/2000/svg';
  const s = document.createElement('div');
  s.id = 'splashScreen';
  s.setAttribute('aria-label', 'licares');
  s.innerHTML = '<svg class="splash-svg" viewBox="0 0 560 190" role="img" aria-label="licares">' +
    '<defs><linearGradient id="rayGrad" x1="0" x2="1"><stop offset="0" stop-color="#7c5cff"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#00d1b2"/></linearGradient></defs>' +
    '<path class="splash-base" d="' + D + '"/><circle class="splash-dot" cx="150" cy="78" r="5"/>' +
    '<path class="splash-lit" d="' + D + '"/><circle class="splash-head" r="5" cx="20" cy="165"/></svg>';
  document.body.prepend(s);
  document.body.style.overflow = 'hidden';

  const lit = s.querySelector('.splash-lit'), head = s.querySelector('.splash-head'), dot = s.querySelector('.splash-dot');
  const len = lit.getTotalLength(), PASSES = 3, DUR = 2200, GAP = 350;
  lit.style.strokeDasharray = len;
  lit.style.strokeDashoffset = len;
  const ease = function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function finish() {
    s.classList.add('hide');
    document.body.style.overflow = '';
    setTimeout(function () { s.remove(); }, 750);
  }
  if (reduce) { setTimeout(finish, 800); return; }

  let pass = 0, start = null;
  function frame(ts) {
    if (start === null) start = ts;
    const t = Math.min((ts - start) / DUR, 1), p = ease(t), at = p * len;
    lit.style.strokeDashoffset = len - at;
    const pt = lit.getPointAtLength(at);
    head.setAttribute('cx', pt.x); head.setAttribute('cy', pt.y);
    dot.classList.toggle('on', p > .24);   // the i is dotted as the pen passes it
    if (t < 1) return requestAnimationFrame(frame);
    pass++;
    if (pass >= PASSES) { head.style.opacity = 0; return setTimeout(finish, 700); }
    // short pause, then trace again from the l
    setTimeout(function () {
      lit.style.strokeDashoffset = len; dot.classList.remove('on');
      start = null; requestAnimationFrame(frame);
    }, GAP);
  }
  requestAnimationFrame(frame);
})();

/* ---------- Data ---------- */
const PROJECTS = [
  { title: 'Educhain', img: 'photo-1639762681485-074b7f938ba0',
    desc: 'Stores student certificates on a blockchain so anyone can verify them and nobody can alter them. The smart contract is written in Rust.',
    tags: ['Rust', 'Smart Contracts', 'Web3', 'JavaScript'],
    live: 'https://blockchain-blond-kappa.vercel.app/', code: 'https://github.com/venvlek/blockchain.git' },
  { title: 'Garden of Success School Website', img: 'photo-1427504494785-3a9ca7044f45',
    desc: 'Multi-page school site with an admin panel for blog posts and the gallery, an EmailJS contact form, and a mobile-first layout.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'EmailJS'],
    live: 'https://venvlek.github.io/Garden-of-Success/', code: 'https://github.com/venvlek/Garden-of-Success' },
  { title: 'GOS Register', img: 'photo-1516321318423-f06f85e504b3',
    desc: 'Web app for school registration. Records student details in one workflow instead of paper forms.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Web App'],
    live: 'https://gos-register.netlify.app/' },
  { title: 'To-Do List App', img: 'photo-1484480974693-6ca0a78fb36b',
    desc: 'Task manager with Google, Apple and guest sign-in, priority levels, date filters and a live stats dashboard. Data persists in LocalStorage.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage'],
    live: 'https://doit-app-phi.vercel.app/', code: 'https://github.com/venvlek/To-Do-List.git' },
  { title: 'Master Pattern', img: 'photo-1541888946425-d81bb19240f5',
    desc: 'Corporate site for a construction company: services, past projects and company profile in a clean, responsive layout.',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    live: 'https://masterparttenltd.com/', code: 'https://github.com/venvlek/Master-Parttern' }
];
const PAGES = [['index.html', 'Home'], ['projects.html', 'Projects'], ['skills.html', 'Skills'], ['about.html', 'About'], ['contact.html', 'Contact']];

/* ---------- Shared UI ---------- */
document.addEventListener('DOMContentLoaded', function () {
  const here = location.pathname.split('/').pop() || 'index.html';
  const root = document.documentElement;
  if (localStorage.getItem('theme') === 'light') root.classList.add('light');

  // Nav
  const nav = document.getElementById('site-nav');
  if (nav) {
    nav.outerHTML = '<nav class="nav"><div class="container nav-inner">' +
      '<a class="brand" href="index.html"><span class="logo" aria-hidden="true"></span><span>Adebiyi Olamilekan</span></a>' +
      '<div class="nav-links" id="navLinks">' + PAGES.map(function (p) {
        return '<a href="' + p[0] + '"' + (p[0] === here ? ' class="active" aria-current="page"' : '') + '>' + p[1] + '</a>';
      }).join('') + '</div>' +
      '<div class="right-actions"><button id="themeToggle" class="btn ghost" aria-label="Toggle theme"></button>' +
      '<button id="menuBtn" class="btn ghost" aria-label="Menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>' +
      '<a class="btn" href="contact.html">Hire Me</a></div></div></nav>';
  }
  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.outerHTML = '<footer class="site-footer"><div class="container"><span>© ' + new Date().getFullYear() +
      ' Adebiyi Olamilekan</span><span><a href="https://github.com/venvlek" target="_blank" rel="noopener">GitHub</a> · ' +
      '<a href="https://www.linkedin.com/in/adebiyi-olamilekan-4b083027a/" target="_blank" rel="noopener">LinkedIn</a> · ' +
      '<a href="mailto:lekzyadebox@gmail.com">Email</a></span></div></footer>';
  }

  // Theme
  const tt = document.getElementById('themeToggle');
  const paint = function () { tt.textContent = root.classList.contains('light') ? '🌞' : '🌙'; };
  paint();
  tt.addEventListener('click', function () {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
    paint();
  });

  // Mobile menu
  const mb = document.getElementById('menuBtn'), nl = document.getElementById('navLinks');
  mb.addEventListener('click', function () {
    const open = nl.classList.toggle('open');
    mb.setAttribute('aria-expanded', open);
  });

  // Project cards
  document.querySelectorAll('[data-projects]').forEach(function (el) {
    const list = el.dataset.projects === 'featured' ? PROJECTS.slice(0, 3) : PROJECTS;
    el.innerHTML = list.map(function (p) {
      return '<article class="card project"><div class="thumb"><img loading="lazy" src="https://images.unsplash.com/' + p.img +
        '?q=80&w=1200&auto=format&fit=crop" alt="' + p.title + ' preview" /></div><h3>' + p.title + '</h3><p class="muted">' + p.desc +
        '</p><div>' + p.tags.map(function (t) { return '<span class="badge">' + t + '</span>'; }).join('') +
        '</div><div class="card-actions"><a class="btn" href="' + p.live + '" target="_blank" rel="noopener">Live</a>' +
        (p.code ? '<a class="btn ghost" href="' + p.code + '" target="_blank" rel="noopener">Code</a>' : '') + '</div></article>';
    }).join('');
  });

  // Stars (home only)
  const sc = document.getElementById('starsContainer');
  if (sc && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 90; i++) {
      const s = document.createElement('div'), z = Math.random() * 3 + 1;
      s.className = 'star';
      s.style.cssText = 'width:' + z + 'px;height:' + z + 'px;left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 +
        '%;animation-duration:' + (Math.random() * 3 + 2) + 's;animation-delay:' + Math.random() * 3 + 's';
      sc.appendChild(s);
    }
  }

  // Avatar overlay (home only)
  const thumb = document.getElementById('avatarThumb'), ov = document.getElementById('avatarOverlay');
  if (thumb && ov) {
    const close = function () { ov.classList.remove('active'); document.body.style.overflow = ''; };
    thumb.addEventListener('click', function () { ov.classList.add('active'); document.body.style.overflow = 'hidden'; });
    document.getElementById('closeAvatar').addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // Contact form (contact page only)
  const form = document.getElementById('contactForm');
  if (form) {
    const st = document.getElementById('formStatus');
    emailjs.init('qks5GXttjyPUHRc4f');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form).entries());
      if (!d.name || !d.email || !d.message) { st.textContent = 'Please fill out all fields.'; return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) { st.textContent = 'Please enter a valid email address.'; return; }
      st.textContent = 'Sending message...';
      emailjs.sendForm('service_hcbd68h', 'template_5sscgwt', form).then(function () {
        st.textContent = "Message sent. I'll reply soon.";
        form.reset();
      }, function (err) {
        st.textContent = 'Message failed to send. Try again or email me directly.';
        console.error('EmailJS Error:', err);
      });
    });
  }
});
