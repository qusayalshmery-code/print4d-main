/* ============================================
   مطبعة البُعد الرابع - السكريبت الرئيسي
   الإصدار: 1.0
   ============================================ */

// === تحميل الإعدادات ===
async function loadConfig() {
  try {
    const response = await fetch('data/config.json');
    return await response.json();
  } catch (error) {
    console.error('خطأ في تحميل الإعدادات:', error);
    return null;
  }
}

// === تحميل العروض ===
function isOfferValid(offer) {
  if (!offer.active) return false;
  const now = new Date();
  if (offer.validFrom && new Date(offer.validFrom) > now) return false;
  if (offer.validUntil && new Date(offer.validUntil) < now) return false;
  if (offer.endDate && new Date(offer.endDate) < now) return false;
  return true;
}

async function loadOffers() {
  try {
    const response = await fetch('data/offers.json');
    const data = await response.json();
    return data.offers || [];
  } catch (error) {
    console.error('خطأ في تحميل العروض:', error);
    return [];
  }
}

// === بناء الهيدر ===
function buildHeader(config) {
  const logoIcon = config.site.logo?.text || '4D';
  return `
    <header class="header">
      <div class="header-inner">
        <a href="index.html" class="logo">
          <div class="logo-icon">${logoIcon}</div>
          <div class="logo-text">
            <span class="logo-main">${config.site.name}</span>
          </div>
        </a>
        <nav class="nav">
          <a href="#services">خدماتنا</a>
          <a href="#offers">العروض</a>
          <a href="#quick">الوصول السريع</a>
          <a href="#gallery">أعمالنا</a>
          <a href="#about">مين احنا</a>
          <a href="https://wa.me/${config.site.whatsapp}" class="btn btn-primary" style="padding: 10px 20px; font-size: 14px;">تواصل</a>
        </nav>
      </div>
    </header>
  `;
}

// === بناء الهيرو ===
function buildHero(config) {
  const hero = config.hero;
  return `
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">${hero.title}</h1>
        <p class="hero-subtitle">${hero.subtitle}</p>
        <div class="hero-buttons">
          <a href="https://wa.me/${config.site.whatsapp}" class="btn btn-primary">📱 تواصل عبر واتساب</a>
          <a href="#services" class="btn btn-secondary">خدماتنا</a>
        </div>
      </div>
    </section>
  `;
}

// === بناء قسم العروض (Slider) ===
function buildOffersSection(offers, config) {
  if (!config.sections.offers.enabled) return '';
  const validOffers = offers.filter(isOfferValid);
  if (validOffers.length === 0) return '';
  
  const slides = validOffers.map((offer, i) => {
    const productLink = offer.autoApply && offer.couponCode
      ? `${offer.productLink}?coupon=${offer.couponCode}`
      : offer.productLink;
    return `
    <div class="offer-slide" data-index="${i}" data-offer-id="${offer.id}">
      <div class="offer-slide-image" onclick="openOfferModal(${offer.id})" style="cursor:pointer">
        <img src="${offer.image}" alt="${offer.title}" loading="lazy">
        <span class="offer-slide-badge">خصم ${offer.discount}</span>
      </div>
      <div class="offer-slide-body">
        <h3 class="offer-slide-title">${offer.title}</h3>
        <p class="offer-slide-desc">${offer.description}</p>
        <div class="offer-slide-prices">
          <span class="offer-slide-old">${offer.oldPrice} ${offer.currency}</span>
          <span class="offer-slide-new">${offer.newPrice} ${offer.currency}</span>
        </div>
        <a href="${productLink}" class="offer-slide-btn" target="_blank">اطلب الآن</a>
      </div>
    </div>
  `;
  }).join('');
  
  const dots = validOffers.map((_, i) => `
    <span class="offer-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>
  `).join('');
  
  return `
    <section class="section offers-section" id="offers">
      <div class="container">
        <h2 class="offers-main-title">عروض لا تفوتها</h2>
        <div class="offers-slider-wrap">
          <div class="offers-slider">
            <div class="offers-track">
              <div class="offers-slides" id="offersSlides">
                ${slides}
              </div>
            </div>
          </div>
          <div class="offers-nav">
            <button class="offers-arrow" onclick="prevOffer()">❮</button>
            <div class="offers-dots">${dots}</div>
            <button class="offers-arrow" onclick="nextOffer()">❯</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// === بناء قسم الخدمات ===
function buildServicesSection(config) {
  if (!config.sections.services.enabled) return '';
  
  const services = config.sections.services.items.map(service => `
    <div class="service-card" style="--service-color: ${service.color}" onclick="navigateTo('${service.link}')">
      <span class="service-icon">${service.icon}</span>
      <h3 class="service-title">${service.title}</h3>
      <p class="service-description">${service.description}</p>
      <span class="service-link">استكشف ←</span>
    </div>
  `).join('');
  
  return `
    <section class="section services-section" id="services">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${config.sections.services.title}</h2>
          <p class="section-subtitle">${config.sections.services.subtitle}</p>
        </div>
        <div class="services-grid">
          ${services}
        </div>
      </div>
    </section>
  `;
}

// === بناء قسم الوصول السريع ===
function buildQuickAccessSection(config) {
  if (!config.sections.quickAccess.enabled) return '';
  
  const items = config.sections.quickAccess.items || [];
  
  if (items.length === 0) {
    return `
      <section class="section quick-section" id="quick">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">${config.sections.quickAccess.title}</h2>
            <p class="section-subtitle">${config.sections.quickAccess.subtitle}</p>
          </div>
          <div class="quick-empty">
            <div class="quick-empty-icon">⚡</div>
            <p class="quick-empty-text">قسم الوصول السريع جاهز</p>
            <p class="quick-empty-hint">سيتم إضافة الخدمات هنا من لوحة التحكم أو يدوياً</p>
          </div>
        </div>
      </section>
    `;
  }
  
  const buttons = items.map(item => `
    <a href="${item.link}" class="quick-btn">
      <span class="quick-btn-icon">${item.icon || '⚡'}</span>
      <span>${item.title}</span>
    </a>
  `).join('');
  
  return `
    <section class="section quick-section" id="quick">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${config.sections.quickAccess.title}</h2>
          <p class="section-subtitle">${config.sections.quickAccess.subtitle}</p>
        </div>
        <div class="quick-grid">
          ${buttons}
        </div>
      </div>
    </section>
  `;
}

// === بناء معرض الأعمال ===
function buildGallerySection(config) {
  if (!config.sections.gallery.enabled) return '';
  
  const items = config.sections.gallery.items.map(item => `
    <div class="gallery-item" data-title="${item.title}">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
    </div>
  `).join('');
  
  return `
    <section class="section gallery-section" id="gallery">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${config.sections.gallery.title}</h2>
          <p class="section-subtitle">${config.sections.gallery.subtitle}</p>
        </div>
        <div class="gallery-grid">
          ${items}
        </div>
      </div>
    </section>
  `;
}

// === بناء قسم "مين احنا" ===
function buildAboutSection(config) {
  if (!config.sections.about.enabled) return '';
  
  const features = config.sections.about.features.map(f => `
    <div class="about-feature">${f}</div>
  `).join('');
  
  return `
    <section class="section about-section" id="about">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${config.sections.about.title}</h2>
        </div>
        <div class="about-content">
          <div class="about-text">
            <p>${config.sections.about.description}</p>
            <div class="about-features">
              ${features}
            </div>
          </div>
          <div class="about-contact">
            <span class="about-contact-icon">📱</span>
            <h4>تواصل معنا الآن</h4>
            <p>${config.site.location}</p>
            <div class="about-contact-number">${config.site.phone}</div>
            <a href="https://wa.me/${config.site.whatsapp}" class="btn btn-secondary" style="background: white; color: var(--secondary); border: none;">
              راسلنا على واتساب
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

// === بناء الفوتر ===
function buildFooter(config) {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>${config.site.name}</h4>
            <p style="color: var(--text-muted); font-size: 14px; line-height: 1.7;">
              ${config.site.description}
            </p>
          </div>
          <div class="footer-section">
            <h4>روابط سريعة</h4>
            <a href="#services">خدماتنا</a>
            <a href="#offers">العروض</a>
            <a href="#gallery">أعمالنا</a>
            <a href="#about">مين احنا</a>
          </div>
          <div class="footer-section">
            <h4>تواصل</h4>
            <a href="https://wa.me/${config.site.whatsapp}">واتساب: ${config.site.phone}</a>
            <a href="mailto:${config.site.email}">${config.site.email}</a>
            <a href="#">${config.site.location}</a>
          </div>
        </div>
        <div class="footer-bottom">
          © ${new Date().getFullYear()} ${config.site.name} - جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  `;
}

// === Modal/Popup (مدمج هنا) ===
// تم حذف popup نهائياً
// === Slider للعروض ===
let currentOfferIndex = 0;
let offersAutoInterval = null;

function goToOffer(index) {
  const slides = document.getElementById('offersSlides');
  if (!slides) return;
  const totalSlides = slides.children.length;
  if (totalSlides === 0) return;
  
  currentOfferIndex = (index + totalSlides) % totalSlides;
  slides.style.transform = `translateX(${currentOfferIndex * 100}%)`;
  
  document.querySelectorAll('.offer-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentOfferIndex);
  });
}

function nextOffer() {
  goToOffer(currentOfferIndex + 1);
  resetAutoRotate();
}

function prevOffer() {
  goToOffer(currentOfferIndex - 1);
  resetAutoRotate();
}

function startAutoRotate(interval) {
  if (offersAutoInterval) clearInterval(offersAutoInterval);
  offersAutoInterval = setInterval(() => goToOffer(currentOfferIndex + 1), interval);
}

function resetAutoRotate() {
  const config = window._appConfig;
  if (config && config.sections.offers.autoRotate) {
    startAutoRotate(config.sections.offers.rotateInterval || 5000);
  }
}

// === التنقل ===
function navigateTo(url) {
  if (url && url !== '#') {
    window.location.href = url;
  }
}

// === التشغيل الرئيسي ===
async function init() {
  const config = await loadConfig();
  if (!config) {
    document.body.innerHTML = '<div style="text-align: center; padding: 100px; color: white;">خطأ في تحميل الموقع. يرجى تحديث الصفحة.</div>';
    return;
  }
  
  window._appConfig = config;
  
  const offers = await loadOffers();
  window._allOffers = offers;
  // تجميع المحتوى
  const app = document.getElementById('app');
  app.innerHTML = `
    ${buildHeader(config)}
    ${buildHero(config)}
    ${buildOffersSection(offers, config)}
    ${buildServicesSection(config)}
    ${buildQuickAccessSection(config)}
    ${buildGallerySection(config)}
    ${buildAboutSection(config)}
    ${buildFooter(config)}
  `;
  
  // تشغيل الـ slider التلقائي
  if (config.sections.offers.enabled && config.sections.offers.autoRotate) {
    startAutoRotate(config.sections.offers.rotateInterval || 5000);
  }
  

  
  // ربط النقر على النقاط
  document.querySelectorAll('.offer-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      goToOffer(index);
      resetAutoRotate();
    });
  });

  // Event delegation: فتح الـ popup عند الضغط على البطاقة
  document.addEventListener('click', function(e) {
    // تجاهل الضغط على زر "اطلب الآن" (يفتح رابط)
    if (e.target.closest('.offer-slide-btn')) return;
    
    const slide = e.target.closest('.offer-slide');
    if (slide && slide.dataset.offerId) {
      e.preventDefault();
      e.stopPropagation();
      openOfferModal(parseInt(slide.dataset.offerId));
    }
  });
}



// === Popup (دالة موحدة في main.js) ===
function copyCouponCode(code, btn) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      const old = btn.innerHTML;
      btn.innerHTML = '✅ تم!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = old;
        btn.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.innerHTML = '✅ تم!';
      setTimeout(() => btn.innerHTML = '📋 نسخ', 2000);
    });
  }
}

function openOfferModal(offerId) {
  if (!window._allOffers) return;
  const offer = window._allOffers.find(function(o) { return o.id === offerId; });
  if (!offer) return;
  
  // حذف popup قديم
  const old = document.getElementById('offerPopup');
  if (old) old.remove();
  
  // بناء HTML بدون template literals معقدة
  const productUrl = (offer.autoApply && offer.couponCode)
    ? offer.productLink + '?coupon=' + offer.couponCode
    : offer.productLink;
  
  const whatsappText = encodeURIComponent('استفسر عن: ' + offer.title + (offer.couponCode ? ' (كود: ' + offer.couponCode + ')' : ''));
  
  const badgeColor = offer.typeColor || '#e94560';
  const badgeLabel = offer.typeLabel || 'عرض';
  
  let couponHTML = '';
  if (offer.couponCode) {
    couponHTML = '<div class="p-coupon"><span>الكود:</span><strong>' + offer.couponCode + '</strong><button class="p-copy-btn" type="button">📋 نسخ</button></div>';
  }
  
  const html = '<div class="p-bg"></div>'
    + '<div class="p-box">'
    + '<button class="p-close" type="button">×</button>'
    + '<div class="p-img-wrap"><img class="p-img" src="' + offer.image + '" alt="' + offer.title + '"></div>'
    + '<div class="p-body">'
    + '<span class="p-badge" style="background:' + badgeColor + '">' + badgeLabel + '</span>'
    + '<h2 class="p-title">' + offer.title + '</h2>'
    + '<p class="p-desc">' + offer.description + '</p>'
    + '<div class="p-prices">'
    + '<span class="p-old">' + offer.oldPrice + ' ' + offer.currency + '</span>'
    + '<span class="p-new">' + offer.newPrice + ' ' + offer.currency + '</span>'
    + '<span class="p-disc">خصم ' + offer.discount + '</span>'
    + '</div>'
    + couponHTML
    + '<div class="p-btns">'
    + '<a href="' + productUrl + '" class="p-btn p-btn-primary" target="_blank">🛒 صفحة المنتج</a>'
    + '<a href="https://wa.me/9647811409030?text=' + whatsappText + '" class="p-btn p-btn-outline" target="_blank">💬 واتساب</a>'
    + '</div>'
    + '</div>'
    + '</div>';
  
  const popup = document.createElement('div');
  popup.id = 'offerPopup';
  popup.className = 'p-modal';
  popup.innerHTML = html;
  
  document.body.appendChild(popup);
  document.body.style.overflow = 'hidden';
  
  // ربط أحداث الإغلاق
  const bg = popup.querySelector('.p-bg');
  const closeBtn = popup.querySelector('.p-close');
  if (bg) bg.onclick = closeOfferModal;
  if (closeBtn) closeBtn.onclick = closeOfferModal;
  
  // ربط زر نسخ الكود
  const copyBtn = popup.querySelector('.p-copy-btn');
  if (copyBtn && offer.couponCode) {
    copyBtn.onclick = function() { copyCouponCode(offer.couponCode, this); };
  }
}

function closeOfferModal() {
  const popup = document.getElementById('offerPopup');
  if (popup) popup.remove();
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeOfferModal();
});

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', init);
