/**
 * nexusEngine.js
 * Modello: Gemini 1.5 Pro
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Validazione chiave
if (!process.env.OPENAI_API_KEY) {
    console.error("ERRORE: API KEY non trovata!");
}

// Inizializzazione sicura
const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);

// Usiamo 1.5-pro, il modello più stabile e universale
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

async function processaMessaggio(testo, utente) {
    try {
        console.log(`[ENGINE] Invio a Gemini 1.5 Pro...`);
        
        const result = await model.generateContent(testo);
        const response = await result.response;
        const testoRisposta = response.text();

        return testoRisposta || "Nessuna risposta dal modello.";

    } catch (error) {
        console.error("[ENGINE] Errore API:", error.message);
        return "Errore 404: Modello non disponibile. Verifica che la tua chiave API sia abilitata per 'gemini-1.5-pro'.";
    }
}

module.exports = { processaMessaggio };