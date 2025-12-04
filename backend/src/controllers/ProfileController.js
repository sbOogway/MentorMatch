// controllers/userController.js
const userService = require('../services/UserService');

// ... (Implementazione di registerUser e authenticateUser) ...

/**
 * GET /api/utente/me
 * Recupera i dati del profilo dell'utente la cui ID è stata verificata dal middleware.
 */
exports.getLoggedInUserProfile = async (req, res) => {
    // 1. RECUPERO ID
    // L'ID utente viene fornito dal Middleware 'protect' in req.userId.
    const userId = req.user.id; 

    try {
        // 2. DELEGA
        const profile = await userService.getProfileById(userId);

        // 3. GESTIONE RISPOSTA
        if (!profile) {
            // Se, teoricamente, l'utente non esiste più nel DB (ma il token è valido)
            return res.status(404).json({ message: "Utente non trovato." });
        }
        
        return res.status(200).json(profile);
    } catch (error) {
        console.error("Errore nel recupero del profilo:", error.message);
        return res.status(500).json({ message: "Errore interno del server." });
    }
};

/**
 * PUT /api/utente/me
 * Aggiorna i dati del profilo utente.
 */
exports.updateLoggedInUserProfile = async (req, res) => {
    // 1. RECUPERO ID E DATI
    const userId = req.user.id;
    const updateData = req.body; // Contiene i campi da aggiornare (es. full_name, new_password, old_password)
    const {role, ...updateDataClean} = updateData
    // 2. VALIDAZIONE BASE
    // Aggiungere qui una logica per verificare che i campi siano validi prima di passare al Service.
    // Esempio: Se è fornita new_password, DEVE essere fornita anche old_password.

    try {
        // 3. DELEGA
        const updatedProfile = await userService.updateUser(userId, updateDataClean);

        // 4. GESTIONE RISPOSTA
        return res.status(200).json({ 
            message: "Profilo aggiornato con successo.",
            data: updatedProfile
        });

    } catch (error) {
        // Cattura errori specifici dal Service (es. password vecchia errata, email già in uso)
        let statusCode = 500;
        if (error.message.includes("Password non corretta")) {
            statusCode = 403; // Forbidden
        } else if (error.message.includes("Email già in uso")) {
             statusCode = 400; // Bad Request
        }

        console.error("Errore nell'aggiornamento del profilo:", error.message);
        return res.status(statusCode).json({ message: error.message });
    }
};