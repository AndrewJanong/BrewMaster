const express = require('express');
const { getCafes, createCafe, editCafe, deleteCafe } = require('../controllers/cafesController');

router = express.Router();

// GET endpoint
router.get('/', getCafes);

// POST endpoint
router.post('/', createCafe);

// PUT endpoint
router.put('/:id', editCafe);

// DELETE endpoint
router.delete('/:id', deleteCafe);

module.exports = router;