import { Router } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const WALLET_API = 'http://localhost:8000'; // or docker IP if needed

// ✅ Create Wallet
import { saveUser, getUserByTelegramId } from '../utils/userStore';

router.post('/createWallet', async (req, res) => {
  try {
    const { telegramId } = req.body;
    if (!telegramId) return res.status(400).json({ success: false, message: 'Missing Telegram ID' });

    const existing = getUserByTelegramId(telegramId);
    if (existing) {
      return res.json({ success: true, walletId: existing.walletId });
    }

    const walletId = uuidv4();
    const seed = req.body.seed || process.env.DEFAULT_SEED;

    const response = await axios.post(`${WALLET_API}/start`, {
      "wallet-id": walletId,
      seed,
      passphrase: ""
    });

    if (response.data.success) {
      saveUser({ telegramId, walletId });
      res.json({ walletId, success: true });
    } else {
      res.status(400).json({ success: false, message: response.data.message });
    }
  } catch (err: any) {
    console.error('❌ Error in /createWallet:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/wallet-id/:telegramId', (req, res) => {
  const { telegramId } = req.params;
  const user = getUserByTelegramId(telegramId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  res.json({ walletId: user.walletId });
});

// ✅ Get Wallet Status
router.get('/wallet/:id/status', async (req, res) => {
  const walletId = req.params.id;
  try {
    const response = await axios.get(`${WALLET_API}/wallet/status`, {
      headers: { 'X-Wallet-Id': walletId }
    });
    res.json(response.data);
  } catch (err: any) {
    console.error('❌ Status Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Get Balance
router.get('/wallet/:id/balance', async (req, res) => {
  const walletId = req.params.id;
  try {
    const response = await axios.get(`${WALLET_API}/wallet/balance`, {
      headers: { 'X-Wallet-Id': walletId }
    });
    res.json(response.data);
  } catch (err: any) {
    console.error('❌ Balance Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Get Balance
router.get('/wallet/:id/balances', async (req, res) => {
  const walletId = req.params.id;
  try {
    const response = await axios.get(`${WALLET_API}/wallet/balances`, {
      headers: { 'X-Wallet-Id': walletId }
    });
    res.json(response.data);
  } catch (err: any) {
    console.error('❌ Balance Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Get Current Wallet Address
router.get('/wallet/:id/address', async (req, res) => {
  const walletId = req.params.id;
  try {
    const response = await axios.get(`${WALLET_API}/wallet/address`, {
      headers: { 'X-Wallet-Id': walletId }
    });
    res.json(response.data);
  } catch (err: any) {
    console.error('❌ Address Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Send Tokens (HTR for now)
router.post('/wallet/:id/send', async (req, res) => {
  const walletId = req.params.id;
  const { address, value, token = '00' } = req.body; // "00" is HTR

  try {
    const response = await axios.post(`${WALLET_API}/wallet/simple-send-tx`, {
      address,
      value,
      token
    }, {
      headers: { 'X-Wallet-Id': walletId }
    });

    res.json(response.data);
  } catch (err: any) {
    console.error('❌ Send Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Transaction History
router.get('/wallet/:id/history', async (req, res) => {
  const walletId = req.params.id;
  try {
    const response = await axios.get(`${WALLET_API}/wallet/transactions`, {
      headers: { 'X-Wallet-Id': walletId }
    });

    res.json(response.data);
  } catch (err: any) {
    console.error('❌ History Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;




// router.post('/wallet/:id/send', async (req, res) => {
//   const walletId = req.params.id;
//   const { address, value } = req.body;

//   const token = {
//     uid: '00', // HTR token UID
//     name: 'Hathor',
//     symbol: 'HTR'
//   };

//   try {
//     const response = await axios.post(`${WALLET_API}/wallet/send-tx`, {
//       address,
//       value,
//       token
//     }, {
//       headers: { 'X-Wallet-Id': walletId }
//     });

//     if (response.status === 200 && response.data.success !== false) {
//       res.json(response.data);
//     } else {
//       res.status(400).json({
//         success: false,
//         message: response.data?.message || 'Failed to send transaction'
//       });
//     }
//   } catch (err: any) {
//     console.error('❌ Send Error:', err.response?.data || err.message);
//     res.status(500).json({ success: false, error: err.response?.data?.message || err.message });
//   }
// });

// router.get('/wallet/:id/history', async (req, res) => {
//   const walletId = req.params.id;

//   try {
//     const response = await axios.get(`${WALLET_API}/wallet/history`, {
//       headers: { 'X-Wallet-Id': walletId }
//     });

//     res.json(response.data);
//   } catch (err: any) {
//     console.error('❌ History Error:', err.response?.data || err.message);
//     res.status(500).json({ success: false, error: err.response?.data?.message || err.message });
//   }
// });

