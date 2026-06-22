/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroFeatureParser from './parsers/hero-feature.js';
import heroCtaParser from './parsers/hero-cta.js';
import cardsQuicklinksParser from './parsers/cards-quicklinks.js';
import cardsPromoParser from './parsers/cards-promo.js';
import cardsPillarsParser from './parsers/cards-pillars.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsLogosParser from './parsers/columns-logos.js';
import columnsPanelsParser from './parsers/columns-panels.js';
import columnsApppromoParser from './parsers/columns-apppromo.js';

// TRANSFORMER IMPORTS
import hostplusCleanupTransformer from './transformers/hostplus-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'hero-feature': heroFeatureParser,
  'hero-cta': heroCtaParser,
  'cards-quicklinks': cardsQuicklinksParser,
  'cards-promo': cardsPromoParser,
  'cards-pillars': cardsPillarsParser,
  'cards-feature': cardsFeatureParser,
  'columns-logos': columnsLogosParser,
  'columns-panels': columnsPanelsParser,
  'columns-apppromo': columnsApppromoParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  hostplusCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Hostplus homepage with hero, promo banners, brand pillars, content-media blocks, content-list, CTAs, and app promo',
  urls: [
    'https://hostplus.com.au/',
  ],
  blocks: [
    {
      name: 'hero-feature',
      instances: ['div.hero-block-V2 div.cmp-hero-block__wrapper'],
    },
    {
      name: 'cards-quicklinks',
      instances: ['div.hero-block-V2 div.cmp-hero-block-V2__container > div:nth-of-type(3)'],
    },
    {
      name: 'cards-promo',
      instances: ['div.container-block.container.responsivegrid:nth-of-type(2)'],
    },
    {
      name: 'cards-pillars',
      instances: ['div.brand-pillars div.cmp-brand-pillars__item-container'],
    },
    {
      name: 'columns-logos',
      instances: ['div.cta.--mb-4xl'],
    },
    {
      name: 'cards-feature',
      instances: [
        'div.container-block.container.responsivegrid.--mb-4xl:nth-of-type(6) div.content-list-block',
        'div.content-media-block.--mb-4xl:nth-of-type(8)',
      ],
    },
    {
      name: 'columns-panels',
      instances: ['div.content-list-block.cmp-content-list__items-wrapper--3cols'],
    },
    {
      name: 'hero-cta',
      instances: ['div.cta-shouty.--mb-4xl'],
    },
    {
      name: 'columns-apppromo',
      instances: ['div.apppromo.image.--mb-2xl'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
