// Content Loading and Navigation
function loadContent(url) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("main-content").innerHTML = html;
      // Add tilt effect listeners after content is loaded
      addTiltEffectListeners();
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

// Store the current page state in localStorage
function storePageState(state) {
  localStorage.setItem("currentPage", state);
}

// Load the stored page state from localStorage
function loadPageState() {
  return localStorage.getItem("currentPage");
}

// Load default content (Projects) on page load if no state is stored
window.addEventListener("load", () => {
  const currentPage = loadPageState();
  if (currentPage === "#about") {
    loadContent("about.html");
    updateNavStyles("about-link");
  } else {
    loadContent("projects.html");
    updateNavStyles("projects-link");
  }
  // Add tilt effect listeners after initial content load
  addTiltEffectListeners();
});

// Handle navigation clicks
document.getElementById("projects-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContent("projects.html");
  updateNavStyles("projects-link");
  history.pushState(null, "", "#projects");
  storePageState("#projects");
});

document.getElementById("about-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContent("about.html");
  updateNavStyles("about-link");
  history.pushState(null, "", "#about");
  storePageState("#about");
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
  }
});

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

// Add tilt effect listeners after content is loaded dynamically
window.addEventListener("load", () => {
  addTiltEffectListeners();
});

// Function to load project data
function loadProjectData(projectId) {
  fetch("projects.json")
    .then((response) => response.json())
    .then((data) => {
      const project = data.find((p) => p.id === projectId);
      if (project) {
        document.getElementById("project-title").textContent = project.title;
        document.getElementById("project-subtitle").textContent =
          project.subtitle;
        document.getElementById("project-duration").textContent =
          project.duration;
        document.getElementById("project-brief").textContent = project.brief;
        document.getElementById("project-outcome").textContent =
          project.outcome;

        // Populate responsibilities
        const responsibilitiesList = document.getElementById(
          "project-responsibilities"
        );
        responsibilitiesList.innerHTML = project.responsibilities
          .map((item) => `<li>${item}</li>`)
          .join("");

        // Populate technologies
        const technologiesList = document.getElementById(
          "project-technologies"
        );
        technologiesList.innerHTML = project.technologies
          .map((item) => `<li>${item}</li>`)
          .join("");
      } else {
        console.error("Project not found");
      }
    })
    .catch((error) => {
      console.error("Error loading project data:", error);
    });
}

// Load project data based on URL parameter
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");
  if (projectId) {
    loadProjectData(projectId);
  } else {
    console.error("No project ID provided");
  }
});
