// Disable browser's scroll restoration
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}

// ===== Content Loading and Navigation =====
function loadContent(url) {
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
  const projectUrl = e.currentTarget.getAttribute("href");

  // Construct the correct path to the project HTML file in the "pages" directory
  const projectFilePath = `pages${projectUrl}.html`;

  console.log("Loading project URL:", projectFilePath);

  // Load the content from the correct path
  loadContent(projectFilePath);

  // Update the URL in the address bar to the clean URL
  history.pushState({ projectUrl: projectFilePath }, "", projectUrl);
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
  const currentPath = window.location.pathname;

  if (storedPage) {
    loadContent(storedPage);

    if (window.location.href !== storedPage) {
      history.replaceState(
        { projectUrl: storedPage },
        "",
        `/${storedPage.replace(".html", "")}`
      );
    }

    updateNavStyles(getActiveLinkId(storedPage));
  } else if (currentPath === "/projects" || currentPath === "/projects/") {
    loadContent("pages/projects.html");
    storePageState("pages/projects.html");
    updateNavStyles("projects-link");
  } else if (currentPath === "/experience" || currentPath === "/experience/") {
    loadContent("pages/experience.html");
    storePageState("pages/experience.html");
    updateNavStyles("experience-link");
  } else if (currentPath === "/about" || currentPath === "/about/") {
    loadContent("pages/about.html");
    storePageState("pages/about.html");
    updateNavStyles("about-link");
  } else if (
    currentPath === "/bookstore-project" ||
    currentPath === "/bookstore-project/"
  ) {
    loadContent("pages/bookstore-project.html");
    storePageState("pages/bookstore-project.html");
    updateNavStyles("projects-link");
  } else if (
    currentPath === "/earthub-project" ||
    currentPath === "/earthub-project/"
  ) {
    loadContent("pages/earthub-project.html");
    storePageState("pages/earthub-project.html");
    updateNavStyles("projects-link");
  } else if (
    currentPath === "/elevator-sim-project" ||
    currentPath === "/elevator-sim-project/"
  ) {
    loadContent("pages/elevator-sim-project.html");
    storePageState("pages/elevator-sim-project.html");
    updateNavStyles("projects-link");
  } else if (
    currentPath === "/misc-projects" ||
    currentPath === "/misc-projects/"
  ) {
    loadContent("pages/misc-projects.html");
    storePageState("pages/misc-projects.html");
    updateNavStyles("projects-link");
  } else {
    loadContent("pages/projects.html");

    if (window.location.hash !== "#projects") {
      history.replaceState({}, "", "/projects");
    }

    updateNavStyles("projects-link");
  }

  addTiltEffectListeners();
  addFadeInClass();
  handleScroll();
});

// ===== Function to get the active link ID based on the page URL =====
function getActiveLinkId(pageUrl) {
  if (pageUrl.includes("projects.html")) {
    return "projects-link";
  } else if (pageUrl.includes("about.html")) {
    return "about-link";
  } else if (pageUrl.includes("experience.html")) {
    return "experience-link";
  } else if (
    pageUrl.includes("bookstore-project.html") ||
    pageUrl.includes("earthub-project.html") ||
    pageUrl.includes("elevator-sim-project.html") ||
    pageUrl.includes("misc-projects.html")
  ) {
    return "projects-link";
  }
  return "projects-link";
}

// ===== Handle navigation clicks for the Projects tab =====
document.getElementById("home-link").addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default behavior
  loadContent("pages/projects.html"); // Load the projects page
  history.pushState({}, "", "/projects"); // Update the URL
  clearPageState(); // Clear the stored page state
  updateNavStyles("projects-link"); // Update the navigation styles
});

document.getElementById("projects-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContent("pages/projects.html");
  history.pushState({}, "", "/projects");
  clearPageState();
  updateNavStyles("projects-link");
});

// ===== Handle navigation clicks for the Experience tab =====
document.getElementById("experience-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContent("pages/experience.html");
  history.pushState({}, "", "/experience");
  clearPageState();
  updateNavStyles("experience-link");
});

// ===== Handle navigation clicks for the About tab =====
document.getElementById("about-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContent("pages/about.html");
  history.pushState({}, "", "/about");
  clearPageState();
  updateNavStyles("about-link");
});

// ===== Handle browser back/forward navigation =====
window.addEventListener("popstate", (event) => {
  const path = window.location.pathname;

  if (path === "/projects" || path === "/projects/") {
    loadContent("pages/projects.html");
    clearPageState();
    updateNavStyles("projects-link");
  } else if (path === "/experience" || path === "/experience/") {
    loadContent("pages/experience.html");
    clearPageState();
    updateNavStyles("experience-link");
  } else if (path === "/about" || path === "/about/") {
    loadContent("pages/about.html");
    clearPageState();
    updateNavStyles("about-link");
  } else if (path === "/bookstore-project" || path === "/bookstore-project/") {
    loadContent("pages/bookstore-project.html");
    clearPageState();
    updateNavStyles("projects-link");
  } else if (path === "/earthub-project" || path === "/earthub-project/") {
    loadContent("pages/earthub-project.html");
    clearPageState();
    updateNavStyles("projects-link");
  } else if (
    path === "/elevator-sim-project" ||
    path === "/elevator-sim-project/"
  ) {
    loadContent("pages/elevator-sim-project.html");
    clearPageState();
    updateNavStyles("projects-link");
  } else if (path === "/misc-projects" || path === "/misc-projects/") {
    loadContent("pages/misc-projects.html");
    clearPageState();
    updateNavStyles("projects-link");
  } else if (event.state && event.state.projectUrl) {
    loadContent(event.state.projectUrl);
    storePageState(event.state.projectUrl);
    updateNavStyles(getActiveLinkId(event.state.projectUrl));
  } else {
    loadContent("pages/projects.html");
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
