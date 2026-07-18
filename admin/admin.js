// === لوحة تحكم - JavaScript ===
// نقرأ البيانات من localStorage أولاً (إذا محفوظ)، وإذا مو موجودة نقرأ من JSON
const DEFAULT_CONFIG = {
  site: {
    name: "مطبعة البُعد الرابع",
    subtitle: "نطبع أحلامك بأحدث التقنيات",
    description: "مطبعة متكاملة في النجف الأشرف نقدم خدمات الطباعة والليزر والـ UV والأقمشة والكتب",
    location: "النجف الأشرف، العراق",
    whatsapp: "9647811409030",
    phone: "+9647811409030",
    email: "info@print4d.iq",
    logo: { type: "svg", text: "4D", subtext: "مطبعة" }
  },
  theme: {
    primary: "#0f0f23",
    secondary: "#e94560",
    accent: "#ffb380",
    gold: "#f5a623",
    offWhite: "#f8f6f1",
    text: "#1a1a2e",
    textLight: "#666"
  },
  hero: {
    type: "gradient",
    background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #2a1a3e 100%)",
    title: "مطبعة البُعد الرابع",
    subtitle: "نطبع أحلامك بأحدث التقنيات",
    cta1: { text: "تواصل معنا", action: "whatsapp" },
    cta2: { text: "خدماتنا", action: "scroll", target: "#services" }
  },
  sections: {
    services: {
      items: [
        { id: "books", title: "طباعة الكتب", description: "تأليف، طباعة، تجليد، إيداع، ISBN", icon: "📚", color: "#1a1a2e", link: "books.html" },
        { id: "paper", title: "طباعة الورقيات", description: "بزنس كارد، بوسترات، فولدرات، ستيكرات", icon: "📄", color: "#2a1a3e", link: "paper.html" },
        { id: "banners", title: "البنرات واللافتات", description: "فلكس، PVC، لوحات إعلانية", icon: "🪧", color: "#3a1a4e", link: "banners.html" },
        { id: "laser", title: "الليزر CNC", description: "قص وحفر رقمي على جميع الخامات", icon: "⚡", color: "#4a1a5e", link: "laser.html" },
        { id: "uv", title: "طباعة UV", description: "UV Flatbed و UV DTF على أي سطح", icon: "🖨️", color: "#5a1a6e", link: "uv.html" },
        { id: "fabric", title: "الأقمشة والأسطح", description: "تيشيرتات، أكياس، قبعات، موكيت", icon: "👕", color: "#6a1a7e", link: "fabric.html" },
        { id: "neon", title: "الإعلانات الضوئية والواجهات", description: "نيون، حروف مضيئة، واجهات زجاجية", icon: "💡", color: "#7a1a8e", link: "neon.html" },
        { id: "gifts", title: "الهدايا والمناسبات", description: "هدايا مخصصة، أطقم، تغليف فاخر", icon: "🎁", color: "#8a1a9e", link: "gifts.html" }
      ]
    },
    quickAccess: { items: [] },
    gallery: { items: [] },
    about: {
      title: "من نحن",
      description: "مطبعة البُعد الرابع - وجهتك الأولى للطباعة الاحترافية في النجف الأشرف.",
      features: ["✅ ميزة 1", "✅ ميزة 2"]
    }
  }
};

const DEFAULT_OFFERS = [
  {
    id: 1,
    type: "discount",
    typeLabel: "خصم فوري",
    typeColor: "#e94560",
    title: "عرض الأكواب الخاصة",
    description: "اطبع أكواب خاصة بكميات كبيرة بأسعار مخفضة.",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
    oldPrice: "5000",
    newPrice: "2500",
    currency: "د.ع",
    discount: "50%",
    productLink: "mugs.html",
    couponCode: "MUG50",
    autoApply: true,
    active: true,
    validFrom: "2026-07-15",
    validUntil: "2026-12-31"
  }
];

let currentConfig = null;
let currentOffers = null;

// === تحميل البيانات ===
function loadData() {
  console.log('🔄 loadData started');
  const savedConfig = localStorage.getItem('print4d_config');
  const savedOffers = localStorage.getItem('print4d_offers');
  
  if (savedConfig) {
    try {
      currentConfig = JSON.parse(savedConfig);
      console.log('✅ Loaded config from localStorage');
    } catch(e) {
      console.error('❌ Config parse error:', e);
      currentConfig = DEFAULT_CONFIG;
    }
  } else {
    currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    console.log('✅ Using DEFAULT_CONFIG');
  }
  
  if (savedOffers) {
    try {
      currentOffers = JSON.parse(savedOffers);
      console.log('✅ Loaded offers from localStorage');
    } catch(e) {
      console.error('❌ Offers parse error:', e);
      currentOffers = JSON.parse(JSON.stringify(DEFAULT_OFFERS));
    }
  } else {
    currentOffers = JSON.parse(JSON.stringify(DEFAULT_OFFERS));
    console.log('✅ Using DEFAULT_OFFERS');
  }
  
  // تأكد إن services.items موجود
  if (!currentConfig.sections || !currentConfig.sections.services || !currentConfig.sections.services.items) {
    console.warn('⚠️ Services items missing, fixing...');
    if (!currentConfig.sections) currentConfig.sections = {};
    if (!currentConfig.sections.services) currentConfig.sections.services = {};
    currentConfig.sections.services.items = JSON.parse(JSON.stringify(DEFAULT_CONFIG.sections.services.items));
  }
  
  console.log('📊 currentConfig.sections.services.items:', currentConfig.sections.services.items.length);
  console.log('📊 currentOffers:', currentOffers.length);
  
  populateForms();
  renderServices();
  renderOffers();
  renderQuickAccess();
  renderGallery();
  
  showToast('✅ تم تحميل البيانات', 'success');
}

// === ملء النماذج ===
function populateForms() {
  if (!currentConfig) return;
  
  // معلومات الموقع
  document.getElementById('site-name').value = currentConfig.site.name || '';
  document.getElementById('site-logo-text').value = currentConfig.site.logo?.text || '4D';
  document.getElementById('site-subtitle').value = currentConfig.site.subtitle || '';
  document.getElementById('site-description').value = currentConfig.site.description || '';
  document.getElementById('site-location').value = currentConfig.site.location || '';
  document.getElementById('site-whatsapp').value = currentConfig.site.whatsapp || '';
  document.getElementById('site-phone').value = currentConfig.site.phone || '';
  document.getElementById('site-email').value = currentConfig.site.email || '';
  
  // الهيرو
  document.getElementById('hero-type').value = currentConfig.hero.type || 'gradient';
  document.getElementById('hero-background').value = currentConfig.hero.background || '';
  document.getElementById('hero-image').value = currentConfig.hero.image || '';
  document.getElementById('hero-video').value = currentConfig.hero.video || '';
  document.getElementById('hero-solid-color').value = currentConfig.hero.solidColor || '#0f0f23';
  document.getElementById('hero-title').value = currentConfig.hero.title || '';
  document.getElementById('hero-subtitle').value = currentConfig.hero.subtitle || '';
  document.getElementById('hero-cta1-text').value = currentConfig.hero.cta1?.text || '';
  document.getElementById('hero-cta1-action').value = currentConfig.hero.cta1?.action || 'whatsapp';
  document.getElementById('hero-cta2-text').value = currentConfig.hero.cta2?.text || '';
  document.getElementById('hero-cta2-action').value = currentConfig.hero.cta2?.action || 'scroll';
  toggleHeroType();
  
  // من نحن
  document.getElementById('about-title').value = currentConfig.sections.about.title || '';
  document.getElementById('about-description').value = currentConfig.sections.about.description || '';
  document.getElementById('about-features').value = (currentConfig.sections.about.features || []).join('\n');
  
  // الستايل
  document.getElementById('theme-primary').value = currentConfig.theme.primary || '#0f0f23';
  document.getElementById('theme-secondary').value = currentConfig.theme.secondary || '#e94560';
  document.getElementById('theme-accent').value = currentConfig.theme.accent || '#ffb380';
  document.getElementById('theme-gold').value = currentConfig.theme.gold || '#f5a623';
}

// === عرض الأقسام ===
function renderServices() {
  const list = document.getElementById('services-list');
  if (!currentConfig) return;
  
  const services = currentConfig.sections.services.items || [];
  list.innerHTML = services.map((s, i) => `
    <div class="service-item">
      <div class="item-icon">${s.icon || '📦'}</div>
      <div class="item-info">
        <h4>${s.title}</h4>
        <p>${s.description || ''}</p>
      </div>
      <div class="item-actions">
        <label class="switch">
          <input type="checkbox" ${s.enabled !== false ? 'checked' : ''} onchange="toggleService(${i}, this.checked)">
          <span class="switch-slider"></span>
        </label>
        <button class="btn btn-sm btn-secondary" onclick="editService(${i})">تعديل</button>
      </div>
    </div>
  `).join('');
}

// === عرض العروض ===
function renderOffers() {
  const list = document.getElementById('offers-list');
  if (!currentOffers) return;
  
  if (currentOffers.length === 0) {
    list.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted); background:white; border-radius:12px; border:1px solid var(--border);">لا توجد عروض. اضغط "+ إضافة عرض جديد"</div>';
    return;
  }
  
  list.innerHTML = currentOffers.map((o, i) => `
    <div class="offer-item ${!o.active ? 'offer-inactive' : ''}">
      <img class="offer-thumb" src="${o.image || ''}" alt="${o.title}" onerror="this.style.background='var(--bg)'; this.style.display='flex'; this.alt='📦'">
      <div class="item-info">
        <h4>${o.title}</h4>
        <p>${o.newPrice} ${o.currency || 'د.ع'} <span style="text-decoration:line-through; color:#999;">${o.oldPrice}</span></p>
        <span class="offer-discount-badge">خصم ${o.discount}</span>
      </div>
      <div class="item-actions">
        <label class="switch">
          <input type="checkbox" ${o.active !== false ? 'checked' : ''} onchange="toggleOffer(${i}, this.checked)">
          <span class="switch-slider"></span>
        </label>
        <button class="btn btn-sm btn-secondary" onclick="editOffer(${i})">تعديل</button>
        <button class="btn btn-sm btn-danger" onclick="deleteOffer(${i})">حذف</button>
      </div>
    </div>
  `).join('');
}

// === عرض الوصول السريع ===
function renderQuickAccess() {
  const list = document.getElementById('quick-list');
  if (!currentConfig) return;
  
  const items = currentConfig.sections.quickAccess?.items || [];
  if (items.length === 0) {
    list.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted); background:white; border-radius:12px; border:1px solid var(--border);">لا توجد أزرار. اضغط "+ إضافة زر"</div>';
    return;
  }
  
  list.innerHTML = items.map((item, i) => `
    <div class="quick-item">
      <input class="quick-icon-input" type="text" value="${item.icon || '⚡'}" onchange="updateQuick(${i}, 'icon', this.value)">
      <div class="item-info">
        <input type="text" value="${item.title || ''}" onchange="updateQuick(${i}, 'title', this.value)" style="width:100%; padding:6px; border:1px solid var(--border); border-radius:6px; margin-bottom:4px;" placeholder="اسم الخدمة">
        <input type="text" value="${item.link || ''}" onchange="updateQuick(${i}, 'link', this.value)" dir="ltr" style="width:100%; padding:6px; border:1px solid var(--border); border-radius:6px; color:var(--text-muted); font-size:12px;" placeholder="mugs.html">
      </div>
      <button class="btn btn-sm btn-danger" onclick="deleteQuick(${i})">حذف</button>
    </div>
  `).join('');
}

// === عرض معرض الأعمال ===
function renderGallery() {
  const list = document.getElementById('gallery-list');
  if (!currentConfig) return;
  
  const items = currentConfig.sections.gallery?.items || [];
  if (items.length === 0) {
    list.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted); background:white; border-radius:12px; border:1px solid var(--border);">لا توجد صور. اضغط "+ إضافة صورة"</div>';
    return;
  }
  
  list.innerHTML = items.map((item, i) => `
    <div class="gallery-item">
      <img class="gallery-thumb" src="${item.image || ''}" alt="${item.title}" onerror="this.style.background='var(--bg)'; this.alt='🖼️'">
      <div class="item-info">
        <input type="text" value="${item.title || ''}" onchange="updateGallery(${i}, 'title', this.value)" style="width:100%; padding:6px; border:1px solid var(--border); border-radius:6px; margin-bottom:4px;" placeholder="عنوان العمل">
        <input type="url" value="${item.image || ''}" onchange="updateGallery(${i}, 'image', this.value)" dir="ltr" style="width:100%; padding:6px; border:1px solid var(--border); border-radius:6px; font-size:12px; color:var(--text-muted);" placeholder="https://رابط-الصورة.jpg">
      </div>
      <button class="btn btn-sm btn-danger" onclick="deleteGallery(${i})">حذف</button>
    </div>
  `).join('');
}

// === إدارة الخدمات ===
function toggleService(index, enabled) {
  currentConfig.sections.services.items[index].enabled = enabled;
}

function editService(index) {
  const service = currentConfig.sections.services.items[index];
  const newTitle = prompt('عنوان القسم:', service.title);
  if (newTitle === null) return;
  const newIcon = prompt('الأيقونة (إيموجي):', service.icon);
  if (newIcon === null) return;
  const newDesc = prompt('الوصف:', service.description);
  if (newDesc === null) return;
  
  currentConfig.sections.services.items[index].title = newTitle;
  currentConfig.sections.services.items[index].icon = newIcon;
  currentConfig.sections.services.items[index].description = newDesc;
  renderServices();
  showToast('✅ تم التعديل - اضغط حفظ التغييرات', 'warning');
}

// === إدارة العروض ===
function toggleOffer(index, active) {
  currentOffers[index].active = active;
  renderOffers();
}

function editOffer(index) {
  const offer = currentOffers[index];
  document.getElementById('offer-modal-title').textContent = 'تعديل العرض';
  document.getElementById('offer-id-input').value = index;
  document.getElementById('offer-title-input').value = offer.title || '';
  document.getElementById('offer-desc-input').value = offer.description || '';
  document.getElementById('offer-old-input').value = offer.oldPrice || '';
  document.getElementById('offer-new-input').value = offer.newPrice || '';
  document.getElementById('offer-currency-input').value = offer.currency || 'د.ع';
  document.getElementById('offer-discount-input').value = offer.discount || '';
  document.getElementById('offer-image-input').value = offer.image || '';
  document.getElementById('offer-product-input').value = offer.productLink || '';
  document.getElementById('offer-coupon-input').value = offer.couponCode || '';
  document.getElementById('offer-from-input').value = offer.validFrom || '';
  document.getElementById('offer-until-input').value = offer.validUntil || '';
  document.getElementById('offer-type-input').value = offer.type || 'discount';
  document.getElementById('offer-active-input').value = String(offer.active !== false);
  
  document.getElementById('offer-modal').classList.add('active');
}

function addNewOffer() {
  document.getElementById('offer-modal-title').textContent = 'إضافة عرض جديد';
  document.getElementById('offer-id-input').value = '';
  document.getElementById('offer-title-input').value = '';
  document.getElementById('offer-desc-input').value = '';
  document.getElementById('offer-old-input').value = '';
  document.getElementById('offer-new-input').value = '';
  document.getElementById('offer-currency-input').value = 'د.ع';
  document.getElementById('offer-discount-input').value = '';
  document.getElementById('offer-image-input').value = '';
  document.getElementById('offer-product-input').value = '';
  document.getElementById('offer-coupon-input').value = '';
  document.getElementById('offer-from-input').value = '';
  document.getElementById('offer-until-input').value = '';
  document.getElementById('offer-type-input').value = 'discount';
  document.getElementById('offer-active-input').value = 'true';
  
  document.getElementById('offer-modal').classList.add('active');
}

function saveOffer() {
  const id = document.getElementById('offer-id-input').value;
  const typeValue = document.getElementById('offer-type-input').value;
  const offer = {
    title: document.getElementById('offer-title-input').value,
    description: document.getElementById('offer-desc-input').value,
    oldPrice: document.getElementById('offer-old-input').value,
    newPrice: document.getElementById('offer-new-input').value,
    currency: document.getElementById('offer-currency-input').value,
    discount: document.getElementById('offer-discount-input').value,
    image: document.getElementById('offer-image-input').value,
    productLink: document.getElementById('offer-product-input').value,
    couponCode: document.getElementById('offer-coupon-input').value,
    validFrom: document.getElementById('offer-from-input').value,
    validUntil: document.getElementById('offer-until-input').value,
    type: typeValue,
    active: document.getElementById('offer-active-input').value === 'true',
    typeLabel: { discount: 'خصم فوري', coupon: 'كود خصم', bulk: 'عرض كمية', bundle: 'اشترِ واحصل' }[typeValue],
    typeColor: { discount: '#e94560', coupon: '#f5a623', bulk: '#ffb380', bundle: '#9b59b6' }[typeValue],
    autoApply: !!document.getElementById('offer-coupon-input').value
  };
  
  if (id === '') {
    offer.id = Date.now();
    currentOffers.push(offer);
  } else {
    offer.id = currentOffers[parseInt(id)].id;
    currentOffers[parseInt(id)] = offer;
  }
  
  closeOfferModal();
  renderOffers();
  showToast('✅ تم حفظ العرض محلياً - اضغط "حفظ التغييرات" لحفظ الكل', 'warning');
}

function deleteOffer(index) {
  if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return;
  currentOffers.splice(index, 1);
  renderOffers();
  showToast('🗑️ تم الحذف - اضغط حفظ التغييرات', 'warning');
}

function closeOfferModal() {
  document.getElementById('offer-modal').classList.remove('active');
}

// === إدارة الوصول السريع ===
function addQuickItem() {
  if (!currentConfig.sections.quickAccess) {
    currentConfig.sections.quickAccess = { items: [] };
  }
  if (!currentConfig.sections.quickAccess.items) {
    currentConfig.sections.quickAccess.items = [];
  }
  currentConfig.sections.quickAccess.items.push({
    icon: '⚡',
    title: 'خدمة جديدة',
    link: '#'
  });
  renderQuickAccess();
}

function updateQuick(index, field, value) {
  currentConfig.sections.quickAccess.items[index][field] = value;
}

function deleteQuick(index) {
  if (!confirm('حذف هذا الزر؟')) return;
  currentConfig.sections.quickAccess.items.splice(index, 1);
  renderQuickAccess();
}

// === إدارة معرض الأعمال ===
function addGalleryItem() {
  if (!currentConfig.sections.gallery) {
    currentConfig.sections.gallery = { items: [] };
  }
  if (!currentConfig.sections.gallery.items) {
    currentConfig.sections.gallery.items = [];
  }
  currentConfig.sections.gallery.items.push({
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600',
    title: 'عمل جديد'
  });
  renderGallery();
}

function updateGallery(index, field, value) {
  currentConfig.sections.gallery.items[index][field] = value;
  if (field === 'image') renderGallery();
}

function deleteGallery(index) {
  if (!confirm('حذف هذه الصورة؟')) return;
  currentConfig.sections.gallery.items.splice(index, 1);
  renderGallery();
}

// === جمع البيانات من النماذج ===
function collectData() {
  currentConfig.site.name = document.getElementById('site-name').value;
  currentConfig.site.logo.text = document.getElementById('site-logo-text').value;
  currentConfig.site.subtitle = document.getElementById('site-subtitle').value;
  currentConfig.site.description = document.getElementById('site-description').value;
  currentConfig.site.location = document.getElementById('site-location').value;
  currentConfig.site.whatsapp = document.getElementById('site-whatsapp').value;
  currentConfig.site.phone = document.getElementById('site-phone').value;
  currentConfig.site.email = document.getElementById('site-email').value;
  
  currentConfig.hero.type = document.getElementById('hero-type').value;
  currentConfig.hero.background = document.getElementById('hero-background').value;
  currentConfig.hero.image = document.getElementById('hero-image').value;
  currentConfig.hero.video = document.getElementById('hero-video').value;
  currentConfig.hero.solidColor = document.getElementById('hero-solid-color').value;
  currentConfig.hero.title = document.getElementById('hero-title').value;
  currentConfig.hero.subtitle = document.getElementById('hero-subtitle').value;
  currentConfig.hero.cta1.text = document.getElementById('hero-cta1-text').value;
  currentConfig.hero.cta1.action = document.getElementById('hero-cta1-action').value;
  currentConfig.hero.cta2.text = document.getElementById('hero-cta2-text').value;
  currentConfig.hero.cta2.action = document.getElementById('hero-cta2-action').value;
  
  currentConfig.sections.about.title = document.getElementById('about-title').value;
  currentConfig.sections.about.description = document.getElementById('about-description').value;
  currentConfig.sections.about.features = document.getElementById('about-features').value.split('\n').filter(f => f.trim());
  
  currentConfig.theme.primary = document.getElementById('theme-primary').value;
  currentConfig.theme.secondary = document.getElementById('theme-secondary').value;
  currentConfig.theme.accent = document.getElementById('theme-accent').value;
  currentConfig.theme.gold = document.getElementById('theme-gold').value;
}

// === الحفظ ===
function saveData() {
  collectData();
  
  // حفظ في localStorage
  localStorage.setItem('print4d_config', JSON.stringify(currentConfig, null, 2));
  localStorage.setItem('print4d_offers', JSON.stringify(currentOffers, null, 2));
  
  // عرض تعليمات
  const configJson = JSON.stringify(currentConfig, null, 2);
  const offersJson = JSON.stringify({ offers: currentOffers }, null, 2);
  
  const configBlob = new Blob([configJson], { type: 'application/json' });
  const offersBlob = new Blob([offersJson], { type: 'application/json' });
  
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.id = 'save-modal';
  modal.innerHTML = `
    <div class="modal-content" style="max-width:650px;">
      <div class="modal-header">
        <h3>💾 تم الحفظ محلياً</h3>
        <button class="modal-close" onclick="document.getElementById('save-modal').remove()">×</button>
      </div>
      <div class="modal-body">
        <div style="padding:12px; background:#d1fae5; border-radius:8px; margin-bottom:16px; color:#065f46;">
          ✅ <strong>تم حفظ البيانات في متصفحك تلقائياً</strong>
        </div>
        <p style="margin-bottom:12px;"><strong>لتحديث الموقع على الإنترنت:</strong></p>
        <ol style="padding-right:20px; line-height:2; margin-bottom:16px;">
          <li>حمّل الملفين أدناه</li>
          <li>ارفعهم على GitHub في مجلد <code>data/</code></li>
          <li>الموقع سيتحدث خلال 1-2 دقيقة</li>
        </ol>
        <div style="display:flex; gap:8px; margin-bottom:16px;">
          <a href="${URL.createObjectURL(configBlob)}" download="config.json" class="btn btn-primary" style="flex:1; text-decoration:none;">📥 config.json</a>
          <a href="${URL.createObjectURL(offersBlob)}" download="offers.json" class="btn btn-primary" style="flex:1; text-decoration:none;">📥 offers.json</a>
        </div>
        <details style="margin-top:16px;">
          <summary style="cursor:pointer; color:var(--secondary); font-weight:600;">📋 شو لو ما عندي GitHub؟</summary>
          <div style="padding:12px; background:var(--bg); border-radius:8px; margin-top:8px; font-size:13px; line-height:1.8;">
            1. أنشئ حساب على <a href="https://github.com" target="_blank">github.com</a> (مجاني)<br>
            2. أنشئ repository جديد باسم <code>print4d-main</code><br>
            3. ارفع ملفات الموقع كاملة لمجلد المشروع<br>
            4. ارفع ملف <code>data/config.json</code> و <code>data/offers.json</code><br>
            5. اربطه مع Vercel لنشر الموقع
          </div>
        </details>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  showToast('✅ تم الحفظ في المتصفح + تجهيز الملفات', 'success');
}

function resetData() {
  if (!confirm('إعادة تعيين البيانات للقيم الافتراضية؟ (سيلغي كل تغييراتك)')) return;
  localStorage.removeItem('print4d_config');
  localStorage.removeItem('print4d_offers');
  loadData();
  showToast('↺ تم إعادة التعيين', 'success');
}

// === Tabs ===
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  document.getElementById('tab-' + tabName).classList.add('active');
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  const titles = {
    site: 'معلومات الموقع',
    hero: 'الهيرو',
    services: 'الأقسام',
    offers: 'العروض',
    quick: 'الوصول السريع',
    gallery: 'معرض الأعمال',
    about: 'من نحن',
    theme: 'الستايل'
  };
  document.getElementById('page-title').textContent = titles[tabName] || '';
}

// === تبديل حقول الهيرو حسب النوع ===
function toggleHeroType() {
  const type = document.getElementById('hero-type').value;
  document.getElementById('hero-gradient-group').style.display = type === 'gradient' ? 'flex' : 'none';
  document.getElementById('hero-image-group').style.display = type === 'image' ? 'flex' : 'none';
  document.getElementById('hero-video-group').style.display = type === 'video' ? 'flex' : 'none';
  document.getElementById('hero-solid-group').style.display = type === 'solid' ? 'flex' : 'none';
}

// === Toast ===
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// === تشغيل ===
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      showTab(this.dataset.tab);
    });
  });
  
  const heroType = document.getElementById('hero-type');
  if (heroType) heroType.addEventListener('change', toggleHeroType);
  
  document.getElementById('save-btn').addEventListener('click', saveData);
  document.getElementById('reset-btn').addEventListener('click', resetData);
  document.getElementById('add-offer-btn').addEventListener('click', addNewOffer);
  document.getElementById('add-quick-btn').addEventListener('click', addQuickItem);
  document.getElementById('add-gallery-btn').addEventListener('click', addGalleryItem);
  
  // زر القائمة للموبايل
  const menuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      menuBtn.textContent = sidebar.classList.contains('open') ? '✕ إغلاق' : '☰ القائمة';
    });
    
    // إغلاق عند الضغط على أي nav-item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
          menuBtn.textContent = '☰ القائمة';
        }
      });
    });
  }
  
  loadData();
});
