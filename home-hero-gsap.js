//start of home-hero section tl
let heroTl = gsap.timeline({ delay: 1.2 });

heroTl.from("[hero-for]", {
  opacity: 0,
  width: 0,
  duration: 1,
  ease: "power4.out",
});
heroTl.from(
  "[hero-the]",
  { opacity: 0, width: 0, duration: 1, ease: "power4.out" },
  0
);
heroTl.to("[hero-c]", { opacity: 0, x: 24, duration: 0.6 }, "0");
heroTl.from("[hero-bg]", { opacity: 0, duration: 1 }, "<.3");
heroTl.from("[hero-p]", { opacity: 0, y: 12, duration: 0.6 }, "<");
heroTl.from("[hero-nav]", { opacity: 0, y: -12, duration: 0.6 }, "<.4");
heroTl.from("[hero-arrow]", { opacity: 0, y: 12, duration: 0.6 }, "<");
heroTl.from("[hero-partners]", { opacity: 0, y: 12, duration: 0.6 }, "<");
//end of home-hero section tl
