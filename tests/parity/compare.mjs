import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { multisetDiff } from './normalize.mjs';

export function compareData(key, base, candidate) {
  const failures = [];
  const lists = {
    text: [base.text.split('\n'), candidate.text.split('\n')],
    head: [base.head, candidate.head],
    ids: [base.ids, candidate.ids],
    links: [base.links, candidate.links],
  };
  for (const [kind, [a, b]] of Object.entries(lists)) {
    const { onlyBase, onlyCandidate } = multisetDiff(a, b);
    const sameOrder = a.length === b.length && a.every((item, i) => item === b[i]);
    if (onlyBase.length || onlyCandidate.length) failures.push({ key, kind, onlyBase, onlyCandidate });
    else if (kind !== 'head' && !sameOrder)
      failures.push({ key, kind, onlyBase: [], onlyCandidate: [], reordered: true });
  }
  failures.push(...compareStyles(key, base, candidate));
  return failures;
}

function compareStyles(key, base, candidate) {
  if (base.styles.length !== candidate.styles.length) {
    return [{ key, kind: 'styles', detail: `element count ${base.styles.length} vs ${candidate.styles.length}` }];
  }
  const failures = [];
  for (let i = 0; i < base.styles.length; i++) {
    const a = base.styles[i];
    const b = candidate.styles[i];
    if (a.key !== b.key) {
      failures.push({ key, kind: 'styles', detail: `structure differs at ${i}: ${a.key} vs ${b.key}` });
      break;
    }
    const changed = base.styleProps.filter((_, j) => a.values[j] !== b.values[j]);
    if (changed.length) {
      failures.push({
        key,
        kind: 'styles',
        detail: `${a.key} ${changed
          .slice(0, 4)
          .map((p) => `${p}: ${a.values[base.styleProps.indexOf(p)]} -> ${b.values[base.styleProps.indexOf(p)]}`)
          .join(' | ')}`,
      });
    }
  }
  return failures;
}

export function compareImages(base, candidate, { threshold = 0.1, maxDiffPixels = 50 } = {}) {
  if (base.equals(candidate)) return { ok: true, reason: 'identical bytes', diffPixels: 0 };
  const a = PNG.sync.read(base);
  const b = PNG.sync.read(candidate);
  if (a.width !== b.width || a.height !== b.height) {
    return { ok: false, reason: `size ${a.width}x${a.height} vs ${b.width}x${b.height}` };
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const diffPixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold });
  return {
    ok: diffPixels <= maxDiffPixels,
    reason: `${diffPixels} px differ`,
    diffPixels,
    diffPng: PNG.sync.write(diff),
  };
}
