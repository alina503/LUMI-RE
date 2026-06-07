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
    window.location.href = 'index.html';
    return;
  }

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

  // Pre-fill from query params (e.g. coming from newsletter popup)
  const params = new URLSearchParams(window.location.search);
  const emailInput = document.getElementById('email') as HTMLInputElement | null;
  const firstNameInput = document.getElementById('first-name') as HTMLInputElement | null;
  if (emailInput && params.get('email')) emailInput.value = params.get('email')!;
  if (firstNameInput && params.get('name')) firstNameInput.value = params.get('name')!;

  document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    document.querySelectorAll<HTMLElement>('.error-msg').forEach((el) => el.classList.add('hidden'));
    document.getElementById('terms-error')?.classList.add('hidden');

    const firstName = document.getElementById('first-name') as HTMLInputElement;
    const lastName = document.getElementById('last-name') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const confirmPwd = document.getElementById('confirm-password') as HTMLInputElement;
    const terms = document.getElementById('terms') as HTMLInputElement;

    function showError(input: HTMLInputElement): void {
      input.closest('div')?.querySelector<HTMLElement>('.error-msg')?.classList.remove('hidden');
      input.classList.add('border-red-400');
      valid = false;
    }

    if (!firstName.value.trim()) showError(firstName);
    if (!lastName.value.trim()) showError(lastName);
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) showError(email);
    if (!password.value || password.value.length < 8 || !/[A-Z]/.test(password.value) || !/[0-9]/.test(password.value)) showError(password);
    if (confirmPwd.value !== password.value) showError(confirmPwd);
    if (!terms.checked) { document.getElementById('terms-error')?.classList.remove('hidden'); valid = false; }
    if (!valid) return;

    const result = await AuthService.register(
      firstName.value.trim(),
      lastName.value.trim(),
      email.value.trim(),
      password.value,
    );

    if (result.ok) {
      document.getElementById('signup-form')?.classList.add('hidden');
      document.getElementById('signup-success')?.classList.remove('hidden');
      setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    } else if (result.error === 'exists') {
      email.classList.add('border-red-400');
      const errEl = email.closest('div')?.querySelector<HTMLElement>('.error-msg');
      if (errEl) { errEl.textContent = 'This email is already registered.'; errEl.classList.remove('hidden'); }
    }
  });

  document.querySelectorAll<HTMLInputElement>('input[type=text], input[type=email], input[type=password]').forEach((el) => {
    el.addEventListener('input', function () { (this as HTMLElement).classList.remove('border-red-400'); });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
