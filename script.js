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

  // Mobile Menu Logic
  function closeMenu() {
    if (mainNav) mainNav.classList.remove("mobile-active");
    if (overlay) overlay.classList.remove("show");
  }

  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = mainNav.classList.toggle("mobile-active");
      if (overlay) {
        overlay.classList.toggle("show", isActive);
      }
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  // Carousel Controls & Progress
  function updateCarouselControls() {
    if (!productsTrack) return;
    const maxScrollLeft = productsTrack.scrollWidth - productsTrack.clientWidth;
    const currentScroll = productsTrack.scrollLeft;

    const scrollPercent = maxScrollLeft > 0 ? (currentScroll / maxScrollLeft) * 100 : 100;
    if (progressBar) {
      progressBar.style.width = `${Math.min(Math.max(scrollPercent, 15), 100)}%`;
    }

    if (prevBtn) prevBtn.disabled = currentScroll <= 5;
    if (nextBtn) nextBtn.disabled = currentScroll >= maxScrollLeft - 5;
  }

  if (productsTrack) {
    const cardWidth = 325; // Card width + gap

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

  // Live Search Filter
  if (searchInput && productsTrack) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();

      productCards.forEach((product) => {
        const name = (product.dataset.name || "").toLowerCase();
        const descTag = product.querySelector(".card-desc");
        const ingredientsTag = product.querySelector(".card-ingredients");
        
        const description = descTag ? descTag.textContent.toLowerCase() : "";
        const ingredients = ingredientsTag ? ingredientsTag.textContent.toLowerCase() : "";

        if (name.includes(query) || description.includes(query) || ingredients.includes(query)) {
          product.style.display = "flex";
        } else {
          product.style.display = "none";
        }
      });

      productsTrack.scrollLeft = 0;
      updateCarouselControls();
    });
  }

  updateCarouselControls();
});
  }

  updateCarouselControls();
});
