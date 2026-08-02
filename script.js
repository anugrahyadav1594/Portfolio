/* ==========================================================================
   Anugrah Yadav — Portfolio (premium redesign)
   Stack: Pure vanilla JavaScript (no dependencies)
   --------------------------------------------------------------------------
   1. Helpers & environment
   2. Footer year & placeholder links
   3. Navbar state + scroll progress
   4. Mobile menu
   5. Typing effect (hero roles)
   6. Reveal-on-scroll (IntersectionObserver)
   7. Scrollspy (active nav link)
   8. Button ripple
   9. Mouse parallax (hero visual)
   10. Cursor spotlight (project cards)
   11. Magnetic buttons
   12. Particle field (canvas)
   ========================================================================== */

   (() => {
    'use strict';
  
    /* ------------------------------------------------------------------ */
    /* 0. Flip the no-js flag (see CSS safety net section 18)             */
    /* ------------------------------------------------------------------ */
    document.documentElement.classList.replace('no-js', 'js');
  
    /* ------------------------------------------------------------------ */
    /* 1. Helpers & environment                                           */
    /* ------------------------------------------------------------------ */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    /* ------------------------------------------------------------------ */
    /* 2. Footer year & placeholder links                                 */
    /* ------------------------------------------------------------------ */
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  
    $$('a[href="#"]').forEach((a) =>
      a.addEventListener('click', (e) => e.preventDefault())
    );
  
    /* ------------------------------------------------------------------ */
    /* 3. Navbar state + scroll progress                                  */
    /* ------------------------------------------------------------------ */
    const nav = $('#navbar');
    const progress = $('#progress');
  
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 24);
  
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  
    /* ------------------------------------------------------------------ */
    /* 4. Mobile menu                                                     */
    /* ------------------------------------------------------------------ */
    const toggle = $('#navToggle');
    const links = $('#navLinks');
  
    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
  
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  
    links.addEventListener('click', (e) => {
      if (e.target.closest('.nav__link')) closeMenu();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 920) closeMenu();
    });
  
    /* ------------------------------------------------------------------ */
    /* 5. Typing effect (hero roles)                                      */
    /* ------------------------------------------------------------------ */
    const typed = $('#typing');
    const words = ['Startup Founder', 'UI/UX Designer', 'Software Engineer', 'Student'];
  
    if (reduced || !typed) {
      if (typed) typed.textContent = words.join(', ');
    } else {
      let wordIndex = 0;
      let charIndex = 0;
      let deleting = false;
  
      const tick = () => {
        const word = words[wordIndex];
        charIndex += deleting ? -1 : 1;
        typed.textContent = word.slice(0, charIndex);
  
        let delay = deleting ? 38 : 85;
  
        if (!deleting && charIndex === word.length) {
          delay = 1900;
          deleting = true;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          delay = 420;
        }
        setTimeout(tick, delay);
      };
      tick();
    }
  
    /* ------------------------------------------------------------------ */
    /* 6. Reveal-on-scroll (staggered via CSS --reveal-delay)             */
    /* ------------------------------------------------------------------ */
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    $$('[data-reveal]').forEach((el) => revealObserver.observe(el));
  
    /* ------------------------------------------------------------------ */
    /* 7. Scrollspy — highlight the nav link of the visible section       */
    /* ------------------------------------------------------------------ */
    const navLinks = $$('.nav__link');
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) =>
              link.classList.toggle(
                'is-active',
                link.getAttribute('href') === '#' + entry.target.id
              )
            );
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    $$('main section[id]').forEach((section) => spyObserver.observe(section));
  
    /* ------------------------------------------------------------------ */
    /* 8. Button ripple                                                   */
    /* ------------------------------------------------------------------ */
    $$('.btn').forEach((btn) =>
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
  
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
  
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      })
    );
  
    /* ------------------------------------------------------------------ */
    /* 9. Mouse parallax (hero visual)                                    */
    /* ------------------------------------------------------------------ */
    const hero = $('#home');
    const visual = $('#heroVisual');
  
    if (hero && visual && !reduced && window.matchMedia('(pointer: fine)').matches) {
      let targetX = 0, targetY = 0;
      let currentX = 0, currentY = 0;
  
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        targetX = (e.clientX - rect.left) / rect.width - 0.5;
        targetY = (e.clientY - rect.top) / rect.height - 0.5;
      });
      hero.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
      });
  
      const parallaxEls = $$('[data-depth]', visual);
  
      const lerpLoop = () => {
        currentX += (targetX - currentX) * 0.07;
        currentY += (targetY - currentY) * 0.07;
  
        parallaxEls.forEach((el) => {
          const depth = parseFloat(el.dataset.depth) || 1;
          el.style.transform = `translate3d(${(currentX * depth * 46).toFixed(2)}px, ${(currentY * depth * 46).toFixed(2)}px, 0)`;
        });
        requestAnimationFrame(lerpLoop);
      };
      lerpLoop();
    }
  
    /* ------------------------------------------------------------------ */
    /* 10. Cursor spotlight (project cards)                               */
    /* ------------------------------------------------------------------ */
    $$('.project__media').forEach((media) => {
      if (!window.matchMedia('(pointer: fine)').matches) return;
  
      media.addEventListener('mousemove', (e) => {
        const rect = media.getBoundingClientRect();
        media.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
        media.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
      });
    });
  
    /* ------------------------------------------------------------------ */
    /* 11. Magnetic buttons (subtle pull toward cursor)                   */
    /* ------------------------------------------------------------------ */
    $$('.btn--magnetic').forEach((btn) => {
      if (!window.matchMedia('(pointer: fine)').matches || reduced) return;
  
      const strength = 0.3;
  
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        btn.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  
    /* ------------------------------------------------------------------ */
    /* 12. Particle field (canvas)                                        */
    /* ------------------------------------------------------------------ */
    const canvas = $('#particles');
    if (canvas && !reduced) {
      const ctx = canvas.getContext('2d');
      const COLORS = [
        [0, 209, 255],   // cyan
        [123, 97, 255],  // violet
        [255, 255, 255], // white
        [61, 220, 151]   // green
      ];
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
  
      let W, H, particles = [], rafId = null;
  
      const setup = () => {
        W = window.innerWidth;
        H = window.innerHeight;
  
        canvas.width = W * DPR;
        canvas.height = H * DPR;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  
        const count = Math.min(60, Math.floor((W * H) / 26000));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.3 + 0.4,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.4 + 0.15,
          phase: Math.random() * Math.PI * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        }));
      };
  
      const tick = () => {
        ctx.clearRect(0, 0, W, H);
  
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += 0.02;
  
          if (p.x < -10) p.x = W + 10;
          if (p.x > W + 10) p.x = -10;
          if (p.y < -10) p.y = H + 10;
          if (p.y > H + 10) p.y = -10;
  
          const twinkle = 0.55 + Math.sin(p.phase) * 0.45;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${(p.alpha * twinkle).toFixed(3)})`;
          ctx.fill();
        }
  
        ctx.lineWidth = 0.6;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < 110) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${((1 - dist / 110) * 0.06).toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
  
        rafId = requestAnimationFrame(tick);
      };
  
      setup();
      tick();
  
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setup, 200);
      });
  
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          cancelAnimationFrame(rafId);
          rafId = null;
        } else if (rafId === null) {
          tick();
        }
      });
    }
  })();