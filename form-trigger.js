// // Function to open the modal
// function openModal() {
//   // Set display to flex on the modal wrapper
//   var modalWrapper = document.querySelector("[modal-wrapper]");
//   modalWrapper.style.display = "flex";
//   setTimeout(function () {
//     // Add 'active' class to modal-wrapper and modal-container
//     var modalContainer = document.querySelector("[modal-container]");
//     modalContainer.classList.add("active");
//     modalWrapper.classList.add("active");
//   }, 100); // 0.4 seconds
// }

// // Function to close the modal
// function closeModal() {
//   // Remove 'active' class from modal-wrapper and modal-container
//   var modalWrapper = document.querySelector("[modal-wrapper]");
//   var modalContainer = document.querySelector("[modal-container]");

//   modalContainer.classList.remove("active");
//   modalWrapper.classList.remove("active");

//   // Set display none after a delay to allow CSS transition
//   setTimeout(function () {
//     modalWrapper.style.display = "none";
//   }, 400); // 0.4 seconds
// }

// // Add click event listeners to elements with [open-modal-trigger]
// var openTriggers = document.querySelectorAll("[open-modal-trigger]");
// openTriggers.forEach(function (trigger) {
//   trigger.addEventListener("click", openModal);
// });

// // Add click event listeners to elements with [close-modal]
// var closeTriggers = document.querySelectorAll("[close-modal]");
// closeTriggers.forEach(function (trigger) {
//   trigger.addEventListener("click", closeModal);
// });

//REDIRECT FORM
// REDIRECT FORM
document.addEventListener("DOMContentLoaded", function () {
  // Select all forms with the specific data-name attribute
  let forms = document.querySelectorAll(
    'form[data-name="[WEBSITE FORM] Get an expert advice"]'
  );

  forms.forEach(function (form) {
    form.addEventListener("formsubmit", function (event) {
      event.detail.form.action = "mailto:uabboyatom@gmail.com";
    });
  });
});
