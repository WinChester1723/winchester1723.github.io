document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // Mobile Drawer Navigation
    // ==========================================================================
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const toggleIcon = mobileNavToggle?.querySelector('i');

    if (mobileNavToggle && mobileDrawer) {
        mobileNavToggle.addEventListener('click', () => {
            mobileDrawer.classList.toggle('open');
            
            // Toggle icon representation between menu and close
            if (mobileDrawer.classList.contains('open')) {
                mobileNavToggle.innerHTML = '<i data-lucide="x"></i>';
            } else {
                mobileNavToggle.innerHTML = '<i data-lucide="menu"></i>';
            }
            lucide.createIcons();
        });

        // Close drawer when clicking nav links
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
                mobileNavToggle.innerHTML = '<i data-lucide="menu"></i>';
                lucide.createIcons();
            });
        });
    }

    // ==========================================================================
    // Sticky Header Scroll Effect
    // ==========================================================================
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially on load

    // ==========================================================================
    // Copy Email to Clipboard
    // ==========================================================================
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyTooltip = copyEmailBtn?.querySelector('.copy-tooltip');
    const emailValue = "pasha.pashazade.23@gmail.com";

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(emailValue)
                .then(() => {
                    if (copyTooltip) {
                        copyTooltip.textContent = "Copied!";
                        copyTooltip.classList.add('show');
                        
                        setTimeout(() => {
                            copyTooltip.classList.remove('show');
                            // Revert text after transition
                            setTimeout(() => {
                                copyTooltip.textContent = "Copy";
                            }, 300);
                        }, 2000);
                    }
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                });
        });
    }

    // ==========================================================================
    // Intersection Observer for Reveal-on-Scroll Animations
    // ==========================================================================
    const revealElements = document.querySelectorAll('.fade-in, .bento-card, .timeline-item, .skills-category-card');
    
    // Add default hidden class styles programmatically if they don't have fade-in
    revealElements.forEach(el => {
        if (!el.classList.contains('fade-in')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(25px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.classList.contains('fade-in')) {
                    el.classList.add('reveal');
                } else {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
                observer.unobserve(el); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px' // Trigger slightly before element enters view
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================================================
    // Interactive DevOps Pipeline Simulator
    // ==========================================================================
    const runPipelineBtn = document.getElementById('run-pipeline-btn');
    const terminalBody = document.getElementById('terminal-body');

    const pipelineSteps = [
        { text: 'Initializing Azure DevOps Agent (Hosted Ubuntu-Latest)...', type: 'info', delay: 400 },
        { text: 'Checking out repository: github.com/WinChester1723/My_ResuMe_IO', type: 'info', delay: 600 },
        { text: 'Commit SHA: e2f8b50 (Update portfolio content and styling)', type: 'default', delay: 400 },
        { text: 'Setting up .NET SDK v8.0.204...', type: 'info', delay: 500 },
        { text: 'Restoring NuGet packages...', type: 'default', delay: 700 },
        { text: 'Building solution My_ResuMe_IO.sln...', type: 'info', delay: 900 },
        { text: '  -> Microsoft (R) Build Engine version 17.9.8', type: 'default', delay: 200 },
        { text: '  -> Build succeeded: 0 Warning(s), 0 Error(s)', type: 'success', delay: 500 },
        { text: 'Executing unit tests (Microsoft.TestHost)...', type: 'info', delay: 800 },
        { text: '  -> Total tests: 42, Passed: 42, Failed: 0', type: 'success', delay: 400 },
        { text: 'Packaging application: Building Docker container...', type: 'info', delay: 700 },
        { text: '  -> Pushing image to registry: acrnovum.azurecr.io/resume:latest', type: 'default', delay: 600 },
        { text: 'Deploying manifests to Azure Kubernetes Service (AKS)...', type: 'info', delay: 800 },
        { text: '  -> Cluster namespace: production-k8s', type: 'default', delay: 300 },
        { text: '  -> Releasing pods: my-resume-deployment (3 replicas)...', type: 'default', delay: 500 },
        { text: 'Verifying health probes: http://winchester1723.github.io...', type: 'info', delay: 600 },
        { text: 'Deployment Succeeded! Pasha\'s site is online and 100% stable. 🚀', type: 'success', delay: 300 }
    ];

    if (runPipelineBtn && terminalBody) {
        let isRunning = false;

        runPipelineBtn.addEventListener('click', async () => {
            if (isRunning) return;
            isRunning = true;

            // Update button state
            runPipelineBtn.disabled = true;
            runPipelineBtn.innerHTML = '<i data-lucide="loader" class="loader-icon spin"></i> Running...';
            lucide.createIcons();

            // Clear terminal body
            terminalBody.innerHTML = '';

            // Run pipeline logs sequentially
            for (const step of pipelineSteps) {
                await sleep(step.delay);
                appendTerminalLine(step.text, step.type);
            }

            // Reset button state
            isRunning = false;
            runPipelineBtn.disabled = false;
            runPipelineBtn.innerHTML = '<i data-lucide="rotate-ccw"></i> Rerun Build';
            lucide.createIcons();
        });
    }

    // Helper: Sleep delay using Promises
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Helper: Append line to terminal
    function appendTerminalLine(text, type) {
        if (!terminalBody) return;

        // Remove any existing cursor
        const oldCursor = terminalBody.querySelector('.cursor-blink');
        if (oldCursor) oldCursor.remove();

        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (type !== 'default') {
            line.classList.add(type);
        }

        // Add special prefix based on step type
        let prefix = '$ ';
        if (type === 'info') prefix = '[INFO] ';
        if (type === 'success') prefix = '[SUCCESS] ';
        if (type === 'err') prefix = '[ERROR] ';

        line.textContent = prefix + text;
        
        // Append cursor to the line
        const cursor = document.createElement('span');
        cursor.className = 'cursor-blink';
        line.appendChild(cursor);

        terminalBody.appendChild(line);
        
        // Scroll terminal to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // ==========================================================================
    // Custom Toast Notification System
    // ==========================================================================
    function showToast(title, message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        
        let iconName = 'info';
        if (type === 'success') iconName = 'check-circle';
        if (type === 'warning') iconName = 'alert-triangle';
        if (type === 'error') iconName = 'x-circle';

        toast.innerHTML = `
            <div class="toast-icon">
                <i data-lucide="${iconName}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">
                <i data-lucide="x"></i>
            </button>
        `;

        container.appendChild(toast);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        setTimeout(() => {
            toast.classList.add('show');
        }, 50);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        });

        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            }
        }, 6000);
    }

    // ==========================================================================
    // Contact Form Action Intercept (Fallback for Placeholder Formspree ID)
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const action = contactForm.getAttribute('action');
            if (action.includes('/placeholder')) {
                // Prevent Formspree redirect error
                e.preventDefault();
                
                const name = document.getElementById('form-name').value;
                const email = document.getElementById('form-email').value;
                const message = document.getElementById('form-message').value;
                
                // Construct mailto link
                const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
                const body = encodeURIComponent(
                    `Name: ${name}\n` +
                    `Email: ${email}\n\n` +
                    `Message:\n${message}`
                );
                
                const mailtoLink = `mailto:pasha.pashazade.23@gmail.com?subject=${subject}&body=${body}`;
                
                // Open mailto client with dynamic premium toast
                showToast(
                    "Form Setup Required",
                    "Formspree ID is not configured yet. Opening your default mail client to send this message. Please see README.md for instructions.",
                    "warning"
                );
                
                // Delay mailto opening slightly so the user can see the beautiful toast first
                setTimeout(() => {
                    window.location.href = mailtoLink;
                }, 1000);
            }
        });
    }
});
