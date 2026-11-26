const images: Record<string, string> = {
  "personalized-gable-box": "gable-box-loot-bag-party-hat.jpg",
  "personalized-loot-bag": "gable-box-loot-bag-party-hat.jpg",
  "personalized-party-hat": "gable-box-loot-bag-party-hat.jpg",
  "sintra-board": "sintra-board.jpg",
  "tshirt-printing-sublimation-dtf": "tshirt-printing.jpg",
  "tshirt-printing-vinyl-cutout": "tshirt-printing.jpg",
  "personalized-mug": "personalized-mugs.jpg",
  "personalized-ref-magnet": "ref-magnets.jpg",
  "personalized-keychains": "keychains.jpg",
  "personalized-tracing-writing-pad": "tracing&writing-pads.jpg",
  "personalized-shot-glass": "shot-glass.jpg",
  "wall-calendar": "wall&commercial-calendar.jpg",
  "commercial-calendar": "wall&commercial-calendar.jpg",
  "personalized-coloring-book": "coloring-book-choco-dome-candle-pin-badge.jpg",
  "personalized-choco-dome": "coloring-book-choco-dome-candle-pin-badge.jpg",
  "personalized-candle": "coloring-book-choco-dome-candle-pin-badge.jpg",
  "personalized-pin-badge": "coloring-book-choco-dome-candle-pin-badge.jpg",
};
export function serviceImage(slug: string) { return images[slug] ? "/projects/" + images[slug] : undefined; }

export const portfolioCategorySlugs: Record<string, string> = {
  "T-Shirt Printing": "tshirt-printing", "Personalized Gifts": "gifts-souvenirs",
  "Party & Event Printing": "party-event", "Calendar Printing": "calendar-printing",
  "Signage & Display": "signage-display", "Personalized Products": "personalized-products",
};
