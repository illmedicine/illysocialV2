import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const SOLANA_NETWORK = process.env.SOLANA_NETWORK || 'mainnet-beta';
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;

// Create Solana connection
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Get wallet address for payments
export async function getWalletAddress(req, res) {
  try {
    res.json({
      success: true,
      walletAddress: WALLET_ADDRESS
    });
  } catch (error) {
    console.error('Error getting wallet address:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get wallet address'
    });
  }
}

// Verify Solana payment
export async function verifySolanaPayment(req, res) {
  try {
    const { transactionSignature, expectedAmount, senderAddress } = req.body;

    if (!transactionSignature || !expectedAmount || !senderAddress) {
      return res.status(400).json({
        success: false,
        error: 'Transaction signature, expected amount, and sender address are required'
      });
    }

    // Get transaction details
    const transaction = await connection.getTransaction(transactionSignature, {
      maxSupportedTransactionVersion: 0
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Verify transaction is confirmed
    if (!transaction.meta || transaction.meta.err) {
      return res.status(400).json({
        success: false,
        error: 'Transaction failed or has errors'
      });
    }

    // Get transfer instructions
    const transferInstruction = transaction.transaction.message.staticAccountKeys.find(
      (key, index) => {
        const instruction = transaction.transaction.message.compiledInstructions.find(
          inst => inst.programIdIndex === 0 // System program
        );
        return instruction && instruction.accountKeyIndexes.includes(index);
      }
    );

    if (!transferInstruction) {
      return res.status(400).json({
        success: false,
        error: 'No transfer instruction found'
      });
    }

    // Verify the transfer was sent to our wallet
    const receiverAddress = transaction.transaction.message.staticAccountKeys[1]?.toString();
    if (receiverAddress !== WALLET_ADDRESS) {
      return res.status(400).json({
        success: false,
        error: 'Transaction was not sent to the correct wallet'
      });
    }

    // Verify the sender
    const actualSender = transaction.transaction.message.staticAccountKeys[0]?.toString();
    if (actualSender !== senderAddress) {
      return res.status(400).json({
        success: false,
        error: 'Sender address does not match'
      });
    }

    // Get the amount transferred (in lamports)
    const preBalance = transaction.meta.preBalances[1];
    const postBalance = transaction.meta.postBalances[1];
    const amountTransferred = postBalance - preBalance;
    const amountInSOL = amountTransferred / LAMPORTS_PER_SOL;

    // Verify amount matches expected
    if (Math.abs(amountInSOL - expectedAmount) > 0.000001) {
      return res.status(400).json({
        success: false,
        error: `Amount mismatch. Expected: ${expectedAmount} SOL, Received: ${amountInSOL} SOL`
      });
    }

    // Payment verified successfully
    res.json({
      success: true,
      transactionId: transactionSignature,
      amount: amountInSOL,
      sender: actualSender,
      receiver: receiverAddress,
      slot: transaction.slot,
      timestamp: transaction.blockTime
    });
  } catch (error) {
    console.error('Solana payment verification error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify Solana payment'
    });
  }
}

// Get current SOL price in USD
export async function getSolPrice(req, res) {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const data = await response.json();
    
    res.json({
      success: true,
      price: data.solana.usd,
      currency: 'USD'
    });
  } catch (error) {
    console.error('Error fetching SOL price:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch SOL price'
    });
  }
}
