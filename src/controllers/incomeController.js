const Income = require('../models/Income');

// @desc    Get all incomes for a user
// @route   GET /api/incomes
// @access  Private
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user._id });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single income
// @route   GET /api/incomes/:id
// @access  Private
const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (income) {
      res.json(income);
    } else {
      res.status(404).json({ message: 'Income not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new income
// @route   POST /api/incomes
// @access  Private
const createIncome = async (req, res) => {
  try {
    const { description, category, amount } = req.body;

    const income = await Income.create({
      userId: req.user._id,
      description,
      category,
      amount,
      dateAdded: new Date()
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update income
// @route   PUT /api/incomes/:id
// @access  Private
const updateIncome = async (req, res) => {
  try {
    const { description, category, amount } = req.body;

    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (income) {
      income.description = description || income.description;
      income.category = category || income.category;
      income.amount = amount || income.amount;

      const updatedIncome = await income.save();
      res.json(updatedIncome);
    } else {
      res.status(404).json({ message: 'Income not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete income
// @route   DELETE /api/incomes/:id
// @access  Private
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (income) {
      await income.remove();
      res.json({ message: 'Income removed' });
    } else {
      res.status(404).json({ message: 'Income not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
};
