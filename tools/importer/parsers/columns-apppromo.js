/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-apppromo. Base: columns.
 * Source: https://hostplus.com.au/
 * Generated: 2026-06-22
 *
 * Block library structure (Columns): first row = block name; subsequent rows
 * have one cell per visual column. Here the content is a 2-column layout:
 *  - left column: heading + description + app-store badge links
 *  - right column: phone screenshot image
 */
export default function parse(element, { document }) {
  const leftCell = [];

  // Left column content
  const heading = element.querySelector('.cmp-app-promo__title .cmp-title__text, h1, h2, h3');
  if (heading) leftCell.push(heading);

  const desc = element.querySelector('.cmp-app-promo__description');
  if (desc && desc.textContent.trim()) leftCell.push(desc);

  // App store badge links (preserve hrefs + badge images)
  element.querySelectorAll('.cmp-app-promo__appcontainer a').forEach((a) => leftCell.push(a));

  // Right column image (phone screenshot). Exclude the app-store badge images
  // that live inside the left column's .cmp-app-promo__appcontainer.
  let rightImg = element.querySelector('.cmp-app-promo__right img.cmp-image__image, .cmp-app-promo__right img');
  if (!rightImg) {
    rightImg = Array.from(element.querySelectorAll('img')).find(
      (img) => !img.closest('.cmp-app-promo__appcontainer'),
    ) || null;
  }

  const cells = [];
  if (leftCell.length || rightImg) {
    cells.push([leftCell.length ? leftCell : '', rightImg || '']);
  }

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-apppromo', cells });
  element.replaceWith(block);
}
