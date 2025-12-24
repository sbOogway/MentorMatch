/**
 * Inizializza header e footer della pagina
 */
$(function () {

    // HEADER
    $("#header-placeholder").load("common/header.html", function () {

        console.log("Header caricato");

        const accountLink = document.getElementById("account-link");
        const sessionsLink = document.getElementById("sessions-link");

        if (!accountLink) {
            console.error("Elemento #account-link non trovato nel header");
            return;
        }

        // Leggo dati utente
        const token = localStorage.getItem("sessionToken");
        let userData = null;
        try {
            const raw = localStorage.getItem("userData");
            userData = raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.warn("Errore nel parse di userData:", e);
        }

        // Utente NON loggato → account e sessioni portano alla login
        if (!token || !userData) {
            accountLink.setAttribute("href", "auth/autenticazione.html");
            if (sessionsLink) {
                sessionsLink.setAttribute("href", "auth/autenticazione.html");
            }
            return;
        }

        // Utente loggato → account porta alla dashboard corretta
        if (userData.role === "mentor") {
            accountLink.setAttribute("href", "mentor_dashboard.html");
        } else {
            accountLink.setAttribute("href", "mentee_dashboard.html");
        }

        // Sessioni → sempre al router (decide lui)
        if (sessionsLink) {
            sessionsLink.setAttribute("href", "dashboard_router.html");
        }
    });

    // FOOTER
    $("#footer-placeholder").load("common/footer.html");
});

