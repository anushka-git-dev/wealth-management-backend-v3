const { generateRecommendations, testConnection } = require('../services/recommendationService');

/**
 * Recommendation Controller
 * Handles HTTP requests for AI-powered financial recommendations
 */

/**
 * Get general financial recommendations
 * @route GET /api/recommendations
 * @access Public (no authentication required)
 */
const getRecommendations = async (req, res) => {
  try {
    console.log('Recommendation request received');
    console.log('Generating AI-powered financial recommendations...');
    
    // Generate recommendations using Claude 3 Haiku
    const result = await generateRecommendations();
    
    console.log('Recommendations generated successfully');
    
    // Return recommendations
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Error in getRecommendations controller:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
};

/**
 * Test AWS Bedrock connection
 * @route GET /api/recommendations/test
 * @access Public
 */
const testBedrockConnection = async (req, res) => {
  try {
    console.log('Testing AWS Bedrock connection...');
    
    const result = await testConnection();
    
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Error testing Bedrock connection:', error);
    
    res.status(500).json({
      success: false,
      message: 'Connection test failed',
      error: error.message
    });
  }
};

/**
 * Get recommendation system health status
 * @route GET /api/recommendations/health
 * @access Public
 */
const getHealthStatus = async (req, res) => {
  try {
    const healthStatus = {
      success: true,
      service: 'Financial Recommendation System',
      status: 'operational',
      model: 'Claude 3 Haiku (anthropic.claude-3-haiku-20240307-v1:0)',
      provider: 'AWS Bedrock',
      region: process.env.AWS_REGION || 'us-east-2',
      timestamp: new Date().toISOString(),
      endpoints: {
        recommendations: '/api/recommendations',
        test: '/api/recommendations/test',
        health: '/api/recommendations/health'
      }
    };
    
    res.status(200).json(healthStatus);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
};

module.exports = {
  getRecommendations,
  testBedrockConnection,
  getHealthStatus
};

