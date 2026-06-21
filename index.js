const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');
// Importiamo il motore
const { processaMessaggio } = require('./nexusEngine'); 

// 1. Server HTTP (Fondamentale per Render)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running');
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server web attivo sulla porta ${PORT}`);
});

// 2. Configurazione Client
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

client.once('ready', () => {
    console.log(`Nexus è online: ${client.user.tag}`);
});

// 3. Gestione Messaggi
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Ping di controllo (debug)
    if (message.content === '!ping') {
        message.reply("Nexus è connesso e operativo.");
        return;
    }

    // Passaggio al motore
    try {
        const risposta = await processaMessaggio(message.content, message.author.username);
        if (risposta) {
            message.reply(risposta);
        }
    } catch (error) {
        console.error("Errore nel motore:", error);
    }
});

// 4. Login
client.login(process.env.DISCORD_TOKEN);