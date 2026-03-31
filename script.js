/* ================================================
   Hero Hub — Overwatch 2 Tracker
   Features: search, filter tabs, progress rings,
             role bars, hero names, confirm modal,
             keyboard nav, staggered card animation
================================================ */

const heroes = {
  tank: [
    { id: "D.Va",         name: "D.Va" },
    { id: "Doomfist",     name: "Doomfist" },
    { id: "Domina",       name: "Domina" },
    { id: "Hazard",       name: "Hazard" },
    { id: "Junker_Queen", name: "Junker Queen" },
    { id: "Mauga",        name: "Mauga" },
    { id: "Orisa",        name: "Orisa" },
    { id: "Ramattra",     name: "Ramattra" },
    { id: "reinhardt",    name: "Reinhardt" },
    { id: "Roadhog",      name: "Roadhog" },
    { id: "Sigma",        name: "Sigma" },
    { id: "Winston",      name: "Winston" },
    { id: "Wrecking-Ball",name: "Wrecking Ball" },
    { id: "Zarya",        name: "Zarya" },
  ],
  damage: [
    { id: "Anran",      name: "Anran" },
    { id: "Ashe",       name: "Ashe" },
    { id: "Bastion",    name: "Bastion" },
    { id: "cassidy",    name: "Cassidy" },
    { id: "Echo",       name: "Echo" },
    { id: "Emre",       name: "Emre" },
    { id: "Freja",      name: "Freja" },
    { id: "Genji",      name: "Genji" },
    { id: "Hanzo",      name: "Hanzo" },
    { id: "Junkrat",    name: "Junkrat" },
    { id: "Mei",        name: "Mei" },
    { id: "pharah",     name: "Pharah" },
    { id: "Reaper",     name: "Reaper" },
    { id: "Sojourn",    name: "Sojourn" },
    { id: "Soldier-76", name: "Soldier: 76" },
    { id: "Sombra",     name: "Sombra" },
    { id: "Symmetra",   name: "Symmetra" },
    { id: "torbjorn",   name: "Torbjörn" },
    { id: "tracer",     name: "Tracer" },
    { id: "Vendetta",   name: "Vendetta" },
    { id: "Venture",    name: "Venture" },
    { id: "Widowmaker", name: "Widowmaker" },
  ],
  support: [
    { id: "Ana",          name: "Ana" },
    { id: "Baptiste",     name: "Baptiste" },
    { id: "Brigitte",     name: "Brigitte" },
    { id: "Illari",       name: "Illari" },
    { id: "Jetpack-Cat",  name: "Jetpack Cat" },
    { id: "kiriko",       name: "Kiriko" },
    { id: "Lifeweaver",   name: "Lifeweaver" },
    { id: "lucio",        name: "Lúcio" },
    { id: "Mercy",        name: "Mercy" },
    { id: "Mizuki",       name: "Mizuki" },
    { id: "Moira",        name: "Moira" },
    { id: "Wuyang",       name: "Wuyang" },
    { id: "Zenyatta",     name: "Zenyatta" },
  ],
};

// ── State ──
let selectedHeroes = JSON.parse(localStorage.getItem("selectedHeroes")) || [];
let activeFilter = "all";

// ── DOM refs ──
const ringFill    = document.getElementById("ringFill");
const totalPercent = document.getElementById("totalPercent");
const totalLabel   = document.getElementById("totalLabel");
const searchInput  = document.getElementById("searchInput");
const clearBtn     = document.getElementById("clearSearch");
const modalOverlay = document.getElementById("modalOverlay");
const noResults    = document.getElementById("noResults");
const noResultsQ   = document.getElementById("noResultsQuery");
const CIRCUMFERENCE = 2 * Math.PI * 18; // r=18

// ── Progress ──
function updateProgress() {
  let totalAll = 0, doneAll = 0;

  Object.keys(heroes).forEach(role => {
    const list  = heroes[role];
    const total = list.length;
    const done  = list.filter(h => selectedHeroes.includes(h.id)).length;

    // role fraction text
    document.getElementById(`${role}-progress`).textContent = `${done} / ${total}`;

    // role progress bar
    const bar = document.getElementById(`${role}-bar`);
    bar.style.width = total ? `${(done / total) * 100}%` : "0%";

    totalAll += total;
    doneAll  += done;
  });

  const pct = totalAll ? Math.round((doneAll / totalAll) * 100) : 0;
  totalPercent.textContent = `${pct}%`;
  totalLabel.textContent   = `${doneAll} / ${totalAll} heroes`;

  // SVG ring
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
  ringFill.style.strokeDashoffset = offset;
}

// ── Card creation ──
function createHeroCard(hero, role, index) {
  const card = document.createElement("div");
  card.classList.add("hero-card");
  card.dataset.name = hero.name.toLowerCase();
  card.dataset.id   = hero.id;
  card.tabIndex     = 0;
  card.setAttribute("role", "checkbox");
  card.setAttribute("aria-checked", selectedHeroes.includes(hero.id) ? "true" : "false");
  card.setAttribute("aria-label", hero.name);
  card.style.animationDelay = `${index * 20}ms`;

  const img = document.createElement("img");
  img.src   = `images/${hero.id}.webp`;
  img.alt   = hero.name;
  img.loading = "lazy";

  const nameEl = document.createElement("div");
  nameEl.classList.add("hero-name");
  nameEl.textContent = hero.name;

  // Check mark SVG
  const check = document.createElement("div");
  check.classList.add("check-mark");
  check.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;

  card.append(img, nameEl, check);

  if (selectedHeroes.includes(hero.id)) card.classList.add("selected");

  const toggle = () => {
    const isSelected = selectedHeroes.includes(hero.id);
    card.classList.toggle("selected", !isSelected);
    card.setAttribute("aria-checked", String(!isSelected));

    if (isSelected) {
      selectedHeroes.splice(selectedHeroes.indexOf(hero.id), 1);
    } else {
      selectedHeroes.push(hero.id);
    }
    localStorage.setItem("selectedHeroes", JSON.stringify(selectedHeroes));
    updateProgress();
  };

  card.addEventListener("click", toggle);
  card.addEventListener("keydown", e => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); }
  });

  return card;
}

// ── Render all heroes ──
function renderHeroes() {
  Object.keys(heroes).forEach(role => {
    const container = document.getElementById(role);
    heroes[role].forEach((hero, i) => {
      container.appendChild(createHeroCard(hero, role, i));
    });
  });
}

// ── Search ──
function applySearch(query) {
  const q = query.trim().toLowerCase();
  clearBtn.classList.toggle("visible", q.length > 0);

  let visibleCount = 0;

  document.querySelectorAll(".hero-card").forEach(card => {
    const name      = card.dataset.name;
    const matchQ    = !q || name.includes(q);
    const section   = card.closest("section");
    const role      = section ? section.dataset.role : "";
    const matchRole = activeFilter === "all" || role === activeFilter;

    const visible = matchQ && matchRole;
    card.classList.toggle("card-hidden", !visible);
    if (visible) visibleCount++;
  });

  // Show/hide sections with no visible cards
  document.querySelectorAll("section[data-role]").forEach(sec => {
    const hasVisible = sec.querySelectorAll(".hero-card:not(.card-hidden)").length > 0;
    sec.classList.toggle("hidden", !hasVisible);
  });

  noResults.style.display = visibleCount === 0 ? "block" : "none";
  noResultsQ.textContent  = query;
}

// ── Filter tabs ──
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    activeFilter = tab.dataset.filter;
    applySearch(searchInput.value);
  });
});

// ── Search input ──
searchInput.addEventListener("input", () => applySearch(searchInput.value));
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  applySearch("");
  searchInput.focus();
});

// ── Reset (with confirmation modal) ──
document.getElementById("resetBtn").addEventListener("click", () => {
  modalOverlay.classList.add("open");
});
document.getElementById("cancelReset").addEventListener("click", () => {
  modalOverlay.classList.remove("open");
});
document.getElementById("confirmReset").addEventListener("click", () => {
  selectedHeroes = [];
  localStorage.removeItem("selectedHeroes");
  document.querySelectorAll(".hero-card").forEach(card => {
    card.classList.remove("selected");
    card.setAttribute("aria-checked", "false");
  });
  updateProgress();
  modalOverlay.classList.remove("open");
});
// Close modal on overlay click
modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) modalOverlay.classList.remove("open");
});
// Close modal on Escape
document.addEventListener("keydown", e => {
  if (e.key === "Escape") modalOverlay.classList.remove("open");
});

// ── Init ──
renderHeroes();
updateProgress();
