/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-feature.js
  function parse(element, { document }) {
    const wrapper = element.querySelector(".cmp-hero-block__wrapper") || element;
    const bgImage = wrapper.querySelector(
      ".cmp-hero-block__background-image.desktop, .cmp-hero-block__hero-image img.desktop, .cmp-hero-block__hero-image img"
    );
    const headings = wrapper.querySelectorAll(".cmp-hero-block__headings .rotator h1.cmp-title__text, .cmp-hero-block__headings .rotator-title");
    const subheading = wrapper.querySelector(".cmp-title__sub-heading .cmp-title__text, .cmp-hero-block__headings .cmp-title--yellow .cmp-title__text");
    const contentCell = [];
    headings.forEach((h) => {
      if ((h.textContent || "").trim()) {
        const heading = document.createElement("h1");
        heading.textContent = h.textContent.replace(/\s+/g, " ").trim();
        contentCell.push(heading);
      }
    });
    if (subheading && subheading.textContent.trim()) {
      const sub = document.createElement("h2");
      sub.textContent = subheading.textContent.replace(/\s+/g, " ").trim();
      contentCell.push(sub);
    }
    const cells = [];
    if (bgImage) cells.push([[bgImage]]);
    if (contentCell.length) cells.push([contentCell]);
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse2(element, { document }) {
    const contentCell = [];
    const fragments = [];
    const seen = /* @__PURE__ */ new Set();
    const collect = (root) => {
      root.querySelectorAll(".cmp-title__text").forEach((node) => {
        if (node.querySelector(".cmp-title__text")) return;
        if (seen.has(node)) return;
        seen.add(node);
        const text = node.textContent.replace(/\s+/g, " ").trim();
        if (text) fragments.push(text);
      });
    };
    element.querySelectorAll('.cmp-block__content > [class*="heading"]').forEach(collect);
    const tagline = element.querySelector(".cmp-cta-shouty__thats-a-plus");
    if (tagline) collect(tagline);
    if (fragments.length) {
      const heading = document.createElement("h1");
      heading.textContent = fragments.join(" ");
      contentCell.push(heading);
    }
    const ctaSrc = element.querySelector(".cmp-button__clickable-area");
    if (ctaSrc) {
      const label = (ctaSrc.querySelector(".cmp-button__text") || ctaSrc).textContent.trim();
      if (label) {
        const link = document.createElement("a");
        link.href = ctaSrc.getAttribute("href") || "#";
        link.textContent = label;
        contentCell.push(link);
      }
    }
    if (!contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-quicklinks.js
  function parse3(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".cmp-resource-item, .cmp-resources-container-content-hero__item");
    const seen = /* @__PURE__ */ new Set();
    items.forEach((node) => {
      const item = node.closest(".cmp-resources-container-content-hero__item") || node;
      if (seen.has(item)) return;
      seen.add(item);
      const anchor = item.querySelector("a.cmp-resource-item, a");
      const img = item.querySelector(".cmp-resource-item__image img.cmp-image__image, .image img, img");
      const headingText = item.querySelector(".cmp-resource-item__heading .cmp-title__text, h1, h2, h3, h4, h5, h6");
      const content = [];
      if (headingText) {
        const label = headingText.textContent.trim();
        const href = anchor && anchor.getAttribute("href");
        if (href) {
          const link = document.createElement("a");
          link.href = href;
          link.textContent = label;
          content.push(link);
        } else {
          content.push(headingText);
        }
      }
      if (img || content.length) {
        cells.push([img || "", content.length ? content : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-quicklinks", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse4(element, { document }) {
    const cells = [];
    let promos = element.querySelectorAll(".cmp-promote-campaign");
    if (!promos.length && element.classList.contains("cmp-promote-campaign")) {
      promos = [element];
    }
    promos.forEach((promo) => {
      const img = promo.querySelector(".cmp-promote-campaign__img img, .image img, img.cmp-image__image, img");
      const content = [];
      const heading = promo.querySelector(".cmp-promote-campaign__heading .cmp-title__text, h1, h2, h3, h4");
      if (heading) content.push(heading);
      promo.querySelectorAll(".cmp-promote-campaign__desc .cmp-text, .cmp-promote-campaign__desc p").forEach((p) => {
        if ((p.textContent || "").trim()) content.push(p);
      });
      const ctaSrc = promo.querySelector(".cmp-promote-campaign__button .cmp-button__clickable-area, .cmp-button__clickable-area");
      if (ctaSrc) {
        const label = (ctaSrc.querySelector(".cmp-button__text") || ctaSrc).textContent.trim();
        if (label) {
          const link = document.createElement("a");
          link.href = ctaSrc.getAttribute("href") || "#";
          link.textContent = label;
          content.push(link);
        }
      }
      promo.querySelectorAll(".cmp-promote-campaign__disclaimer p, .cmp-disclaimer p").forEach((p) => {
        if ((p.textContent || "").trim()) content.push(p);
      });
      if (img || content.length) {
        cells.push([img || "", content.length ? content : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-pillars.js
  function parse5(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".cmp-brand-pillar-item:not(.brand-pillar-item)");
    const cards = items.length ? items : element.querySelectorAll(".brand-pillar-item .cmp-brand-pillar-item");
    cards.forEach((card) => {
      const img = card.querySelector(".cmp-mnemonic img, .image img, img.cmp-image__image, img");
      const content = [];
      const heading = card.querySelector(".cmp-brand-pillar-item__heading .cmp-title__text, h1, h2, h3, h4");
      if (heading) content.push(heading);
      card.querySelectorAll(".cmp-brand-pillar-item__text .cmp-text, .cmp-brand-pillar-item__text p").forEach((p) => {
        if ((p.textContent || "").trim()) content.push(p);
      });
      const ctaSrc = card.querySelector(".cmp-brand-pillar-item__button .cmp-button__clickable-area, .cmp-button__clickable-area");
      if (ctaSrc) {
        const label = (ctaSrc.querySelector(".cmp-button__text") || ctaSrc).textContent.trim();
        if (label) {
          const link = document.createElement("a");
          link.href = ctaSrc.getAttribute("href") || "#";
          link.textContent = label;
          content.push(link);
        }
      }
      if (img || content.length) {
        cells.push([img || "", content.length ? content : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-pillars", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse6(element, { document }) {
    const cells = [];
    const pushCard = (img, contentNodes) => {
      const content = contentNodes.filter((n) => n && (n.textContent || "").trim() !== "");
      if (!img && !content.length) return;
      cells.push([img || "", content.length ? content : ""]);
    };
    const collectButtonCtas = (scope) => {
      const out = [];
      scope.querySelectorAll(".cmp-button__clickable-area").forEach((a) => {
        const label = (a.querySelector(".cmp-button__text") || a).textContent.trim();
        if (!label) return;
        const link = document.createElement("a");
        link.href = a.getAttribute("href") || "#";
        link.textContent = label;
        out.push(link);
      });
      return out;
    };
    const imageBlocks = element.querySelectorAll(".cmp-content-image-block");
    if (imageBlocks.length) {
      imageBlocks.forEach((item) => {
        const img = item.querySelector(".image img, img.cmp-image__image, img");
        const content = [];
        const heading = item.querySelector(".cmp-content-image-block__heading .cmp-title__text, h1, h2, h3, h4");
        if (heading) content.push(heading);
        item.querySelectorAll(".cmp-content-image-block__text .cmp-text, .cmp-content-image-block__text p").forEach((p) => content.push(p));
        pushCard(img, content);
      });
    }
    if (!cells.length) {
      const listItems = element.querySelectorAll(".cmp-content-list-item");
      if (listItems.length) {
        listItems.forEach((item) => {
          const img = item.querySelector(".cmp-content-list-item__img img, img.cmp-image__image, img");
          const content = [];
          const heading = item.querySelector(".cmp-content-list-item__heading .cmp-title__text, h1, h2, h3, h4");
          if (heading) content.push(heading);
          item.querySelectorAll(".cmp-content-list-item__desc .cmp-text, .cmp-content-list-item__desc p").forEach((p) => content.push(p));
          collectButtonCtas(item).forEach((a) => content.push(a));
          pushCard(img, content);
        });
      }
    }
    if (!cells.length) {
      const img = element.querySelector(".cmp-content-media-block__container2 img, img.cmp-image__image, img");
      const content = [];
      const heading = element.querySelector(".cmp-content-block__heading .cmp-title__text, h1, h2, h3, h4");
      if (heading) content.push(heading);
      element.querySelectorAll(".cmp-content-block__text .cmp-text, .cmp-content-block__text p").forEach((p) => content.push(p));
      collectButtonCtas(element).forEach((a) => content.push(a));
      pushCard(img, content);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-logos.js
  function parse7(element, { document }) {
    const leftCell = [];
    const heading = element.querySelector(".cmp-cta__title .cmp-title__text, .left-grid .cmp-title__text, h1, h2, h3");
    if (heading && heading.textContent.trim()) leftCell.push(heading);
    element.querySelectorAll(".cmp-cta__description .cmp-text, .cmp-cta__description p").forEach((p) => {
      if ((p.textContent || "").trim()) leftCell.push(p);
    });
    element.querySelectorAll(".cmp-cta__action-container .cmp-button__clickable-area").forEach((a) => {
      const label = (a.querySelector(".cmp-button__text") || a).textContent.trim();
      if (!label) return;
      const link = document.createElement("a");
      link.href = a.getAttribute("href") || "#";
      link.textContent = label;
      leftCell.push(link);
    });
    let rightContent = "";
    const imgContainer = element.querySelector(".cmp-cta__image-container");
    if (imgContainer) {
      const link = imgContainer.querySelector("a.cmp-image__link, a");
      const img = imgContainer.querySelector("img.cmp-image__image, img");
      if (link && img) {
        const a = document.createElement("a");
        a.href = link.getAttribute("href") || "#";
        a.append(img);
        rightContent = a;
      } else if (img) {
        rightContent = img;
      }
    }
    const cells = [];
    if (leftCell.length || rightContent) {
      cells.push([leftCell.length ? leftCell : "", rightContent || ""]);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-logos", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-panels.js
  function parse8(element, { document }) {
    const items = element.querySelectorAll(".cmp-content-list-item");
    const row = [];
    items.forEach((item) => {
      const cell = [];
      const img = item.querySelector(".cmp-content-list-item__img img.cmp-image__image, .image img, img");
      if (img) cell.push(img);
      const heading = item.querySelector(".cmp-content-list-item__heading .cmp-title__text, h1, h2, h3, h4");
      if (heading) cell.push(heading);
      item.querySelectorAll(".cmp-content-list-item__desc .cmp-text, .cmp-content-list-item__desc p").forEach((p) => {
        if ((p.textContent || "").trim()) cell.push(p);
      });
      const ctaSrc = item.querySelector(".cmp-content-list-item__button .cmp-button__clickable-area, .cmp-button__clickable-area");
      if (ctaSrc) {
        const label = (ctaSrc.querySelector(".cmp-button__text") || ctaSrc).textContent.trim();
        if (label) {
          const link = document.createElement("a");
          link.href = ctaSrc.getAttribute("href") || "#";
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
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-panels", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-apppromo.js
  function parse9(element, { document }) {
    const leftCell = [];
    const heading = element.querySelector(".cmp-app-promo__title .cmp-title__text, h1, h2, h3");
    if (heading) leftCell.push(heading);
    const desc = element.querySelector(".cmp-app-promo__description");
    if (desc && desc.textContent.trim()) leftCell.push(desc);
    element.querySelectorAll(".cmp-app-promo__appcontainer a").forEach((a) => leftCell.push(a));
    let rightImg = element.querySelector(".cmp-app-promo__right img.cmp-image__image, .cmp-app-promo__right img");
    if (!rightImg) {
      rightImg = Array.from(element.querySelectorAll("img")).find(
        (img) => !img.closest(".cmp-app-promo__appcontainer")
      ) || null;
    }
    const cells = [];
    if (leftCell.length || rightImg) {
      cells.push([leftCell.length ? leftCell : "", rightImg || ""]);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-apppromo", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/hostplus-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#app-root-mode",
        // empty SPA mount point (cleaned.html:2)
        "dialog#global-modal",
        // global modal dialog (cleaned.html:5075)
        ".modal-wrapper",
        // modal mount wrapper (cleaned.html:5093)
        ".cx-widget",
        // Genesys "CHAT NOW" side button (cleaned.html:5100)
        "#chatConfirmOverlay",
        // chat confirmation overlay (cleaned.html:5106)
        "#genesys-thirdparty",
        // Genesys third-party iframe host (cleaned.html:5127)
        "#genesys-messenger"
        // Genesys messenger iframe host (cleaned.html:5131)
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--header",
        // header XF wrapper (cleaned.html:10)
        "header",
        // <header class="cmp-header"> (cleaned.html:14)
        "nav",
        // primary navigation (cleaned.html:24)
        ".footer.container.responsivegrid",
        // footer XF container (cleaned.html:4937)
        "footer"
        // <footer> (cleaned.html:4938)
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "link",
        "source"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-cmp-")) {
            el.removeAttribute(attr.name);
          }
        });
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-feature": parse,
    "hero-cta": parse2,
    "cards-quicklinks": parse3,
    "cards-promo": parse4,
    "cards-pillars": parse5,
    "cards-feature": parse6,
    "columns-logos": parse7,
    "columns-panels": parse8,
    "columns-apppromo": parse9
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Hostplus homepage with hero, promo banners, brand pillars, content-media blocks, content-list, CTAs, and app promo",
    urls: [
      "https://hostplus.com.au/"
    ],
    blocks: [
      {
        name: "hero-feature",
        instances: ["div.hero-block-V2 div.cmp-hero-block__wrapper"]
      },
      {
        name: "cards-quicklinks",
        instances: ["div.hero-block-V2 div.cmp-hero-block-V2__container > div:nth-of-type(3)"]
      },
      {
        name: "cards-promo",
        instances: ["div.container-block.container.responsivegrid:nth-of-type(2)"]
      },
      {
        name: "cards-pillars",
        instances: ["div.brand-pillars div.cmp-brand-pillars__item-container"]
      },
      {
        name: "columns-logos",
        instances: ["div.cta.--mb-4xl"]
      },
      {
        name: "cards-feature",
        instances: [
          "div.container-block.container.responsivegrid.--mb-4xl:nth-of-type(6) div.content-list-block",
          "div.content-media-block.--mb-4xl:nth-of-type(8)"
        ]
      },
      {
        name: "columns-panels",
        instances: ["div.content-list-block.cmp-content-list__items-wrapper--3cols"]
      },
      {
        name: "hero-cta",
        instances: ["div.cta-shouty.--mb-4xl"]
      },
      {
        name: "columns-apppromo",
        instances: ["div.apppromo.image.--mb-2xl"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
