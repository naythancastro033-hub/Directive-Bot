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
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
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
                        { name: 'Action Recommended', value: 'Verify server invite links and review audit logs.', inline: false }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Directive™ Autonomous Defense // Axiom Systems™' });

                systemChannel.send({ embeds: [raidEmbed] });
            }
        } catch (err) {
            console.error('[ANTI-RAID ERROR] Failed to dispatch security notification:', err);
        }
    }
});

// ==========================================
// COMMAND ROUTER & EMBED SUITE
// ==========================================

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    const prefix = '!directive ';
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const guildId = message.guild.id;

    if (!serverConfigs.has(guildId)) {
        serverConfigs.set(guildId, {
            prefix: '!',
            antiRaid: true,
            antiNuke: true,
            autoMod: true,
            logChannel: null,
            verificationLevel: 'medium'
        });
    }
    const config = serverConfigs.get(guildId);

    // --- 1. SETUP WIZARD EMBED ---
    if (command === 'setup') {
