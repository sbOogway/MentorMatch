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
    const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
    let userData = null;
    try {
      const raw = localStorage.getItem("userData") || sessionStorage.getItem("userData");
      userData = raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn("Errore nel parse di userData:", e);
    }

    // Utente NON loggato → account e sessioni portano alla login
    if (!token || !userData) {
      accountLink.setAttribute("href", "/auth/autenticazione.html");
      if (sessionsLink) {
        sessionsLink.setAttribute("href", "/auth/autenticazione.html");
      }
      return;
    }

    // Utente loggato → account porta alla dashboard corretta
    if (userData.role === "mentor") {
      accountLink.setAttribute("href", "/mentor_dashboard.html");
    } else {
      accountLink.setAttribute("href", "/mentee_dashboard.html");
    }

    // Sessioni → sempre al router (decide lui)
    if (sessionsLink) {
      if (userData.role === "mentor") {
        sessionsLink.setAttribute("href", "/mentor_dashboard.html");
      } else {
        sessionsLink.setAttribute("href", "/mentee_dashboard.html");
      }
    }

    const notifBtn = document.getElementById("notifBtn");
    const notifDropdown = document.getElementById("notifDropdown");
    const notifClose = document.getElementById("notifClose");
    const notifList = document.getElementById("notifList");
    const notifBadge = document.getElementById("notifBadge");

    function toggleNotif(open) {
      if (!notifDropdown) return;
      notifDropdown.classList.toggle("d-none", !open);
    }

    async function loadNotificationsUI() {
      if (!notifList) return;

      
      notifList.innerHTML = `<p class="text-muted mb-0">Le notifiche vengono inviate via email dal backend.</p>`;

      if (notifBadge) notifBadge.classList.add("d-none");

      try {
        const res = await fetch(`/api/notifications/my`, {
          headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) return;

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          notifList.innerHTML = `<p class="text-muted mb-0">Nessuna notifica.</p>`;
          return;
        }

        notifList.innerHTML = "";
        let unread = 0;

        data.forEach((n) => {
          if (n.read === false) unread++;
          const div = document.createElement("div");
          div.className = "border rounded p-2 mb-2";
          div.innerHTML = `
            <div class="fw-semibold">${n.title || "Notifica"}</div>
            <div class="text-muted small">${n.message || ""}</div>
            <div class="text-muted small">
              ${n.created_at ? new Date(n.created_at).toLocaleString() : ""}
            </div>
          `;
          notifList.appendChild(div);
        });

        if (notifBadge && unread > 0) {
          notifBadge.textContent = unread;
          notifBadge.classList.remove("d-none");
        }
      } catch (e) {
      }
    }

    if (notifBtn) {
      notifBtn.addEventListener("click", async () => {
        const isOpen =
          notifDropdown && !notifDropdown.classList.contains("d-none");
        toggleNotif(!isOpen);
        if (!isOpen) await loadNotificationsUI();
      });
    }

    if (notifClose) {
      notifClose.addEventListener("click", () => toggleNotif(false));
    }

    document.addEventListener("click", (e) => {
      if (!notifDropdown || notifDropdown.classList.contains("d-none")) return;
      if (e.target.closest("#notifDropdown") || e.target.closest("#notifBtn"))
        return;
      toggleNotif(false);
    });
  });

  // FOOTER
  $("#footer-placeholder").load("common/footer.html");
});
