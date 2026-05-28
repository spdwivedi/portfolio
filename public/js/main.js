/**
 * FILE DETAILS: Client-Side Interactive Frontend Controller
 * --------------------------------------------------------
 * This script runs locally inside the user's browser runtime environment once the DOM structure 
 * loads. It orchestrates UI/UX interactions across the interface view layers:
 * 1. Mobile Menu Toggle: Opens and closes responsive navigation layers via active CSS modifier states.
 * 2. Sticky Navbar Effect: Tracks background scroll offsets to inject box-shadow styling filters dynamically.
 * 3. Typewriter Core: Loops through an architectural array string to generate landing page character animations.
 * 4. Certifications Hydration Engine (NEW): Asynchronously targets your cloud database API endpoint
 * ('/api/certificates'), pulls down verified documents, and builds the UI rows without blocking page loads.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ---------------------------------------------------------
    // 1. MOBILE MENU TOGGLE
    // ---------------------------------------------------------
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // ---------------------------------------------------------
    // 2. STICKY NAVBAR EFFECT
    // ---------------------------------------------------------
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (navbar) {
            if (scrollTop > 100) {
                navbar.style.boxShadow = "0 10px 30px -10px rgba(2,12,27,0.7)";
            } else {
                navbar.style.boxShadow = "none";
            }
        }
        lastScrollTop = scrollTop;
    });

    // ---------------------------------------------------------
    // 3. TYPEWRITER EFFECT
    // ---------------------------------------------------------
    const words = ["Intelligence.", "Scalable Systems.", "RAG Pipelines.", "The Future."];
    let i = 0;

    function typeWriter() {
        const heading = document.getElementById('typewriter');
        if (!heading) return; // Terminate engine execution safely if target container isn't in active DOM
        
        const text = words[i];
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

        function erase() {
            if (charIndex > 0) {
                heading.innerHTML = text.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, 50);
            } else {
                i = (i + 1) % words.length;
                setTimeout(typing, 500);
            }
        }

        typing();
    }

    typeWriter();

    // ---------------------------------------------------------
    // 4. CERTIFICATIONS HYDRATION ENGINE (NEW)
    // ---------------------------------------------------------
    async function loadCertificatesDynamically() {
        // Targets the data display anchor body inside views/pages/certificates.ejs
        const targetContainer = document.getElementById('certs-table-body');
        if (!targetContainer) return; // Exit cleanly if user is browsing outside the Certs grid view

        try {
            // Read runtime streams directly out of our cloud database router api rather than localized json files
            const response = await fetch('/api/certificates');
            if (!response.ok) throw new Error('Data endpoint response validation failed.');

            const certificateDataList = await response.json();
            
            if (certificateDataList.length === 0) {
                targetContainer.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No records found.</td></tr>`;
                return;
            }

            // Map and assemble layout templates matching the exact design schema parameters perfectly
            targetContainer.innerHTML = certificateDataList.map(cert => `
                <tr class="cert-row">
                    <td class="cert-title">${cert.title}</td>
                    <td class="cert-platform">${cert.platform}</td>
                    <td class="cert-year">${cert.year}</td>
                    <td class="cert-verify">
                        <a href="${cert.verifyUrl}" target="_blank" rel="noopener noreferrer" class="verify-btn-link" aria-label="Verify Certificate">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="external-link-icon">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Asynchronous content render block execution broken:', error);
            targetContainer.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #ff4a4a;">Failed to load data assets from the server.</td></tr>`;
        }
    }

    // Initialize content population if active route location validates target viewport anchor identifiers
    loadCertificatesDynamically();
});