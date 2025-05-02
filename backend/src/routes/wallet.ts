import { Router, Request, Response } from 'express';
import axios from 'axios';
import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const HEADLESS_BASE = process.env.HEADLESS_BASE || 'http://localhost:8080';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

// 1) Create Wallet
router.post('/createWallet', async (req: Request, res: Response) => {
  try {
    const seedPhrase = bip39.generateMnemonic();
    const walletId = uuidv4();

    await axios.post(`${HEADLESS_BASE}/start`, {
      "wallet-id": walletId,
      seed: seedPhrase,
      passphrase: ""
    });

    const encryptedSeed = CryptoJS.AES.encrypt(seedPhrase, ENCRYPTION_KEY).toString();

    const addressResp = await axios.get(`${HEADLESS_BASE}/wallet/balance/${walletId}`);
    const address = addressResp.data.addresses[0];

    return res.json({ walletId, address, encryptedSeed });
  } catch (err) {
    console.error('[createWallet] Error:', err);
    return res.status(500).json({ error: 'Wallet creation failed' });
  }
});

// 2) Get Balance
router.get('/balance/:walletId', async (req, res) => {
  try {
    const { walletId } = req.params;
    const response = await axios.get(`${HEADLESS_BASE}/wallet/balance/${walletId}`);
    return res.json(response.data);
  } catch (err) {
    console.error('[balance] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// 3) Tip / Send Transaction
router.post('/tip', async (req: Request, res: Response) => {
  try {
    const { walletId, recipientAddress, amount } = req.body;

    const txBody = {
      outputs: [
        {
          address: recipientAddress,
          value: amount
        }
      ]
    };

    const tx = await axios.post(`${HEADLESS_BASE}/transaction/send`, txBody, {
      params: { key: walletId }
    });

    return res.json({ tx_id: tx.data.tx_id, status: 'success' });
  } catch (err) {
    console.error('[tip] Error:', err);
    return res.status(500).json({ error: 'Tip failed' });
  }
});

export default router;
