require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { processaMessaggio } = require('./nexusEngine');
const http = require('http');

const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ONLINE', core: 'NEXUS' }));
}).listen(PORT, () => console.log(`[SYSTEM] HTTP server in ascolto sulla porta ${PORT}`));

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Correzione DeprecationWarning: usiamo clientReady anziché ready
client.once('clientReady', (readyClient) => {
    console.log(`[DISCORD] Connesso con successo come ${readyClient.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content) return;
    try {
        await message.channel.sendTyping();
        const risposta = await processaMessaggio(message.content, message.author.username);
        await message.reply(risposta);
    } catch (error) {
        console.error("[DISCORD] Errore di routing:", error);
    }
});

client.login(process.env.DISCORD_TOKEN);