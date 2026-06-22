/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-cta. Base: hero.
 * Source: https://hostplus.com.au/
 * Generated: 2026-06-22
 *
 * Block library structure (Hero): 1 column. Row 1 = block name, optional
 * background-image row, then a content row with title + subheading + CTA.
 * hero-cta is text-only (no background photo), so only the content row is added.
 */
export default function parse(element, { document }) {
  const contentCell = [];

  // Multi-part display statement -> assemble into a single heading.
  // Select only leaf .cmp-title__text nodes (no nested .cmp-title__text) to
  // avoid double-counting the wrapper + inner text nodes.
  const fragments = [];
  const seen = new Set();
  const collect = (root) => {
    root.querySelectorAll('.cmp-title__text').forEach((node) => {
      if (node.querySelector('.cmp-title__text')) return; // skip wrappers
      if (seen.has(node)) return;
      seen.add(node);
      const text = node.textContent.replace(/\s+/g, ' ').trim();
      if (text) fragments.push(text);
    });
  };
  // Main heading fragments (heading1/heading2/heading3)
  element.querySelectorAll('.cmp-block__content > [class*="heading"]').forEach(collect);
  // "That's a plus" tagline
  const tagline = element.querySelector('.cmp-cta-shouty__thats-a-plus');
  if (tagline) collect(tagline);

  if (fragments.length) {
    const heading = document.createElement('h1');
    heading.textContent = fragments.join(' ');
    contentCell.push(heading);
  }

  // CTA button -> text-only anchor
  const ctaSrc = element.querySelector('.cmp-button__clickable-area');
  if (ctaSrc) {
    const label = (ctaSrc.querySelector('.cmp-button__text') || ctaSrc).textContent.trim();
    if (label) {
      const link = document.createElement('a');
      link.href = ctaSrc.getAttribute('href') || '#';
      link.textContent = label;
      contentCell.push(link);
    }
  }

  if (!contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // 1-column hero: single row, single cell holding all content.
  const cells = [[contentCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
