/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards.
 * Source: https://hostplus.com.au/
 * Generated: 2026-06-22
 *
 * Block library structure (Cards): 2 columns, first row = block name,
 * each subsequent row = one card: [image/icon, textContent (heading, desc, CTA)].
 *
 * Handles three source shapes that all map to feature cards:
 *  1. .content-image-block items (heading + text w/ inline link + illustration)
 *  2. .content-list-item / .cmp-content-list-item cards (image + heading/desc/button)
 *  3. content-media-block — single card (image in container2, content in container1)
 */
export default function parse(element, { document }) {
  const cells = [];

  const pushCard = (img, contentNodes) => {
    const content = contentNodes.filter((n) => n && (n.textContent || '').trim() !== '');
    if (!img && !content.length) return;
    cells.push([img || '', content.length ? content : '']);
  };

  // Collect a CTA anchor from button wrappers (text-only, no icon wrappers).
  const collectButtonCtas = (scope) => {
    const out = [];
    scope.querySelectorAll('.cmp-button__clickable-area').forEach((a) => {
      const label = (a.querySelector('.cmp-button__text') || a).textContent.trim();
      if (!label) return;
      const link = document.createElement('a');
      link.href = a.getAttribute('href') || '#';
      link.textContent = label;
      out.push(link);
    });
    return out;
  };

  // Shape 1: content-image-block items (links are inline inside the text <p>)
  const imageBlocks = element.querySelectorAll('.cmp-content-image-block');
  if (imageBlocks.length) {
    imageBlocks.forEach((item) => {
      const img = item.querySelector('.image img, img.cmp-image__image, img');
      const content = [];
      const heading = item.querySelector('.cmp-content-image-block__heading .cmp-title__text, h1, h2, h3, h4');
      if (heading) content.push(heading);
      item.querySelectorAll('.cmp-content-image-block__text .cmp-text, .cmp-content-image-block__text p').forEach((p) => content.push(p));
      pushCard(img, content);
    });
  }

  // Shape 2: content-list-item cards
  if (!cells.length) {
    const listItems = element.querySelectorAll('.cmp-content-list-item');
    if (listItems.length) {
      listItems.forEach((item) => {
        const img = item.querySelector('.cmp-content-list-item__img img, img.cmp-image__image, img');
        const content = [];
        const heading = item.querySelector('.cmp-content-list-item__heading .cmp-title__text, h1, h2, h3, h4');
        if (heading) content.push(heading);
        item.querySelectorAll('.cmp-content-list-item__desc .cmp-text, .cmp-content-list-item__desc p').forEach((p) => content.push(p));
        collectButtonCtas(item).forEach((a) => content.push(a));
        pushCard(img, content);
      });
    }
  }

  // Shape 3: content-media-block (single card)
  if (!cells.length) {
    const img = element.querySelector('.cmp-content-media-block__container2 img, img.cmp-image__image, img');
    const content = [];
    const heading = element.querySelector('.cmp-content-block__heading .cmp-title__text, h1, h2, h3, h4');
    if (heading) content.push(heading);
    element.querySelectorAll('.cmp-content-block__text .cmp-text, .cmp-content-block__text p').forEach((p) => content.push(p));
    collectButtonCtas(element).forEach((a) => content.push(a));
    pushCard(img, content);
  }

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
