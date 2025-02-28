// Step 1: Collect all unique trigger values
const triggerElements = document.querySelectorAll("[tag-to-check-triger]");
const uniqueTriggerValues = new Set();

triggerElements.forEach((element) => {
  const dynamicValue = element.getAttribute("tag-to-check-triger");
  if (dynamicValue) {
    uniqueTriggerValues.add(dynamicValue);
  }
});

// Step 2: Process all target elements
const targetElements = document.querySelectorAll("[tag-to-check-target]");

targetElements.forEach((element) => {
  const targetValue = element.getAttribute("tag-to-check-target");

  // Step 3: Check if target value exists in trigger values
  if (!uniqueTriggerValues.has(targetValue)) {
    // Step 4: Hide elements that don't match
    element.style.display = "none";
  } else {
    // Ensure matching elements are visible
    element.style.display = "";
  }
});

if (document.querySelector(".empty-state").offsetParent !== null) {
  document.querySelector(".solutions-filter_wrap").style.display = "none";
}
