const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:eMvmPdWPqWvBADkrJVylURYpGOqbHVjU@interchange.proxy.rlwy.net:12198/railway',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for images
app.use(express.static('.'));

// Initialize database tables
async function initDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                color VARCHAR(7) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS cards (
                id VARCHAR(255) PRIMARY KEY,
                front TEXT NOT NULL,
                back TEXT NOT NULL,
                category_id VARCHAR(255) DEFAULT 'general',
                front_image TEXT,
                back_image TEXT,
                interval INTEGER DEFAULT 1,
                repetitions INTEGER DEFAULT 0,
                ease_factor DECIMAL(3,2) DEFAULT 2.5,
                next_review TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id)
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS pinyin_syllables (
                id VARCHAR(255) PRIMARY KEY,
                base VARCHAR(50) NOT NULL,
                tone INTEGER NOT NULL,
                syllable VARCHAR(50) NOT NULL,
                examples TEXT[],
                description TEXT,
                image_url TEXT,
                image_prompt TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS character_mnemonics (
                id VARCHAR(255) PRIMARY KEY,
                character VARCHAR(10) NOT NULL UNIQUE,
                pinyin VARCHAR(20) NOT NULL,
                meaning VARCHAR(100) NOT NULL,
                image_url TEXT,
                image_prompt TEXT,
                mnemonic_story TEXT,
                examples TEXT[],
                frequency_rank INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Insert default General category if it doesn't exist
        await pool.query(`
            INSERT INTO categories (id, name, color) 
            VALUES ('general', 'General', '#4CAF50')
            ON CONFLICT (id) DO NOTHING;
        `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// API Routes

// Categories
app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

app.post('/api/categories', async (req, res) => {
    try {
        const { id, name, color } = req.body;
        const result = await pool.query(
            'INSERT INTO categories (id, name, color) VALUES ($1, $2, $3) RETURNING *',
            [id, name, color]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

app.put('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;
        const result = await pool.query(
            'UPDATE categories SET name = $1, color = $2 WHERE id = $3 RETURNING *',
            [name, color, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Move cards to general category
        await pool.query(
            'UPDATE cards SET category_id = $1 WHERE category_id = $2',
            ['general', id]
        );
        
        // Delete category
        await pool.query('DELETE FROM categories WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// Cards
app.get('/api/cards', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, cat.name as category_name, cat.color as category_color
            FROM cards c
            LEFT JOIN categories cat ON c.category_id = cat.id
            ORDER BY c.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
});

app.post('/api/cards', async (req, res) => {
    try {
        const { 
            id, front, back, categoryId, frontImage, backImage, 
            interval, repetitions, easeFactor, nextReview 
        } = req.body;
        
        const result = await pool.query(`
            INSERT INTO cards (
                id, front, back, category_id, front_image, back_image,
                interval, repetitions, ease_factor, next_review
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *
        `, [
            id, front, back, categoryId || 'general', frontImage, backImage,
            interval || 1, repetitions || 0, easeFactor || 2.5, nextReview || new Date()
        ]);
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ error: 'Failed to create card' });
    }
});

app.put('/api/cards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            front, back, categoryId, frontImage, backImage,
            interval, repetitions, easeFactor, nextReview 
        } = req.body;
        
        const result = await pool.query(`
            UPDATE cards SET 
                front = $1, back = $2, category_id = $3, front_image = $4, back_image = $5,
                interval = $6, repetitions = $7, ease_factor = $8, next_review = $9,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $10 RETURNING *
        `, [
            front, back, categoryId, frontImage, backImage,
            interval, repetitions, easeFactor, nextReview, id
        ]);
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).json({ error: 'Failed to update card' });
    }
});

app.delete('/api/cards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM cards WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ error: 'Failed to delete card' });
    }
});

// Pinyin Syllables
app.get('/api/syllables', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pinyin_syllables ORDER BY base, tone');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching syllables:', error);
        res.status(500).json({ error: 'Failed to fetch syllables' });
    }
});

app.post('/api/syllables', async (req, res) => {
    try {
        const { id, base, tone, syllable, examples, description, imageUrl, imagePrompt } = req.body;
        
        const result = await pool.query(`
            INSERT INTO pinyin_syllables (id, base, tone, syllable, examples, description, image_url, image_prompt)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id) DO UPDATE SET
                description = $6, image_url = $7, image_prompt = $8, updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `, [id, base, tone, syllable, examples, description, imageUrl, imagePrompt]);
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error saving syllable:', error);
        res.status(500).json({ error: 'Failed to save syllable' });
    }
});

// Character Mnemonics
app.get('/api/characters', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM character_mnemonics ORDER BY frequency_rank ASC NULLS LAST, character');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching characters:', error);
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
});

app.post('/api/characters', async (req, res) => {
    try {
        const { id, character, pinyin, meaning, imageUrl, imagePrompt, mnemonicStory, examples, frequencyRank } = req.body;
        
        const result = await pool.query(`
            INSERT INTO character_mnemonics (id, character, pinyin, meaning, image_url, image_prompt, mnemonic_story, examples, frequency_rank)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (character) DO UPDATE SET
                pinyin = $3, meaning = $4, image_url = $5, image_prompt = $6, 
                mnemonic_story = $7, examples = $8, frequency_rank = $9, updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `, [id, character, pinyin, meaning, imageUrl, imagePrompt, mnemonicStory, examples, frequencyRank]);
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error saving character:', error);
        res.status(500).json({ error: 'Failed to save character' });
    }
});

app.get('/api/characters/:character', async (req, res) => {
    try {
        const { character } = req.params;
        const result = await pool.query('SELECT * FROM character_mnemonics WHERE character = $1', [character]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Character not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching character:', error);
        res.status(500).json({ error: 'Failed to fetch character' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize database and start server
async function startServer() {
    await initDatabase();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

startServer().catch(console.error);