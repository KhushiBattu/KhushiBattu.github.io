const USER = "KhushiBattu";
const API = `https://api.github.com/users/${USER}`;

async function loadGitHub() {
  try {
    const profile = await fetch(API).then(r => r.json());
    if (!profile || profile.message === "Not Found") throw new Error("GitHub profile not found");

    document.getElementById("profileName").textContent = profile.name || USER;
    document.getElementById("profileBio").textContent =
      profile.bio || "AI/ML · Software · Data";
    document.getElementById("publicRepos").textContent = profile.public_repos ?? "—";
    document.getElementById("followers").textContent = profile.followers ?? "—";

    const repos = await fetch(`${API}/repos?per_page=100&sort=updated`).then(r => r.json());
    if (Array.isArray(repos)) {
      document.getElementById("repoCount").textContent = repos.length;
      const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      const forks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
      document.getElementById("stars").textContent = stars;
      document.getElementById("forks").textContent = forks;

      const recent = repos.filter(r => !r.fork).slice(0, 5);
      const holder = document.getElementById("recentRepos");
      holder.innerHTML = recent.length ? recent.map(r => `
        <a class="repo-item" href="${r.html_url}" target="_blank" rel="noreferrer">
          <strong>${escapeHtml(r.name)}</strong>
          <span>${r.language || "Project"} · ★ ${r.stargazers_count || 0}</span>
        </a>
      `).join("") : "<p>No public repositories yet.</p>";
    }
  } catch (err) {
    document.getElementById("profileBio").textContent =
      "GitHub data could not be loaded right now.";
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

document.getElementById("year").textContent = new Date().getFullYear();
loadGitHub();
