document.querySelectorAll("[data-compare]").forEach((shell) => {
  const range = shell.querySelector(".compare-range");
  const updateSplit = () => shell.style.setProperty("--split", `${range.value}%`);
  range.addEventListener("input", updateSplit);
  updateSplit();
});

const hotspots = document.querySelectorAll(".hotspot");

const keepCardInsideScreen = (hotspot) => {
  const card = hotspot.querySelector(".hotspot-card");
  const viewport = hotspot.closest(".compare-viewport");
  if (!card || !viewport) return;

  card.style.setProperty("--card-shift-x", "0px");
  card.style.setProperty("--card-shift-y", "0px");

  requestAnimationFrame(() => {
    const cardBox = card.getBoundingClientRect();
    const viewportBox = viewport.getBoundingClientRect();
    const inset = 8;
    let shiftX = 0;
    let shiftY = 0;

    if (cardBox.left < viewportBox.left + inset) shiftX = viewportBox.left + inset - cardBox.left;
    if (cardBox.right > viewportBox.right - inset) shiftX = viewportBox.right - inset - cardBox.right;
    if (cardBox.top < viewportBox.top + inset) shiftY = viewportBox.top + inset - cardBox.top;
    if (cardBox.bottom > viewportBox.bottom - inset) shiftY = viewportBox.bottom - inset - cardBox.bottom;

    card.style.setProperty("--card-shift-x", `${shiftX}px`);
    card.style.setProperty("--card-shift-y", `${shiftY}px`);
  });
};

hotspots.forEach((hotspot) => {
  hotspot.addEventListener("click", (event) => {
    event.stopPropagation();
    const shouldOpen = !hotspot.classList.contains("is-open");
    hotspots.forEach((item) => item.classList.remove("is-open"));
    hotspot.classList.toggle("is-open", shouldOpen);
    if (shouldOpen) keepCardInsideScreen(hotspot);
  });

  hotspot.addEventListener("mouseenter", () => keepCardInsideScreen(hotspot));
  hotspot.addEventListener("focus", () => keepCardInsideScreen(hotspot));
});

document.addEventListener("click", () => {
  hotspots.forEach((hotspot) => hotspot.classList.remove("is-open"));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hotspots.forEach((hotspot) => hotspot.classList.remove("is-open"));
  }
});

window.addEventListener("resize", () => {
  const openHotspot = document.querySelector(".hotspot.is-open");
  if (openHotspot) keepCardInsideScreen(openHotspot);
});

const navLinks = document.querySelectorAll(".chapter-nav a");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const sectionGroups = {
      "homepage-promos": "homepage-carousel",
      "listing-sidebar": "listing-navigation",
      "listing-products": "listing-navigation",
      "product-document": "product-layout",
    };
    const activeId = sectionGroups[visible.target.id] || visible.target.id;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
    });
  },
  { threshold: [0.3, 0.55, 0.8] },
);

document.querySelectorAll(".screen-chapter").forEach((section) => sectionObserver.observe(section));
