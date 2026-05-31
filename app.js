/**
 * FILE DETAILS: Core Entry Point Application Server (With 404 Patch)
 * ------------------------------------------------------------------
 * This file serves as the main execution engine of the portfolio application. It handles:
 * 1. Environment Configuration initialization via dotenv.
 * 2. Asynchronous connection pool establishment with the remote MongoDB instance using Mongoose.
 * 3. Configuration of the Express application settings, including the EJS template view engine.
 * 4. Mount points for globally shared middleware pipelines (body parsing, static asset routing).
 * 5. Global view-state variables injection (current execution route path matching).
 * 6. Binding structural page routing blueprints to targeted domain endpoints.
 * 7. Standardized 404 client error fallback route mapping patched with complete navigation context.
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// 0. Database Connection Layer
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('CRITICAL CONFIGURATION ERROR: "MONGO_URI" is missing inside your .env configuration file.');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => {
        console.log('✅ Connection established successfully with the Coolify MongoDB instance.');
    })
    .catch((err) => {
        console.error('❌ Database connectivity breakdown encountered:', err.message);
        process.exit(1);
    });

// 1. View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middleware (Static files & Parsing)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Global Variables (Available in all views)
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

// 4. Routes
const mainRoutes = require('./routes/index');
app.use('/', mainRoutes);

// 5. 404 Handler (Patched with page property context to stabilize header dependencies)
app.use((req, res) => {
    res.status(404).render('error', { 
        title: '404 - Page Not Found',
        page: 'error' 
    });
});

// 6. Start Server
app.listen(port, () => {
    console.log(`🚀 Server is listening and active on http://localhost:${port}`);
});