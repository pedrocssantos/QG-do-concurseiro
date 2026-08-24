// ==========================================================================
// FOCO NO PAPIRO - GAMIFICAÇÃO, RANKING SEMANAL E CONQUISTAS
// ==========================================================================

class GamificationManager {
  constructor() {}

  init() {
    this.renderLeaderboard();
    this.renderBadgesGrid();
    this.renderLevelProgress();
  }

  renderLeaderboard() {
    const tbody = document.getElementById("leaderboard-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    // Atualiza pontuação do usuário no ranking
    const profile = store.data.profile;
    const weekly = store.getWeeklyStats();
    const userWeeklyHours = weekly.hours.reduce((a, b) => a + b, 0);
    const userWeeklyQuestions = weekly.questions.reduce((a, b) => a + b, 0);

    const lb = store.data.leaderboard || [];
    const userEntry = lb.find(l => l.isUser);
    if (userEntry) {
      userEntry.hoursWeekly = Number(userWeeklyHours.toFixed(1));
      userEntry.questionsWeekly = userWeeklyQuestions;
      userEntry.xp = profile.xp;
    }

    // Ordena por XP
    lb.sort((a, b) => b.xp - a.xp);

    lb.forEach((user, idx) => {
      const rankPos = idx + 1;
      const tr = document.createElement("tr");
      tr.className = `leaderboard-row ${user.isUser ? "user-row" : ""}`;

      let posBadge = `<span class="rank-num">${rankPos}</span>`;
      if (rankPos === 1) posBadge = `<span class="medal-gold"><i class="fa-solid fa-trophy"></i> 1º</span>`;
      else if (rankPos === 2) posBadge = `<span class="medal-silver"><i class="fa-solid fa-medal"></i> 2º</span>`;
      else if (rankPos === 3) posBadge = `<span class="medal-bronze"><i class="fa-solid fa-medal"></i> 3º</span>`;

      tr.innerHTML = `
        <td class="text-center">${posBadge}</td>
        <td>
          <div class="user-cell">
            <div class="user-avatar-circle ${user.isUser ? 'avatar-user' : ''}">${user.avatar || 'U'}</div>
            <div class="user-info-text">
              <strong>${user.name} ${user.isUser ? '(Você)' : ''}</strong>
              <span class="user-badge-tag">${user.badge || 'Guerreiro'}</span>
            </div>
          </div>
        </td>
        <td class="text-center"><strong>${user.hoursWeekly}h</strong></td>
        <td class="text-center">${user.questionsWeekly}</td>
        <td class="text-center">
          <span class="acc-pill ${user.accuracy >= 85 ? 'acc-high' : 'acc-normal'}">${user.accuracy}%</span>
        </td>
        <td class="text-right">
          <span class="xp-val"><i class="fa-solid fa-bolt text-warning"></i> ${user.xp} XP</span>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  renderBadgesGrid() {
    const container = document.getElementById("badges-grid-container");
    if (!container) return;
    container.innerHTML = "";

    const badges = store.data.badges || [];

    badges.forEach(b => {
      const card = document.createElement("div");
      card.className = `badge-card ${b.unlocked ? "unlocked" : "locked"}`;

      card.innerHTML = `
        <div class="badge-icon-box">
          <i class="fa-solid ${b.icon}"></i>
        </div>
        <div class="badge-content">
          <h4>${b.title}</h4>
          <p>${b.desc}</p>
          <div class="badge-status-footer">
            ${b.unlocked ? `
              <span class="badge-date"><i class="fa-solid fa-circle-check"></i> Desbloqueada em ${b.date || 'Recente'}</span>
            ` : `
              <span class="badge-locked-text"><i class="fa-solid fa-lock"></i> Bloqueada</span>
            `}
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  renderLevelProgress() {
    const profile = store.data.profile;
    const currentLvl = profile.level || 1;
    const currentXp = profile.xp || 0;
    
    // XP necessário para o próximo nível
    const currentLvlBaseXp = Math.pow(currentLvl - 1, 2) * 100;
    const nextLvlXp = Math.pow(currentLvl, 2) * 100;
    const xpInLevel = Math.max(0, currentXp - currentLvlBaseXp);
    const xpRange = nextLvlXp - currentLvlBaseXp || 1;
    const percent = Math.min(100, Math.round((xpInLevel / xpRange) * 100));

    const progressFill = document.getElementById("level-progress-fill");
    const progressLabel = document.getElementById("level-progress-label");
    const currentRankLabel = document.getElementById("level-current-rank-title");

    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressLabel) progressLabel.textContent = `${currentXp} / ${nextLvlXp} XP (${percent}%)`;
    if (currentRankLabel) currentRankLabel.textContent = store.getRankTitle(currentLvl);
  }
}

const gamificationManager = new GamificationManager();
