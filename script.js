// Content Loading and Navigation
function loadContent(url) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      // Load the fetched HTML into the #main-content section
      document.getElementById("main-content").innerHTML = html;

      // If the loaded content is project-template.html, load project details
      if (url.includes("project-template.html")) {
        loadProjectDetails();
      } else {
        // Otherwise, add event listeners to project links
        addProjectLinkListeners();
      }

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
  loadContent(projectUrl); // Load the project-template.html content
  history.pushState(null, "", projectUrl); // Update the URL
  storePageState(projectUrl); // Store the page state
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

// Load default content (Projects) on page load if no state is stored
window.addEventListener("load", () => {
  const currentPage = loadPageState();
  if (currentPage === "#about") {
    loadContent("about.html");
    updateNavStyles("about-link");
  } else {
    loadContent("projects.html");
    updateNavStyles("projects-link");
    addProjectLinkListeners(); // Add listeners for project links
  }
  addTiltEffectListeners(); // Add tilt effect listeners after initial content load
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

// Function to get the query parameter from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to load project details from projects.json
function loadProjectDetails() {
  const projectId = getQueryParam("id");

  // Fetch the project data from projects.json
  fetch("data/projects.json")
    .then((response) => response.json())
    .then((projects) => {
      // Find the project with the matching ID
      const project = projects.find((p) => p.id === projectId);

      if (project) {
        // Populate the project details in the HTML
        document.getElementById("project-title").textContent = project.title;
        document.getElementById("project-duration").textContent = project.duration;
        document.getElementById("project-brief").textContent = project.brief;

        const responsibilitiesList = document.getElementById(
          "project-responsibilities"
        );
        responsibilitiesList.innerHTML = project.responsibilities
          .map((responsibility) => `<li>${responsibility}</li>`)
          .join("");

        const technologiesList = document.getElementById(
          "project-technologies"
        );
        technologiesList.innerHTML = project.technologies
          .map((technology) => `<li>${technology}</li>`)
          .join("");

        document.getElementById("project-outcome").textContent = project.outcome;
      } else {
        // If the project is not found, display an error message
        document.getElementById("project-details").innerHTML =
          "<p>Project not found.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching project data:", error);
      document.getElementById("project-details").innerHTML =
        "<p>Error loading project details.</p>";
    });
}

// Call the function to load project details when the page loads
window.addEventListener("load", loadProjectDetails);