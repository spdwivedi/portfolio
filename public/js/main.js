/**
 * FILE DETAILS: Public Portfolio Central System Kernel Controller
 * ----------------------------------------------------------------------------
 * This script serves as the master orchestration core for the browser client.
 * It manages foundational UI transitions and handles event initialization for 
 * your advanced gaming and sci-fi subsystems:
 * 1. Mobile Menu: Drives responsive drawer states via active modifiers.
 * 2. Sticky Navbar: Evaluates scroll offsets to apply box-shadow styles.
 * 3. Typewriter Core: Continuously types and erases landing page text.
 * 4. Cert Dynamic Hydration: Streams certification lists asynchronously out of MongoDB.
 * 5. Subsystem Bootloader: Dispatches a secure system event to initialize your custom 
 * modules (fxEngine, environmentEngine, mascotSandbox) cleanly and in parallel.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ---------------------------------------------------------
    // 1. MOBILE DRAWER INTERACTION CONTROLLER
    // ---------------------------------------------------------
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            if (window.logToDroneMascot) {
                window.logToDroneMascot("OVERLAY_SHIFT", "Responsive navigation layer toggled.");
            }
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // ---------------------------------------------------------
    // 2. GLASSMORPHIC NAVBAR MATRIX TRACKER
    // ---------------------------------------------------------
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (navbar) {
            if (scrollTop > 100) {
                navbar.style.boxShadow = "0 15px 40px -10px rgba(0, 0, 0, 0.85)";
                navbar.style.background = "rgba(5, 5, 8, 0.92)";
                navbar.style.borderColor = "var(--accent-primary)";
            } else {
                navbar.style.boxShadow = "none";
                navbar.style.background = "rgba(10, 10, 14, 0.8)";
                navbar.style.borderColor = "var(--glass-border)";
            }
        }
    });

    // ---------------------------------------------------------
    // 3. LANDING TERMINAL TYPEWRITER STREAM
    // ---------------------------------------------------------
    const words = ["Intelligence.", "Scalable Systems.", "RAG Pipelines.", "The Future."];
    let wordIndex = 0;

    function typeWriter() {
        const heading = document.getElementById('typewriter');
        if (!heading) return; 
        
        const text = words[wordIndex];
        let charIndex = 0;

        function typing() {
            if (charIndex < text.length) {
                heading.innerHTML += text.charAt(charIndex);
                charIndex++;
                setTimeout(typing, 100);
            } else {
                setTimeout(erase, 2000);
            }
        }

        function typingNewSpace() {
            heading.innerHTML = "";
            typing();
        }

        function erase() {
            if (charIndex > 0) {
                heading.innerHTML = text.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, 50);
            } else {
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(typingNewSpace, 500);
            }
        }

        typing();
    }

    typeWriter();

    // ---------------------------------------------------------
    // 4. CLUSTER CERTIFICATIONS HYDRATION PIPELINE
    // ---------------------------------------------------------
    async function loadCertificatesDynamically() {
        const targetContainer = document.getElementById('certs-table-body');
        if (!targetContainer) return; 

        try {
            const response = await fetch('/api/certificates');
            if (!response.ok) throw new Error('Data endpoint response validation failed.');

            const certificateDataList = await response.json();
            
            if (certificateDataList.length === 0) {
                targetContainer.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">No verified qualification records mapped in cluster arrays.</td></tr>`;
                return;
            }

            targetContainer.innerHTML = certificateDataList.map(cert => `
                <tr class="cert-row" style="border-bottom: 1px solid rgba(255,255,255,0.02); transition: all 0.3s;" onmouseover="this.style.backgroundColor='rgba(0,242,234,0.01)'" onmouseout="this.style.backgroundColor='transparent'">
                    <td class="cert-title" style="padding: 18px 15px; font-weight: 500; color: #fff;">${cert.title}</td>
                    <td class="cert-platform" style="padding: 18px 15px; color: var(--text-muted);">${cert.platform}</td>
                    <td class="cert-year" style="padding: 18px 15px; font-family: var(--font-mono); color: var(--accent-primary);">${cert.year}</td>
                    <td class="cert-verify" style="padding: 18px 15px; text-align: right;">
                        <a href="${cert.verifyUrl}" target="_blank" rel="noopener noreferrer" class="verify-btn-link" aria-label="Verify Certificate" style="color: var(--text-muted); transition: color 0.3s;" onmouseover="this.style.color='var(--accent-primary)'" onmouseout="this.style.color='var(--text-muted)'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Content render block execution broken:', error);
            targetContainer.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--accent-secondary); padding: 30px;">Failed to draw real-time academic records.</td></tr>`;
        }
    }

    loadCertificatesDynamically();

    // ---------------------------------------------------------
    // 5. CYBERPUNK SUBSYSTEM CORE BOOTLOADER HUB
    // ---------------------------------------------------------
    function bootstrapAdvancedSubsystems() {
        // Dispatches a unified configuration bridge token.
        // As soon as your custom engine files finish script loading, they hook right in here.
        const coreInitToken = {
            timestamp: new Date().toISOString(),
            status: "KERNEL_ACTIVE",
            debugLogs: true
        };

        // Create custom workspace environment hook parameters safely
        window.DwivediStudioCore = coreInitToken;
        
        // Broadcast initialization state to the browser global scope execution lines
        const bootstrapEvent = new CustomEvent('DwivediStudioKernelReady', { detail: coreInitToken });
        window.dispatchEvent(bootstrapEvent);
        
        console.log("⚡ [Dwivedi.AI Kernel]: Systems ready. Streaming core event hooks to sub-modules...");
    }

    // Launch global engine bootstrap loops
    bootstrapAdvancedSubsystems();
});