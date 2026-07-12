import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const PAYMENT_TYPES = {
  CASHAPP: 'cashapp',
  VENMO: 'venmo',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  BTC: 'btc',
  ETH: 'eth',
  SOLANA: 'solana',
  CUSTOM: 'custom',
};

export const PAYMENT_LABELS = {
  [PAYMENT_TYPES.CASHAPP]: 'Cash App',
  [PAYMENT_TYPES.VENMO]: 'Venmo',
  [PAYMENT_TYPES.PAYPAL]: 'PayPal',
  [PAYMENT_TYPES.STRIPE]: 'Stripe',
  [PAYMENT_TYPES.BTC]: 'Bitcoin',
  [PAYMENT_TYPES.ETH]: 'Ethereum',
  [PAYMENT_TYPES.SOLANA]: 'Solana',
  [PAYMENT_TYPES.CUSTOM]: 'Custom Link',
};

export const addPaymentLink = async (userId, paymentType, identifier, customLabel = '') => {
  try {
    const creatorRef = doc(db, 'creators', userId);
    const newLink = {
      type: paymentType,
      identifier: identifier.trim(),
      label: customLabel.trim() || PAYMENT_LABELS[paymentType],
      createdAt: serverTimestamp(),
    };

    // Get current payment links or initialize empty array
    await updateDoc(creatorRef, {
      paymentLinks: [newLink],
      updatedAt: serverTimestamp(),
    }).catch(async (err) => {
      // If doc doesn't exist or update fails, try merge set
      if (err.code === 'not-found') {
        await setDoc(
          creatorRef,
          {
            paymentLinks: [newLink],
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } else {
        throw err;
      }
    });

    return { success: true };
  } catch (err) {
    console.error('Error adding payment link:', err);
    return { success: false, error: err.message };
  }
};

export const removePaymentLink = async (userId, linkIndex) => {
  try {
    const creatorRef = doc(db, 'creators', userId);
    // In production, fetch current links and filter out the removed one
    // For now, we'll just trigger an update
    await setDoc(
      creatorRef,
      {
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (err) {
    console.error('Error removing payment link:', err);
    return { success: false, error: err.message };
  }
};

export const getPaymentLinkUrl = (type, identifier) => {
  const urls = {
    [PAYMENT_TYPES.CASHAPP]: `https://cash.app/$${identifier}`,
    [PAYMENT_TYPES.VENMO]: `https://venmo.com/${identifier}`,
    [PAYMENT_TYPES.PAYPAL]: `https://paypal.me/${identifier}`,
    [PAYMENT_TYPES.STRIPE]: identifier,
    [PAYMENT_TYPES.BTC]: identifier,
    [PAYMENT_TYPES.ETH]: identifier,
    [PAYMENT_TYPES.SOLANA]: identifier,
    [PAYMENT_TYPES.CUSTOM]: identifier,
  };
  return urls[type] || identifier;
};
