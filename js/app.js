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
      return await response.json();
    } else {
      throw new Error("Failed to fetch link info");
    }
  } catch (error) {
    console.error("Error getting link information:", error.message);
    return null;
  }
}

// Function to generate a shortened link
async function generateShortenedLink(originalLink, generator, metadata) {
  const apiUrl = "https://owo.vc/api/v2/link";

  const requestBody = JSON.stringify({
    link: originalLink,
    generator: generator,
    metadata: metadata,
  });

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.id) {
        let shortenedLink = data.id;
        // Prepend protocol if missing
        if (
          !shortenedLink.startsWith("http://") &&
          !shortenedLink.startsWith("https://")
        ) {
          shortenedLink = "https://" + shortenedLink;
        }
        return shortenedLink; // Return the shortened link
      } else {
        console.error("Shortened link not found in response data");
        return null;
      }
    } else {
      throw new Error("Failed to generate shortened link");
    }
  } catch (error) {
    console.error("Error generating shortened link:", error.message);
    return null;
  }
}

// Function to handle form submission
async function handleSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  const form = event.target; // Get the form element
  const input = form.querySelector(".link-input");
  const linkInput = form.querySelector(".link-input");
  const link = input.value.trim(); // Get the input value and trim whitespace

  if (!link) return; // If the input is empty, do nothing

  const generatorSelect = form.querySelector("#generator");
  const metadataSelect = form.querySelector("#metadata");

  const generator = generatorSelect.value;
  const metadata = metadataSelect.value;

  try {
    const shortenedLink = await generateShortenedLink(
      link,
      generator,
      metadata
    );

    if (shortenedLink) {
      linkInput.value = shortenedLink; // Update the input value with the shortened link
      // Enable the copy button
      const copyButton = form.querySelector("#input-copy-btn");
      copyButton.disabled = false;

      // Add event listener to copy button
      copyButton.addEventListener("click", () => {
        // Copy the shortened link to the clipboard
        navigator.clipboard
          .writeText(shortenedLink)
          .then(() => {
            console.log("Shortened link copied to clipboard:", shortenedLink);
            // Optionally, you can provide user feedback here
          })
          .catch((error) => {
            console.error("Error copying shortened link to clipboard:", error);
          });
      });
    } else {
      console.error("Failed to generate shortened link.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Create header element
  const header = document.createElement("header");
  header.classList.add("title");

  // Create h1 element
  const h1 = document.createElement("h1");

  // Create anchor element
  const anchor = document.createElement("a");
  anchor.href = "/";

  // Create span element for "Link"
  const span = document.createElement("span");
  span.classList.add("link");
  span.textContent = "Link";

  // Append elements
  anchor.appendChild(document.createTextNode("Snip"));
  anchor.appendChild(span);
  h1.appendChild(anchor);
  header.appendChild(h1);

  // Append header to body
  document.body.appendChild(header);

  // Create main element
  const main = document.createElement("main");

  // Create section element for link form
  const section = document.createElement("section");
  section.classList.add("link-form");

  // Create label for "Generator"
  const generatorLabel = document.createElement("label");
  generatorLabel.textContent = "Generator:";

  // Create select element for generator
  const generatorSelect = document.createElement("select");
  generatorSelect.name = "generator";
  generatorSelect.id = "generator";

  // Create options for generator select
  const generatorOptions = ["owo", "gay", "zws", "sketchy"];
  generatorOptions.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    generatorSelect.appendChild(optionElement);
  });

  // Create div element for input container
  const inputContainer = document.createElement("div");
  inputContainer.classList.add("input-container");

  // Create label for "Link"
  const linkLabel = document.createElement("label");
  linkLabel.setAttribute("for", "link-input");
  linkLabel.classList.add("link-input--image");

  // Create input element for link input
  const linkInput = document.createElement("input");
  linkInput.type = "text";
  linkInput.id = "link-input";
  linkInput.placeholder = "Enter your URL...";
  linkInput.classList.add("link-input");

  // Create button element for copy
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.id = "input-copy-btn";
  copyButton.setAttribute("aria-label", "Copy");

  // Create icon element for copy button
  const copyIcon = document.createElement("i");
  copyIcon.classList.add("fa-solid", "fa-copy");

  // Append icon to copy button
  copyButton.appendChild(copyIcon);

  // Append elements to input container
  inputContainer.appendChild(linkLabel);
  inputContainer.appendChild(linkInput);
  inputContainer.appendChild(copyButton);

  // Create label for "Metadata"
  const metadataLabel = document.createElement("label");
  metadataLabel.textContent = "Metadata:";

  // Create select element for metadata
  const metadataSelect = document.createElement("select");
  metadataSelect.name = "metadata";
  metadataSelect.id = "metadata";

  // Create options for metadata select
  const metadataOptions = [
    "Owoify metadata",
    "Proxy metadata",
    "Ignore metadata",
  ];
  metadataOptions.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.split(" ")[0].toUpperCase();
    optionElement.textContent = option;
    metadataSelect.appendChild(optionElement);
  });

  // Create form element
  const dynamicForm = document.createElement("form");
  dynamicForm.classList.add("link-form");

  // Create button element for submit
  const submitButton = document.createElement("button");
  submitButton.type = "submit"; // Change type to "submit"
  submitButton.id = "submit-btn";
  submitButton.setAttribute("aria-label", "Shorten");
  submitButton.textContent = "Shorten";

  // Append elements to form
  dynamicForm.appendChild(generatorLabel);
  dynamicForm.appendChild(generatorSelect);
  dynamicForm.appendChild(inputContainer);
  dynamicForm.appendChild(metadataLabel);
  dynamicForm.appendChild(metadataSelect);
  dynamicForm.appendChild(submitButton);

  // Add event listener for form submission
  dynamicForm.addEventListener("submit", handleSubmit);

  // Append form to section
  section.appendChild(dynamicForm);

  // Append section to main
  main.appendChild(section);

  // Append main to body
  document.body.appendChild(main);

  // Create footer element
  const footer = document.createElement("footer");
  footer.classList.add("footer-info");

  // Create paragraph element for copyright
  const copyrightParagraph = document.createElement("p");

  // Create copyright text
  const copyrightText = document.createTextNode(
    `© ${new Date().getFullYear()} - Made with love by `
  );

  // Create anchor element for Marcy's GitHub profile
  const githubAnchor = document.createElement("a");
  githubAnchor.href = "https://github.com/marcythany";
  githubAnchor.textContent = "Marcy";

  // Append elements to copyright paragraph
  copyrightParagraph.appendChild(copyrightText);
  copyrightParagraph.appendChild(githubAnchor);

  // Create second paragraph element for powered by message
  const poweredByParagraph = document.createElement("p");

  // Create powered by text
  const poweredByText = document.createTextNode("Powered by ");

  // Create anchor element for owo.vc
  const owoAnchor = document.createElement("a");
  owoAnchor.href = "https://owo.vc";
  owoAnchor.textContent = "owo.vc";

  // Append elements to powered by paragraph
  poweredByParagraph.appendChild(poweredByText);
  poweredByParagraph.appendChild(owoAnchor);

  // Append paragraphs to footer
  footer.appendChild(copyrightParagraph);
  footer.appendChild(poweredByParagraph);

  // Append footer to body
  document.body.appendChild(footer);
});
