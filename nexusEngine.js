// Recupero della chiave con fallback pulito per evitare conflitti di cache
const apiKey = (process.env.GEMINI_API_KEY || "").trim();

if (!apiKey || apiKey === "") {
    console.error("[CRITICAL] Rilevamento fallito: GEMINI_API_KEY assente o vuota su Render.");
} else {
    console.log(`[ENGINE] ENGINE AVVIATO. Controllo stringa: Primi caratteri = ${apiKey.substring(0, 7)}... Lunghezza totale = ${apiKey.length}`);
}

const MATRICE_MODELLI = [
    "gemini-1.5-flash",
    "gemini-1.5-pro"
];

async function processaMessaggio(testo, utente) {
    if (!testo || testo.trim() === "") return "Payload vuoto.";
    if (!apiKey || apiKey === "") return "⚠️ Configurazione incompleta: manca la chiave GEMINI_API_KEY o non è stata caricata correttamente.";

    for (const modello of MATRICE_MODELLI) {
        try {
            console.log(`[ENGINE] Tentativo di chiamata HTTP v1beta a: ${modello}`);
            
            // Endpoint v1beta con query string forzata e pulita
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modello}:generateContent?key=${apiKey}`;
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `Sei Nexus, l'Agente Totale di Edoardo. Rispondi in modo conciso a ${utente}: ${testo}` }]
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
            console.warn(`[ENGINE] Eccezione critica di rete su ${modello}: ${err.message}`);
        }
    }
    return "❌ Errore di Configurazione Cloud: Google rifiuta l'autenticazione di questa stringa. Verifica le restrizioni del progetto IP o API su AI Studio.";
}

module.exports = { processaMessaggio };