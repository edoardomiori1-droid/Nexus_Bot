require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Evento di avvio
client.once('ready', () => {
    console.log(`Nexus è online: ${client.user.tag}`);
});

// Gestione messaggi
client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;

    // Comandi
    if (msg.content === '!ciao') {
        msg.reply('Ciao Edo! Nexus è attivo e pronto ai tuoi ordini.');
    } 
    else if (msg.content === '?come stai') {
        msg.reply('Sto benissimo, grazie per averlo chiesto! E tu come stai?');
    }
});

// Login del bot
client.login(process.env.DISCORD_TOKEN);