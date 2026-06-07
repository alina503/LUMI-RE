export function updateCartBadge(count: number): void {
  document.querySelectorAll<HTMLElement>('.cart-badge').forEach((el) => {
    el.textContent = String(count);
    el.style.display = count > 0 ? 'inline-flex' : 'none';
    const link = el.closest('a[href="cart.html"]');
    if (link) link.setAttribute('aria-label', `Shopping bag, ${count} item${count === 1 ? '' : 's'}`);
  });
}
