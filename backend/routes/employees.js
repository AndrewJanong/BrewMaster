const express = require('express');
const { getEmployees, createEmployee, editEmployee, deleteEmployee } = require('../controllers/employeesController');

router = express.Router();

// GET endpoint
router.get('/', getEmployees);

// POST endpoint
router.post('/', createEmployee);

// PUT endpoint
router.put('/:id', editEmployee);

// DELETE endpoint
router.delete('/:id', deleteEmployee);


module.exports = router;