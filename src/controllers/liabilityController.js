const Liability = require('../models/Liability');

// @desc    Get all liabilities for a user
// @route   GET /api/liabilities
// @access  Private
const getLiabilities = async (req, res) => {
  try {
    const liabilities = await Liability.find({ userId: req.user._id });
    res.json(liabilities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single liability
// @route   GET /api/liabilities/:id
// @access  Private
const getLiabilityById = async (req, res) => {
  try {
    const liability = await Liability.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (liability) {
      res.json(liability);
    } else {
      res.status(404).json({ message: 'Liability not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new liability
// @route   POST /api/liabilities
// @access  Private
const createLiability = async (req, res) => {
  try {
    const { description, category, amount, interestRate } = req.body;

    const liability = await Liability.create({
      userId: req.user._id,
      description,
      category,
      amount,
      interestRate,
      dateAdded: new Date()
    });

    res.status(201).json(liability);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update liability
// @route   PUT /api/liabilities/:id
// @access  Private
const updateLiability = async (req, res) => {
  try {
    const { description, category, amount, interestRate } = req.body;

    const liability = await Liability.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (liability) {
      liability.description = description || liability.description;
      liability.category = category || liability.category;
      liability.amount = amount || liability.amount;
      liability.interestRate = interestRate || liability.interestRate;

      const updatedLiability = await liability.save();
      res.json(updatedLiability);
    } else {
      res.status(404).json({ message: 'Liability not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete liability
// @route   DELETE /api/liabilities/:id
// @access  Private
const deleteLiability = async (req, res) => {
  try {
    const liability = await Liability.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (liability) {
      await liability.remove();
      res.json({ message: 'Liability removed' });
    } else {
      res.status(404).json({ message: 'Liability not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getLiabilities,
  getLiabilityById,
  createLiability,
  updateLiability,
  deleteLiability,
};
