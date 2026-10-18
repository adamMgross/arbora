export const routes = {
  home: { label: 'Arbora', href: 'index.html' },
  today: { label: 'Today', href: 'today.html' },
  cosmology: { label: 'Cosmology', href: 'cosmology.html' },
  principles: { label: 'Principles', href: 'principles.html' },
  practices: { label: 'Practices', href: 'practices.html' },
  rituals: { label: 'Rituals', href: 'rituals.html' },
  canon: { label: 'Canon', href: 'canon.html' },
  tree: { label: 'The Tree', href: 'tree.html' },
} as const;

export const navLinks = [
  routes.today,
  routes.cosmology,
  routes.principles,
  routes.practices,
  routes.rituals,
  routes.canon,
  routes.tree,
] as const;
