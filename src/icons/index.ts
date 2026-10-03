/**
 * Navigation icon registry.
 *
 * The SVGs in `src/icons/` are the single source of truth: `siteConfig.nav`
 * refers to them by file name (`icon: 'recipe'`). Because the keys are derived
 * from the directory listing, the type of `NavIconName` can only ever contain
 * names that really exist — a config entry pointing at a non-existent icon
 * becomes a build/type error instead of silently rendering an empty slot
 * (which is how the `recipe` icon used to go missing).
 *
 * To add an icon: drop `src/icons/<name>.svg` in place and reference
 * `<name>` from `siteConfig.nav`.
 */

const modules = import.meta.glob<string>('../icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** name → raw SVG markup, e.g. `{ home: '<svg …>' }`. */
export const navIcons: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([path, svg]) => [
    path.split('/').pop()!.replace(/\.svg$/, ''),
    svg,
  ]),
);

export type NavIconName = keyof typeof navIcons;

/** Look up an icon; returns an empty string for unknown names. */
export function navIcon(name: string): string {
  return navIcons[name] ?? '';
}

/* =========================================================
 * Colour icon set
 * ========================================================= */

/**
 * `src/icons/color/*.svg` carries the brand-coloured icons used across the whole
 * top bar — the navigation items, the 「链接」 trigger and both panels. These
 * hard-code their fills instead of using `currentColor`, so they are kept in a
 * separate directory from the monochrome set.
 *
 * `panelIcon(name)` prefers the colour variant and falls back to the monochrome
 * icon, which means dropping `src/icons/color/<name>.svg` is all it takes to
 * recolour any top-bar icon — no config or component change needed.
 */
const colorModules = import.meta.glob<string>('../icons/color/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const colorIcons: Record<string, string> = Object.fromEntries(
  Object.entries(colorModules).map(([path, svg]) => [
    path.split('/').pop()!.replace(/\.svg$/, ''),
    svg,
  ]),
);

/** Top-bar icon: colour variant first, monochrome fallback. */
export function panelIcon(name: string): string {
  return colorIcons[name] ?? navIcons[name] ?? '';
}
