const express = require('express');
const { getEmployees, createEmployee } = require('../controllers/employeesController');

router = express.Router();

// GET endpoint
router.get('/', getEmployees);

// POST endpoint
router.post('/', createEmployee);


module.exports = router;