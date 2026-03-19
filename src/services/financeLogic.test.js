const { calculateNewBalances } = require('./financeLogic'); 

describe('BalanceMe Finance Logic - TDD Suite', () => {

  test('CREATE: Should decrease projected balance but keep real balance unchanged', () => {
    const initialStats = { 
      realBalance: 1000, 
      projectedBalance: 1000, 
      totalSaved: 0, 
      desirsFreinesCount: 0 
    };
    const result = calculateNewBalances(initialStats, 100, 'CREATE');

    expect(result.projectedBalance).toBe(900);
    expect(result.realBalance).toBe(1000);
  });

  test('AVORT: Should restore projected balance and increase total saved amount', () => {
    const initialStats = { 
      realBalance: 1000, 
      projectedBalance: 950, 
      totalSaved: 0, 
      desirsFreinesCount: 0 
    };
    const result = calculateNewBalances(initialStats, 50, 'AVORT');

    expect(result.projectedBalance).toBe(1000);
    expect(result.totalSaved).toBe(50);
    expect(result.desirsFreinesCount).toBe(1);
  });

  test('ERROR: Should throw an error for unknown action types', () => {
    const initialStats = { realBalance: 1000, projectedBalance: 1000, totalSaved: 0, desirsFreinesCount: 0 };
    expect(() => {
      calculateNewBalances(initialStats, 100, 'UNKNOWN');
    }).toThrow('Unhandled action type: UNKNOWN');
  });

});