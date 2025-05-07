require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const Invoice = require('./models/Invoice');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Add default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database Connection and Sync
async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL database');
        
        // Force: true will drop the table if it already exists
        // Set to false in production
        await sequelize.sync({ force: true });
        console.log('Database synchronized');
    } catch (err) {
        console.error('Database initialization error:', err);
        process.exit(1); // Exit if we can't connect to the database
    }
}

// Initialize database before starting the server
initializeDatabase().then(() => {
    // Routes
    app.post('/api/invoices', async (req, res) => {
        try {
            console.log('Received invoice data:', JSON.stringify(req.body, null, 2));
            const invoice = await Invoice.create(req.body);
            console.log('Successfully created invoice:', JSON.stringify(invoice, null, 2));
            res.status(201).json(invoice);
        } catch (error) {
            console.error('Detailed error creating invoice:', {
                message: error.message,
                stack: error.stack,
                validationErrors: error.errors
            });
            res.status(500).json({ 
                message: 'Error creating invoice', 
                error: error.message,
                details: error.errors || error.stack
            });
        }
    });

    app.get('/api/invoices', async (req, res) => {
        try {
            const invoices = await Invoice.findAll({
                order: [['createdAt', 'DESC']]
            });
            console.log('Retrieved invoices:', invoices.length);
            res.json(invoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            res.status(500).json({ message: 'Error fetching invoices', error: error.message });
        }
    });

    app.delete('/api/invoices/:id', async (req, res) => {
        try {
            const invoice = await Invoice.findByPk(req.params.id);
            if (!invoice) {
                return res.status(404).json({ message: 'Invoice not found' });
            }
            await invoice.destroy();
            res.json({ message: 'Invoice deleted successfully' });
        } catch (error) {
            console.error('Error deleting invoice:', error);
            res.status(500).json({ message: 'Error deleting invoice', error: error.message });
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
