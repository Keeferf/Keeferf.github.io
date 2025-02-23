// script.js

// Function to load content dynamically
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

// Function to update navigation link styles
function updateNavStyles(selectedLinkId) {
  const navLinks = document.querySelectorAll(".header-right nav a");
  navLinks.forEach((link) => {
    if (link.id === selectedLinkId) {
      link.classList.add("active"); // Add active class for selected link
    } else {
      link.classList.remove("active"); // Remove active class for non-selected links
    }
  });
}

// Load default content (Projects) on page load
window.addEventListener("load", () => {
  loadContent("projects.html");
  updateNavStyles("projects-link"); // Highlight Projects tab by default

  // Add event listeners for project links after content is loaded
  addProjectLinkListeners();
});

// Handle navigation clicks
document.getElementById("projects-link").addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default link behavior
  loadContent("projects.html");
  updateNavStyles("projects-link"); // Highlight Projects tab
  history.pushState(null, "", "#projects"); // Update URL hash

  // Add event listeners for project links after content is loaded
  addProjectLinkListeners();
});

document.getElementById("about-link").addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default link behavior
  loadContent("about.html");
  updateNavStyles("about-link"); // Highlight About tab
  history.pushState(null, "", "#about"); // Update URL hash
});

// Handle browser back/forward navigation
window.addEventListener("popstate", () => {
  const hash = window.location.hash;
  if (hash === "#about") {
    loadContent("about.html");
    updateNavStyles("about-link"); // Highlight About tab
  } else {
    loadContent("projects.html");
    updateNavStyles("projects-link"); // Highlight Projects tab

    // Add event listeners for project links after content is loaded
    addProjectLinkListeners();
  }
});

// Function to add event listeners for project links
function addProjectLinkListeners() {
  document.querySelectorAll(".project-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default link behavior
      const projectTitle = link.querySelector("h3").textContent;
      alert(`Redirecting to ${projectTitle} project page...`);
      // You can replace the alert with actual redirection logic
      // window.location.href = 'your-project-page-url';
    });
  });
}
