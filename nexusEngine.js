// nexusEngine.js
async function processaMessaggio(testo, utente) {
    // Qui metteremo tutta la logica di Nexus (dieta, rugby, studio)
    // Esempio:
    if (testo.toLowerCase().includes('panca')) {
        return "Il tuo record di panca è 77.5kg. Spingi forte!";
    }
    
    // Per ora, una risposta generica
    return `Nexus ha ricevuto: ${testo}`;
}

module.exports = { processaMessaggio };