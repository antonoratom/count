// Start of home-hero section timeline
let heroTl = gsap.timeline();

heroTl.fromTo(
  "[product-h]",
  { opacity: 0, y: 12 },
  { opacity: 1, y: 0, duration: 1 }
);
heroTl.fromTo(
  "[product-p]",
  { opacity: 0, y: 12 },
  { opacity: 1, y: 0, duration: 1 },
  "<.4"
);
heroTl.fromTo(
  "[hero-nav]",
  { opacity: 0, y: -12 },
  { opacity: 1, y: 0, duration: 0.6 },
  "<.4"
);
heroTl.fromTo(
  "[product-img]",
  { opacity: 0, x: 12 },
  { opacity: 1, x: 0, duration: 1.6 },
  "<0"
);
