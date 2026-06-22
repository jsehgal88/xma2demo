/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-feature. Base: hero.
 * Source: https://hostplus.com.au/
 * Generated: 2026-06-22
 *
 * Block library structure (Hero): 1 column. Row 1 = block name, row 2 =
 * background image, row 3 = title + subheading + CTA.
 *
 * The source hero-block-V2 contains BOTH the hero (background image + rotating
 * headlines + subheading) AND a quicklinks grid (handled separately by
 * cards-quicklinks). Extraction is scoped to .cmp-hero-block__wrapper so the
 * quicklinks grid is NOT pulled into this block.
 */
export default function parse(element, { document }) {
  const wrapper = element.querySelector('.cmp-hero-block__wrapper') || element;

  // Background image: prefer the desktop variant.
  const bgImage = wrapper.querySelector(
    '.cmp-hero-block__background-image.desktop, .cmp-hero-block__hero-image img.desktop, .cmp-hero-block__hero-image img',
  );

  // Headlines (rotating) -> emit each as a heading.
  const headings = wrapper.querySelectorAll('.cmp-hero-block__headings .rotator h1.cmp-title__text, .cmp-hero-block__headings .rotator-title');

  // Subheading (e.g. "That's a plus")
  const subheading = wrapper.querySelector('.cmp-title__sub-heading .cmp-title__text, .cmp-hero-block__headings .cmp-title--yellow .cmp-title__text');

  const contentCell = [];
  headings.forEach((h) => {
    if ((h.textContent || '').trim()) {
      const heading = document.createElement('h1');
      heading.textContent = h.textContent.replace(/\s+/g, ' ').trim();
      contentCell.push(heading);
    }
  });
  if (subheading && subheading.textContent.trim()) {
    const sub = document.createElement('h2');
    sub.textContent = subheading.textContent.replace(/\s+/g, ' ').trim();
    contentCell.push(sub);
  }

  const cells = [];
  if (bgImage) cells.push([[bgImage]]); // background-image row (1 cell)
  if (contentCell.length) cells.push([contentCell]); // content row (1 cell)

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-feature', cells });
  element.replaceWith(block);
}
