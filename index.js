const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');

// 1. Configurazione Server HTTP (Per mantenere attivo il Web Service su Render)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server web attivo sulla porta ${PORT}`);
});

// 2. Configurazione Variabili (Predisposizione per Feature Future)
process.env.NODE_ENV = 'production';
const ADMIN_ID = process.env.OWNER_ID; 
const DB_URL = process.env.DATABASE_URL;
const AI_KEY = process.env.OPENAI_API_KEY;

// 3. Configurazione Client Discord
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

// --- 4. AREA LOGICA BOT ---
// Inserisci qui sotto i comandi e la logica del bot
client.on('messageCreate', (message) => {
    // Esempio di test:
    if (message.content === '!ping') {
        message.reply('Nexus è connesso e operativo.');
    }
});
// --------------------------

// 5. Login
client.login(process.env.DISCORD_TOKEN);