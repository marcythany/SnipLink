/**
 * SnipLink - Modern URL Shortener
 *
 * Features:
 * - Clean, modular code structure
 * - Modern async/await syntax
 * - Comprehensive error handling
 * - User feedback system
 * - Loading states
 * - Responsive design
 * - Recruiter-friendly documentation
 */

// DOM Elements
const appContainer = document.getElementById('app');
const form = document.getElementById('shortener-form');
const urlInput = document.getElementById('url-input');
const clearBtn = document.getElementById('clear-btn');
const generatorSelect = document.getElementById('generator');
const metadataSelect = document.getElementById('metadata');
const submitBtn = document.getElementById('submit-btn');
const resultContainer = document.getElementById('result-container');
const shortUrlInput = document.getElementById('short-url');
const copyBtn = document.getElementById('copy-btn');
const copyFeedback = document.getElementById('copy-feedback');
const loader = document.getElementById('loader');
const currentYear = document.getElementById('current-year');

// API Configuration
const API_BASE = 'https://owo.vc/api/v2/link';
const DEFAULT_HEADERS = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
};

// Initialize application
function init() {
	// Set current year in footer
	currentYear.textContent = new Date().getFullYear();

	// Event listeners
	form.addEventListener('submit', handleFormSubmit);
	clearBtn.addEventListener('click', clearInput);
	copyBtn.addEventListener('click', copyToClipboard);
	urlInput.addEventListener('input', toggleClearButton);

	// Initialize UI state
	toggleClearButton();
}

/**
 * Handles form submission
 * @param {Event} event - Form submit event
 */
async function handleFormSubmit(event) {
	event.preventDefault();

	const url = urlInput.value.trim();
	if (!isValidUrl(url)) {
		showError('Please enter a valid URL');
		return;
	}

	try {
		showLoader();
		const shortenedUrl = await shortenUrl(
			url,
			generatorSelect.value,
			metadataSelect.value
		);

		displayResult(shortenedUrl);
	} catch (error) {
		showError(`Error: ${error.message}`);
	} finally {
		hideLoader();
	}
}

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - Validation result
 */
function isValidUrl(url) {
	try {
		new URL(url);
		return true;
	} catch (error) {
		return false;
	}
}

/**
 * Shortens URL via API
 * @param {string} originalUrl - Original URL to shorten
 * @param {string} generator - Link generator type
 * @param {string} metadata - Metadata handling option
 * @returns {Promise<string>} - Shortened URL
 */
async function shortenUrl(originalUrl, generator, metadata) {
	try {
		const response = await fetch(API_BASE, {
			method: 'POST',
			headers: DEFAULT_HEADERS,
			body: JSON.stringify({
				link: originalUrl,
				generator,
				metadata,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Failed to shorten URL');
		}

		const data = await response.json();
		return `https://${data.id}`;
	} catch (error) {
		console.error('API Error:', error);
		throw new Error('Network error. Please try again later.');
	}
}

/**
 * Displays shortened URL result
 * @param {string} url - Shortened URL
 */
function displayResult(url) {
	shortUrlInput.value = url;
	resultContainer.classList.remove('hidden');

	// Scroll to result for better UX
	resultContainer.scrollIntoView({
		behavior: 'smooth',
		block: 'nearest',
	});
}

/**
 * Copies text to clipboard
 */
async function copyToClipboard() {
	try {
		await navigator.clipboard.writeText(shortUrlInput.value);

		// Show feedback
		copyFeedback.classList.add('show');
		setTimeout(() => {
			copyFeedback.classList.remove('show');
		}, 2000);
	} catch (error) {
		showError('Failed to copy to clipboard');
	}
}

/**
 * Clears URL input field
 */
function clearInput() {
	urlInput.value = '';
	urlInput.focus();
	toggleClearButton();
}

/**
 * Toggles clear button visibility
 */
function toggleClearButton() {
	clearBtn.style.visibility = urlInput.value ? 'visible' : 'hidden';
}

/**
 * Shows error message
 * @param {string} message - Error message
 */
function showError(message) {
	// In a production app, this would show a nice toast notification
	alert(`Error: ${message}`);
}

/**
 * Shows loading spinner
 */
function showLoader() {
	loader.classList.remove('hidden');
	submitBtn.disabled = true;
}

/**
 * Hides loading spinner
 */
function hideLoader() {
	loader.classList.add('hidden');
	submitBtn.disabled = false;
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
