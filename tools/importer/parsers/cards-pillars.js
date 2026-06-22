/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-pillars. Base: cards.
 * Source: https://hostplus.com.au/
 * Generated: 2026-06-22
 *
 * Block library structure (Cards): 2 columns, first row = block name,
 * each subsequent row = one card: [icon/image, textContent (heading, desc, CTA)].
 *
 * Source: .cmp-brand-pillars__item-container with N .cmp-brand-pillar-item cards,
 * each with mnemonic icon, heading, text, and a button link.
 */
export default function parse(element, { document }) {
  const cells = [];

  const items = element.querySelectorAll('.cmp-brand-pillar-item:not(.brand-pillar-item)');
  // .cmp-brand-pillar-item appears twice nested; select the inner content wrapper only
  const cards = items.length
    ? items
    : element.querySelectorAll('.brand-pillar-item .cmp-brand-pillar-item');

  cards.forEach((card) => {
    const img = card.querySelector('.cmp-mnemonic img, .image img, img.cmp-image__image, img');
    const content = [];
    const heading = card.querySelector('.cmp-brand-pillar-item__heading .cmp-title__text, h1, h2, h3, h4');
    if (heading) content.push(heading);
    card.querySelectorAll('.cmp-brand-pillar-item__text .cmp-text, .cmp-brand-pillar-item__text p').forEach((p) => {
      if ((p.textContent || '').trim()) content.push(p);
    });
    // CTA: text-only anchor (drop icon image wrappers)
    const ctaSrc = card.querySelector('.cmp-brand-pillar-item__button .cmp-button__clickable-area, .cmp-button__clickable-area');
    if (ctaSrc) {
      const label = (ctaSrc.querySelector('.cmp-button__text') || ctaSrc).textContent.trim();
      if (label) {
        const link = document.createElement('a');
        link.href = ctaSrc.getAttribute('href') || '#';
        link.textContent = label;
        content.push(link);
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pillars', cells });
  element.replaceWith(block);
}
