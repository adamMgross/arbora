import { reveal } from './reveal';

export function initTree(): void {
  const tree = document.getElementById('arbora-tree');
  if (!tree) return;

  tree.querySelectorAll('.tree-branch').forEach((branch) => {
    const leaves = branch.querySelectorAll<SVGElement>('.leaf-label');
    const show = () => leaves.forEach((leaf) => (leaf.style.opacity = '0.8'));
    const hide = () => leaves.forEach((leaf) => (leaf.style.opacity = ''));
    branch.addEventListener('mouseenter', show);
    branch.addEventListener('mouseleave', hide);
    branch.addEventListener('focusin', show);
    branch.addEventListener('focusout', hide);
  });

  const container = document.querySelector('.tree-svg-container');
  if (container) reveal(container);
}
