
const { calculateNewBalances } = require('./financeLogic'); 

test('Créer une intention de 100€ doit baisser le solde projeté mais pas le réel', () => {
  const initialStats = { realBalance: 1000, projectedBalance: 1000, totalSaved: 0, desirsFreinesCount: 0 };
  const result = calculateNewBalances(initialStats, 100, 'CREATE');

  expect(result.projectedBalance).toBe(900);
  expect(result.realBalance).toBe(1000);
});

test('Avorter une intention de 50€ doit augmenter le total sauvé et restaurer le projeté', () => {
  const initialStats = { realBalance: 1000, projectedBalance: 950, totalSaved: 0, desirsFreinesCount: 0 };
  const result = calculateNewBalances(initialStats, 50, 'AVORT');

  expect(result.projectedBalance).toBe(1000);
  expect(result.totalSaved).toBe(50);
  expect(result.desirsFreinesCount).toBe(1);
});