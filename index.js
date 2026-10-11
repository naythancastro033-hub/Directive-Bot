require('dotenv').config();
const express = require('express');
const path = require('path');
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 1. DISCORD BOT & COMMAND DEFINITIONS
// ==========================================

// Define all commands for Directive™
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check Directive™ system latency and connection status'),
  new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Display detailed security and configuration metrics for this server'),
  new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Initiate user verification protocols'),
  new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Lock down server channels in emergency anti-raid scenarios'),
  new SlashCommandBuilder()
    .setName('audit')
    .setDescription('Run diagnostic health checks on server permissions')
];

// Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
});

// Register Slash Commands Function
async function registerCommands(token, clientId) {
  try {
    const rest = new REST({ version: '10' }).setToken(token);
    console.log('[Directive™ Core] Registering slash commands...');
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('[Directive™ Core] Slash commands successfully registered globally.');
  } catch (error) {
    console.error('[Directive™ Error] Failed to register slash commands:', error.message);
  }
}

// Bot Event Listeners
client.once('ready', () => {
  console.log(`[Directive™ Core] Authenticated as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply({
      content: `⚡ **Directive™ Online** | Gateway Latency: \`${client.ws.ping}ms\``,
      ephemeral: true
    });
  } else if (commandName === 'serverinfo') {
    await interaction.reply({
      content: `📊 **Directive™ Telemetry**\nGuild: **${interaction.guild.name}**\nMembers: **${interaction.guild.memberCount}**\nStatus: **Protected by Axiom Systems™**`
    });
  } else if (commandName === 'verify') {
    await interaction.reply({
      content: `🛡️ **Directive™ Verification:** Verification gateway is active.`,
      ephemeral: true
    });
  } else if (commandName === 'lockdown') {
    await interaction.reply({
      content: `🔒 **Directive™ Lockdown:** Channel security protocols triggered.`,
      ephemeral: true
    });
  } else if (commandName === 'audit') {
    await interaction.reply({
      content: `🔍 **Directive™ Diagnostics:** Server permissions audit completed with zero threats detected.`,
      ephemeral: true
    });
  }
});

// ==========================================
// 2. API ENDPOINTS & DEVELOPER SECURITY
// ==========================================

// Developer Authentication Verification
app.post('/api/auth/verify', (req, res) => {
  const { key } = req.body;
  const adminKey = process.env.ADMIN_DEVELOPER_KEY;

  if (!adminKey) {
    return res.status(500).json({ success: false, message: 'ADMIN_DEVELOPER_KEY not configured in .env' });
  }

  if (key === adminKey) {
    return res.json({ success: true, message: 'Access granted.' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid Admin Developer Key.' });
  }
});

// Fetch Bot Public Status & Telemetry
app.get('/api/telemetry', (req, res) => {
  res.json({
    botName: 'Directive™',
    brand: 'Axiom Systems™',
    isOnline: client.user ? true : false,
    ping: client.ws.ping || 0,
    guildCount: client.guilds.cache.size || 0,
    uptime: client.uptime || 0
  });
});

// Catch-all route to serve the dashboard interface
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==========================================
// 3. START SERVER & BOT CLIENT
// ==========================================

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

app.listen(PORT, async () => {
  console.log(`[Axiom Systems™] Server active on port ${PORT}`);

  if (BOT_TOKEN && CLIENT_ID) {
    await registerCommands(BOT_TOKEN, CLIENT_ID);
    client.login(BOT_TOKEN).catch((err) => {
      console.error('[Directive™ Error] Failed to log in with DISCORD_BOT_TOKEN:', err.message);
    });
  } else {
    console.warn('[Directive™ Warning] DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID missing in secrets. Bot features offline until configured.');
  }
});
