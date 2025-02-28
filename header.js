//------ WEB NAVIGATION BEGINNING OF MOTION ------//
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".header-nav-drpdwn_link-bl");
  const bgHover = document.querySelector(".header-link-bg_hover");
  const images = document.querySelectorAll(".header-nav-drpdwn_img-wrap img");

  // Function to simulate hover on the first link
  function simulateHover() {
    const firstLink = links[0];
    if (firstLink) {
      const event = new Event("mouseenter");
      firstLink.dispatchEvent(event);
    }
  }

  links.forEach((link, index) => {
    link.addEventListener("mouseenter", function () {
      const parentContainer = this.closest(".header-nav-drpdwn_cont-bl");

      // Get the dimensions of the hovered link
      const { width, height, top, left } = this.getBoundingClientRect();

      // Get the position of the parent container
      const parentRect = parentContainer.getBoundingClientRect();

      // Calculate the position relative to the parent container
      const relativeTop = top - parentRect.top;
      const relativeLeft = left - parentRect.left;

      // Set the dimensions and opacity of the background hover
      bgHover.style.width = `${width}px`;
      bgHover.style.height = `${height}px`;
      bgHover.style.opacity = "1";

      // Position the background hover element relative to the parent container
      bgHover.style.top = `${relativeTop}px`;
      bgHover.style.left = `${relativeLeft}px`;

      // Map the actual indices to the desired colors
      const colorMap = {
        3: "rgba(136, 153, 255, 0.1)", // Corrected blue value
        4: "rgba(68, 114, 99, 0.1)",
        5: "rgba(116, 194, 185, 0.1)",
      };

      const bgColor = colorMap[index] || "transparent"; // Default to transparent if index not found
      bgHover.style.backgroundColor = bgColor;

      const imgWrap = this.nextElementSibling;
      if (!imgWrap) return; // Exit if no sibling found

      const currentImg = imgWrap.querySelector("img");
      if (!currentImg) return; // Exit if no image found

      // Reset the current image to start animation from initial values
      currentImg.style.transition = "none"; // Disable transition for immediate reset
      currentImg.style.top = "-8px";
      currentImg.style.right = "8px";
      currentImg.style.opacity = "0";

      // Re-enable transition and start animation
      setTimeout(() => {
        currentImg.style.transition = "top 0.4s, right 0.4s, opacity 0.4s";
        currentImg.style.top = "0px";
        currentImg.style.right = "0px";
        currentImg.style.opacity = "1";
      }, 0);

      // Animate all other images
      images.forEach((img) => {
        if (img !== currentImg) {
          img.style.transition = "none"; // Disable transition for immediate reset
          img.style.top = "8px";
          img.style.right = "-8px";
          img.style.opacity = "0";

          // Re-enable transition after reset
          setTimeout(() => {
            img.style.transition = "top 0.1s, right 0.1s, opacity 0.1s";
            img.style.top = "-8px";
            img.style.right = "8px";
          }, 0); // Match the duration of the animation
        }
      });
    });

    link.addEventListener("mouseleave", function () {
      // Reset the dimensions, opacity, and background color
      bgHover.style.width = "0";
      bgHover.style.height = "0";
      bgHover.style.opacity = "0";
      bgHover.style.backgroundColor = "transparent";
    });
  });

  // Simulate hover on the first link after page load
  simulateHover();
});

//GSAP FOR HEADER
$("[dark-section]").each(function () {
  let stickyBl = gsap.timeline({
    scrollTrigger: {
      trigger: $(this),
      start: "top 1%",
      end: "bottom 1%",
      toggleActions: "play reverse play reverse",
      markers: false,
      toggleClass: {
        targets: ".header-bg",
        className: "u-bg-dark",
      },
    },
  });
});

$(window).scroll(function () {
  if ($(window).scrollTop() > 100) {
    $(".header-bg").css("opacity", "1");
  } else {
    $(".header-bg").css("opacity", "0");
  }
});
//end of nav color toggle tl

// Get the current year for footer copyright
const currentYear = new Date().getFullYear();
document.querySelector("[current-year]").textContent = currentYear;
