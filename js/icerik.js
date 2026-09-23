document.addEventListener("DOMContentLoaded", function () {
    // 2 klasör derindeki (web/icerik/Kategori_Ismi/Sayfa.html) dosyalar için kök dizin yolu
    const prefix = "../../";

    const headerPath = `${prefix}community/icerik_healder.html`;
    const footerPath = `${prefix}community/footer.html`;

    // 1. HEADER YÜKLE
    const headerElement = document.getElementById("site-header");
    if (headerElement) {
        fetch(headerPath)
            .then(response => {
                if (!response.ok) throw new Error("Header yüklenemedi: " + response.statusText);
                return response.text();
            })
            .then(html => {
                headerElement.innerHTML = html;
                // Mobil menü butonu varsa çalıştırılması için fonksiyon
                setupMobileMenu();
            })
            .catch(err => console.error("Header Hatası:", err));
    }

    // 2. FOOTER YÜKLE
    const footerElement = document.getElementById("site-footer");
    if (footerElement) {
        fetch(footerPath)
            .then(response => {
                if (!response.ok) throw new Error("Footer yüklenemedi: " + response.statusText);
                return response.text();
            })
            .then(html => {
                footerElement.innerHTML = html;
            })
            .catch(err => console.error("Footer Hatası:", err));
    }

    // Mobil menü açma/kapatma işlevi (Header yüklendikten sonra tetiklenir)
    function setupMobileMenu() {
        const btn = document.getElementById("mobile-menu-btn");
        const menu = document.getElementById("mobile-menu");
        if (btn && menu) {
            btn.addEventListener("click", () => {
                menu.classList.toggle("hidden");
            });
        }
    }
});