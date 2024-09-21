const express = require('express');
const { getCafes, createCafe, editCafe } = require('../controllers/cafesController');

router = express.Router();

// GET endpoint
router.get('/', getCafes);

// POST endpoint
router.post('/', createCafe);

// PUT endpoint
router.put('/:id', editCafe);

module.exports = router;