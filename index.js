const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActivityType, Events } = require('discord.js');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Configured allowed origins for cross-origin dashboard connections
const allowedOrigins = [
    'https://directive-discord-dashboard--whiteknollinter.replit.app',
    'https://directive-dashboard-access-control--bavariankoolmot.replit.app'
];

app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Permissive fallback to prevent API blocks
        }
    },
    methods: ['GET', 'POST']
}));

// Initialize Discord Client with required privileged gateway intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

// Serve static dashboard assets from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint: Live Telemetry
app.get('/api/telemetry', (req, res) => {
    try {
        res.json({
            ping: client.ws && client.ws.ping ? client.ws.ping : 0,
            guildCount: client.guilds ? client.guilds.cache.size : 0,
            status: client.isReady() ? 'ONLINE' : 'OFFLINE'
        });
    } catch (err) {
        res.json({ ping: 0, guildCount: 0, status: 'ERROR' });
    }
});

// API Endpoint: Admin Access Control Verification
app.post('/api/auth/verify', (req, res) => {
    const { key } = req.body;
    if (key && key === process.env.ADMIN_DEVELOPER_KEY) {
        return res.json({ success: true });
    }
    return res.status(401).json({ success: false, message: 'Invalid Admin Developer Key.' });
});

// Fallback Route for Static HTML
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Directive™ System: Frontend assets not found.');
    }
});

// Slash Commands Definition
const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Check bot network latency'),
    new SlashCommandBuilder().setName('serverinfo').setDescription('Display current server details'),
    new SlashCommandBuilder().setName('verify').setDescription('Initiate user verification process'),
    new SlashCommandBuilder().setName('lockdown').setDescription('Restrict access to channels'),
    new SlashCommandBuilder().setName('audit').setDescription('Run system security diagnostics'),
    new SlashCommandBuilder().setName('health').setDescription('Display service health metrics'),
    new SlashCommandBuilder().setName('purge').setDescription('Bulk delete messages from channel')
        .addIntegerOption(opt => opt.setName('amount').setDescription('Number of messages to clear').setRequired(true))
].map(cmd => cmd.toJSON());

// Register Slash Commands via Discord REST API
async function registerCommands() {
    try {
        if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_CLIENT_ID) {
            console.error('[Directive™ Error] DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID is missing.');
            return;
        }
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
        console.log('[Directive™ Core] Synchronizing slash commands...');
        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            { body: commands }
        );
        console.log('[Directive™ Core] Successfully registered all slash commands!');
    } catch (error) {
        console.error('[Directive™ Error] Command registration failed:', error.message);
    }
}

// ClientReady Event Listener (modern discord.js v14 standard)
client.once(Events.ClientReady, c => {
    console.log(`[Directive™ Core] Authenticated and logged in as ${c.user.tag}`);
    
    // Explicitly update Discord presence to Online
    c.user.setPresence({
        status: 'online',
        activities: [{ name: 'Directive™ Security | /help', type: ActivityType.Watching }]
    });

    registerCommands();
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`[Axiom Systems™] Web server online on port ${PORT}`);
});

// Authenticate and Login to Discord Gateway
if (process.env.DISCORD_BOT_TOKEN) {
    client.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
        console.error('[Directive™ Error] Gateway authentication failed:', err.message);
    });
} else {
    console.error('[Directive™ Error] DISCORD_BOT_TOKEN environment variable missing.');
}
