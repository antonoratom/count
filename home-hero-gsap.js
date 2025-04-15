// Start of home-hero section timeline
let heroTl = gsap.timeline({ delay: 1.2 });

heroTl.fromTo(
  "[hero-for]",
  { opacity: 0, width: 0 },
  { opacity: 1, width: "auto", duration: 1, ease: "power4.out" }
);
heroTl.fromTo(
  "[hero-the]",
  { opacity: 0, width: 0 },
  { opacity: 1, width: "auto", duration: 1, ease: "power4.out" },
  0
);
heroTl.fromTo(
  "[hero-c]",
  { opacity: 1, x: 0 },
  { opacity: 0, x: 24, duration: 0.6 },
  "0"
);
heroTl.fromTo(
  "[hero-bg]",
  { opacity: 0 },
  { opacity: 0.2, duration: 1 },
  "<.3"
);
heroTl.fromTo(
  "[hero-p]",
  { opacity: 0, y: 12 },
  { opacity: 1, y: 0, duration: 0.6 },
  "<"
);
heroTl.fromTo(
  "[hero-nav]",
  { opacity: 0, y: -12 },
  { opacity: 1, y: 0, duration: 0.6 },
  "<.4"
);
heroTl.fromTo(
  "[hero-arrow]",
  { opacity: 0, y: 12 },
  { opacity: 1, y: 0, duration: 0.6 },
  "<"
);
heroTl.fromTo(
  "[hero-partners]",
  { opacity: 0, y: 12 },
  { opacity: 1, y: 0, duration: 0.6 },
  "<"
);
// End of home-hero section timeline
