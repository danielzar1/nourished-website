# Nourished — Online Store (Prototype)

A high-fidelity, clickable prototype for **Nourished — Natural & Fun Snacks**, launching with the **FUNDAY Natural Sweets** range. Built as a self-contained static site (no build step, no Shopify account needed) and structured so it ports cleanly to a real Shopify theme.

## Preview it
From this folder:

```bash
python -m http.server 8099
```

Then open <http://localhost:8099/index.html>. (Any static server works.)

## Pages
| File | Page |
|------|------|
| `index.html` | Home — hero, pillars, featured products, Build-a-Box CTA, quiz + subscribe, stockists |
| `shop.html` | Shop all 12 products with filters (Fruity / Sour / Chews / Vegan) |
| `product.html?sku=FUN1001` | Product page (driven by `?sku=`) |
| `build-a-box.html` | **Pick & Mix** Build-a-Box (3 / 6 / 12 bags) |
| `quiz.html` | "Find Your Flavour" quiz |
| `subscribe.html` | Subscribe & Save 5% explainer |
| `about.html` | About the Brand (scroll-told story) |
| `stockists.html` | Where to buy + become-a-stockist |
| `contact.html` | Contact form |
| `cart.html` | Full cart page (the slide-in drawer is the primary cart) |

## Editing the catalogue & store rules
Everything lives in **`js/products.js`**:
- `STORE` — shipping fee (R80), free-shipping threshold (R1000), subscription discount (5%), Build-a-Box price per bag (R75), email/phone.
- `PRODUCTS` — the 12 products: name, price, pack description, flavour tags, vegan flag, accent colour and copy.

## Product photos — current status
Real FUNDAY photography (from `Pictures/`) is wired in via the `IMG_OVERRIDES` map in `js/products.js`. The front-of-pack shows by default and the multipack appears on hover.

**8 of 12 products have real photos:** Raspberry Frogs, Sour Vegan Bears*, Strawberry & Cream*, Peaches & Cream, Lollipops, Koalas*, Caramel Chews, Fruity Chews.
(\* only one shot supplied, so it's used for both the front and hover slot.)

**4 still on branded placeholders** (no photo supplied yet): Sour Peach Hearts (FUN1002), Fruity Snakes (FUN1005), Sour Cola Bottles (FUN1006), Party Mix (FUN1008).

**Bonus images not yet used:** `BARBIE` (FUNDAY × Barbie "Berry Kisses") and `RAW C` (Coconut Water Gummies) — limited editions not on the 12-product pricing sheet. Add them as products if wanted.

To add/replace a photo: drop it in `assets/products/` and point its SKU at it in `IMG_OVERRIDES`.

**Logo:** replace `assets/logo/nourished-logo.svg` (keep the filename, or update the path in `js/components.js`).

## How features map to a live Shopify store
| Feature | On Shopify |
|---|---|
| Cart + R80 / free-over-R1000 shipping | Native cart + shipping rates |
| Subscribe & Save 5% | Shopify Subscriptions or Recharge app |
| Build-a-Box 3/6/12 | Bundle app (e.g. Bundler) or custom bundle |
| Quiz / Surprise Me | Custom section / app block |
| Contact form | Shopify contact form |
| Design, motion, flavour theming | Carries over as theme CSS/JS |

## Tech
Vanilla HTML/CSS/JS. Animation via locally vendored **GSAP** + **canvas-confetti** (`vendor/`) — no runtime CDN dependency. All motion respects `prefers-reduced-motion`. Cart persists in `localStorage`.

## Still to confirm (placeholders in place)
- Real SA stockist list (currently illustrative).
- Contact details (email/phone) in `js/products.js` → `STORE`.
- Single-bag Build-a-Box price (default R75).
- SA health/label claim wording before go-live.
