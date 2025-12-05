// client/app.js
const API_BASE_URL = window.APP_CONFIG.API_BASE_URL;
const CLIENT_API_KEY = "dev-demo-api-key-123";

let currentCombinedPayload = null;

// DOM elements
const countryNameEl = document.getElementById("country-name");
const countrySubtitleEl = document.getElementById("country-subtitle");
const advisoryTextEl = document.getElementById("advisory-text");
const riskLevelEl = document.getElementById("risk-level");
const countryCodeEl = document.getElementById("country-code");
const locationMetaEl = document.getElementById("location-meta");
const scoreValueEl = document.getElementById("score-value");
const lastUpdatedEl = document.getElementById("last-updated");
const flagImageEl = document.getElementById("flag-image");

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userNameEl = document.getElementById("user-name");
const saveBtn = document.getElementById("save-btn");
const checkBtn = document.getElementById("check-btn");
const refreshHistoryBtn = document.getElementById("refresh-history-btn");
const countryInput = document.getElementById("country-input");
const historyBodyEl = document.getElementById("history-body");

// ---------------- Helpers ----------------

function setLoadingState(isLoading, message = "Loading live data…") {
  if (isLoading) {
    countrySubtitleEl.textContent = message;
    // Optional: Add a spinner class if you have one
  }
}

function formatDateTime(isoString) {
  if (!isoString) return "-";
  const d = new Date(isoString);
  return d.toLocaleString();
}
