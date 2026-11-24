/*
  alexhomebarista — site content.
  Everything a visitor reads lives here, so updates never touch layout code.

  RECIPES: entries marked `sample: true` are placeholders written to show the
  layout. Replace them with Alex's real recipes and delete the flag; the
  "Sample" tag disappears on its own.

  LAYERS: each glass is drawn from its layers, top to bottom. `s` is a
  relative share of the glass (proportional, any units).
*/
window.SITE = {
  name: "Alex Gren",
  handle: "alexhomebarista",

  // Leave empty until Alex confirms an address; brand buttons fall back to an Instagram DM.
  contactEmail: "",

  socials: [
    { label: "Instagram", url: "https://www.instagram.com/alexhomebarista" },
    { label: "TikTok", url: "https://www.tiktok.com/@alexhomebarista" },
    { label: "YouTube", url: "https://www.youtube.com/@alexhomebarista" },
    { label: "Amazon Storefront", url: "https://a.co/d/0bRIFIG7" }
  ],
  dmUrl: "https://ig.me/m/alexhomebarista",

  colors: {
    espresso: "#3b2416",
    crema: "#b9824d",
    milk: "#f2ede5",
    oat: "#ece2d2",
    foam: "#fbf8f3",
    brownSugar: "#a8672e",
    vanilla: "#ead7a8",
    pistachio: "#a9bb77",
    lavender: "#bfa9de",
    caramel: "#c98a3c",
    maple: "#9c5a1e"
  },

  recipes: [
    {
      id: "brown-sugar-oat-shaken",
      name: "Brown Sugar Oat Shaken Espresso",
      kind: "drink", temp: "iced", sample: true,
      blurb: "Double shot shaken hard with brown sugar syrup, topped with cold oat milk.",
      spec: [["Dose", "18 g"], ["Yield", "36 g"], ["Time", "28 s"], ["Syrup", "20 ml"], ["Oat milk", "120 ml"]],
      layers: [{ c: "oat", s: 46 }, { c: "crema", s: 10 }, { c: "espresso", s: 26 }, { c: "brownSugar", s: 12 }],
      ingredients: ["18 g espresso, pulled to 36 g", "20 ml brown sugar cinnamon syrup", "120 ml cold oat milk", "Ice, to the top"],
      steps: ["Pull a double shot straight into a shaker with the syrup.", "Add a handful of ice and shake hard for 10 seconds.", "Strain over fresh ice and top with oat milk."]
    },
    {
      id: "pistachio-cream-latte",
      name: "Pistachio Cream Latte",
      kind: "drink", temp: "iced", sample: true,
      blurb: "Pistachio syrup under milk, espresso floated on top so it pours in slow ribbons.",
      spec: [["Dose", "18 g"], ["Yield", "36 g"], ["Time", "30 s"], ["Syrup", "25 ml"], ["Milk", "150 ml"]],
      layers: [{ c: "espresso", s: 18 }, { c: "milk", s: 52 }, { c: "pistachio", s: 16 }],
      ingredients: ["18 g espresso, pulled to 36 g", "25 ml pistachio syrup", "150 ml whole milk", "Ice"],
      steps: ["Add the syrup to the bottom of the glass.", "Fill with ice, then milk to two thirds.", "Pour the shot slowly over the back of a spoon."]
    },
    {
      id: "lavender-honey-latte",
      name: "Lavender Honey Iced Latte",
      kind: "drink", temp: "iced", sample: true,
      blurb: "Soft floral syrup, oat milk, and a shot that keeps it from tasting like soap.",
      spec: [["Dose", "18 g"], ["Yield", "38 g"], ["Time", "29 s"], ["Syrup", "15 ml"], ["Oat milk", "150 ml"]],
      layers: [{ c: "espresso", s: 16 }, { c: "oat", s: 54 }, { c: "lavender", s: 12 }],
      ingredients: ["18 g espresso, pulled to 38 g", "15 ml lavender honey syrup", "150 ml oat milk", "Ice"],
      steps: ["Stir the syrup into the oat milk first so it disperses evenly.", "Pour over ice.", "Top with the shot."]
    },
    {
      id: "vanilla-cold-foam-americano",
      name: "Vanilla Cold Foam Americano",
      kind: "drink", temp: "iced", sample: true,
      blurb: "A clean iced americano under a thick cap of vanilla cold foam.",
      spec: [["Dose", "18 g"], ["Yield", "36 g"], ["Time", "27 s"], ["Syrup", "10 ml"], ["Water", "140 ml"]],
      layers: [{ c: "foam", s: 22 }, { c: "espresso", s: 64 }],
      ingredients: ["18 g espresso, pulled to 36 g", "140 ml cold water", "40 ml cream + 10 ml vanilla bean syrup, frothed cold", "Ice"],
      steps: ["Fill a glass with ice and water.", "Pull the shot over it.", "Froth cream and syrup until thick, then spoon it on top."]
    },
    {
      id: "maple-cortado",
      name: "Maple Cortado",
      kind: "drink", temp: "hot", sample: true,
      blurb: "Equal parts espresso and steamed milk, sweetened with a little maple.",
      spec: [["Dose", "18 g"], ["Yield", "36 g"], ["Time", "28 s"], ["Syrup", "8 ml"], ["Milk", "40 ml"]],
      layers: [{ c: "foam", s: 10 }, { c: "milk", s: 34 }, { c: "crema", s: 14 }, { c: "espresso", s: 34 }],
      ingredients: ["18 g espresso, pulled to 36 g", "8 ml maple pecan syrup", "40 ml steamed milk"],
      steps: ["Pull the shot onto the syrup in a 4.5 oz glass.", "Steam milk with very little air.", "Pour to an even 1:1."]
    },
    {
      id: "salted-caramel-flat-white",
      name: "Salted Caramel Flat White",
      kind: "drink", temp: "hot", sample: true,
      blurb: "Ristretto, silky microfoam and a caramel that leans salty.",
      spec: [["Dose", "18 g"], ["Yield", "30 g"], ["Time", "25 s"], ["Syrup", "12 ml"], ["Milk", "120 ml"]],
      layers: [{ c: "foam", s: 12 }, { c: "milk", s: 50 }, { c: "crema", s: 12 }, { c: "caramel", s: 14 }],
      ingredients: ["18 g espresso, pulled short to 30 g", "12 ml salted caramel syrup", "120 ml steamed milk"],
      steps: ["Stir the syrup into the shot.", "Steam milk to a glossy microfoam.", "Pour from close to the surface for a thin layer of foam."]
    },
    {
      id: "brown-sugar-cinnamon-syrup",
      name: "Brown Sugar Cinnamon",
      kind: "syrup", sample: true, liquid: "brownSugar",
      blurb: "The house syrup. Deep, a little spiced, keeps two weeks in the fridge.",
      spec: [["Makes", "250 ml"], ["Keeps", "14 days"], ["Time", "10 min"]],
      ingredients: ["200 g dark brown sugar", "200 ml water", "2 cinnamon sticks", "Pinch of salt"],
      steps: ["Simmer everything for 5 minutes, stirring until dissolved.", "Steep off the heat for 5 minutes.", "Strain into a clean bottle and chill."]
    },
    {
      id: "vanilla-bean-syrup",
      name: "Vanilla Bean",
      kind: "syrup", sample: true, liquid: "vanilla",
      blurb: "Real bean, rich syrup. Goes in everything.",
      spec: [["Makes", "250 ml"], ["Keeps", "21 days"], ["Time", "15 min"]],
      ingredients: ["200 g cane sugar", "200 ml water", "1 vanilla bean, split and scraped"],
      steps: ["Warm sugar and water until clear.", "Add the bean and seeds; steep 10 minutes off the heat.", "Bottle with the pod in."]
    },
    {
      id: "pistachio-syrup",
      name: "Pistachio",
      kind: "syrup", sample: true, liquid: "pistachio",
      blurb: "Blended raw pistachios, strained twice for a smooth pour.",
      spec: [["Makes", "300 ml"], ["Keeps", "7 days"], ["Time", "20 min"]],
      ingredients: ["100 g shelled raw pistachios", "150 g sugar", "250 ml water", "Pinch of salt"],
      steps: ["Blend pistachios with warm water until smooth.", "Simmer with sugar for 5 minutes.", "Strain through a nut bag, twice."]
    },
    {
      id: "lavender-honey-syrup",
      name: "Lavender Honey",
      kind: "syrup", sample: true, liquid: "lavender",
      blurb: "Floral, soft, and light on the lavender on purpose.",
      spec: [["Makes", "200 ml"], ["Keeps", "14 days"], ["Time", "12 min"]],
      ingredients: ["120 g honey", "120 ml water", "1 tbsp culinary lavender"],
      steps: ["Warm honey and water until loose.", "Steep the lavender for 8 minutes, no longer.", "Strain and bottle."]
    }
  ],

  /*
    GEAR & CODES — copied from Alex's Linktree.
    Casabrews Amazon items: Linktree used tracked wrapper links (r.amzlink.to).
    Paste those exact links back in to keep attribution; the plain Amazon
    product pages below are stand-ins.
  */
  storefront: { label: "My Amazon Storefront", url: "https://a.co/d/0bRIFIG7", note: "Everything on my counter, in one list." },

  gear: [
    {
      group: "Espresso",
      items: [
        { brand: "Gemilai", product: "Espresso machines", code: "ALEX3828A", url: "https://www.gemilai.com/?ref=ALEX" },
        { brand: "Casabrews", product: "ULTRA espresso machine", code: "ALEX20", url: "https://www.casabrews.com/products/casabrews-ultra-espresso-machine" },
        { brand: "Casabrews", product: "3700 Essential", code: "ALEXCOFFEE5", url: "https://www.amazon.com/dp/B0BRSP8YT6" },
        { brand: "Casabrews", product: "Marenza All-In-One", code: null, url: "https://www.amazon.com/dp/B0H364HN1W" },
        { brand: "Casabrews", product: "5418 PRO", code: null, url: "https://www.amazon.com/dp/B0F4DBXT8X" },
        { brand: "Casabrews", product: "CM5418", code: null, url: "https://www.amazon.com/dp/B09X3WGJ3R" }
      ]
    },
    {
      group: "Grinding",
      items: [
        { brand: "Mahlkönig", product: "Grinders", code: "ALEXHOMEBARISTA", url: "https://www.mahlkoenig.us/?ref=ALEXGREN" }
      ]
    },
    {
      group: "Brewing",
      items: [
        { brand: "AeroPress", product: "Coffee makers", code: "HOMEBARISTA", offer: "20% off", url: "https://aeropress.com/HOMEBARISTA" },
        { brand: "Caraway", product: "Glass coffee brewer", code: "ALEXHOMEBARISTA10", url: "https://rstr.co/caraway/60898" },
        { brand: "Pure Over", product: "Glass pour-over", code: "ALEXHOMEBARISTA", url: "https://pureover.com/" }
      ]
    },
    {
      group: "Milk & syrups",
      items: [
        { brand: "Nama", product: "M1 plant-based milk maker", code: "ALEX10", url: "https://namawell.com/products/m1-plant-based-milk-maker?ref=alexhomebarista" },
        { brand: "Surrup.", product: "Coffee syrups", code: "ALEX10", url: "https://surrup.com" }
      ]
    },
    {
      group: "Beans",
      items: [
        { brand: "Trade Coffee", product: "Coffee subscription", code: null, offer: "Free bag with a subscription", url: "https://www.drinktrade.com/pages/l/alexaltitudecoffee?utm_campaign=alexaltitudecoffee&utm_source=insta&utm_medium=influencer" }
      ]
    }
  ],

  brands: ["Mahlkönig", "Gemilai", "Casabrews", "AeroPress", "Trade Coffee", "Nama", "Caraway", "Pure Over", "Surrup."],

  offers: [
    { title: "Short-form video", body: "Reels and TikToks filmed on my own counter: the pull, the pour, the product in real use." },
    { title: "Recipe development", body: "A drink or syrup built around your product, written so followers can make it at home." },
    { title: "YouTube features", body: "Longer reviews and setups for gear that deserves more than thirty seconds." },
    { title: "Codes & storefront", body: "Ongoing affiliate partnerships with a personal code and a place in my Amazon storefront." }
  ],

  // Brand spec sheet. Audience numbers stay "on request" until Alex supplies real ones.
  specs: [
    ["Platforms", "Instagram · TikTok · YouTube · Amazon Storefront"],
    ["Focus", "Home espresso, house syrups, gear for home baristas"],
    ["Formats", "Reels, TikToks, YouTube videos, recipe cards, storefront listings"],
    ["Audience & reach", "On request"],
    ["Rates", "On request, by package"]
  ]
};
