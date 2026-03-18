// src/financeLogic.js

/**
 * Calculates updated balances based on the specific action performed.
 * @param {Object} currentStats - Current state (realBalance, projectedBalance, totalSaved, desirsFreinesCount)
 * @param {number} amount - The financial amount of the intention
 * @param {string} action - The type of event: 'CREATE', 'REALISE', or 'AVORT'
 * @returns {Object} Updated statistics object
 */
function calculateNewBalances(currentStats, amount, action) {
  let { realBalance, projectedBalance, totalSaved, desirsFreinesCount } = currentStats;

  switch (action) {
    case 'CREATE':
      // RULE: Real balance remains unchanged. Only the projected balance decreases 
      // to show the potential impact of the impulse.
      projectedBalance -= amount;
      break;
    
    case 'AVORT':
      // VICTORY: The impulse was resisted. The projected balance is restored, 
      // and the amount is added to total savings.
      projectedBalance += amount;
      totalSaved += amount;
      desirsFreinesCount += 1;
      break;

    case 'REALISE':
      // TRANSACTION: The purchase is confirmed. Real money is now deducted from the account.
      // The projected balance was already adjusted during the 'CREATE' phase.
      realBalance -= amount;
      break;
      
    default:
      throw new Error(`Unhandled action type: ${action}`);
  }

  return { realBalance, projectedBalance, totalSaved, desirsFreinesCount };
}

module.exports = { calculateNewBalances };