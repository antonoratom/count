document.addEventListener("DOMContentLoaded", function () {
  // Check for the element periodically in case it's added dynamically
  const element = document.querySelector('input[name="cf-turnstile-response"]');

  if (element) {
    const grandparent = element.parentElement?.parentElement;
    if (grandparent) {
      grandparent.style.display = "none";
    }
    clearInterval(checkElement);
  }

  // Select all images from the hidden collection list
  const images = document.querySelectorAll(".contact-person_item");

  if (images.length > 0) {
    // Get a random index based on the number of images
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImageUrl = images[randomIndex].src;

    // Select all elements with the data-dynamic-image attribute
    const dynamicElements = document.querySelectorAll("[data-dynamic-image]");

    // Set the appropriate attribute for each element based on its type
    dynamicElements.forEach(function (element) {
      if (element.tagName.toLowerCase() === "image") {
        // If the element is an SVG <image> element
        element.setAttribute("href", randomImageUrl);
      } else if (element.tagName.toLowerCase() === "img") {
        // If the element is a standard <img> element inside a <div>
        element.setAttribute("src", randomImageUrl);
      }
    });
  }
});
