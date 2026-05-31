/**
 * FILE DETAILS: Cyberpunk Atmospheric Environment & Event Simulation Subsystem
 * ----------------------------------------------------------------------------
 * This module hooks into the central system kernel via 'DwivediStudioKernelReady'.
 * It manages page-specific atmospheric rules, variable particle counts, and custom timers:
 * 1. Theme-Isolated Flash Layer: Spawns a dedicated full-screen overlay for Thor's 
 * lightning bolt shocks, preventing theme-breaking background mutations.
 * 2. Granular Per-Page Scopes: Maps view routes to execute asset allocations (stars, jets)
 * only where configured inside your studio cockpit.
 * 3. Dynamic Telemetry Timers: Scales automated loops from minutes down to milliseconds
 * based on live settings database responses.
 */

(() => {
    // ---------------------------------------------------------
    // 1. ENGINE INSTANTIATION & CANVAS CONTROLLER SETUP
    // ---------------------------------------------------------
    async function initEnvironmentEngine(kernelContext) {
        console.log("🌌 [Dwivedi.AI Environment Engine]: Fetching live telemetry profiles...");

        let apiConfig = null;
        try {
            const response = await fetch('/api/settings');
            if (!response.ok) throw new Error('Network channel dropped out.');
            apiConfig = await response.json();
        } catch (err) {
            console.warn("⚠️ [Environment Engine]: Defaulting to standalone local safety matrices:", err.message);
            apiConfig = {
                vfxEngineActive: true,
                systemExecutionMode: 'ambient',
                starIntervalMinutes: 0.5,
                starSpawnCount: 2,
                fireworksParticleDensity: 65,
                fireworksClickProbability: 0.08,
                shootingStarDuration: 1.2,
                pageScopes: {
                    home: { starsEnabled: true, fireworksEnabled: true },
                    projects: { starsEnabled: true, fireworksEnabled: true },
                    certifications: { starsEnabled: true, fireworksEnabled: true },
                    about: { starsEnabled: true, fireworksEnabled: true },
                    contact: { starsEnabled: true, fireworksEnabled: true }
                }
            };
        }

        // Master switch kill check
        if (!apiConfig.vfxEngineActive) return;

        // Route Identification Engine Mapping Core
        const routePath = window.location.pathname;
        let activePageScope = 'home';
        if (routePath.includes('projects')) activePageScope = 'projects';
        else if (routePath.includes('certifications')) activePageScope = 'certifications';
        else if (routePath.includes('about')) activePageScope = 'about';
        else if (routePath.includes('contact')) activePageScope = 'contact';

        const contextPageRules = apiConfig.pageScopes[activePageScope] || { starsEnabled: true, fireworksEnabled: true };

        // Spawns isolated fireworks background layer canvas structure
        let canvas = document.getElementById('fireworks-overlay-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'fireworks-overlay-canvas';
            canvas.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:99990;';
            document.body.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        let fireworkParticles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // ---------------------------------------------------------
        // 2. THEME-ISOLATED LIGHTNING INTERCEPTOR CORE (THOR BUG FIX)
        // ---------------------------------------------------------
        window.triggerLightningFlash = () => {
            let flashLayer = document.getElementById('thor-isolated-flash-glass');
            if (!flashLayer) {
                flashLayer = document.createElement('div');
                flashLayer.id = 'thor-isolated-flash-glass';
                flashLayer.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,240,255,0.16); pointer-events:none; z-index:999999; opacity:0; will-change:opacity; filter: blur(4px);';
                document.body.appendChild(flashLayer);
            }
            
            // Execute lightning oscillations safely without breaking dark/light root variables
            gsap.timeline()
                .to(flashLayer, { opacity: 1, duration: 0.04, repeat: 4, yoyo: true })
                .to(flashLayer, { opacity: 0, duration: 0.25, ease: "power2.out" });
        };

        // ---------------------------------------------------------
        // 3. VECTOR PARAMS: FIREWORKS PHYSICS MATRIX
        // ---------------------------------------------------------
        class ExplodingParticle {
            constructor(startX, startY, particleColor) {
                this.x = startX;
                this.y = startY;
                this.color = particleColor;
                
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 2;
                
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.gravity = 0.06;
                this.friction = 0.98;
                this.alpha = 1;
                this.decay = Math.random() * 0.015 + 0.01;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.vy += this.gravity;
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 6;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function triggerNeonFirework(targetX, targetY) {
            if (!contextPageRules.fireworksEnabled) return;
            
            const colors = ['#00f2ea', '#ff0055', '#39ff14', '#eab308', '#b500ff'];
            const chosenColor = colors[Math.floor(Math.random() * colors.length)];
            const densityMultiplier = apiConfig.fireworksParticleDensity || 65;
            
            for (let count = 0; count < densityMultiplier; count++) {
                fireworkParticles.push(new ExplodingParticle(targetX, targetY, chosenColor));
            }
        }

        function runEnvironmentalLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            fireworkParticles = fireworkParticles.filter(p => p.alpha > 0);
            fireworkParticles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(runEnvironmentalLoop);
        }
        runEnvironmentalLoop();

        // ---------------------------------------------------------
        // 4. SPACE DRIFTERS: SCI-FI VECTOR SHOOTING STARS
        // ---------------------------------------------------------
        function dispatchQuantumShootingStar() {
            if (!contextPageRules.starsEnabled) return;

            const starsToSpawn = apiConfig.starSpawnCount || 2;
            const flightDuration = apiConfig.shootingStarDuration || 1.2;

            for (let i = 0; i < starsToSpawn; i++) {
                const starNode = document.createElement('div');
                starNode.className = 'quantum-shooting-star';
                
                const startingLeft = Math.random() * (window.innerWidth * 0.85);
                const startingTop = Math.random() * (window.innerHeight * 0.4);
                
                // Converted style into a sharp hyper-glowing vector laser line path
                starNode.style.cssText = `
                    position: fixed; left: ${startingLeft}px; top: ${startingTop}px;
                    width: 45px; height: 1.5px; background: linear-gradient(90deg, #fff, rgba(0,240,255,0.4), transparent); 
                    opacity: 0; pointer-events: none; transform: rotate(45deg); z-index: 99980;
                    filter: drop-shadow(0 0 4px #00f0ff); will-change: transform, opacity;
                `;
                document.body.appendChild(starNode);

                gsap.timeline({ onComplete: () => starNode.remove() })
                    .to(starNode, { opacity: 1, duration: 0.1 })
                    .to(starNode, {
                        x: window.innerWidth * 0.4,
                        y: window.innerWidth * 0.4,
                        opacity: 0,
                        duration: flightDuration,
                        ease: "power2.out"
                    });
            }
        }

        // ---------------------------------------------------------
        // 5. INTERACTIVE TRIGGERS & CONVERTED TELEMETRY TIMERS
        // ---------------------------------------------------------
        window.addEventListener('click', (e) => {
            const clickOdds = apiConfig.fireworksClickProbability ?? 0.08;
            if (Math.random() < clickOdds) {
                triggerNeonFirework(e.clientX, e.clientY);
            }
        });

        if (apiConfig.systemExecutionMode !== 'serial-test') {
            const starIntervalMs = (apiConfig.starIntervalMinutes || 0.5) * 60 * 1000;
            
            setInterval(() => {
                if (!document.hidden) dispatchQuantumShootingStar();
            }, starIntervalMs);
        }

        if (window.logToDroneMascot) {
            window.logToDroneMascot("ENV_READY", `Atmospheric parameters active on destination scope: [${activePageScope.toUpperCase()}]`);
        }
    }

    // ---------------------------------------------------------
    // 6. KERNEL BOOTSTRAP INTERCEPT INJECTION REGISTRATION
    // ---------------------------------------------------------
    if (window.DwivediStudioCore && window.DwivediStudioCore.status === "KERNEL_ACTIVE") {
        initEnvironmentEngine(window.DwivediStudioCore);
    } else {
        window.addEventListener('DwivediStudioKernelReady', (e) => {
            initEnvironmentEngine(e.detail);
        });
    }
})();