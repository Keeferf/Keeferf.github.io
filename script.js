// Disable browser's scroll restoration
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}

// Content Loading and Navigation
function loadContent(url) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      // Load the fetched HTML into the #main-content section
      document.getElementById("main-content").innerHTML = html;

      // Scroll to the top of the page after content is loaded
      window.scrollTo({ top: 0, behavior: "instant" });

      // Add event listeners to project links (if any)
      addProjectLinkListeners();

      // Add tilt effect listeners after content is loaded
      addTiltEffectListeners();
    })
    .catch((error) => {
      console.error("Error loading content:", error);
    });
}

// Function to handle project link clicks
function handleProjectLinkClick(e) {
  e.preventDefault(); // Prevent default link behavior
  const projectUrl = e.currentTarget.getAttribute("href"); // Get the URL from the link

  // Load the content based on the URL
  loadContent(projectUrl);

  // Update the URL in the browser's address bar
  history.pushState({ projectUrl }, "", projectUrl);

  // Store the page state in localStorage
  storePageState(projectUrl);
}

// Add event listeners to project links
function addProjectLinkListeners() {
  const projectLinks = document.querySelectorAll(".project-link");
  projectLinks.forEach((link) => {
    link.addEventListener("click", handleProjectLinkClick);
  });
}

// Store the current page state in localStorage
function storePageState(state) {
  localStorage.setItem("currentPage", state);
}

// Load the stored page state from localStorage
function loadPageState() {
  return localStorage.getItem("currentPage");
}

// Clear the stored page state in localStorage
function clearPageState() {
  localStorage.removeItem("currentPage");
}

// Load default content (Projects) on page load if no state is stored
window.addEventListener("load", () => {
  const storedPage = loadPageState(); // Get the stored page state

  if (storedPage) {
    // If a page state is stored, load that page
    loadContent(storedPage);

    // Update the URL to match the stored state
    if (window.location.href !== storedPage) {
      history.replaceState({ projectUrl: storedPage }, "", storedPage);
    }
  } else {
    // Otherwise, load the default content (projects.html)
    loadContent("projects.html");

    // Force the URL to update to index.html#projects
    if (window.location.hash !== "#projects") {
      history.replaceState({}, "", "index.html#projects");
    }

    updateNavStyles("projects-link");
  }

  // Add tilt effect listeners after initial content load
  addTiltEffectListeners();
});

// Handle navigation clicks
document.getElementById("projects-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContent("projects.html");
  history.pushState({}, "", "index.html#projects"); // Update the URL
  clearPageState(); // Clear the stored project state
  updateNavStyles("projects-link");
});

document.getElementById("about-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContent("about.html");
  history.pushState({}, "", "index.html#about"); // Update the URL
  clearPageState(); // Clear the stored project state
  updateNavStyles("about-link");
});

// Handle browser back/forward navigation
window.addEventListener("popstate", (event) => {
  const url = window.location.hash; // Get the current hash

  if (url === "#projects") {
    loadContent("projects.html");
    clearPageState(); // Clear the stored project state
    updateNavStyles("projects-link");
  } else if (url === "#experience") {
    loadContent("experience.html");
    clearPageState(); // Clear the stored project state
    updateNavStyles("experience-link");
  } else if (url === "#about") {
    loadContent("about.html");
    clearPageState(); // Clear the stored project state
    updateNavStyles("about-link");
  } else if (event.state && event.state.projectUrl) {
    // If there's a project URL in the state, load that page
    loadContent(event.state.projectUrl);
    storePageState(event.state.projectUrl); // Store the project state
  } else {
    // Default to loading projects.html
    loadContent("projects.html");
    clearPageState(); // Clear the stored project state
    updateNavStyles("projects-link");
  }
});

// Clear localStorage when the website is closed or the tab is refreshed
window.addEventListener("beforeunload", () => {
  clearPageState(); // Clear the stored project state
});

// Function to update navigation styles
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

// Function to calculate the tilt based on mouse position
function applyTiltEffect(event, element) {
  const rect = element.getBoundingClientRect();
  const mouseX = event.clientX - rect.left; // X position within the element
  const mouseY = event.clientY - rect.top; // Y position within the element

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  // Increase the multiplier to increase the tilt angle
  const tiltMultiplier = 25; // Adjust this value to control the tilt angle

  // Calculate the tilt angles based on mouse position
  const tiltX = ((centerY - mouseY) / centerY) * tiltMultiplier; // Tilt up/down
  const tiltY = ((mouseX - centerX) / centerX) * tiltMultiplier; // Tilt left/right

  // Apply the tilt transform
  element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
  element.style.boxShadow = `0 10px 20px rgba(0, 0, 0, 0.2)`;
}

// Function to reset the tilt effect
function resetTiltEffect(element) {
  element.style.transform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  element.style.boxShadow = "none";
}

// Add event listeners to all images in watching-images and travel-images
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

// Ensure tilt effect listeners are added after content is loaded
document.addEventListener("DOMContentLoaded", () => {
  addTiltEffectListeners();
});
