window.addEventListener("load", function () {
    const splash = document.getElementById("splashScreen");

    setTimeout(function () {
      splash.classList.add("hide");

      setTimeout(function () {
        splash.remove();
      }, 650);
    }, 1600);
  });
  
// Initialize EmailJS
(function(){
  emailjs.init("qks5GXttjyPUHRc4f");
})();

// Create cosmic stars background
function createStars() {
  const starsContainer = document.getElementById('starsContainer');
  if (!starsContainer) return;
  
  // Create static twinkling stars
  for(let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    const size = Math.random() * 3 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDuration = (Math.random() * 3 + 2) + 's';
    star.style.animationDelay = Math.random() * 3 + 's';
    
    starsContainer.appendChild(star);
  }
  
  // Create floating stars
  for(let i = 0; i < 20; i++) {
    const star = document.createElement('div');
    star.className = 'star floating';
    
    const size = Math.random() * 2 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    
    const floatDuration = Math.random() * 10 + 15;
    const twinkleDuration = Math.random() * 2 + 1;
    
    star.style.animation = `float ${floatDuration}s linear infinite, twinkle ${twinkleDuration}s linear infinite`;
    star.style.animationDelay = Math.random() * 5 + 's';
    
    starsContainer.appendChild(star);
  }
  
  // Create shooting stars
  function createShootingStar() {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    
    const startX = Math.random() * 100;
    const startY = Math.random() * 50;
    const width = Math.random() * 100 + 80;
    
    shootingStar.style.width = width + 'px';
    shootingStar.style.left = startX + '%';
    shootingStar.style.top = startY + '%';
    shootingStar.style.animationDuration = (Math.random() * 1 + 5.5) + 's';
    
    starsContainer.appendChild(shootingStar);
    
    setTimeout(() => {
      shootingStar.remove();
    }, 3000);
  }
  
  // Create shooting stars at intervals
  setInterval(() => {
    if(Math.random() > 0.5) {
      createShootingStar();
    }
  }, 3000);
}

// Initialize stars when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createStars);
} else {
  createStars();
}

// Theme toggle with persistence
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

if(savedTheme === 'light') {
  root.classList.add('light');
}
themeToggle.textContent = root.classList.contains('light') ? '🌞' : '🌙';

themeToggle.addEventListener('click', () => {
  root.classList.toggle('light');
  const isLight = root.classList.contains('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  themeToggle.textContent = isLight ? '🌞' : '🌙';
});

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Avatar reveal functionality
const avatarThumb = document.getElementById('avatarThumb');
const avatarOverlay = document.getElementById('avatarOverlay');
const closeAvatar = document.getElementById('closeAvatar');

avatarThumb.addEventListener('click', () => {
  avatarOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling when overlay is open
});

closeAvatar.addEventListener('click', () => {
  avatarOverlay.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
});

// Close overlay when clicking on the dark background
avatarOverlay.addEventListener('click', (e) => {
  if(e.target === avatarOverlay) {
    avatarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close overlay with Escape key
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && avatarOverlay.classList.contains('active')) {
    avatarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Contact form submission with EmailJS
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener("submit", function(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());
  
  // Basic validation
  if(!data.name || !data.email || !data.message){
    formStatus.textContent = 'Please fill out all fields.';
    formStatus.style.color = 'var(--accent)';
    return;
  }
  
  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailPattern.test(data.email)){
    formStatus.textContent = 'Please enter a valid email address.';
    formStatus.style.color = 'var(--accent)';
    return;
  }
  
  // Show sending status
  formStatus.textContent = 'Sending message...';
  formStatus.style.color = 'var(--muted)';
  
  // Send email via EmailJS
  emailjs.sendForm(
    "service_hcbd68h",
    "template_5sscgwt",
    contactForm
  ).then(
    function() {
      formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
      formStatus.style.color = 'var(--accent)';
      contactForm.reset();
    },
    function(error) {
      formStatus.textContent = 'Failed to send message. Please try again or contact me directly via email.';
      formStatus.style.color = 'var(--accent)';
      console.error("EmailJS Error:", error);
    }
  );
});