const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  testBedrockConnection,
  getHealthStatus
} = require('../controllers/recommendationController');

/**
 * Recommendation Routes
 * All routes are public (no authentication required)
 */

/**
 * @route   GET /api/recommendations
 * @desc    Get AI-powered financial recommendations
 * @access  Public
 */
router.get('/', getRecommendations);

/**
 * @route   GET /api/recommendations/test
 * @desc    Test AWS Bedrock connection
 * @access  Public
 */
router.get('/test', testBedrockConnection);

/**
 * @route   GET /api/recommendations/health
 * @desc    Get recommendation system health status
 * @access  Public
 */
router.get('/health', getHealthStatus);

module.exports = router;

