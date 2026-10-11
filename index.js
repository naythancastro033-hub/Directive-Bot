git add index.js
git commit -m "Update index.js with health check port binding"
git push origin main
require('dotenv').config();
const http = require('http');
const { 
    Client, 
    GatewayIntentBits, 
    PermissionsBitField, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');

// ==========================================
// RENDER WEBSERVICE HEALTH CHECK BINDING
// ==========================================
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Directive Engine Nominal // Axiom Systems™');
}).listen(port, () => {
    console.log(`[HTTP SERVER] Health check endpoint listening on port ${port}`);
});

// ==========================================
// DISCORD CLIENT INITIALIZATION
// ==========================================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildAuditLogs
    ]
});

// In-memory configuration registry
const serverConfigs = new Map();
const joinTracker = new Map();

client.once('ready', () => {
    console.log(`[DIRECTIVE ENGINE ONLINE] Logged in as ${client.user.tag}`);
    console.log(`[AXIOM SYSTEMS] Advanced Server Management & Threat Mitigation Active.`);
    client.user.setActivity('over 50+ management modules | !directive help', { type: 3 });
});

// ==========================================
// ADVANCED SECURITY PROTOCOLS (Anti-Raid & Anti-Nuke)
// ==========================================

client.on('guildMemberAdd', async member => {
    const guildId = member.guild.id;
    const config = serverConfigs.get(guildId) || { antiRaid: true };

    if (!config.antiRaid) return;

    const now = Date.now();
    if (!joinTracker.has(guildId)) joinTracker.set(guildId, []);
    const timestamps = joinTracker.get(guildId);
    
    timestamps.push(now);
    const recentJoins = timestamps.filter(time => now - time < 10000);
    joinTracker.set(guildId, recentJoins);

    if (recentJoins.length >= 5) {
        try {
            const systemChannel = member.guild.systemChannel;
            if (systemChannel) {
                const raidEmbed = new EmbedBuilder()
                    .setTitle('🚨 SECURITY ALERT // Anti-Raid Triggered')
                    .setColor(0xE74C3C)
                    .setDescription('High-velocity member join spike detected. Directive™ has flagged potential automated raid activity.')
                    .addFields(
                        { name: 'Status', value: 'Elevated Threat Monitoring', inline: true },
                        { name: 'Action Recommended', value: 'Verify server invite links and
