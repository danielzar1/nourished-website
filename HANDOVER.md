# HANDOVER — Nourished Online Store

Welcome, and thanks for picking this up. This one file is your starting point: it explains
what the project is, how to run it, how it's built, the few non-obvious gotchas, and what's
left to do. Read it top to bottom once and you'll be self-sufficient.

---

## 1. What this is
A **high-fidelity, clickable prototype** of an online store for **Nourished** — a South African
"better-for-you" confectionery brand (*"Natural & Fun Snacks"*). The launch range is
**FUNDAY Natural Sweets**.

It is a **self-contained static site**: vanilla HTML / CSS / JavaScript, **no build step, no
framework, no dependencies to install**. It was built prototype-first and is deliberately
structured so it **ports cleanly to a real Shopify theme** later (see §7).

---

## 2. How to run it
From the project folder:

```bash
python -m http.server 8099
# then open http://localhost:8099/index.html
```

Any static file server works (`npx serve`, VS Code Live Server, etc.). There is nothing to
build or compile — edit a file, refresh the browser, done.

---

## 3. Project layout
```
*.html                 one file per page (see table below)
css/styles.css         all design tokens, components, and motion — single stylesheet
js/
  products.js          ★ SINGLE SOURCE OF TRUTH: STORE config, product catalogue, images
  components.js        header / mobile nav / cart drawer / footer (injected on every page)
  cart.js              localStorage cart, totals, shipping, subscription discount
  fx.js                motion / confetti / scroll reveals (respects prefers-reduced-motion)
  shop.js              shop grid, filters, add-to-cart
  product.js · buildbox.js · quiz.js · home.js · contact.js · subscribe.js   per-page logic
vendor/                GSAP, ScrollTrigger, canvas-confetti (local copies — no CDN at runtime)
assets/
  products/            real optimised product photos + SVG placeholders (for the Shopify port)
  logo/                logo (png/svg + source files)
  img/                 favicon
```

### Pages
| File | Page |
|------|------|
| `index.html` | Home — hero, brand pillars, featured products, Build-a-Box, quiz, subscribe |
| `shop.html` | Shop all products, with filters (Fruity / Sour / Chews / Vegan) |
| `product.html?sku=FUN1001` | Product detail page (driven by the `?sku=` query param) |
| `build-a-box.html` | Pick & Mix Build-a-Box (6 / 12 / 18 bags) |
| `quiz.html` | "Find Your Flavour" quiz |
| `subscribe.html` / `subscribe-signup.html` | Subscribe & Save explainer + sign-up flow |
| `about.html` | Brand story (scroll-told) |
| `stockists.html` | Where to buy + become-a-stockist |
| `contact.html` | Contact form |
| `cart.html` | Full cart page (the slide-in drawer is the primary cart UI) |
| `faq.html` · `privacy.html` · `delivery-returns.html` | Support / policy pages |

---

## 4. Where to edit things

**Catalogue and store rules live in `js/products.js` — edit there, nowhere else.**

The `STORE` object at the top holds every business rule:

```js
const STORE = {
  currency: 'R',
  shippingFee: 80,             // flat delivery fee (ZAR)
  freeShippingThreshold: 1000, // free delivery at/over this subtotal
  subscriptionDiscount: 0.10,  // 10% off when subscribed monthly
  pricePerBag: 75,             // Build-a-Box price per individual 50g bag
  boxSizes: [6, 12, 18],       // available Build-a-Box sizes
  email: 'hello@nourished.co.za',
  phone: '+27 (0)10 000 0000',
  ...
};
```

The `PRODUCTS` array below it holds each product: name, price, pack description, flavour tags,
vegan flag, accent colour, and copy. Add/remove/re-price products here and every page updates.

- **Colours, fonts, spacing, motion:** `css/styles.css` (design tokens are at the very top).
- **Header / footer / cart drawer:** `js/components.js` (injected into every page).

---

## 5. ⚠️ The one gotcha worth knowing: images are embedded as base64

`js/products.js` is large (~1.2 MB) because **the product photos are embedded directly in it as
base64 data URIs** (in a map called `IMG_OVERRIDES`), rather than referenced as file paths. The
logo is embedded the same way in `js/components.js`.

**Why:** the site had to load reliably for a client viewing the files directly off a shared drive
(`file://`), where separate image files weren't always readable. Embedding them guarantees the
images ship with the page code.

**What this means for you:**
- Don't be alarmed by the big base64 blobs — that's intentional, not junk.
- The **real, optimised image files still exist** in `assets/products/` and `assets/logo/`. They
  are the originals to use for the Shopify port.
- To swap an image: put the new file in `assets/products/` and update that SKU's entry. To
  regenerate a base64 string, script it (Python `base64` module) — don't hand-paste.
- **For Shopify, switch `IMG_OVERRIDES` from base64 back to the `assets/` file paths** — much
  cleaner once you're on a normal web host.

---

## 6. Hosting & deploy (GitHub Pages)
- **Live site:** https://danielzar1.github.io/nourished-website/
- **Repo:** https://github.com/danielzar1/nourished-website
- **Deploy = push to `main`.** GitHub Pages rebuilds automatically from `main` at the repo root.
  A `.nojekyll` file disables Jekyll processing. There is no CI pipeline — the push *is* the deploy.

```bash
git add -A
git commit -m "your message"
git push        # site updates in ~1 minute
```

---

## 7. How this maps to a real Shopify store
The prototype was designed so each feature has a clean Shopify equivalent:

| Prototype feature | On Shopify |
|---|---|
| Cart + flat/free shipping | Native cart + shipping rates |
| Subscribe & Save (10%) | Shopify Subscriptions or Recharge app |
| Build-a-Box (6/12/18) | Bundle app (e.g. Bundler) or a custom bundle |
| Quiz / "Find Your Flavour" | Custom section / app block |
| Contact form | Native Shopify contact form |
| Design, motion, flavour theming | Carries over as theme CSS/JS |
| Product images | Move from base64 → Shopify-hosted product media (use `assets/` originals) |

---

## 8. Open items / still to confirm with the client
- **Product photography:** most products have real photos; a few are still on branded SVG
  placeholders awaiting supplied images. Search `IMG_OVERRIDES` in `js/products.js` to see which.
- **Contact email:** confirm the canonical address (`hello@nourished.co.za` is currently used
  site-wide; a policy document referenced a slightly different domain).
- **Policy pages** (`privacy.html`, `delivery-returns.html`): drafts — need legal sign-off before
  go-live.
- **Possible new products:** two limited-edition images exist but aren't wired up as products yet
  (need pricing before adding).
- **Stockist list** on `stockists.html` is currently illustrative.

---

## 9. Tech notes
- Vanilla HTML/CSS/JS. No package manager, no bundler.
- Animation via locally vendored **GSAP** + **canvas-confetti** (`vendor/`) — no runtime CDN
  dependency. All motion respects `prefers-reduced-motion`.
- Cart state persists in the browser's `localStorage`.
- Works in any modern browser.

Any questions on the above, the `README.md` covers similar ground more briefly. Good luck!
