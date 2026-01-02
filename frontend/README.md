# Frontend – MentorMatch

> Piattaforma web per il matching tra Mentor e Mentee, con ricerca avanzata, autenticazione, gestione profilo utente e interfaccia responsive. 

---

## Indice
- [Stack Tecnologico](#stack-tecnologico)
- [Architettura Frontend](#architettura-frontend)
- [Funzionalità Principali](#funzionalità-principali)
- [Dettagli Tecnici](#dettagli-tecnici)
- [Testing](#testing)
- [Licenza](#-licenza)

---

## Stack Tecnologico

| Tecnologia     | Versione | Scopo |
|---------------|----------|-------|
| **HTML5**     | –        | Struttura semantica del sito |
| **CSS3**      | –        | Styling personalizzato |
| **Bootstrap** | 5.3.5    | Framework UI e grid system |
| **JavaScript**| ES6+     | Logica client-side |
| **jQuery**    | –        | Caricamento dinamico componenti (header/footer) |

---

## Architettura Frontend

```text
frontend/
├── auth/                           # Sistema di autenticazione
│   └── autenticazione.html         # Pagina unificata Login/Registrazione
│
├── common/                         # Componenti riutilizzabili
│   ├── header.html                 # Navbar con icona Account e Status API
│   └── footer.html                 # Footer statico con link utili
│
├── css/
│   └── style.css                   # Stili globali e personalizzazioni UI
│
├── images/
│   └── favicon.png                 # Icona del sito
│
├── js/
│   └── headerfooterloader.js       # Caricamento dinamico Header/Footer via jQuery
│
├── legal/                          # Pagine legali (GDPR, ToS)
│   ├── privacy.html
│   └── tos.html                    # Placeholder per privacy/tos se necessario
│
├── dashboard_router.html           # Router verso la dashboard corretta
├── mentee_dashboard.html           # Dashboard Mentee
├── mentor_dashboard.html           # Dashboard Mentor
├── mentor_availability.html        # Gestione disponibilità Mentor
│
├── profile.html                    # Gestione profilo utente (Mentor / Mentee)
│
├── mentor.html                     # Ricerca Mentor + filtri competenze
│
├── index.html                      # Homepage
├── robots.txt                      # Istruzioni SEO
├── status.html                     # Stato API e diagnostica
│
├── package.json                    # Configurazione npm frontend
└── README.md                       # Documentazione del progetto
```
---

## Funzionalità Principali

## 🔐 Sistema di Autenticazione

---

### Pagina unica per login e registrazione
- Validazione campi (email, password)
- UI responsiva e semplice
- Gestione redirect dopo login (alla pagina account)
- L’integrazione con il backend avverrà tramite endpoint REST forniti dal team backend


---

### 🔍 Ricerca Mentor (`mentor.html`)

- **Filtri dinamici**:
  - Categoria / Skill
  - Area di competenza (es: Software Development, Data Analytics…)
  - Livello esperienza (Junior, Intermedio, Senior)
- Layout a card responsive
- Script JavaScript pronto per effettuare request alle API del backend

---
### 👤 Area Utente (Dashboard)

- Visualizzazione e modifica informazioni personali
- Gestione password
- Logout sicuro
- Token utente gestito via localStorage
- Dashboard differenziate per Mentor e Mentee (visualizzazioni sessioni , gestione e visualizzaione link meeting)

---

### 🧩 Componenti Comuni

- **Header dinamico con**:
  - Icona Account
  - Icona API Status
  - Navigazione
  - Notifiche
- **Footer standard comune a tutte le pagine**
- Caricamento automatico con jQuery → `headerfooterloader.js`

---

## Dettagli Tecnici

### Caricamento dinamico componenti
```javascript
// Caricamento automatico header/footer
headerfooterloader.js // jQuery-based component loading
```
---

### Gestione Stato Frontend

- LocalStorage per memorizzare sessione utente
- Placeholder funzioni per login, registrazione, ricerca mentor
- Codice pronto per integrazione futura con API REST
- Controllo accesso alle pagine riservate (dashboard, profilo, disponibilità)
- Ridirect automatico per utenti non autenticati
---

### Sicurezza lato client

- Validazione input HTML5
- Blocco campi vuoti nel login/registrazione
- Struttura pronta per inserimento token JWT (a seguito di endpoint backend)

---

## Testing

### Test Manuali
| Scenario | Pagina | Input | Output Atteso |
|----------|--------|-------|---------------|
|Login corretto	|`autenticazione.html` |	email/password validi|	Redirect a `account.html`|
|Login errato |	`autenticazione.html `|	password sbagliata	|Mostra messaggio errore|
|Ricerca mentor	|`mentor.html`|	Skill + livello	|Mostra lista mentor filtrati|
|Filtri vuoti | `mentor.html`|	Nessun filtro|	Mostra tutti i mentor disponibili|
| Apertura dashboard | `dashboard_router.html` | Utente loggato | Redirect a dashboard Mentor/Mentee |
| Apertura dashboard senza login | `dashboard_router.html` | Nessun token | Redirect a `autenticazione.html` |


## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT (o quello che volete voi). Consulta il file LICENSE per maggiori dettagli.
