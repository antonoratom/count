//------- OLD VALUES FUNCTION START -------//
function firstValueAnimations() {
  //star visibility
  let starTl = gsap.timeline({
    defaults: { duration: 1 },
    scrollTrigger: {
      trigger: " [star-wrapper]",
      start: "top 15%",
      end: "50% 15%",
      toggleActions: "play reverse play reverse",

      // markers: true,
    },
  });

  starTl.from("[value-target='star']", {
    duration: 1,
    opacity: "0",
    ease: "power4.out",
  });

  //FIRST TL
  let firstVlauePtl = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='first']"), // Directly use the selector
      start: "top 15%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse",
      // scrub: true,
      // markers: true,
    },
  });

  firstVlauePtl.to(
    "[value-trigger='first']",
    {
      opacity: "1",
      color: "#BB9045",
    },
    0
  );
  firstVlauePtl.from(
    "[value-target='first']",
    {
      opacity: "0",
    },
    "<.2"
  );

  let firstVlauePtlScrub = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='first']"), // Directly use the selector
      start: "top 15%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse",
      scrub: true,
      // markers: true,
    },
  });
  firstVlauePtlScrub.to("[value-target='star']", {
    rotation: "90",
    ease: "none",
  });

  //SECOND TL
  let secondVlauePtl = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='second']"), // Directly use the selector
      start: "top 15%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse",
      // scrub: true,
      // markers: true,
    },
  });

  secondVlauePtl.to(
    "[value-trigger='second']",
    {
      opacity: "1",
      color: "#BB9045",
    },
    0
  );
  secondVlauePtl.from(
    "[value-target='second']",
    {
      opacity: "0",
    },
    "<.2"
  );

  let secondVlauePtlScrub = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='second']"), // Directly use the selector
      start: "top 15%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse",
      scrub: true,
      // markers: true,
    },
  });
  secondVlauePtlScrub.to("[value-target='star']", {
    rotation: "180",
    ease: "none",
  });

  //THIRD TL
  let thirdVlauePtl = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='third']"), // Directly use the selector
      start: "top 15%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse",
      // scrub: true,
      // markers: true,
    },
  });

  thirdVlauePtl.to(
    "[value-trigger='third']",
    {
      opacity: "1",
      color: "#BB9045",
    },
    0
  );
  thirdVlauePtl.from(
    "[value-target='third']",
    {
      opacity: "0",
    },
    "<.2"
  );

  let thirdVlauePtlScrub = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='third']"), // Directly use the selector
      start: "top 15%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse",
      scrub: true,
      // markers: true,
    },
  });
  thirdVlauePtlScrub.to("[value-target='star']", {
    rotation: "270",
    ease: "none",
  });

  //FOURTH TL
  let fourthVlauePtl = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='fourth']"), // Directly use the selector
      start: "top 15%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse",
      // scrub: true,
      // markers: true,
    },
  });

  fourthVlauePtl.to(
    "[value-trigger='fourth']",
    {
      opacity: "1",
      color: "#BB9045",
    },
    0
  );

  fourthVlauePtl.from(
    "[value-target='fourth']",
    {
      opacity: "0",
    },
    "<.2"
  );
}
// firstValueAnimations();
//------- OLD VALUES FUNCTION END -------//

//------- NEW VALUES FUNCTION START -------//
function secondValueAnimations() {
  //star visibility
  let starTl = gsap.timeline({
    defaults: { duration: 1 },
    scrollTrigger: {
      trigger: " [star-wrapper]",
      start: "top 33%",
      end: "50% 33%",
      toggleActions: "play reverse play reverse",
      // markers: true,
    },
  });

  starTl.from("[value-target='star']", {
    duration: 1,
    opacity: "0",
    ease: "power4.out",
  });

  //FIRST TL
  let firstVlauePtl = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='first']"), // Directly use the selector
      start: "top 33%",
      end: "bottom 33%",
      toggleActions: "play reverse play reverse",
      // scrub: true,
      // markers: true,
    },
  });

  firstVlauePtl.to(
    "[value-trigger-h='first']",
    {
      opacity: "1",
      color: "#BB9045",
    },
    0
  );
  firstVlauePtl.from(
    "[value-target='first']",
    {
      opacity: "0",
    },
    "<.2"
  );

  let firstVlauePtlScrub = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='first']"), // Directly use the selector
      start: "top 33%",
      end: "bottom 33%",
      toggleActions: "play reverse play reverse",
      scrub: true,
      // markers: true,
    },
  });
  firstVlauePtlScrub.to("[value-target='star']", {
    rotation: "90",
    ease: "none",
  });

  //SECOND TL
  let secondVlauePtl = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='second']"), // Directly use the selector
      start: "top 33%",
      end: "bottom 33%",
      toggleActions: "play reverse play reverse",
      // scrub: true,
      // markers: true,
    },
  });

  secondVlauePtl.to(
    "[value-trigger-h='second']",
    {
      opacity: "1",
      color: "#BB9045",
    },
    0
  );
  secondVlauePtl.from(
    "[value-target='second']",
    {
      opacity: "0",
    },
    "<.2"
  );

  let secondVlauePtlScrub = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='second']"), // Directly use the selector
      start: "top 33%",
      end: "bottom 33%",
      toggleActions: "play reverse play reverse",
      scrub: true,
      // markers: true,
    },
  });
  secondVlauePtlScrub.to("[value-target='star']", {
    rotation: "180",
    ease: "none",
  });

  //THIRD TL
  let thirdVlauePtl = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='third']"), // Directly use the selector
      start: "top 33%",
      end: "bottom 33%",
      toggleActions: "play reverse play reverse",
      // scrub: true,
      // markers: true,
    },
  });

  thirdVlauePtl.to(
    "[value-trigger-h='third']",
    {
      opacity: "1",
      color: "#BB9045",
    },
    0
  );
  thirdVlauePtl.from(
    "[value-target='third']",
    {
      opacity: "0",
    },
    "<.2"
  );

  let thirdVlauePtlScrub = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='third']"), // Directly use the selector
      start: "top 33%",
      end: "bottom 33%",
      toggleActions: "play reverse play reverse",
      scrub: true,
      // markers: true,
    },
  });
  thirdVlauePtlScrub.to("[value-target='star']", {
    rotation: "270",
    ease: "none",
  });

  //FOURTH TL
  let fourthVlauePtl = gsap.timeline({
    scrollTrigger: {
      trigger: $("[value-trigger='fourth']"), // Directly use the selector
      start: "top 33%",
      end: "bottom 33%",
      toggleActions: "play reverse play reverse",
      // scrub: true,
      // markers: true,
    },
  });

  fourthVlauePtl.to(
    "[value-trigger-h='fourth']",
    {
      opacity: "1",
      color: "#BB9045",
    },
    0
  );

  fourthVlauePtl.from(
    "[value-target='fourth']",
    {
      opacity: "0",
    },
    "<.2"
  );
}
secondValueAnimations();
//------- NEW VALUES FUNCTION END -------//

// START ------- CALCULATE HEIGHT OF BLOCKS FOR STORY SECTION ------- //
function calculateAndSetHeights() {
  const images = document.querySelectorAll(".story-tl_bl img");
  let loadedImagesCount = 0;

  function onImageLoad() {
    loadedImagesCount++;
    if (loadedImagesCount === images.length) {
      updateHeights();
    }
  }

  images.forEach((img) => {
    if (img.complete) {
      // If the image is already loaded, increment the counter
      loadedImagesCount++;
    } else {
      // Attach the load event listener
      img.addEventListener("load", onImageLoad);
    }
  });

  // If all images are already loaded, directly update the heights
  if (loadedImagesCount === images.length) {
    updateHeights();
  }

  function updateHeights() {
    const heightMap = {};
    const storyElements = document.querySelectorAll(".story-tl_cli");
    storyElements.forEach((element) => {
      const storyYearTrigger = element.getAttribute("story-year-trigger");

      const elementHeight = element.offsetHeight;

      if (!heightMap[storyYearTrigger]) {
        heightMap[storyYearTrigger] = 0;
      }
      heightMap[storyYearTrigger] += elementHeight;
    });
    console.log("Calculated Heights:", heightMap);

    const targetElements = document.querySelectorAll(".years-tl-triggers_cli");
    targetElements.forEach((element) => {
      const storyYearTarget = element.getAttribute("story-year-target");

      if (heightMap[storyYearTarget] !== undefined) {
        element.style.height = `${heightMap[storyYearTarget]}px`;
        console.log(
          `Setting height for target with story-year-target="${storyYearTarget}": ${heightMap[storyYearTarget]}px`
        );
      }
    });
  }
}

// Call the function to set up the image load listeners
calculateAndSetHeights();

// END ------- CALCULATE HEIGHT OF BLOCKS FOR STORY SECTION ------- //

// // Function to check if all images are loaded
// function waitForImagesToLoad() {
//   const images = document.querySelectorAll(".story-tl_img");
//   let loadedImagesCount = 0;

//   images.forEach((image) => {
//     // Add a load event listener to each image
//     image.addEventListener("load", () => {
//       loadedImagesCount++;
//       // If all images are loaded, call the calculateAndSetHeights function
//       if (loadedImagesCount === images.length) {
//         calculateAndSetHeights();
//       }
//     });

//     // Also handle the case where the image is already loaded
//     if (image.complete) {
//       loadedImagesCount++;
//     }
//   });

//   // If all images are already loaded, immediately call the function
//   if (loadedImagesCount === images.length) {
//     calculateAndSetHeights();
//   }
// }

// // Call the function to wait for images to load
// waitForImagesToLoad();
