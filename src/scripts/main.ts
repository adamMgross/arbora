import { initCopyButtons } from './copy';
import { initHero } from './hero';
import { initNav } from './nav';
import { initOfflineBar } from './offline';
import { initProgress } from './progress';
import { initReveal } from './reveal';
import { registerServiceWorker } from './sw-register';
import { initToday } from './today';
import { initTree } from './tree';

initToday();
initNav();
initReveal();
initHero();
initProgress();
initTree();
initCopyButtons();
initOfflineBar();
registerServiceWorker();
