const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inizializza con la chiave che hai caricato su Render
const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function processaMessaggio(testo, utente, profilo) {
    const input = testo.toLowerCase();

    // Logica Personale
    if (input.includes('dieta') || input.includes('fame')) {
        return `Protocollo alimentare attivo per ${profilo.nome}. Target: ${profilo.calorie} kcal. Focus: ${profilo.focusDieta}.`;
    }
    if (input.includes('rugby') || input.includes('allenamento')) {
        return `Focus ${profilo.sport}: ${profilo.focusSport}. ${profilo.azioneSportiva}.`;
    }

    // Logica Universale (Gemini)
    try {
        const result = await model.generateContent(testo);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Errore Gemini:", error);
        return "Ho un problema tecnico col modulo IA.";
    }
}

module.exports = { processaMessaggio };