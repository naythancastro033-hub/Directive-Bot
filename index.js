require('dotenv').config();
const http = require('http');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// Render health check server
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Directive Engine Nominal');
}).listen(port, () => {
    console.log(`[HTTP] Health check running on port ${port}`);
});

// Discord Client Setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`[DIRECTIVE ONLINE] Logged in as ${client.user.tag}`);
});

// Command Handler
client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith('!directive ')) return;

    const args = message.content.slice(11).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'help' || command === 'commands') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('📖 Directive™ // Command Directory')
            .setColor(0x0F141C)
            .setDescription('Available Commands:\n• `!directive help`\n• `!directive status`\n• `!directive setup`')
            .setTimestamp();
        return message.reply({ embeds: [helpEmbed] });
    }

    if (command === 'status') {
        return message.reply('🟢 **Directive™ Engine Status:** Online and fully operational.');
    }

    if (command === 'setup') {
        return message.reply('🛡️ **Directive™ Setup:** Console loaded successfully.');
    }
});

client.login(process.env.DISCORD_TOKEN);
