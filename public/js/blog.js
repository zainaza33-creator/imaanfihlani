/* ============================================================
   BLOG PAGE – Full blog with sidebar, search, categories, tags
   ============================================================ */

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC33B-ageOkOc38mSF56n84qTpNv-Jhu0M",
  authDomain: "imaan-fihlani.firebaseapp.com",
  projectId: "imaan-fihlani",
  storageBucket: "imaan-fihlani.firebasestorage.app",
  messagingSenderId: "40592043717",
  appId: "1:40592043717:web:b9bb88b8d1f08308808aac"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const blogsCollection = db.collection('blogs');

const SITE_URL = "https://imaanfihlani.com";

/* ============================================================
   DOM REFS
   ============================================================ */
const blogMain = document.getElementById('blogMain');
const blogSearch = document.getElementById('blogSearch');
const searchBtn = document.getElementById('searchBtn');
const categoryList = document.getElementById('categoryList');
const recentPosts = document.getElementById('recentPosts');
const tagCloud = document.getElementById('tagCloud');

let allPosts = [];
let currentPage = 1;
const postsPerPage = 6;

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

function formatDate(ts) {
  if (!ts) return 'No date';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function truncate(text, len = 160) {
  if (text.length <= len) return text;
  return text.slice(0, len) + '…';
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/* ============================================================
   LAZY LOADING
   ============================================================ */

function initLazyLoading() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    return;
  }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '50px 0px', threshold: 0.01 });

  document.querySelectorAll('img[data-src]').forEach(img => {
    img.dataset.observed = 'true';
    imageObserver.observe(img);
  });
}

/* ============================================================
   GET ROUTE
   ============================================================ */

function getRoute() {
  const path = window.location.pathname;
  const match = path.match(/^\/blog\/(.+)/);
  if (match && !path.endsWith('/blog')) {
    return { type: 'post', slug: match[1] };
  }
  return { type: 'list' };
}

/* ============================================================
   UPDATE SEO META TAGS
   ============================================================ */

function updateMetaTags(post) {
  document.title = post ? `${post.title} – Imaan Fihlani` : 'Blog – Imaan Fihlani';

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = post?.metaDescription || 'Insights and articles on social media strategy, brand growth, and digital marketing from Imaan Fihlani.';

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = post ? `${SITE_URL}/blog/${post.slug}` : `${SITE_URL}/blog`;
}

/* ============================================================
   RENDER SINGLE POST
   ============================================================ */

function renderSinglePost(post) {
  if (!post) {
    blogMain.innerHTML = `
      <div style="text-align:center; padding:4rem 0; color:#888;">
        <i class="fas fa-newspaper" style="font-size:3rem; color:#C9A84C; margin-bottom:1rem; display:block;"></i>
        <h3 style="color:#FFFFFF;">Post Not Found</h3>
        <p>The blog post you're looking for doesn't exist.</p>
        <a href="/blog" class="btn btn--gold" style="margin-top:1rem; display:inline-block;">Back to Blog</a>
      </div>
    `;
    updateMetaTags(null);
    return;
  }

  updateMetaTags(post);

  const date = formatDate(post.publishedDate || post.createdAt);
  const image = post.imageUrl || '/images/placeholder-blog.jpg';
  const url = `${SITE_URL}/blog/${post.slug}`;
  const shareText = encodeURIComponent(post.title + ' – Imaan Fihlani');
  const shareUrl = encodeURIComponent(url);

  blogMain.innerHTML = `
    <div class="blog-single">
      <a href="/blog" class="back-link"><i class="fas fa-arrow-left"></i> Back to Blogs</a>
      <div class="post-header">
        <div class="date">${date}</div>
        <h1>${post.title}</h1>
        ${post.author ? `<div class="author">Written by <span>${post.author}</span></div>` : ''}
      </div>
      ${image ? `<img src="${image}" alt="${post.title}" class="post-image" />` : ''}
      <div class="post-content">${post.content}</div>
      <div class="post-footer">
        <div class="share-label">Share this article</div>
        <div class="share-buttons">
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank" class="linkedin" aria-label="Share on LinkedIn">
            <i class="fab fa-linkedin-in"></i>
          </a>
          <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}" target="_blank" class="twitter" aria-label="Share on Twitter">
            <i class="fab fa-x-twitter"></i>
          </a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" class="facebook" aria-label="Share on Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="https://wa.me/?text=${shareText}%20${shareUrl}" target="_blank" class="whatsapp" aria-label="Share on WhatsApp">
            <i class="fab fa-whatsapp"></i>
          </a>
          <a href="mailto:?subject=${post.title}&body=Check out this article: ${url}" class="email" aria-label="Share via Email">
            <i class="fas fa-envelope"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  const newUrl = `/blog/${post.slug}`;
  if (window.location.pathname !== newUrl) {
    window.history.pushState({ slug: post.slug }, '', newUrl);
  }
}

/* ============================================================
   RENDER BLOG LIST
   ============================================================ */

function renderBlogList(posts, page = 1) {
  updateMetaTags(null);
  
  const publishedPosts = posts.filter(p => p.published !== false);
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const pagePosts = publishedPosts.slice(startIndex, endIndex);

  if (publishedPosts.length === 0 || pagePosts.length === 0) {
    blogMain.innerHTML = `
      <div style="text-align:center; padding:4rem 0; color:#888;">
        <i class="fas fa-newspaper" style="font-size:3rem; color:#C9A84C; margin-bottom:1rem; display:block;"></i>
        <h3 style="color:#FFFFFF;">No posts found</h3>
        <p>Check back soon for insights and articles.</p>
      </div>
    `;
    return;
  }

  let html = '';

  if (page === 1 && publishedPosts.length > 0) {
    const featured = publishedPosts[0];
    const excerpt = truncate(stripHtml(featured.content || ''), 180);
    const image = featured.imageUrl || '/images/placeholder-blog.jpg';
    const date = formatDate(featured.publishedDate || featured.createdAt);

    html += `
      <div class="featured-post" onclick="window.location.href='/blog/${featured.slug}'">
        <div class="image">
          <img data-src="${image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%231A1A1A'/%3E%3C/svg%3E" alt="${featured.title}" class="lazy" />
        </div>
        <div class="content">
          <span class="badge">Featured</span>
          <h2>${featured.title}</h2>
          <p class="excerpt">${excerpt}</p>
          <div class="meta">
            <span class="author">${featured.author || 'Imaan Fihlani'}</span> · ${date}
          </div>
        </div>
      </div>
    `;
  }

  html += `<div class="blog-list">`;

  const startOffset = (page === 1) ? 1 : 0;
  const postsToShow = pagePosts.slice(startOffset);

  postsToShow.forEach(post => {
    const excerpt = truncate(stripHtml(post.content || ''), 140);
    const date = formatDate(post.publishedDate || post.createdAt);
    const image = post.imageUrl || '/images/placeholder-blog.jpg';
    const slug = post.slug || createSlug(post.title);

    html += `
      <div class="blog-card" onclick="window.location.href='/blog/${slug}'">
        <img data-src="${image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%231A1A1A'/%3E%3C/svg%3E" alt="${post.title}" class="lazy" />
        <div class="blog-card-body">
          <div class="blog-card-date">${date}</div>
          <h4 class="blog-card-title">${post.title}</h4>
          <p class="blog-card-excerpt">${excerpt}</p>
          <a href="/blog/${slug}" class="blog-card-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    `;
  });

  html += `</div>`;

  const totalPages = Math.ceil(publishedPosts.length / postsPerPage);
  if (totalPages > 1) {
    html += `<div class="pagination">`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `</div>`;
  }

  blogMain.innerHTML = html;

  blogMain.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      renderBlogList(posts, page);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    });
  });

  initLazyLoading();

  if (window.location.pathname !== '/blog') {
    window.history.pushState({}, '', '/blog');
  }
}

/* ============================================================
   SIDEBAR – Categories
   ============================================================ */

function renderCategories(posts) {
  const publishedPosts = posts.filter(p => p.published !== false);
  const categoryMap = {};
  
  publishedPosts.forEach(post => {
    const cats = post.categories || [];
    cats.forEach(cat => {
      const key = cat.toLowerCase().trim();
      if (key) {
        categoryMap[key] = (categoryMap[key] || 0) + 1;
      }
    });
  });

  const sorted = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    categoryList.innerHTML = '<li style="color:#666;">No categories yet</li>';
    return;
  }

  let html = '';
  sorted.forEach(([name, count]) => {
    html += `
      <li>
        <a data-category="${name}">
          ${name.charAt(0).toUpperCase() + name.slice(1)}
          <span class="count">${count}</span>
        </a>
      </li>
    `;
  });
  categoryList.innerHTML = html;

  categoryList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      const category = link.dataset.category;
      const filtered = allPosts.filter(p => 
        (p.categories || []).some(c => c.toLowerCase().trim() === category)
      );
      renderBlogList(filtered);
    });
  });
}

/* ============================================================
   SIDEBAR – Tags
   ============================================================ */

function renderTags(posts) {
  const publishedPosts = posts.filter(p => p.published !== false);
  const tagMap = {};
  
  publishedPosts.forEach(post => {
    const tags = post.tags || [];
    tags.forEach(tag => {
      const key = tag.toLowerCase().trim();
      if (key) {
        tagMap[key] = (tagMap[key] || 0) + 1;
      }
    });
  });

  const sorted = Object.entries(tagMap).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    tagCloud.innerHTML = '<span style="color:#666;">No tags yet</span>';
    return;
  }

  let html = '';
  sorted.forEach(([name, count]) => {
    html += `<a data-tag="${name}">${name}</a>`;
  });
  tagCloud.innerHTML = html;

  tagCloud.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      const tag = link.dataset.tag;
      const filtered = allPosts.filter(p => 
        (p.tags || []).some(t => t.toLowerCase().trim() === tag)
      );
      renderBlogList(filtered);
    });
  });
}

/* ============================================================
   SIDEBAR – Recent Posts
   ============================================================ */

function renderRecentPosts(posts) {
  const publishedPosts = posts.filter(p => p.published !== false);
  const recent = publishedPosts.slice(0, 5);

  if (recent.length === 0) {
    recentPosts.innerHTML = '<p style="color:#666;">No recent posts</p>';
    return;
  }

  let html = '';
  recent.forEach(post => {
    const image = post.imageUrl || '/images/placeholder-blog.jpg';
    const date = formatDate(post.publishedDate || post.createdAt);
    html += `
      <div class="recent-post">
        <img data-src="${image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%231A1A1A'/%3E%3C/svg%3E" alt="${post.title}" class="lazy" />
        <div class="info">
          <a href="/blog/${post.slug}">${post.title}</a>
          <span class="date">${date}</span>
        </div>
      </div>
    `;
  });
  recentPosts.innerHTML = html;
  initLazyLoading();
}

/* ============================================================
   SEARCH
   ============================================================ */

function searchPosts(query) {
  const publishedPosts = allPosts.filter(p => p.published !== false);
  if (!query.trim()) {
    renderBlogList(allPosts);
    return;
  }

  const q = query.toLowerCase().trim();
  const filtered = publishedPosts.filter(post => {
    const title = (post.title || '').toLowerCase();
    const content = stripHtml(post.content || '').toLowerCase();
    return title.includes(q) || content.includes(q);
  });

  renderBlogList(filtered);
}

searchBtn.addEventListener('click', () => searchPosts(blogSearch.value));
blogSearch.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchPosts(blogSearch.value);
});

/* ============================================================
   LOAD BLOG POSTS & HANDLE ROUTING
   ============================================================ */

async function loadAndRoute() {
  try {
    const snapshot = await blogsCollection
      .where('published', '==', true)
      .orderBy('publishedDate', 'desc')
      .get();

    const posts = [];
    snapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    allPosts = posts;
    console.log('📝 Posts loaded:', posts.length);

    const route = getRoute();
    console.log('📍 Route:', route);

    // ALWAYS render sidebar (for both list and single post views)
    renderCategories(posts);
    renderTags(posts);
    renderRecentPosts(posts);

    if (route.type === 'post') {
      const post = posts.find(p => p.slug === route.slug);
      if (post) {
        renderSinglePost(post);
      } else {
        renderSinglePost(null);
      }
    } else {
      renderBlogList(posts);
    }

  } catch (error) {
    console.error('Error loading blogs:', error);
    blogMain.innerHTML = `
      <div style="text-align:center; padding:4rem 0; color:#FF6B6B;">
        <i class="fas fa-exclamation-circle" style="font-size:3rem; margin-bottom:1rem; display:block;"></i>
        <h3 style="color:#FFFFFF;">Failed to load posts</h3>
        <p>Please try again later.</p>
      </div>
    `;
  }
}

/* ============================================================
   NAVIGATION – Header Scroll, Mobile Menu & Click Outside
   ============================================================ */

const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const navWrap = document.getElementById('navWrap');
const goTop = document.getElementById('goTop');

// Header Scroll Effect (Transparent to Black)
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });
}

// Mobile Menu Toggle & Click Outside to Close
if (menuToggle && navWrap) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents document click from firing immediately
    const isOpen = navWrap.classList.toggle('is-open');
    menuToggle.classList.toggle('is-active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const isClickInsideNav = navWrap.contains(e.target);
    const isClickOnToggle = menuToggle.contains(e.target);
    
    if (!isClickInsideNav && !isClickOnToggle && navWrap.classList.contains('is-open')) {
      navWrap.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
    }
  });
}

// Close mobile menu on link click
document.querySelectorAll('.header-nav a').forEach(link => {
  link.addEventListener('click', () => {
    if (navWrap && menuToggle) {
      navWrap.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
    }
  });
});

// Go Top Button
window.addEventListener('scroll', () => {
  if (goTop) {
    goTop.classList.toggle('visible', window.pageYOffset > 400);
  }
});

/* ============================================================
   POPSTATE – Handle back/forward
   ============================================================ */

window.addEventListener('popstate', () => {
  loadAndRoute();
});

/* ============================================================
   INIT
   ============================================================ */

loadAndRoute();
console.log('✅ Blog page ready.');