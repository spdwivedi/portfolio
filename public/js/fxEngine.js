/**
 * FILE DETAILS: Holographic Layout & Card Interaction FX Subsystem
 * ----------------------------------------------------------------------------
 * This module hooks into the central system kernel via 'DwivediStudioKernelReady'.
 * It processes hardware-accelerated 3D parallax tilt matrices, page-wide aura 
 * mesh morphing, and dynamically sets DOM parameters for complex CSS animations:
 * 1. Data-Text Ingestion: Prepares cards with 'glitch-drift' engines by writing structural 
 * text attributes required by deep CSS clip-path slices.
 * 2. Real-Time Parallax Vectors: Calculates multi-axis perspective distortions based on 
 * mouse velocity and placement inside bounding boxes.
 * 3. Chromatic Ambient Warp: Transitions base viewport canvas styles using custom radial 
 * halos matching each project's distinct MongoDB brand aura color token.
 */

(() => {
    // ---------------------------------------------------------
    // 1. INITIALIZATION & SUBSYSTEM REGISTER BINDING
    // ---------------------------------------------------------
    function initVisualFXEngine(kernelContext) {
        console.log("🚀 [Dwivedi.AI FX Engine]: Connecting graphic pipelines to grid systems...");
        
        const projectCards = document.querySelectorAll('.studio-grid-item');
        if (projectCards.length === 0) return;

        const baseStyles = getComputedStyle(document.documentElement);
        const originalBg = baseStyles.getPropertyValue('--bg-dark').trim() || '#0a0a0e';
        const originalAccent = baseStyles.getPropertyValue('--accent-primary').trim() || '#00f2ea';

        // Pre-parse engine elements to clear validation bugs
        projectCards.forEach(cardContainer => {
            const h3Title = cardContainer.querySelector('.card h3');
            const hoverEngine = cardContainer.dataset.hoverEngine;
            
            // Populate data-text attributes on demand to feed CSS glitch pseudos
            if (h3Title && hoverEngine === 'glitch-drift') {
                h3Title.setAttribute('data-text', h3Title.innerText.trim());
            }
        });

        // ---------------------------------------------------------
        // 2. MOUSE TRACKING & INTERACTIVE VECTOR LOOPS
        // ---------------------------------------------------------
        projectCards.forEach(cardItem => {
            const innerCard = cardItem.querySelector('.card');
            if (!innerCard) return;

            const brandHexColor = cardItem.dataset.projectBrand || originalAccent;
            const engineType = cardItem.dataset.hoverEngine || 'aura-glow';
            const projectTitle = cardItem.querySelector('h3') ? cardItem.querySelector('h3').innerText : 'Matrix Component';

            // EVENT A: Real-time Coordinate Parallax Skewing
            cardItem.addEventListener('mousemove', (e) => {
                const rect = cardItem.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                const ratioX = mouseX / rect.width;
                const ratioY = mouseY / rect.height;
                
                // Generates subtle fluid 3D tilt adjustments (-8deg to 8deg boundaries)
                const rotateX = (0.5 - ratioY) * 16;
                const rotateY = (ratioX - 0.5) * 16;

                cardItem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                innerCard.style.boxShadow = `0 25px 50px rgba(0,0,0,0.85), 0 0 35px ${brandHexColor}40`;
                innerCard.style.borderColor = brandHexColor;
            });

            // EVENT B: Page-Wide Chromatism & Particle Synchronization
            cardItem.addEventListener('mouseenter', () => {
                document.body.style.transition = 'background-image 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                document.body.style.backgroundImage = `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 40%), ${brandHexColor}25 0%, ${originalBg} 75%)`;
                document.documentElement.style.setProperty('--accent-primary', brandHexColor);

                const particleCanvas = document.getElementById('particles-canvas');
                if (particleCanvas) {
                    particleCanvas.style.transition = 'all 0.4s ease';
                    particleCanvas.style.transform = 'scale(1.04)';
                    particleCanvas.style.opacity = engineType === 'cyber-pulse' ? '0.45' : '0.32';
                }

                // Push tracking diagnostics to the operational HUD log
                if (window.logToDroneMascot) {
                    window.logToDroneMascot("FX_ENGAGE", `Locked onto [${projectTitle}]. Injecting branding matrix: ${brandHexColor}.`);
                }
            });

            // EVENT C: Structural Reset Transitions
            cardItem.addEventListener('mouseleave', () => {
                cardItem.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                innerCard.style.boxShadow = 'none';
                innerCard.style.borderColor = 'var(--glass-border)';
                
                document.body.style.backgroundImage = 'none';
                document.body.style.backgroundColor = originalBg;
                document.documentElement.style.setProperty('--accent-primary', originalAccent);

                const particleCanvas = document.getElementById('particles-canvas');
                if (particleCanvas) {
                    particleCanvas.style.transform = 'scale(1)';
                    particleCanvas.style.opacity = '0.15';
                }
            });
        });

        // Track standard viewport background space pointers to float radial glow meshes natively
        window.addEventListener('mousemove', (e) => {
            const percX = (e.clientX / window.innerWidth) * 100;
            const percY = (e.clientY / window.innerHeight) * 100;
            document.body.style.setProperty('--mouse-x', `${percX}%`);
            document.body.style.setProperty('--mouse-y', `${percY}%`);
        });

        if (window.logToDroneMascot) {
            window.logToDroneMascot("FX_READY", "Holographic card matrix nodes securely synchronized.");
        }
    }

    // ---------------------------------------------------------
    // 3. BOOTLOADER INTERCEPT REGISTRATION
    // ---------------------------------------------------------
    if (window.DwivediStudioCore && window.DwivediStudioCore.status === "KERNEL_ACTIVE") {
        initVisualFXEngine(window.DwivediStudioCore);
    } else {
        window.addEventListener('DwivediStudioKernelReady', (e) => {
            initVisualFXEngine(e.detail);
        });
    }
})();