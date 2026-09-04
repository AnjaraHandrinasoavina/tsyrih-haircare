document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");
  const overlay = document.getElementById("overlay");
  const searchInput = document.getElementById("searchInput");
  const productCards = document.querySelectorAll(".product-card");
  const productsTrack = document.getElementById("productsTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressBar = document.getElementById("progressBar");
  const carouselCounter = document.getElementById("carouselCounter");

  // Menu Mobile
  function closeMenu() {
    if (mainNav) mainNav.classList.remove("mobile-active");
    if (overlay) overlay.classList.remove("show");
  }

  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = mainNav.classList.toggle("mobile-active");
      if (overlay) {
        if (isActive) overlay.classList.add("show");
        else overlay.classList.remove("show");
      }
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  // Logique du Carrousel
  function updateCarouselControls() {
    if (!productsTrack) return;
    const maxScrollLeft = productsTrack.scrollWidth - productsTrack.clientWidth;
    const currentScroll = productsTrack.scrollLeft;

    // Mise à jour de la barre de progression
    const scrollPercent = maxScrollLeft > 0 ? (currentScroll / maxScrollLeft) * 100 : 100;
    if (progressBar) {
      progressBar.style.width = `${Math.min(Math.max(scrollPercent, 10), 100)}%`;
    }

    // Mise à jour de l'état des boutons (désactivé si fin/début)
    if (prevBtn) prevBtn.disabled = currentScroll <= 5;
    if (nextBtn) nextBtn.disabled = currentScroll >= maxScrollLeft - 5;

    // Compteur de cartes visibles
    const visibleCards = Array.from(productCards).filter(c => c.style.display !== "none");
    if (carouselCounter) {
      carouselCounter.textContent = visibleCards.length;
    }
  }

  if (productsTrack) {
    const cardWidth = 300 + 24; // largeur carte + gap

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        productsTrack.scrollBy({ left: cardWidth, behavior: "smooth" });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        productsTrack.scrollBy({ left: -cardWidth, behavior: "smooth" });
      });
    }

    productsTrack.addEventListener("scroll", updateCarouselControls);
    window.addEventListener("resize", updateCarouselControls);
  }

  // Recherche dynamique des produits
  if (searchInput && productsTrack) {
    const noResultsMsg = document.createElement("p");
    noResultsMsg.className = "no-results";
    noResultsMsg.textContent = "Aucun produit ne correspond à votre recherche.";
    noResultsMsg.style.display = "none";
    noResultsMsg.style.width = "100%";
    noResultsMsg.style.textAlign = "center";
    noResultsMsg.style.color = "var(--text-muted)";
    noResultsMsg.style.padding = "40px 0";
    productsTrack.parentElement.appendChild(noResultsMsg);

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      let hasMatch = false;

      productCards.forEach((product) => {
        const name = (product.dataset.name || "").toLowerCase();
        const descTag = product.querySelector(".card-desc");
        const description = descTag ? descTag.textContent.toLowerCase() : "";

        if (name.includes(query) || description.includes(query)) {
          product.style.display = "flex";
          hasMatch = true;
        } else {
          product.style.display = "none";
        }
      });

      noResultsMsg.style.display = hasMatch ? "none" : "block";
      productsTrack.scrollLeft = 0;
      updateCarouselControls();
    });
  }

  updateCarouselControls();
});
