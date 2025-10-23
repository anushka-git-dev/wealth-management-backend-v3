const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { getAllFinancialData, formatDataForAI } = require('./dataAggregationService');

/**
 * AWS Bedrock Recommendation Service
 * Uses Claude 3 Haiku for generating financial recommendations
 */

// Initialize Bedrock client
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Claude 3 Haiku Model ID
const MODEL_ID = 'anthropic.claude-3-haiku-20240307-v1:0';

/**
 * Generate financial recommendations using Claude 3 Haiku
 * @returns {Object} Recommendations and financial summary
 */
const generateRecommendations = async () => {
  try {
    console.log('Fetching financial data from database...');
    
    // Get aggregated financial data
    const financialData = await getAllFinancialData();
    
    console.log('Financial data fetched successfully');
    console.log(`Total Assets: $${financialData.summary.totalAssets}`);
    console.log(`Total Income: $${financialData.summary.totalIncome}`);
    console.log(`Total Liabilities: $${financialData.summary.totalLiabilities}`);
    
    // Format data for AI
    const formattedData = formatDataForAI(financialData);
    
    // Create prompt for Claude
    const prompt = createPrompt(formattedData, financialData.summary);
    
    console.log('Calling AWS Bedrock Claude 3 Haiku...');
    
    // Call Claude via Bedrock
    const recommendations = await callClaude(prompt);
    
    console.log('Recommendations generated successfully');
    
    return {
      success: true,
      data: {
        recommendations: recommendations,
        financialSummary: {
          totalAssets: financialData.summary.totalAssets,
          totalIncome: financialData.summary.totalIncome,
          totalLiabilities: financialData.summary.totalLiabilities,
          netWorth: financialData.summary.netWorth,
          debtToAssetRatio: financialData.summary.debtToAssetRatio,
          savingsRate: financialData.summary.savingsRate
        },
        breakdown: financialData.breakdown,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
  }
};

/**
 * Create optimized prompt for Claude 3 Haiku
 * @param {String} formattedData - Formatted financial data
 * @param {Object} summary - Financial summary
 * @returns {String} Complete prompt for Claude
 */
const createPrompt = (formattedData, summary) => {
  return `You are a professional financial advisor. Based on the following aggregated financial data from multiple users, provide 5-7 general financial recommendations that would benefit most people.

${formattedData}

Key Metrics:
- Net Worth: $${summary.netWorth.toLocaleString()}
- Debt-to-Asset Ratio: ${summary.debtToAssetRatio}%
- Savings Rate: ${summary.savingsRate}%

Please provide practical, actionable financial advice covering:
1. Emergency fund and savings
2. Debt management
3. Investment strategies
4. Risk management
5. Long-term financial planning

Format your response as a simple numbered list of recommendations. Each recommendation should be 1-2 sentences, clear, and actionable.`;
};

/**
 * Call Claude 3 Haiku via AWS Bedrock
 * @param {String} prompt - The prompt to send to Claude
 * @returns {Array} Array of recommendation strings
 */
const callClaude = async (prompt) => {
  try {
    // Prepare the request payload for Claude 3
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    };

    // Create the InvokeModel command
    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload)
    });

    console.log('Sending request to AWS Bedrock...');
    
    // Invoke the model
    const response = await client.send(command);
    
    // Parse the response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log('Response received from Claude 3 Haiku');
    
    // Extract the text content
    const assistantMessage = responseBody.content[0].text;
    
    // Parse recommendations from the response
    const recommendations = parseRecommendations(assistantMessage);
    
    return recommendations;
  } catch (error) {
    console.error('Error calling Claude 3 Haiku:', error);
    
    // Return fallback recommendations if API fails
    return getFallbackRecommendations();
  }
};

/**
 * Parse recommendations from Claude's response
 * @param {String} text - Claude's response text
 * @returns {Array} Array of recommendation strings
 */
const parseRecommendations = (text) => {
  try {
    // Split by numbered list items
    const lines = text.split('\n').filter(line => line.trim());
    
    const recommendations = [];
    
    lines.forEach(line => {
      // Match patterns like "1.", "1)", "1:", etc.
      const match = line.match(/^\d+[\.\):\-]\s*(.+)$/);
      if (match) {
        recommendations.push(match[1].trim());
      }
    });
    
    // If no numbered items found, return full text as single recommendation
    if (recommendations.length === 0) {
      return [text.trim()];
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error parsing recommendations:', error);
    return [text];
  }
};

/**
 * Fallback recommendations if API fails
 * @returns {Array} Array of basic financial recommendations
 */
const getFallbackRecommendations = () => {
  return [
    "Build an emergency fund covering 3-6 months of expenses to protect against unexpected financial setbacks.",
    "Pay off high-interest debt first, such as credit cards, to reduce interest payments and improve financial health.",
    "Diversify your investment portfolio across different asset classes to minimize risk and maximize returns.",
    "Contribute regularly to retirement accounts to take advantage of compound growth and tax benefits.",
    "Review and optimize your budget monthly to identify areas where you can reduce expenses and increase savings.",
    "Consider increasing your income through side hustles, career advancement, or skill development.",
    "Protect your assets with appropriate insurance coverage including health, life, and property insurance."
  ];
};

/**
 * Test AWS Bedrock connection
 * @returns {Object} Connection test result
 */
const testConnection = async () => {
  try {
    const testPrompt = "Say 'Connection successful' if you can read this.";
    
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 50,
      messages: [
        {
          role: "user",
          content: testPrompt
        }
      ]
    };

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload)
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    return {
      success: true,
      message: 'AWS Bedrock connection successful',
      model: MODEL_ID,
      response: responseBody.content[0].text
    };
  } catch (error) {
    return {
      success: false,
      message: 'AWS Bedrock connection failed',
      error: error.message
    };
  }
};

module.exports = {
  generateRecommendations,
  testConnection
};

