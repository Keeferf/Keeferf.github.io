// script.js

// --- Content Loading and Navigation ---
function loadContent(url) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("main-content").innerHTML = html;
    })
    .catch((error) => {
      console.error("Error loading content:", error);
    });
}

function updateNavStyles(selectedLinkId) {
  const navLinks = document.querySelectorAll(".header-right nav a");
  navLinks.forEach((link) => {
    if (link.id === selectedLinkId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Load default content (Projects) on page load
window.addEventListener("load", () => {
  loadContent("projects.html");
  updateNavStyles("projects-link");
  addProjectLinkListeners();
});

// Handle navigation clicks
document.getElementById("projects-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContent("projects.html");
  updateNavStyles("projects-link");
  history.pushState(null, "", "#projects");
  addProjectLinkListeners();
});

document.getElementById("about-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContent("about.html");
  updateNavStyles("about-link");
  history.pushState(null, "", "#about");
});

// Handle browser back/forward navigation
window.addEventListener("popstate", () => {
  const hash = window.location.hash;
  if (hash === "#about") {
    loadContent("about.html");
    updateNavStyles("about-link");
  } else {
    loadContent("projects.html");
    updateNavStyles("projects-link");
    addProjectLinkListeners();
  }
});

// Project Link Listeners
function addProjectLinkListeners() {
  document.querySelectorAll(".project-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const projectTitle = link.querySelector("h3").textContent;
      alert(`Redirecting to ${projectTitle} project page...`);
    });
  });
}
