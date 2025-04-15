// Start of home-hero section timeline
let heroTl = gsap.timeline();

heroTl.fromTo(
  "[hero-first]",
  { opacity: 0, y: 12 },
  { opacity: 1, y: 0, duration: 1 }
);
heroTl.fromTo(
  "[hero-second]",
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
  "[tl-stagger-motion='first']",
  { opacity: 0, y: 12 },
  {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2, // Adjust the stagger duration as needed
  },
  "<0"
);
heroTl.fromTo(
  "[hero-third]",
  { opacity: 0, y: 12 },
  { opacity: 1, y: 0, duration: 1.6 },
  "<0"
);
