import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import walletRoutes from './routes/wallet';
import { hasRequiredAccess } from './nanocontracts/accessRules';
import { getUserByTelegramId, saveUser } from './utils/userStore';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', walletRoutes);

// ✅ POST /api/tip
app.post('/api/tip', async (req, res) => {
  const { senderTelegramId, recipientTelegramId, amount, tokenSymbol } = req.body;

  if (!senderTelegramId || !recipientTelegramId || !amount || !tokenSymbol) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const sender = getUserByTelegramId(senderTelegramId);
  const recipient = getUserByTelegramId(recipientTelegramId);

  if (!sender || !recipient) {
    return res.status(404).json({ success: false, message: 'User(s) not registered or wallet not found' });
  }

  console.log(`💸 Tipping ${amount} ${tokenSymbol} from ${sender.wallet.address} to ${recipient.wallet.address}`);

  return res.json({ success: true, message: 'Tip sent successfully (mock)' });
});

// ✅ POST /api/wallet
app.post('/api/wallet', (req, res) => {
  const { telegramId } = req.body;
  if (!telegramId) {
    return res.status(400).json({ success: false, message: 'Missing Telegram ID' });
  }

  const existing = getUserByTelegramId(telegramId);
  if (existing) {
    return res.json({ success: true, wallet: existing.wallet });
  }

  const wallet = {
    address: `wallet-${telegramId}`,
    publicKey: `pub-${telegramId}`,
    encryptedPrivateKey: `encrypted-${telegramId}`
  };

  saveUser({ telegramId, wallet });
  console.log(`📥 Wallet created for ${telegramId}:`, wallet);

  return res.json({ success: true, wallet });
});

// ✅ GET /api/balance/:telegramId
app.get('/api/balance/:telegramId', (req, res) => {
  const { telegramId } = req.params;

  const user = getUserByTelegramId(telegramId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Mock balances
  const balances = {
    HTR: 100,
    VIBE: 50,
    COFFEE: 0
  };

  console.log(`💰 Balance lookup for ${telegramId}`);
  return res.json({ success: true, balances });
});

// ✅ POST /api/create-token
app.post('/api/create-token', (req, res) => {
  const { telegramId, name, symbol, supply } = req.body;

  if (!telegramId || !name || !symbol || !supply) {
    return res.status(400).json({ success: false, message: 'Missing token data' });
  }

  const token = {
    name,
    symbol,
    supply,
    tokenId: `token-${symbol}-${Date.now()}`
  };

  console.log(`🔨 Created token ${symbol} for user ${telegramId}`, token);
  return res.json({ success: true, token });
});

// ✅ GET /api/access/:telegramId/:tokenSymbol
app.get('/api/access/:telegramId/:tokenSymbol', async (req, res) => {
  const { telegramId, tokenSymbol } = req.params;

  const user = getUserByTelegramId(telegramId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Mock balance
const balances: { [key: string]: number } = {
  VIBE: 120,
  COFFEE: 10
};

  const requiredThreshold = 100;
  const userBalance = balances[tokenSymbol] || 0;
  const hasAccess = hasRequiredAccess(userBalance, requiredThreshold);

  return res.json({ success: true, hasAccess, tokenSymbol, userBalance, requiredThreshold });
});

// ✅ Default route
app.get('/', (req, res) => {
  res.send('HathorChat backend is alive 🚀');
});

app.listen(PORT, () => {
  console.log(`🧠 Backend API running on http://localhost:${PORT}`);
});

//---------------------notes& additions--------------------------------
// import { shouldMintFirstTipBadge } from './nanocontracts/badgeRules';

// Connect Nano-Contracts in Backend

// app.post('/api/tip', async (req, res) => {
//   const { senderTelegramId, recipientTelegramId, amount, tokenSymbol } = req.body;

//   // Lookup tip count for the user (mocked)
//   const tipHistory = getUserTipHistory(senderTelegramId); // fake function
//   const tipCount = tipHistory.length;

//   if (shouldMintFirstTipBadge(tipCount)) {
//     console.log(`🏅 First tip! Minting NFT badge for ${senderTelegramId}`);
//     // mintNFTBadge(senderTelegramId);  // you'd hook this in later
//   }

//   return res.json({ success: true });
// });
