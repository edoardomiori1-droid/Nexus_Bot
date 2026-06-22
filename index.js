/**
 * index.js - V3.0 (Production Grade)
 * Gestione eventi Discord + Server Keep-Alive
 */
require('dotenv').config(); // Carica variabili d'ambiente
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { processaMessaggio } = require('./nexusEngine');
const http = require('http');

// Server Keep-Alive per Render
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', uptime: process.uptime() }));
}).listen(PORT, () => console.log(`[SYSTEM] HTTP server in ascolto sulla porta ${PORT}`));

// Configurazione Client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Eventi stabilità
client.on('ready', () => {
    console.log(`[DISCORD] Connesso come ${client.user.tag}`);
    client.user.setActivity('Edoardo', { type: ActivityType.Watching });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content) return;

    // Log attività
    console.log(`[MSG] ${message.author.username}: ${message.content.substring(0, 50)}...`);

    try {
        await message.channel.sendTyping();
        const risposta = await processaMessaggio(message.content, message.author.username);
        await message.reply(risposta);
    } catch (error) {
        console.error("[CRITICAL] Errore elaborazione:", error);
        await message.reply("⚠️ Errore di sistema: Modulo IA non raggiungibile.");
    }
});

// Gestione crash e chiusure pulite
process.on('SIGINT', () => { client.destroy(); process.exit(); });
process.on('SIGTERM', () => { client.destroy(); process.exit(); });

client.login(process.env.DISCORD_TOKEN).catch(err => {
    console.error("[FATAL] Impossibile avviare il client:", err);
    process.exit(1);
});