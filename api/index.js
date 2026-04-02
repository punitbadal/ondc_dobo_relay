// api/index.js
const express = require('express');
const router = express.Router();

// Import all individual route handlers
const searchRoute = require('./search');
const selectRoute = require('./select');
const initRoute = require('./init');
const confirmRoute = require('./confirm');
const statusRoute = require('./status');
const trackRoute = require('./track');
const cancelRoute = require('./cancel');
const updateRoute = require('./update');
const issueRoute = require('./issue');
const reconRoute = require('./recon');

// Mount all routes under /relay/v1/
router.use('/search', searchRoute);
router.use('/select', selectRoute);
router.use('/init', initRoute);
router.use('/confirm', confirmRoute);
router.use('/status', statusRoute);
router.use('/track', trackRoute);
router.use('/cancel', cancelRoute);
router.use('/update', updateRoute);
router.use('/issue', issueRoute);
router.use('/recon', reconRoute);

module.exports = router;