const express = require('express');
const { getEmployees, createEmployee, editEmployee } = require('../controllers/employeesController');

router = express.Router();

// GET endpoint
router.get('/', getEmployees);

// POST endpoint
router.post('/', createEmployee);

// PUT endpoint
router.put('/:id', editEmployee);


module.exports = router;