require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection,pool } = require('./config/db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// Stripe webhook needs raw body — must be before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Health check (liveness): no database query
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Readiness: one fast database check, no retries
app.get('/api/ready', async (req, res) => {
  let timer;
  try {
    await Promise.race([
      pool.query('SELECT 1 FROM products LIMIT 1'),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('timeout')), 2000);
      }),
    ]);
    res.status(200).json({ status: 'ready' });
  } catch (err) {
    console.error('Readiness check failed:', err.message);
    res.status(503).json({ status: 'not ready' });
  } finally {
    clearTimeout(timer);
  }
});

// Global error handler (stays after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// Start
testConnection().catch(console.error);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
