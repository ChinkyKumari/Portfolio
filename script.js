document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Sticky Navbar Scroll Effect
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");

  mobileToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Close Mobile Menu on Nav Link Click
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  // IntersectionObserver for Scroll Reveal Animations
  const observerOptions = {
    threshold: 0.1,
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });

  // Fetch Repositories dynamically from GitHub API
  fetchGitHubRepos("ChinkyKumari");
});

// Excluded repos that already appear in Selected Projects
const selectedRepoNames = [
  "django-project",
  "generative-chatbot",
  "simple-chatbot-with-basic-responses",
  "paint_application",
  "chatbot-assistant",
  "quiz_game_by_chinky",
  "c4ck",
  "javascript1.1"
];

async function fetchGitHubRepos(username) {
  const container = document.getElementById("github-repos-container");

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }

    const repos = await response.json();

    // Filter out duplicate repos present in Selected Projects
    const otherRepos = repos.filter(
      (repo) => !selectedRepoNames.includes(repo.name.toLowerCase())
    );

    if (otherRepos.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted);">No additional public repositories found.</p>`;
      return;
    }

    container.innerHTML = "";

    otherRepos.forEach((repo) => {
      const card = document.createElement("article");
      card.className = "repo-card reveal active";

      const updatedDate = new Date(repo.updated_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      card.innerHTML = `
        <div>
          <div class="project-header">
            <h3>${repo.name}</h3>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View on GitHub"><i data-lucide="github"></i></a>
          </div>
          <p class="project-desc">${repo.description || "No description provided."}</p>
        </div>
        <div>
          <div class="tech-tags">
            ${repo.language ? `<span>${repo.language}</span>` : ""}
            <span><i data-lucide="star" style="width:12px;height:12px;vertical-align:middle;"></i> ${repo.stargazers_count}</span>
            <span><i data-lucide="git-fork" style="width:12px;height:12px;vertical-align:middle;"></i> ${repo.forks_count}</span>
          </div>
          <p style="font-size:0.75rem; color:var(--text-muted);">Updated: ${updatedDate}</p>
        </div>
      `;

      container.appendChild(card);
    });

    if (window.lucide) {
      lucide.createIcons();
    }
  } catch (error) {
    console.error("Failed to fetch GitHub projects:", error);
    container.innerHTML = `<p style="color: var(--text-muted);">Unable to load additional GitHub repositories at this moment.</p>`;
  }
}