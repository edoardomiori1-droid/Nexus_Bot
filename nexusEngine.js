const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("[CRITICAL] Rilevamento fallito: GEMINI_API_KEY assente su Render.");
} else {
    // Stampa di sicurezza per verificare l'effettivo cambio di chiave nei log di Render
    console.log(`[ENGINE] ENGINE AVVIATO. API Key rilevata (Primi 4 caratteri): ${apiKey.substring(0, 4)}...`);
}

const MATRICE_MODELLI = [
    "gemini-1.5-flash",
    "gemini-1.5-pro"
];

async function processaMessaggio(testo, utente) {
    if (!testo || testo.trim() === "") return "Payload vuoto.";
    if (!apiKey) return "⚠️ Configurazione incompleta: manca la chiave GEMINI_API_KEY.";

    for (const modello of MATRICE_MODELLI) {
        try {
            console.log(`[ENGINE] Invio richiesta HTTP nativa a: ${modello}`);
            
            const url = `https://generativelanguage.googleapis.com/v1/models/${modello}:generateContent?key=${apiKey}`;
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `Sei Nexus, l'Agente Totale di Edoardo. Rispondi a ${utente}: ${testo}` }]
                    }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.warn(`[ENGINE] Risorsa ${modello} KO (Status ${response.status}):`, data.error?.message || JSON.stringify(data));
                continue; 
            }

            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                console.log(`[ENGINE] Risposta ottenuta con successo da: ${modello}`);
                return data.candidates[0].content.parts[0].text;
            }
        } catch (err) {
            console.warn(`[ENGINE] Eccezione di rete su ${modello}: ${err.message}`);
        }
    }
    return "❌ Errore di Configurazione: I modelli stabili rifiutano la chiave. Verifica spazi extra nella variabile d'ambiente di Render o i permessi del progetto AI Studio.";
}

module.exports = { processaMessaggio };