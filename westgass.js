if (window.matchMedia("(min-width: 992px)").matches) {
  let aboutBlStartTl = gsap.timeline({
    defaults: { duration: 1 },
    scrollTrigger: {
      trigger: "[about-trigger='start']",
      start: "top top",
      end: "bottom top",
      //   markers: true,
      scrub: true,
    },
  });

  aboutBlStartTl.to("[about-target='fg']", {
    opacity: 0,
    //   ease: "power4.out",
  });
  aboutBlStartTl.from(
    "[about-target='item']",
    {
      y: "-50vh",
      //   ease: "power4.out",
    },
    0
  );

  let aboutBlEndTl = gsap.timeline({
    defaults: { duration: 1 },
    scrollTrigger: {
      trigger: "[about-trigger='end']",
      start: "top bottom",
      end: "bottom 50%",
      //   markers: true,
      scrub: true,
    },
  });

  aboutBlEndTl.to("[about-target='fg']", {
    opacity: 1,
    //   ease: "power4.out",
  });
  aboutBlEndTl.to(
    "[about-target='item']",
    {
      y: "40vh",
      //   ease: "power4.out",
    },
    0
  );
}
