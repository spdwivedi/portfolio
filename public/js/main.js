document.addEventListener('DOMContentLoaded', () => {
    
    // ---------------------------------------------------------
    // 1. MOBILE MENU TOGGLE
    // ---------------------------------------------------------
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            // Toggle the menu active state
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
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
        
        if (scrollTop > 100) {
            // Add shadow when scrolling down
            navbar.style.boxShadow = "0 10px 30px -10px rgba(2,12,27,0.7)";
        } else {
            navbar.style.boxShadow = "none";
        }
        lastScrollTop = scrollTop;
    });

    // ---------------------------------------------------------
    // 3. TYPEWRITER EFFECT (NEW CODE ADDED HERE)
    // ---------------------------------------------------------
    // These are the words that will cycle. Feel free to change them!
    const words = ["Intelligence.", "Scalable Systems.", "RAG Pipelines.", "The Future."];
    let i = 0;
    let timer;

    function typeWriter() {
        // Look for the element with id="typewriter" (We added this in index.ejs)
        const heading = document.getElementById('typewriter');
        
        // Safety check: If we are on the 'About' page, this element won't exist.
        // We stop the function so it doesn't cause an error.
        if (!heading) return; 
        
        const text = words[i];
        let charIndex = 0;

        // Sub-function: Types one character at a time
        function typing() {
            if (charIndex < text.length) {
                heading.innerHTML += text.charAt(charIndex);
                charIndex++;
                setTimeout(typing, 100); // Speed: 100ms per letter
            } else {
                setTimeout(erase, 2000); // Wait 2 seconds before erasing
            }
        }

        // Sub-function: Deletes one character at a time
        function erase() {
            if (charIndex > 0) {
                heading.innerHTML = text.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, 50); // Erase speed is faster (50ms)
            } else {
                i = (i + 1) % words.length; // Move to the next word in the list
                setTimeout(typing, 500); // Wait 0.5s before typing next word
            }
        }

        // Start the loop
        typing();
    }

    // Initialize the typewriter
    typeWriter();

});