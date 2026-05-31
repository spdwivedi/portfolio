/**
 * FILE DETAILS: Advanced Gamified Pop-Culture Mascot Sandbox Engine (Bug-Patched)
 * ----------------------------------------------------------------------------
 * This module hooks into the central system kernel via 'DwivediStudioKernelReady'.
 * Upgraded with strict property clearance and animation space isolation rules:
 * 1. Isolated Viewport Screen Shake: Routes Thor's lightning shake into a bounded
 * foreground matrix div instead of mutating document.body directly. This keeps 
 * Mario's fixed position calculations from breaking.
 * 2. State-Clearing Mario Engine: Uses GSAP clearProps to wipe active styles when 
 * Mario transitions between ledge landing and screen-bottom walking.
 * 3. Responsive Jet Speed Controls: Extracts flight duration metrics dynamically
 * from the cluster config API to slow down vector flybys for optimal visibility.
 */

(() => {
    // ---------------------------------------------------------
    // 1. GLOBAL LAYERING SECURITY & STYLES INJECTOR
    // ---------------------------------------------------------
    function injectHighFidelityMascotStyles() {
        const backgroundParticles = document.getElementById('particles-canvas');
        if (backgroundParticles) {
            backgroundParticles.style.zIndex = "-1";
            backgroundParticles.style.pointerEvents = "none";
            backgroundParticles.style.position = "fixed";
        }

        let styleSheetNode = document.getElementById('articulated-mascots-matrix-css');
        if (!styleSheetNode) {
            styleSheetNode = document.createElement('style');
            styleSheetNode.id = 'articulated-mascots-matrix-css';
            styleSheetNode.innerHTML = `
                .vector-puppet-body {
                    position: relative; width: 100%; height: 100%;
                    display: flex; flex-direction: column; align-items: center;
                }
                @keyframes runningLimbCycle {
                    0%, 100% { transform: rotate(-25deg); }
                    50% { transform: rotate(30deg); }
                }
                @keyframes runningLimbCycleReverse {
                    0%, 100% { transform: rotate(30deg); }
                    50% { transform: rotate(-25deg); }
                }
                @keyframes pulsingArcReactor {
                    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px #00f0ff); opacity: 0.8; }
                    50% { transform: scale(1.25); filter: drop-shadow(0 0 12px #00f0ff); opacity: 1; }
                }
                @keyframes jetEnginePlumeGlow {
                    0%, 100% { transform: scaleY(1) scaleX(1); filter: drop-shadow(0 0 4px #ff007f); }
                    50% { transform: scaleY(1.3) scaleX(1.1); filter: drop-shadow(0 0 15px #ff007f); }
                }
                @keyframes kryptonCapeWaved {
                    0%, 100% { transform: skewY(-5deg) rotate(-5deg); }
                    50% { transform: skewY(8deg) rotate(5deg); }
                }
                .mario-leg-l { animation: runningLimbCycle 0.4s infinite linear; transform-origin: top center; }
                .mario-leg-r { animation: runningLimbCycleReverse 0.4s infinite linear; transform-origin: top center; }
                .arc-reactor-core { animation: pulsingArcReactor 0.5s infinite ease-in-out; }
                .thor-cape-mesh { background: #b91c1c; transform-origin: top left; animation: kryptonCapeWaved 0.3s infinite ease-in-out; }
                .scifi-jet-plume { animation: jetEnginePlumeGlow 0.1s infinite linear; transform-origin: left center; }
                
                /* Isolated screen shake viewport containment class */
                .studio-viewport-shake-layer {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    pointer-events: none; z-index: 999990; will-change: transform;
                }
            `;
            document.head.appendChild(styleSheetNode);
        }
    }

    // ---------------------------------------------------------
    // 2. DATA REGISTRY INITIALIZATION & PATH ISOLATOR
    // ---------------------------------------------------------
    async function initMascotSandbox(kernelContext) {
        injectHighFidelityMascotStyles();

        let apiConfig = null;
        try {
            const response = await fetch('/api/settings');
            if (!response.ok) throw new Error('Database stream connection failed.');
            apiConfig = await response.json();
        } catch (err) {
            console.warn("⚠️ [Mascot Sandbox]: Local failsafe metrics triggered:", err.message);
            apiConfig = {
                vfxEngineActive: true,
                systemExecutionMode: 'ambient',
                ironManIntervalMinutes: 1, thorIntervalMinutes: 2, jetIntervalMinutes: 1,
                jetSpawnCount: 1, starSpawnCount: 2, fireworksParticleDensity: 65,
                ironManFlightDuration: 2.6, thorStrikeDuration: 1.5, jetFlightDuration: 4.0, // Clean smooth pacing fallback
                pageScopes: {
                    home: { marioEnabled: true, ironManEnabled: true, thorEnabled: true, jetsEnabled: true },
                    projects: { marioEnabled: true, ironManEnabled: true, thorEnabled: true, jetsEnabled: true }
                }
            };
        }

        if (!apiConfig.vfxEngineActive) return;

        const routePath = window.location.pathname;
        let activePageScope = 'home';
        if (routePath.includes('projects')) activePageScope = 'projects';
        else if (routePath.includes('certifications') || routePath.includes('certs')) activePageScope = 'certifications';
        else if (routePath.includes('about')) activePageScope = 'about';
        else if (routePath.includes('contact')) activePageScope = 'contact';

        const viewScopeRules = apiConfig.pageScopes[activePageScope] || { marioEnabled: true, ironManEnabled: true, thorEnabled: true, jetsEnabled: true };

        // ---------------------------------------------------------
        // 3. SCROLL-AWARE GROUNDED MARIO ENGINE (STABILITY PATCHED)
        // ---------------------------------------------------------
        if (viewScopeRules.marioEnabled) {
            const marioContainer = document.createElement('div');
            marioContainer.id = 'sandbox-mario-sprite';
            marioContainer.style.cssText = 'position:fixed; width:32px; height:42px; z-index:99999; pointer-events:none; left:10px; bottom:15px; will-change:transform, left, top;';
            
            marioContainer.innerHTML = `
                <div class="vector-puppet-body">
                    <div style="width: 20px; height: 6px; background: #ef4444; border-radius: 4px 4px 0 0; margin-bottom: -1px;"></div>
                    <div style="width: 16px; height: 14px; background: #fbcfe8; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: flex-end;">
                        <div style="width: 3px; height: 3px; background: #000; border-radius: 50%; margin-right: 3px;"></div>
                    </div>
                    <div style="width: 18px; height: 14px; background: #3b82f6; border-radius: 4px; position: relative; margin-top: -1px; display: flex; justify-content: space-between; padding: 0 2px;">
                        <div style="width: 4px; height: 4px; background: #ef4444; border-radius: 50%;"></div>
                        <div style="width: 4px; height: 4px; background: #ef4444; border-radius: 50%;"></div>
                    </div>
                    <div style="display: flex; gap: 4px; width: 18px; justify-content: center; margin-top: -1px;">
                        <div class="mario-leg-l" style="width: 6px; height: 9px; background: #ef4444; border-radius: 0 0 2px 2px;"></div>
                        <div class="mario-leg-r" style="width: 6px; height: 9px; background: #ef4444; border-radius: 0 0 2px 2px;"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(marioContainer);

            let isAnchoredOnCard = false;
            let targetedCardNode = null;
            let currentWanderTween = null;

            function runWanderingFloorCycle() {
                if (isAnchoredOnCard || document.hidden) return;

                // Enforce clear layout fallbacks before running floor calculations
                gsap.set(marioContainer, { top: 'auto', bottom: '15px' });

                const currentX = parseFloat(marioContainer.style.left) || 10;
                const destinationX = Math.random() * (window.innerWidth - 60) + 10;
                const distanceX = Math.abs(destinationX - currentX);
                const walkingDuration = distanceX / 85; // Slightly faster pacing to track edges smoothly

                marioContainer.style.transform = destinationX < currentX ? 'scaleX(-1)' : 'scaleX(1)';
                marioContainer.querySelectorAll('.mario-leg-l, .mario-leg-r').forEach(l => l.style.animationPlayState = "running");

                currentWanderTween = gsap.to(marioContainer, {
                    left: destinationX,
                    duration: walkingDuration,
                    ease: "none",
                    onComplete: () => {
                        marioContainer.querySelectorAll('.mario-leg-l, .mario-leg-r').forEach(l => l.style.animationPlayState = "paused");
                        setTimeout(runWanderingFloorCycle, Math.random() * 3000 + 1500);
                    }
                });
            }

            function synchronizeMarioToScrollMatrix() {
                if (!isAnchoredOnCard || !targetedCardNode) return;

                const box = targetedCardNode.getBoundingClientRect();
                
                // If the target project block moves off-screen vertically, unground safely
                if (box.bottom < 0 || box.top > window.innerHeight) {
                    returnMarioToFloor();
                    return;
                }

                const currentPlatformY = box.top - 41;
                const currentPlatformX = box.left + (box.width / 2) - 16;
                
                gsap.set(marioContainer, { top: currentPlatformY, left: currentPlatformX });
            }

            function leapMarioToCard(cardElement) {
                isAnchoredOnCard = true;
                targetedCardNode = cardElement;
                
                // Terminate background floor walk tweens before launching parabolic loops
                if (currentWanderTween) currentWanderTween.kill();
                gsap.killTweensOf(marioContainer);
                
                const box = cardElement.getBoundingClientRect();
                const targetX = box.left + (box.width / 2) - 16;
                const targetY = box.top - 41;

                marioContainer.style.transform = targetX < parseFloat(marioContainer.style.left) ? 'scaleX(-1)' : 'scaleX(1)';
                marioContainer.querySelectorAll('.mario-leg-l, .mario-leg-r').forEach(l => l.style.animationPlayState = "running");
                marioContainer.style.bottom = 'auto';

                gsap.timeline()
                    .to(marioContainer, { left: targetX, top: targetY - 50, duration: 0.28, ease: "power1.out" })
                    .to(marioContainer, {
                        top: targetY, duration: 0.22, ease: "bounce.out",
                        onComplete: () => {
                            marioContainer.querySelectorAll('.mario-leg-l, .mario-leg-r').forEach(l => l.style.animationPlayState = "paused");
                            window.addEventListener('scroll', synchronizeMarioToScrollMatrix);
                        }
                    });
            }

            function returnMarioToFloor() {
                if (!isAnchoredOnCard) return;
                isAnchoredOnCard = false;
                targetedCardNode = null;
                
                window.removeEventListener('scroll', synchronizeMarioToScrollMatrix);
                gsap.killTweensOf(marioContainer);
                marioContainer.querySelectorAll('.mario-leg-l, .mario-leg-r').forEach(l => l.style.animationPlayState = "running");

                gsap.to(marioContainer, {
                    top: window.innerHeight - 57,
                    duration: 0.35,
                    ease: "power2.in",
                    onComplete: () => {
                        // Crucial patch: Wipe GSAP properties to remove inline calculation lockups completely
                        gsap.set(marioContainer, { clearProps: "top" });
                        marioContainer.style.bottom = '15px';
                        marioContainer.querySelectorAll('.mario-leg-l, .mario-leg-r').forEach(l => l.style.animationPlayState = "paused");
                        runWanderingFloorCycle();
                    }
                });
            }

            const contentCards = document.querySelectorAll('.studio-grid-item');
            if (contentCards.length > 0) {
                contentCards.forEach(card => {
                    card.addEventListener('mouseenter', () => leapMarioToCard(card));
                    card.addEventListener('mouseleave', returnMarioToFloor);
                });
            }

            setTimeout(runWanderingFloorCycle, 1500);
        }

        // ---------------------------------------------------------
        // 4. MODULE B: CINEMATIC DURATION FLYBYS
        // ---------------------------------------------------------
        function triggerIronManFlyby() {
            if (!viewScopeRules.ironManEnabled) {
                if (apiConfig.systemExecutionMode === 'serial-test') triggerNextSerialAnimation();
                return;
            }

            const ironMan = document.createElement('div');
            ironMan.className = 'cinematic-vector-flyer';
            ironMan.style.cssText = 'width:40px; height:55px; left:-100px; bottom:25%; position:fixed; z-index:99995; will-change:transform, left, bottom;';

            ironMan.innerHTML = `
                <div class="vector-puppet-body">
                    <div style="width: 20px; height: 16px; background: #b91c1c; border-radius: 6px 6px 2px 2px; position: relative; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 14px; height: 10px; background: #eab308; border-radius: 2px; margin-top: 2px; display: flex; gap: 4px; justify-content: center; align-items: center;">
                            <div style="width: 3px; height: 1.5px; background: #00f0ff; box-shadow: 0 0 4px #00f0ff;"></div>
                            <div style="width: 3px; height: 1.5px; background: #00f0ff; box-shadow: 0 0 4px #00f0ff;"></div>
                        </div>
                    </div>
                    <div style="width: 24px; height: 22px; background: #991b1b; border-radius: 4px; position: relative; display: grid; place-items: center; border: 1px solid #b91c1c;">
                        <div class="arc-reactor-core" style="width: 7px; height: 7px; background: #fff; border-radius: 50%;"></div>
                    </div>
                    <div style="display: flex; gap: 6px; width: 20px; justify-content: center; position: relative;">
                        <div style="width: 6px; height: 8px; background: #b91c1c; border-radius: 0 0 2px 2px; display: flex; flex-direction: column; align-items: center;">
                            <div class="thruster-plasma" style="width: 4px; border-radius: 0 0 4px 4px; margin-top: 6px;"></div>
                        </div>
                        <div style="width: 6px; height: 8px; background: #b91c1c; border-radius: 0 0 2px 2px; display: flex; flex-direction: column; align-items: center;">
                            <div class="thruster-plasma" style="width: 4px; border-radius: 0 0 4px 4px; margin-top: 6px;"></div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(ironMan);

            const speedValue = apiConfig.ironManFlightDuration || 2.6;
            const timeline = gsap.timeline({ onComplete: () => { ironMan.remove(); if (apiConfig.systemExecutionMode === 'serial-test') triggerNextSerialAnimation(); } });
            
            timeline.to(ironMan, { x: window.innerWidth * 0.45, y: -140, duration: speedValue * 0.5, ease: "power2.out" })
                    .to(ironMan, { scale: 1.25, filter: "drop-shadow(0 0 25px #00f0ff)", duration: 0.5, yoyo: true, repeat: 1 })
                    .to(ironMan, { x: window.innerWidth + 200, y: -380, duration: speedValue * 0.4, ease: "power3.in" });
        }

        function triggerThorStrike() {
            if (!viewScopeRules.thorEnabled) {
                if (apiConfig.systemExecutionMode === 'serial-test') triggerNextSerialAnimation();
                return;
            }

            const thor = document.createElement('div');
            const hammer = document.createElement('div');
            
            // SECURITY PATCH: Create isolated framework to contain structural canvas vibrations cleanly
            const shakeContainer = document.createElement('div');
            shakeContainer.className = 'studio-viewport-shake-layer';
            document.body.appendChild(shakeContainer);
            
            thor.className = 'cinematic-vector-flyer';
            thor.style.cssText = 'width:45px; height:60px; right:-120px; top:20%; position:fixed; z-index:99994; opacity:0; will-change:transform, right, top;';
            thor.innerHTML = `
                <div class="vector-puppet-body">
                    <div class="thor-cape-mesh" style="position: absolute; width: 16px; height: 35px; left: -12px; top: 14px; border-radius: 4px 0 0 8px; z-index: 1;"></div>
                    <div style="width: 22px; height: 18px; background: #eab308; border-radius: 50% 50% 0 0; position: relative; display: flex; justify-content: space-between; z-index: 2;">
                        <div style="width: 3px; height: 10px; background: #cbd5e1; border-radius: 4px 0 0 4px; margin-left: -2px; transform: rotate(-10deg);"></div>
                        <div style="width: 3px; height: 10px; background: #cbd5e1; border-radius: 0 4px 4px 0; margin-right: -2px; transform: rotate(10deg);"></div>
                    </div>
                    <div style="width: 26px; height: 24px; background: #334155; border-radius: 6px; border: 1px solid #475569; display: grid; grid-template-columns: repeat(2, 1fr); gap: 3px; padding: 3px; z-index: 2;">
                        <div style="width: 5px; height: 5px; background: #e2e8f0; border-radius: 50%;"></div>
                        <div style="width: 5px; height: 5px; background: #e2e8f0; border-radius: 50%;"></div>
                        <div style="width: 5px; height: 5px; background: #e2e8f0; border-radius: 50%;"></div>
                        <div style="width: 5px; height: 5px; background: #e2e8f0; border-radius: 50%;"></div>
                    </div>
                </div>
            `;

            hammer.className = 'cinematic-vector-flyer';
            hammer.style.cssText = 'width:24px; height:28px; left:-60px; bottom:30%; position:fixed; z-index:99993; will-change:transform, left, bottom;';
            hammer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 0 10px #00f0ff);">
                    <div style="width: 24px; height: 14px; background: linear-gradient(90deg, #94a3b8, #64748b); border-radius: 3px; border: 1px solid #cbd5e1;"></div>
                    <div style="width: 4px; height: 12px; background: #78350f; margin-top: -1px;"></div>
                </div>
            `;

            shakeContainer.appendChild(thor);
            shakeContainer.appendChild(hammer);

            const speedValue = apiConfig.thorStrikeDuration || 1.5;
            const masterTimeline = gsap.timeline({ 
                onComplete: () => { 
                    shakeContainer.remove(); 
                    if (apiConfig.systemExecutionMode === 'serial-test') triggerNextSerialAnimation(); 
                } 
            });

            masterTimeline.to(hammer, { x: window.innerWidth * 0.45, y: -200, rotation: 720, duration: speedValue * 0.6, ease: "power1.out" })
            .to(shakeContainer, {
                duration: 0.02,
                onStart: () => {
                    if (window.triggerLightningFlash) window.triggerLightningFlash();
                    // Shake the container block exclusively, keeping document.body coordinates completely untouched
                    gsap.to(shakeContainer, { x: 10, y: 5, duration: 0.04, repeat: 6, yoyo: true, onComplete: () => gsap.set(shakeContainer, { x: 0, y: 0 }) });
                    thor.style.opacity = "1";
                    gsap.to(thor, { right: "12%", duration: 0.2, ease: "power2.out" });
                }
            })
            .to(hammer, { x: window.innerWidth * 0.85, y: -240, duration: 0.3, ease: "power2.in" })
            .to(thor, { x: -window.innerWidth - 300, duration: 0.4, ease: "power3.in" });
        }

        // UPGRADED STEALTH FIGHTER FLIGHT SPEEDS TELEMETRY INTEGRATOR
        function triggerJetFlyby() {
            if (!viewScopeRules.jetsEnabled) {
                if (apiConfig.systemExecutionMode === 'serial-test') triggerNextSerialAnimation();
                return;
            }

            const multiSpawns = apiConfig.jetSpawnCount || 1;
            // Extract the custom timeline duration slider metric from MongoDB settings smoothly
            const jetVelocityScale = apiConfig.jetFlightDuration || 4.2; 

            for (let i = 0; i < multiSpawns; i++) {
                setTimeout(() => {
                    const jetContainer = document.createElement('div');
                    jetContainer.className = 'cinematic-vector-flyer';
                    
                    const altitude = Math.random() * (window.innerHeight * 0.5) + 60;
                    jetContainer.style.cssText = `width:120px; height:45px; left:-140px; top:${altitude}px; position:fixed; z-index:99990; opacity:0.65; will-change:transform, left;`;

                    jetContainer.innerHTML = `
                        <div style="position:relative; width:100%; height:100%; display:flex; align-items:center;">
                            <div class="scifi-jet-plume" style="position:absolute; left:-35px; width:40px; height:12px; background:linear-gradient(270deg, rgba(255,0,127,0.8), rgba(0,240,255,0.4), transparent); clip-path:polygon(0 40%, 100% 0, 100% 100%, 0 60%);"></div>
                            <svg width="120" height="45" viewBox="0 0 120 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 22.5L55 3L68 22.5L55 42L15 22.5Z" fill="#0f172a" stroke="#475569" stroke-width="1"/>
                                <path d="M5 22.5L115 16L120 22.5L115 29L5 22.5Z" fill="#1e293b" stroke="#00f0ff" stroke-width="1.2" style="filter:drop-shadow(0 0 2px rgba(0,240,255,0.3));"/>
                                <path d="M85 20L100 21.5L85 23Z" fill="#00f0ff" style="filter:drop-shadow(0 0 4px #00f0ff);"/>
                                <path d="M10 22.5L0 12L15 20" stroke="#ff007f" stroke-width="1.5"/>
                                <path d="M10 22.5L0 33L15 25" stroke="#ff007f" stroke-width="1.5"/>
                            </svg>
                        </div>
                    `;
                    document.body.appendChild(jetContainer);

                    gsap.to(jetContainer, {
                        x: window.innerWidth + 250,
                        duration: jetVelocityScale, // Driven directly by the dashboard duration settings parameter
                        ease: "none",
                        onComplete: () => {
                            jetContainer.remove();
                            if (apiConfig.systemExecutionMode === 'serial-test' && i === multiSpawns - 1) triggerNextSerialAnimation();
                        }
                    });
                }, i * 450);
            }
        }

        // ---------------------------------------------------------
        // 5. MASTER TRACK SEQUENCER MANAGEMENT METRICS
        // ---------------------------------------------------------
        let activeSerialIndex = 0;
        const animationRegistryQueue = [triggerIronManFlyby, triggerThorStrike, triggerJetFlyby];

        function triggerNextSerialAnimation() {
            if (document.hidden) {
                setTimeout(triggerNextSerialAnimation, 2000);
                return;
            }
            setTimeout(() => {
                const targetCall = animationRegistryQueue[activeSerialIndex];
                targetCall();
                activeSerialIndex = (activeSerialIndex + 1) % animationRegistryQueue.length;
            }, 1200);
        }

        if (apiConfig.systemExecutionMode === 'serial-test') {
            console.log("⚡ [Mascot Sandbox]: Continuous telemetry loops initialized.");
            setTimeout(triggerNextSerialAnimation, 3000);
        } else {
            const ironManInterval = (apiConfig.ironManIntervalMinutes || 1) * 60 * 1000;
            const thorInterval = (apiConfig.thorIntervalMinutes || 2) * 60 * 1000;
            const jetInterval = (apiConfig.jetIntervalMinutes || 1) * 60 * 1000;

            setInterval(() => { if (!document.hidden) triggerIronManFlyby(); }, ironManInterval);
            setInterval(() => { if (!document.hidden) triggerThorStrike(); }, thorInterval);
            setInterval(() => { if (!document.hidden) triggerJetFlyby(); }, jetInterval);
        }
    }

    // ---------------------------------------------------------
    // 6. KERNEL BOOTSTRAP ATTACHMENT REGISTRY
    // ---------------------------------------------------------
    if (window.DwivediStudioCore && window.DwivediStudioCore.status === "KERNEL_ACTIVE") {
        initMascotSandbox(window.DwivediStudioCore);
    } else {
        window.addEventListener('DwivediStudioKernelReady', (e) => {
            initMascotSandbox(e.detail);
        });
    }
})();