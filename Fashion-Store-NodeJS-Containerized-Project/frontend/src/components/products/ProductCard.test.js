import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ProductCard from './ProductCard';

// ProductCard reads the cart from a context, so use a fake one
jest.mock('../../context/CartContext', () => ({
  useCart: () => ({ addItem: () => {} }),
}));

const product = {
  id: 1,
  slug: 'silk-wrap-dress',
  name: 'Silk Wrap Dress',
  brand: 'Maison Mode',
  price: '80.00',
  compare_price: '100.00',
};

test('shows the name, the price and the discount', () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ProductCard product={product} />
    </MemoryRouter>
  );
  expect(screen.getByText('Silk Wrap Dress')).toBeInTheDocument();
  expect(screen.getByText('$80.00')).toBeInTheDocument();
  expect(screen.getByText('-20%')).toBeInTheDocument();
});