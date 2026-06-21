async function processaMessaggio(testo, utente) {
    const input = testo.toLowerCase();

    // 1. Comando: Panca (Focus Sport)
    if (input.includes('panca')) {
        return "Stai spingendo 77.5kg. Il tuo obiettivo è la solidità. Mantieni il focus.";
    }

    // 2. Comando: Dieta (Focus Nutrizione)
    if (input.includes('dieta') || input.includes('mangiare')) {
        return "Obiettivo: 3200 kcal. Ricorda: colazione liquida (Whey+Avena) e surplus di grassi sani.";
    }

    // 3. Comando: Saluto
    if (input.includes('ciao') || input.includes('ehi')) {
        return `Ciao ${utente}, Nexus è attivo. Cosa dobbiamo ottimizzare oggi?`;
    }

    // 4. Fallback (Se non capisce, risponde così)
    // Se vuoi che risponda SEMPRE, togli il commento sotto. 
    // Se vuoi che stia in silenzio quando non capisce, lascia come ora (restituisci null).
    return null; 
}

module.exports = { processaMessaggio };