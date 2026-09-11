document.addEventListener("DOMContentLoaded", () => {

  const CONFIG = {
    whatsappNumber: "23054887889",
    freeShippingThreshold: 150000,
    shippingCost: 5000
  };

  // Base de données des soins avec vos photos réelles
  const products = [
    {
      id: 1,
      name: "SHAMPOOING PURIFIANT & HYDRATANT",
      category: "lavage",
      price: 28000,
      volume: "200 ml",
      image: "img4.jpg",
      badge: "Nettoyage Doux",
      badgeClass: "",
      ingredients: "Aloe Vera • Huile de Ricin • Beurre de Karité",
      desc: "Nettoie en douceur, hydrate en profondeur et rééquilibre le cuir chevelu sans l'assécher.",
      usage: "Émulsionner sur cuir chevelu mouillé, masser délicatement puis rincer. Une seule application suffit."
    },
    {
      id: 2,
      name: "LEAVE-IN CRÈME HYDRATANTE",
      category: "coiffant",
      price: 35000,
      volume: "100 g",
      image: "img2.jpg",
      badge: "Best-Seller",
      badgeClass: "highlight",
      ingredients: "Karité • Huile de Coco • Aloe Vera",
      desc: "Soin sans rincage. Nourrit, démêle instantanément et protège vos longueurs de la casse.",
      usage: "Appliquer sur cheveux humides ou secs sur les longueurs et pointes. Ne pas rincer."
    },
    {
      id: 3,
      name: "HUILE BOOST POUSSE",
      category: "pousse",
      price: 32000,
      volume: "50 ml",
      image: "img3.jpg",
      badge: "Croissance",
      badgeClass: "",
      ingredients: "Huile de Romarin • Huile de Ricin • Vitamine E",
      desc: "Stimule la circulation du cuir chevelu, fortifie la racine et accélère la pousse des cheveux.",
      usage: "Appliquer quelques gouttes directement sur le cuir chevelu 2 à 3 fois par semaine. Masser 3 minutes."
    },
    {
      id: 4,
      name: "SPRAY HYDRATANT & DÉMÊLANT",
      category: "coiffant",
      price: 30000,
      volume: "200 ml",
      image: "img2.jpg",
      badge: "Soin Quotidien",
      badgeClass: "",
      ingredients: "Infusion d'Aloe Vera & Glycérine",
      desc: "Rafraîchit vos boucles et apporte une hydratation express à tout moment de la journée.",
      usage: "Vaporiser à 20cm de la chevelure pour réhydrater avant le coiffage ou raviver les boucles."
    }
  ];

  // État du Panier
  let cart = JSON.parse(localStorage.getItem('tsyrih_cart')) || [];

  // Sélecteurs DOM
  const productsTrack = document.getElementById("productsTrack");
  const searchInput = document.getElementById("searchInput");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressBar = document.getElementById("progressBar");
  
  // Menu Mobile
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");
  const overlay = document.getElementById("overlay");

  // Panier DOM
  const cartToggleBtn = document.getElementById("cart-toggle-btn");
  const cartDrawerOverlay = document.getElementById("cart-drawer-overlay");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartBadge = document.getElementById("cart-badge");
  const cartSubtotalEl = document.getElementById("cart-subtotal");
  const cartShippingEl = document.getElementById("cart-shipping");
  const cartTotalEl = document.getElementById("cart-total");
  const shippingProgressBar = document.getElementById("shipping-progress-bar");
  const shippingText = document.getElementById("shipping-text");
  const whatsappCheckoutBtn = document.getElementById("whatsapp-checkout-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");

  // Modale Aperçu Produit
  const productModalOverlay = document.getElementById("product-modal-overlay");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  let activeModalProductId = null;

  // ==========================================
  //         RENDU DES PRODUITS EN GRILLE/CARROUSEL
  // ==========================================
  function renderProducts(items = products) {
    if (!productsTrack) return;
    productsTrack.innerHTML = "";

    if (items.length === 0) {
      productsTrack.innerHTML = `<p style="text-align:center; width:100%; color:var(--text-muted); padding:30px 0;">Aucun soin ne correspond à votre recherche.</p>`;
      return;
    }

    items.forEach(product => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.name = product.name;

      card.innerHTML = `
        <div class="card-badge ${product.badgeClass}">${product.badge}</div>
        <div class="card-image-wrapper">
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
          <button class="quick-view-btn" data-id="${product.id}">Aperçu rapide</button>
        </div>
        <div class="card-content">
          <div class="card-ingredients">${product.ingredients}</div>
          <h3 class="card-title">${product.name}</h3>
          <p class="card-desc">${product.desc}</p>
          <div class="card-footer">
            <span class="card-price">${product.price.toLocaleString()} Ar <small>/ ${product.volume}</small></span>
            <button class="card-btn add-to-cart-btn" data-id="${product.id}">
              <i class="fa-solid fa-plus"></i> Ajouter
            </button>
          </div>
        </div>
      `;
      productsTrack.appendChild(card);
    });

    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        addToCart(id);
      });
    });

    document.querySelectorAll(".quick-view-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        openQuickView(id);
      });
    });

    updateCarouselControls();
  }

  // ==========================================
  //         FILTRES ET RECHERCHE
  // ==========================================
  function filterProducts() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const activeFilterBtn = document.querySelector(".filter-btn.active");
    const category = activeFilterBtn ? activeFilterBtn.dataset.filter : "all";

    const filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(query) ||
                            p.desc.toLowerCase().includes(query) ||
                            p.ingredients.toLowerCase().includes(query);
      const matchesCategory = (category === "all") || (p.category === category);
      return matchesSearch && matchesCategory;
    });

    renderProducts(filtered);
  }

  if (searchInput) searchInput.addEventListener("input", filterProducts);

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterProducts();
    });
  });

  // ==========================================
  //          NAVIGATION CARROUSEL
  // ==========================================
  function updateCarouselControls() {
    if (!productsTrack) return;
    const maxScrollLeft = productsTrack.scrollWidth - productsTrack.clientWidth;
    const currentScroll = productsTrack.scrollLeft;

    const scrollPercent = maxScrollLeft > 0 ? (currentScroll / maxScrollLeft) * 100 : 100;
    if (progressBar) progressBar.style.width = `${Math.min(Math.max(scrollPercent, 15), 100)}%`;

    if (prevBtn) prevBtn.disabled = currentScroll <= 5;
    if (nextBtn) nextBtn.disabled = currentScroll >= maxScrollLeft - 5;
  }

  if (productsTrack) {
    const cardWidth = 325;
    if (nextBtn) nextBtn.addEventListener("click", () => productsTrack.scrollBy({ left: cardWidth, behavior: "smooth" }));
    if (prevBtn) prevBtn.addEventListener("click", () => productsTrack.scrollBy({ left: -cardWidth, behavior: "smooth" }));
    productsTrack.addEventListener("scroll", updateCarouselControls);
    window.addEventListener("resize", updateCarouselControls);
  }

  // ==========================================
  //  GESTION DU PANIER
  // ==========================================
  function saveCart() {
    localStorage.setItem('tsyrih_cart', JSON.stringify(cart));
    updateCartUI();
  }

  function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, volume: product.volume, image: product.image, quantity: quantity });
    }

    saveCart();
    showToast(`"${product.name}" a été ajouté au panier !`);
    openCart();
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.style.display = totalCount > 0 ? "flex" : "none";
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p style="text-align:center; padding:30px; color:var(--text-muted); font-size:13px;">Votre panier est vide.</p>`;
      if (cartSubtotalEl) cartSubtotalEl.textContent = "0 Ar";
      if (cartShippingEl) cartShippingEl.textContent = "0 Ar";
      if (cartTotalEl) cartTotalEl.textContent = "0 Ar";
      if (shippingProgressBar) shippingProgressBar.style.width = "0%";
      return;
    }

    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let freeShip = subtotal >= CONFIG.freeShippingThreshold;
    let shipping = freeShip ? 0 : CONFIG.shippingCost;
    let total = subtotal + shipping;

    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${(item.price * item.quantity).toLocaleString()} Ar</div>
          <div class="cart-qty-ctrl">
            <button class="cart-qty-btn dec-btn" data-id="${item.id}">-</button>
            <span style="font-size:11px;">${item.quantity}</span>
            <button class="cart-qty-btn inc-btn" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="cart-qty-btn remove-btn" data-id="${item.id}" style="color:var(--primary-dark);"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join('');

    cartItemsContainer.querySelectorAll('.inc-btn').forEach(b => b.addEventListener('click', (e) => changeQty(parseInt(e.target.dataset.id), 1)));
    cartItemsContainer.querySelectorAll('.dec-btn').forEach(b => b.addEventListener('click', (e) => changeQty(parseInt(e.target.dataset.id), -1)));
    cartItemsContainer.querySelectorAll('.remove-btn').forEach(b => b.addEventListener('click', (e) => removeItem(parseInt(e.currentTarget.dataset.id))));

    if (cartSubtotalEl) cartSubtotalEl.textContent = `${subtotal.toLocaleString()} Ar`;
    if (cartShippingEl) cartShippingEl.textContent = freeShip ? "Gratuite" : `${shipping.toLocaleString()} Ar`;
    if (cartTotalEl) cartTotalEl.textContent = `${total.toLocaleString()} Ar`;

    if (shippingProgressBar && shippingText) {
      let percent = Math.min(100, (subtotal / CONFIG.freeShippingThreshold) * 100);
      shippingProgressBar.style.width = `${percent}%`;
      if (freeShip) {
        shippingText.innerHTML = `🎉 <strong>Félicitations !</strong> Livraison gratuite offerte.`;
      } else {
        let diff = CONFIG.freeShippingThreshold - subtotal;
        shippingText.innerHTML = `Plus que <strong>${diff.toLocaleString()} Ar</strong> pour la livraison offerte !`;
      }
    }
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) removeItem(id);
    else saveCart();
  }

  function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm("Voulez-vous vider le panier ?")) {
        cart = [];
        saveCart();
      }
    });
  }

  function openCart() { cartDrawerOverlay?.classList.add("open"); }
  function closeCart() { cartDrawerOverlay?.classList.remove("open"); }

  if (cartToggleBtn) cartToggleBtn.addEventListener("click", openCart);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);

  // ==========================================
  //         COMMANDE VIA WHATSAPP
  // ==========================================
  if (whatsappCheckoutBtn) {
    whatsappCheckoutBtn.addEventListener("click", () => {
      if (cart.length === 0) return alert("Votre panier est vide.");

      let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      let freeShip = subtotal >= CONFIG.freeShippingThreshold;
      let total = subtotal + (freeShip ? 0 : CONFIG.shippingCost);

      let msg = `Bonjour *Tsyrih Hair Care*, je souhaite commander :\n\n`;
      cart.forEach((item, index) => {
        msg += `${index + 1}. *${item.name}* (x${item.quantity}) - ${(item.price * item.quantity).toLocaleString()} Ar\n`;
      });

      msg += `\n*Frais de livraison* : ${freeShip ? 'Gratuite' : CONFIG.shippingCost.toLocaleString() + ' Ar'}`;
      msg += `\n*TOTAL* : *${total.toLocaleString()} Ar*\n\nMerci de valider ma commande !`;

      window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // ==========================================
  //          MODALE APERÇU RAPIDE
  // ==========================================
  function openQuickView(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    activeModalProductId = p.id;
    document.getElementById("modal-title").textContent = p.name;
    document.getElementById("modal-category").textContent = p.badge;
    document.getElementById("modal-price").textContent = `${p.price.toLocaleString()} Ar`;
    document.getElementById("modal-volume").textContent = `/ ${p.volume}`;
    document.getElementById("modal-desc").textContent = p.desc;
    document.getElementById("modal-ingredients").textContent = p.ingredients;
    document.getElementById("modal-usage").textContent = p.usage;
    
    const modalImg = document.getElementById("modal-img");
    if (modalImg) modalImg.src = p.image;

    productModalOverlay?.classList.add("open");
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => productModalOverlay?.classList.remove("open"));
  }

  const modalAddToCartBtn = document.getElementById("modal-add-to-cart-btn");
  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener("click", () => {
      if (activeModalProductId) {
        addToCart(activeModalProductId);
        productModalOverlay?.classList.remove("open");
      }
    });
  }

  // ==========================================
  //       QUIZ DIAGNOSTIC CAPILLAIRE
  // ==========================================
  let quizStep = 1;
  const quizProgress = document.getElementById("quiz-progress-fill");

  document.querySelectorAll(".quiz-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const parentStep = btn.closest(".quiz-step");
      const currentStepNum = parseInt(parentStep.dataset.step, 10);

      parentStep.querySelectorAll(".quiz-option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      setTimeout(() => goToStep(currentStepNum + 1), 200);
    });
  });

  document.querySelectorAll(".quiz-prev-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const parentStep = btn.closest(".quiz-step");
      goToStep(parseInt(parentStep.dataset.step, 10) - 1);
    });
  });

  function goToStep(step) {
    quizStep = step;
    document.querySelectorAll(".quiz-step").forEach(s => s.classList.remove("active"));

    const nextEl = document.getElementById(`quiz-step-${quizStep}`);
    if (nextEl) nextEl.classList.add("active");

    if (quizProgress) {
      let percent = (quizStep / 3) * 100;
      if (quizStep > 3) percent = 100;
      quizProgress.style.width = `${percent}%`;
    }

    if (quizStep === 4) renderQuizResults();
  }

  function renderQuizResults() {
    const routineTitle = document.getElementById("routine-title");
    const routineDesc = document.getElementById("routine-desc");
    const itemsContainer = document.getElementById("recommended-items-container");

    if (routineTitle) routineTitle.textContent = "Rituel Hydratation & Pousse Intense";
    if (routineDesc) routineDesc.textContent = "Prescription idéale pour fortifier vos racines et apporter une nutrition complète.";

    if (itemsContainer) {
      itemsContainer.innerHTML = products.slice(0, 3).map(p => `
        <div class="routine-mini-card">
          <img src="${p.image}" alt="${p.name}">
          <strong>${p.name}</strong>
          <p style="color:var(--primary-dark); font-weight:bold;">${p.price.toLocaleString()} Ar</p>
        </div>
      `).join('');
    }
  }

  const restartQuizBtn = document.getElementById("restart-quiz-btn");
  if (restartQuizBtn) restartQuizBtn.addEventListener("click", () => goToStep(1));

  const addRoutineBtn = document.getElementById("add-routine-btn");
  if (addRoutineBtn) {
    addRoutineBtn.addEventListener("click", () => {
      addToCart(1);
      addToCart(2);
      addToCart(3);
      saveCart();
      showToast("Routine complète ajoutée au panier !");
    });
  }

  // ==========================================
  //       MENU MOBILE & FAQ ACCORDÉON
  // ==========================================
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("mobile-active");
      overlay?.classList.toggle("show");
    });

    overlay?.addEventListener("click", () => {
      navMenu.classList.remove("mobile-active");
      overlay.classList.remove("show");
    });
  }

  document.querySelectorAll(".faq-question").forEach(q => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      item.classList.toggle("active");
    });
  });

  // Notifications Toast
  function showToast(msg) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid fa-check" style="color:var(--primary)"></i> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }

  // Initialisation
  renderProducts();
  updateCartUI();
});
