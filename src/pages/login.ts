import '../styles/index.css';
import { AuthService } from '../services/authService';
import { initHeader } from '../layouts/Header';
import { initSearchOverlay } from '../layouts/SearchOverlay';
import { injectToast } from '../components/ui/Toast';

function init(): void {
  injectToast();
  initHeader();
  initSearchOverlay();

  if (AuthService.isLoggedIn()) {
    const session = AuthService.getSession()!;
    document.getElementById('login-form')?.classList.add('hidden');
    const success = document.getElementById('login-success');
    if (success) {
      success.classList.remove('hidden');
      const h2 = success.querySelector('h2');
      if (h2) h2.textContent = `Welcome back, ${session.firstName}!`;
    }
    return;
  }

  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.toggle('open');
  });

  const pwdInput = document.getElementById('password') as HTMLInputElement | null;
  document.getElementById('toggle-pwd')?.addEventListener('click', function () {
    if (!pwdInput) return;
    const icon = (this as HTMLElement).querySelector('i');
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
      icon?.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      pwdInput.type = 'password';
      icon?.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });

  ['email', 'password'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', function () {
      (this as HTMLElement).classList.remove('border-red-400');
      document.getElementById(`${id}-error`)?.classList.add('hidden');
      document.getElementById('login-error')?.classList.add('hidden');
    });
  });

  document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailEl = document.getElementById('email') as HTMLInputElement;
    const passwordEl = document.getElementById('password') as HTMLInputElement;
    let valid = true;

    document.getElementById('login-error')?.classList.add('hidden');

    if (!emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.classList.add('border-red-400');
      document.getElementById('email-error')?.classList.remove('hidden');
      valid = false;
    }
    if (!passwordEl.value.trim()) {
      passwordEl.classList.add('border-red-400');
      document.getElementById('password-error')?.classList.remove('hidden');
      valid = false;
    }
    if (!valid) return;

    const result = await AuthService.login(emailEl.value.trim(), passwordEl.value);
    if (result.ok) {
      const s = AuthService.getSession()!;
      document.getElementById('login-form')?.classList.add('hidden');
      const success = document.getElementById('login-success');
      if (success) {
        success.classList.remove('hidden');
        const h2 = success.querySelector('h2');
        if (h2) h2.textContent = `Welcome back, ${s.firstName}!`;
      }
      setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    } else {
      document.getElementById('login-error')?.classList.remove('hidden');
    }
  });

  ['btn-google', 'btn-facebook'].forEach((id) => {
    document.getElementById(id)?.addEventListener('click', () => {
      document.getElementById('social-msg')?.classList.remove('hidden');
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
