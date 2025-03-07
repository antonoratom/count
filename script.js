// Global scroll elements appears
function createScrollTrigger(tl, triggerElement) {
  // console.log("Creating ScrollTrigger for:", triggerElement);
  ScrollTrigger.create({
    trigger: triggerElement,
    start: "top 80%",
    end: "bottom 80%",
    onEnter: () => {
      // console.log("Timeline played");
      tl.play();
    },
    // markers: true,
  });
}
//---- MANAGE tl WITH CHEESE GRID ------//
$('[tl-wrap="trigger-w-cheese"]').each(function (index) {
  let tl = gsap.timeline({ paused: true });

  tl.from($(this).find("[tl-single-motion='first']"), {
    opacity: 0,
    ease: "back.out(2)",
    duration: 1.2,
  });
  tl.from(
    $(this).find("[tl-stagger-motion='first-cheese']"),
    {
      opacity: 0,
      scale: 0.94,
      duration: 1,
      // ease: 'back.out(2)',
      stagger: {
        amount: 0.6,
        from: "random",
      },
    },
    "<0.4"
  );
  createScrollTrigger(tl, $(this));
});

//---- MANAGE tl Locations ------//
$('[tl-wrap="trigger-w-location"]').each(function (index) {
  let tl = gsap.timeline({ paused: true });

  tl.from($(this).find("[tl-single-motion='first']"), {
    opacity: 0,
    ease: "back.out(2)",
    duration: 1.2,
  });
  tl.from(
    $(this).find("[tl-stagger-motion='first-location']"),
    {
      opacity: 0,
      y: -6,
      duration: 1,
      // ease: 'back.out(2)',
      stagger: {
        amount: 0.6,
      },
    },
    "<0.4"
  );
  tl.from(
    $(this).find("[tl-stagger-motion='location-img']"),
    {
      opacity: 0,
      y: -6,
      duration: 0.6,
    },
    "<0.8"
  );

  createScrollTrigger(tl, $(this));
});

//---- MANAGE tl WITH TWO SIGNLE ITEMS + ONE STAGGER ------//
$('[tl-wrap="trigger"]').each(function (index) {
  let tl = gsap.timeline({ paused: true });

  tl.from($(this).find("[tl-single-motion='first']"), {
    opacity: 0,
    ease: "back.out(2)",
    duration: 1.2,
  });
  tl.from(
    $(this).find("[tl-single-motion='second']"),
    {
      opacity: 0,
      ease: "back.out(2)",
      duration: 1.2,
    },
    "<.3"
  );
  tl.from(
    $(this).find("[tl-stagger-motion='first']"),
    {
      opacity: 0,
      duration: 1,
      // ease: 'back.out(2)',
      stagger: {
        amount: 0.6,
        from: "start",
      },
    },
    "<0.2"
  );
  createScrollTrigger(tl, $(this));
});

document.addEventListener("DOMContentLoaded", function () {
  // Attach click event listener to all elements with the class 'locations_cli'
  document.querySelectorAll(".locations_cli").forEach(function (element) {
    element.addEventListener("click", function () {
      // Find the child element with the 'data-to-copy' attribute
      const childToCopy = element.querySelector("[data-to-copy]");

      if (childToCopy) {
        // Get the text content of the child element
        const textToCopy = childToCopy.textContent;

        // Use the Clipboard API to copy the text
        navigator.clipboard
          .writeText(textToCopy)
          .then(function () {
            console.log("Text copied to clipboard:", textToCopy);
          })
          .catch(function (err) {
            console.error("Could not copy text: ", err);
          });
      } else {
        console.warn("No child with [data-to-copy] attribute found.");
      }
    });
  });
});

// Function to refresh ScrollTrigger when an image loads
function refreshOnImageLoad() {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("load", () => {
      ScrollTrigger.refresh();
    });
  });
}

// Call the function to set up the event listeners
refreshOnImageLoad();
