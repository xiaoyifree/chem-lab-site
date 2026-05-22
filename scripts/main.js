const data = window.experimentData;

function renderLevels() {
  const container = document.getElementById("level-grid");

  container.innerHTML = data.levels
    .map((level) => {
      const badgeClass = {
        beginner: "badge-beginner",
        intermediate: "badge-intermediate",
        advanced: "badge-advanced"
      }[level.key];

      return `
        <article class="level-card">
          <span class="level-badge ${badgeClass}">${level.title}</span>
          <h3>${level.subtitle}</h3>
          <p>${level.goals}</p>
          <ul class="level-highlights">
            ${level.topics.map((topic) => `<li>${topic}</li>`).join("")}
          </ul>
        </article>
      `;
    })
    .join("");
}

function renderFeaturedExperiment() {
  const experiment = data.featured;
  const container = document.getElementById("featured-card");

  container.innerHTML = `
    <div class="featured-layout">
      <div class="reaction-demo" aria-hidden="true">
        <div class="bubble-stream">
          <span style="--x: 26%; --d: 2.8s;"></span>
          <span style="--x: 34%; --d: 2.3s;"></span>
          <span style="--x: 41%; --d: 3.1s;"></span>
          <span style="--x: 60%; --d: 2.6s;"></span>
          <span style="--x: 67%; --d: 3.3s;"></span>
        </div>
        <div class="precipitate-cloud">
          <span style="--x: 68%; --y: 52%;"></span>
          <span style="--x: 74%; --y: 58%;"></span>
          <span style="--x: 81%; --y: 49%;"></span>
        </div>
      </div>
      <div>
        <span class="level-badge badge-intermediate">${experiment.level}</span>
        <h3>${experiment.title}</h3>
        <p>${experiment.objective}</p>
        <ul class="featured-meta">
          <li>动画演示</li>
          <li>音效入口</li>
          <li>课后提问</li>
        </ul>
        <p><strong>现象：</strong>${experiment.observation}</p>
        <p><strong>方程式：</strong>${experiment.equation}</p>
        <p><strong>安全提示：</strong>${experiment.safety}</p>
        <ul class="featured-list">
          ${experiment.materials.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <p><strong>思考题：</strong>${experiment.quiz}</p>
      </div>
    </div>
  `;
}

function setupSoundToggle() {
  const button = document.getElementById("sound-toggle");
  let enabled = false;

  button.addEventListener("click", () => {
    enabled = !enabled;
    button.setAttribute("aria-pressed", String(enabled));
    button.textContent = `音效：${enabled ? "开启" : "关闭"}`;
  });
}

renderLevels();
renderFeaturedExperiment();
setupSoundToggle();
