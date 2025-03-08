// Disable browser's scroll restoration
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}

// ===== Content Loading and Navigation =====
function loadContent(hash) {
  let url;
  switch (hash) {
    case "#projects":
      url = "pages/projects.html";
      break;
    case "#experience":
      url = "pages/experience.html";
      break;
    case "#about":
      url = "pages/about.html";
      break;
    case "#bookstore-project":
      url = "pages/bookstore-project.html";
      break;
    case "#earthub-project":
      url = "pages/earthub-project.html";
      break;
    case "#elevator-sim-project":
      url = "pages/elevator-sim-project.html";
      break;
    case "#misc-projects":
      url = "pages/misc-projects.html";
      break;
    default:
      url = "pages/projects.html";
  }

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.statusText}`);
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById("main-content").innerHTML = html;
      window.scrollTo({ top: 0, behavior: "instant" });
      addProjectLinkListeners(); // Add event listeners for project links
      addTiltEffectListeners();
      addFadeInClass();
      handleScroll();
    })
    .catch((error) => {
      console.error("Error loading content:", error);
      document.getElementById("main-content").innerHTML =
        `<p>Error loading content: ${error.message}</p>`;
    });
}

// ===== Function to handle project link clicks =====
function handleProjectLinkClick(e) {
  e.preventDefault();
  const projectHash = e.currentTarget.getAttribute("href");

  // Load the content from the correct path
  loadContent(projectHash);

  // Update the URL in the address bar to the hash fragment
  history.pushState({ projectHash }, "", `index.html${projectHash}`);
}

// ===== Add event listeners for project links =====
function addProjectLinkListeners() {
  const projectLinks = document.querySelectorAll(".project-link");
  projectLinks.forEach((link) => {
    link.addEventListener("click", handleProjectLinkClick);
  });
}

// ===== Store the current page state in localStorage =====
function storePageState(state) {
  localStorage.setItem("currentPage", state);
}

// ===== Load the stored page state from localStorage =====
function loadPageState() {
  return localStorage.getItem("currentPage");
}

// ===== Clear the stored page state in localStorage =====
function clearPageState() {
  localStorage.removeItem("currentPage");
}

// ===== Load default content (Projects) on page load if no state is stored =====
window.addEventListener("load", () => {
  const storedPage = loadPageState();
  const currentHash = window.location.hash;

  // If no hash is present, redirect to #projects
  if (!currentHash) {
    history.replaceState({}, "", "index.html#projects");
    loadContent("#projects");
    storePageState("#projects");
    updateNavStyles("projects-link");
  } else if (storedPage) {
    loadContent(storedPage);

    if (window.location.hash !== storedPage) {
      history.replaceState(
        { projectHash: storedPage },
        "",
        `index.html${storedPage}`
      );
    }

    updateNavStyles(getActiveLinkId(storedPage));
  } else {
    loadContent(currentHash);
    storePageState(currentHash);
    updateNavStyles(getActiveLinkId(currentHash));
  }

  addTiltEffectListeners();
  addFadeInClass();
  handleScroll();
});

// ===== Function to get the active link ID based on the page URL =====
function getActiveLinkId(hash) {
  if (hash.includes("#projects")) {
    return "projects-link";
  } else if (hash.includes("#about")) {
    return "about-link";
  } else if (hash.includes("#experience")) {
    return "experience-link";
  } else if (
    hash.includes("#bookstore-project") ||
    hash.includes("#earthub-project") ||
    hash.includes("#elevator-sim-project") ||
    hash.includes("#misc-projects")
  ) {
    return "projects-link";
  }
  return "projects-link";
}

// ===== Handle navigation clicks for the Projects tab =====
document.getElementById("home-link").addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default behavior
  loadContent("#projects"); // Load the projects page
  history.pushState({}, "", "index.html#projects"); // Update the URL
  clearPageState(); // Clear the stored page state
  updateNavStyles("projects-link"); // Update the navigation styles
});

document.getElementById("projects-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContent("#projects");
  history.pushState({}, "", "index.html#projects");
  clearPageState();
  updateNavStyles("projects-link");
});

// ===== Handle navigation clicks for the Experience tab =====
document.getElementById("experience-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContent("#experience");
  history.pushState({}, "", "index.html#experience");
  clearPageState();
  updateNavStyles("experience-link");
});

// ===== Handle navigation clicks for the About tab =====
document.getElementById("about-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContent("#about");
  history.pushState({}, "", "index.html#about");
  clearPageState();
  updateNavStyles("about-link");
});

// ===== Handle browser back/forward navigation =====
window.addEventListener("popstate", (event) => {
  const hash = window.location.hash;

  if (hash) {
    loadContent(hash);
    clearPageState();
    updateNavStyles(getActiveLinkId(hash));
  } else {
    loadContent("#projects");
    clearPageState();
    updateNavStyles("projects-link");
  }
});

// ===== Clear localStorage when the website is closed or the tab is refreshed =====
window.addEventListener("beforeunload", () => {
  clearPageState();
});

// ===== Function to update navigation styles =====
function updateNavStyles(activeLinkId) {
  const links = document.querySelectorAll(".header-right a");
  links.forEach((link) => {
    if (link.id === activeLinkId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ===== Function to calculate the tilt based on mouse position =====
function applyTiltEffect(event, element) {
  const rect = element.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const tiltMultiplier = 25;

  const tiltX = ((centerY - mouseY) / centerY) * tiltMultiplier;
  const tiltY = ((mouseX - centerX) / centerX) * tiltMultiplier;

  element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
  element.style.boxShadow = `0 10px 20px rgba(0, 0, 0, 0.2)`;
}

// ===== Function to reset the tilt effect =====
function resetTiltEffect(element) {
  element.style.transform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  element.style.boxShadow = "none";
}

// ===== Add event listeners to all images in watching-images and travel-images =====
function addTiltEffectListeners() {
  document
    .querySelectorAll(".watching-images img, .travel-images img")
    .forEach((img) => {
      img.addEventListener("mousemove", (e) => {
        applyTiltEffect(e, img);
      });

      img.addEventListener("mouseleave", () => {
        resetTiltEffect(img);
      });
    });
}

// ===== Ensure tilt effect listeners are added after content is loaded =====
document.addEventListener("DOMContentLoaded", () => {
  addTiltEffectListeners();
});

// ===== Add fade-in class to relevant elements =====
function addFadeInClass() {
  const elementsToAnimate = document.querySelectorAll(`
    section,
    .about-content,
    .experience-content,
    .experience-grid,
    .experience-item,
    .project-link,
    .project,
    .project-details,
    .project-details-container,
    .duration-section,
    .project-section,
    .misc-projects,
    .misc-projects-container,
    .misc-projects-grid,
    .misc-project-item,
    .other-interests,
    .watching-list,
    .watching-images,
    .travel-list,
    .travel-images
  `);

  elementsToAnimate.forEach((element) => {
    element.classList.add("fade-in");
  });
}

// ===== Function to check if an element is in the viewport =====
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight * 0.95 && rect.bottom >= 0;
}

// ===== Function to handle the scroll event =====
function handleScroll() {
  const elements = document.querySelectorAll(".fade-in");
  elements.forEach((element) => {
    if (isElementInViewport(element)) {
      element.classList.add("visible");
    } else {
      element.classList.remove("visible"); // Remove the class when element is out of viewport
    }
  });
}

// Add the scroll event listener
window.addEventListener("scroll", handleScroll);

// Trigger the scroll event on page load to check for elements already in view
window.addEventListener("load", handleScroll);
