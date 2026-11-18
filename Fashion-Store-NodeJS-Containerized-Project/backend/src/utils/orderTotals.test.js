const { calculateOrderTotals } = require('./orderTotals');

test('adds the price modifier to the price', () => {
  const items = [{ price: '100.00', price_modifier: '10.00', quantity: 2 }];
  expect(calculateOrderTotals(items).subtotal).toBe(220);
});

test('shipping is free from 150 and costs 9.99 below', () => {
  expect(calculateOrderTotals([{ price: '150.00', quantity: 1 }]).shipping_cost).toBe(0);
  expect(calculateOrderTotals([{ price: '149.99', quantity: 1 }]).shipping_cost).toBe(9.99);
});

test('adds 8 percent tax to the total', () => {
  const result = calculateOrderTotals([{ price: '100.00', quantity: 1 }]);
  expect(result.tax).toBeCloseTo(8);
  expect(result.total).toBeCloseTo(117.99);
});