
const userService = require('../services/UserService');

exports.getLoggedInUserProfile = async (req, res) => {
    
    const userId = req.user.id; 

    try {
       
        const profile = await userService.getUserById(userId);

        if (!profile) {
           
            return res.status(404).json({ message: "Utente non trovato." });
        }
        
        return res.status(200).json(profile);
    } catch (error) {
        console.error("Errore nel recupero del profilo:", error.message);
        return res.status(500).json({ message: "Errore interno del server." });
    }
};


exports.updateLoggedInUserProfile = async (req, res) => {
    
    const userId = req.user.id;
    const updateData = req.body; 
    const {role, ...updateDataClean} = updateData

    try {
        
        const updatedProfile = await userService.updateUser(userId, updateDataClean);

        
        return res.status(200).json({ 
            message: "Profilo aggiornato con successo.",
            data: updatedProfile
        });

    } catch (error) {
        
        if (error.message.includes("Password non corretta")) {
            statusCode = 403;
        } else if (error.message.includes("Email già in uso")) {
             statusCode = 400;
        }

        console.error("Errore nell'aggiornamento del profilo:", error.message);
        return res.status(statusCode).json({ message: error.message });
    }
};


