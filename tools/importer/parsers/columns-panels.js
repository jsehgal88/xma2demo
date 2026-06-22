/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-panels. Base: columns.
 * Source: https://hostplus.com.au/
 * Generated: 2026-06-22
 *
 * Block library structure (Columns): first row = block name; subsequent rows
 * have one cell per visual column. Here a 3-column grid (--3cols) where each
 * .content-list-item becomes a column containing image + heading + desc + CTA.
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.cmp-content-list-item');

  const row = [];
  items.forEach((item) => {
    const cell = [];
    const img = item.querySelector('.cmp-content-list-item__img img.cmp-image__image, .image img, img');
    if (img) cell.push(img);
    const heading = item.querySelector('.cmp-content-list-item__heading .cmp-title__text, h1, h2, h3, h4');
    if (heading) cell.push(heading);
    item.querySelectorAll('.cmp-content-list-item__desc .cmp-text, .cmp-content-list-item__desc p').forEach((p) => {
      if ((p.textContent || '').trim()) cell.push(p);
    });
    // CTA button -> text-only anchor
    const ctaSrc = item.querySelector('.cmp-content-list-item__button .cmp-button__clickable-area, .cmp-button__clickable-area');
    if (ctaSrc) {
      const label = (ctaSrc.querySelector('.cmp-button__text') || ctaSrc).textContent.trim();
      if (label) {
        const link = document.createElement('a');
        link.href = ctaSrc.getAttribute('href') || '#';
        link.textContent = label;
        cell.push(link);
      }
    }
    if (cell.length) row.push(cell);
  });

  if (!row.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-panels', cells });
  element.replaceWith(block);
}
