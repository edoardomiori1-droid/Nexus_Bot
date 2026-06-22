const { GoogleGenerativeAI } = require("@google/generative-ai");

// Legge la variabile corretta configurata sulla dashboard di Render
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("[CRITICAL] Rilevamento fallito: GEMINI_API_KEY è assente su Render!");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Matrice di ridondanza per evitare l'errore 404
const MATRICE_MODELLI = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-flash",
    "gemini-pro"
];

async function processaMessaggio(testo, utente) {
    if (!testo || testo.trim() === "") return "Payload vuoto.";
    if (!apiKey) return "⚠️ Configurazione incompleta: manca la chiave GEMINI_API_KEY sul server.";

    for (const modello of MATRICE_MODELLI) {
        try {
            console.log(`[ENGINE] Tentativo di chiamata con risorsa: ${modello}`);
            const model = genAI.getGenerativeModel({ model: modello });
            
            const promptStrutturato = `Sei Nexus, l'Agente Totale di Edoardo. Rispondi a ${utente}: ${testo}`;
            const result = await model.generateContent(promptStrutturato);
            const response = await result.response;
            
            return response.text();
        } catch (err) {
            console.warn(`[ENGINE] Endpoint ${modello} non raggiungibile: ${err.message}`);
            if (err.message.includes("API key") || err.message.includes("401")) {
                return "⚠️ Errore di autenticazione: La chiave inserita su Render non è valida.";
            }
        }
    }
    return "❌ Errore di Configurazione: Nessun modello ha risposto alle richieste HTTP (404).";
}

module.exports = { processaMessaggio };