  const GITHUB_API_URL = "https://api.github.com/users/wess-westley/repos?per_page=100&sort=updated";
    const GITHUB_HEADERS = {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    };

    // Add your deployment links here
    const DEPLOYMENT_LINKS = {
      // "repository-name": "https://your-deployment-link.com"
    };

    let githubRepos = [];

    async function fetchGitHubRepos() {
      try {
        const response = await fetch(GITHUB_API_URL, { headers: GITHUB_HEADERS });
        if (!response.ok) throw new Error("GitHub API error: " + response.status);
        const data = await response.json();
        githubRepos = data.filter(repo => !repo.fork && !repo.archived);
        renderGitHubPortfolio();
      } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        document.getElementById('github-content').innerHTML = '<div class="github-empty">Failed to load repositories</div>';
      }
    }

    function renderGitHubPortfolio() {
      const content = document.getElementById('github-content');
      content.innerHTML = '';

      // Group by language and create sections
      const reposByLang = {};
      githubRepos.forEach(repo => {
        const lang = repo.language || 'Other';
        if (!reposByLang[lang]) reposByLang[lang] = [];
        reposByLang[lang].push(repo);
      });

      Object.keys(reposByLang).forEach(lang => {
        const section = createGitHubSection(lang, reposByLang[lang]);
        content.appendChild(section);
      });
    }

    function createGitHubSection(title, repos) {
      const section = document.createElement('div');
      section.className = 'github-section';
      
      const heading = document.createElement('h2');
      heading.textContent = title;
      section.appendChild(heading);

      const carousel = document.createElement('div');
      carousel.className = 'github-carousel';
      
      const track = document.createElement('div');
      track.className = 'github-carousel-track';
      
      repos.forEach(repo => {
        track.appendChild(createGitHubCard(repo));
      });

      carousel.appendChild(track);
      section.appendChild(carousel);
      
      return section;
    }

    function createGitHubCard(repo) {
      const card = document.createElement('div');
      card.className = 'github-card';
      
      const deploymentLink = DEPLOYMENT_LINKS[repo.name] || repo.homepage;
      const hasDeployment = !!deploymentLink;

      card.innerHTML = `
        <div class="github-poster">
          <div class="github-badges">
            <div class="github-badge">
              <i class="far fa-star"></i> ${repo.stargazers_count}
            </div>
            <div class="github-badge">
              <i class="fas fa-code-branch"></i> ${repo.forks_count}
            </div>
            ${hasDeployment ? '<div class="github-badge live"><i class="fas fa-rocket"></i> Live</div>' : ''}
          </div>
        </div>
        <div class="github-card-content">
          <h3>${repo.name}</h3>
          <p>${repo.description || "No description provided."}</p>
          <div class="github-stats">
            <div class="github-language">
              <span>${repo.language || "N/A"}</span>
            </div>
            <span>${new Date(repo.updated_at).toLocaleDateString()}</span>
          </div>
          <div class="github-card-footer">
            <button class="github-btn github-btn-primary" onclick="window.open('${repo.html_url}', '_blank')">
              <i class="fab fa-github"></i> Code
            </button>
            <button class="github-btn ${hasDeployment ? 'github-btn-success' : 'github-btn-secondary'}" 
                    onclick="${hasDeployment ? `window.open('${deploymentLink}', '_blank')` : "alert('No deployment available')"}">
              <i class="fas fa-rocket"></i> Live Demo
            </button>
          </div>
        </div>
      `;
      
      return card;
    }

    // Initialize GitHub portfolio
    document.addEventListener('DOMContentLoaded', function() {
      fetchGitHubRepos();
    });