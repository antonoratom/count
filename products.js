console.log("DOMContentLoaded event fired"); // Check if this logs

const checkElement = setInterval(function () {
  const element = document.querySelector('input[name="cf-turnstile-response"]');
  if (element) {
    console.log("Element found"); // Check if the element is found
    const grandparent = element.parentElement?.parentElement;
    if (grandparent) {
      grandparent.style.display = "none";
      console.log("Grandparent hidden"); // Confirm hiding the grandparent
    }
    clearInterval(checkElement);
  } else {
    console.log("Element not found yet"); // Log if the element isn't found
  }
}, 100); // Check every 100 milliseconds

// Select all images from the hidden collection list
const images = document.querySelectorAll(".contact-person_item"); // Ensure you're selecting the <img> tag
console.log("Images selected:", images.length); // Log the number of images found

if (images.length > 0) {
  const randomIndex = Math.floor(Math.random() * images.length);
  const randomImageUrl = images[randomIndex].src;

  const dynamicElements = document.querySelectorAll("[data-dynamic-image]");
  console.log("Dynamic elements found:", dynamicElements.length); // Log the number of dynamic elements

  dynamicElements.forEach(function (element) {
    if (element.tagName.toLowerCase() === "image") {
      element.setAttribute("href", randomImageUrl);
      console.log("SVG image updated"); // Confirm SVG update
    } else if (element.tagName.toLowerCase() === "img") {
      element.setAttribute("src", randomImageUrl);
      console.log("Image updated"); // Confirm standard image update
    }
  });
}

// Get all collection items
const collectionItems = document.querySelectorAll(".products-filter-cl > *");

// Track unique global-tag values
const uniqueTags = new Set();

// Loop through items and remove duplicates
collectionItems.forEach((item) => {
  const globalTag = item.getAttribute("global-tag");

  if (uniqueTags.has(globalTag)) {
    // This is a duplicate, remove it
    item.remove();
  } else {
    // This is unique, add to our set
    uniqueTags.add(globalTag);
  }
});
