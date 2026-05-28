/**
 * FILE DETAILS: Database Seeding & Data Migration Script
 * -----------------------------------------------------
 * This is a standalone script designed to migrate existing local JSON data into MongoDB.
 * It performs the following discrete actions:
 * 1. Loads configuration values via dotenv.
 * 2. Connects to the target remote MongoDB instance using Mongoose.
 * 3. Reads local file records from 'data/projects.json' and 'data/certificates.json'.
 * 4. Normalizes and validates the JSON shapes against the updated Mongoose schemas.
 * 5. Clears target collections to avoid dirty duplicate record injections.
 * 6. Bulk-inserts the migration dataset into the active cloud database instance.
 * 7. Closes database handle connections cleanly upon execution completion.
 * * EXECUTION INSTRUCTION: Run 'node seed.js' from the terminal in your root directory.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Import the database models we created in the previous steps
const Project = require('./models/Project');
const Certificate = require('./models/Certificate');

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('CRITICAL: MONGO_URI environment variable is missing.');
    process.exit(1);
}

async function seedDatabase() {
    try {
        console.log('⏳ Connecting to database instance for data ingestion...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected successfully to MongoDB.');

        // --- 1. SEED PROJECTS ---
        const projectsFilePath = path.join(__dirname, 'data', 'projects.json');
        if (fs.existsSync(projectsFilePath)) {
            console.log('Reading local projects data file...');
            const rawProjects = JSON.parse(fs.readFileSync(projectsFilePath, 'utf8'));

            // Map old properties safely into our new structured schema objects
            const normalizedProjects = rawProjects.map((proj, idx) => ({
                title: proj.title || 'Untitled Project',
                category: proj.category || 'Personal Projects',
                description: proj.description || '',
                tags: proj.tags || [],
                links: {
                    github: proj.github || proj.links?.github || '',
                    liveUrl: proj.liveUrl || proj.links?.liveUrl || '',
                    datasetUrl: proj.datasetUrl || proj.links?.datasetUrl || ''
                },
                layout: {
                    size: proj.layout?.size || 'normal',
                    orderIndex: proj.layout?.orderIndex !== undefined ? proj.layout.orderIndex : idx
                }
            }));

            // Clear collection to prevent duplicate records
            await Project.deleteMany({});
            console.log('🗑️  Cleared old records from "projects" collection.');

            // Insert new normalized dataset
            await Project.insertMany(normalizedProjects);
            console.log(`🎉 Successfully seeded ${normalizedProjects.length} projects into MongoDB.`);
        } else {
            console.warn('⚠️  Warning: "data/projects.json" file not found. Skipping project migration.');
        }

        // --- 2. SEED CERTIFICATES ---
        const certsFilePath = path.join(__dirname, 'data', 'certificates.json');
        if (fs.existsSync(certsFilePath)) {
            console.log('Reading local certificates data file...');
            const rawCerts = JSON.parse(fs.readFileSync(certsFilePath, 'utf8'));

            // Structure existing certificate records to match our validation criteria
            const normalizedCerts = rawCerts.map((cert) => ({
                title: cert.title || cert.courseTitle,
                platform: cert.platform || 'Unknown',
                year: parseInt(cert.year) || new Date().getFullYear(),
                verifyUrl: cert.verifyUrl || cert.verify || '#'
            }));

            await Certificate.deleteMany({});
            console.log('🗑️  Cleared old records from "certificates" collection.');

            await Certificate.insertMany(normalizedCerts);
            console.log(`🎉 Successfully seeded ${normalizedCerts.length} certificates into MongoDB.`);
        } else {
            console.warn('⚠️  Warning: "data/certificates.json" file not found. Skipping certificate migration.');
        }

    } catch (error) {
        console.error('❌ Data migration processing failed drastically:', error);
    } finally {
        // Disconnect from database cleanly so script exits
        await mongoose.disconnect();
        console.log('🔌 Database connection closed cleanly. Migration process finalized.');
    }
}

// Fire the async wrapper engine
seedDatabase();