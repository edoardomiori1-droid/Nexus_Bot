/**
 * index.js
 * Cuore del bot Discord.
 * Gestisce la connessione, gli eventi e il routing verso nexusEngine.
 */
const { Client, GatewayIntentBits } = require('discord.js');
const { processaMessaggio } = require('./nexusEngine');

// Configurazione dei permessi necessari per leggere e scrivere messaggi
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Evento: Bot pronto
client.once('ready', () => {
    console.log(`[DISCORD] Nexus è online come ${client.user.tag}`);
    console.log(`[DISCORD] Pronto a ricevere comandi.`);
});

// Evento: Messaggi
client.on('messageCreate', async (message) => {
    // Evita loop infiniti rispondendo ai bot
    if (message.author.bot) return;

    // Log dell'attività per monitoraggio
    console.log(`[DISCORD] Messaggio da ${message.author.username} in canale ${message.channel.name}: ${message.content}`);

    try {
        // Indica che il bot sta scrivendo (migliora l'esperienza utente)
        await message.channel.sendTyping();

        // Inoltra al motore cognitivo
        const risposta = await processaMessaggio(message.content, message.author.username);

        // Invia risposta
        await message.reply(risposta);
        console.log(`[DISCORD] Risposta inviata con successo.`);

    } catch (error) {
        console.error(`[DISCORD] Errore critico durante l'elaborazione del messaggio:`, error);
        
        try {
            await message.reply("Si è verificato un errore di sistema durante l'elaborazione.");
        } catch (replyError) {
            console.error("[DISCORD] Impossibile inviare messaggio di errore:", replyError);
        }
    }
});

// Evento: Errori del client
client.on('error', (error) => {
    console.error('[DISCORD] Errore del client Discord:', error);
});

// Login
if (!process.env.DISCORD_TOKEN) {
    console.error("[ERRORE] DISCORD_TOKEN non configurato!");
    process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);