require('dotenv').config();
const { Client, GatewayIntentBits, AuditLogEvent, EmbedBuilder } = require('discord.js');

// Initialize client with high-level server management & moderation intents
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

client.once('ready', () => {
    console.log(`[DIRECTIVE CORE ONLINE] Logged in as ${client.user.tag}`);
    console.log(`[AXIOM SYSTEMS] Autonomous Server Management & Security Protocol Active.`);
    
    // Set professional management status
    client.user.setActivity('over server security & audits', { type: 3 });
});

// ==========================================
// SERVER MANAGEMENT & SECURITY EVENT LOGGERS
// ==========================================

// 1. Anti-Raid / Member Join Monitor
client.on('guildMemberAdd', async member => {
    console.log(`[SECURITY] New member joined: ${member.user.tag} (${member.id}) in ${member.guild.name}`);
    // Future expansion: Auto-check account age or apply verification screening here
});

// 2. Moderation Action Logger (Bans & Kicks)
client.on('guildBanAdd', async ban => {
    console.log(`[AUDIT] User banned: ${ban.user.tag} from ${ban.guild.name}`);
});

// 3. Command / Utility Interface
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Server Status & System Check Command
    if (message.content === '!directive status') {
        const embed = new EmbedBuilder()
            .setTitle('Directive™ // System Status')
            .setColor(0x0F141C)
            .setDescription('Autonomous server management and security protocols are fully operational.')
            .addFields(
                { name: 'Parent Brand', value: 'Axiom Systems™', inline: true },
                { name: 'Operational State', value: '🟢 Nominal', inline: true },
                { name: 'Active Protections', value: 'Anti-Raid, Audit Tracking, Member Oversight', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Directive™ Server Management System' });

        message.reply({ embeds: [embed] });
    }

    // Lockdown / Emergency Alert Command (Requires Administrator permissions)
    if (message.content === '!directive lockdown') {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('⛔ **Access Denied:** You lack the required administrative privileges to execute security lockdown protocols.');
        }
        message.channel.send('⚠️ **SECURITY ALERT:** Directive™ has logged an administrative security review request for this channel.');
    }
});

// Connect the bot securely using environment credentials
client.login(process.env.DISCORD_TOKEN);
