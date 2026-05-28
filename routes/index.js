/**
 * FILE DETAILS: Main Application Routing Controller
 * -------------------------------------------------
 * This file acts as the central router mapping web URLs to their respective page controllers.
 * It coordinates data retrieval states before passing variables to EJS layout templates:
 * 1. Home Page Route ('/'): Renders the core introduction and particle mesh background canvas.
 * 2. Projects Page Route ('/projects'): Asynchronously queries MongoDB for all engineering records,
 * sorting them by their custom layout display sequence, and renders the Work layout panel.
 * 3. Certifications Page Route ('/certifications'): Renders the tabular continuous learning page framework.
 * 4. Certifications API Data Endpoint ('/api/certificates'): Queries MongoDB for academic course credentials
 * sorted by completion timelines, returning data records to the frontend client runtime script.
 * 5. About Page Route ('/about'): Retains fallback file-system parsing to load technical competency tags 
 * from 'skills.json' while structural definitions await database migration.
 * 6. Contact Page Route ('/contact'): Serves the interactive communication options layout.
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Import runtime Mongoose database schemas to handle queries
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');

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
// 2. PROJECTS (WORK) ENDPOINT
// ==========================================
router.get('/projects', async (req, res) => {
    try {
        // Query MongoDB for all projects and organize them by your assigned layout orderIndex
        const projects = await Project.find().sort({ 'layout.orderIndex': 1 });
        
        res.render('pages/projects', { 
            title: 'Work', 
            page: 'projects',
            projects: projects // Dynamic array passed down directly into EJS layout blocks
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
// 4. ABOUT ENDPOINT
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
// 5. CONTACT ENDPOINT
// ==========================================
router.get('/contact', (req, res) => {
    res.render('pages/contact', { 
        title: 'Contact', 
        page: 'contact'
    });
});

module.exports = router;