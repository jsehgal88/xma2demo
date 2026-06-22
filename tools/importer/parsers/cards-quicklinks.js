/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-quicklinks. Base: cards.
 * Source: https://hostplus.com.au/
 * Generated: 2026-06-22
 *
 * Block library structure (Cards): 2 columns, first row = block name,
 * each subsequent row = one card: [icon, textContent].
 *
 * Source: hero resource grid with N .cmp-resource-item quick-link tiles,
 * each tile = an <a> wrapping an icon image + a heading label.
 * The whole tile is a link, so the label is emitted as a linked heading.
 */
export default function parse(element, { document }) {
  const cells = [];

  const items = element.querySelectorAll('.cmp-resource-item, .cmp-resources-container-content-hero__item');
  const seen = new Set();
  items.forEach((node) => {
    const item = node.closest('.cmp-resources-container-content-hero__item') || node;
    if (seen.has(item)) return;
    seen.add(item);

    const anchor = item.querySelector('a.cmp-resource-item, a');
    const img = item.querySelector('.cmp-resource-item__image img.cmp-image__image, .image img, img');
    const headingText = item.querySelector('.cmp-resource-item__heading .cmp-title__text, h1, h2, h3, h4, h5, h6');

    const content = [];
    if (headingText) {
      const label = headingText.textContent.trim();
      const href = anchor && anchor.getAttribute('href');
      if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = label;
        content.push(link);
      } else {
        content.push(headingText);
      }
    }
    if (img || content.length) {
      cells.push([img || '', content.length ? content : '']);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-quicklinks', cells });
  element.replaceWith(block);
}
