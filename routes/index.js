/**
 * FILE DETAILS: Main Application Routing Controller (Settings Telemetry Patched)
 * -----------------------------------------------------------------
 * This file acts as the central router mapping web URLs to their respective page controllers.
 * It coordinates data retrieval states before passing variables to EJS layout templates:
 * 1. Home Page Route ('/'): Renders the core introduction and particle mesh background canvas.
 * 2. Projects Page Route ('/projects'): Queries MongoDB for live engineering records
 * explicitly filtering out soft-deleted items ({ isDeleted: { $ne: true } }), sorting by layout sequence.
 * 3. Certifications Page Route ('/certifications'): Renders the tabular continuous learning page framework.
 * 4. Certifications API Data Endpoint ('/api/certificates'): Queries MongoDB for academic course credentials
 * sorted by completion timelines, returning data records to the frontend client runtime script.
 * 5. Matrix Settings Telemetry Endpoint ('/api/settings') [NEW]: Exposes runtime toggle states, 
 * execution mode markers, and layout physics speeds directly to the client browser rendering nodes.
 * 6. About Page Route ('/about'): Retains fallback file-system parsing to load technical competency tags 
 * from 'skills.json' while structural definitions await database migration.
 * 7. Contact Page Route ('/contact'): Serves the interactive communication options layout.
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Import runtime Mongoose database schemas to handle queries
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Setting = require('../models/Setting'); // GLOBAL TELEMETRY ENGINE BINDING

/**
 * HELPER MODULE: Safely extracts and reads localized JSON files.
 * Used exclusively for static datasets that have not been shifted to the cloud layer yet (e.g., skills.json).
 */
const loadData = (filename) => {
    try {
        const filePath = path.join(__dirname, '../data', filename);
        const rawData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(rawData);
    } catch (err) {
        console.error(`Error loading ${filename}:`, err);
        return [];
    }
};

// ==========================================
// 1. HOME ENDPOINT
// ==========================================
router.get('/', (req, res) => {
    res.render('pages/index', { 
        title: 'Home',
        page: 'home' 
    });
});

// ==========================================
// 2. PROJECTS (WORK) ENDPOINT - UPDATED WITH ISDELETED FILTER
// ==========================================
router.get('/projects', async (req, res) => {
    try {
        // Only query documents where isDeleted is NOT true ($ne: true)
        // This ensures recycled items from your editor vanish here instantly.
        const projects = await Project.find({ isDeleted: { $ne: true } }).sort({ 'layout.orderIndex': 1 });
        
        res.render('pages/projects', { 
            title: 'Work', 
            page: 'projects',
            projects: projects // Dynamic filtered array passed directly to EJS layout blocks
        });
    } catch (err) {
        console.error('Database project fetch error:', err);
        // Fallback safety to prevent page breaking if network connections drop out
        res.render('pages/projects', { 
            title: 'Work', 
            page: 'projects',
            projects: [] 
        });
    }
});

// ==========================================
// 3. CERTIFICATIONS ENDPOINTS
// ==========================================

// VIEW CONTROLLER: Standard page delivery engine
router.get('/certifications', (req, res) => {
    res.render('pages/certificates', { 
        title: 'Certifications', 
        page: 'certifications'
    });
});

// DATA BACKEND API: Dynamic replacement for the static file route fetch pipeline
router.get('/api/certificates', async (req, res) => {
    try {
        // Retrieve all certifications from cloud, tracking records by highest execution completion year
        const certificates = await Certificate.find().sort({ year: -1 });
        res.json(certificates);
    } catch (err) {
        console.error('Database certificate lookup failure:', err);
        res.status(500).json({ error: 'Failed to extract certification records.' });
    }
});

// ==========================================
// 4. MATRIX GLOBAL COCKPIT SETTINGS TELEMETRY ENDPOINT (NEW)
// ==========================================
router.get('/api/settings', async (req, res) => {
    try {
        let currentSettings = await Setting.findOne();
        
        // Secure cluster fallback configuration if cloud database hasn't initiated settings collection row yet
        if (!currentSettings) {
            currentSettings = {
                vfxEngineActive: true,
                systemExecutionMode: 'ambient',
                dayNightCycleActive: true,
                shootingStarSpeed: 1.2,
                fireworksClickProbability: 0.08,
                marioPlatformerActive: true,
                ironManActive: true,
                ironManSpeed: 2.6,
                thorStrikeActive: true,
                jetFlybyActive: true
            };
        }
        res.json(currentSettings);
    } catch (err) {
        console.error('Database setting telemetry compilation fault:', err);
        res.status(500).json({ error: 'Failed to retrieve cloud interface configuration matrices.' });
    }
});

// ==========================================
// 5. ABOUT ENDPOINT
// ==========================================
router.get('/about', (req, res) => {
    // Keeps local file pipeline alive for tech tools metrics loading
    const skills = loadData('skills.json'); 
    res.render('pages/about', { 
        title: 'About Me', 
        page: 'about',
        skills: skills
    });
});

// ==========================================
// 6. CONTACT ENDPOINT
// ==========================================
router.get('/contact', (req, res) => {
    res.render('pages/contact', { 
        title: 'Contact', 
        page: 'contact'
    });
});

module.exports = router;