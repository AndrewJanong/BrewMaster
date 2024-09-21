const express = require('express');
const {getEmployees} = require('../controllers/employeesController');

router = express.Router();

// GET endpoint
router.get('/', getEmployees);


module.exports = router;