require('dotenv').config();
const { Telegraf } = require('telegraf');
const chalk = require('chalk');
import { Markup } from 'telegraf';
const axios = require('axios');
const API_BASE = process.env.API_BASE || 'http://localhost:5000/api';

const bot = new Telegraf(process.env.BOT_TOKEN);


bot.start((ctx) => {
  const name = ctx.from.first_name || ctx.from.username || 'there';
  console.log(chalk.green(`User started bot: ${ctx.from.username} (${ctx.from.id})`));

  ctx.reply(
`👋 Hello *${name}*, welcome to *HathorChat*!

🚀 We turn any Telegram group into a token-powered community—no crypto expertise needed.

Here’s what you can do:
• View your wallet → /wallet
• Tip someone → /tip @user 5 VIBE
• Create your own token → /create_token
• Earn badges & rewards → /my_badges
• Unlock content → /unlock

💡 Type /help to see the full list of commands.

_You’re ready to explore tokenized chat magic!_`,
    { parse_mode: 'Markdown' }
  );
});

ctx.reply("🚀 Launch Mini App", Markup.inlineKeyboard([
  Markup.button.webApp("Open Wallet", "https://your-miniapp-url.com")
]));

bot.start((ctx) => {
  const name = ctx.from.first_name || ctx.from.username || 'there';
  console.log(chalk.green(`User started bot: ${ctx.from.username} (${ctx.from.id})`));

  ctx.reply(
`👋 Hello *${name}*, welcome to *HathorChat*!

🚀 We turn any Telegram group into a token-powered community—no crypto expertise needed.

Here’s what you can do:
• View your wallet → /wallet
• Tip someone → /tip @user 5 VIBE
• Create your own token → /create_token
• Earn badges & rewards → /my_badges
• Unlock content → /unlock

💡 Type /help to see the full list of commands.

_You’re ready to explore tokenized chat magic!_`,
    { parse_mode: 'Markdown' }
  );
});

bot.help((ctx) => {
  ctx.reply(
`🪙 *HathorChat Bot Help Menu*

Welcome to HathorChat – where tokenized communities come alive! Here’s what I can do for you:

⚙️ *Core Commands*
/start – Start the bot  
/help – Show this help menu  
/wallet – View your auto-provisioned HTR wallet  
/balance – Check your token + NFT balances  
/history – View your transaction history  

💸 *Token Features*
\`/tip @username amount token\` – Tip someone (e.g. \`/tip @alice 10 COFFEE\`)  
\`/create_token\` – Create your own custom token  
\`/send amount token @username\` – Send tokens directly  

🏆 *Rewards & Badges*
/my_badges – View your earned NFT badges  
/claim_badge – Manually claim badge if eligible  

🔒 *Token Gating*
/unlock – Unlock premium content  
/access – See what your tokens unlock  

📊 *Admin Tools* (Admins only)
/dashboard – Open Admin Dashboard  
/set_threshold – Set token thresholds  
/analytics – View token stats  

🎮 *Bonus Features*
/play_quiz – Play a quiz to earn tokens  
/raffle – Join a raffle  

_Questions? Ask @hathorsupport_`,
    { parse_mode: 'Markdown' }
  );
});

// /wallet Command
// Creates a wallet for the Telegram user.
bot.command('wallet', async (ctx) => {
  try {
    const telegramId = ctx.from.id;
    // Mock data
    // const res = await axios.post(`${API_BASE}/wallet`, { telegramId });
    // const { wallet } = res.data;

    // actual creation
    const res = await axios.post(`${API_BASE}/createWallet`, { telegramId });
  const walletId = res.data.walletId;
  ctx.reply(`🪪 Wallet created!\n\n🧾 Wallet ID: ${walletId}`);

    

    ctx.reply(`🪪 Wallet created!\n\n📬 Address: ${wallet.address}`);
  } catch (err) {
    console.error(err);
    ctx.reply('❌ Could not create your wallet.');
  }
});

// /balance Command
// Fetches balance by Telegram ID.
bot.command('balance', async (ctx) => {
  try {
    const telegramId = ctx.from.id;

    const res = await axios.get(`${API_BASE}/balance/${telegramId}`);
    const balances = res.data.balances;

    let reply = '💰 *Your Balances:*\n';
    for (const [token, amount] of Object.entries(balances)) {
      reply += `• ${token}: ${amount}\n`;
    }

    ctx.replyWithMarkdown(reply);
  } catch (err) {
    console.error(err);
    ctx.reply('❌ Could not fetch your balance.');
  }
});

// /create_token Command
// This one will use a prompt flow.
const userTokenCreationState = {};
bot.command('create_token', (ctx) => {
  const telegramId = ctx.from.id;
  userTokenCreationState[telegramId] = { step: 'name' };
  ctx.reply('🆕 Enter the token *name* (e.g., CoffeeCoin):');
});

bot.on('text', async (ctx) => {
  const telegramId = ctx.from.id;
  const state = userTokenCreationState[telegramId];

  if (!state) return;

  const input = ctx.message.text.trim();

  if (state.step === 'name') {
    state.name = input;
    state.step = 'symbol';
    ctx.reply('🔤 Enter the token *symbol* (e.g., $BREW):');
  } else if (state.step === 'symbol') {
    state.symbol = input.toUpperCase();
    state.step = 'supply';
    ctx.reply('🔢 Enter the *max supply* (e.g., 10000):');
  } else if (state.step === 'supply') {
    const supply = parseInt(input);
    if (isNaN(supply) || supply <= 0) {
      return ctx.reply('❗ Please enter a valid number for supply.');
    }

    // Ready to create token
    try {
      const res = await axios.post(`${API_BASE}/create-token`, {
        telegramId,
        name: state.name,
        symbol: state.symbol,
        supply
      });

      delete userTokenCreationState[telegramId];

      const token = res.data.token;
      ctx.reply(`✅ Token *${token.name}* ($${token.symbol}) created!\n🔗 Token ID: ${token.tokenId}`, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error(err);
      ctx.reply('❌ Token creation failed.');
    }
  }
});

bot.command('tip', async (ctx) => {
  try {
    const message = ctx.message.text.trim();
    const parts = message.split(' ');

    if (parts.length !== 4) {
      return ctx.reply(
        `🚫 *Invalid usage!*\n\nTry:\n/tip @username 10 VIBE\n\n_Example:_ /tip @alice 5 COFFEE`,
        { parse_mode: 'Markdown' }
      );
    }

    const [_, mention, amountStr, tokenSymbol] = parts;

    if (!mention.startsWith('@')) {
      return ctx.reply(`❗ Please mention a user with @username.`);
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      return ctx.reply(`💡 Please enter a valid number greater than 0 for amount.`);
    }

    // Simulate sending tip
    const recipient = mention.replace('@', '');
    const sender = ctx.from.username || ctx.from.id;

    // Add a loading message
    await ctx.reply(`💸 Sending *${amount} ${tokenSymbol}* from @${sender} to @${recipient}...`, {
      parse_mode: 'Markdown',
    });

    // Simulate delay
    await new Promise((r) => setTimeout(r, 1000));

    // Mock tip success
    await ctx.reply(
      `✅ Tip sent!\n@${sender} just sent *${amount} ${tokenSymbol}* to @${recipient} 🎉`,
      { parse_mode: 'Markdown' }
    );
  } catch (err) {
    console.error(err);
    ctx.reply(`😓 Something went wrong. Try again later.`);
  }
});

bot.command('unlock', async (ctx) => {
  const telegramId = ctx.from.id;
  const tokenSymbol = 'VIBE'; // or dynamically ask user

  try {
    const res = await axios.get(`${API_BASE}/access/${telegramId}/${tokenSymbol}`);
    const { hasAccess, requiredThreshold, userBalance } = res.data;

    if (hasAccess) {
      ctx.reply(`🔓 Access granted! You hold ${userBalance} ${tokenSymbol} (min required: ${requiredThreshold}).`);
      // Optional: auto-invite to group or send content link
    } else {
      ctx.reply(`❌ Access denied. You hold only ${userBalance} ${tokenSymbol}, but need at least ${requiredThreshold}.`);
    }
  } catch (err) {
    console.error(err);
    ctx.reply(`⚠️ Could not verify access. Try again later.`);
  }
});


// Add other handlers here...


// Start the bot
bot.launch();
console.log(chalk.cyan('🤖 HathorChat bot is up and running!'));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));





// bot.help((ctx) => {
//   ctx.reply(`
// ⚙️ Available commands:
// /wallet – Create your on-chain wallet
// /balance – View your balances
// /tip @user 10 VIBE – Tip tokens
// /create_token – Mint your own token
// `);
// });
