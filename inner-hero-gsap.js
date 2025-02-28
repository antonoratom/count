//start of home-hero section tl
let heroTl = gsap.timeline();

heroTl.from("[hero-first]", { opacity: 0, y: 12, duration: 1 });
heroTl.from("[hero-second]", { opacity: 0, y: 12, duration: 1 }, "<.4");
heroTl.from("[hero-nav]", { opacity: 0, y: -12, duration: 0.6 }, "<.4");
heroTl.from(
  "[tl-stagger-motion='first']",
  {
    opacity: 0,
    y: 12,
    duration: 0.8,
    stagger: 0.2, // Adjust the stagger duration as needed
  },
  "<0"
);
heroTl.from("[hero-third]", { opacity: 0, y: 12, duration: 1.6 }, "<0");

//end of home-hero section tl
