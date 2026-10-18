export function initOfflineBar(): void {
  const bar = document.createElement('div');
  bar.className = 'offline-bar';
  bar.textContent = 'You are offline — cached content is available';
  document.body.appendChild(bar);

  const update = () => bar.classList.toggle('visible', !navigator.onLine);
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
}
