export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function weightedPick(items, weightGetter) {
  const total = items.reduce((sum, item) => sum + weightGetter(item), 0);
  let threshold = Math.random() * total;

  for (const item of items) {
    threshold -= weightGetter(item);
    if (threshold <= 0) return item;
  }

  return items.at(-1);
}

export function formatCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function daysBetween(nowIso, thenIso) {
  if (!thenIso) return Infinity;
  const now = new Date(nowIso).setHours(0, 0, 0, 0);
  const then = new Date(thenIso).setHours(0, 0, 0, 0);
  return Math.floor((now - then) / 86400000);
}
