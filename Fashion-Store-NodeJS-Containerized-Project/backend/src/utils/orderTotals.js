// The rules for the total of an order
function calculateOrderTotals(items) {
  const subtotal = items.reduce(
    (sum, i) => sum + (parseFloat(i.price) + parseFloat(i.price_modifier || 0)) * i.quantity,
    0
  );
  const shipping_cost = subtotal >= 150 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  return { subtotal, shipping_cost, tax, total: subtotal + shipping_cost + tax };
}

module.exports = { calculateOrderTotals };
