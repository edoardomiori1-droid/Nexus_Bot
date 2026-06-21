const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');

// Configurazione server HTTP per Render (Web Service)
// Render richiede che il servizio leghi una porta entro 60 secondi
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server web attivo sulla porta ${PORT}`);
});

// Configurazione Client Discord
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

// --- INSERISCI QUI SOTTO LA TUA LOGICA BOT (es. client.on('messageCreate', ...)) ---


// -----------------------------------------------------------------------------------

// Login finale
client.login(process.env.DISCORD_TOKEN);