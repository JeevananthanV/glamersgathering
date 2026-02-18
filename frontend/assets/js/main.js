(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setupCardHoverEffect = () => {
    document.querySelectorAll('.event-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });
  };

  const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') {
          return;
        }

        const target = document.querySelector(href);
        if (!target) {
          return;
        }

        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      });
    });
  };

  const setupHeroSlider = () => {
    const slider = document.querySelector('.hero-slider');
    if (!slider) {
      return;
    }

    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const prevBtn = slider.querySelector('.hero-prev');
    const nextBtn = slider.querySelector('.hero-next');
    const dotsContainer = slider.querySelector('.hero-dots');

    if (!slides.length || !prevBtn || !nextBtn || !dotsContainer) {
      return;
    }

    let currentIndex = 0;
    let intervalId;
    const intervalMs = 5000;

    const createDots = () => {
      dotsContainer.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'hero-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(index);
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
    };

    const updateUI = () => {
      slides.forEach((slide, index) => {
        const isActive = index === currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });

      Array.from(dotsContainer.children).forEach((dot, index) => {
        dot.setAttribute('aria-selected', String(index === currentIndex));
      });
    };

    const goToSlide = (index) => {
      if (index >= slides.length) {
        currentIndex = 0;
      } else if (index < 0) {
        currentIndex = slides.length - 1;
      } else {
        currentIndex = index;
      }
      updateUI();
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    const startAutoplay = () => {
      if (prefersReducedMotion) {
        return;
      }
      intervalId = window.setInterval(nextSlide, intervalMs);
    };

    const stopAutoplay = () => {
      window.clearInterval(intervalId);
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoplay();
      }
      if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoplay();
      }
    });

    createDots();
    updateUI();
    startAutoplay();
  };

  document.addEventListener('DOMContentLoaded', () => {
    setupCardHoverEffect();
    setupSmoothScroll();
    setupHeroSlider();
  });
})();
