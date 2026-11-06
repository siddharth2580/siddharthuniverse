const initUniverse = () => {
  const body = document.body;
  const mainHeader = document.getElementById("mainHeader");
  const searchTrigger = document.getElementById("searchTrigger");
  const closeSearch = document.getElementById("closeSearch");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("searchInput");

  const menuTrigger = document.getElementById("menuTrigger");
  const closeMenu = document.getElementById("closeMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  const modal = document.getElementById("projectModal");
  const closeModalBtn = document.getElementById("closeModal");
  const ledgerRows = document.querySelectorAll(".ledger-row");

  const modalId = document.getElementById("modalId");
  const modalCategory = document.getElementById("modalCategory");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalTech = document.getElementById("modalTech");
  const modalLiveBtn = document.getElementById("modalLiveBtn");
  const modalRepoBtn = document.getElementById("modalRepoBtn");

  const closeAllOverlays = () => {
    if (searchOverlay) searchOverlay.classList.remove("active");
    if (menuOverlay) menuOverlay.classList.remove("active");
    if (modal) modal.classList.remove("active");
    body.classList.remove("no-scroll");
  };

  // Header Scroll Sticky Effect (Harvard Style with Animation)
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      mainHeader.classList.add("scrolled");
    } else {
      mainHeader.classList.remove("scrolled");
    }
  });

  // Switch View Helper Function with Smooth Animations & History Support
  const switchView = (targetId, updateHistory = true) => {
    closeAllOverlays();
    const views = document.querySelectorAll(".view-section");
    const targetView = document.getElementById(targetId);

    if (!targetView) return;

    views.forEach((v) => {
      v.classList.remove("active-view", "fade-in");
    });

    targetView.classList.add("active-view");
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      targetView.classList.add("fade-in");
    }, 50);

    if (updateHistory) {
      history.pushState({ viewId: targetId }, "", `#${targetId}`);
    }
  };

  // View Switch Link Click Listeners
  const viewSwitchLinks = document.querySelectorAll(".view-switch-link");
  viewSwitchLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetId = link.getAttribute("data-target");
      if (targetId) {
        switchView(targetId, true);
      }
    });
  });

  // Browser Navigation Listener (Back / Forward)
  window.addEventListener("popstate", (e) => {
    if (e.state && e.state.viewId) {
      switchView(e.state.viewId, false);
    } else {
      switchView("mainView", false);
    }
  });

  // Hash Initialization
  const currentHash = window.location.hash.replace("#", "");
  if (currentHash && document.getElementById(currentHash)) {
    switchView(currentHash, false);
  } else {
    switchView("mainView", false);
  }

  // Search Controls
  if (searchTrigger && searchOverlay) {
    searchTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAllOverlays();
      searchOverlay.classList.add("active");
      body.classList.add("no-scroll");
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 350);
      }
    });
  }

  if (closeSearch) {
    closeSearch.addEventListener("click", (e) => {
      e.preventDefault();
      closeAllOverlays();
    });
  }

  // Menu Controls
  if (menuTrigger && menuOverlay) {
    menuTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAllOverlays();
      menuOverlay.classList.add("active");
      body.classList.add("no-scroll");
    });
  }

  if (closeMenu) {
    closeMenu.addEventListener("click", (e) => {
      e.preventDefault();
      closeAllOverlays();
    });
  }

  // Smooth Scroll Anchor Links
  document.querySelectorAll(".smooth-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        const mainView = document.getElementById("mainView");
        if (!mainView.classList.contains("active-view")) {
          switchView("mainView", true);
        }

        closeAllOverlays();
        setTimeout(() => {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }
    });
  });

  // Ledger Project Modal Trigger
  ledgerRows.forEach((row) => {
    row.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const id = row.getAttribute("data-id");
      const cat = row.getAttribute("data-cat");
      const title = row.getAttribute("data-title");
      const desc = row.getAttribute("data-desc");
      const techString = row.getAttribute("data-tech");
      const liveLink = row.getAttribute("data-live");
      const repoLink = row.getAttribute("data-repo");

      if (modalId) modalId.textContent = id;
      if (modalCategory) modalCategory.textContent = cat;
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;

      if (modalTech && techString) {
        modalTech.innerHTML = "";
        techString.split(",").forEach((tech) => {
          const span = document.createElement("span");
          span.textContent = tech.trim();
          modalTech.appendChild(span);
        });
      }

      if (modalLiveBtn) modalLiveBtn.href = liveLink;
      if (modalRepoBtn) modalRepoBtn.href = repoLink;

      closeAllOverlays();
      if (modal) {
        modal.classList.add("active");
        body.classList.add("no-scroll");
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeAllOverlays();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllOverlays();
  });

  document.addEventListener("click", (e) => {
    if (modal && modal.classList.contains("active")) {
      const modalCard = modal.querySelector(".project-modal-card");
      if (modalCard && !modalCard.contains(e.target)) {
        closeAllOverlays();
      }
    }
  });

  // Intersection Observer Reveal Animations
  const revealElements = document.querySelectorAll(
    ".reveal-on-scroll, .reveal-card, .reveal-row",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.15 },
  );

  revealElements.forEach((el) => observer.observe(el));
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initUniverse);
} else {
  initUniverse();
}
