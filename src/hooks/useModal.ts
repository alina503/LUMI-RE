export interface UseModal {
  open(): void;
  close(): void;
  toggle(): void;
  isOpen(): boolean;
}

// Reference-counted scroll lock so closing one modal doesn't
// re-enable scrolling when another modal is still open.
let _scrollLockCount = 0;

export function lockScroll(): void {
  _scrollLockCount++;
  document.body.style.overflow = 'hidden';
}

export function unlockScroll(): void {
  _scrollLockCount = Math.max(0, _scrollLockCount - 1);
  if (_scrollLockCount === 0) document.body.style.overflow = '';
}

export function useModal(modalId: string): UseModal {
  function getEl(): HTMLElement | null {
    return document.getElementById(modalId);
  }

  function open(): void {
    const el = getEl();
    if (!el) return;
    el.style.display = 'flex';
    lockScroll();
  }

  function close(): void {
    const el = getEl();
    if (!el) return;
    if (isOpen()) unlockScroll();
    el.style.display = 'none';
  }

  function toggle(): void {
    isOpen() ? close() : open();
  }

  function isOpen(): boolean {
    const el = getEl();
    if (!el) return false;
    const d = el.style.display;
    return d === 'flex' || d === 'block';
  }

  return { open, close, toggle, isOpen };
}
