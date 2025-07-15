/**
 * SnipLink - Zelda-inspired URL Shortener
 *
 * Features:
 * - Legend of Zelda theme throughout
 * - shrtcode.de API integration
 * - Link character in input field
 * - Triforce symbols and Zelda decorations
 * - Enhanced Zelda-themed user experience
 */

// DOM Elements
const form = document.getElementById('shortener-form');
const urlInput = document.getElementById('url-input');
const clearBtn = document.getElementById('clear-btn');
const submitBtn = document.getElementById('submit-btn');
const resultContainer = document.getElementById('result-container');
const shortUrlInput = document.getElementById('short-url');
const copyBtn = document.getElementById('copy-btn');
const copyFeedback = document.getElementById('copy-feedback');
const loader = document.getElementById('loader');
const currentYear = document.getElementById('current-year');

// API Configuration
const API_URL = 'https://api.shrtco.de/v2/shorten?url=';

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
		showError('Please enter a valid URL (starting with http:// or https://)');
		return;
	}

	try {
		showLoader();
		const shortenedUrl = await shortenUrl(url);
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
 * Shortens URL via shrtcode API
 * @param {string} originalUrl - Original URL to shorten
 * @returns {Promise<string>} - Shortened URL
 */
async function shortenUrl(originalUrl) {
	try {
		const response = await fetch(
			`${API_URL}${encodeURIComponent(originalUrl)}`
		);
		const data = await response.json();

		if (!data.ok) {
			throw new Error(data.error || 'Failed to shorten URL');
		}

		// Return the first available short link
		return (
			data.result.full_short_link ||
			data.result.short_link ||
			`https://shrtco.de/${data.result.code}`
		);
	} catch (error) {
		console.error('API Error:', error);
		throw new Error('Failed to shorten URL. Please try again later.');
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
	// Create error element if it doesn't exist
	let errorEl = document.getElementById('error-message');
	if (!errorEl) {
		errorEl = document.createElement('div');
		errorEl.id = 'error-message';
		errorEl.className = 'error-message';
		form.prepend(errorEl);
	}

	errorEl.textContent = message;
	errorEl.classList.add('show');

	setTimeout(() => {
		errorEl.classList.remove('show');
	}, 3000);
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
