// ==========================================================================
// QG DO CONCURSEIRO - ANALYTICS CHARTS (ESM)
// ==========================================================================
// ==========================================================================
// QG DO CONCURSEIRO - MOTOR DE GRÁFICOS EM CANVAS PURO (ANALYTICS)
// ==========================================================================

class PapiroCharts {
  static getThemeColors() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    return {
      isLight,
      gridLine: isLight ? "rgba(5, 16, 20, 0.08)" : "rgba(249, 249, 251, 0.08)",
      textMain: isLight ? "#051014" : "#F9F9FB",
      textMuted: isLight ? "#525866" : "#b0b4ba",
      textDimmed: isLight ? "#7e8695" : "#7d828a",
      textContrast: "#ffffff",
      emptyDonut: isLight ? "rgba(5, 16, 20, 0.06)" : "rgba(249, 249, 251, 0.08)",
      radarGrid: isLight ? "rgba(5, 16, 20, 0.12)" : "rgba(249, 249, 251, 0.1)",
      pointBorder: "#ffffff"
    };
  }

  static setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
  }

  // 1. Gráfico de Linha / Área Suave (Horas Estudadas na Semana)
  static renderLineAreaChart(canvasId, labels, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.setupCanvas(canvas);
    const theme = this.getThemeColors();

    const padding = { top: 25, right: 25, bottom: 40, left: 45 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    const maxValue = Math.max(...data, 4);
    const points = data.map((val, idx) => {
      const x = padding.left + (idx / (data.length - 1)) * chartW;
      const y = padding.top + chartH - (val / maxValue) * chartH;
      return { x, y, val, label: labels[idx] };
    });

    // Grid horizontal suave
    ctx.strokeStyle = theme.gridLine;
    ctx.lineWidth = 1;
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const labelVal = (maxValue * (1 - i / gridLines)).toFixed(1);
      ctx.fillStyle = theme.textDimmed;
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${labelVal}h`, padding.left - 8, y + 4);
    }

    if (points.length < 2) return;

    // Área com Gradiente
    const grad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    grad.addColorStop(0, "rgba(77, 126, 168, 0.4)");
    grad.addColorStop(1, "rgba(77, 126, 168, 0.01)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.lineTo(points[0].x, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Linha Principal
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = "#4D7EA8";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Pontos e Rótulos no eixo X
    points.forEach(pt => {
      // Ponto externo
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#4D7EA8";
      ctx.fill();
      ctx.strokeStyle = theme.pointBorder;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label X
      ctx.fillStyle = theme.textMuted;
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(pt.label, pt.x, height - 12);
    });
  }

  // 2. Gráfico de Barras (Questões Feitas por Disciplina / Desempenho)
  static renderBarChart(canvasId, items, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.setupCanvas(canvas);
    const theme = this.getThemeColors();

    const padding = { top: 25, right: 20, bottom: 45, left: 45 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);
    if (!items || items.length === 0) return;

    const maxVal = Math.max(...items.map(it => it.value), 20);
    const barWidth = Math.min(36, (chartW / items.length) * 0.55);
    const spacing = chartW / items.length;

    // Linhas horizontais
    ctx.strokeStyle = theme.gridLine;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const labelVal = Math.round(maxVal * (1 - i / 4));
      ctx.fillStyle = theme.textDimmed;
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${labelVal}`, padding.left - 8, y + 4);
    }

    items.forEach((it, idx) => {
      const x = padding.left + idx * spacing + (spacing - barWidth) / 2;
      const barH = (it.value / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      // Barra com cantos arredondados
      ctx.fillStyle = it.color || "#4D7EA8";
      this.drawRoundedRect(ctx, x, y, barWidth, Math.max(barH, 4), 6);
      ctx.fill();

      // Valor no topo da barra
      ctx.fillStyle = theme.textMain;
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${it.value}`, x + barWidth / 2, y - 6);

      // Nome da matéria truncado
      const shortName = it.label.length > 8 ? it.label.substring(0, 7) + "…" : it.label;
      ctx.fillStyle = theme.textMuted;
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText(shortName, x + barWidth / 2, height - 12);
    });
  }

  // 3. Gráfico Donut (Distribuição de Tempo Estudado por Disciplina)
  static renderDonutChart(canvasId, items, centerText = "") {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.setupCanvas(canvas);
    const theme = this.getThemeColors();

    ctx.clearRect(0, 0, width, height);
    if (!items || items.length === 0) return;

    const total = items.reduce((acc, it) => acc + (it.value || 0), 0);
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(centerX, centerY) - 15;
    const innerRadius = outerRadius * 0.65;

    let startAngle = -Math.PI / 2;

    if (total === 0) {
      // Donut vazio
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, innerRadius, Math.PI * 2, 0, true);
      ctx.fillStyle = theme.emptyDonut;
      ctx.fill();
    } else {
      items.forEach(it => {
        const sliceAngle = (it.value / total) * Math.PI * 2;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = it.color || "#4D7EA8";
        ctx.fill();

        startAngle = endAngle;
      });
    }

    // Texto no Centro
    const totalHours = (total / 60).toFixed(1);
    ctx.fillStyle = theme.textMain;
    ctx.font = "bold 16px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(centerText || `${totalHours}h Total`, centerX, centerY - 6);

    ctx.fillStyle = theme.textMuted;
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Horas Estudadas", centerX, centerY + 14);
  }

  // 4. Gráfico Radar (Domínio do Conteúdo por Disciplina)
  static renderRadarChart(canvasId, items) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.setupCanvas(canvas);
    const theme = this.getThemeColors();

    ctx.clearRect(0, 0, width, height);
    if (!items || items.length < 3) {
      ctx.fillStyle = theme.textDimmed;
      ctx.font = "12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Cadastre ao menos 3 matérias para o radar", width / 2, height / 2);
      return;
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 35;
    const totalSides = items.length;
    const angleStep = (Math.PI * 2) / totalSides;

    // Polígonos de Fundo (Grades)
    const levels = 4;
    ctx.strokeStyle = theme.radarGrid;
    ctx.lineWidth = 1;

    for (let lvl = 1; lvl <= levels; lvl++) {
      const r = (radius / levels) * lvl;
      ctx.beginPath();
      for (let i = 0; i < totalSides; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Eixos radiais
    for (let i = 0; i < totalSides; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Rótulos nos vértices
      const labelX = centerX + Math.cos(angle) * (radius + 18);
      const labelY = centerY + Math.sin(angle) * (radius + 18);
      ctx.fillStyle = theme.textMain;
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = Math.abs(Math.cos(angle)) < 0.3 ? "center" : (Math.cos(angle) > 0 ? "left" : "right");
      ctx.textBaseline = "middle";
      const shortName = items[i].label.length > 8 ? items[i].label.substring(0, 7) + "…" : items[i].label;
      ctx.fillText(shortName, labelX, labelY);
    }

    // Polígono de Dados do Aluno
    ctx.beginPath();
    items.forEach((it, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const score = Math.max(0, Math.min(100, it.score || 50)) / 100;
      const x = centerX + Math.cos(angle) * (radius * score);
      const y = centerY + Math.sin(angle) * (radius * score);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    ctx.fillStyle = "rgba(77, 126, 168, 0.25)";
    ctx.fill();
    ctx.strokeStyle = "#4D7EA8";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Vértices do Aluno
    items.forEach((it, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const score = Math.max(0, Math.min(100, it.score || 50)) / 100;
      const x = centerX + Math.cos(angle) * (radius * score);
      const y = centerY + Math.sin(angle) * (radius * score);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#4D7EA8";
      ctx.fill();
      ctx.strokeStyle = theme.pointBorder;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  // 5. Heatmap de Constância / Frequência de Estudos
  static renderConsistencyHeatmap(containerId, sessions) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    const sessionMap = {};
    sessions.forEach(s => {
      sessionMap[s.date] = (sessionMap[s.date] || 0) + s.durationMinutes;
    });

    const today = new Date();
    const daysToShow = 70; // 10 semanas
    const grid = document.createElement("div");
    grid.className = "heatmap-grid";

    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const mins = sessionMap[dateStr] || 0;

      let levelClass = "level-0";
      if (mins > 0 && mins < 60) levelClass = "level-1";
      else if (mins >= 60 && mins < 180) levelClass = "level-2";
      else if (mins >= 180 && mins < 300) levelClass = "level-3";
      else if (mins >= 300) levelClass = "level-4";

      const dayCell = document.createElement("div");
      dayCell.className = `heatmap-cell ${levelClass}`;
      dayCell.title = `${dateStr}: ${mins > 0 ? (mins / 60).toFixed(1) + "h de estudo" : "Sem estudos registrados"}`;
      grid.appendChild(dayCell);
    }

    container.appendChild(grid);
  }

  static drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

export { PapiroCharts };
if (typeof window !== "undefined") {
  window.PapiroCharts = PapiroCharts;
}
