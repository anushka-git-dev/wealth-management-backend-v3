const Asset = require('../models/Asset');

// @desc    Get all assets for a user
// @route   GET /api/assets
// @access  Private
const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ userId: req.user._id });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single asset
// @route   GET /api/assets/:id
// @access  Private
const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (asset) {
      res.json(asset);
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new asset
// @route   POST /api/assets
// @access  Private
const createAsset = async (req, res) => {
  try {
    const { description, category, amount } = req.body;

    const asset = await Asset.create({
      userId: req.user._id,
      description,
      category,
      amount,
      dateAdded: new Date()
    });

    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private
const updateAsset = async (req, res) => {
  try {
    const { description, category, amount } = req.body;

    const asset = await Asset.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (asset) {
      asset.description = description || asset.description;
      asset.category = category || asset.category;
      asset.amount = amount || asset.amount;

      const updatedAsset = await asset.save();
      res.json(updatedAsset);
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private
const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (asset) {
      await asset.remove();
      res.json({ message: 'Asset removed' });
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};
