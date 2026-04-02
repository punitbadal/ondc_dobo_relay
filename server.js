require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const apiRoutes = require('./api');
const callbackRoutes = require('./callbacks');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

app.get('/health', (req, res) => res.json({ status: 'healthy', version: '1.0.0' }));

// Buyer Backend → Relay
app.use('/relay/v1', apiRoutes);

// ONDC → Relay (all callbacks)
app.use('/callbacks', callbackRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 ONDC Relay Service running on port ${PORT}`);
});