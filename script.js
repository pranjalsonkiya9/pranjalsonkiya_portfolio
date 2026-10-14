/**
 * Pranjal Sonkiya Portfolio - Interactive Script (2026)
 * Handles: Typewriter, Navigation Spy, Mobile Menu, Skills Filter, Modals, Clipboard, Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. TYPEWRITER EFFECT
  const typewriterElement = document.getElementById('typewriter');
  const roles = [
    'B.Tech CSE 1st Year Student',
    'Aspiring Software Engineer',
    'Curious Problem Solver',
    'Generative AI Explorer',
    'Passionate Programmer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // 2. STICKY NAVBAR & ACTIVE SCROLL SPY
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTop');

  function handleScroll() {
    const scrollPos = window.scrollY;

    // Navbar Scrolled Glass Effect
    if (scrollPos > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollPos > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    // Active Section Link Spy
    let currentSectionId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Back to top click
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 3. MOBILE MENU TOGGLE
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // 4. THEME TOGGLE (Dark / Light)
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('portfolio-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('portfolio-theme', 'light');
    }
  });

  // 5. SKILLS FILTERING TABS
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 6. MODAL UTILITIES
  function setupModal(triggerIds, modalId, closeId) {
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);

    if (!modal) return;

    triggerIds.forEach(id => {
      const trigger = document.getElementById(id);
      trigger?.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    });

    closeBtn?.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    });

    // Close when clicking outside of the modal container
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }

  // Set up all project & achievement modals
  setupModal(['openCertModalBtn', 'openCertModalBtn2'], 'certModal', 'closeCertModal');
  setupModal(['openAiJourneyModalBtn', 'openAiJourneyModalBtn2', 'openAiJourneyModalBtn3'], 'aiJourneyModal', 'closeAiJourneyModal');
  setupModal(['openReportModalBtn'], 'reportModal', 'closeReportModal');
  setupModal(['openCodeModalBtn'], 'codeModal', 'closeCodeModal');
  setupModal(['openAiShowcaseBtn'], 'aiShowcaseModal', 'closeAiShowcaseModal');

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.modal-overlay:not(.hidden)');
      openModals.forEach(m => {
        m.classList.add('hidden');
        document.body.style.overflow = '';
      });
    }
  });

  // 7. TOAST & COPY TO CLIPBOARD
  const toast = document.getElementById('toast');
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2800);
  }

  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Copied: ${textToCopy}`);
        });
      }
    });
  });

  // Copy code in modal
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  copyCodeBtn?.addEventListener('click', () => {
    const codeContent = `#include <stdio.h>
#include <stdlib.h>

int main() {
    int a, b, sum;
    printf("Enter two integers: ");
    if (scanf("%d %d", &a, &b) == 2) {
        sum = a + b;
        printf("The calculated sum is: %d\\n", sum);
    } else {
        printf("Invalid input provided.\\n");
    }
    return 0;
}`;
    navigator.clipboard.writeText(codeContent).then(() => {
      showToast('C code snippet copied to clipboard!');
    });
  });

  // 8. CONTACT FORM HANDLER
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      if (formFeedback) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fill out all required fields.';
        formFeedback.classList.remove('hidden');
      }
      return;
    }

    // Construct mailto link so it directly opens user's email client
    const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - From ${name}`);
    const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:pranjal.26bcon0675@jecrcu.edu.in?subject=${mailtoSubject}&body=${mailtoBody}`;

    if (formFeedback) {
      formFeedback.className = 'form-feedback success';
      formFeedback.innerHTML = `
        Thank you, <strong>${name}</strong>! Your email client is opening to send your message directly to Pranjal Sonkiya. 
        If your client didn't open automatically, <a href="${mailtoLink}" style="color: inherit; text-decoration: underline;">click here to launch</a>.
      `;
      formFeedback.classList.remove('hidden');
    }

    // Open email client
    window.location.href = mailtoLink;

    contactForm.reset();
  });
});
