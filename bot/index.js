require('dotenv').config();
const { Telegraf } = require('telegraf');
const chalk = require('chalk');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  console.log(chalk.green(`User started bot: ${ctx.from.username}`));
  ctx.reply("👋 Welcome to HathorChat! Type /help to see what I can do.");
});

bot.help((ctx) => {
  ctx.reply("⚙️ Available commands:\n/tip @user 5 VIBE\n/balance\n/create_token\n...");
});

// Add other handlers here...

// Start the bot
bot.launch();
console.log(chalk.cyan('🤖 HathorChat bot is up and running!'));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
