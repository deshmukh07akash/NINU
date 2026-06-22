/* ==========================================
   A Little Journey to My Heart 💕
   Main JavaScript - Interactivity & Animations
   ========================================== */

// ====== CONFIGURATION ======
// Customize these values to personalize your website!
const CONFIG = {
  // Gallery memories - photos and videos from the images folder
  galleryImages: [
    { src: 'images/1.jpg', type: 'image' },
    { src: 'images/3.jpg', type: 'image' },
    { src: 'images/8.jpg', type: 'image' },
    { src: 'images/video1.mp4', type: 'video' },
    { src: 'images/video2.mp4', type: 'video' },
    { src: 'images/video3.mp4', type: 'video' },
    { src: 'images/video6.mp4', type: 'video' },
    { src: 'images/video7.mp4', type: 'video' },
    { src: 'images/video8.mp4', type: 'video' },
  ],
  // Floating photo/video overlay memories (shown around the confession video)
  overlayPhotos: [
    
    { src: 'images/1.jpg', type: 'image' },
    { src: 'images/3.jpg', type: 'image' },
    { src: 'images/8.jpg', type: 'image' },
    { src: 'images/video1.mp4', type: 'video' },
    { src: 'images/video2.mp4', type: 'video' },
    { src: 'images/video3.mp4', type: 'video' },
    { src: 'images/video6.mp4', type: 'video' },
    { src: 'images/video7.mp4', type: 'video' },
    { src: 'images/video8.mp4', type: 'video' },
  ],
  // Doraemon gadget emojis that appear randomly
  doraemonGadgets: ['🚁', '🏮', '⏰', '🔔', '🪄', '🎋', '📞', '👒', '🔦', '🧲'],
  // Floating heart colors
  heartColors: ['#FF69B4', '#FFB6C1', '#FF1493', '#FFC0CB', '#FF6B8A', '#E91E63'],
  // Confetti colors
  confettiColors: ['#FF69B4', '#FFB6C1', '#87CEEB', '#E6E6FA', '#FFD700', '#FF6B8A', '#0099DD', '#FFC0CB'],
};

// ====== STATE ======
let currentPage = 'page1';
let musicPlaying = false;
let isDarkMode = true;
let galleryCurrentIndex = 0;
let confettiAnimationId = null;
let easterEggTimeout = null;
let storyCardObserver = null;

function getMediaType(media) {
  if (media.type) return media.type;
  return /\.(mp4|webm|ogg|mov|mkv)$/i.test(media.src || media) ? 'video' : 'image';
}

function createMediaElement(media, className, altText, options = {}) {
  const src = media.src || media;
  const type = getMediaType(media);
  const {
    autoplay = false,
    muted = false,
    controls = false,
    playbackRate = 1,
  } = options;

  if (type === 'video') {
    const video = document.createElement('video');
    video.src = src;
    video.className = className;
    video.muted = muted;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.controls = controls;
    video.playbackRate = playbackRate;
    video.addEventListener('loadedmetadata', () => {
      video.playbackRate = playbackRate;
    });
    if (autoplay) {
      video.autoplay = true;
      video.play().catch(() => {});
    }
    return video;
  }

  const img = document.createElement('img');
  img.src = src;
  img.alt = altText;
  img.className = className;
  img.loading = 'lazy';
  return img;
}

function shuffleMedia(mediaItems) {
  const shuffled = [...mediaItems];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getConfessionMediaSequence() {
  const images = shuffleMedia(CONFIG.overlayPhotos.filter(media => getMediaType(media) === 'image'));
  const videos = shuffleMedia(CONFIG.overlayPhotos.filter(media => getMediaType(media) === 'video'));
  const mixed = [];
  const groupCount = Math.max(Math.ceil(videos.length / 2), images.length);

  for (let i = 0; i < groupCount; i++) {
    const firstVideo = videos[i * 2];
    const secondVideo = videos[i * 2 + 1];
    const image = images[i];

    if (firstVideo) mixed.push(firstVideo);
    if (secondVideo) mixed.push(secondVideo);
    if (image) mixed.push(image);
  }

  return mixed;
}

function getConfessionOverlayMedia() {
  return getConfessionMediaSequence();
}

function getConfessionOverlayPositions(count) {
  const leftPositions = [
    { top: '16%', left: '4%' },
    { top: '34%', left: '3%' },
    { top: '55%', left: '5%' },
    { top: '75%', left: '4%' },
    { top: '88%', left: '10%' },
  ];
  const rightPositions = [
    { top: '17%', right: '4%' },
    { top: '36%', right: '3%' },
    { top: '56%', right: '5%' },
    { top: '76%', right: '4%' },
    { top: '88%', right: '10%' },
  ];
  const positions = [];
  const leftPool = shuffleMedia(leftPositions);
  const rightPool = shuffleMedia(rightPositions);

  for (let i = 0; i < count; i++) {
    const pool = i % 2 === 0 ? leftPool : rightPool;
    positions.push(pool[Math.floor(i / 2) % pool.length]);
  }

  return positions;
}

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Generate floating elements
  generateFloatingHearts();
  generateFloatingStars();
  generateStoryHearts();
  generateGallery();
  generateConfessionFilmStrip();

  // Setup scroll observer for timeline
  setupScrollObserver();

  // Setup video events
  setupVideoEvents();

  // Setup music toggle
  setupMusicToggle();

  // Setup easter eggs
  setupEasterEggs();

  // Show navigation after a delay
  setTimeout(() => {
    document.getElementById('main-nav').classList.add('visible');
  }, 2000);

  // Add double-click listener to floating hearts
  document.getElementById('floating-layer').addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('floating-heart')) {
      showEasterEggToast('You make ordinary moments extraordinary. ✨');
    }
  });
});

// ====== PAGE NAVIGATION ======
function navigateToSection(sectionId) {
  // Hide all pages
  document.querySelectorAll('.page-section').forEach(section => {
    section.style.display = 'none';
  });

  // Show target page
  const target = document.getElementById(sectionId);
  if (target) {
    target.style.display = '';
    target.classList.add('fading-in');
    setTimeout(() => target.classList.remove('fading-in'), 1000);
    currentPage = sectionId;
    window.scrollTo(0, 0);

    // Re-trigger timeline animations if going to page2
    if (sectionId === 'page2') {
      setTimeout(() => {
        resetStoryAnimations();
        setupScrollObserver();
      }, 300);
    }
  }
}

// ====== PAGE TRANSITIONS ======

// Transition from Page 1 to Page 2 with Anywhere Door
function transitionToPage2() {
  const overlay = document.getElementById('door-overlay');
  overlay.classList.remove('hidden');
  const doorLeft = document.getElementById('door-left');
  const doorRight = document.getElementById('door-right');
  const doorDoraemon = document.getElementById('door-doraemon');

  // Show the door
  overlay.style.pointerEvents = 'all';
  overlay.style.background = 'rgba(0,0,0,0.3)';
  overlay.style.transition = 'background 0.5s ease';

  // Show Doraemon on the door
  doorDoraemon.style.opacity = '1';
  doorDoraemon.style.transition = 'opacity 0.5s ease 0.3s';

  // Open the doors
  setTimeout(() => {
    doorLeft.classList.add('door-open-left');
    doorRight.classList.add('door-open-right');
  }, 500);

  // Transition to page 2
  setTimeout(() => {
    document.getElementById('page1').style.display = 'none';
    document.getElementById('page2').style.display = '';
    document.getElementById('page2').classList.add('fading-in');
    currentPage = 'page2';
    window.scrollTo(0, 0);

    // Re-trigger timeline animations
    setTimeout(() => {
      resetStoryAnimations();
      setupScrollObserver();
    }, 500);
  }, 1500);

  // Clean up door
  setTimeout(() => {
    overlay.style.background = 'transparent';
    overlay.style.pointerEvents = 'none';
    overlay.classList.add('hidden');
    doorLeft.classList.remove('door-open-left');
    doorRight.classList.remove('door-open-right');
    doorLeft.style.transform = 'perspective(800px) rotateY(0deg)';
    doorRight.style.transform = 'perspective(800px) rotateY(0deg)';
    doorDoraemon.style.opacity = '0';
  }, 2500);
}

// Transition from Page 2 to Page 3 with fade
function transitionToPage3() {
  const page2 = document.getElementById('page2');
  const page3 = document.getElementById('page3');

  page2.classList.add('fading-out');

  setTimeout(() => {
    page2.style.display = 'none';
    page2.classList.remove('fading-out');
    page3.style.display = '';
    page3.classList.add('fading-in');
    currentPage = 'page3';
    window.scrollTo(0, 0);
    setTimeout(() => page3.classList.remove('fading-in'), 1000);
  }, 800);
}

// ====== FLOATING ELEMENTS ======
function generateFloatingHearts() {
  const layer = document.getElementById('floating-layer');
  const hearts = ['❤️', '💕', '💗', '💖', '💘', '💝', '🩷', '♥️'];

  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.setProperty('--left', Math.random() * 100 + '%');
    heart.style.setProperty('--duration', (8 + Math.random() * 12) + 's');
    heart.style.setProperty('--delay', (Math.random() * 10) + 's');
    heart.style.setProperty('--size', (0.8 + Math.random() * 1.2) + 'rem');
    heart.style.setProperty('--color', CONFIG.heartColors[Math.floor(Math.random() * CONFIG.heartColors.length)]);
    layer.appendChild(heart);
  }
}

function generateFloatingStars() {
  const layer = document.getElementById('floating-layer');
  const stars = ['✨', '⭐', '🌟', '💫', '✧', '⋆'];

  for (let i = 0; i < 10; i++) {
    const star = document.createElement('span');
    star.className = 'floating-star';
    star.textContent = stars[Math.floor(Math.random() * stars.length)];
    star.style.setProperty('--left', Math.random() * 100 + '%');
    star.style.setProperty('--top', Math.random() * 100 + '%');
    star.style.setProperty('--duration', (2 + Math.random() * 4) + 's');
    star.style.setProperty('--delay', (Math.random() * 5) + 's');
    star.style.setProperty('--size', (0.6 + Math.random() * 0.8) + 'rem');
    star.style.color = Math.random() > 0.5 ? '#FFD700' : '#FFB6C1';
    layer.appendChild(star);
  }
}

function generateStoryHearts() {
  const storyHeartLayer = document.querySelector('#page2 .hearts-bg');
  if (!storyHeartLayer) return;

  storyHeartLayer.innerHTML = '';
  const hearts = ['❤️', '💕', '💗', '💖', '💘', '💝', '🩷', '♥️'];

  for (let i = 0; i < 42; i++) {
    const heart = document.createElement('span');
    heart.className = 'story-floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.setProperty('--left', Math.random() * 100 + '%');
    heart.style.setProperty('--top', Math.random() * 100 + '%');
    heart.style.setProperty('--duration', (10 + Math.random() * 16) + 's');
    heart.style.setProperty('--delay', (-Math.random() * 16) + 's');
    heart.style.setProperty('--size', (0.75 + Math.random() * 1.5) + 'rem');
    heart.style.setProperty('--drift', ((Math.random() * 70) - 35) + 'px');
    heart.style.color = CONFIG.heartColors[Math.floor(Math.random() * CONFIG.heartColors.length)];
    storyHeartLayer.appendChild(heart);
  }
}

// ====== SCROLL OBSERVER FOR TIMELINE ======
function setupScrollObserver() {
  const cards = document.querySelectorAll('.timeline-card');

  if (storyCardObserver) {
    storyCardObserver.disconnect();
  }

  storyCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.style.opacity = '1';
        playStoryCardReaction(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  cards.forEach(card => {
    storyCardObserver.observe(card);
  });
}

function resetStoryAnimations() {
  document.querySelectorAll('#page2 .timeline-card').forEach(card => {
    card.classList.remove('visible', 'reaction-active');
    card.style.opacity = '';
    delete card.dataset.reacted;
  });
}

function playStoryCardReaction(card) {
  if (card.dataset.reacted === 'true') return;
  card.dataset.reacted = 'true';
  card.classList.add('reaction-active');
  popDoraemonGadget(card);
}

function popDoraemonGadget(card) {
  const storySection = document.getElementById('page2');
  if (!storySection) return;

  const cardBox = card.querySelector('.story-card-content') || card.querySelector('.group');
  const gadget = document.createElement('span');
  gadget.className = 'story-gadget-pop';
  gadget.textContent = CONFIG.doraemonGadgets[Math.floor(Math.random() * CONFIG.doraemonGadgets.length)];

  const cardRect = (cardBox || card).getBoundingClientRect();
  const sectionRect = storySection.getBoundingClientRect();
  const appearsOnRight = card.classList.contains('md:flex-row-reverse');
  const x = cardRect.left - sectionRect.left + (appearsOnRight ? -12 : cardRect.width - 12);
  const y = cardRect.top - sectionRect.top + 14;

  gadget.style.left = `${Math.max(16, Math.min(x, sectionRect.width - 48))}px`;
  gadget.style.top = `${Math.max(120, y)}px`;
  storySection.appendChild(gadget);
  setTimeout(() => gadget.remove(), 2200);
}

// ====== VIDEO PLAYER ======
function setupVideoEvents() {
  const video = document.getElementById('confession-video');
  const playOverlay = document.getElementById('video-play-overlay');
  const placeholder = document.getElementById('video-placeholder');

  // Check if video source is valid
  video.addEventListener('loadeddata', () => {
    if (placeholder) placeholder.style.display = 'none';
  });

  video.addEventListener('error', () => {
    // Video not found - keep placeholder visible
    if (placeholder) placeholder.style.display = '';
  });

  // When video starts playing
  video.addEventListener('play', () => {
    playOverlay.style.opacity = '0';
    playOverlay.style.pointerEvents = 'none';
    setVideoPauseButtonState(true);
    stopBackgroundMusic();
    startConfessionFilmStrip();
    startPhotoOverlay();
  });

  // When video is paused
  video.addEventListener('pause', () => {
    playOverlay.style.opacity = '1';
    playOverlay.style.pointerEvents = 'all';
    setVideoPauseButtonState(false);
    stopConfessionFilmStrip();
    stopPhotoOverlay();
  });

  // When video ends
  video.addEventListener('ended', () => {
    stopConfessionFilmStrip();
    stopPhotoOverlay();
    showFinalMessage();
  });
}

function playVideo() {
  const video = document.getElementById('confession-video');

  // Try to play - if no valid source, show the message directly
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Video can't play (no source) - show final message
      showFinalMessage();
    });
  }
}

function toggleVideoPlayback() {
  const video = document.getElementById('confession-video');
  if (!video) return;

  if (video.paused) {
    playVideo();
  } else {
    video.pause();
  }
}

function setVideoPauseButtonState(isPlaying) {
  const btn = document.getElementById('video-pause-toggle');
  const pauseIcon = document.getElementById('video-pause-icon');
  const playIcon = document.getElementById('video-play-icon');
  if (!btn || !pauseIcon || !playIcon) return;

  btn.classList.toggle('opacity-0', !isPlaying);
  btn.classList.toggle('pointer-events-none', !isPlaying);
  pauseIcon.classList.toggle('hidden', !isPlaying);
  playIcon.classList.toggle('hidden', isPlaying);
}

// ====== CONFESSION FILM STRIP ======
function generateConfessionFilmStrip() {
  const track = document.getElementById('film-strip-track');
  if (!track) return;

  track.innerHTML = '';
  const confessionMedia = getConfessionMediaSequence();
  const loopImages = [...confessionMedia, ...confessionMedia];

  loopImages.forEach((media, index) => {
    const frame = document.createElement('div');
    frame.className = 'film-frame';

    const mediaEl = createMediaElement(media, '', '', {
      autoplay: true,
      muted: true,
      playbackRate: 1.5,
    });
    if (mediaEl.tagName === 'IMG') {
      mediaEl.loading = index < 8 ? 'eager' : 'lazy';
    }
    frame.appendChild(mediaEl);
    track.appendChild(frame);
  });
}

function startConfessionFilmStrip() {
  const strip = document.getElementById('confession-film-strip');
  if (!strip) return;
  strip.classList.add('is-running');
}

function stopConfessionFilmStrip() {
  const strip = document.getElementById('confession-film-strip');
  if (!strip) return;
  strip.classList.remove('is-running');
}

// ====== PHOTO OVERLAY (floating photos around video) ======
let photoOverlayActive = false;
let photoOverlayInterval = null;
let gadgetStickerInterval = null;

function startPhotoOverlay() {
  const overlay = document.getElementById('photo-overlay');
  overlay.style.opacity = '1';
  photoOverlayActive = true;
  overlay.innerHTML = '';

  const confessionMedia = getConfessionOverlayMedia();
  // Add every memory as repeating groups: 2 videos, then 1 image.
  const positions = getConfessionOverlayPositions(confessionMedia.length);

  positions.forEach((pos, i) => {
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-float-item';
    const rotation = (Math.random() - 0.5) * 20 + 'deg';
    photoItem.style.setProperty('--rotation', rotation);
    photoItem.style.setProperty('--rot', rotation);
    photoItem.style.setProperty('--duration', (8 + Math.random() * 6) + 's');
    photoItem.style.setProperty('--delay', (i * 1.5) + 's');

    if (pos.top) photoItem.style.top = pos.top;
    if (pos.bottom) photoItem.style.bottom = pos.bottom;
    if (pos.left) photoItem.style.left = pos.left;
    if (pos.right) photoItem.style.right = pos.right;

    const media = confessionMedia[i];
    const mediaEl = createMediaElement(media, '', 'Precious memory', {
      autoplay: true,
      muted: true,
      playbackRate: 1.5,
    });
    photoItem.appendChild(mediaEl);
    overlay.appendChild(photoItem);
  });

  // Add sparkle particles
  for (let i = 0; i < 15; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'overlay-sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 3 + 's';
    overlay.appendChild(sparkle);
  }

  // Add occasional heart bursts
  photoOverlayInterval = setInterval(() => {
    if (!photoOverlayActive) return;
    const heart = document.createElement('div');
    heart.className = 'overlay-heart-burst';
    heart.textContent = ['❤️', '💕', '💗', '💖'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = Math.random() * 100 + '%';
    overlay.appendChild(heart);
    setTimeout(() => heart.remove(), 2000);
  }, 2000);

  // Add random Doraemon/capybara stickers
  gadgetStickerInterval = setInterval(() => {
    if (!photoOverlayActive) {
      clearInterval(gadgetStickerInterval);
      return;
    }
    const sticker = document.createElement('div');
    sticker.className = 'gadget-sticker';
    sticker.textContent = CONFIG.doraemonGadgets[Math.floor(Math.random() * CONFIG.doraemonGadgets.length)];
    sticker.style.left = Math.random() * 90 + '%';
    sticker.style.top = Math.random() * 90 + '%';
    sticker.style.animationDelay = Math.random() * 2 + 's';
    overlay.appendChild(sticker);
    setTimeout(() => sticker.remove(), 4000);
  }, 3000);
}

function stopPhotoOverlay() {
  const overlay = document.getElementById('photo-overlay');
  photoOverlayActive = false;

  if (photoOverlayInterval) {
    clearInterval(photoOverlayInterval);
    photoOverlayInterval = null;
  }
  if (gadgetStickerInterval) {
    clearInterval(gadgetStickerInterval);
    gadgetStickerInterval = null;
  }

  // Fade out and remove children after animation
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.innerHTML = '';
  }, 1000);
}

// ====== FINAL MESSAGE ======
function showFinalMessage() {
  const finalMsg = document.getElementById('final-message');
  finalMsg.style.display = '';

  // Animate in
  setTimeout(() => {
    finalMsg.style.opacity = '1';
  }, 100);

  // Show proposal question after a pause
  setTimeout(() => {
    const question = document.getElementById('proposal-question');
    question.style.opacity = '1';
  }, 3000);
}

// ====== PROPOSAL RESPONSES ======
function handleYes() {
  startConfetti();
  playCheerAudio();
  triggerPaperBombBlast();

  const dance = document.getElementById('doraemon-dance');
  dance.style.opacity = '1';
  dance.classList.add('is-celebrating');

  showResponse('You just made me the happiest person alive. 💕', 'yes');
  createHeartBurst();

  setTimeout(() => {
    stopConfetti();
  }, 10000);

  setTimeout(() => {
    dance.style.opacity = '0';
    dance.classList.remove('is-celebrating');
  }, 12000);
}

function playCheerAudio() {
  const cheer = document.getElementById('cheer-audio');
  if (!cheer) return;

  cheer.currentTime = 0;
  cheer.volume = 0.9;
  const playPromise = cheer.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      showEasterEggToast('Add cheer.mp3 beside index.html to play the celebration sound.');
    });
  }
}

function triggerPaperBombBlast() {
  const layer = document.getElementById('paper-blast-layer');
  if (!layer) return;

  layer.innerHTML = '';
  const colors = ['#ff69b4', '#ffd447', '#29c7ff', '#ffffff', '#ff8da1', '#8df7d5', '#b8e4f0'];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight * 0.48;

  for (let i = 0; i < 110; i++) {
    const paper = document.createElement('span');
    const angle = Math.random() * Math.PI * 2;
    const distance = 170 + Math.random() * 430;

    paper.className = 'paper-blast-piece';
    paper.style.left = `${centerX}px`;
    paper.style.top = `${centerY}px`;
    paper.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    paper.style.setProperty('--y', `${Math.sin(angle) * distance - 120}px`);
    paper.style.setProperty('--rot', `${Math.random() * 960 - 480}deg`);
    paper.style.setProperty('--delay', `${Math.random() * 0.25}s`);
    paper.style.setProperty('--paper-color', colors[Math.floor(Math.random() * colors.length)]);

    if (i % 9 === 0) {
      paper.textContent = ['YES!', '💕', '🎉', 'YAY!'][Math.floor(Math.random() * 4)];
      paper.classList.add('paper-blast-word');
    }

    layer.appendChild(paper);
  }

  const flash = document.createElement('div');
  flash.className = 'paper-blast-flash';
  layer.appendChild(flash);

  setTimeout(() => {
    layer.innerHTML = '';
  }, 3600);
}

function handleNeedTime() {
  // Gentle reassuring animation
  showResponse('Take all the time you need. No matter what, thank you for listening to my heart. 💙', 'time');
  // Gentle floating hearts
  createGentleHeartAnimation();
}

function showResponse(message, type) {
  const responseDiv = document.getElementById('response-message');
  const content = document.getElementById('response-content');

  responseDiv.style.display = '';
  content.innerHTML = `
    <p class="font-cute text-lg md:text-2xl ${type === 'yes' ? 'text-romantic-rose dark:text-romantic-pink' : 'text-romantic-blue dark:text-romantic-sky'} leading-relaxed mb-4">
      ${message}
    </p>
    ${type === 'yes' ? `
      <div class="flex justify-center gap-3 text-3xl mt-4">
        <span class="animate-bounce" style="animation-delay: 0s">🎉</span>
        <span class="animate-bounce" style="animation-delay: 0.1s">💕</span>
        <span class="animate-bounce" style="animation-delay: 0.2s">🎊</span>
        <span class="animate-bounce" style="animation-delay: 0.3s">💖</span>
        <span class="animate-bounce" style="animation-delay: 0.4s">🥳</span>
      </div>
    ` : `
      <div class="flex justify-center mt-4">
        <svg viewBox="0 0 60 50" class="w-14 h-12 opacity-60">
          <ellipse cx="30" cy="30" rx="22" ry="15" fill="#D4B275"/>
          <ellipse cx="30" cy="30" rx="20" ry="13" fill="#E4C285"/>
          <circle cx="22" cy="20" r="6" fill="#D4B275"/>
          <circle cx="38" cy="20" r="6" fill="#D4B275"/>
          <circle cx="24" cy="19" r="1.5" fill="#333"/>
          <circle cx="36" cy="19" r="1.5" fill="#333"/>
          <ellipse cx="30" cy="23" rx="2.5" ry="1.5" fill="#8B6914"/>
          <path d="M 26 26 Q 30 29 34 26" fill="none" stroke="#8B6914" stroke-width="1"/>
          <circle cx="20" cy="21" r="2.5" fill="#FFB6C1" opacity="0.4"/>
          <circle cx="40" cy="21" r="2.5" fill="#FFB6C1" opacity="0.4"/>
        </svg>
      </div>
    `}
  `;

  setTimeout(() => {
    content.style.opacity = '1';
  }, 100);
}

// ====== HEART BURST EFFECT ======
function createHeartBurst() {
  const container = document.getElementById('floating-layer');
  const hearts = ['❤️', '💕', '💗', '💖', '💘', '💝', '🩷'];

  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const heart = document.createElement('span');
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.position = 'fixed';
      heart.style.left = (40 + Math.random() * 20) + '%';
      heart.style.top = '50%';
      heart.style.fontSize = (1 + Math.random() * 2) + 'rem';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '80';
      heart.style.transition = 'all 2s ease-out';
      heart.style.opacity = '1';
      container.appendChild(heart);

      // Animate outward
      requestAnimationFrame(() => {
        heart.style.transform = `translate(${(Math.random() - 0.5) * 400}px, ${-200 - Math.random() * 300}px) rotate(${Math.random() * 360}deg)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => heart.remove(), 2500);
    }, i * 50);
  }
}

function createGentleHeartAnimation() {
  const container = document.getElementById('floating-layer');
  const hearts = ['💙', '💕', '🩵', '💗'];

  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const heart = document.createElement('span');
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.position = 'fixed';
      heart.style.left = (30 + Math.random() * 40) + '%';
      heart.style.bottom = '-20px';
      heart.style.fontSize = (1 + Math.random()) + 'rem';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '80';
      heart.style.transition = 'all 4s ease-out';
      heart.style.opacity = '0.8';
      container.appendChild(heart);

      requestAnimationFrame(() => {
        heart.style.transform = `translateY(-${300 + Math.random() * 200}px)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => heart.remove(), 4500);
    }, i * 300);
  }
}

// ====== CONFETTI ======
function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiPieces = [];
  const numberOfPieces = 150;

  for (let i = 0; i < numberOfPieces; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: 5 + Math.random() * 8,
      h: 3 + Math.random() * 5,
      color: CONFIG.confettiColors[Math.floor(Math.random() * CONFIG.confettiColors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      speedX: (Math.random() - 0.5) * 3,
      speedY: 2 + Math.random() * 4,
      opacity: 1,
    });
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach((piece, i) => {
      piece.x += piece.speedX;
      piece.y += piece.speedY;
      piece.rotation += piece.rotationSpeed;

      // Fade out near bottom
      if (piece.y > canvas.height * 0.8) {
        piece.opacity -= 0.02;
      }

      if (piece.opacity <= 0) {
        // Reset piece to top
        piece.y = -20;
        piece.x = Math.random() * canvas.width;
        piece.opacity = 1;
      }

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate((piece.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, piece.opacity);
      ctx.fillStyle = piece.color;

      // Draw confetti piece (alternating shapes)
      if (i % 3 === 0) {
        // Rectangle
        ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      } else if (i % 3 === 1) {
        // Circle
        ctx.beginPath();
        ctx.arc(0, 0, piece.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Heart shape (simplified)
        ctx.beginPath();
        const s = piece.w / 2;
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.5, -s, 0, -s * 0.5);
        ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.3, 0, s * 0.3);
        ctx.fill();
      }

      ctx.restore();
    });

    confettiAnimationId = requestAnimationFrame(animateConfetti);
  }

  animateConfetti();

  // Handle resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function stopConfetti() {
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ====== GALLERY ======
function generateGallery() {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';

  CONFIG.galleryImages.forEach((img, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.onclick = () => openLightbox(index);

    // Random heights for masonry effect
    const heights = ['h-48', 'h-56', 'h-64', 'h-72', 'h-80'];
    const randomHeight = heights[Math.floor(Math.random() * heights.length)];
    const type = getMediaType(img);
    const mediaEl = createMediaElement(img, `${randomHeight} w-full object-cover`, `Moment ${index + 1}`, {
      autoplay: false,
      muted: false,
    });

    item.innerHTML = `
      ${type === 'video' ? '<span class="gallery-video-badge" aria-hidden="true">Video</span>' : ''}
      <div class="gallery-capybara">
        <svg viewBox="0 0 30 25" class="w-6 h-5">
          <ellipse cx="15" cy="15" rx="12" ry="8" fill="#D4B275"/>
          <circle cx="10" cy="10" r="3.5" fill="#D4B275"/>
          <circle cx="20" cy="10" r="3.5" fill="#D4B275"/>
          <circle cx="11" cy="9.5" r="0.8" fill="#333"/>
          <circle cx="19" cy="9.5" r="0.8" fill="#333"/>
          <ellipse cx="15" cy="12" rx="1.5" ry="1" fill="#8B6914"/>
        </svg>
      </div>
    `;
    item.insertBefore(mediaEl, item.firstChild);
    grid.appendChild(item);
  });
}

// ====== LIGHTBOX ======
function openLightbox(index) {
  galleryCurrentIndex = index;
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const video = document.getElementById('lightbox-video');
  const media = CONFIG.galleryImages[index];

  img.classList.add('hidden');
  video.classList.add('hidden');
  video.pause();
  video.removeAttribute('src');

  if (getMediaType(media) === 'video') {
    video.src = media.src;
    video.muted = false;
    video.classList.remove('hidden');
    video.load();
    video.play().catch(() => {});
  } else {
    img.src = media.src;
    img.classList.remove('hidden');
  }

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
  if (event && event.target !== event.currentTarget && !event.target.closest('button')) return;
  const lightbox = document.getElementById('lightbox');
  const video = document.getElementById('lightbox-video');
  if (video) video.pause();
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateGallery(direction, event = window.event) {
  if (event) event.stopPropagation();
  galleryCurrentIndex += direction;
  if (galleryCurrentIndex < 0) galleryCurrentIndex = CONFIG.galleryImages.length - 1;
  if (galleryCurrentIndex >= CONFIG.galleryImages.length) galleryCurrentIndex = 0;

  const img = document.getElementById('lightbox-img');
  const video = document.getElementById('lightbox-video');
  const currentMedia = video.classList.contains('hidden') ? img : video;
  currentMedia.style.opacity = '0';
  currentMedia.style.transform = 'scale(0.9)';

  setTimeout(() => {
    openLightbox(galleryCurrentIndex);
    img.style.opacity = '1';
    img.style.transform = 'scale(1)';
    video.style.opacity = '1';
    video.style.transform = 'scale(1)';
  }, 300);
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateGallery(-1);
  if (e.key === 'ArrowRight') navigateGallery(1);
});

// ====== MUSIC TOGGLE ======
function setupMusicToggle() {
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  const iconOn = document.getElementById('music-icon-on');
  const iconOff = document.getElementById('music-icon-off');
  if (!btn || !audio || !iconOn || !iconOff) return;

  audio.volume = 0.55;
  startBackgroundMusic({ silentFail: true });

  const unlockMusic = () => {
    if (!musicPlaying) {
      startBackgroundMusic({ silentFail: true });
    }
  };
  document.addEventListener('pointerdown', unlockMusic, { once: true });
  document.addEventListener('keydown', unlockMusic, { once: true });

  btn.addEventListener('click', () => {
    if (musicPlaying) {
      stopBackgroundMusic();
    } else {
      startBackgroundMusic({ silentFail: false });
    }
  });
}

function startBackgroundMusic({ silentFail = false } = {}) {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      musicPlaying = true;
      updateMusicIcon();
    }).catch(() => {
      musicPlaying = false;
      updateMusicIcon();
      if (!silentFail) {
        showEasterEggToast('🎵 Add your music file to assets/background-music.mp3');
      }
    });
  } else {
    musicPlaying = true;
    updateMusicIcon();
  }
}

function stopBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  audio.pause();
  musicPlaying = false;
  updateMusicIcon();
}

function updateMusicIcon() {
  const iconOn = document.getElementById('music-icon-on');
  const iconOff = document.getElementById('music-icon-off');
  if (!iconOn || !iconOff) return;

  iconOn.classList.toggle('hidden', !musicPlaying);
  iconOff.classList.toggle('hidden', musicPlaying);
}

// ====== EASTER EGGS ======
function setupEasterEggs() {
  document.querySelectorAll('.easter-egg').forEach(element => {
    element.addEventListener('click', () => {
      const message = element.getAttribute('data-message');
      if (message) {
        showEasterEggToast(message);
      }
    });
  });
}

function showEasterEggToast(message) {
  const toast = document.getElementById('easter-egg-toast');
  const text = document.getElementById('easter-egg-text');

  // Clear previous timeout
  if (easterEggTimeout) {
    clearTimeout(easterEggTimeout);
  }

  text.textContent = message;
  toast.classList.add('show');

  easterEggTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ====== WINDOW RESIZE HANDLER ======
window.addEventListener('resize', () => {
  // Recreate confetti canvas size if active
  if (confettiAnimationId) {
    const canvas = document.getElementById('confetti-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

// ====== TOUCH SUPPORT ======
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

// ====== PERFORMANCE: Reduce animations when tab is not visible ======
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (confettiAnimationId) {
      cancelAnimationFrame(confettiAnimationId);
    }
  }
});

// ====== CONSOLE EASTER EGG ======
console.log('%c💕 A Little Journey to My Heart 💕', 'font-size: 20px; color: #FF69B4; font-weight: bold;');
console.log('%cMade with love, Doraemon courage, and capybara calmness.', 'font-size: 14px; color: #FFB6C1;');
