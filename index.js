const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');
const { processaMessaggio } = require('./nexusEngine'); 

// Profilo Utente (Modulo Dati)
const profiloUtente = {
    nome: "Edoardo",
    sport: "Rugby",
    calorie: 3200,
    focusDieta: "Colazione liquida e grassi sani",
    focusSport: "Placcaggio dominante",
    azioneSportiva: "Stretching psoas eseguito?"
};

// Server HTTP per Render
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Nexus Bot Online');
});
const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0');

// Configurazione Client
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

// Gestione Messaggi
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!ping') {
        message.reply("Nexus è operativo.");
        return;
    }

    try {
        // Passiamo il testo, l'utente e il PROFILO al motore
        const risposta = await processaMessaggio(message.content, message.author.username, profiloUtente);
        if (risposta) {
            message.reply(risposta);
        }
    } catch (error) {
        console.error("Errore nel motore:", error);
    }
});

client.login(process.env.DISCORD_TOKEN);