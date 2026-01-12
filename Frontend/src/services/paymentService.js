// Payment Gateway Service
// Supports PayPal and Solana (SOL) payments

const PAYPAL_CONFIG = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
  currency: 'USD',
  environment: import.meta.env.VITE_PAYPAL_ENVIRONMENT || 'sandbox'
};

const SOLANA_CONFIG = {
  network: import.meta.env.VITE_SOLANA_NETWORK || 'mainnet-beta',
  walletAddress: import.meta.env.VITE_SOLANA_WALLET_ADDRESS || '',
  currency: 'SOL'
};

// PayPal Payment Handler
export const processPayPalPayment = async (orderData) => {
  try {
    // PayPal SDK will be loaded dynamically
    if (!window.paypal) {
      throw new Error('PayPal SDK not loaded');
    }

    const response = await window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: orderData.price,
              currency_code: PAYPAL_CONFIG.currency
            },
            description: `${orderData.service} - ${orderData.quantity} ${orderData.unit}`
          }]
        });
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        return {
          success: true,
          orderId: order.id,
          paymentMethod: 'PayPal',
          paymentDetails: order
        };
      },
      onError: (err) => {
        return {
          success: false,
          error: err
        };
      }
    });

    return response;
  } catch (error) {
    console.error('PayPal payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Solana Payment Handler
export const processSolanaPayment = async (orderData) => {
  try {
    // Check if Phantom wallet is available
    if (!window.solana || !window.solana.isPhantom) {
      throw new Error('Phantom wallet not found. Please install Phantom wallet extension.');
    }

    // Connect to wallet
    const response = await window.solana.connect();
    const publicKey = response.publicKey.toString();

    // Calculate SOL amount (assuming 1 SOL = $150 for now - will be dynamic)
    const solPrice = 150; // USD per SOL
    const solAmount = (parseFloat(orderData.price) / solPrice).toFixed(6);

    // Create transaction (placeholder - actual implementation would require backend)
    const transaction = {
      from: publicKey,
      to: SOLANA_CONFIG.walletAddress,
      amount: solAmount,
      currency: SOLANA_CONFIG.currency,
      orderDetails: orderData
    };

    // Sign transaction
    const { signature } = await window.solana.signTransaction(transaction);

    return {
      success: true,
      transactionId: signature,
      paymentMethod: 'Solana',
      amount: solAmount,
      currency: SOLANA_CONFIG.currency,
      walletAddress: publicKey
    };
  } catch (error) {
    console.error('Solana payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Load PayPal SDK
export const loadPayPalScript = () => {
  return new Promise((resolve, reject) => {
    if (window.paypal) {
      resolve(window.paypal);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.clientId}&currency=${PAYPAL_CONFIG.currency}`;
    script.onload = () => resolve(window.paypal);
    script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
    document.body.appendChild(script);
  });
};

// Check Phantom wallet availability
export const checkPhantomWallet = () => {
  return window.solana && window.solana.isPhantom;
};

// Get SOL to USD conversion rate (placeholder - would connect to API)
export const getSolPriceInUSD = async () => {
  try {
    // This would connect to a price API like CoinGecko or Jupiter
    // For now, returning a placeholder value
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const data = await response.json();
    return data.solana.usd;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return 150; // Fallback price
  }
};

// Payment method constants
export const PAYMENT_METHODS = {
  PAYPAL: 'paypal',
  SOLANA: 'solana'
};

export default {
  processPayPalPayment,
  processSolanaPayment,
  loadPayPalScript,
  checkPhantomWallet,
  getSolPriceInUSD,
  PAYMENT_METHODS
};
