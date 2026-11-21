/* ============================================================
   ADMIN – Firebase Auth + Blog Management
   ============================================================ */

// Firebase Config (same as main)
const firebaseConfig = {
  apiKey: "AIzaSyC33B-ageOkOc38mSF56n84qTpNv-Jhu0M",
  authDomain: "imaan-fihlani.firebaseapp.com",
  projectId: "imaan-fihlani",
  storageBucket: "imaan-fihlani.firebasestorage.app",
  messagingSenderId: "40592043717",
  appId: "1:40592043717:web:b9bb88b8d1f08308808aac"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const blogsCollection = db.collection('blogs');

/* ============================================================
   DOM REFS
   ============================================================ */
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const adminUser = document.getElementById('adminUser');
const adminMessages = document.getElementById('adminMessages');

const adminBlogForm = document.getElementById('adminBlogForm');
const editPostId = document.getElementById('editPostId');
const postTitle = document.getElementById('postTitle');
const postSlug = document.getElementById('postSlug');
const postMetaDesc = document.getElementById('postMetaDesc');
const postImage = document.getElementById('postImage');
const postAuthor = document.getElementById('postAuthor');
const postCategories = document.getElementById('postCategories');
const postTags = document.getElementById('postTags');
const postPublished = document.getElementById('postPublished');
const formTitle = document.getElementById('formTitle');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const postCount = document.getElementById('postCount');

const postsTableContainer = document.getElementById('postsTableContainer');
const paginationContainer = document.getElementById('paginationContainer');
const newPostBtn = document.getElementById('newPostBtn');
const refreshPostsBtn = document.getElementById('refreshPostsBtn');

/* ============================================================
   PASSWORD TOGGLE – moved here so it's declared once
   ============================================================ */
const togglePassword = document.getElementById('togglePassword');

if (togglePassword && loginPassword) {
  togglePassword.addEventListener('click', function() {
    const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    loginPassword.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
  });
}

let isEditing = false;
let currentPosts = [];
let currentPage = 1;
const postsPerPage = 3;

/* ============================================================
   QUILL RICH TEXT EDITOR
   ============================================================ */
let quill;

function initQuill() {
  quill = new Quill('#editor-container', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ]
    },
    placeholder: 'Write your blog post content here...'
  });
}

/* ============================================================
   AUTHENTICATION
   ============================================================ */

// Check auth state
auth.onAuthStateChanged(user => {
  if (user) {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'block';
    adminUser.textContent = user.email;
    initQuill();
    loadPosts();
  } else {
    loginScreen.style.display = 'block';
    adminDashboard.style.display = 'none';
    adminUser.textContent = '';
  }
});

// Login
loginBtn.addEventListener('click', async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    loginError.textContent = 'Please enter both email and password.';
    return;
  }

  loginError.textContent = '';
  loginBtn.disabled = true;
  loginBtn.textContent = 'Signing in...';

  try {
    await auth.signInWithEmailAndPassword(email, password);
    loginBtn.disabled = false;
    loginBtn.textContent = 'Sign In';
    loginEmail.value = '';
    loginPassword.value = '';
  } catch (error) {
    loginError.textContent = error.message;
    loginBtn.disabled = false;
    loginBtn.textContent = 'Sign In';
  }
});

// Login with Enter key
loginPassword.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loginBtn.click();
});
loginEmail.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loginBtn.click();
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await auth.signOut();
  window.location.href = '/';
});

/* ============================================================
   MESSAGES
   ============================================================ */

function showMessage(text, type = 'success') {
  adminMessages.innerHTML = `<div class="admin-${type}">${text}</div>`;
  setTimeout(() => {
    adminMessages.innerHTML = '';
  }, 5000);
}

/* ============================================================
   LOAD POSTS (with pagination)
   ============================================================ */

async function loadPosts(page = 1) {
  try {
    currentPage = page;
    postsTableContainer.innerHTML = '<div class="admin-loading">Loading posts...</div>';
    paginationContainer.innerHTML = '';
    
    const snapshot = await blogsCollection
      .orderBy('createdAt', 'desc')
      .get();
    
    currentPosts = [];
    snapshot.forEach(doc => {
      currentPosts.push({ id: doc.id, ...doc.data() });
    });
    
    postCount.textContent = `${currentPosts.length} total posts`;
    renderPostsTable(currentPosts, page);
    renderPagination(currentPosts.length, page);
  } catch (error) {
    console.error('Error loading posts:', error);
    postsTableContainer.innerHTML = `<div class="admin-error">Failed to load posts: ${error.message}</div>`;
  }
}

/* ============================================================
   RENDER POSTS TABLE (with pagination)
   ============================================================ */

function renderPostsTable(posts, page = 1) {
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const pagePosts = posts.slice(startIndex, endIndex);

  if (posts.length === 0) {
    postsTableContainer.innerHTML = `
      <div class="admin-empty">
        <p style="color:#888; margin-bottom:1rem;">No blog posts yet.</p>
        <button class="btn btn--gold" onclick="document.getElementById('newPostBtn').click()">
          <i class="fas fa-plus"></i> Create your first post
        </button>
      </div>
    `;
    return;
  }

  if (pagePosts.length === 0) {
    postsTableContainer.innerHTML = `<div class="admin-empty"><p style="color:#888;">No posts on this page.</p></div>`;
    return;
  }

  let html = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Slug</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  pagePosts.forEach(post => {
    const date = formatDate(post.publishedDate || post.createdAt);
    const status = post.published !== false ? 'published' : 'draft';
    const statusLabel = post.published !== false ? 'Published' : 'Draft';
    
    html += `
      <tr>
        <td><strong>${post.title || 'Untitled'}</strong></td>
        <td style="color:#888; font-size:0.85rem;">${post.slug || '—'}</td>
        <td><span class="status-badge ${status}">${statusLabel}</span></td>
        <td style="color:#888; font-size:0.85rem;">${date}</td>
        <td>
          <div class="actions">
            <button class="edit-btn" data-id="${post.id}" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="toggle-btn" data-id="${post.id}" title="Toggle publish status">
              <i class="fas ${post.published !== false ? 'fa-eye' : 'fa-eye-slash'}"></i>
            </button>
            <button class="delete-btn" data-id="${post.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  postsTableContainer.innerHTML = html;

  // Attach event listeners
  postsTableContainer.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const post = currentPosts.find(p => p.id === id);
      if (post) editPost(post);
    });
  });

  postsTableContainer.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      togglePostStatus(id);
    });
  });

  postsTableContainer.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      deletePost(id);
    });
  });
}

/* ============================================================
   RENDER PAGINATION
   ============================================================ */

function renderPagination(totalPosts, currentPage) {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  let html = '';
  
  // Previous button
  html += `<button class="page-btn" data-page="${currentPage - 1}" ${currentPage <= 1 ? 'disabled' : ''}>‹</button>`;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  
  // Next button
  html += `<button class="page-btn" data-page="${currentPage + 1}" ${currentPage >= totalPages ? 'disabled' : ''}>›</button>`;
  
  paginationContainer.innerHTML = html;

  // Attach click events
  paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        loadPosts(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   FORMAT DATE
   ============================================================ */

function formatDate(ts) {
  if (!ts) return 'No date';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ============================================================
   CREATE / EDIT POST
   ============================================================ */

// New Post button
newPostBtn.addEventListener('click', () => {
  resetForm();
  formTitle.textContent = 'Create New Post';
  editPostId.value = '';
  isEditing = false;
  cancelEditBtn.style.display = 'none';
  adminBlogForm.scrollIntoView({ behavior: 'smooth' });
  if (quill) quill.setContents([]);
});

// Cancel Edit button
cancelEditBtn.addEventListener('click', resetForm);

function resetForm() {
  adminBlogForm.reset();
  editPostId.value = '';
  formTitle.textContent = 'Create New Post';
  isEditing = false;
  cancelEditBtn.style.display = 'none';
  postPublished.checked = true;
  postCategories.value = '';
  postTags.value = '';
  if (quill) quill.setContents([]);
}

function editPost(post) {
  formTitle.textContent = 'Edit Post';
  editPostId.value = post.id;
  postTitle.value = post.title || '';
  postSlug.value = post.slug || '';
  postMetaDesc.value = post.metaDescription || '';
  postImage.value = post.imageUrl || '';
  postAuthor.value = post.author || '';
  postCategories.value = (post.categories || []).join(', ');
  postTags.value = (post.tags || []).join(', ');
  postPublished.checked = post.published !== false;
  isEditing = true;
  cancelEditBtn.style.display = 'inline-block';
  adminBlogForm.scrollIntoView({ behavior: 'smooth' });
  
  // Set Quill content
  if (quill && post.content) {
    quill.root.innerHTML = post.content;
  }
}

/* ============================================================
   SAVE POST (Create / Update)
   ============================================================ */

adminBlogForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = postTitle.value.trim();
  const slug = postSlug.value.trim();
  const content = quill ? quill.root.innerHTML : '';

  if (!title) {
    showMessage('Please enter a title.', 'error');
    return;
  }
  if (!slug) {
    showMessage('Please enter a slug (URL).', 'error');
    return;
  }
  if (!content || content === '<p><br></p>') {
    showMessage('Please enter content.', 'error');
    return;
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    showMessage('Slug can only contain lowercase letters, numbers, and hyphens.', 'error');
    return;
  }

  // Process categories and tags
  const categories = postCategories.value
    .split(',')
    .map(c => c.trim())
    .filter(c => c !== '');
  
  const tags = postTags.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t !== '');

  const postData = {
    title: title,
    slug: slug,
    content: content,
    metaDescription: postMetaDesc.value.trim(),
    imageUrl: postImage.value.trim(),
    author: postAuthor.value.trim() || 'Imaan Fihlani',
    categories: categories,
    tags: tags,
    published: postPublished.checked,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  // If creating a new post, add createdAt
  if (!isEditing) {
    postData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    postData.publishedDate = postPublished.checked ? firebase.firestore.FieldValue.serverTimestamp() : null;
  } else {
    // If toggling publish status, update publishedDate
    if (postPublished.checked) {
      postData.publishedDate = firebase.firestore.FieldValue.serverTimestamp();
    } else {
      postData.publishedDate = null;
    }
  }

  const saveBtn = document.getElementById('savePostBtn');
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving...';

  try {
    if (isEditing) {
      await blogsCollection.doc(editPostId.value).update(postData);
      showMessage('✅ Post updated successfully!', 'success');
    } else {
      await blogsCollection.add(postData);
      showMessage('✅ Post published successfully!', 'success');
    }
    
    resetForm();
    loadPosts(currentPage);
  } catch (error) {
    console.error('Error saving post:', error);
    showMessage('❌ Failed to save post: ' + error.message, 'error');
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Post';
  }
});

/* ============================================================
   TOGGLE POST STATUS
   ============================================================ */

async function togglePostStatus(id) {
  const post = currentPosts.find(p => p.id === id);
  if (!post) return;

  const newStatus = post.published === false;
  const statusLabel = newStatus ? 'publish' : 'unpublish';

  if (!confirm(`Are you sure you want to ${statusLabel} this post?`)) return;

  try {
    const updateData = {
      published: newStatus,
      publishedDate: newStatus ? firebase.firestore.FieldValue.serverTimestamp() : null,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    await blogsCollection.doc(id).update(updateData);
    showMessage(`✅ Post ${statusLabel}ed successfully!`, 'success');
    loadPosts(currentPage);
  } catch (error) {
    console.error('Error toggling post status:', error);
    showMessage('❌ Failed to toggle post status.', 'error');
  }
}

/* ============================================================
   DELETE POST
   ============================================================ */

async function deletePost(id) {
  const post = currentPosts.find(p => p.id === id);
  if (!post) return;

  if (!confirm(`Are you sure you want to delete "${post.title || 'Untitled'}"? This cannot be undone.`)) return;

  try {
    await blogsCollection.doc(id).delete();
    showMessage('🗑️ Post deleted successfully!', 'success');
    loadPosts(currentPage);
  } catch (error) {
    console.error('Error deleting post:', error);
    showMessage('❌ Failed to delete post: ' + error.message, 'error');
  }
}

/* ============================================================
   REFRESH BUTTON
   ============================================================ */

refreshPostsBtn.addEventListener('click', () => {
  loadPosts(currentPage);
  showMessage('🔄 Posts refreshed!', 'success');
});

/* ============================================================
   AUTO-GENERATE SLUG FROM TITLE
   ============================================================ */

postTitle.addEventListener('input', () => {
  if (!postSlug.dataset.manual) {
    const slug = postTitle.value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    postSlug.value = slug;
  }
});

postSlug.addEventListener('input', () => {
  postSlug.dataset.manual = 'true';
});

postSlug.addEventListener('focus', () => {
  if (!postSlug.value) {
    postSlug.dataset.manual = '';
  }
});

/* ============================================================
   INIT
   ============================================================ */

console.log('✅ Admin dashboard ready.');