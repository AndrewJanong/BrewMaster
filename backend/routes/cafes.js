const express = require('express');
const {getCafes} = require('../controllers/cafesController');

router = express.Router();

// GET endpoint
router.get('/', getCafes);


module.exports = router;