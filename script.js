// ─── Service Worker ───────────────────────────────────────────────────────────
// FIX: Registering a Service Worker from a blob: URL is blocked/unreliable in
// most browsers (SecurityError) and won't persist across reloads. We now
// register a real service-worker.js file instead.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").catch((err) => {
    console.error("Service worker registration failed:", err);
  });
}

// ─── State & Storage ──────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
];

const SAMPLE_ITEMS = [
  "Rice",
  "Tomatoes",
  "Onions",
  "Chicken",
  "Beef",
  "Fish",
  "Eggs",
  "Milk",
  "Bread",
  "Sugar",
  "Salt",
  "Pepper",
  "Palm Oil",
  "Groundnut Oil",
  "Yam",
  "Plantain",
  "Garlic",
  "Ginger",
  "Carrots",
  "Potatoes",
  "Noodles",
  "Pasta",
  "Flour",
  "Butter",
  "Cucumber",
  "Lettuce",
  "Watermelon",
  "Orange",
  "Banana",
  "Detergent",
  "Soap",
  "Shampoo",
  "Toothpaste",
  "Tissue Paper",
  "Beans",
  "Crayfish",
  "Stockfish",
  "Sardines",
];

const PRESET_PRODUCT_IMAGES = {
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmljZXxlbnwwfHwwfHx8MA%3D%3D",
  tomatoes:
    "https://images.unsplash.com/photo-1524593166156-312f362cada0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  onions:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Onions.jpg?width=700",
  beans:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhbnN8ZW58MHx8MHx8fDA%3D%3D",
  chicken:
    "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbnxlbnwwfHwwfHx8MA%3D%3D",
  fish: "https://images.unsplash.com/photo-1580959375944-abd7e991f971?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlzaHxlbnwwfHwwfHx8MA%3D%3D",
  eggs: "https://images.unsplash.com/photo-1585985947529-5a8f5a4a9cf1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZWdnc3xlbnwwfHwwfHx8MA%3D%3D",
  milk: "https://images.unsplash.com/photo-1577003832033-a7581cd1dbe5?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWlsa3xlbnwwfHwwfHx8MA%3D%3D",
  bread:
    "https://images.unsplash.com/photo-1509620119767-30145078519d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnJlYWR8ZW58MHx8MHx8fDA%3D%3D",
  butter:
    "https://images.unsplash.com/photo-1589985643862-69ff75ff38eb?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnV0dGVyfGVufDB8fDB8fHww",
  yam: "https://images.unsplash.com/photo-1540931855049-b6b5ce034e4b?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8eWFtfGVufDB8fDB8fHww",
  plantain:
    "https://images.unsplash.com/photo-1610885112584-a3c4f47f2a1f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGxhbnRhaW58ZW58MHx8MHx8fDA%3D%3D",
  carrots:
    "https://images.unsplash.com/photo-1572696969935-65bc3106db9f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Fycm90c3xlbnwwfHwwfHx8MA%3D%3D",
  potatoes:
    "https://images.unsplash.com/photo-1596803686545-e42f1a17ae82?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG90YXRvZXN8ZW58MHx8MHx8fDA%3D%3D",
  banana:
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmFuYW5hfGVufDB8fDB8fHww",
  orange:
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b3JhbmdlfGVufDB8fDB8fHww",
  garlic:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Garlic.jpg?width=700",
  ginger:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ginger_Root.jpg?width=700",
  lettuce:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Lettuce_iceberg_variety.jpeg?width=700",
  cucumber:
    "https://images.unsplash.com/photo-1604645953612-ab6a9c6b37fe?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y3VjdW1iZXJ8ZW58MHx8MHx8fDA%3D%3D",
  pepper:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Red_chili_peppers_Mesilla_NM.jpg?width=700",
  salt: "https://commons.wikimedia.org/wiki/Special:FilePath/Salt_shaker_on_white_background.jpg?width=700",
  sugar:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sugar_2xmacro.jpg?width=700",
};

const MEASUREMENT_UNITS = [
  { value: "", label: "Unit" },
  { value: "kg", label: "kg" },
  { value: "g", label: "g" },
  { value: "bag", label: "bag" },
  { value: "bags", label: "bags" },
  { value: "piece", label: "piece" },
  { value: "pieces", label: "pieces" },
  { value: "pack", label: "pack" },
  { value: "packs", label: "packs" },
  { value: "bottle", label: "bottle" },
  { value: "bottles", label: "bottles" },
  { value: "litre", label: "litre" },
  { value: "litres", label: "litres" },
  { value: "dozen", label: "dozen" },
];

const COUNTRIES = [
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "US", name: "USA", flag: "🇺🇸" },
  { code: "GB", name: "UK", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
];

function load(key, def) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : def;
  } catch (error) {
    console.warn(`Unable to load "${key}" from local storage.`, error);
    return def;
  }
}

function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (error) {
    console.warn(`Unable to save "${key}" to local storage.`, error);
    showToast("Could not save changes on this device");
  }
}

let state = {
  view: load("st_active_trip", null) ? "active" : "home",
  trips: load("st_trips", []),
  currency: load("st_currency", CURRENCIES[0]),
  activeTrip: load("st_active_trip", null),
  selectedTrip: null,
  selectedItem: null,
  editingScheduled: null,
  modal: null, // 'schedule' | 'ai' | 'finish'
  calMonth: new Date().getMonth(),
  calYear: new Date().getFullYear(),
  priceFilter: "",
  histSearch: "",
  tripFilter: "all",
  aiSuggestions: [],
  aiLoading: false,
  scheduledTrips: load("st_scheduled", []),
  defaultBudget: load("st_default_budget", ""),
  incomingSharedList: null,
  imageCache: load("st_image_cache", {}),
  userName: load("st_user_name", ""),
  userCountry: load("st_user_country", null),
  onboardingStep: load("st_onboarding_step", 0),
  themePreference: getThemePreference(),
  welcomePrompted: false,
  toast: null,
};

function setState(patch) {
  Object.assign(state, typeof patch === "function" ? patch(state) : patch);
  render();
}

function getThemePreference() {
  const saved = load("st_theme", null);
  if (["light", "dark", "system"].includes(saved)) return saved;
  const legacy = load("st_dark_mode", null);
  return typeof legacy === "boolean" ? (legacy ? "dark" : "light") : "system";
}

function isDarkTheme() {
  return (
    state.themePreference === "dark" ||
    (state.themePreference === "system" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches)
  );
}

function applyTheme() {
  const dark = isDarkTheme();
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.body.classList.toggle("dark-mode", dark);
  document.body.classList.toggle("light-mode", !dark);
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = dark ? "#0F1A14" : "#1B4332";
}

function setThemePreference(preference) {
  if (!["light", "dark", "system"].includes(preference)) return;
  save("st_theme", preference);
  setState({ themePreference: preference });
}

const systemTheme = window.matchMedia?.("(prefers-color-scheme: dark)");
systemTheme?.addEventListener?.("change", () => {
  if (state.themePreference === "system") {
    applyTheme();
    render();
  }
});

// Build a shareable link that encodes the current trip's items and budget.
// Anyone who opens this link in ShopTrack (same hosted app) will be offered
// the option to import the list straight into their own app.
function encodeSharedList(trip) {
  const payload = {
    v: 1,
    d: trip.date,
    b: trip.budget || null,
    cc: state.currency.code,
    cs: state.currency.symbol,
    items: trip.items.map((i) => ({
      n: i.name,
      q: i.qty || 1,
      u: i.unit || "",
      p: i.price || "",
    })),
  };
  return btoa(encodeURIComponent(JSON.stringify(payload)));
}

function decodeSharedList(encoded) {
  try {
    const payload = JSON.parse(decodeURIComponent(atob(encoded)));
    if (!payload || !Array.isArray(payload.items) || !payload.items.length)
      return null;
    return {
      date: payload.d || todayStr(),
      budget: payload.b || "",
      currencyCode: payload.cc || state.currency.code,
      currencySymbol: payload.cs || state.currency.symbol,
      items: payload.items
        .filter((i) => i && typeof i.n === "string" && i.n.trim())
        .map((i) => ({
          name: i.n.trim(),
          qty: i.q || 1,
          unit: i.u || "",
          price: i.p || "",
        })),
    };
  } catch (error) {
    console.warn("Unable to decode shared list:", error);
    return null;
  }
}

function buildShareLink(trip) {
  const encoded = encodeSharedList(trip);
  const url = new URL(location.href);
  url.search = `?list=${encoded}`;
  url.hash = "";
  return url.toString();
}

function shareCurrentTrip() {
  if (!state.activeTrip) return;
  const lines = [
    `ShopTrack list - ${fmtDate(state.activeTrip.date)}`,
    ...(state.activeTrip.budget
      ? [`Budget: ${state.currency.symbol}${Number(state.activeTrip.budget).toLocaleString()}`]
      : []),
    ...state.activeTrip.items.map(
      (item) =>
        `- ${item.name} (${item.qty || 1}${item.unit ? ` ${item.unit}` : ""})${item.price ? ` - ${state.currency.symbol}${item.price}` : ""}`,
    ),
  ];
  const text = lines.join("\n");
  const link = buildShareLink(state.activeTrip);

  if (navigator.share) {
    navigator
      .share({ title: "ShopTrack shopping list", text, url: link })
      .catch((error) => {
        if (error.name !== "AbortError") console.warn("Share failed:", error);
      });
  } else if (navigator.clipboard) {
    navigator.clipboard
      .writeText(`${text}\n\nOpen in ShopTrack: ${link}`)
      .then(() =>
        showToast("List + shareable link copied to clipboard"),
      )
      .catch((error) => {
        console.warn("Unable to copy list:", error);
        showToast("Sharing is unavailable on this device");
      });
  } else {
    showToast("Sharing is unavailable on this device");
  }
}

// Checks the current URL for a `?list=` param created by buildShareLink()
// and, if present, offers to import it as a new trip.
function checkForSharedList() {
  const params = new URLSearchParams(location.search);
  const encoded = params.get("list");
  if (!encoded) return;
  const shared = decodeSharedList(encoded);
  // Clean the URL so refreshing doesn't re-trigger the import prompt.
  const cleanUrl = new URL(location.href);
  cleanUrl.searchParams.delete("list");
  history.replaceState({}, "", cleanUrl.toString());
  if (!shared) {
    showToast("That shared list link looks invalid");
    return;
  }
  state.incomingSharedList = shared;
  state.modal = "import_list";
}

function importSharedList() {
  const shared = state.incomingSharedList;
  if (!shared) return;
  const trip = {
    id: uid(),
    date: todayStr(),
    items: shared.items.map((i) => ({
      id: uid(),
      name: i.name,
      price: i.price,
      qty: i.qty,
      unit: i.unit,
      checked: false,
    })),
    budget: shared.budget || "",
    status: "active",
    createdAt: new Date().toISOString(),
  };
  save("st_active_trip", trip);
  setState({
    activeTrip: trip,
    view: "active",
    modal: null,
    incomingSharedList: null,
  });
  showToast("Shared list imported 🎉");
}

function exportTrips() {
  const data = {
    trips: state.trips,
    scheduledTrips: state.scheduledTrips,
    currency: state.currency,
    userName: state.userName,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `shoptrack-backup-${todayStr()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Trip data exported");
}

function importTrips(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data.trips) || !Array.isArray(data.scheduledTrips))
        throw new Error("Invalid ShopTrack backup");
      save("st_trips", data.trips);
      save("st_scheduled", data.scheduledTrips);
      if (data.currency) save("st_currency", data.currency);
      if (typeof data.userName === "string")
        save("st_user_name", data.userName);
      state.trips = data.trips;
      state.scheduledTrips = data.scheduledTrips;
      state.currency = data.currency || state.currency;
      state.userName = data.userName || state.userName;
      setState({ view: "home" });
      showToast("Trip data imported");
    } catch (error) {
      console.error("Import failed:", error);
      showToast("That backup file is not valid");
    }
  };
  reader.readAsText(file);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayStr() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}
function fmtDate(d) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function fmtCur(amount, sym) {
  if (!amount && amount !== 0) return "—";
  return sym + Number(amount).toLocaleString();
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character],
  );
}
const imageRequests = new Set();

function productImage(name) {
  const key = name.trim().toLowerCase();
  const cached = PRESET_PRODUCT_IMAGES[key] || state.imageCache[key];
  if (cached) return cached;
  const label = encodeURIComponent(name.slice(0, 2).toUpperCase());
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72 72'%3E%3Crect width='72' height='72' rx='14' fill='%23E8F5E9'/%3E%3Ctext x='36' y='44' text-anchor='middle' font-family='Arial' font-size='22' font-weight='700' fill='%232E7D32'%3E${label}%3C/text%3E%3C/svg%3E`;
}

async function loadProductImages() {
  if (!navigator.onLine) return;
  const names = [
    ...new Set(
      [...document.querySelectorAll("[data-product-image]")].map(
        (element) => element.dataset.productImage,
      ),
    ),
  ].filter((name) => {
    const key = name.trim().toLowerCase();
    return (
      !PRESET_PRODUCT_IMAGES[key] &&
      !state.imageCache[key] &&
      !imageRequests.has(key)
    );
  });

  for (const name of names.slice(0, 8)) {
    imageRequests.add(name.toLowerCase());
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(
        `https://api.openverse.org/v1/images/?q=${encodeURIComponent(`${name} grocery food`)}&page_size=1`,
        {
          signal: controller.signal,
        },
      );
      clearTimeout(timeout);
      if (!response.ok)
        throw new Error(`Openverse returned ${response.status}`);
      const data = await response.json();
      const imageURL = data.results?.[0]?.thumbnail || data.results?.[0]?.url;
      if (typeof imageURL !== "string" || !imageURL.startsWith("http"))
        continue;
      const imageCache = {
        ...state.imageCache,
        [name.toLowerCase()]: imageURL,
      };
      save("st_image_cache", imageCache);
      state.imageCache = imageCache;
      document
        .querySelectorAll(`[data-product-image="${CSS.escape(name)}"]`)
        .forEach((image) => {
          image.src = imageURL;
        });
    } catch (error) {
      console.warn(`Unable to load an image for "${name}".`, error);
    } finally {
      imageRequests.delete(name.toLowerCase());
    }
  }
}
function allHistoryItems() {
  return [...new Set(state.trips.flatMap((t) => t.items.map((i) => i.name)))];
}
function getPriceHistory(name) {
  const entries = [];
  state.trips.forEach((trip) => {
    const found = trip.items.find(
      (i) => i.name.toLowerCase() === name.toLowerCase() && i.price,
    );
    if (found) entries.push({ date: trip.date, price: Number(found.price) });
  });
  return entries.sort((a, b) => a.date.localeCompare(b.date));
}
function showToast(msg) {
  setState({ toast: msg });
  setTimeout(() => setState({ toast: null }), 2500);
}

// ─── Notifications ────────────────────────────────────────────────────────────
async function requestNotifPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const p = await Notification.requestPermission();
  return p === "granted";
}

function scheduleNotification(trip) {
  if (!("Notification" in window)) return;
  const tripDate = new Date(
    trip.date + "T" + (trip.reminderTime || "08:00") + ":00",
  );
  const now = new Date();
  const delay = tripDate - now;
  if (delay <= 0) return;
  setTimeout(
    () => {
      if (Notification.permission === "granted") {
        new Notification("🛒 ShopTrack Reminder", {
          body: `Don't forget — you planned a market trip today! ${trip.items.length} items on your list.`,
          icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" rx="16" fill="%231B4332"/%3E%3Ctext x="32" y="44" font-size="32" text-anchor="middle"%3E🛒%3C/text%3E%3C/svg%3E',
          badge:
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" rx="16" fill="%231B4332"/%3E%3C/svg%3E',
          tag: "shoptrack-" + trip.id,
        });
      }
    },
    Math.min(delay, 2147483647),
  );
}

// ─── AI Suggestions ───────────────────────────────────────────────────────────
async function fetchAISuggestions() {
  setState({ aiLoading: true, modal: "ai" });
  const hist = allHistoryItems().slice(0, 30).join(", ") || "none";
  const current =
    (state.activeTrip?.items || []).map((i) => i.name).join(", ") || "none";
  const prompt = `You are a helpful shopping assistant. User's current shopping list: ${current}. Items they've bought before: ${hist}. Suggest 8 practical market/grocery items they likely need to restock or buy. Prioritize items from their history. Respond ONLY with a JSON array of strings. No markdown. Example: ["Rice","Tomatoes"]`;

  const localSuggestions = [...new Set([...allHistoryItems(), ...SAMPLE_ITEMS])]
    .filter(
      (item) =>
        !(state.activeTrip?.items || []).some(
          (currentItem) =>
            currentItem.name.toLowerCase() === item.toLowerCase(),
        ),
    )
    .slice(0, 8);

  try {
    // A backend can be opted into without exposing an API key in this client.
    const endpoint = window.SHOPTRACK_AI_ENDPOINT;
    if (!endpoint) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setState({ aiSuggestions: localSuggestions, aiLoading: false });
      return;
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error(`AI service returned ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.suggestions))
      throw new Error("AI service returned an invalid response");
    const suggestions = data.suggestions.filter(
      (item) => typeof item === "string",
    );
    const filtered = suggestions.filter(
      (s) =>
        !(state.activeTrip?.items || []).some(
          (item) => item.name.toLowerCase() === s.toLowerCase(),
        ),
    );
    setState({ aiSuggestions: filtered.slice(0, 8), aiLoading: false });
  } catch (error) {
    console.error("AI fetch error:", error);
    setState({ aiSuggestions: localSuggestions, aiLoading: false });
  }
}

// ─── Trip Actions ─────────────────────────────────────────────────────────────
function startNewTrip(date, budget) {
  const trip = {
    id: uid(),
    date: date || todayStr(),
    items: [],
    budget: budget !== undefined ? budget : state.defaultBudget || "",
    status: "active",
    createdAt: new Date().toISOString(),
  };
  save("st_active_trip", trip);
  setState({ activeTrip: trip, view: "active" });
}

function setBudget(amount) {
  const value = amount === "" ? "" : amount;
  save("st_default_budget", value);
  if (state.activeTrip) {
    const activeTrip = { ...state.activeTrip, budget: value };
    setState({ activeTrip, defaultBudget: value, modal: null });
    saveActiveTrip();
  } else {
    setState({ defaultBudget: value, modal: null });
  }
  showToast(value ? `Budget set to ${state.currency.symbol}${Number(value).toLocaleString()}` : "Budget cleared");
}

function saveActiveTrip() {
  if (!state.activeTrip) return;
  const trips = state.trips.filter((t) => t.id !== state.activeTrip.id);
  const updated = [...trips, state.activeTrip];
  save("st_trips", updated);
  save("st_active_trip", state.activeTrip);
  setState({ trips: updated });
}

function finishTrip() {
  if (!state.activeTrip) return;
  const finished = {
    ...state.activeTrip,
    status: "completed",
    completedAt: new Date().toISOString(),
  };
  const trips = state.trips.filter((t) => t.id !== finished.id);
  const updated = [finished, ...trips];
  save("st_trips", updated);
  save("st_active_trip", null);
  setState({ trips: updated, activeTrip: null, view: "home", modal: null });
  showToast("Trip saved! 🎉");
}

function addItemToTrip(name) {
  if (!name.trim() || !state.activeTrip) return;
  const exists = state.activeTrip.items.find(
    (i) => i.name.toLowerCase() === name.toLowerCase(),
  );
  if (exists) return;
  let lastPrice = "";
  for (const t of state.trips) {
    const found = t.items.find(
      (i) => i.name.toLowerCase() === name.toLowerCase() && i.price,
    );
    if (found) {
      lastPrice = found.price;
      break;
    }
  }
  const item = {
    id: uid(),
    name: name.trim(),
    price: lastPrice,
    qty: 1,
    unit: "",
    checked: false,
  };
  const items = [...state.activeTrip.items, item];
  setState({ activeTrip: { ...state.activeTrip, items } });
  saveActiveTrip();
}

function updateItem(id, field, value) {
  if (!state.activeTrip) return;
  const items = state.activeTrip.items.map((i) =>
    i.id === id ? { ...i, [field]: value } : i,
  );
  setState({ activeTrip: { ...state.activeTrip, items } });
  saveActiveTrip();
}

function removeItem(id) {
  if (!state.activeTrip) return;
  const items = state.activeTrip.items.filter((i) => i.id !== id);
  setState({ activeTrip: { ...state.activeTrip, items } });
  saveActiveTrip();
}

// ─── Schedule Trip ────────────────────────────────────────────────────────────
function saveScheduledTrip(date, time, note) {
  if (state.editingScheduled) {
    const editingId = state.editingScheduled.id;
    const updated = state.scheduledTrips.map((trip) =>
      trip.id === state.editingScheduled.id
        ? { ...trip, date, reminderTime: time, note }
        : trip,
    );
    const updatedTrip = updated.find((trip) => trip.id === editingId);
    save("st_scheduled", updated);
    setState({ scheduledTrips: updated, modal: null, editingScheduled: null });
    if (updatedTrip) scheduleNotification(updatedTrip);
    showToast("Scheduled trip updated");
    return;
  }
  const existing = state.scheduledTrips.find((t) => t.date === date);
  if (existing) {
    showToast("Trip already scheduled for this date");
    return;
  }
  // ERROR FIX: No validation if date is in the past
  const tripDate = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (tripDate < today) {
    showToast("Cannot schedule trip in the past");
    return;
  }
  const trip = {
    id: uid(),
    date,
    reminderTime: time,
    note,
    createdAt: new Date().toISOString(),
    items: [],
  };
  const scheduled = [...state.scheduledTrips, trip];
  save("st_scheduled", scheduled);
  setState({ scheduledTrips: scheduled, modal: null });
  scheduleNotification(trip);
  showToast(`Trip scheduled for ${fmtDate(date)} 📅`);
}

function startScheduledTrip(scheduled) {
  const trip = {
    id: uid(),
    date: scheduled.date,
    items: scheduled.items || [],
    status: "active",
    createdAt: new Date().toISOString(),
  };
  const remaining = state.scheduledTrips.filter((t) => t.id !== scheduled.id);
  save("st_scheduled", remaining);
  setState({
    scheduledTrips: remaining,
    activeTrip: trip,
    view: "active",
    modal: null,
  });
  save("st_active_trip", trip);
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const icons = {
  logo: `<svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect width="32" height="32" rx="10" fill="currentColor"/><path d="M8 10h3l2 12h10l2-9H12" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="15" cy="26" r="1.5" fill="#fff"/><circle cx="23" cy="26" r="1.5" fill="#fff"/><path d="m18 7 2 2 4-4" stroke="#C8E6C9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  home: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  cart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  calendar: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  history: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>`,
  chart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
  settings: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  plus: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  back: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  spark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  bell: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  share: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  trending: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8z"/></svg>`,
  system: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
};

// ─── Render Engine ────────────────────────────────────────────────────────────
function render() {
  const app = document.getElementById("app");
  applyTheme();
  const { view, toast, modal } = state;
  const focused = document.activeElement;
  const focusSnapshot =
    focused && ["INPUT", "TEXTAREA", "SELECT"].includes(focused.tagName)
      ? {
          id: focused.id,
          dataPrice: focused.dataset.price,
          start: focused.selectionStart,
          end: focused.selectionEnd,
        }
      : null;

  let pageHTML = "";
  if (view === "home") pageHTML = renderHome();
  else if (view === "active") pageHTML = renderActive();
  else if (view === "history") pageHTML = renderHistory();
  else if (view === "trip_detail") pageHTML = renderTripDetail();
  else if (view === "prices") pageHTML = renderPrices();
  else if (view === "calendar") pageHTML = renderCalendar();
  else if (view === "settings") pageHTML = renderSettings();
  else if (view === "about") pageHTML = renderAbout();
  else if (view === "privacy") pageHTML = renderPrivacy();

  app.innerHTML = `
    ${pageHTML}
    ${renderBottomNav()}
    ${modal ? renderModal() : ""}
    ${toast ? `<div class="toast">${toast}</div>` : ""}
    <div class="designer-tag">Designed by <span>Kidddarts</span></div>
  `;

  attachEvents();
  if (
    !state.userName &&
    !state.welcomePrompted &&
    !state.modal &&
    state.view === "home"
  ) {
    state.welcomePrompted = true;
    state.modal = "welcome";
    render();
    return;
  }
  if (focusSnapshot) {
    const selector = focusSnapshot.id
      ? `#${CSS.escape(focusSnapshot.id)}`
      : focusSnapshot.dataPrice
        ? `[data-price="${CSS.escape(focusSnapshot.dataPrice)}"]`
        : null;
    const nextFocused = selector ? app.querySelector(selector) : null;
    if (nextFocused) {
      nextFocused.focus({ preventScroll: true });
      if (
        typeof focusSnapshot.start === "number" &&
        typeof nextFocused.setSelectionRange === "function"
      ) {
        nextFocused.setSelectionRange(focusSnapshot.start, focusSnapshot.end);
      }
    }
  }
  loadProductImages();
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function renderBottomNav() {
  const tabs = [
    { id: "home", icon: "home", label: "Home" },
    { id: "calendar", icon: "calendar", label: "Calendar" },
    { id: "history", icon: "history", label: "History" },
    { id: "prices", icon: "chart", label: "Prices" },
    { id: "settings", icon: "settings", label: "Settings" },
  ];
  const mainViews = ["home", "calendar", "history", "prices", "settings"];
  const active = mainViews.includes(state.view) ? state.view : null;
  return `
    <nav class="bottom-nav">
      ${tabs
        .map(
          (t) => `
        <button class="nav-btn ${active === t.id ? "active" : ""}" data-nav="${t.id}">
          <span class="nav-icon">${icons[t.icon]}</span>
          <span>${t.label}</span>
          ${active === t.id ? '<span class="nav-dot"></span>' : ""}
        </button>
      `,
        )
        .join("")}
    </nav>`;
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function renderHome() {
  const sym = state.currency.symbol;
  const recent = state.trips.slice(0, 3);
  const todayTrip = state.trips.find((t) => t.date === todayStr());
  const upcoming = state.scheduledTrips
    .filter((t) => t.date >= todayStr())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);
  const allItems = allHistoryItems().length;
  const boughtCounts = new Map();
  state.trips.forEach((trip) =>
    trip.items
      .filter((item) => item.checked)
      .forEach((item) => {
        const key = item.name.trim();
        const existing = boughtCounts.get(key) || 0;
        boughtCounts.set(key, existing + Number(item.qty || 1));
      }),
  );
  const frequentItems = [...boughtCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
  const recommendedItems = frequentItems.length
    ? frequentItems
    : SAMPLE_ITEMS.slice(0, 10).map((name) => ({ name, count: 0 }));

  return `
    <div class="fade">
      <div style="background:linear-gradient(135deg,#1B4332 0%,#2E7D32 60%,#388E3C 100%);padding:clamp(44px,6vw,60px) clamp(16px,4vw,28px) clamp(20px,3vw,32px);border-radius:0 0 28px 28px;color:#fff;position:relative">
        <button data-action="toggle_theme" style="position:absolute;top:14px;right:14px;background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.3);color:#fff;width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;transition:all 0.2s ease" title="Toggle dark mode">
          ${isDarkTheme() ? icons.sun : icons.moon}
        </button>
        <p style="font-size:12px;opacity:.7;margin-bottom:4px;letter-spacing:.5px">
          ${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <div class="brand-bar">
          <span class="brand-bar-logo">${icons.logo}</span>
          <span class="brand-bar-name">ShopTrack</span>
        </div>
        <div class="hero-copy">
          <div>
            <h1 style="font-family:'DM Serif Display',serif;font-size:clamp(26px,4vw,36px);font-weight:700;line-height:1.15">${state.userName ? `Good day, ${escapeHTML(state.userName)}!` : "Welcome!"}</h1>
            <p style="font-size:16px;opacity:.75;margin-top:10px">Plan. Shop. Track prices. 🛒</p>
          </div>
          <img class="hero-image" src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=240&q=80" alt="Fresh produce in a grocery basket" />
        </div>
        <div style="display:flex;gap:10px;margin-top:20px">
          <div style="background:rgba(255,255,255,.15);border-radius:14px;padding:12px;flex:1;text-align:center">
            <p style="font-size:10px;opacity:.7;margin-bottom:4px;letter-spacing:.5px">TRIPS</p>
            <p style="font-size:24px;font-weight:700">${state.trips.length}</p>
          </div>
          <div style="background:rgba(255,255,255,.15);border-radius:14px;padding:12px;flex:1;text-align:center">
            <p style="font-size:10px;opacity:.7;margin-bottom:4px;letter-spacing:.5px">ITEMS</p>
            <p style="font-size:24px;font-weight:700">${allItems}</p>
          </div>
          <div style="background:rgba(255,255,255,.15);border-radius:14px;padding:12px;flex:1;text-align:center">
            <p style="font-size:10px;opacity:.7;margin-bottom:4px;letter-spacing:.5px">CURRENCY</p>
            <p style="font-size:22px;font-weight:700">${sym}</p>
          </div>
        </div>
      </div>

      <div style="padding:20px 20px 0">
        <section class="frequent-section">
          <div class="section-heading">
            <div>
              <p class="section-kicker">${frequentItems.length ? "YOUR SHOPPING RHYTHM" : "POPULAR STARTERS"}</p>
              <h2>Frequently bought</h2>
            </div>
            <span class="section-badge">${recommendedItems.length} items</span>
          </div>
          <div class="frequent-grid">
            ${recommendedItems
              .map(
                (item) => `
              <div class="frequent-card">
                <img data-product-image="${escapeHTML(item.name)}" src="${productImage(item.name)}" alt="${escapeHTML(item.name)}" loading="lazy" referrerpolicy="no-referrer" />
                <p>${escapeHTML(item.name)}</p>
                <span>${item.count ? `${item.count} bought` : "Ready to shop"}</span>
              </div>
            `,
              )
              .join("")}
          </div>
        </section>

        ${(() => {
          const budgetAmount = state.activeTrip
            ? state.activeTrip.budget
            : state.defaultBudget;
          const spent = state.activeTrip
            ? state.activeTrip.items
                .filter((i) => i.checked)
                .reduce((s, i) => s + (Number(i.price) * Number(i.qty || 1) || 0), 0)
            : 0;
          if (!budgetAmount) {
            return `
          <button data-action="open_budget" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:#FFF3E0;border:1px solid #FFE0B2;border-radius:14px;padding:14px;margin-bottom:14px">
            <span style="font-size:22px">🎯</span>
            <div style="flex:1">
              <p style="font-size:13px;font-weight:700;color:#E65100">Set your market budget</p>
              <p style="font-size:11px;color:#8d6e4a;margin-top:2px">Decide how much you're willing to spend before you shop</p>
            </div>
          </button>`;
          }
          const budgetNum = Number(budgetAmount);
          const pct = budgetNum ? Math.min((spent / budgetNum) * 100, 100) : 0;
          const over = spent > budgetNum;
          const remaining = budgetNum - spent;
          return `
          <button data-action="open_budget" style="display:block;width:100%;text-align:left;background:#fff;border:1px solid #e4ede4;border-radius:14px;padding:14px;margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <span style="font-size:13px;font-weight:700;color:#1a2e1a">🎯 ${state.activeTrip ? "Trip budget" : "Next trip budget"} · ${fmtCur(budgetAmount, sym)}</span>
              ${state.activeTrip ? `<span style="font-size:12px;font-weight:700;color:${over ? "#e53935" : "#2E7D32"}">${over ? `${fmtCur(Math.abs(remaining), sym)} over` : `${fmtCur(remaining, sym)} left`}</span>` : ""}
            </div>
            ${
              state.activeTrip
                ? `<div style="background:#f0f8f0;border-radius:6px;height:6px;overflow:hidden">
              <div style="width:${pct}%;height:100%;background:${over ? "#e53935" : "linear-gradient(90deg,#2E7D32,#66BB6A)"};border-radius:6px"></div>
            </div>`
                : `<p style="font-size:11px;color:#888">Applies automatically when you start your next trip</p>`
            }
          </button>`;
        })()}

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
          <button class="btn-primary" data-action="new_trip" style="border-radius:14px;padding:14px 10px;font-size:14px">
            ${icons.plus} Start Trip
          </button>
          <button aria-label="Schedule a shopping trip" data-action="open_schedule" style="border-radius:14px;padding:14px 10px;font-size:14px;font-weight:600;background:#EFF6FF;color:#1565C0;border:1px solid #BFDBFE">
            ${icons.bell} Schedule Trip
          </button>
        </div>

        ${
          todayTrip
            ? `
          <div style="background:#FFFDE7;border:1px solid #F9A825;border-radius:14px;padding:14px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
            <span style="font-size:22px">🛍️</span>
            <div style="flex:1">
              <p style="font-size:13px;font-weight:700;color:#E65100">You shopped today!</p>
              <p style="font-size:12px;color:#795548">${todayTrip.items.length} items · ${todayTrip.items.filter((i) => i.checked).length} bought</p>
            </div>
            <button data-trip="${todayTrip.id}" data-action="view_trip" style="background:#F9A825;border:none;border-radius:10px;padding:7px 14px;font-size:12px;font-weight:700;color:#fff">View</button>
          </div>
        `
            : ""
        }

        ${
          upcoming.length
            ? `
          <div style="margin-bottom:16px">
            <p style="font-size:13px;font-weight:700;color:#1565C0;margin-bottom:8px">📅 Scheduled Trips</p>
            ${upcoming
              .map(
                (t) => `
              <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:12px">
                <div style="flex:1">
                  <p style="font-weight:600;font-size:14px;color:#1a2e1a">${fmtDate(t.date)}</p>
                  ${t.note ? `<p style="font-size:12px;color:#888">${escapeHTML(t.note)}</p>` : ""}
                  <p style="font-size:11px;color:#1565C0;margin-top:2px">⏰ Reminder at ${t.reminderTime}</p>
                </div>
                <button data-sched-id="${t.id}" data-action="start_scheduled" style="background:#1565C0;border:none;border-radius:10px;padding:7px 12px;font-size:12px;font-weight:700;color:#fff">Start</button>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }

        ${
          recent.length
            ? `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <p style="font-size:15px;font-weight:700;color:#1a2e1a">Recent Trips</p>
            <button data-nav="history" style="background:none;border:none;color:#2E7D32;font-size:13px;font-weight:500">See all →</button>
          </div>
          ${recent
            .map((trip) => {
              const total = trip.items.reduce(
                (s, i) => s + (Number(i.price) * Number(i.qty || 1) || 0),
                0,
              );
              const bought = trip.items.filter((i) => i.checked).length;
              return `
              <button data-trip="${trip.id}" data-action="view_trip" class="card" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:14px">
                <div style="width:44px;height:44px;border-radius:12px;background:#f0f8f0;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">🛒</div>
                <div style="flex:1;min-width:0">
                  <p style="font-weight:700;font-size:14px">${fmtDate(trip.date)}</p>
                  <p style="font-size:12px;color:#888;margin-top:2px">${trip.items.length} items · ${bought} bought</p>
                </div>
                <div style="text-align:right;flex-shrink:0">
                  <p style="font-size:14px;font-weight:700;color:#1B4332">${total ? fmtCur(total, sym) : "—"}</p>
                  <span class="tag" style="background:${trip.status === "completed" ? "#E8F5E9" : "#FFF3E0"};color:${trip.status === "completed" ? "#2E7D32" : "#E65100"};font-size:10px">${trip.status === "completed" ? "Done" : "Active"}</span>
                </div>
              </button>`;
            })
            .join("")}
        `
            : `
          <div style="text-align:center;padding:40px 20px;color:#bbb">
            <p style="font-size:44px;margin-bottom:10px">🛍️</p>
            <p style="font-size:15px;font-weight:600;color:#888;margin-bottom:4px">No trips yet</p>
            <p style="font-size:13px">Start your first shopping trip!</p>
          </div>
        `
        }
        <div class="ad-slot" aria-label="Advertising placement">Ad placement reserved</div>
      </div>
    </div>`;
}

// ─── Active Trip ──────────────────────────────────────────────────────────────
function renderActive() {
  if (!state.activeTrip) return "";
  const trip = state.activeTrip;
  const sym = state.currency.symbol;
  const boughtCount = trip.items.filter((i) => i.checked).length;
  const total = trip.items
    .filter((i) => i.checked)
    .reduce((s, i) => s + (Number(i.price) * Number(i.qty || 1) || 0), 0);
  const progress = trip.items.length
    ? (boughtCount / trip.items.length) * 100
    : 0;
  const filter = state.tripFilter;

  const filtered = trip.items.filter((i) => {
    if (filter === "pending") return !i.checked;
    if (filter === "bought") return i.checked;
    return true;
  });

  return `
    <div class="fade">
      <div class="trip-header">
        <div class="trip-header-top">
          <button class="btn-ghost" data-action="back_home">${icons.back}</button>
          <div class="trip-header-info">
            <p class="trip-date">${fmtDate(trip.date)}</p>
            <p class="trip-meta">${boughtCount}/${trip.items.length} items · ${fmtCur(total, sym)}</p>
          </div>
          <button class="btn-done" data-action="finish_trip">Done ${icons.check}</button>
        </div>
        <div class="trip-toolbar">
          <button class="chip chip-budget" data-action="open_budget">🎯 ${trip.budget ? fmtCur(trip.budget, sym) : "Set Budget"}</button>
          <button class="chip chip-share" data-action="share_list">${icons.share} Share list</button>
          <button class="chip chip-ai" data-action="open_ai">${icons.spark} AI Suggest</button>
        </div>
        <div class="trip-progress">
          <div class="trip-progress-bar" style="width:${progress}%"></div>
        </div>
      </div>

      <div class="active-content" style="padding:clamp(12px,2vw,20px) clamp(14px,3vw,24px) calc(150px + env(safe-area-inset-bottom))">
        <!-- Add Item -->
        <div style="position:relative;margin-bottom:12px">
          <div style="display:flex;gap:8px;background:#fff;border:2px solid #e4ede4;border-radius:14px;padding:4px 4px 4px 14px;align-items:center">
            <input id="item-input" type="text" placeholder="Add item (e.g. Rice...)"
              autocomplete="off" autocorrect="off" spellcheck="false"
              style="flex:1;border:none;outline:none;font-size:16px!important;background:transparent;color:#1a2e1a" />
            <button id="add-item-btn" style="background:#1B4332;border:none;border-radius:10px;width:42px;height:42px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              ${icons.plus.replace("currentColor", "#fff")}
            </button>
          </div>
          <div id="suggestions" style="display:none;position:absolute;top:100%;left:0;right:0;z-index:50;background:#fff;border:1px solid #e4ede4;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.1);margin-top:4px;overflow:hidden"></div>
        </div>

        ${
          trip.budget
            ? (() => {
                const budgetNum = Number(trip.budget);
                const pct = budgetNum ? Math.min((total / budgetNum) * 100, 100) : 0;
                const over = total > budgetNum;
                const remaining = budgetNum - total;
                return `
          <button data-action="open_budget" style="display:block;width:100%;text-align:left;background:#fff;border:1px solid #e4ede4;border-radius:14px;padding:12px 14px;margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <span style="font-size:12px;font-weight:700;color:#555;letter-spacing:.3px">🎯 BUDGET · ${fmtCur(trip.budget, sym)}</span>
              <span style="font-size:12px;font-weight:700;color:${over ? "#e53935" : "#2E7D32"}">${over ? `${fmtCur(Math.abs(remaining), sym)} over` : `${fmtCur(remaining, sym)} left`}</span>
            </div>
            <div style="background:#f0f8f0;border-radius:6px;height:6px;overflow:hidden">
              <div style="width:${pct}%;height:100%;background:${over ? "#e53935" : "linear-gradient(90deg,#2E7D32,#66BB6A)"};border-radius:6px;transition:width .4s ease"></div>
            </div>
          </button>`;
              })()
            : ""
        }

        <!-- Filters -->
        ${
          trip.items.length > 0
            ? `
          <div style="display:flex;gap:8px;margin-bottom:12px;overflow-x:auto;padding-bottom:4px">
            <button class="pill ${filter === "all" ? "active" : ""}" data-filter="all">All (${trip.items.length})</button>
            <button class="pill ${filter === "pending" ? "active" : ""}" data-filter="pending">Pending (${trip.items.filter((i) => !i.checked).length})</button>
            <button class="pill ${filter === "bought" ? "active" : ""}" data-filter="bought">Bought (${boughtCount})</button>
            <button class="pill" data-action="mark_all_done">Mark all done</button>
          </div>
        `
            : ""
        }

        <!-- Items -->
        <div id="items-list">
          ${filtered.map((item) => renderItemRow(item, sym)).join("")}
        </div>

        ${
          trip.items.length === 0
            ? `
          <div style="text-align:center;padding:40px 20px;color:#bbb">
            <p style="font-size:40px;margin-bottom:8px">📝</p>
            <p style="font-size:14px;color:#aaa">Add items to your list above</p>
          </div>
        `
            : ""
        }

        ${
          boughtCount > 0
            ? `
          <div style="background:linear-gradient(135deg,#1B4332,#2E7D32);border-radius:16px;padding:16px;margin-top:12px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <p style="color:rgba(255,255,255,.7);font-size:11px;letter-spacing:.5px">TOTAL SPENT</p>
              <p style="color:#fff;font-size:24px;font-weight:700">${fmtCur(total, sym)}</p>
            </div>
            <div style="text-align:right">
              <p style="color:rgba(255,255,255,.7);font-size:11px;letter-spacing:.5px">BOUGHT</p>
              <p style="color:#fff;font-size:24px;font-weight:700">${boughtCount}</p>
            </div>
          </div>
        `
            : ""
        }
      </div>
    </div>`;
}

function renderItemRow(item, sym) {
  return `
    <div class="item-row ${item.checked ? "checked" : ""}" data-item-id="${item.id}">
      <div class="item-main">
        <input type="checkbox" ${item.checked ? "checked" : ""} data-check="${item.id}" />
        <img class="product-thumb" data-product-image="${escapeHTML(item.name)}" src="${productImage(item.name)}" alt="" loading="lazy" referrerpolicy="no-referrer" />
        <span class="item-name ${item.checked ? "done" : ""}">${escapeHTML(item.name)}</span>
        <div class="price-pill">
          <span>${sym}</span>
          <input type="number" inputmode="decimal" placeholder="0" value="${item.price || ""}"
            data-price="${item.id}"
            style="width:60px;border:none;background:transparent;outline:none;font-size:15px!important;font-weight:700;color:#1B4332;text-align:right" />
        </div>
        <select class="unit-select" data-unit="${item.id}" aria-label="Measurement unit for ${escapeHTML(item.name)}">
          ${MEASUREMENT_UNITS.map((unit) => `<option value="${unit.value}" ${item.unit === unit.value ? "selected" : ""}>${unit.label}</option>`).join("")}
        </select>
        <div class="qty-pill">
          <button class="qty-btn" data-qty-dec="${item.id}">−</button>
          <span class="qty-num">${item.qty || 1}</span>
          <button class="qty-btn" data-qty-inc="${item.id}">+</button>
        </div>
        <button class="del-btn" data-del="${item.id}">${icons.trash.replace("currentColor", "#e53935")}</button>
      </div>
      ${item.unit ? `<p style="font-size:11px;color:#aaa;padding:0 12px 8px">${escapeHTML(item.unit)}</p>` : ""}
    </div>`;
}

// ─── History ──────────────────────────────────────────────────────────────────
function renderHistory() {
  const sym = state.currency.symbol;
  const q = state.histSearch.toLowerCase();
  const filtered = state.trips.filter(
    (t) =>
      !q ||
      fmtDate(t.date).toLowerCase().includes(q) ||
      t.items.some((i) => i.name.toLowerCase().includes(q)),
  );

  return `
    <div class="fade">
      <div class="page-header">
        <p class="page-title">Trip History</p>
        <p class="page-sub">${state.trips.length} shopping trips saved</p>
        <input type="text" placeholder="Search trips or items..." value="${escapeHTML(state.histSearch)}"
          id="hist-search"
          style="width:100%;margin-top:12px;padding:10px 14px;border:1px solid #e4ede4;border-radius:12px;font-size:16px!important;outline:none;background:#f7faf7" />
      </div>
      <div class="content">
        ${
          filtered.length === 0
            ? `
          <div style="text-align:center;padding:40px 20px;color:#bbb">
            <p style="font-size:40px;margin-bottom:8px">🗓️</p>
            <p style="font-size:15px;font-weight:600;color:#6d7e70">${q ? "No trips match your search" : "Your shopping story starts here"}</p>
            ${!q ? '<p style="font-size:13px;color:#aaa;margin:8px 0 16px">Save your first trip to see spending and price history.</p><button class="btn-primary" data-action="new_trip" style="max-width:220px;margin:auto">Start trip</button>' : ""}
            <div class="ad-slot" aria-label="Advertising placement">Ad placement reserved</div>
          </div>
        `
            : filtered
                .map((trip) => {
                  const total = trip.items.reduce(
                    (s, i) => s + (Number(i.price) * Number(i.qty || 1) || 0),
                    0,
                  );
                  const bought = trip.items.filter((i) => i.checked).length;
                  return `
              <button data-trip="${trip.id}" data-action="view_trip" class="card" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:14px;border-radius:16px">
                <div style="width:48px;height:48px;border-radius:14px;background:#f0f8f0;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">🛒</div>
                <div style="flex:1;min-width:0">
                  <p style="font-weight:700;font-size:15px">${fmtDate(trip.date)}</p>
                  <p style="font-size:12px;color:#888;margin-top:2px">${trip.items.length} items · ${bought} bought</p>
                  <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">
                    ${trip.items
                      .slice(0, 4)
                      .map(
                        (i) =>
                          `<span style="background:#f0f8f0;border-radius:6px;padding:2px 8px;font-size:10px;color:#2E7D32">${escapeHTML(i.name)}</span>`,
                      )
                      .join("")}
                    ${trip.items.length > 4 ? `<span style="background:#f0f8f0;border-radius:6px;padding:2px 8px;font-size:10px;color:#888">+${trip.items.length - 4}</span>` : ""}
                  </div>
                </div>
                <div style="text-align:right;flex-shrink:0">
                  <p style="font-size:14px;font-weight:700;color:#1B4332">${total ? fmtCur(total, sym) : "—"}</p>
                  <span class="tag" style="background:${trip.status === "completed" ? "#E8F5E9" : "#FFF3E0"};color:${trip.status === "completed" ? "#2E7D32" : "#E65100"};font-size:10px;margin-top:4px">${trip.status === "completed" ? "Done" : "Active"}</span>
                </div>
              </button>`;
                })
                .join("")
        }
      </div>
    </div>`;
}

// ─── Trip Detail ──────────────────────────────────────────────────────────────
function renderTripDetail() {
  const trip = state.selectedTrip;
  if (!trip) return "";
  const sym = state.currency.symbol;
  const total = trip.items.reduce(
    (s, i) => s + (Number(i.price) * Number(i.qty || 1) || 0),
    0,
  );
  const bought = trip.items.filter((i) => i.checked);

  return `
    <div class="slide">
      <div class="page-header">
        <button class="btn-ghost" data-nav="history">${icons.back} History</button>
        <p class="page-title" style="margin-top:10px">${fmtDate(trip.date)}</p>
        <div style="display:flex;gap:8px;margin-top:6px">
          <span class="tag" style="background:${trip.status === "completed" ? "#E8F5E9" : "#FFF3E0"};color:${trip.status === "completed" ? "#2E7D32" : "#E65100"}">${trip.status === "completed" ? "✓ Completed" : "In Progress"}</span>
          <span class="tag" style="background:#EFF6FF;color:#1565C0">${trip.items.length} items</span>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button data-action="edit_trip" data-trip-id="${trip.id}" style="padding:8px 12px;border:1px solid #DFEBDF;border-radius:10px;background:#E8F5E9;color:#1B4332;font-weight:700">Edit trip</button>
          <button data-action="delete_trip" data-trip-id="${trip.id}" style="padding:8px 12px;border:1px solid #ffd0d0;border-radius:10px;background:#fff0f0;color:#c62828;font-weight:700">Delete trip</button>
        </div>
      </div>
      <div class="content">
        ${
          total > 0
            ? `
          <div style="background:linear-gradient(135deg,#1B4332,#2E7D32);border-radius:16px;padding:18px;color:#fff;margin-bottom:16px;display:flex;justify-content:space-between">
            <div><p style="opacity:.7;font-size:11px;letter-spacing:.5px">TOTAL SPENT</p><p style="font-size:26px;font-weight:700">${fmtCur(total, sym)}</p></div>
            <div style="text-align:right"><p style="opacity:.7;font-size:11px;letter-spacing:.5px">ITEMS BOUGHT</p><p style="font-size:26px;font-weight:700">${bought.length}</p></div>
          </div>
        `
            : ""
        }
        ${trip.items
          .map(
            (item) => `
          <div style="background:#fff;border:1px solid ${item.checked ? "#a5d6a7" : "#eee"};border-radius:14px;padding:13px 14px;margin-bottom:8px;display:flex;align-items:center;gap:12px;opacity:${item.checked ? 1 : 0.65}">
            <div style="width:28px;height:28px;border-radius:8px;background:${item.checked ? "#2E7D32" : "#eee"};display:flex;align-items:center;justify-content:center;flex-shrink:0">
              ${item.checked ? icons.check.replace("currentColor", "#fff") : ""}
            </div>
            <div style="flex:1;min-width:0">
              <p style="font-weight:600;font-size:14px;text-decoration:${item.checked ? "none" : "line-through"}">${escapeHTML(item.name)}</p>
              ${item.unit ? `<p style="font-size:11px;color:#888">${escapeHTML(item.unit)}</p>` : ""}
            </div>
            <div style="text-align:right">
              ${item.price ? `<p style="font-size:14px;font-weight:700;color:#1B4332">${fmtCur(Number(item.price) * Number(item.qty || 1), sym)}</p>` : ""}
              ${item.qty && item.qty !== 1 && item.qty !== "1" ? `<p style="font-size:11px;color:#888">${sym}${item.price} × ${item.qty}</p>` : ""}
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>`;
}

// ─── Price Analysis ───────────────────────────────────────────────────────────
function renderPrices() {
  const sym = state.currency.symbol;
  const allItems = allHistoryItems().filter(
    (n) => getPriceHistory(n).length >= 1,
  );
  const q = state.priceFilter.toLowerCase();
  const filtered = allItems.filter((n) => n.toLowerCase().includes(q));
  const selected = state.selectedItem;

  if (selected) {
    const hist = getPriceHistory(selected);
    const prices = hist.map((h) => h.price);
    const minP = Math.min(...prices),
      maxP = Math.max(...prices);
    const latest = prices[prices.length - 1],
      prev = prices[prices.length - 2];
    const trend = prev
      ? latest > prev
        ? "up"
        : latest < prev
          ? "down"
          : "stable"
      : "stable";
    const tColor =
      trend === "up" ? "#e53935" : trend === "down" ? "#2E7D32" : "#888";

    const chartSVG = prices.length > 1 ? renderMiniChart(prices) : "";

    return `
      <div class="slide">
        <div class="page-header">
          <button class="btn-ghost" data-action="clear_price_item">${icons.back} All Items</button>
          <p class="page-title" style="margin-top:10px">${escapeHTML(selected)}</p>
          <p style="font-size:13px;color:${tColor};font-weight:600;margin-top:4px">${trend === "up" ? "↑ Rising" : trend === "down" ? "↓ Falling" : "→ Stable"}</p>
        </div>
        <div class="content">
          <div class="card" style="border-radius:18px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
              <div>
                <p style="font-size:13px;color:#888">${hist.length} records</p>
                <p style="font-size:11px;color:#aaa;margin-top:2px">Latest price</p>
              </div>
              <p style="font-size:26px;font-weight:700;color:${tColor}">${sym}${latest.toLocaleString()}</p>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
              ${[
                ["LOWEST", minP],
                ["LATEST", latest],
                ["HIGHEST", maxP],
              ]
                .map(
                  ([l, v]) => `
                <div style="background:#f7faf7;border-radius:10px;padding:10px 6px;text-align:center">
                  <p style="font-size:9px;color:#888;font-weight:700;letter-spacing:.5px">${l}</p>
                  <p style="font-size:14px;font-weight:700;color:#1a2e1a;margin-top:2px">${sym}${v.toLocaleString()}</p>
                </div>`,
                )
                .join("")}
            </div>
            ${chartSVG}
          </div>

          <p style="font-size:14px;font-weight:700;color:#444;margin-bottom:10px">Price Timeline</p>
          ${[...hist]
            .reverse()
            .map((entry, idx, arr) => {
              const prevEntry = arr[idx + 1];
              const change = prevEntry ? entry.price - prevEntry.price : null;
              return `
              <div class="card" style="display:flex;justify-content:space-between;align-items:center">
                <p style="font-size:13px;font-weight:500">${fmtDate(entry.date)}</p>
                <div style="display:flex;align-items:center;gap:10px">
                  ${change !== null ? `<span style="font-size:12px;font-weight:700;color:${change > 0 ? "#e53935" : change < 0 ? "#2E7D32" : "#888"}">${change > 0 ? "+" : ""}${sym}${Math.abs(change).toLocaleString()}</span>` : ""}
                  <span style="font-size:15px;font-weight:700;color:#1B4332">${sym}${entry.price.toLocaleString()}</span>
                </div>
              </div>`;
            })
            .join("")}
        </div>
      </div>`;
  }

  return `
    <div class="fade">
      <div class="page-header">
        <p class="page-title">Price Analysis</p>
        <p class="page-sub">Track price trends for your items</p>
        <input type="text" placeholder="Search items..." value="${escapeHTML(state.priceFilter)}" id="price-search"
          style="width:100%;margin-top:12px;padding:10px 14px;border:1px solid #e4ede4;border-radius:12px;font-size:16px!important;outline:none;background:#f7faf7" />
      </div>
      <div class="content">
        ${
          filtered.length === 0
            ? `
          <div style="text-align:center;padding:40px 20px;color:#bbb">
            <p style="font-size:40px;margin-bottom:8px">📊</p>
            <p style="font-size:14px;color:#aaa">${allItems.length === 0 ? "Complete some shopping trips with prices to see analysis" : "No items match"}</p>
          </div>
        `
            : filtered
                .map((name) => {
                  const hist = getPriceHistory(name);
                  const ps = hist.map((h) => h.price);
                  const last = ps[ps.length - 1],
                    sl = ps[ps.length - 2];
                  const t = sl
                    ? last > sl
                      ? "↑"
                      : last < sl
                        ? "↓"
                        : "→"
                    : "—";
                  const tc = sl
                    ? last > sl
                      ? "#e53935"
                      : last < sl
                        ? "#2E7D32"
                        : "#888"
                    : "#888";
                  return `
              <button data-price-item="${escapeHTML(name)}" class="card" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:14px;border-radius:14px">
                <div style="width:40px;height:40px;border-radius:12px;background:#f0f8f0;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🏷️</div>
                <div style="flex:1;min-width:0">
                  <p style="font-weight:700;font-size:14px">${escapeHTML(name)}</p>
                  <p style="font-size:12px;color:#888">${hist.length} price records</p>
                </div>
                <div style="text-align:right">
                  <p style="font-size:15px;font-weight:700;color:#1B4332">${sym}${last.toLocaleString()}</p>
                  <p style="font-size:14px;color:${tc};font-weight:700">${t}</p>
                </div>
              </button>`;
                })
                .join("")
        }
      </div>
    </div>`;
}

function renderMiniChart(prices) {
  const w = 280,
    h = 90,
    pad = 14;
  const min = Math.min(...prices) * 0.93;
  const max = Math.max(...prices) * 1.07;
  const range = max - min || 1;
  const pts = prices.map((p, i) => ({
    x: pad + (i / (prices.length - 1 || 1)) * (w - pad * 2),
    y: h - pad - ((p - min) / range) * (h - pad * 2),
  }));
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${d} L${pts[pts.length - 1].x},${h} L${pts[0].x},${h} Z`;
  return `
    <svg width="100%" viewBox="0 0 ${w} ${h}" style="overflow:visible;margin-top:4px">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2E7D32" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#2E7D32" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${area}" fill="url(#g1)"/>
      <path d="${d}" fill="none" stroke="#2E7D32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${pts.map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="#fff" stroke="#2E7D32" stroke-width="2"/>`).join("")}
    </svg>`;
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
function renderCalendar() {
  const { calMonth, calYear } = state;
  const tripDates = new Set(state.trips.map((t) => t.date));
  const schedDates = new Set(state.scheduledTrips.map((t) => t.date));
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthName = new Date(calYear, calMonth).toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });
  const todayD = todayStr();

  let cells = "";
  for (let i = 0; i < firstDay; i++) cells += "<div></div>";
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isToday = ds === todayD;
    const hasTrip = tripDates.has(ds);
    const isSched = schedDates.has(ds);
    cells += `
      <button class="cal-day ${isToday ? "today" : hasTrip ? "has-trip" : isSched ? "scheduled" : ""}" data-calday="${ds}">
        ${d}
        ${(hasTrip || isSched) && !isToday ? '<div class="cal-dot"></div>' : ""}
      </button>`;
  }

  const upcoming = state.scheduledTrips
    .filter((t) => t.date >= todayD)
    .sort((a, b) => a.date.localeCompare(b.date));

  return `
    <div class="fade">
      <div class="page-header">
        <p class="page-title">Shopping Calendar</p>
        <p class="page-sub">Tap a date to start or view a trip</p>
      </div>
      <div class="content">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <button data-cal="prev" style="background:#f0f8f0;border:none;border-radius:10px;padding:8px 16px;font-size:18px;font-weight:700;color:#1B4332">‹</button>
          <p style="font-size:16px;font-weight:700;color:#1a2e1a">${monthName}</p>
          <button data-cal="next" style="background:#f0f8f0;border:none;border-radius:10px;padding:8px 16px;font-size:18px;font-weight:700;color:#1B4332">›</button>
        </div>
        <div class="cal-grid" style="margin-bottom:6px">
          ${["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => `<div style="text-align:center;font-size:11px;color:#aaa;font-weight:700;padding:4px 0">${d}</div>`).join("")}
        </div>
        <div class="cal-grid" style="margin-bottom:16px">${cells}</div>

        <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:6px"><div style="width:14px;height:14px;border-radius:4px;background:#1B4332"></div><span style="font-size:11px;color:#888">Today</span></div>
          <div style="display:flex;align-items:center;gap:6px"><div style="width:14px;height:14px;border-radius:4px;background:#f0f8f0;border:1.5px solid #a5d6a7"></div><span style="font-size:11px;color:#888">Shopped</span></div>
          <div style="display:flex;align-items:center;gap:6px"><div style="width:14px;height:14px;border-radius:4px;background:#FFF8E1;border:1.5px solid #FFD54F"></div><span style="font-size:11px;color:#888">Scheduled</span></div>
        </div>

        ${
          upcoming.length
            ? `
          <p style="font-size:14px;font-weight:700;color:#444;margin-bottom:10px">Upcoming Scheduled Trips</p>
          ${upcoming
            .map(
              (t) => `
            <div class="card" style="display:flex;align-items:center;gap:12px">
              <span style="font-size:22px">📅</span>
              <div style="flex:1">
                <p style="font-weight:700;font-size:14px">${fmtDate(t.date)}</p>
                <p style="font-size:11px;color:#1565C0">⏰ ${escapeHTML(t.reminderTime)}${t.note ? ` · ${escapeHTML(t.note)}` : ""}</p>
              </div>
              <div style="display:flex;gap:6px">
                <button data-sched-id="${t.id}" data-action="start_scheduled" style="background:#1B4332;border:none;border-radius:10px;padding:7px 12px;font-size:12px;font-weight:700;color:#fff">Start trip</button>
                <button data-sched-id="${t.id}" data-action="edit_scheduled" aria-label="Edit scheduled trip" style="background:#E8F5E9;border:1px solid #c8e6c9;border-radius:10px;padding:7px 9px;font-size:12px;color:#1B4332">Edit</button>
                <button data-sched-id="${t.id}" data-action="delete_scheduled" aria-label="Delete scheduled trip" style="background:#fff0f0;border:1px solid #ffd0d0;border-radius:10px;padding:7px 9px;font-size:12px;color:#c62828">Delete</button>
              </div>
            </div>`,
            )
            .join("")}
        `
            : ""
        }
      </div>
    </div>`;
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function renderSettings() {
  return `
    <div class="fade">
      <div class="page-header">
        <p class="page-title">Settings</p>
      </div>
      <div class="content">
        <div class="card" style="border-radius:18px;margin-bottom:16px">
          <p style="font-size:13px;font-weight:700;color:#444;margin-bottom:12px">Currency</p>
          ${CURRENCIES.map(
            (c) => `
            <button data-set-currency="${c.code}" style="display:flex;align-items:center;gap:12px;padding:12px;background:${state.currency.code === c.code ? "#f0f8f0" : "transparent"};border:${state.currency.code === c.code ? "1.5px solid #a5d6a7" : "1.5px solid transparent"};border-radius:12px;width:100%;text-align:left;margin-bottom:6px">
              <span style="font-size:20px;font-weight:700;color:#1B4332;width:32px">${c.symbol}</span>
              <div style="flex:1">
                <p style="font-weight:600;font-size:14px">${c.name}</p>
                <p style="font-size:11px;color:#888">${c.code}</p>
              </div>
              ${state.currency.code === c.code ? `<span style="color:#2E7D32">${icons.check.replace("currentColor", "#2E7D32")}</span>` : ""}
            </button>
          `,
          ).join("")}
        </div>

        <div class="card" style="border-radius:18px;margin-bottom:16px">
          <p style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:4px">Appearance</p>
          <p style="font-size:12px;color:var(--text-secondary);margin-bottom:10px">Choose how ShopTrack looks on this device.</p>
          <div class="theme-options" role="group" aria-label="Theme preference">
            ${[
              ["light", icons.sun, "Light"],
              ["dark", icons.moon, "Dark"],
              ["system", icons.system, "System"],
            ]
              .map(
                ([value, icon, label]) => `
              <button class="theme-option ${state.themePreference === value ? "active" : ""}" data-action="set_theme" data-theme-choice="${value}" aria-pressed="${state.themePreference === value}">
                ${icon}<span>${label}</span>
              </button>
            `,
              )
              .join("")}
          </div>
        </div>

        <div class="card" style="border-radius:18px;margin-bottom:16px">
          <p style="font-size:13px;font-weight:700;color:#444;margin-bottom:8px">Notifications</p>
          <button data-action="req_notif" style="background:#1B4332;color:#fff;border:none;border-radius:12px;padding:12px;width:100%;font-size:14px;font-weight:600">
            ${icons.bell.replace("currentColor", "#fff")} Enable Reminders
          </button>
          <p style="font-size:11px;color:#aaa;margin-top:8px;text-align:center">Required for trip reminders to work</p>
        </div>

        <input id="import-file" type="file" accept="application/json" hidden />

        <div class="card" style="border-radius:18px;margin-bottom:16px">
          <p style="font-size:13px;font-weight:700;color:#444;margin-bottom:6px">Install App</p>
          <p style="font-size:13px;color:#888;line-height:1.6">To install ShopTrack on your phone: tap the Share button in your browser → "Add to Home Screen"</p>
        </div>

        <div class="card" style="border-radius:18px">
          <p style="font-size:13px;font-weight:700;color:#444;margin-bottom:8px">Learn more</p>
          <div style="display:grid;gap:8px;margin-bottom:14px">
            <button data-nav="about" style="padding:11px;text-align:left;border:1px solid #DFEBDF;border-radius:10px;background:var(--accent-soft);color:var(--primary);font-weight:700">About ShopTrack</button>
            <button data-nav="privacy" style="padding:11px;text-align:left;border:1px solid #DFEBDF;border-radius:10px;background:var(--accent-soft);color:var(--primary);font-weight:700">Privacy policy</button>
          </div>
          <p style="font-size:13px;font-weight:700;color:#444;margin-bottom:6px">About ShopTrack</p>
          <p style="font-size:13px;color:#888;line-height:1.7">Plan your market visits, track what you buy, monitor price trends, and use AI to suggest restocks — all offline-ready.</p>
          <p style="font-size:11px;color:#ccc;margin-top:10px">Version 2.0 PWA · Data stored locally on your device</p>
        </div>
      </div>
    </div>`;
}

function renderAbout() {
  return `<div class="fade"><div class="page-header"><button class="btn-ghost" data-nav="settings">${icons.back} Settings</button><p class="page-title" style="margin-top:10px">About ShopTrack</p></div><div class="content"><div class="card"><h2>Plan with confidence</h2><p style="line-height:1.7;color:var(--text-secondary);margin-top:8px">ShopTrack keeps your grocery lists, quantities, prices and trip history together so every market visit feels simpler and more intentional.</p></div><div class="card"><h3>Built for real shopping</h3><p style="line-height:1.7;color:var(--text-secondary);margin-top:8px">It works offline, supports local measurements, and protects your data by keeping it on your device unless you choose to share or export it.</p></div></div></div>`;
}

function renderPrivacy() {
  return `<div class="fade"><div class="page-header"><button class="btn-ghost" data-nav="settings">${icons.back} Settings</button><p class="page-title" style="margin-top:10px">Privacy policy</p></div><div class="content"><div class="card"><h2>Your data stays yours</h2><p style="line-height:1.7;color:var(--text-secondary);margin-top:8px">ShopTrack stores trips, preferences and cached images in your browser's local storage. Nothing is sent to a server unless you enable an optional AI endpoint or use an online image service.</p></div><div class="card"><h3>Sharing and exports</h3><p style="line-height:1.7;color:var(--text-secondary);margin-top:8px">Sharing, exports, notifications and image lookups are user-initiated. You can clear local data through your browser settings at any time.</p></div></div></div>`;
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function renderModal() {
  const { modal } = state;

  if (modal === "welcome") {
    const step = state.onboardingStep;

    if (step === 0) {
      // Tutorial - App Install Instructions
      return `
        <div class="modal-overlay" id="modal-overlay">
          <div class="modal-sheet welcome-sheet">
            <div class="modal-handle"></div>
            <div class="welcome-icon" style="font-size:40px">📱</div>
            <p class="welcome-title">Install ShopTrack</p>
            <p style="font-size:14px;color:#6d7e70;line-height:1.6;margin-bottom:20px">Save this app to your home screen for quick access and offline support.</p>
            <div style="background:#f0f8f0;border:1px solid #c8e6c9;border-radius:14px;padding:16px;margin-bottom:20px;text-align:left">
              <p style="font-size:13px;font-weight:700;color:#1B4332;margin-bottom:10px">📲 How to install:</p>
              <ol style="font-size:12px;color:#555;line-height:1.8;padding-left:18px;margin:0">
                <li>Tap the <strong>Share</strong> button (⬆️ or ⋯)</li>
                <li>Select <strong>"Add to Home Screen"</strong></li>
                <li>Tap <strong>Add</strong></li>
              </ol>
            </div>
            <button data-action="onboarding_next" class="btn-primary">Continue</button>
          </div>
        </div>`;
    }

    if (step === 1) {
      // Name Entry
      return `
        <div class="modal-overlay" id="modal-overlay">
          <div class="modal-sheet welcome-sheet">
            <div class="modal-handle"></div>
            <div class="welcome-icon">${icons.logo}</div>
            <p class="welcome-title">Welcome to ShopTrack</p>
            <p style="font-size:14px;color:#6d7e70;line-height:1.6;margin-bottom:20px">First, tell us what to call you.</p>
            <label for="user-name" style="font-size:12px;font-weight:700;color:#55705b;display:block;margin-bottom:6px;text-align:left">YOUR NAME</label>
            <input id="user-name" type="text" maxlength="40" autocomplete="name" placeholder="Enter your name"
              style="width:100%;padding:14px;border:1.5px solid #c8e6c9;border-radius:12px;font-size:16px!important;outline:none;margin-bottom:14px" />
            <button data-action="onboarding_next" class="btn-primary">Continue</button>
          </div>
        </div>`;
    }

    if (step === 2) {
      // Country Selection
      return `
        <div class="modal-overlay" id="modal-overlay">
          <div class="modal-sheet welcome-sheet">
            <div class="modal-handle"></div>
            <div class="welcome-icon" style="font-size:40px">🌍</div>
            <p class="welcome-title">Where do you shop?</p>
            <p style="font-size:14px;color:#6d7e70;line-height:1.6;margin-bottom:16px">Select your country to personalize your experience.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-height:280px;overflow-y:auto;margin-bottom:14px">
              ${COUNTRIES.map(
                (country) => `
                <button data-action="save_country" data-country-code="${country.code}" style="padding:12px;border:1.5px solid ${state.userCountry?.code === country.code ? "#2E7D32" : "#c8e6c9"};border-radius:12px;background:${state.userCountry?.code === country.code ? "#E8F5E9" : "#fff"};color:#1B4332;font-size:13px;font-weight:600;text-align:center;cursor:pointer;transition:all 0.2s">
                  ${country.flag} ${country.name}
                </button>
              `,
              ).join("")}
            </div>
            <button data-action="save_onboarding" class="btn-primary">Start planning</button>
          </div>
        </div>`;
    }
  }

  if (modal === "schedule") {
    const minDate = todayStr();
    const editing = state.editingScheduled;
    return `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-sheet">
          <div class="modal-handle"></div>
          <p class="modal-title" style="font-size:22px;margin-bottom:6px">${editing ? "Edit scheduled trip" : "Schedule a Trip"}</p>
          <p style="font-size:13px;color:#888;margin-bottom:20px">Plan ahead & get a reminder</p>

          <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:6px">SHOPPING DATE</label>
          <input type="date" id="sched-date" min="${minDate}" value="${editing?.date || minDate}"
            style="width:100%;padding:13px;border:1.5px solid #e4ede4;border-radius:12px;font-size:16px!important;margin-bottom:14px;outline:none" />

          <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:6px">REMINDER TIME</label>
          <input type="time" id="sched-time" value="${editing?.reminderTime || "07:00"}"
            style="width:100%;padding:13px;border:1.5px solid #e4ede4;border-radius:12px;font-size:16px!important;margin-bottom:14px;outline:none" />

          <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:6px">NOTE (optional)</label>
          <input type="text" id="sched-note" value="${escapeHTML(editing?.note || "")}" placeholder="e.g. Go to Mile 12 market"
            style="width:100%;padding:13px;border:1.5px solid #e4ede4;border-radius:12px;font-size:16px!important;margin-bottom:20px;outline:none" />

          <button data-action="save_schedule" class="btn-primary" style="margin-bottom:10px">${editing ? "Save changes" : "Schedule & Set Reminder 🔔"}</button>
          <button data-action="close_modal" style="width:100%;padding:12px;background:none;border:none;font-size:14px;color:#888">Cancel</button>
        </div>
      </div>`;
  }

  if (modal === "ai") {
    return `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-sheet">
          <div class="modal-handle"></div>
          <p class="modal-title" style="font-size:22px;margin-bottom:4px">✨ AI Suggestions</p>
          <p style="font-size:13px;color:#888;margin-bottom:16px">Based on your shopping history</p>
          ${
            state.aiLoading
              ? `
            <div style="text-align:center;padding:30px">
              <p style="font-size:28px;margin-bottom:10px">🤖</p>
              <p style="font-size:14px;color:#888">Analyzing your history...</p>
            </div>
          `
              : `
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px">
              ${state.aiSuggestions
                .map(
                  (s) => `
                <button data-ai-add="${escapeHTML(s)}" style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:20px;padding:8px 14px;font-size:13px;color:#1565C0;font-weight:600">
                  + ${escapeHTML(s)}
                </button>
              `,
                )
                .join("")}
            </div>
          `
          }
          <button data-action="close_modal" style="width:100%;padding:12px;background:#f0f8f0;border:none;border-radius:12px;font-size:14px;color:#1B4332;font-weight:600">Done</button>
        </div>
      </div>`;
  }

  if (modal === "budget") {
    const current = state.activeTrip
      ? state.activeTrip.budget
      : state.defaultBudget;
    return `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-sheet">
          <div class="modal-handle"></div>
          <p class="modal-title" style="font-size:22px;margin-bottom:6px">🎯 Market Budget</p>
          <p style="font-size:13px;color:#888;margin-bottom:20px">${state.activeTrip ? "How much do you want to spend on this trip?" : "Set a target for your next market trip."}</p>

          <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:6px">BUDGET AMOUNT</label>
          <div style="display:flex;align-items:center;gap:8px;border:1.5px solid #e4ede4;border-radius:12px;padding:0 13px;margin-bottom:20px">
            <span style="font-size:16px;font-weight:700;color:#1B4332">${state.currency.symbol}</span>
            <input id="budget-input" type="number" inputmode="decimal" min="0" step="1" placeholder="e.g. 20000" value="${current || ""}"
              style="flex:1;border:none;outline:none;padding:13px 0;font-size:16px!important;background:transparent" />
          </div>

          <button data-action="save_budget" class="btn-primary" style="margin-bottom:10px">Save Budget</button>
          ${current ? '<button data-action="clear_budget" style="width:100%;padding:10px;background:none;border:none;font-size:13px;color:#e53935;margin-bottom:6px">Remove budget</button>' : ""}
          <button data-action="close_modal" style="width:100%;padding:12px;background:none;border:none;font-size:14px;color:#888">Cancel</button>
        </div>
      </div>`;
  }

  if (modal === "import_list") {
    const shared = state.incomingSharedList;
    if (!shared) return "";
    const itemCount = shared.items.length;
    return `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-sheet">
          <div class="modal-handle"></div>
          <div class="welcome-icon" style="font-size:40px">📩</div>
          <p class="modal-title" style="font-size:22px;margin-bottom:6px;text-align:center">Shared Shopping List</p>
          <p style="font-size:13px;color:#888;margin-bottom:16px;text-align:center">Someone shared a list with you. Add it to your trips?</p>
          <div style="background:#f0f8f0;border:1px solid #c8e6c9;border-radius:14px;padding:14px;margin-bottom:16px">
            <p style="font-size:13px;font-weight:700;color:#1B4332;margin-bottom:8px">${itemCount} item${itemCount === 1 ? "" : "s"}${shared.budget ? ` · Budget ${shared.currencySymbol}${Number(shared.budget).toLocaleString()}` : ""}</p>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${shared.items
                .slice(0, 10)
                .map(
                  (i) =>
                    `<span style="background:#fff;border:1px solid #c8e6c9;border-radius:8px;padding:3px 9px;font-size:11px;color:#2E7D32">${escapeHTML(i.name)}</span>`,
                )
                .join("")}
              ${itemCount > 10 ? `<span style="font-size:11px;color:#888;padding:3px 4px">+${itemCount - 10} more</span>` : ""}
            </div>
          </div>
          <button data-action="import_shared_list" class="btn-primary" style="margin-bottom:10px">Start Shopping This List</button>
          <button data-action="dismiss_shared_list" style="width:100%;padding:12px;background:none;border:none;font-size:14px;color:#888">Not now</button>
        </div>
      </div>`;
  }

  return "";
}

// ─── Event Delegation ─────────────────────────────────────────────────────────
let inputTimeout;

function attachEvents() {
  const app = document.getElementById("app");
  if (!app) return;

  if (!app.dataset.eventsBound) {
    app.addEventListener("click", (e) => {
      const el = e.target.closest(
        "[data-action],[data-nav],[data-trip],[data-filter],[data-calday],[data-cal],[data-price-item],[data-set-currency],[data-ai-add],[data-del],[data-qty-inc],[data-qty-dec],[data-price],[data-sched-id],[data-theme-choice]",
      );
      if (!el) return;

      // Nav
      if (el.dataset.nav) {
        setState({
          view: el.dataset.nav,
          selectedTrip: null,
          selectedItem: null,
        });
        return;
      }

      // Actions
      const action = el.dataset.action;
      if (action === "new_trip") {
        startNewTrip();
        return;
      }
      if (action === "back_home") {
        setState({ view: "home" });
        return;
      }
      if (action === "finish_trip") {
        finishTrip();
        return;
      }
      if (action === "share_list") {
        shareCurrentTrip();
        return;
      }
      if (action === "mark_all_done") {
        if (state.activeTrip) {
          const items = state.activeTrip.items.map((item) => ({
            ...item,
            checked: true,
          }));
          setState({ activeTrip: { ...state.activeTrip, items } });
          saveActiveTrip();
          if (navigator.vibrate) navigator.vibrate(30);
        }
        return;
      }
      if (action === "open_schedule") {
        setState({ modal: "schedule" });
        return;
      }
      if (action === "open_budget") {
        setState({ modal: "budget" });
        return;
      }
      if (action === "save_budget") {
        const raw = document.getElementById("budget-input")?.value;
        const value = raw && Number(raw) > 0 ? Number(raw) : "";
        setBudget(value);
        return;
      }
      if (action === "clear_budget") {
        setBudget("");
        return;
      }
      if (action === "import_shared_list") {
        importSharedList();
        return;
      }
      if (action === "dismiss_shared_list") {
        setState({ modal: null, incomingSharedList: null });
        return;
      }
      if (action === "close_modal") {
        setState({ modal: null });
        return;
      }
      if (action === "onboarding_next") {
        if (state.onboardingStep === 0) {
          // Tutorial → Name
          setState({ onboardingStep: 1 });
          return;
        }
        if (state.onboardingStep === 1) {
          // Name → Country
          const input = document.getElementById("user-name");
          const name = input?.value.trim();
          if (!name) {
            input?.classList.add("validation-error");
            input?.focus();
            showToast("Please enter your name");
            return;
          }
          save("st_user_name", name);
          setState({ userName: name, onboardingStep: 2 });
          return;
        }
        return;
      }
      if (action === "save_country") {
        const countryCode = el.dataset.countryCode;
        const country = COUNTRIES.find((c) => c.code === countryCode);
        if (country) {
          save("st_user_country", country);
          setState({ userCountry: country });
        }
        return;
      }
      if (action === "save_onboarding") {
        save("st_onboarding_step", 2);
        setState({ modal: null, view: "home" });
        return;
      }
      if (action === "toggle_theme") {
        setThemePreference(isDarkTheme() ? "light" : "dark");
        return;
      }
      if (action === "set_theme") {
        setThemePreference(el.dataset.themeChoice);
        return;
      }
      if (action === "export_data") {
        exportTrips();
        return;
      }
      if (action === "import_data") {
        document.getElementById("import-file")?.click();
        return;
      }
      if (action === "delete_scheduled") {
        const remaining = state.scheduledTrips.filter(
          (trip) => trip.id !== el.dataset.schedId,
        );
        save("st_scheduled", remaining);
        setState({ scheduledTrips: remaining });
        showToast("Scheduled trip deleted");
        return;
      }
      if (action === "edit_scheduled") {
        const scheduled = state.scheduledTrips.find(
          (trip) => trip.id === el.dataset.schedId,
        );
        if (scheduled)
          setState({ editingScheduled: scheduled, modal: "schedule" });
        return;
      }
      if (action === "open_ai") {
        fetchAISuggestions();
        return;
      }
      if (action === "save_schedule") {
        const date = document.getElementById("sched-date")?.value;
        const time = document.getElementById("sched-time")?.value;
        const note = document.getElementById("sched-note")?.value;
        if (!date) return;
        requestNotifPermission().then(() =>
          saveScheduledTrip(date, time, note),
        );
        return;
      }
      if (action === "req_notif") {
        requestNotifPermission().then((ok) =>
          showToast(ok ? "Reminders enabled! 🔔" : "Permission denied"),
        );
        return;
      }
      if (action === "view_trip") {
        const trip = state.trips.find((t) => t.id === el.dataset.trip);
        if (trip) setState({ selectedTrip: trip, view: "trip_detail" });
        return;
      }
      if (action === "edit_trip") {
        const trip = state.trips.find((item) => item.id === el.dataset.tripId);
        if (trip) {
          const editable = { ...trip, status: "active" };
          save("st_active_trip", editable);
          setState({
            activeTrip: editable,
            view: "active",
            selectedTrip: null,
          });
        }
        return;
      }
      if (action === "delete_trip") {
        const remaining = state.trips.filter(
          (item) => item.id !== el.dataset.tripId,
        );
        save("st_trips", remaining);
        setState({ trips: remaining, selectedTrip: null, view: "history" });
        showToast("Trip deleted");
        return;
      }
      if (action === "clear_price_item") {
        setState({ selectedItem: null });
        return;
      }
      if (action === "start_scheduled") {
        const sched = state.scheduledTrips.find(
          (t) => t.id === el.dataset.schedId,
        );
        if (sched) startScheduledTrip(sched);
        return;
      }

      // Trip view
      if (el.dataset.trip) {
        const trip = state.trips.find((t) => t.id === el.dataset.trip);
        if (trip) setState({ selectedTrip: trip, view: "trip_detail" });
        return;
      }

      // Filter
      if (el.dataset.filter) {
        setState({ tripFilter: el.dataset.filter });
        return;
      }

      // Calendar day
      if (el.dataset.calday) {
        const ds = el.dataset.calday;
        const trip = state.trips.find((t) => t.date === ds);
        const sched = state.scheduledTrips.find((t) => t.date === ds);
        if (trip) {
          setState({ selectedTrip: trip, view: "trip_detail" });
        } else if (sched) {
          startScheduledTrip(sched);
        } else {
          startNewTrip(ds);
        }
        return;
      }

      // Calendar nav
      if (el.dataset.cal) {
        let { calMonth, calYear } = state;
        if (el.dataset.cal === "prev") {
          calMonth--;
          if (calMonth < 0) {
            calMonth = 11;
            calYear--;
          }
        } else {
          calMonth++;
          if (calMonth > 11) {
            calMonth = 0;
            calYear++;
          }
        }
        setState({ calMonth, calYear });
        return;
      }

      // Price item
      if (el.dataset.priceItem) {
        setState({ selectedItem: el.dataset.priceItem });
        return;
      }

      // Currency
      if (el.dataset.setCurrency) {
        const c = CURRENCIES.find((x) => x.code === el.dataset.setCurrency);
        if (c) {
          save("st_currency", c);
          setState({ currency: c });
          showToast(`Currency set to ${c.code} ${c.symbol}`);
        }
        return;
      }

      // AI add
      if (el.dataset.aiAdd) {
        addItemToTrip(el.dataset.aiAdd);
        const remaining = state.aiSuggestions.filter(
          (s) => s !== el.dataset.aiAdd,
        );
        setState({ aiSuggestions: remaining });
        return;
      }

      // Checkbox
      if (el.dataset.del) {
        removeItem(el.dataset.del);
        return;
      }
      if (el.dataset.qtyInc) {
        const item = state.activeTrip?.items.find(
          (i) => i.id === el.dataset.qtyInc,
        );
        if (item) updateItem(item.id, "qty", Number(item.qty || 1) + 1);
        return;
      }
      if (el.dataset.qtyDec) {
        const item = state.activeTrip?.items.find(
          (i) => i.id === el.dataset.qtyDec,
        );
        if (item && Number(item.qty || 1) > 1)
          updateItem(item.id, "qty", Number(item.qty || 1) - 1);
        return;
      }

      // Overlay close
      if (el.id === "modal-overlay") {
        setState({ modal: null });
        return;
      }
    });
    app.dataset.eventsBound = "true";
  }

  // Input: item search
  const itemInput = document.getElementById("item-input");
  if (itemInput) {
    itemInput.addEventListener("input", () => {
      const val = itemInput.value;
      const sugBox = document.getElementById("suggestions");
      if (!val.trim()) {
        sugBox.style.display = "none";
        return;
      }
      const combined = [...new Set([...allHistoryItems(), ...SAMPLE_ITEMS])];
      const matches = combined
        .filter(
          (s) =>
            s.toLowerCase().includes(val.toLowerCase()) &&
            s.toLowerCase() !== val.toLowerCase(),
        )
        .slice(0, 6);
      if (matches.length === 0) {
        sugBox.style.display = "none";
        return;
      }
      sugBox.innerHTML = matches
        .map(
          (m) =>
            `<button class="suggestion-row" data-sug="${escapeHTML(m)}"><img class="suggestion-thumb" data-product-image="${escapeHTML(m)}" src="${productImage(m)}" alt="" loading="lazy" referrerpolicy="no-referrer" /><span>${escapeHTML(m)}</span></button>`,
        )
        .join("");
      sugBox.style.display = "block";
    });
    itemInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = itemInput.value;
        itemInput.value = "";
        document.getElementById("suggestions").style.display = "none";
        addItemToTrip(value);
      }

      document
        .getElementById("import-file")
        ?.addEventListener("change", (event) => {
          importTrips(event.target.files?.[0]);
        });
    });
    // Suggestion click
    document.getElementById("suggestions")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-sug]");
      if (btn) {
        itemInput.value = "";
        document.getElementById("suggestions").style.display = "none";
        addItemToTrip(btn.dataset.sug);
      }
    });
  }

  // Add btn
  document.getElementById("add-item-btn")?.addEventListener("click", () => {
    const input = document.getElementById("item-input");
    if (input) {
      const value = input.value;
      input.value = "";
      document.getElementById("suggestions").style.display = "none";
      addItemToTrip(value);
    }
  });

  // Price inputs (inline, no re-render on every key)
  document.querySelectorAll("[data-price]").forEach((input) => {
    input.addEventListener("change", (e) => {
      updateItem(e.target.dataset.price, "price", e.target.value);
    });
  });

  document.querySelectorAll("[data-unit]").forEach((select) => {
    select.addEventListener("change", (e) => {
      updateItem(e.target.dataset.unit, "unit", e.target.value);
    });
  });

  // Checkbox direct
  document
    .querySelectorAll("input[type=checkbox][data-check]")
    .forEach((cb) => {
      cb.addEventListener("change", (e) => {
        updateItem(e.target.dataset.check, "checked", e.target.checked);
        if (e.target.checked && navigator.vibrate) navigator.vibrate(20);
      });
    });

  document.querySelectorAll(".item-row[data-item-id]").forEach((row) => {
    let startX = 0;
    row.addEventListener(
      "touchstart",
      (event) => {
        startX = event.changedTouches[0].clientX;
      },
      { passive: true },
    );
    row.addEventListener(
      "touchend",
      (event) => {
        const distance = event.changedTouches[0].clientX - startX;
        if (distance < -90) {
          row.classList.add("swipe-delete");
          row.style.transform = "translateX(-110%)";
          setTimeout(() => removeItem(row.dataset.itemId), 180);
        }
      },
      { passive: true },
    );
  });

  // History search
  const histSearch = document.getElementById("hist-search");
  if (histSearch) {
    histSearch.addEventListener("input", (e) => {
      clearTimeout(inputTimeout);
      inputTimeout = setTimeout(
        () => setState({ histSearch: e.target.value }),
        200,
      );
    });
  }

  // Price search
  const priceSearch = document.getElementById("price-search");
  if (priceSearch) {
    priceSearch.addEventListener("input", (e) => {
      clearTimeout(inputTimeout);
      inputTimeout = setTimeout(
        () => setState({ priceFilter: e.target.value }),
        200,
      );
    });
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
checkForSharedList();
render();
state.scheduledTrips.forEach(scheduleNotification);
