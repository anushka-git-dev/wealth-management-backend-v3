const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome
} = require('../controllers/incomeController');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getIncomes)
  .post(createIncome);

router.route('/:id')
  .get(getIncomeById)
  .put(updateIncome)
  .delete(deleteIncome);

module.exports = router;
