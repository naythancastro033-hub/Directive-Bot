const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActivityType, Events } = require('discord.js');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Allowed origins including your updated Replit dashboard URL
const allowedOrigins = [
    'https://directive-discord-dashboard--whiteknollinter.replit.app',
    'https://directive-dashboard-access-control--bavariankoolmot.replit.app'
];

app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests) or allowed origins
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Fallback to allow connection
        }
    },
    methods: ['GET', 'POST']
}));

// Directory verification
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
if (fs.existsSync(path.join(__dirname, 'public'))) {
    console.log('Public folder contents:', fs.readdirSync(path.join(__dirname, 'public')));
} else {
    console.log('[Directive™ Error] Public folder NOT found by Node.js!');
}

// Initialize Discord Client with required privileged intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

// Serve static dashboard files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Telemetry endpoint for Replit dashboard
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

// Admin verification endpoint
app.post('/api/auth/verify', (req, res) => {
    const { key } = req.body;
    if (key && key === process.env.ADMIN_DEVELOPER_KEY) {
        return res.json({ success: true });
    }
    return res.status(401).json({ success: false, message: 'Invalid Admin Developer Key.' });
});

// Serve index.html for static frontend requests
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Directive™ Dashboard: index.html not found in public folder.');
    }
});

// Slash Command Definitions
const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Check bot ping'),
    new SlashCommandBuilder().setName('serverinfo').setDescription('Display server details'),
    new SlashCommandBuilder().setName('verify').setDescription('Initiate verification'),
    new SlashCommandBuilder().setName('lockdown').setDescription('Restrict channel access'),
    new SlashCommandBuilder().setName('audit').setDescription('Run security diagnostics'),
    new SlashCommandBuilder().setName('health').setDescription('Check bot health metrics'),
    new SlashCommandBuilder().setName('purge').setDescription('Bulk delete messages')
        .addIntegerOption(opt => opt.setName('amount').setDescription('Number of messages').setRequired(true))
].map(cmd => cmd.toJSON());

// Register Slash Commands
async function registerCommands() {
    try {
        if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_CLIENT_ID) {
            console.error('[Directive™ Error] DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID missing.');
            return;
        }
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
        console.log('[Directive™ Core] Registering slash commands...');
        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            { body: commands }
        );
        console.log('[Directive™ Core] Successfully registered slash commands!');
    } catch (error) {
        console.error('[Directive™ Error] Command registration failed:', error.message);
    }
}

// Client Ready Handler
client.once(Events.ClientReady, c => {
    console.log(`[Directive™ Core] Logged in as ${c.user.tag}`);
    
    // Set presence status
    c.user.setPresence({
        status: 'online',
        activities: [{ name: 'Directive™ Security | /help', type: ActivityType.Watching }]
    });

    registerCommands();
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`[Axiom Systems™] Web server listening on port ${PORT}`);
});

// Connect Bot to Discord
if (process.env.DISCORD_BOT_TOKEN) {
    client.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
        console.error('[Directive™ Error] Discord login failed:', err.message);
    });
} else {
    console.error('[Directive™ Error] DISCORD_BOT_TOKEN environment variable is missing.');
}
