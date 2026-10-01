document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    const renderIcons = () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };
    renderIcons();

    // ==========================================================================
    // Sticky header state (passive listener, one rAF per frame)
    // ==========================================================================
    const header = document.getElementById('header');
    let scrollTicking = false;

    const updateHeader = () => {
        header?.classList.toggle('scrolled', window.scrollY > 24);
        scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(updateHeader);
        }
    }, { passive: true });
    updateHeader();

    // ==========================================================================
    // Mobile drawer: aria-expanded, Esc to close, scroll lock, focus handling
    // ==========================================================================
    const toggle = document.querySelector('.mobile-nav-toggle');
    const drawer = document.getElementById('mobile-drawer');

    const setDrawer = (open, { restoreFocus = false } = {}) => {
        if (!toggle || !drawer) return;
        drawer.classList.toggle('open', open);
        root.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        if (open) {
            drawer.querySelector('a')?.focus({ preventScroll: true });
        } else if (restoreFocus) {
            toggle.focus({ preventScroll: true });
        }
    };

    toggle?.addEventListener('click', () => {
        setDrawer(toggle.getAttribute('aria-expanded') !== 'true');
    });

    drawer?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setDrawer(false));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer?.classList.contains('open')) {
            setDrawer(false, { restoreFocus: true });
        }
    });

    // Close the drawer if the viewport grows past the mobile breakpoint
    window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
        if (e.matches) setDrawer(false);
    });

    // ==========================================================================
    // Reveal-on-scroll with per-group stagger
    // Hidden state lives in CSS under html.js; animation runs once per element.
    // ==========================================================================
    const revealSelector = '.fade-in, .section-head, .work-note, .subsection-title, .bento-card, .skills-category-card, .timeline-item, .contact-card';
    const revealItems = Array.from(document.querySelectorAll(revealSelector));

    // Stagger index = position among revealable siblings (capped so long grids don't drag)
    revealItems.forEach(el => {
        const siblings = Array.from(el.parentElement?.children || []).filter(c => c.matches(revealSelector));
        el.style.setProperty('--i', Math.min(siblings.indexOf(el), 6));
        el.classList.add('reveal-item');
    });

    const showAll = () => revealItems.forEach(el => el.classList.add('is-visible'));

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        showAll();
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        revealItems.forEach(el => revealObserver.observe(el));
    }

    // ==========================================================================
    // Scroll-spy: active nav link + sliding indicator
    // ==========================================================================
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const drawerLinks = Array.from(document.querySelectorAll('.drawer-link'));
    const indicator = document.querySelector('.nav-indicator');
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    let activeId = null;

    const moveIndicator = () => {
        if (!indicator) return;
        const active = navLinks.find(l => l.getAttribute('href') === `#${activeId}`);
        if (!active) {
            indicator.style.opacity = '0';
            return;
        }
        const inset = 12; // match .nav-link horizontal padding so the bar sits under the text
        const width = Math.max(active.offsetWidth - inset * 2, 1);
        indicator.style.transform = `translateX(${active.offsetLeft + inset}px) scaleX(${width})`;
        indicator.style.opacity = '1';
    };

    const setActive = (id) => {
        if (id === activeId) return;
        activeId = id;
        [...navLinks, ...drawerLinks].forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
        moveIndicator();
    };

    if ('IntersectionObserver' in window && sections.length) {
        // A section is "active" when it crosses a thin band ~40% down the viewport
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        sections.forEach(s => spy.observe(s));

        // Above the first section (hero) nothing is active
        const hero = document.getElementById('hero');
        if (hero) {
            new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) setActive(null);
            }, { rootMargin: '-40% 0px -55% 0px' }).observe(hero);
        }
    }

    // Fonts change link widths: re-measure once they are ready and on resize
    document.fonts?.ready.then(moveIndicator);
    window.addEventListener('resize', moveIndicator, { passive: true });

    // ==========================================================================
    // Card spotlight that follows the pointer (fine pointers only)
    // ==========================================================================
    if (finePointer.matches && !reducedMotion.matches) {
        let pending = null;
        document.addEventListener('pointermove', (e) => {
            const card = e.target.closest?.('.bento-card, .skills-category-card, .timeline-content');
            if (!card) return;
            if (pending) cancelAnimationFrame(pending);
            pending = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                card.style.setProperty('--my', `${e.clientY - rect.top}px`);
                pending = null;
            });
        }, { passive: true });
    }

    // ==========================================================================
    // Copy email to clipboard
    // ==========================================================================
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyTooltip = copyEmailBtn?.querySelector('.copy-tooltip');
    const emailValue = 'pasha.pashazade.23@gmail.com';
    let tooltipTimer;

    const flashTooltip = (text) => {
        if (!copyTooltip) return;
        copyTooltip.textContent = text;
        copyTooltip.classList.add('show');
        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(() => copyTooltip.classList.remove('show'), 1800);
    };

    copyEmailBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!navigator.clipboard) {
            flashTooltip('Copy not supported');
            return;
        }
        navigator.clipboard.writeText(emailValue)
            .then(() => flashTooltip('Copied'))
            .catch(() => flashTooltip('Copy failed'));
    });

    copyEmailBtn?.addEventListener('mouseenter', () => {
        if (!copyTooltip?.classList.contains('show')) flashTooltip('Copy');
    });

    // ==========================================================================
    // D365 F&O build pipeline simulator (demo)
    // ==========================================================================
    const runPipelineBtn = document.getElementById('run-pipeline-btn');
    const terminalBody = document.getElementById('terminal-body');

    const pipelineSteps = [
        { text: 'Initializing Azure DevOps build agent...', type: 'info', delay: 400 },
        { text: 'Checking out source (Git / TFVC)...', type: 'info', delay: 500 },
        { text: 'Restoring NuGet packages: F&O compiler tools, platform and application...', type: 'default', delay: 700 },
        { text: 'Compiling X++ models...', type: 'info', delay: 900 },
        { text: '  -> Build succeeded: 0 errors', type: 'success', delay: 400 },
        { text: 'Running Best Practice checks...', type: 'info', delay: 700 },
        { text: '  -> 0 BP errors', type: 'success', delay: 300 },
        { text: 'Running X++ unit tests (SysTest)...', type: 'info', delay: 700 },
        { text: '  -> All tests passed', type: 'success', delay: 300 },
        { text: 'Creating deployable package...', type: 'info', delay: 700 },
        { text: 'Publishing build artifact...', type: 'default', delay: 500 },
        { text: 'Uploading package to LCS Asset Library...', type: 'info', delay: 700 },
        { text: 'Applying package to Sandbox (UAT)...', type: 'info', delay: 900 },
        { text: '  -> Database synchronization completed', type: 'default', delay: 400 },
        { text: 'Deployment succeeded — ready for UAT sign-off. (demo)', type: 'success', delay: 300 }
    ];

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const setPipelineButton = (icon, label, extraClass = '') => {
        runPipelineBtn.innerHTML = `<i data-lucide="${icon}" class="${extraClass}"></i> ${label}`;
        renderIcons();
    };

    const appendTerminalLine = (text, type) => {
        terminalBody.querySelector('.cursor-blink')?.remove();

        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (type !== 'default') line.classList.add(type);

        const prefix = { info: '[INFO] ', success: '[OK] ', err: '[ERROR] ' }[type] || '$ ';
        line.textContent = prefix + text;

        const cursor = document.createElement('span');
        cursor.className = 'cursor-blink';
        line.appendChild(cursor);

        terminalBody.appendChild(line);
        terminalBody.scrollTo({ top: terminalBody.scrollHeight, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };

    if (runPipelineBtn && terminalBody) {
        let isRunning = false;

        runPipelineBtn.addEventListener('click', async () => {
            if (isRunning) return;
            isRunning = true;
            runPipelineBtn.disabled = true;
            setPipelineButton('loader', 'Running...', 'spin');
            terminalBody.innerHTML = '';

            for (const step of pipelineSteps) {
                await sleep(step.delay);
                appendTerminalLine(step.text, step.type);
            }

            isRunning = false;
            runPipelineBtn.disabled = false;
            setPipelineButton('rotate-ccw', 'Rerun Build');
        });
    }
});
