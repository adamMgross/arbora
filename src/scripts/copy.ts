export function initCopyButtons(): void {
  document.querySelectorAll('.page-content blockquote').forEach((quote) => {
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.textContent = 'copy';
    button.setAttribute('aria-label', 'Copy passage to clipboard');
    button.addEventListener('click', () => {
      const text = (quote.textContent ?? '').replace(/\s*copy$/, '').trim();
      void navigator.clipboard.writeText(text).then(() => {
        button.textContent = 'copied';
        button.classList.add('copied');
        setTimeout(() => {
          button.textContent = 'copy';
          button.classList.remove('copied');
        }, 1500);
      });
    });
    quote.appendChild(button);
  });
}
