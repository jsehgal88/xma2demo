/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-logos. Base: columns.
 * Source: https://hostplus.com.au/
 * Generated: 2026-06-22
 *
 * Block library structure (Columns): first row = block name; subsequent rows
 * have one cell per visual column. Here a 2-column layout:
 *  - left column: heading + description + CTA buttons
 *  - right column: award/ratings logo image (linked)
 */
export default function parse(element, { document }) {
  const leftCell = [];

  const heading = element.querySelector('.cmp-cta__title .cmp-title__text, .left-grid .cmp-title__text, h1, h2, h3');
  if (heading && heading.textContent.trim()) leftCell.push(heading);

  element.querySelectorAll('.cmp-cta__description .cmp-text, .cmp-cta__description p').forEach((p) => {
    if ((p.textContent || '').trim()) leftCell.push(p);
  });

  // CTA buttons -> text-only anchors (drop icon image wrappers)
  element.querySelectorAll('.cmp-cta__action-container .cmp-button__clickable-area').forEach((a) => {
    const label = (a.querySelector('.cmp-button__text') || a).textContent.trim();
    if (!label) return;
    const link = document.createElement('a');
    link.href = a.getAttribute('href') || '#';
    link.textContent = label;
    leftCell.push(link);
  });

  // Right column: logo image, preserving its link if present.
  let rightContent = '';
  const imgContainer = element.querySelector('.cmp-cta__image-container');
  if (imgContainer) {
    const link = imgContainer.querySelector('a.cmp-image__link, a');
    const img = imgContainer.querySelector('img.cmp-image__image, img');
    if (link && img) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href') || '#';
      a.append(img);
      rightContent = a;
    } else if (img) {
      rightContent = img;
    }
  }

  const cells = [];
  if (leftCell.length || rightContent) {
    cells.push([leftCell.length ? leftCell : '', rightContent || '']);
  }

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-logos', cells });
  element.replaceWith(block);
}
