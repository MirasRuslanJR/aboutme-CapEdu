

'use strict';

(function boot() {
  const bootScreen = document.getElementById('boot-screen');
  const terminal = document.getElementById('boot-terminal');
  const bar = document.getElementById('boot-progress');
  const app = document.getElementById('app');

  if (!bootScreen || !terminal || !bar || !app) {
    initApp();
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lines = [
    { text: '> Initializing profile...', delay: 0, cls: 'boot-line-green' },
    { text: '> Checking system modules...', delay: 420, cls: '' },
    { text: '> Loading developer data...', delay: 920, cls: '' },
    { text: '> Scanning repositories...', delay: 1460, cls: '' },
    { text: '> Compiling resources...', delay: 2020, cls: 'boot-line-dim' },
    { text: '> All systems operational.', delay: 2550, cls: 'boot-line-dim' },
    { text: '> ACCESS GRANTED.', delay: 3090, cls: 'boot-line-green' },
  ];

  lines.forEach(({ text, delay, cls }) => {
    setTimeout(() => {
      const p = document.createElement('p');
      p.className = `boot-line${cls ? ` ${cls}` : ''}`;
      p.textContent = text;
      terminal.appendChild(p);
    }, prefersReducedMotion ? 0 : delay);
  });

  let pct = 0;
  const stepMs = prefersReducedMotion ? 16 : 110;

  const iv = window.setInterval(() => {
    const step = pct < 72
      ? Math.random() * 6 + 3
      : Math.random() * 2 + 0.6;
    pct = Math.min(pct + step, 100);
    bar.style.width = `${pct}%`;
    if (pct >= 100) window.clearInterval(iv);
  }, stepMs);

  window.setTimeout(() => {
    bootScreen.classList.add('fade-out');
    app.classList.remove('hidden');

    window.setTimeout(() => {
      if (bootScreen.parentNode) bootScreen.remove();
    }, prefersReducedMotion ? 0 : 700);

    initApp();
  }, prefersReducedMotion ? 350 : 3900);
})();


function initApp() {
  const state = {
    profile: {
      имя: 'Мирас Даулетбек',
      возраст: 15,
      роль: 'Спортивный программист',
      школа: 'НИШ Казахстан',
      статус: 'онлайн',
      навыки: ['C++', 'Python', 'JavaScript', 'HTML/CSS'],
      цели: ['ICPC', 'Open Source', 'Полезные продукты'],
    },
    progress: {
      точка_А: 'Ноль знаний, чистое любопытство',
      точка_Б: 'Создаю проекты и участвую в соревнованиях',
      уровень: 'Продвинутый',
      навыки: {
        html_css: 85,
        javascript: 75,
        алгоритмы: 60,
        cpp: 60,
        python: 70,
      },
      мышление: 'рост',
    },
  };

  initParticles();
  renderHeroJSON(state.profile);
  renderProgressJSON(state.progress);
  initTypewriter();
  initReveal();
  initActiveNav();
  initMobileMenu();
  initBackToTop();
  initCounters();
  initSmoothScroll();
  initTiltAndMotion();
  initFooterYear();
}


function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let W = 0, H = 0, pts = [], rafId = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    pts = spawn(prefersReducedMotion ? 35 : 90);
  }

  function spawn(n) {
    return Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.12 : 0.28),
      vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.12 : 0.28),
      r: Math.random() * 1.4 + 0.4,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,255,136,${0.07 * (1 - d / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,255,136,0.22)';
      ctx.fill();

      if (!prefersReducedMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
    });

    rafId = window.requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  draw();
  if (prefersReducedMotion) window.cancelAnimationFrame(rafId);
}


function toHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"([^"]+)"(\s*:)/g, '<span class="jk">"$1"</span>$2')
    .replace(/:\s*"([^"\\]*)"/g, ': <span class="js">"$1"</span>')
    .replace(/^\s*"([^"]+)",?$/gm, (m) => m.replace(/"([^"]+)"/, '<span class="js">"$1"</span>'))
    .replace(/:\s*(\d+)/g, ': <span class="jn">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="jb">$1</span>');
}

function renderHeroJSON(profile) {
  const el = document.getElementById('hero-json');
  if (!el) return;
  el.innerHTML = toHTML(JSON.stringify(profile, null, 2));
}

function renderProgressJSON(progress) {
  const el = document.getElementById('progress-json');
  if (!el) return;
  el.innerHTML = toHTML(JSON.stringify(progress, null, 2));
}


function initTypewriter() {
  const el = document.getElementById('typed-role');
  if (!el) return;

  const words = [
    'Спортивный программист',
    'Разработчик проектов',
    'Веб-разработчик',
    'Решатель задач',
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) { el.textContent = words[0]; return; }

  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; window.setTimeout(tick, 1400); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    window.setTimeout(tick, deleting ? 55 : 95);
  }

  tick();
}


function initReveal() {
  const items = document.querySelectorAll('.reveal');

  const show = (el) => {
    el.classList.add('visible');
    el.querySelectorAll('.skill-fill').forEach((fill) => fill.classList.add('animated'));
  };

  if (!('IntersectionObserver' in window)) { items.forEach(show); return; }

  const io = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      show(entry.target);
      io.unobserve(entry.target);
    }),
    { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
  );

  items.forEach((el) => io.observe(el));
}


function initActiveNav() {
  const nav = document.getElementById('nav');
  const sections = Array.from(document.querySelectorAll('.section[id]'));
  const links = document.querySelectorAll('.nav-link[data-section]');
  let ticking = false;

  const getOffset = () => (nav ? nav.offsetHeight + 16 : 0);

  const setActiveLink = (id) => {
    links.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === id);
    });
  };

  const updateNavState = () => {
    const offset = getOffset();
    const scrollPos = window.scrollY + offset;
    let activeId = sections[0] ? sections[0].id : '';

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        activeId = section.id;
      }
    });

    setActiveLink(activeId);
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavState);
      ticking = true;
    }
  };

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
      onScroll();
    }, { passive: true });
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  window.addEventListener('load', updateNavState);
  window.addEventListener('resize', updateNavState, { passive: true });
  updateNavState();
}


function initMobileMenu() {
  const burger = document.getElementById('nav-burger');
  const drawer = document.getElementById('nav-links');
  const navInner = document.querySelector('.nav-inner');

  if (!burger || !drawer || !navInner) return;

  function closeMenu() {
    drawer.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
  }

  burger.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });

  drawer.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-inner') && drawer.classList.contains('open')) closeMenu();
  });

  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  }, { passive: true });
}


function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


function initCounters() {
  const nums = document.querySelectorAll('.gh-stat-num[data-count]');
  if (!nums.length) return;

  const animate = (el) => {
    const raw = el.dataset.count || '0';
    const target = parseInt(raw.replace(/[^\d]/g, ''), 10) || 0;
    const suffix = raw.includes('%') ? '%' : raw.includes('+') ? '+' : '';
    const steps = 48;
    let frame = 0;

    const timer = window.setInterval(() => {
      frame += 1;
      const cur = target * (1 - Math.pow(1 - frame / steps, 3));
      el.textContent = `${Math.round(cur)}${suffix}`;
      if (frame >= steps) {
        el.textContent = `${target}${suffix}`;
        window.clearInterval(timer);
      }
    }, 30);
  };

  if (!('IntersectionObserver' in window)) { nums.forEach(animate); return; }

  const io = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      io.unobserve(entry.target);
    }),
    { threshold: 0.6 }
  );

  nums.forEach((n) => io.observe(n));
}


function initSmoothScroll() {
  const nav = document.getElementById('nav');
  const offsetTop = () => (nav ? nav.offsetHeight + 10 : 0);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - offsetTop();
      window.scrollTo({ top: y, behavior: 'smooth' });

      const drawer = document.getElementById('nav-links');
      const burger = document.getElementById('nav-burger');
      if (drawer && burger) {
        drawer.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }

      history.pushState(null, '', href);
    });
  });
}


function initTiltAndMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasTilt = typeof window.VanillaTilt !== 'undefined';

  if (hasTilt && !reduce) {
    const tiltTargets = [
      ...document.querySelectorAll('.project-card'),
      ...document.querySelectorAll('.github-block'),
      ...document.querySelectorAll('.os-window'),
    ];
    if (tiltTargets.length) {
      window.VanillaTilt.init(tiltTargets, {
        max: 8, speed: 700, glare: true, 'max-glare': 0.08,
        scale: 1.02, perspective: 1000, transition: true, gyroscope: false,
      });
    }
  }

  if (hasGSAP && !reduce) {
    const tl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-content', { opacity: 0, y: 20, duration: 0.75 })
      .from('.hero-window', { opacity: 0, y: 24, duration: 0.75 }, '-=0.4')
      .from('.hero-badge, .hero-name, .hero-meta, .hero-sub, .hero-actions', {
        opacity: 0, y: 16, stagger: 0.08, duration: 0.5,
      }, '-=0.55');

    document.querySelectorAll('.hero-window .os-window, .github-block, .project-card')
      .forEach((el, i) => {
        window.gsap.to(el, {
          y: i % 2 === 0 ? -6 : 6,
          duration: 2.8 + i * 0.2,
          yoyo: true, repeat: -1,
          ease: 'sine.inOut', delay: i * 0.12,
        });
      });
  }
}


function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}