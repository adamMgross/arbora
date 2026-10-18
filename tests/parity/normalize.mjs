export function normalizeText(raw) {
  return raw
    .normalize('NFC')
    .split('\n')
    .map((line) => line.replace(/[ \t ]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

export function multisetDiff(base, candidate) {
  const counts = new Map();
  for (const item of base) counts.set(item, (counts.get(item) ?? 0) + 1);
  const onlyCandidate = [];
  for (const item of candidate) {
    const n = counts.get(item) ?? 0;
    if (n > 0) counts.set(item, n - 1);
    else onlyCandidate.push(item);
  }
  const onlyBase = [];
  for (const [item, n] of counts) for (let i = 0; i < n; i++) onlyBase.push(item);
  return { onlyBase, onlyCandidate };
}
