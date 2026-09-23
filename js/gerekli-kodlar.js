document.addEventListener("DOMContentLoaded", async function () {

    const path = window.location.pathname;

    // Sayfa kök dizinde mi yoksa anasayfalar/icerik klasöründe mi?
    const isRoot =
        !path.includes("/anasayfalar/") &&
        !path.includes("/icerik/");

    const prefix = isRoot ? "./" : "../";

    // Header ve Footer Yolları
    const headerPath = `${prefix}community/header.html`;
    const footerPath = `${prefix}community/footer.html`;

    // JSON Veri Dosyalarının Yolları
    const jsonSources = {
        bulut: `${prefix}json/bulut&devops.json`,
        b2b: `${prefix}json/B2B&veri_yonetimi.json`,
        ai: `${prefix}json/AI&veri_analitigi.json`
    };

    // Header Yükle
    const headerElement = document.getElementById("site-header");
    if (headerElement) {
        fetch(headerPath)
            .then(r => r.text())
            .then(html => {
                headerElement.innerHTML = html;
                setupMobileMenu();
            })
            .catch(err => console.error("Header yüklenemedi:", err));
    }

    // Footer Yükle
    const footerElement = document.getElementById("site-footer");
    if (footerElement) {
        fetch(footerPath)
            .then(r => r.text())
            .then(html => {
                footerElement.innerHTML = html;
            })
            .catch(err => console.error("Footer yüklenemedi:", err));
    }

    // --- ANASAYFA DİNAMİK İÇERİK DOLDURMA ---
    if (document.getElementById("hero-main") || document.getElementById("container-son-analizler")) {
        try {
            const [bulutData, b2bData, aiData] = await Promise.all([
                fetchData(jsonSources.bulut),
                fetchData(jsonSources.b2b),
                fetchData(jsonSources.ai)
            ]);

            // TAREK DİZİLERİNİ KENDİ İÇİNDE DE EN YENİDEN EN ESKİYE SIRALA (BÜYÜKTEN KÜÇÜĞE)
            const sortedBulut = [...bulutData].sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime());
            const sortedB2b = [...b2bData].sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime());
            const sortedAi = [...aiData].sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime());

            // TÜM VERİLERİ BİRLEŞTİR VE EN YENİDEN EN ESKİYE SIRALA
            const allDataCombined = [...sortedBulut, ...sortedB2b, ...sortedAi].sort(
                (a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime()
            );

            // 1. Manşet Vitrini (Tüm Kategorilerin En Yeni İlk 3 İçeriği)
            if (allDataCombined.length >= 3) {
                renderHeroMain("hero-main", allDataCombined[0]);
                renderHeroSub("hero-sub-1", allDataCombined[1]);
                renderHeroSub("hero-sub-2", allDataCombined[2]);
            }

            // 2. Alan 1: Son Analizler (En Yeni 5 İçerik)
            renderArticleList("container-son-analizler", allDataCombined.slice(0, 5));

            // 3. Alan 2: Bulut Altyapı & DevOps (En Yeni 5 İçerik)
            renderArticleList("container-bulut-devops", sortedBulut.slice(0, 5));

            // 4. Alan 3: B2B Siber Güvenlik (En Yeni 5 İçerik)
            renderArticleList("container-b2b-guvenlik", sortedB2b.slice(0, 5));

            // 5. Alan 4: Yapay Zeka & Veri Analitiği (En Yeni 5 İçerik)
            renderArticleList("container-ai-analitik", sortedAi.slice(0, 5));

        } catch (error) {
            console.error("İçerikler yüklenirken hata oluştu:", error);
        }
    }
});

/* Tarihi "X ay önce", "az önce" Gibi İfadelere Dönüştüren Fonksiyon */
function timeAgo(dateString) {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "az önce";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} dk önce`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} saat önce`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} gün önce`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} ay önce`;

    const years = Math.floor(months / 12);
    return `${years} yıl önce`;
}

/* Mobil Menü Kurulumu */
function setupMobileMenu() {
    const menuBtn =
        document.getElementById("mobile-menu-btn") ||
        document.querySelector(".md\\:hidden button");

    const mobileMenu = document.getElementById("mobile-menu");

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }
}

/* JSON Çekme Yardımcısı */
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`JSON dosyası bulunamadı (${response.status}): ${url}`);
            return [];
        }
        return await response.json();
    } catch (err) {
        console.error(`Fetch Hatası (${url}):`, err);
        return [];
    }
}

/* Büyük Manşet */
function renderHeroMain(containerId, item) {
    const el = document.getElementById(containerId);
    if (!el || !item) return;
    el.innerHTML = `
        <img src="${item.resim}" alt="${item.baslik}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80">
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 flex flex-col justify-end">
            <div class="flex items-center space-x-2 mb-3">
                <span class="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded w-fit">${item.kategori}</span>
                <span class="text-gray-300 text-[11px] font-medium"><i class="far fa-clock mr-1"></i>${timeAgo(item.tarih)}</span>
            </div>
            <h1 class="text-2xl font-black text-white leading-snug hover:underline">
                <a href="${item.link}">${item.baslik}</a>
            </h1>
            <p class="text-gray-300 text-xs mt-2 line-clamp-2">${item.ozet}</p>
        </div>
    `;
}

/* Küçük Manşet */
function renderHeroSub(containerId, item) {
    const el = document.getElementById(containerId);
    if (!el || !item) return;
    el.innerHTML = `
        <img src="${item.resim}" alt="${item.baslik}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-75">
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
            <div class="flex items-center space-x-2 mb-1.5">
                <span class="bg-blue-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded w-fit">${item.kategori}</span>
                <span class="text-gray-300 text-[10px]"><i class="far fa-clock mr-1"></i>${timeAgo(item.tarih)}</span>
            </div>
            <h2 class="text-sm font-bold text-white line-clamp-2 hover:underline">
                <a href="${item.link}">${item.baslik}</a>
            </h2>
        </div>
    `;
}

/* Liste İçerik Kartları */
function renderArticleList(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container || !items || items.length === 0) return;

    container.innerHTML = items.map(item => `
        <div class="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col sm:flex-row border border-gray-100 hover:shadow-md transition">
            <div class="sm:w-48 h-40 sm:h-auto relative flex-shrink-0">
                <img src="${item.resim}" alt="${item.baslik}" class="w-full h-full object-cover">
            </div>
            <div class="p-4 flex flex-col justify-between flex-grow">
                <div>
                    <div class="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
                        <span class="font-bold text-gray-600 uppercase tracking-wide">${item.kategori}</span>
                        <span><i class="far fa-clock mr-1"></i>${timeAgo(item.tarih)}</span>
                    </div>
                    <h3 class="text-base font-bold text-gray-900 leading-snug hover:text-red-600 transition">
                        <a href="${item.link}">${item.baslik}</a>
                    </h3>
                    <p class="text-gray-500 text-xs mt-2 line-clamp-2">${item.ozet}</p>
                </div>
                <div class="mt-3 flex items-center justify-end pt-2 border-t border-gray-50">
                    <a href="${item.link}" class="text-xs font-bold text-red-600 hover:underline">Devamını Oku <i class="fas fa-chevron-right text-[9px]"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}