// Square Web Payments — client half.
// The browser only tokenizes the card; the actual charge is completed server-side
// by the Cloud Function at POST /api/pay (see functions/index.js in the apex repo).
//
// SETUP (once you have a Square account):
//   - Put your Application ID + Location ID in the frontend env (.env):
//       VITE_SQUARE_APPLICATION_ID=sandbox-sq0idb-XXXXXXXX
//       VITE_SQUARE_LOCATION_ID=XXXXXXXXXXXXX
//       VITE_SQUARE_ENVIRONMENT=sandbox   # or "production"

const SQUARE_APPLICATION_ID = import.meta.env.VITE_SQUARE_APPLICATION_ID || "";
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID || "";
const SQUARE_ENVIRONMENT = import.meta.env.VITE_SQUARE_ENVIRONMENT || "sandbox";

// Load the Web Payments SDK for the correct environment.
export const loadSquareSdk = () => {
  return new Promise((resolve, reject) => {
    if (window.Square) return resolve(window.Square);
    const src =
      SQUARE_ENVIRONMENT === "production"
        ? "https://web.squarecdn.com/v1/square.js"
        : "https://sandbox.web.squarecdn.com/v1/square.js";
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(window.Square);
    script.onerror = () => reject(new Error("Failed to load Square SDK"));
    document.body.appendChild(script);
  });
};

// Attach a Square card input to a DOM element (e.g. <div id="card-container">).
// Returns the `card` instance; call card.tokenize() on submit.
export const initCard = async (containerSelector = "#card-container") => {
  const Square = await loadSquareSdk();
  if (!SQUARE_APPLICATION_ID || !SQUARE_LOCATION_ID) {
    throw new Error("Square is not configured (missing Application ID / Location ID).");
  }
  const payments = Square.payments(SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID);
  const card = await payments.card();
  await card.attach(containerSelector);
  return card;
};

// Tokenize the card and charge via the Cloud Function.
// `amount` is in USD dollars. Returns the server response.
export const chargeCard = async (card, amount, note) => {
  const result = await card.tokenize();
  if (result.status !== "OK") {
    throw new Error(result.errors?.[0]?.message || "Card tokenization failed.");
  }

  // Same-origin call — Firebase Hosting rewrites /api/** to the `api` function.
  const res = await fetch("/api/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sourceId: result.token, amount, note }),
  });
  return res.json();
};

export default { loadSquareSdk, initCard, chargeCard };
