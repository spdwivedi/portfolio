const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Helper: Load JSON Data safely
const loadData = (filename) => {
    try {
        const filePath = path.join(__dirname, '../data', filename);
        const rawData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(rawData);
    } catch (err) {
        console.error(`Error loading ${filename}:`, err);
        return []; // Return empty array if file fails
    }
};

// GET: Home Page
router.get('/', (req, res) => {
    res.render('pages/index', { 
        title: 'Home',
        page: 'home' 
    });
});

// GET: Projects Page
router.get('/projects', (req, res) => {
    const projects = loadData('projects.json');
    res.render('pages/projects', { 
        title: 'Work', 
        page: 'projects',
        projects: projects
    });
});

// GET: Certifications Page (NEW)
router.get('/certifications', (req, res) => {
    // We render the view. The data is fetched by the client (browser) 
    // from '/data/certificates.json' to keep the page load fast.
    res.render('pages/certificates', { 
        title: 'Certifications', 
        page: 'certifications'
    });
});

// GET: About Page
router.get('/about', (req, res) => {
    const skills = loadData('skills.json'); 
    res.render('pages/about', { 
        title: 'About Me', 
        page: 'about',
        skills: skills
    });
});

// GET: Contact Page
router.get('/contact', (req, res) => {
    res.render('pages/contact', { 
        title: 'Contact', 
        page: 'contact'
    });
});

module.exports = router;