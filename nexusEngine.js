const OpenAI = require('openai');

// Configurazione OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function processaMessaggio(testo, utente, profilo) {
    const input = testo.toLowerCase();

    // 1. Priorità: Logica Personale (rimane rapida e gratuita)
    if (input.includes('dieta') || input.includes('fame')) {
        return `Protocollo alimentare attivo per ${profilo.nome}. Target: ${profilo.calorie} kcal. Focus: ${profilo.focusDieta}.`;
    }
    if (input.includes('rugby') || input.includes('allenamento')) {
        return `Focus ${profilo.sport}: ${profilo.focusSport}. ${profilo.azioneSportiva}.`;
    }

    // 2. Fallback: Intelligenza Artificiale Universale
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Modello rapido ed economico
            messages: [
                { role: "system", content: "Sei Nexus, un assistente utile, sintetico e preciso." },
                { role: "user", content: testo }
            ],
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Errore API OpenAI:", error);
        return "Scusa, ho un problema con il mio modulo cognitivo in questo momento.";
    }
}

module.exports = { processaMessaggio };