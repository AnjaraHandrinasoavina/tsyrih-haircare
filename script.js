document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");
  const overlay = document.getElementById("overlay");
  const searchInput = document.getElementById("searchInput");
  const productCards = document.querySelectorAll(".product");
  const productsContainer = document.querySelector(".products");

  function closeMenu() {
    if (mainNav) mainNav.classList.remove("mobile-active");
    if (overlay) overlay.classList.remove("show");
  }

  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = mainNav.classList.toggle("mobile-active");
      if (overlay) {
        if (isActive) {
          overlay.classList.add("show");
        } else {
          overlay.classList.remove("show");
        }
      }
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  // Recherche dynamique des produits
  if (searchInput && productsContainer) {
    const noResultsMsg = document.createElement("p");
    noResultsMsg.className = "no-results";
    noResultsMsg.textContent = "Aucun produit ne correspond à votre recherche.";
    noResultsMsg.style.display = "none";
    noResultsMsg.style.width = "100%";
    noResultsMsg.style.gridColumn = "1 / -1";
    noResultsMsg.style.textAlign = "center";
    noResultsMsg.style.color = "var(--text-muted)";
    noResultsMsg.style.padding = "20px 0";
    productsContainer.appendChild(noResultsMsg);

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      let hasMatch = false;

      productCards.forEach((product) => {
        const name = (product.dataset.name || "").toLowerCase();
        const pTag = product.querySelector("p");
        const description = pTag ? pTag.textContent.toLowerCase() : "";

        if (name.includes(query) || description.includes(query)) {
          product.style.display = "flex";
          hasMatch = true;
        } else {
          product.style.display = "none";
        }
      });

      noResultsMsg.style.display = hasMatch ? "none" : "block";
    });
  }
});