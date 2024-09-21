const express = require('express');
const { getCafes, createCafe } = require('../controllers/cafesController');

router = express.Router();

// GET endpoint
router.get('/', getCafes);

// POST endpoint
router.post('/', createCafe);


module.exports = router;