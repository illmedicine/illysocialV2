import axios from 'axios';

const PAYPAL_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Get PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await axios.post(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      }
    }
  );
  
  return response.data.access_token;
}

// Create PayPal order
export async function createPayPalOrder(req, res) {
  try {
    const { amount, currency = 'USD', description } = req.body;

    if (!amount || !description) {
      return res.status(400).json({
        success: false,
        error: 'Amount and description are required'
      });
    }

    const accessToken = await getPayPalAccessToken();

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toString()
        },
        description
      }]
    };

    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    res.json({
      success: true,
      orderId: response.data.id,
      orderData: response.data
    });
  } catch (error) {
    console.error('PayPal order creation error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || 'Failed to create PayPal order'
    });
  }
}

// Capture PayPal payment
export async function capturePayPalOrder(req, res) {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required'
      });
    }

    const accessToken = await getPayPalAccessToken();

    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    const captureData = response.data.purchase_units[0].payments.captures[0];

    res.json({
      success: true,
      captureId: captureData.id,
      status: captureData.status,
      amount: captureData.amount,
      paymentDetails: response.data
    });
  } catch (error) {
    console.error('PayPal capture error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || 'Failed to capture PayPal payment'
    });
  }
}
