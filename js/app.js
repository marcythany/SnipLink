/**
 * Fetches link information from the owo.vc API.
 * @param {string} shortenedLink The shortened link to fetch information for.
 * @returns {Promise<Object|null>} A promise resolving to the fetched link information, or null if an error occurs.
 */
async function getLinkInfo(shortenedLink) {
  const apiUrl = `https://owo.vc/api/v2/link/${encodeURIComponent(
    shortenedLink
  )}`;

  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      return await response.json(); // Simplified return statement
    } else {
      throw new Error("Failed to fetch link info");
    }
  } catch (error) {
    console.error("Error getting link information:", error.message);
    return null;
  }
}

// Function to handle form submission
async function handleSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  const form = event.target; // Get the form element
  const input = form.querySelector(".link-input");
  const link = input.value.trim(); // Get the input value and trim whitespace

  if (!link) return; // If the input is empty, do nothing

  try {
    const linkInfo = await getLinkInfo(link); // Fetch link information from the API
    if (linkInfo) {
      // If link information is successfully fetched, display it
      console.log("Link Information:", linkInfo);
    } else {
      // If there's an error fetching link information, display an error message
      console.error("Failed to fetch link information.");
    }
  } catch (error) {
    // If there's an error, log it
    console.error("Error:", error.message);
  }
}

// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
  // Select the form and submit button
  const form = document.querySelector(".link-form");
  const submitBtn = document.getElementById("submit-btn");

  // Add event listener to form submission
  form.addEventListener("submit", handleSubmit);

  // Add event listener to submit button (optional)
  submitBtn.addEventListener("click", () =>
    form.dispatchEvent(new Event("submit"))
  );

  // Update year in copyright every year
  const currentYear = new Date().getFullYear();
  const copyrightElement = document.querySelector("footer p");
  const yearRegex = /\d+(?= \u00A9)/;
  copyrightElement.textContent = copyrightElement.textContent.replace(
    yearRegex,
    currentYear
  );
  setInterval(() => {
    const currentDate = new Date();
    const nextYear =
      currentDate.getFullYear() + (currentDate.getMonth() < 6 ? -1 : 0);
    copyrightElement.textContent = copyrightElement.textContent.replace(
      yearRegex,
      nextYear.toString()
    );
  }, 86400000); // update every day (24 hours)
});
