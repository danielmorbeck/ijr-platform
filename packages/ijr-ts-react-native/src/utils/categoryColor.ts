const CATEGORY_PALETTE = [
  '#2f95dc',
  '#27ae60',
  '#e67e22',
  '#8e44ad',
  '#c0392b',
  '#16a085',
  '#d35400',
  '#2980b9',
] as const;

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function categoryColor(slug: string): string {
  return CATEGORY_PALETTE[hashSlug(slug) % CATEGORY_PALETTE.length];
}
