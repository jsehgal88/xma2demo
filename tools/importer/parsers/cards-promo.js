/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-promo. Base: cards.
 * Source: https://hostplus.com.au/
 * Generated: 2026-06-22
 *
 * Block library structure (Cards): 2 columns, first row = block name,
 * each subsequent row = one card: [image, textContent (heading, desc, CTA, disclaimer)].
 *
 * Source: promotional campaign banner(s) (.cmp-promote-campaign) — image +
 * heading + description + button + optional disclaimer.
 */
export default function parse(element, { document }) {
  const cells = [];

  let promos = element.querySelectorAll('.cmp-promote-campaign');
  // If the matched element IS a promo (not a container), treat it as the single item.
  if (!promos.length && element.classList.contains('cmp-promote-campaign')) {
    promos = [element];
  }

  promos.forEach((promo) => {
    const img = promo.querySelector('.cmp-promote-campaign__img img, .image img, img.cmp-image__image, img');
    const content = [];
    const heading = promo.querySelector('.cmp-promote-campaign__heading .cmp-title__text, h1, h2, h3, h4');
    if (heading) content.push(heading);
    promo.querySelectorAll('.cmp-promote-campaign__desc .cmp-text, .cmp-promote-campaign__desc p').forEach((p) => {
      if ((p.textContent || '').trim()) content.push(p);
    });
    // Button CTA: text-only anchor (drop icon image wrappers)
    const ctaSrc = promo.querySelector('.cmp-promote-campaign__button .cmp-button__clickable-area, .cmp-button__clickable-area');
    if (ctaSrc) {
      const label = (ctaSrc.querySelector('.cmp-button__text') || ctaSrc).textContent.trim();
      if (label) {
        const link = document.createElement('a');
        link.href = ctaSrc.getAttribute('href') || '#';
        link.textContent = label;
        content.push(link);
      }
    }
    // Disclaimer (optional)
    promo.querySelectorAll('.cmp-promote-campaign__disclaimer p, .cmp-disclaimer p').forEach((p) => {
      if ((p.textContent || '').trim()) content.push(p);
    });
    if (img || content.length) {
      cells.push([img || '', content.length ? content : '']);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
