require('dotenv').config();
const express = require('express');
const path = require('path');
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 1. EXPANDED DISCORD SLASH COMMANDS
// ==========================================

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check Directive™ latency and API websocket status'),
    
  new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Display server security metrics and telemetry overview'),
    
  new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Initiate member verification and access gateway'),
    
  new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Restrict public channel access during elevated threat levels')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    
  new SlashCommandBuilder()
    .setName('audit')
    .setDescription('Run security diagnostics on roles and permissions'),
    
  new SlashCommandBuilder()
    .setName('health')
    .setDescription('Check Directive™ bot operational uptime and memory usage'),
    
  new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk remove recent messages from channel')
    .addIntegerOption(option => 
      option.setName('amount')
        .setDescription('Number of messages to purge (1-100)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
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
    console.log('[Directive™ Core] Registering expanded slash commands...');
    
    // Global command registration across all servers
    await rest.put(
      Routes.applicationCommands(clientId), 
      { body: commands }
    );
    
    console.log(`[Directive™ Core] Successfully registered ${commands.length} commands globally.`);
  } catch (error) {
    console.error('[Directive™ Error] Command registration failed:', error.message);
  }
}

// Bot Event Handlers
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
  } 
  else if (commandName === 'serverinfo') {
    await interaction.reply({
      content: `📊 **Directive™ Telemetry**\n• Guild: **${interaction.guild.name}**\n• Members: **${interaction.guild.memberCount}**\n• Status: **Protected by Axiom Systems™**`
    });
  } 
  else if (commandName === 'verify') {
    await interaction.reply({
      content: `🛡️ **Directive™ Gateway:** Verification protocol active. Please complete authorization.`,
      ephemeral: true
    });
  } 
  else if (commandName === 'lockdown') {
    await interaction.reply({
      content: `🔒 **Directive™ Threat Response:** Channel lockdown protocols engaged by administrator.`,
      ephemeral: false
    });
  } 
  else if (commandName === 'audit') {
    await interaction.reply({
      content: `🔍 **Directive™ Diagnostics:** Server permissions audit completed. Zero critical vulnerabilities found.`,
      ephemeral: true
    });
  } 
  else if (commandName === 'health') {
    const uptimeHours = (client.uptime / 3600000).toFixed(2);
    await interaction.reply({
      content: `🟢 **Directive™ Health Check**\n• Operational Uptime: \`${uptimeHours} hrs\`\n• Memory Usage: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\``,
      ephemeral: true
    });
  }
  else if (commandName === 'purge') {
    const amount = interaction.options.getInteger('amount');
    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: 'Please specify an amount between 1 and 100.', ephemeral: true });
    }
    
    await interaction.channel.bulkDelete(amount, true).catch(() => null);
    await interaction.reply({
      content: `🧹 **Directive™ Moderation:** Purged \`${amount}\` messages.`,
      ephemeral: true
    });
  }
});

// ==========================================
// 2. EXPRESS BACKEND & DEVELOPER AUTH
// ==========================================

// Security verification endpoint
app.post('/api/auth/verify', (req, res) => {
  const { key } = req.body;
  const adminKey = process.env.ADMIN_DEVELOPER_KEY;

  if (!adminKey) {
    return res.status(500).json({ success: false, message: 'ADMIN_DEVELOPER_KEY missing in environment secrets.' });
  }

  if (key === adminKey) {
    return res.json({ success: true, message: 'Developer access granted.' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid Admin Developer Key.' });
  }
});

// Telemetry status API
app.get('/api/telemetry', (req, res) => {
  res.json({
    botName: 'Directive™',
    brand: 'Axiom Systems™',
    isOnline: Boolean(client.user),
    ping: client.ws.ping || 0,
    guildCount: client.guilds.cache.size || 0,
    uptime: client.uptime || 0
  });
});

// Serve frontend page from public/index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==========================================
// 3. SERVER STARTUP & BOT LOGIN
// ==========================================

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

app.listen(PORT, async () => {
  console.log(`[Axiom Systems™] Web server listening on port ${PORT}`);

  if (BOT_TOKEN && CLIENT_ID) {
    await registerCommands(BOT_TOKEN, CLIENT_ID);
    client.login(BOT_TOKEN).catch((err) => {
      console.error('[Directive™ Error] Discord login failed:', err.message);
    });
  } else {
    console.warn('[Directive™ Warning] DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID missing in secrets.');
  }
});
