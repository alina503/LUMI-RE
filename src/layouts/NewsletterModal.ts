import { validateEmail } from '../lib/validation';
import { submitNewsletterForm } from '../services/newsletterService';
import { useModal } from '../hooks/useModal';

export function initNewsletterModal(): void {
  const popup = document.getElementById('newsletter-popup');
  if (!popup) return;

  const modal = useModal('newsletter-popup');
  const closeBtn = document.getElementById('close-popup');
  const submitBtn = document.getElementById('popup-submit');
  const nameInput = document.getElementById('popup-name') as HTMLInputElement | null;
  const emailInput = document.getElementById('popup-email') as HTMLInputElement | null;

  if (!closeBtn || !submitBtn || !emailInput) return;

  closeBtn.addEventListener('click', () => modal.close());
  popup.addEventListener('click', (e) => { if (e.target === popup) modal.close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.isOpen()) modal.close(); });

  submitBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const result = validateEmail(email);
    if (!result.valid) {
      emailInput.focus();
      return;
    }
    modal.close();
    submitNewsletterForm({
      name: nameInput?.value.trim() ?? '',
      email,
    });
  });
}
