(function() {
    const depth = window.location.pathname.split('/').filter(p => p && p !== 'index.html').length - 1;
    const pathPrefix = depth > 0 ? '../'.repeat(depth) : '';

    const cookieBannerHTML = `
        <div id="cookie-banner" class="cookie-banner">
            <div class="container d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div class="mb-2 mb-md-0 small">
                    Utilizziamo solo cookie essenziali per il funzionamento del sito. Consulta la nostra
                    <a href="${pathPrefix}legal/privacy.html" class="link-dark text-decoration-underline">Privacy Policy</a> e
                    <a href="${pathPrefix}legal/tos.html" class="link-dark text-decoration-underline">Termini di Servizio</a>.
                </div>
                <div class="d-flex align-items-center">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="essentialCookies" checked disabled>
                        <label class="form-check-label small" for="essentialCookies">Essenziali</label>
                    </div>
                    <div class="form-check form-check-inline ms-2">
                        <input class="form-check-input" type="checkbox" id="analyticsCookies" disabled>
                        <label class="form-check-label small" for="analyticsCookies">Analitici</label>
                    </div>
                    <div class="form-check form-check-inline ms-2">
                        <input class="form-check-input" type="checkbox" id="marketingCookies" disabled>
                        <label class="form-check-label small" for="marketingCookies">Marketing</label>
                    </div>
                    <button id="rejectCookies" class="btn btn-secondary btn-sm ms-3">Rifiuta</button>
                    <button id="acceptCookies" class="btn btn-dark btn-sm ms-2">Accetta</button>
                </div>
            </div>
        </div>
    `;

    function initCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('acceptCookies');
        const rejectBtn = document.getElementById('rejectCookies');

        if (!banner || !acceptBtn || !rejectBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => banner.classList.add('show'), 50);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('show');
            setTimeout(() => banner.style.display = 'none', 400);
        });

        rejectBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'false');
            banner.classList.remove('show');
            setTimeout(() => banner.style.display = 'none', 400);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.insertAdjacentHTML('beforeend', cookieBannerHTML);
            initCookieBanner();
        });
    } else {
        document.body.insertAdjacentHTML('beforeend', cookieBannerHTML);
        initCookieBanner();
    }
})();
