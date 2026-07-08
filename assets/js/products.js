/* =============================================================
   Nourished — Catalogue & store config (single source of truth)
   Drives shop, product pages, build-a-box, quiz and cart.
   ============================================================= */

const STORE = {
  currency: 'R',
  shippingFee: 80,
  freeShippingThreshold: 1000,
  subscriptionDiscount: 0.10,
  pricePerBag: 75,
  boxSizes: [6, 12, 18],
  email: 'hello@nourished.co.za',
  phone: '+27 (0)10 000 0000',
  social: { instagram: '#', facebook: '#', tiktok: '#' }
};

const PILLARS = [
  { icon: 'no-sugar', title: 'No Added Sugar', blurb: 'Sweet satisfaction without the sugar rush — sweetened the natural way.' },
  { icon: 'no-alcohol', title: 'No Sugar Alcohols', blurb: 'No maltitol or sorbitol — so none of the bloating or upset tummies those sweeteners are known for.' },
  { icon: 'fibre', title: 'Prebiotic Fibre', blurb: 'A gut-loving dose of plant fibre tucked into every chewy bite.' },
  { icon: 'natural', title: 'Natural Colours & Flavours', blurb: 'Colour and taste from real fruit and plants. Never anything artificial.' },
  { icon: 'gluten', title: 'Gluten Free', blurb: 'Made to be gluten free, so more of the fam can join the fun.' },
  { icon: 'vegan', title: 'Vegan Options', blurb: 'Plant-based picks marked clearly, so every snacker is sorted.' }
];

const ALL_PRODUCTS = [
  {
    sku: 'FUN1001', name: 'Raspberry Gummy Frogs', type: 'gummy',
    packDesc: '12 × 50g bags', bagWeight: '50g', price: 900, mixable: true,
    vegan: false, tags: ['fruity'], flavourProfile: ['fruity', 'classic'],
    accent: '#FF4D7E',
    short: 'Plump, juicy raspberry frogs that hop straight to your happy place.'
  },
  {
    sku: 'FUN1002', name: 'Sour Peach Gummy Hearts', type: 'gummy',
    packDesc: '12 × 50g bags', bagWeight: '50g', price: 900, mixable: true,
    vegan: false, tags: ['sour', 'fruity'], flavourProfile: ['sour', 'fruity'],
    accent: '#FF8A3D',
    short: 'A first-bite zing into a mellow, sun-ripe peach finish.'
  }
];

const PRODUCTS = ALL_PRODUCTS.filter(p => !p.hidden);

const IMG_EXT = 'svg';
const IMG_OVERRIDES = {};

function getProduct(sku) { return PRODUCTS.find(p => p.sku === sku); }
function productImg(p, type) { return IMG_OVERRIDES[p.sku]?.[type === 'pack' ? 'pack' : 'front'] || `assets/products/${p.sku}-${type === 'pack' ? 'pack' : 'fop'}.${IMG_EXT}`; }
function money(n) { return STORE.currency + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

const BOX_HERO_IMG = '';
