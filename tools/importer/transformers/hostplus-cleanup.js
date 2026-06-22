/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Hostplus site-wide cleanup.
 *
 * Removes non-authorable site chrome and tracking/widget noise so the import
 * contains only page-level authorable content. Every selector below is taken
 * verbatim from the captured DOM in migration-work/cleaned.html (line numbers
 * noted in comments). No selectors are guessed.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / modals / chat widgets that can interfere with block parsing.
    WebImporter.DOMUtils.remove(element, [
      '#app-root-mode',            // empty SPA mount point (cleaned.html:2)
      'dialog#global-modal',       // global modal dialog (cleaned.html:5075)
      '.modal-wrapper',            // modal mount wrapper (cleaned.html:5093)
      '.cx-widget',                // Genesys "CHAT NOW" side button (cleaned.html:5100)
      '#chatConfirmOverlay',       // chat confirmation overlay (cleaned.html:5106)
      '#genesys-thirdparty',       // Genesys third-party iframe host (cleaned.html:5127)
      '#genesys-messenger',        // Genesys messenger iframe host (cleaned.html:5131)
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome: header + footer experience fragments and nav.
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header', // header XF wrapper (cleaned.html:10)
      'header',                          // <header class="cmp-header"> (cleaned.html:14)
      'nav',                             // primary navigation (cleaned.html:24)
      '.footer.container.responsivegrid', // footer XF container (cleaned.html:4937)
      'footer',                          // <footer> (cleaned.html:4938)
    ]);

    // Leftover tracking beacons / pixel iframes and embeds (cleaned.html:4, 5123,
    // 5125, 5097, 5122). IDs on bat.bing/doubleclick beacons are dynamic, so
    // remove the safe carrier tags rather than guessing IDs.
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
      'source',
    ]);

    // Strip non-authorable AEM data-layer / cmp tracking attributes left on
    // elements (observed on <body> and components in cleaned.html, e.g.
    // data-cmp-data-layer-* / data-cmp-link-accessibility-*).
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-cmp-')) {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
}
