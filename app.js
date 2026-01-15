require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

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

// 5. 404 Handler
app.use((req, res) => {
    res.status(404).render('error', { title: '404 - Page Not Found' });
});

// 6. Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});