const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset
} = require('../controllers/assetController');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getAssets)
  .post(createAsset);

router.route('/:id')
  .get(getAssetById)
  .put(updateAsset)
  .delete(deleteAsset);

module.exports = router;
