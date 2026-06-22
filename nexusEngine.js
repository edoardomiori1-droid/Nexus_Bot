const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("[CRITICAL] Chiave GEMINI_API_KEY non rilevata nelle variabili d'ambiente di Render!");
}

// Matrice accoppiata Modello-Versione per eludere i blocchi di mappatura stringa del gateway Google
const MATRICE_PRODUZIONE = [
    { id: "gemini-1.5-flash-latest", version: "v1" },
    { id: "gemini-1.5-pro-latest", version: "v1" },
    { id: "gemini-1.5-flash-002", version: "v1" },
    { id: "gemini-1.5-flash-8b", version: "v1" },
    { id: "gemini-1.5-flash", version: "v1beta" }
];

async function processaMessaggio(testo, utente) {
    if (!testo || testo.trim() === "") return "Payload vuoto.";
    if (!apiKey) return "⚠️ Configurazione incompleta: manca la chiave GEMINI_API_KEY su Render.";

    for (const target of MATRICE_PRODUZIONE) {
        try {
            console.log(`[ENGINE] Tentativo su endpoint ${target.version} con risorsa esplicita: ${target.id}`);
            
            const url = `https://generativelanguage.googleapis.com/${target.version}/models/${target.id}:generateContent?key=${apiKey}`;
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Sei Nexus, l'Agente Totale di Edoardo. Sii conciso e diretto. Rispondi a ${utente}: ${testo}`
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.warn(`[ENGINE] Risorsa ${target.id} ha restituito status ${response.status}:`, data.error?.message || JSON.stringify(data));
                continue; // Salta al posizionamento successivo nella matrice
            }

            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                console.log(`[ENGINE] Connessione riuscita con risorsa: ${target.id} (${target.version})`);
                return data.candidates[0].content.parts[0].text;
            }
        } catch (err) {
            console.warn(`[ENGINE] Errore di rete o timeout su ${target.id}: ${err.message}`);
        }
    }
    return "❌ Errore di Configurazione: Nessun modello stabile o variante alias ha accettato la chiave API corrente.";
}

module.exports = { processaMessaggio };