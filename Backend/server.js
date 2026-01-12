import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createPayPalOrder, capturePayPalOrder } from './controllers/paypalController.js';
import { verifySolanaPayment, getWalletAddress } from './controllers/solanaController.js';
import { createOrder, getOrder, updateOrderStatus, getAllOrders } from './controllers/orderController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Illysocial Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      paypal: {
        createOrder: 'POST /api/paypal/create-order',
        captureOrder: 'POST /api/paypal/capture-order'
      },
      solana: {
        walletAddress: 'GET /api/solana/wallet-address',
        price: 'GET /api/solana/price',
        verifyPayment: 'POST /api/solana/verify-payment'
      },
      orders: {
        create: 'POST /api/orders',
        get: 'GET /api/orders/:orderId',
        updateStatus: 'PATCH /api/orders/:orderId/status'
      }
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Illysocial backend is running' });
});

// PayPal routes
app.post('/api/paypal/create-order', createPayPalOrder);
app.post('/api/paypal/capture-order', capturePayPalOrder);

// Solana routes
app.get('/api/solana/wallet-address', getWalletAddress);
app.get('/api/solana/price', (req, res) => {
  // Forward to controller
  import('./controllers/solanaController.js').then(m => m.getSolPrice(req, res));
});
app.post('/api/solana/verify-payment', verifySolanaPayment);

// Order routes
app.post('/api/orders', createOrder);
app.get('/api/orders', getAllOrders);
app.get('/api/orders/:orderId', getOrder);
app.patch('/api/orders/:orderId/status', updateOrderStatus);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
