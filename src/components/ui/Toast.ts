import { TOAST_DURATION } from '../../constants/config';
import { ROUTES } from '../../constants/routes';

/*
 * Toast uses its own #toast CSS rule in components.css.
 * The template here only needs the structural HTML — all styling is in CSS.
 */
const TOAST_TEMPLATE = `
<div id="toast" role="status" aria-live="polite" aria-atomic="true">
  <i class="fa-solid fa-circle-check" style="color:var(--lum-plum-200);flex-shrink:0;" aria-hidden="true"></i>
  <span id="toast-msg"></span>
  <a href="${ROUTES.cart}" class="whitespace-nowrap">View bag</a>
</div>`;

let timer: ReturnType<typeof setTimeout> | null = null;

export function injectToast(): void {
  if (document.getElementById('toast')) return;
  document.body.insertAdjacentHTML('beforeend', TOAST_TEMPLATE);
}

export function showToast(message: string, duration = TOAST_DURATION): void {
  const toast = document.getElementById('toast');
  const msg   = document.getElementById('toast-msg');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add('visible');

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    toast.classList.remove('visible');
  }, duration);
}

export function hideToast(): void {
  const toast = document.getElementById('toast');
  if (toast) toast.classList.remove('visible');
  if (timer) { clearTimeout(timer); timer = null; }
}
