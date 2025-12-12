// Defensive DOM helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  setYear();
  typingEffect();
  contactDemo();
  checkImage();
  initScrollAnimations();
  initNavigation();
  initBlogInteractions();
  initSchoolLogos();
  initTourPage();
    initImageModal();
});

// THEME: initialize from localStorage or system preference
function initTheme() {
  const toggle = $('#themeToggle');
  if (!toggle) return;

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved ? saved : (prefersDark ? 'dark' : 'light');

  // Apply theme to document element
  document.documentElement.setAttribute('data-theme', initial);
  updateThemeIcon(initial);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });
}

// Update theme icon based on current theme
function updateThemeIcon(theme) {
  const toggle = $('#themeToggle');
  if (!toggle) return;
  toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Typing effect
function typingEffect() {
  const el = $('.typing');
  if (!el) return;
  
  const roles = ['Web Developer', 'UI/UX Designer', 'Problem Solver', 'Freelancer'];
  let i = 0, j = 0, deleting = false;

  function tick() {
    const role = roles[i];
    el.textContent = role.slice(0, j);
    
    if (!deleting && j < role.length) {
      j++;
      setTimeout(tick, 90 + Math.random() * 40);
    } else if (deleting && j > 0) {
      j--;
      setTimeout(tick, 40 + Math.random() * 30);
    } else {
      deleting = !deleting;
      if (!deleting) i = (i + 1) % roles.length;
      setTimeout(tick, deleting ? 700 : 1100);
    }
  }
  tick();
}

// Auto year
function setYear() {
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
}

// Contact form demo behavior
function contactDemo() {
  const form = $('#contactForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = form.querySelector('input[type="text"]');
    const name = nameInput ? nameInput.value : 'Guest';
    
    alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
    form.reset();
  });
}

// Check if profile image loads properly
function checkImage() {
  const img = $('.avatar img');
  if (!img) return;
  
  img.addEventListener('error', () => {
    console.warn('Profile image failed to load. Make sure the image exists at images/profile.jpg');
  });
}

// Scroll animations for reveal elements
function initScrollAnimations() {
  const reveals = $$('.reveal');
  
  function checkReveal() {
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add('active');
      }
    }
  }
  
  window.addEventListener('scroll', checkReveal);
  checkReveal(); // Initial check
}

// Navigation functionality
function initNavigation() {
  const navLinks = $$('.nav-links a');
  
  // Handle navigation for both same-page and cross-page links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetHref = this.getAttribute('href');
      
      // Check if it's a link to the same page with hash
      if (targetHref.includes('#')) {
        const [page, sectionId] = targetHref.split('#');
        
        // If linking to current page or just hash
        if (page === '' || page === 'index.html' || page === window.location.pathname.split('/').pop()) {
          // Same page navigation
          const targetSection = $(`#${sectionId}`);
          if (targetSection) {
            window.scrollTo({
              top: targetSection.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        } else {
          // Different page navigation - redirect to the page
          window.location.href = targetHref;
        }
      } else {
        // Regular page navigation
        window.location.href = targetHref;
      }
    });
  });
  
  // Set active link based on scroll position (only for index.html)
  if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
    function setActiveLink() {
      const scrollPosition = window.scrollY;
      
      $$('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }
    
    window.addEventListener('scroll', setActiveLink);
  }
}

// Blog post interactions
function initBlogInteractions() {
  const readMoreLinks = $$('.read-more');
  
  readMoreLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const blogTitle = this.closest('.blog-content').querySelector('h3').textContent;
      alert(`This would navigate to the full blog post: "${blogTitle}"`);
    });
  });
}

// Animate school logos on page load
function initSchoolLogos() {
  const schoolLogos = $$('.school-logo');
  schoolLogos.forEach((logo, index) => {
    setTimeout(() => logo.classList.add('show'), index * 400);
  });
}

// Initialize tour page specific functionality
function initTourPage() {
  // Only run on the educational tour page
  if (!window.location.pathname.includes('educ.html')) return;
  
  // Initialize timeline animations
  const timelineItems = $$('.timeline-item');
  
  function animateTimeline() {
    timelineItems.forEach((item, index) => {
      const itemTop = item.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (itemTop < windowHeight - 100) {
        setTimeout(() => {
          item.classList.add('active');
        }, index * 200);
      }
    });
  }
  
  window.addEventListener('scroll', animateTimeline);
  animateTimeline(); // Initial check
  
  // Handle navigation specifically for educ.html
  const navLinks = $$('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href.includes('index.html')) {
        e.preventDefault();
        window.location.href = href;
      }
      // For internal links on educ.html, let the default behavior handle it
    });
  });
}// Image Modal functionality - For all clickable images
function initImageModal() {
  console.log('initImageModal function started');
  
  const modal = $('#imageModal');
  const modalImg = $('#modalImage');
  const captionText = $('#modalCaption');
  const closeModal = $('.close-modal');
  
  console.log('Modal elements:', { modal, modalImg, captionText, closeModal });
  
  if (!modal || !modalImg) {
    console.log('Modal elements not found, exiting function');
    return;
  }
  
  // Get ALL clickable images from different sections
  let images = [];
  
  if (window.location.pathname.includes('educ.html')) {
    // On educ.html - target gallery images AND timeline images
    const galleryImages = $$('#gallery .gallery-item img');
    const timelineImages = $$('.timeline-image img');
    images = [...galleryImages, ...timelineImages];
    console.log('On educ.html - Found gallery images:', galleryImages.length, 'timeline images:', timelineImages.length);
  } else {
    // On index.html - target blog images
    images = $$('#blog .blog-image img');
    console.log('On index.html - Found blog images:', images.length);
  }
  
  console.log('Total images found:', images.length, images);
  
  // Add click event to all images
  images.forEach((img, index) => {
    console.log(`Adding click event to image ${index}:`, img.src);
    img.style.cursor = 'zoom-in';
    
    img.addEventListener('click', function() {
      console.log('Image clicked!', this.src);
      modal.style.display = 'block';
      modalImg.src = this.src;
      modalImg.alt = this.alt;
      if (captionText) {
        captionText.textContent = this.alt;
      }
      
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Close modal when clicking X
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      console.log('Close button clicked');
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }
  
  // Close modal when clicking outside the image
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      console.log('Modal background clicked');
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      console.log('Escape key pressed');
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
  
  console.log('initImageModal function completed');
  
}
function printCertificate() {
  const certificateImg = document.querySelector('.certificate-img');
  const imgUrl = certificateImg.src;
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print Certificate</title>
      <style>
        body { 
          margin: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }
        .certificate-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .certificate-header h1 {
          color: #333;
          margin-bottom: 5px;
        }
        .certificate-header p {
          color: #666;
        }
        img { 
          max-width: 100%;
          height: auto;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .print-actions {
          display: none;
        }
        @media print {
          .no-print { display: none; }
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="certificate-header">
        <h1>Cebu-Bohol Educational Tour Certificate</h1>
        <p>Certificate of Participation - Issued November 23, 2025</p>
      </div>
      <img src="${imgUrl}" alt="Educational Tour Certificate">
      <div class="print-actions no-print">
        <p>Print dialog will open automatically...</p>
      </div>
      <script>
        window.onload = function() {
          setTimeout(() => {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          }, 500);
        };
      </script>
    </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  printWindow.document.write(printContent);
  printWindow.document.close();
}// Certificate functions
function openCertificate() {
  // Use your existing image modal if you have one
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const certificateImg = document.querySelector('.certificate-thumbnail');
  
  if (modal && modalImg) {
    // If you have a modal set up
    modal.style.display = "block";
    modalImg.src = certificateImg.src;
    modalImg.alt = certificateImg.alt;
    
    // Add caption
    const caption = document.getElementById('modalCaption');
    if (caption) {
      caption.innerHTML = "Certificate of Completion - Cebu-Bohol Educational Tour 2025";
    }
  } else {
    // Fallback: open in new tab
    window.open(certificateImg.src, '_blank');
  }
}

function printCertificate() {
  const certificateImg = document.querySelector('.certificate-thumbnail');
  const imgUrl = certificateImg.src;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print Certificate</title>
      <style>
        body { 
          margin: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }
        .certificate-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .certificate-header h1 {
          color: #333;
          margin-bottom: 5px;
          font-size: 24px;
        }
        .certificate-header p {
          color: #666;
        }
        img { 
          max-width: 100%;
          height: auto;
          border-radius: 5px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        @media print {
          body { padding: 0; }
          .certificate-header { margin-bottom: 10px; }
        }
      </style>
    </head>
    <body>
      <div class="certificate-header">
        <h1>Cebu-Bohol Educational Tour Certificate</h1>
        <p>Certificate of Participation</p>
      </div>
      <img src="${imgUrl}" alt="Educational Tour Certificate">
      <script>
        window.onload = function() {
          setTimeout(() => {
            window.print();
            setTimeout(() => {
              window.close();
            }, 100);
          }, 500);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}// Add click functionality to guide items
document.addEventListener('DOMContentLoaded', function() {
  const guideItems = document.querySelectorAll('.guide-item');
  
  guideItems.forEach(item => {
    item.addEventListener('click', function() {
      const name = this.querySelector('h4').textContent;
      const role = this.querySelector('p').textContent;
      
      // You can customize what happens on click
      // Option 1: Alert (simple)
      // alert(`Name: ${name}\nRole: ${role}`);
      
      // Option 2: Console log (for debugging)
      console.log(`Clicked on: ${name} - ${role}`);
      
      // Option 3: Open a modal (you'd need to create the modal HTML)
      // openPersonModal(name, role, imageSrc);
    });
  });
});// Add click animation
guideItems.forEach(item => {
  item.addEventListener('click', function() {
    this.classList.add('clicked');
    setTimeout(() => {
      this.classList.remove('clicked');
    }, 300);
  });
});// Tab Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Set initial active tab based on URL hash or default to skills
  const initialHash = window.location.hash;
  let activeTab = 'skills';
  
  if (initialHash) {
    // Remove # from hash and check if it's a valid tab
    const tabName = initialHash.substring(1);
    if (['skills', 'projects', 'education', 'blog', 'contact'].includes(tabName)) {
      activeTab = tabName;
    }
  }
  
  // Function to switch tabs
  function switchTab(tabId) {
    // Update URL hash without scrolling
    history.replaceState(null, null, '#' + tabId);
    
    // Update active tab
    navTabs.forEach(tab => {
      if (tab.dataset.tab === tabId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Show active content
    tabContents.forEach(content => {
      if (content.id === tabId + '-tab') {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
    
    // Trigger reveal animation for the active section
    setTimeout(() => {
      const activeSection = document.querySelector('#' + tabId);
      if (activeSection) {
        activeSection.classList.add('active');
      }
    }, 50);
  }
  
  // Add click event to tabs
  navTabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      const tabId = this.dataset.tab;
      switchTab(tabId);
    });
  });
  
  // Initialize with active tab
  switchTab(activeTab);
  
  // Also support direct navigation via hash links
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (['skills', 'projects', 'education', 'blog', 'contact'].includes(hash)) {
      switchTab(hash);
    }
  });
});