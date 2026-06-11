/* ═══════════════════════════════════
   RM Technologies - Form Handler JS
═══════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initCareerForm();
  initNewsletterForm();
});

// Contact Form
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleFormSubmit(form, 'formSuccess', 'formError', 'Send Message');
  });
}

// Career Form
function initCareerForm() {
  const form = document.getElementById('careerForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleFormSubmit(form, 'careerSuccess', null, 'Submit Application');
  });
}

// Newsletter Form
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed!';
          btn.style.background = 'linear-gradient(135deg, #28C864, #00A854)';
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
          }, 3000);
        } else {
          throw new Error('Failed');
        }
      } catch (err) {
        btn.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Try Again';
        setTimeout(() => { btn.innerHTML = originalText; }, 2000);
      } finally {
        btn.disabled = false;
      }
    });
  });
}

// Generic Form Handler
async function handleFormSubmit(form, successId, errorId, btnText) {
  const btn = form.querySelector('[type="submit"]');
  const successEl = successId ? document.getElementById(successId) : null;
  const errorEl = errorId ? document.getElementById(errorId) : null;

  // Hide previous messages
  if (successEl) { successEl.style.display = 'none'; successEl.classList.remove('success'); }
  if (errorEl) { errorEl.style.display = 'none'; errorEl.classList.remove('error'); }

  // Loading state
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      form.reset();
      if (successEl) {
        successEl.classList.add('success');
        successEl.style.display = 'flex';
      }
      // Auto-hide after 6 seconds
      setTimeout(() => {
        if (successEl) successEl.style.display = 'none';
      }, 6000);
    } else {
      throw new Error('Server error');
    }
  } catch (err) {
    if (errorEl) {
      errorEl.classList.add('error');
      errorEl.style.display = 'flex';
    } else {
      alert('Something went wrong. Please email us at info@rmtechnologies.in or call +91 75700 00370');
    }
    setTimeout(() => {
      if (errorEl) errorEl.style.display = 'none';
    }, 6000);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${btnText}`;
  }
}

// Form Validation Enhancement
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(field => {
  field.addEventListener('invalid', (e) => {
    e.target.style.borderColor = '#FF5050';
  });

  field.addEventListener('input', (e) => {
    if (e.target.validity.valid) {
      e.target.style.borderColor = '';
    }
  });
});