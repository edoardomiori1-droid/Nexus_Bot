// Recupero della chiave d'ambiente validata sulla dashboard di Render
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("[CRITICAL] Rilevamento fallito: GEMINI_API_KEY è assente su Render!");
}

// Matrice focalizzata sulla flotta di produzione stabile 'v1' per aggirare i 404 del canale v1beta
const MATRICE_MODELLI = [
    "gemini-1.5-flash",
    "gemini-1.5-pro"
];

async function processaMessaggio(testo, utente) {
    if (!testo || testo.trim() === "") return "Payload vuoto.";
    if (!apiKey) return "⚠️ Configurazione incompleta: manca la chiave GEMINI_API_KEY sul server.";

    for (const modello of MATRICE_MODELLI) {
        try {
            console.log(`[ENGINE] Tentativo HTTP nativo su endpoint v1 con risorsa: ${modello}`);
            
            // Chiamata diretta all'endpoint di produzione v1 stabile
            const url = `https://generativelanguage.googleapis.com/v1/models/${modello}:generateContent?key=${apiKey}`;
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Sei Nexus, l'Agente Totale di Edoardo. Rispondi a ${utente}: ${testo}`
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.warn(`[ENGINE] Endpoint ${modello} ha risposto con status ${response.status}:`, JSON.stringify(data));
                continue; // Failover: passa al modello successivo se questo fallisce (es. quota esaurita)
            }

            // Estrazione sicura del payload di risposta dal server Google
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }
        } catch (err) {
            console.warn(`[ENGINE] Errore di connessione o parsing per ${modello}: ${err.message}`);
        }
    }
    return "❌ Errore di Configurazione: Nessun modello stabile su endpoint v1 ha accettato la richiesta.";
}

module.exports = { processaMessaggio };