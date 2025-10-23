const { Asset, Income, Liability } = require('../models');

/**
 * Data Aggregation Service
 * Collects and processes financial data from MongoDB for AI recommendations
 */

/**
 * Get all financial data from database
 * @returns {Object} Aggregated financial data
 */
const getAllFinancialData = async () => {
  try {
    // Fetch all data from MongoDB
    const assets = await Asset.find({});
    const incomes = await Income.find({});
    const liabilities = await Liability.find({});

    // Calculate totals
    const totalAssets = calculateTotal(assets);
    const totalIncome = calculateTotal(incomes);
    const totalLiabilities = calculateTotal(liabilities);
    const netWorth = totalAssets - totalLiabilities;

    // Calculate metrics
    const debtToAssetRatio = totalAssets > 0 
      ? ((totalLiabilities / totalAssets) * 100).toFixed(2)
      : 0;

    const savingsRate = totalIncome > 0
      ? (((totalIncome - totalLiabilities) / totalIncome) * 100).toFixed(2)
      : 0;

    // Categorize data
    const assetCategories = categorizeByType(assets);
    const incomeCategories = categorizeByType(incomes);
    const liabilityCategories = categorizeByType(liabilities);

    return {
      summary: {
        totalAssets,
        totalIncome,
        totalLiabilities,
        netWorth,
        debtToAssetRatio: parseFloat(debtToAssetRatio),
        savingsRate: parseFloat(savingsRate),
        totalRecords: assets.length + incomes.length + liabilities.length
      },
      breakdown: {
        assets: {
          total: totalAssets,
          count: assets.length,
          categories: assetCategories
        },
        income: {
          total: totalIncome,
          count: incomes.length,
          categories: incomeCategories
        },
        liabilities: {
          total: totalLiabilities,
          count: liabilities.length,
          categories: liabilityCategories,
          averageInterestRate: calculateAverageInterestRate(liabilities)
        }
      },
      rawData: {
        assets: assets.slice(0, 10), // Limit to recent 10 for context
        incomes: incomes.slice(0, 10),
        liabilities: liabilities.slice(0, 10)
      }
    };
  } catch (error) {
    console.error('Error fetching financial data:', error);
    throw new Error('Failed to aggregate financial data');
  }
};

/**
 * Calculate total amount from array of financial records
 * @param {Array} records - Array of financial records
 * @returns {Number} Total amount
 */
const calculateTotal = (records) => {
  return records.reduce((sum, record) => sum + (record.amount || 0), 0);
};

/**
 * Categorize records by category field
 * @param {Array} records - Array of financial records
 * @returns {Object} Categorized data with totals
 */
const categorizeByType = (records) => {
  const categories = {};
  
  records.forEach(record => {
    const category = record.category || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = {
        total: 0,
        count: 0
      };
    }
    categories[category].total += record.amount || 0;
    categories[category].count += 1;
  });

  return categories;
};

/**
 * Calculate average interest rate for liabilities
 * @param {Array} liabilities - Array of liability records
 * @returns {Number} Average interest rate
 */
const calculateAverageInterestRate = (liabilities) => {
  if (liabilities.length === 0) return 0;
  
  const totalRate = liabilities.reduce((sum, liability) => {
    return sum + (liability.interestRate || 0);
  }, 0);
  
  return (totalRate / liabilities.length).toFixed(2);
};

/**
 * Format financial data for AI prompt
 * @param {Object} financialData - Aggregated financial data
 * @returns {String} Formatted string for AI prompt
 */
const formatDataForAI = (financialData) => {
  const { summary, breakdown } = financialData;

  let prompt = `Financial Data Summary:\n\n`;
  
  // Overall Summary
  prompt += `Total Assets: $${summary.totalAssets.toLocaleString()}\n`;
  prompt += `Total Income: $${summary.totalIncome.toLocaleString()}\n`;
  prompt += `Total Liabilities: $${summary.totalLiabilities.toLocaleString()}\n`;
  prompt += `Net Worth: $${summary.netWorth.toLocaleString()}\n`;
  prompt += `Debt-to-Asset Ratio: ${summary.debtToAssetRatio}%\n`;
  prompt += `Savings Rate: ${summary.savingsRate}%\n\n`;

  // Asset Breakdown
  prompt += `Asset Categories:\n`;
  Object.entries(breakdown.assets.categories).forEach(([category, data]) => {
    prompt += `  - ${category}: $${data.total.toLocaleString()} (${data.count} items)\n`;
  });
  prompt += `\n`;

  // Income Breakdown
  prompt += `Income Sources:\n`;
  Object.entries(breakdown.income.categories).forEach(([category, data]) => {
    prompt += `  - ${category}: $${data.total.toLocaleString()} (${data.count} sources)\n`;
  });
  prompt += `\n`;

  // Liability Breakdown
  prompt += `Liabilities:\n`;
  Object.entries(breakdown.liabilities.categories).forEach(([category, data]) => {
    prompt += `  - ${category}: $${data.total.toLocaleString()} (${data.count} items)\n`;
  });
  prompt += `Average Interest Rate: ${breakdown.liabilities.averageInterestRate}%\n`;

  return prompt;
};

module.exports = {
  getAllFinancialData,
  formatDataForAI,
  calculateTotal,
  categorizeByType
};

