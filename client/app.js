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

// Convert Score (0-5) to Risk Label & Color Class
function getRiskFromScore(score) {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return { label: "Unknown", className: "secondary" };
  }
  // Logic matches Canadian Risk Levels
  if (score >= 4.0) return { label: "High Risk", className: "danger" }; // Red
  if (score >= 2.5) return { label: "Moderate Risk", className: "moderate" }; // Yellow/Orange
  return { label: "Low Risk", className: "safe" }; // Green
}

function getFlagUrl(iso2) {
  if (!iso2) return null;
  const codeLower = iso2.toLowerCase();
  // Uses FlagCDN for nice SVG flags
  return `https://flagcdn.com/w80/${codeLower}.png`;
}

function renderDashboard(payload) {
  const { ipInfo, advisory, meta } = payload;

  const countryName = advisory.countryName || ipInfo?.country;
  const code = advisory.countryCode || ipInfo?.countryCode;

  countryNameEl.textContent = countryName || "Unknown country";
  countrySubtitleEl.textContent = `Real-time advisory for ${countryName || "this location"}`;

  const score = advisory.score;
  scoreValueEl.textContent = typeof score === "number" ? score.toFixed(2) : "–";

  // Dynamic Coloring for Score
  const risk = getRiskFromScore(score);
  riskLevelEl.textContent = risk.label;
  
  // Clear old classes and add new one
  riskLevelEl.className = `chip ${risk.className}`; 
  
  // Also color the big score number for better visual impact
  scoreValueEl.className = "display-4 fw-bold"; // Reset base classes
  if (risk.className === "danger") scoreValueEl.classList.add("text-danger");
  else if (risk.className === "moderate") scoreValueEl.classList.add("text-warning");
  else if (risk.className === "safe") scoreValueEl.classList.add("text-success");

  advisoryTextEl.textContent = advisory.message || "No specific advisory found.";

  countryCodeEl.textContent = code || "–";

  if (ipInfo && ipInfo.city) {
    locationMetaEl.textContent = `${ipInfo.city}, ${ipInfo.country}`;
  } else {
    locationMetaEl.textContent = "–";
  }

  const flagUrl = getFlagUrl(code);
  if (flagUrl) {
    flagImageEl.src = flagUrl;
    flagImageEl.classList.remove("hidden");
  } else {
    flagImageEl.classList.add("hidden");
  }

  if (meta?.fetchedAt) {
    lastUpdatedEl.textContent = `Last updated: ${formatDateTime(meta.fetchedAt)}`;
  } else if (advisory.updated) {
     lastUpdatedEl.textContent = `Last updated: ${formatDateTime(advisory.updated)}`;
  }

  saveBtn.disabled = false;
}