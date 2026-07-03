import { mountTocRail, type TocRailInstance } from 'toc-rail';

let rail: TocRailInstance | null = null;
let isBound = false;

export function initReadingRail() {
  rail?.unmount();
  rail = null;

  const prose = document.querySelector<HTMLElement>('#prose-content');
  if (!prose) return;

  const activeOffset = Math.round(window.innerHeight * 0.5);

  rail = mountTocRail({
    content: prose,
    headings: '#prose-content :is( h2, h3)[id]',
    title: false,
    ariaLabel: 'Post outline',
    progressMode: 'content',
    activeBoundary: 'viewport-end',
    activeOffset,
    edge: {
      afterBoundary: 'viewport-end',
      afterOffset: 120,
    },
    minWidth: 1200,
    topOffset: 3,
  });
}

export function mountReadingRailForPosts() {
  if (isBound) {
    initReadingRail();
    return;
  }

  isBound = true;
  initReadingRail();
}
