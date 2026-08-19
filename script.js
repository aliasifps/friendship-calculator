/* ==========================================================================
   AMITY & KIN — JAVASCRIPT INTERACTIONS & ENGINE
   Friendship Calculator, Gallery Filters, Quote Engine, Card Canvas Exporter
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroParticles();
  initFriendshipCalculator();
  initGallery();
  initLightbox();
  initWisdomQuotes();
  initCardStudio();
  initPledgeAndShare();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & SCROLL BEHAVIOR
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('mainHeader');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-item');

  // Sticky header background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileBtn.querySelector('i');
      if (navLinks.classList.contains('open')) {
        icon.classList.remove('fa-bars-staggered');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars-staggered');
      }
    });

    // Close mobile menu on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars-staggered');
        }
      });
    });
  }

  // Active navigation highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-links a[href*='${sectionId}']`);

      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. HERO AMBIENT FLOATING PARTICLES
   -------------------------------------------------------------------------- */
function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const symbols = ['💖', '✨', '⭐', '🌟', '☕', '🎈', '🍀'];
  const particleCount = 12;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.className = 'floating-particle';
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Randomize initial positions & animation durations
    particle.style.position = 'absolute';
    particle.style.left = `${Math.random() * 95}%`;
    particle.style.top = `${Math.random() * 85 + 5}%`;
    particle.style.fontSize = `${Math.random() * 16 + 12}px`;
    particle.style.opacity = `${Math.random() * 0.4 + 0.15}`;
    particle.style.pointerEvents = 'none';
    particle.style.userSelect = 'none';
    particle.style.transition = 'transform 3s ease-in-out';
    particle.style.animation = `floatParticle ${Math.random() * 8 + 6}s ease-in-out infinite alternate`;
    particle.style.animationDelay = `${Math.random() * 5}s`;

    container.appendChild(particle);
  }

  // Add floating keyframe dynamically
  if (!document.getElementById('particleKeyframes')) {
    const style = document.createElement('style');
    style.id = 'particleKeyframes';
    style.textContent = `
      @keyframes floatParticle {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-30px) rotate(15deg); }
        100% { transform: translateY(15px) rotate(-15deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

/* --------------------------------------------------------------------------
   3. INTERACTIVE FRIENDSHIP CALCULATOR
   -------------------------------------------------------------------------- */
function initFriendshipCalculator() {
  const form = document.getElementById('friendshipForm');
  const calculateBtn = document.getElementById('calculateBtn');
  const resultContainer = document.getElementById('calcResult');
  const scoreNumber = document.getElementById('scoreNumber');
  const scoreProgressRing = document.getElementById('scoreProgressRing');
  const resultTitle = document.getElementById('resultTitle');
  const resultDesc = document.getElementById('resultDesc');
  const resultBadge = document.getElementById('resultBadge');
  const confettiPopBtn = document.getElementById('confettiPopBtn');
  const recalcBtn = document.getElementById('recalcBtn');
  const transferToCardBtn = document.getElementById('transferToCardBtn');

  // Trait elements
  const barLoyalty = document.getElementById('barLoyalty');
  const barChaos = document.getElementById('barChaos');
  const barTalks = document.getElementById('barTalks');
  const traitLoyalty = document.getElementById('traitLoyalty');
  const traitChaos = document.getElementById('traitChaos');
  const traitTalks = document.getElementById('traitTalks');

  if (!form || !calculateBtn) return;

  const bondDescriptions = {
    crime: [
      { title: "Chaos Syndicate Activated! 🔥", desc: "You two share one braincell, 10,000 inside jokes, and alibis ready for any emergency.", badge: "👑 Partners in Crime", min: 92, max: 99 },
      { title: "Unstoppable Mischief Makers! ⚡", desc: "Whenever you get together, peace is never an option and laughter is guaranteed.", badge: "💥 Dynamic Duo", min: 88, max: 96 }
    ],
    soul: [
      { title: "Soul Sibling Resonance! 🌟", desc: "An unspoken telepathic bond. One look across a crowded room and you already know everything.", badge: "✨ Celestial Bond", min: 95, max: 100 },
      { title: "Unshakeable Safe Haven! 🛡️", desc: "Zero masks required. Pure authenticity, emotional warmth, and lifetime loyalty.", badge: "💖 Pure Soulmate", min: 90, max: 97 }
    ],
    childhood: [
      { title: "Day-One Immortals! 🚀", desc: "From playground scrapes to adult dreams, time and distance can never fade this bond.", badge: "⭐ Day-One Royalty", min: 94, max: 100 },
      { title: "Living Memory Vaults! 📸", desc: "You knew each other before you even knew yourselves. Priceless shared history.", badge: "🌱 Rooted Bond", min: 91, max: 98 }
    ],
    adventure: [
      { title: "Wanderlust Renegades! 🌍", desc: "Spontaneous roadtrips, singing in cars, and making memories across the map.", badge: "🎒 Expedition Crew", min: 90, max: 99 },
      { title: "Horizon Chasers! 🌅", desc: "Life is never boring with you two. Every weekend has the potential for a new adventure.", badge: "✈️ Free Spirits", min: 89, max: 96 }
    ],
    workplace: [
      { title: "Survival Squad Legends! ☕", desc: "Bonded over countless coffees, surviving hectic days, and debriefing emergency rants.", badge: "💼 Coffee Warriors", min: 88, max: 97 },
      { title: "Sanity Keepers! 🎯", desc: "Making work bearable and everyday life twice as hilarious.", badge: "🤝 Co-Pilot Alliance", min: 87, max: 95 }
    ]
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name1 = document.getElementById('nameOne').value.trim();
    const name2 = document.getElementById('nameTwo').value.trim();
    const bondStyle = document.getElementById('bondStyle').value;

    if (!name1 || !name2) {
      showToast("Please enter both names to calculate synergy!", "error");
      return;
    }

    // Loading state
    calculateBtn.classList.add('loading');

    setTimeout(() => {
      calculateBtn.classList.remove('loading');
      resultContainer.classList.remove('hidden');

      // Deterministic friendly algorithm
      const seed = (name1.toLowerCase() + name2.toLowerCase() + bondStyle).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const vibeList = bondDescriptions[bondStyle] || bondDescriptions.crime;
      const vibeProfile = vibeList[seed % vibeList.length];

      // Final score between min and max (generously high and celebratory)
      const scoreRange = vibeProfile.max - vibeProfile.min;
      const finalScore = vibeProfile.min + (seed % (scoreRange + 1));

      // Calculate Trait metrics
      const loyaltyVal = Math.min(100, Math.max(88, finalScore + (seed % 5) - 2));
      const chaosVal = Math.min(100, Math.max(85, finalScore - (seed % 7) + 3));
      const talksVal = Math.min(100, Math.max(87, finalScore + ((seed * 3) % 6) - 1));

      // Set Text Content
      resultTitle.textContent = vibeProfile.title;
      resultDesc.textContent = `"${name1}" & "${name2}": ${vibeProfile.desc}`;
      resultBadge.textContent = vibeProfile.badge;

      // Animate Score Ring & Number
      animateCounter(scoreNumber, 0, finalScore, 1200);
      setRingProgress(scoreProgressRing, finalScore);

      // Animate Trait Bars
      setTimeout(() => {
        barLoyalty.style.width = `${loyaltyVal}%`;
        traitLoyalty.textContent = `${loyaltyVal}%`;

        barChaos.style.width = `${chaosVal}%`;
        traitChaos.textContent = `${chaosVal}%`;

        barTalks.style.width = `${talksVal}%`;
        traitTalks.textContent = `${talksVal}%`;
      }, 200);

      // Trigger Confetti
      triggerCelebration();

      // Scroll result into view smoothly on mobile
      if (window.innerWidth < 768) {
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

    }, 850);
  });

  // Confetti Pop Button
  if (confettiPopBtn) {
    confettiPopBtn.addEventListener('click', () => {
      triggerCelebration();
      showToast("🎉 Friendship energy maximized!");
    });
  }

  // Recalculate Button
  if (recalcBtn) {
    recalcBtn.addEventListener('click', () => {
      resultContainer.classList.add('hidden');
      document.getElementById('nameOne').focus();
    });
  }

  // Transfer to card maker
  if (transferToCardBtn) {
    transferToCardBtn.addEventListener('click', () => {
      const name1 = document.getElementById('nameOne').value.trim();
      const name2 = document.getElementById('nameTwo').value.trim();
      
      const cardSender = document.getElementById('cardSender');
      const cardRecipient = document.getElementById('cardRecipient');
      
      if (name1 && cardSender) cardSender.value = name1;
      if (name2 && cardRecipient) cardRecipient.value = name2;
      
      // Update preview
      updateCardPreview();
      
      const studioSection = document.getElementById('card-studio');
      if (studioSection) {
        studioSection.scrollIntoView({ behavior: 'smooth' });
      }
      showToast(`✨ Populated card with ${name1} and ${name2}!`);
    });
  }
}

// Progress Ring Helper
function setRingProgress(circleElement, percent) {
  if (!circleElement) return;
  const radius = circleElement.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  circleElement.style.strokeDasharray = `${circumference} ${circumference}`;
  circleElement.style.strokeDashoffset = offset;
}

// Number Counter Animation Helper
function animateCounter(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(easeOutQuad * (end - start) + start);
    element.textContent = `${current}%`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Canvas Confetti Celebration Trigger
function triggerCelebration() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff5e7e', '#ff9966', '#a855f7', '#06b6d4', '#ffd166']
    });

    // Secondary soft blast
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff5e7e', '#ff9966', '#a855f7']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff5e7e', '#06b6d4', '#ffd166']
      });
    }, 250);
  }
}

/* --------------------------------------------------------------------------
   4. GALLERY FILTERING
   -------------------------------------------------------------------------- */
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hide');
          item.style.animation = 'fadeInDown 0.4s ease forwards';
        } else {
          item.classList.add('hide');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxClose');
  const modalImg = document.getElementById('lightboxImg');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalQuote = document.getElementById('lightboxQuote');
  const modalAuthor = document.getElementById('lightboxAuthor');

  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    const trigger = item.querySelector('.view-lightbox-btn') || item;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || 'Friendship Memory';
      const quote = item.getAttribute('data-quote') || '';
      const author = item.getAttribute('data-author') || 'Unsplash Photography';

      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modalTitle.textContent = title;
      modalQuote.textContent = `"${quote}"`;
      modalAuthor.textContent = author;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. WISDOM QUOTES ENGINE
   -------------------------------------------------------------------------- */
function initWisdomQuotes() {
  const quotes = [
    { text: "A real friend is one who walks in when the rest of the world walks out.", author: "Walter Winchell" },
    { text: "Friendship is born at that moment when one person says to another: 'What! You too? I thought I was the only one.'", author: "C.S. Lewis" },
    { text: "A single rose can be my garden... a single friend, my world.", author: "Leo Buscaglia" },
    { text: "True friendship comes when the silence between two people is comfortable.", author: "David Tyson Gentry" },
    { text: "Walking with a friend in the dark is better than walking alone in the light.", author: "Helen Keller" },
    { text: "Friendship is the hardest thing in the world to explain. It's not something you learn in school. But if you haven't learned the meaning of friendship, you really haven't learned anything.", author: "Muhammad Ali" },
    { text: "Lots of people want to ride with you in the limo, but what you want is someone who will take the bus with you when the limo breaks down.", author: "Oprah Winfrey" },
    { text: "There is nothing on this earth more to be prized than true friendship.", author: "Thomas Aquinas" }
  ];

  let currentIndex = 0;
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const prevBtn = document.getElementById('prevQuoteBtn');
  const nextBtn = document.getElementById('nextQuoteBtn');
  const randomBtn = document.getElementById('randomQuoteBtn');
  const copyBtn = document.getElementById('copyQuoteBtn');
  const copyText = document.getElementById('copyQuoteText');

  function renderQuote(index) {
    if (!quoteText || !quoteAuthor) return;
    quoteText.style.opacity = 0;
    quoteAuthor.style.opacity = 0;

    setTimeout(() => {
      quoteText.textContent = `"${quotes[index].text}"`;
      quoteAuthor.textContent = `— ${quotes[index].author}`;
      quoteText.style.opacity = 1;
      quoteAuthor.style.opacity = 1;
    }, 200);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % quotes.length;
      renderQuote(currentIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
      renderQuote(currentIndex);
    });
  }

  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * quotes.length);
      } while (nextIndex === currentIndex);
      currentIndex = nextIndex;
      renderQuote(currentIndex);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const fullQuote = `${quoteText.textContent} ${quoteAuthor.textContent}`;
      navigator.clipboard.writeText(fullQuote).then(() => {
        copyText.textContent = "Copied!";
        showToast("📋 Quote copied to clipboard!");
        setTimeout(() => {
          copyText.textContent = "Copy Quote";
        }, 2000);
      }).catch(() => {
        showToast("Quote ready to share!");
      });
    });
  }
}

/* --------------------------------------------------------------------------
   7. VIRTUAL FRIENDSHIP CARD & CANVAS PNG EXPORTER
   -------------------------------------------------------------------------- */
function updateCardPreview() {
  const senderInput = document.getElementById('cardSender');
  const recipientInput = document.getElementById('cardRecipient');
  const messageInput = document.getElementById('cardMessage');

  const previewSender = document.getElementById('previewSender');
  const previewRecipient = document.getElementById('previewRecipient');
  const previewMessage = document.getElementById('previewMessage');

  if (senderInput && previewSender) previewSender.textContent = senderInput.value || "Alex";
  if (recipientInput && previewRecipient) previewRecipient.textContent = recipientInput.value || "Jordan";
  if (messageInput && previewMessage) previewMessage.textContent = `"${messageInput.value || "Thank you for being in my life!"}"`;
}

function initCardStudio() {
  const senderInput = document.getElementById('cardSender');
  const recipientInput = document.getElementById('cardRecipient');
  const messageInput = document.getElementById('cardMessage');
  const cardContainer = document.getElementById('cardPreviewContainer');
  const previewBadge = document.getElementById('previewBadge');
  const downloadBtn = document.getElementById('downloadCardBtn');

  // Input event listeners
  [senderInput, recipientInput, messageInput].forEach(el => {
    if (el) el.addEventListener('input', updateCardPreview);
  });

  // Theme palette pills
  const themeBtns = document.querySelectorAll('.theme-pill-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const palette = btn.getAttribute('data-palette');
      cardContainer.className = `friendship-card-canvas-preview theme-${palette}`;
    });
  });

  // Badge options
  const badgeBtns = document.querySelectorAll('.badge-opt-btn');
  badgeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      badgeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const badgeText = btn.getAttribute('data-badge');
      if (previewBadge) previewBadge.textContent = badgeText;
    });
  });

  // Download card as PNG using HTML5 Canvas
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      exportCardAsImage();
    });
  }
}

function exportCardAsImage() {
  const canvas = document.getElementById('exportCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // High-resolution canvas dimensions
  const width = 1200;
  const height = 750;
  canvas.width = width;
  canvas.height = height;

  const sender = document.getElementById('cardSender').value || "Alex";
  const recipient = document.getElementById('cardRecipient').value || "Jordan";
  const message = document.getElementById('cardMessage').value || "Thank you for being my constant rock!";
  const badge = document.getElementById('previewBadge').textContent || "⭐ Best Friend For Life";

  // Determine current active theme colors
  const activeThemeBtn = document.querySelector('.theme-pill-btn.active');
  const theme = activeThemeBtn ? activeThemeBtn.getAttribute('data-palette') : 'sunset';

  let gradStart = '#f12711';
  let gradEnd = '#f5af19';
  let textColor = '#ffffff';

  if (theme === 'ocean') {
    gradStart = '#134e5e';
    gradEnd = '#71b280';
  } else if (theme === 'aurora') {
    gradStart = '#8a2387';
    gradEnd = '#f27121';
  } else if (theme === 'rose') {
    gradStart = '#ee9ca7';
    gradEnd = '#ffdde1';
    textColor = '#331d24';
  }

  // Draw Background Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, gradStart);
  grad.addColorStop(1, gradEnd);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Draw subtle decorative borders
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Top Badge Pill
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  roundRect(ctx, 70, 70, 320, 50, 25, true, false);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Outfit, sans-serif';
  ctx.fillText(badge, 95, 103);

  // Salutation
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.85;
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DEAREST', 70, 180);

  // Recipient Name
  ctx.globalAlpha = 1;
  ctx.font = 'bold 54px Outfit, sans-serif';
  ctx.fillText(recipient, 70, 245);

  // Message (with word wrap)
  ctx.font = 'italic 30px "Playfair Display", Georgia, serif';
  wrapText(ctx, `"${message}"`, 70, 330, width - 140, 44);

  // Signoff Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(70, height - 150);
  ctx.lineTo(width - 70, height - 150);
  ctx.stroke();

  // Signoff Text
  ctx.globalAlpha = 0.85;
  ctx.font = '22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Forever with love & gratitude,', 70, height - 100);

  // Sender Name
  ctx.globalAlpha = 1;
  ctx.font = 'bold 36px Outfit, sans-serif';
  ctx.fillText(sender, 70, height - 55);

  // Watermark Seal on bottom right
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.font = 'bold 22px Outfit, sans-serif';
  ctx.fillText('Amity & Kin Friendship Certificate 💖', width - 440, height - 60);

  // Trigger Download
  try {
    const dataURL = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.download = `friendship-certificate-${recipient.toLowerCase()}.png`;
    downloadLink.href = dataURL;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    showToast("🎉 Friendship Card downloaded in High Resolution!");
    triggerCelebration();
  } catch (err) {
    showToast("Error exporting card. Please try again.", "error");
  }
}

// Canvas Helpers
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

/* --------------------------------------------------------------------------
   8. PLEDGE & SOCIAL SHARE
   -------------------------------------------------------------------------- */
function initPledgeAndShare() {
  const sendPledgeBtn = document.getElementById('sendPledgeBtn');
  const copySiteLinkBtn = document.getElementById('copySiteLinkBtn');

  const pledgeMessage = "Here is the Friendship Pledge: 'I promise to show up in the storms, celebrate in the sunshine, respect your growth, and never let busy schedules erase our bond.' ❤️";

  if (sendPledgeBtn) {
    sendPledgeBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'The Friendship Pledge',
          text: pledgeMessage,
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(pledgeMessage).then(() => {
          showToast("✨ Friendship Pledge copied to clipboard!");
        });
      }
    });
  }

  if (copySiteLinkBtn) {
    copySiteLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast("🔗 Website link copied to clipboard!");
      });
    });
  }
}

/* --------------------------------------------------------------------------
   9. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const icon = type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3200);
}
