/**
 * FILE DETAILS: Data Schema Definition for Portfolio Projects
 * -----------------------------------------------------------
 * This file establishes the Mongoose structural schema rules for the 'projects' collection. 
 * It abstracts MongoDB interactions into a structured JavaScript object and configures:
 * 1. Textual descriptive details (Title, Description).
 * 2. Logical grouping metrics (Category string to group by 'College Projects', 'Personal Projects', etc.).
 * 3. Technology stack identification array (Tags used for rendering technology pill icons).
 * 4. Extensible asset link mapping object (Supporting GitHub, live site URLs, and dataset storage links).
 * 5. Structural layout and visual rendering instructions (Sizing attributes and ordering metrics 
 * to handle grid positioning and cool asymmetric blocks).
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true // Examples: 'College Projects', 'Personal Projects', 'Udemy Projects'
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String],
        default: [] // Array of tools used, e.g., ['React Native', 'Gemini', 'Pinecone']
    },
    links: {
        github: {
            type: String,
            trim: true,
            default: ''
        },
        liveUrl: {
            type: String,
            trim: true,
            default: '' // Production site/live app url mapping
        },
        datasetUrl: {
            type: String,
            trim: true,
            default: '' // Link to Google Drive, Kaggle, or custom data sources
        }
    },
    layout: {
        size: {
            type: String,
            enum: ['normal', 'wide-block', 'large-block', 'tall-block'],
            default: 'normal' // Dictates CSS grid allocation styles for block variations
        },
        orderIndex: {
            type: Number,
            default: 0 // Numeric indexing sequence value to cleanly handle drag-and-drop sort orders
        }
    }
}, {
    timestamps: true // Automatically tracks createdAt and updatedAt metrics for synchronization checks
});

// Export the compiled schema to serve as our runtime Project database accessor model
module.exports = mongoose.model('Project', projectSchema);