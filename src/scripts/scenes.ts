import { browserEnv, type SceneEnv } from '../scenes/env';

type SceneModule = { mount: (root: HTMLElement, env: SceneEnv) => void };

const SCENES: Record<string, () => Promise<SceneModule>> = {
  wood: () => import('../scenes/wood/index'),
  sky: () => import('../scenes/sky/index'),
  year: () => import('../scenes/year/index'),
};

class ArboraScene extends HTMLElement {
  private started = false;

  connectedCallback(): void {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            void this.start();
          }
        },
        { rootMargin: '400px 0px' },
      );
      io.observe(this);
    } else {
      void this.start();
    }
  }

  private async start(): Promise<void> {
    if (this.started) return;
    this.started = true;
    const load = SCENES[this.dataset.scene ?? ''];
    if (!load) throw new Error(`Unknown scene "${this.dataset.scene}"`);
    const { mount } = await load();
    mount(this, browserEnv());
    this.classList.add('mounted');
  }
}

export function initScenes(): void {
  if (!document.querySelector('arbora-scene')) return;
  if (!customElements.get('arbora-scene')) customElements.define('arbora-scene', ArboraScene);
}
