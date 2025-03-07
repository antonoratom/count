// --- SITWAT MESSAGE --- //
const inputElement = document.getElementById("contact-name");

// Function to create the surprise effect
function createSurpriseEffect() {
  const surpriseEffect = document.getElementById("surpriseEffect");

  // Create image effect
  for (let i = 0; i < 50; i++) {
    const imageElement = document.createElement("img");
    imageElement.src =
      "https://cdn.prod.website-files.com/679c88911343e865aed035ef/67c1860a3f1ab729681dc25a_sitwat.png";
    imageElement.classList.add("confetti");
    imageElement.style.position = "absolute";
    imageElement.style.left = `${Math.random() * 100}%`;
    imageElement.style.top = `${Math.random() * 100}%`;
    imageElement.style.width = `${Math.random() * 8}%`; // Adjust size as needed
    imageElement.style.height = "auto"; // Adjust size as needed
    imageElement.style.animationDelay = `${Math.random() * 1.2}s`; // Random delay
    surpriseEffect.appendChild(imageElement);
  }

  // Create surprise text
  const surpriseText = document.createElement("div");
  surpriseText.classList.add("surpriseText");
  surpriseText.innerHTML = "We miss you ❤️";
  surpriseText.style.position = "absolute";
  surpriseText.style.left = `${Math.random() * 80 + 10}%`; // Random horizontal position
  surpriseText.style.top = `${Math.random() * 80 + 10}%`; // Random vertical position
  surpriseEffect.appendChild(surpriseText);

  // Show the surprise effect
  surpriseEffect.style.opacity = 1;

  // Remove all effects after animation completes
  setTimeout(() => {
    surpriseEffect.innerHTML = ""; // Clear all images and text
    surpriseEffect.style.opacity = 0;
  }, 2000); // Clear after 2 seconds
}

// Add an event listener to the input element
inputElement.addEventListener("input", function () {
  // Check if the input value is "Sitwat"
  if (inputElement.value === "Sitwat Hashmi") {
    createSurpriseEffect();
  }
});
