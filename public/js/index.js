/* ============================================================
   CONFIGURATION – YOU MUST UPDATE THESE VALUES
   ============================================================ */

// Firebase Config (get from your Firebase project console)
const firebaseConfig = {
  apiKey: "AIzaSyC33B-ageOkOc38mSF56n84qTpNv-Jhu0M",
  authDomain: "imaan-fihlani.firebaseapp.com",
  projectId: "imaan-fihlani",
  storageBucket: "imaan-fihlani.firebasestorage.app",
  messagingSenderId: "40592043717",
  appId: "1:40592043717:web:b9bb88b8d1f08308808aac"
};

// Initialize Firebase (compat)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const blogsCollection = db.collection('blogs');

// Site URL for SEO
const SITE_URL = "https://imaanfihlani.com";

/* ============================================================
   DOM REFS
   ============================================================ */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const header = $('#header');
const navWrap = $('#navWrap');
const menuToggle = $('#menuToggle');
const navLinks = $$('.header-nav a');
const goTop = $('#goTop');
const blogContent = $('#blogContent');
const formStatus = $('#formStatus');

/* ============================================================
   HEADER SCROLL EFFECT (Transparent to Dark Black)
   ============================================================ */
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
});

/* ============================================================
   SCROLL ANIMATIONS – Intersection Observer
   ============================================================ */

const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => observer.observe(el));

/* ============================================================
   SERVICE CARD EXPAND/COLLAPSE (Accordion)
   ============================================================ */

(function initServiceToggles() {
  const cards = document.querySelectorAll('.service-card');
  const toggles = document.querySelectorAll('.toggle-service');

  function closeAllExcept(keepOpen) {
    cards.forEach(card => {
      if (card !== keepOpen) {
        card.classList.remove('is-expanded');
        const link = card.querySelector('.toggle-service');
        if (link) link.innerHTML = 'Learn More <i class="fas fa-arrow-right"></i>';
      }
    });
  }

  toggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const card = this.closest('.service-card');
      const isOpen = card.classList.contains('is-expanded');

      if (isOpen) {
        card.classList.remove('is-expanded');
        this.innerHTML = 'Learn More <i class="fas fa-arrow-right"></i>';
        return;
      }

      closeAllExcept(card);
      card.classList.add('is-expanded');
      this.innerHTML = 'Read Less <i class="fas fa-arrow-up"></i>';
    });
  });

  let scrollTimeout;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      cards.forEach(card => {
        if (card.classList.contains('is-expanded')) {
          card.classList.remove('is-expanded');
          const link = card.querySelector('.toggle-service');
          if (link) link.innerHTML = 'Learn More <i class="fas fa-arrow-right"></i>';
        }
      });
    }, 100);
  });
})();

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

// Format date
function formatDate(ts) {
  if (!ts) return 'No date';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Create a slug from a title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Truncate text
function truncate(text, len = 120) {
  if (text.length <= len) return text;
  return text.slice(0, len) + '…';
}

// Strip HTML for excerpt
function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/* ============================================================
   NAVIGATION
   ============================================================ */

// Toggle mobile menu
menuToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents the document click from immediately firing
  const isOpen = navWrap.classList.toggle('is-open');
  menuToggle.classList.toggle('is-active');
});

// Close mobile menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navWrap.classList.remove('is-open');
    menuToggle.classList.remove('is-active');
  });
});

// Close mobile menu when clicking anywhere outside of it
document.addEventListener('click', (e) => {
  const isClickInsideNav = navWrap.contains(e.target);
  const isClickOnToggle = menuToggle.contains(e.target);
  
  // If the click is outside the nav and the toggle button, close it
  if (!isClickInsideNav && !isClickOnToggle && navWrap.classList.contains('is-open')) {
    navWrap.classList.remove('is-open');
    menuToggle.classList.remove('is-active');
  }
});

// Smooth scroll & active link highlight for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const offset = header.offsetHeight + 12;
      const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      // Update active state
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    }
  });
});

// Update active link on scroll
function updateActiveLink() {
  const sections = $$('.target-section');
  const scrollY = window.pageYOffset + header.offsetHeight + 20;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      const id = section.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}
window.addEventListener('scroll', updateActiveLink);

// Go Top button
window.addEventListener('scroll', () => {
  goTop.classList.toggle('visible', window.pageYOffset > 400);
});

/* ============================================================
   BLOG – RENDER LATEST POSTS ON HOMEPAGE
   ============================================================ */

// Render blog list (homepage – only 3 latest posts)
function renderBlogList(posts) {
  const publishedPosts = posts.filter(p => p.published !== false);
  
  // Only show 3 latest posts on homepage
  const latestPosts = publishedPosts.slice(0, 3);
  
  if (latestPosts.length === 0) {
    blogContent.innerHTML = `
      <div class="section-intro reveal">
        <h3>Insights</h3>
        <h2>Latest from the blog</h2>
        <p style="color:#888;">No blog posts yet. Check back soon!</p>
      </div>
    `;
    return;
  }

  let html = `
    <div class="section-intro reveal">
      <h3>Insights</h3>
      <h2>Latest from the blog</h2>
    </div>
    <div class="blog-list reveal-stagger">
  `;

  latestPosts.forEach(post => {
    const excerpt = truncate(stripHtml(post.content || ''), 140);
    const date = formatDate(post.publishedDate || post.createdAt);
    const image = post.imageUrl || 'images/placeholder-blog.jpg';
    const slug = post.slug || createSlug(post.title);
    
    html += `
      <div class="blog-card" data-id="${post.id}">
        <img data-src="${image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%231A1A1A'/%3E%3C/svg%3E" alt="${post.title}" class="lazy" loading="lazy" />
        <div class="blog-card-body">
          <div class="blog-card-date">${date}</div>
          <h4 class="blog-card-title">${post.title}</h4>
          <p class="blog-card-excerpt">${excerpt}</p>
          <a href="/blog/${slug}" class="blog-card-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    `;
  });

  html += `</div>`; // Close blog-list

  // Add "View All" button OUTSIDE the scrollable list
  if (publishedPosts.length >= 3) {
    html += `
      <div class="view-all-wrapper">
        <a href="/blog" class="btn btn--gold">View All Blog Posts <i class="fas fa-arrow-right"></i></a>
      </div>
    `;
  }

  blogContent.innerHTML = html;

  // Re-apply reveal animations
  const newReveals = blogContent.querySelectorAll('.reveal, .reveal-stagger');
  newReveals.forEach(el => observer.observe(el));

  // Re-initialize lazy loading for new images
  document.querySelectorAll('img.lazy[data-src]:not([data-observed])').forEach(img => {
    img.dataset.observed = 'true';
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          lazyObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px 0px', threshold: 0.01 });
    lazyObserver.observe(img);
  });
}

// Load blogs from Firestore
async function loadBlogs() {
  try {
    const snapshot = await blogsCollection
      .where('published', '==', true)
      .orderBy('publishedDate', 'desc')
      .get();
    
    const posts = [];
    snapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    renderBlogList(posts);
    return posts;
  } catch (err) {
    console.error('Error loading blogs:', err);
    blogContent.innerHTML = `
      <div class="section-intro reveal">
        <h3>Insights</h3>
        <h2>Latest from the blog</h2>
        <p style="color:#FF6B6B;">Failed to load blog posts. Please try again later.</p>
      </div>
    `;
    return [];
  }
}

/* ============================================================
   CONTACT FORM – EmailJS
   ============================================================ */

// EmailJS Config – REPLACE WITH YOUR ACTUAL VALUES
const EMAILJS_CONFIG = {
  serviceID: "service_3eo2cjo",      // Replace with your Service ID
  templateID: "template_z1ayjbg",    // Replace with your Template ID
  publicKey: "jnz_DNHwlblWcE18h"       // Replace with your Public Key
};

// Email address where contact forms are sent
const CONTACT_EMAIL = "imaan@imaanfihlani.com";

// Initialize EmailJS
(function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('✅ EmailJS initialised');
  } else {
    console.warn('⚠️ EmailJS not loaded. Check your script tag.');
  }
})();

// Find the form
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (formStatus) {
      formStatus.textContent = 'Sending...';
      formStatus.className = 'form-status';
      formStatus.style.color = '#C9A84C';
    }

    // Get form data
    const name = document.getElementById('contactName')?.value?.trim() || '';
    const email = document.getElementById('contactEmail')?.value?.trim() || '';
    const phone = document.getElementById('contactPhone')?.value?.trim() || '';
    const company = document.getElementById('contactCompany')?.value?.trim() || '';
    const currency = document.getElementById('contactCurrency')?.value || '';
    const budget = document.getElementById('contactBudget')?.value || '';
    const message = document.getElementById('contactMessage')?.value?.trim() || '';

    // Validate
    if (!name || !email || !phone || !message) {
      if (formStatus) {
        formStatus.textContent = 'Please fill in all required fields.';
        formStatus.className = 'form-status error';
        formStatus.style.color = '#FF6B6B';
      }
      return;
    }

    // Prepare template parameters
    const templateParams = {
      to_email: CONTACT_EMAIL,
      from_name: name,
      from_email: email,
      phone: phone,
      company: company || 'Not specified',
      currency: currency || 'ZAR',
      budget: budget || 'Not specified',
      message: message
    };

    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        templateParams
      );
      console.log('✅ Email sent:', response);
      
      // Redirect to thank-you page
      window.location.href = '/thank-you.html';
      
    } catch (error) {
      console.error('❌ Email send error:', error);
      if (formStatus) {
        formStatus.textContent = '❌ Something went wrong. Please try again or email me directly at ' + CONTACT_EMAIL;
        formStatus.className = 'form-status error';
        formStatus.style.color = '#FF6B6B';
      }
    }
  });
}

/* ============================================================
   CONTACT FORM – Dynamic currency & budget
   ============================================================ */

(function initContactForm() {
  const currencySelect = document.getElementById('contactCurrency');
  const budgetSelect = document.getElementById('contactBudget');

  if (!currencySelect || !budgetSelect) return;

  // Define budget ranges for each currency
  const budgetRanges = {
    USD: [
      { value: '', label: '– Please select –' },
      { value: '< $1,000', label: '< $1,000' },
      { value: '$1,000 – $3,000', label: '$1,000 – $3,000' },
      { value: '$3,000 – $6,000', label: '$3,000 – $6,000' },
      { value: '$6,000 – $10,000', label: '$6,000 – $10,000' },
      { value: '$10,000+', label: '$10,000+' }
    ],
    GBP: [
      { value: '', label: '– Please select –' },
      { value: '< £1,000', label: '< £1,000' },
      { value: '£1,000 – £3,000', label: '£1,000 – £3,000' },
      { value: '£3,000 – £6,000', label: '£3,000 – £6,000' },
      { value: '£6,000 – £10,000', label: '£6,000 – £10,000' },
      { value: '£10,000+', label: '£10,000+' }
    ],
    ZAR: [
      { value: '', label: '– Please select –' },
      { value: '< R15,000', label: '< R15,000' },
      { value: 'R15,000 – R45,000', label: 'R15,000 – R45,000' },
      { value: 'R45,000 – R90,000', label: 'R45,000 – R90,000' },
      { value: 'R90,000 – R150,000', label: 'R90,000 – R150,000' },
      { value: 'R150,000+', label: 'R150,000+' }
    ]
  };

  // Function to update budget options
  function updateBudgetOptions(currency) {
    const ranges = budgetRanges[currency] || budgetRanges.USD;
    const currentValue = budgetSelect.value;

    // Clear existing options
    budgetSelect.innerHTML = '';

    // Add new options
    ranges.forEach(range => {
      const option = document.createElement('option');
      option.value = range.value;
      option.textContent = range.label;
      if (range.value === currentValue) {
        option.selected = true;
      }
      budgetSelect.appendChild(option);
    });

    // If the current value doesn't exist in the new options, reset to empty
    if (currentValue && !ranges.some(r => r.value === currentValue)) {
      budgetSelect.value = '';
    }
  }

  // Update budget when currency changes
  currencySelect.addEventListener('change', function() {
    updateBudgetOptions(this.value);
  });

  // Set initial budget options based on default currency
  updateBudgetOptions(currencySelect.value);

  console.log('✅ Contact form currency/budget initialized');
})();

/* ============================================================
   CLIENT CAROUSEL & MODAL
   ============================================================ */

(function initClientCarousel() {
  const clients = [
    {
      name: 'BIG202',
      logo: 'images/Big202.jpg',
      description: 'BIG202 is a strategic consulting and business development company focused on helping organizations and leaders achieve sustainable growth through innovative strategy, leadership development, and operational excellence. The company partners with businesses to drive impact, improve performance, and build long-term success.'
    },
    {
      name: 'NDZUMO CONSULTING',
      logo: 'images/Ndzumo-consulting.png',
      description: 'Ndzumo Consulting is a South African financial consulting firm dedicated to helping small and medium-sized enterprises (SMEs) build financially healthy, compliant, and sustainable businesses. Since 2017, the company has provided expert accounting, bookkeeping, tax, payroll, and business advisory services that empower business owners to make informed financial decisions with confidence.'
    },
    {
      name: 'MALL FOR WOMAN',
      logo: 'images/mall-for-women.png',
      description: 'Mall For Women is a South African digital marketplace dedicated to empowering women through e-commerce, logistics, fintech, and digital health solutions. The platform connects women with products, services, and business opportunities while fostering an inclusive ecosystem that promotes entrepreneurship, innovation, and economic participation.'
    },
    {
      name: 'BAYSE REFORMER PILATES',
      logo: 'images/bayse.webp',
      description: 'Bayse Reformer Pilates is a boutique wellness studio specializing in reformer Pilates classes designed to improve strength, flexibility, posture, and overall well-being. With a focus on personalized instruction and a welcoming environment, the studio helps clients achieve their fitness goals through mindful, low-impact movement.'
    },
    {
      name: 'GCINABANTU FOUNDATION',
      logo: 'images/Gnf.png',
      description: 'The Gcinabantu Hutchison Ngcukayitobi Foundation is a South African non-profit organization committed to building safer, stronger communities by addressing social challenges through education, youth development, gender-based violence prevention, community empowerment, and advocacy. The Foundation works to promote social justice, human rights, and sustainable community development across the Eastern Cape.'
    }
  ];

  const carousel = document.getElementById('clientCarousel');
  if (!carousel) return;

  const modal = document.getElementById('clientModal');
  const modalClose = document.getElementById('modalClose');
  const modalLogo = document.getElementById('modalLogo');
  const modalName = document.getElementById('modalName');
  const modalDesc = document.getElementById('modalDesc');

  function buildCarousel() {
    const doubled = [...clients, ...clients];
    let html = '';
    doubled.forEach(client => {
      html += `
        <div class="client-item" data-name="${client.name}" data-logo="${client.logo}" data-desc="${client.description}">
          <img data-src="${client.logo}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%231A1A1A'/%3E%3C/svg%3E" alt="${client.name}" class="lazy" />
          <span class="client-name">${client.name}</span>
          <span class="hover-hint">Read Me</span>
        </div>
      `;
    });
    carousel.innerHTML = html;
  }

  buildCarousel();

  // Lazy load carousel images
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        lazyObserver.unobserve(img);
      }
    });
  }, { rootMargin: '50px 0px', threshold: 0.01 });

  carousel.querySelectorAll('.client-item img.lazy').forEach(img => {
    lazyObserver.observe(img);
  });

  carousel.addEventListener('click', (e) => {
    const item = e.target.closest('.client-item');
    if (!item) return;
    const name = item.dataset.name;
    const logo = item.dataset.logo;
    const desc = item.dataset.desc;
    if (modalLogo) modalLogo.src = logo;
    if (modalLogo) modalLogo.alt = name;
    if (modalName) modalName.textContent = name;
    if (modalDesc) modalDesc.textContent = desc;
    if (modal) modal.classList.add('is-open');
    if (modal) document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    if (modal) modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
  });
})();

/* ============================================================
   TESTIMONIAL CAROUSEL
   ============================================================ */

(function initTestimonials() {
  const testimonials = [
    {
      name: 'Pamela',
      role: 'Ndzumo Consulting',
      quote: 'Working with Imaan transformed our social media approach. She brought structure, consistency, and a clear strategy that improved engagement and strengthened our online presence. Our brand now reflects the professionalism and credibility our business deserves every day.',
      fullText: 'Working with Imaan transformed our social media approach. She brought structure, consistency, and a clear strategy that improved engagement and strengthened our online presence. Our brand now reflects the professionalism and credibility our business deserves every day. Her expertise made a noticeable difference to our business.'
    },
    {
      name: 'Lisa',
      role: 'Liger Property Group',
      quote: 'Imaan understood our brand from the beginning and created content that truly connected with our audience. Our social media became polished, engaging, and consistent, resulting in stronger audience interaction and increased interest in our properties.',
      fullText: 'Imaan understood our brand from the beginning and created content that truly connected with our audience. Our social media became polished, engaging, and consistent, resulting in stronger audience interaction and increased interest in our properties. She exceeded our expectations at every stage of the process.'
    },
    {
      name: 'Christopher',
      role: 'BIG202',
      quote: 'Imaan is strategic, creative, and an absolute pleasure to work with. Every piece of content had a clear purpose, helping us strengthen our online presence while maintaining consistent messaging across all our platforms.',
      fullText: 'Imaan is strategic, creative, and an absolute pleasure to work with. Every piece of content had a clear purpose, helping us strengthen our online presence while maintaining consistent messaging across all our platforms. I highly recommend her services.'
    },
    {
      name: 'Sanele',
      role: 'Mall For Women',
      quote: 'Imaan is strategic, creative, and reliable. She developed purposeful content that strengthened our online presence while maintaining consistent messaging across every platform. Her professionalism and dedication made the entire experience seamless, delivering excellent results throughout.',
      fullText: 'Imaan is strategic, creative, and reliable. She developed purposeful content that strengthened our online presence while maintaining consistent messaging across every platform. Her professionalism and dedication made the entire experience seamless, delivering excellent results throughout. I would confidently recommend her to any business.'
    },
    {
      name: 'Sarah',
      role: 'Bayse Reformer Pilates',
      quote: 'Partnering with Imaan was one of the best decisions we made for our online presence. She took the time to understand our business, developed a clear content strategy, and consistently delivered high-quality content that reflected our brand.',
      fullText: 'Partnering with Imaan was one of the best decisions we made for our online presence. She took the time to understand our business, developed a clear content strategy, and consistently delivered high-quality content that reflected our brand. Our social media became more engaging, more professional, and started attracting the right audience. I highly recommend her to any business looking to grow online.'
    }
  ];

  const carousel = document.getElementById('testimonialCarousel');
  if (!carousel) return;

  const modal = document.getElementById('clientModal');
  const modalLogo = document.getElementById('modalLogo');
  const modalName = document.getElementById('modalName');
  const modalDesc = document.getElementById('modalDesc');

  function buildTestimonials() {
    const doubled = [...testimonials, ...testimonials];
    let html = '';
    doubled.forEach(t => {
      html += `
        <div class="testimonial-item" data-name="${t.name}" data-role="${t.role}" data-quote="${t.quote}" data-full="${t.fullText}">
          <div class="quote">“${t.quote}”</div>
          <div class="author">${t.name}</div>
          <span class="role">${t.role}</span>
          <div class="hover-hint">Read More</div>
        </div>
      `;
    });
    carousel.innerHTML = html;
  }

  buildTestimonials();

  carousel.addEventListener('click', (e) => {
    const item = e.target.closest('.testimonial-item');
    if (!item) return;
    const name = item.dataset.name;
    const role = item.dataset.role;
    const fullText = item.dataset.full;

    if (modalLogo) {
      modalLogo.src = 'images/logo.png';
      modalLogo.alt = 'Quote';
    }
    if (modalName) modalName.textContent = name;
    if (modalDesc) modalDesc.innerHTML = `<em style="color:#C9A84C;">${role}</em><br><br>${fullText}`;
    if (modal) modal.classList.add('is-open');
    if (modal) document.body.style.overflow = 'hidden';
  });
})();

/* ============================================================
   INIT – Load blogs
   ============================================================ */

(async function init() {
  await loadBlogs();
  console.log('✅ Imaan Fihlani site ready.');
})();