// ==========================================================================
// QG DO CONCURSEIRO - MOTOR DE GRÁFICOS CHART.JS (ANALYTICS)
// ==========================================================================
import Chart from "chart.js/auto";

// Mapa de instâncias ativas para permitir destruição e re-renderização limpa
const activeCharts: Record<string, any> = {};

class PapiroCharts {
  static getThemeColors() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    return {
      isLight,
      gridLine: isLight ? "rgba(5, 16, 20, 0.08)" : "rgba(249, 249, 251, 0.08)",
      textMain: isLight ? "#051014" : "#F9F9FB",
      textMuted: isLight ? "#525866" : "#b0b4ba",
      textDimmed: isLight ? "#7e8695" : "#7d828a",
      tooltipBg: isLight ? "rgba(5, 16, 20, 0.92)" : "rgba(15, 23, 42, 0.95)",
      tooltipText: "#ffffff",
      radarGrid: isLight ? "rgba(5, 16, 20, 0.12)" : "rgba(249, 249, 251, 0.12)",
      radarBg: "rgba(77, 126, 168, 0.25)",
      primary: "#4D7EA8",
      accent: "#7EA172"
    };
  }

  static destroyExisting(canvasId: string) {
    if (activeCharts[canvasId]) {
      activeCharts[canvasId].destroy();
      delete activeCharts[canvasId];
    }
  }

  // 1. Gráfico de Linha / Área Suave (Horas Estudadas na Semana)
  static renderLineAreaChart(canvasId: string, labels: string[], data: number[], options = {}) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return;
    this.destroyExisting(canvasId);

    const theme = this.getThemeColors();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height || 220);
    gradient.addColorStop(0, "rgba(77, 126, 168, 0.45)");
    gradient.addColorStop(1, "rgba(77, 126, 168, 0.02)");

    activeCharts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels || [],
        datasets: [{
          label: "Horas Estudadas",
          data: data || [],
          borderColor: "#4D7EA8",
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: "#4D7EA8",
          pointBorderColor: theme.textMain,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: theme.tooltipBg,
            titleColor: theme.tooltipText,
            bodyColor: theme.tooltipText,
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => ` ${context.parsed.y}h líquidas`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: theme.textMuted, font: { family: "Inter", size: 11 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: theme.gridLine },
            ticks: {
              color: theme.textDimmed,
              font: { family: "Inter", size: 11 },
              callback: (val) => `${val}h`
            }
          }
        }
      }
    });
  }

  // 2. Gráfico de Barras (Questões Feitas por Disciplina)
  static renderBarChart(canvasId: string, items: any[], options = {}) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return;
    this.destroyExisting(canvasId);

    const theme = this.getThemeColors();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const labels = (items || []).map(it => it.label.length > 12 ? it.label.substring(0, 10) + "…" : it.label);
    const fullLabels = (items || []).map(it => it.label);
    const data = (items || []).map(it => it.value || 0);
    const colors = (items || []).map(it => it.color || "#4D7EA8");

    activeCharts[canvasId] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Questões Resolvidas",
          data: data,
          backgroundColor: colors,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: theme.tooltipBg,
            titleColor: theme.tooltipText,
            bodyColor: theme.tooltipText,
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              title: (items) => fullLabels[items[0].dataIndex] || "",
              label: (context) => ` ${context.parsed.y} questões resolvidas`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: theme.textMuted, font: { family: "Inter", size: 11 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: theme.gridLine },
            ticks: { color: theme.textDimmed, font: { family: "Inter", size: 11 } }
          }
        }
      }
    });
  }

  // 3. Gráfico Donut (Distribuição de Tempo por Disciplina)
  static renderDonutChart(canvasId: string, items: any[], centerText = "") {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return;
    this.destroyExisting(canvasId);

    const theme = this.getThemeColors();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const validItems = (items || []).filter(it => (it.value || 0) > 0);
    const labels = validItems.length > 0 ? validItems.map(it => it.label) : ["Sem estudos registrados"];
    const data = validItems.length > 0 ? validItems.map(it => it.value) : [1];
    const colors = validItems.length > 0 ? validItems.map(it => it.color || "#4D7EA8") : [theme.gridLine];

    activeCharts[canvasId] = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: theme.isLight ? "#ffffff" : "#051014",
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: validItems.length > 0,
            backgroundColor: theme.tooltipBg,
            titleColor: theme.tooltipText,
            bodyColor: theme.tooltipText,
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const mins = context.parsed;
                const hours = (mins / 60).toFixed(1);
                return ` ${hours}h (${mins} min)`;
              }
            }
          }
        }
      }
    });
  }

  // 4. Gráfico Radar (Domínio do Conteúdo por Disciplina)
  static renderRadarChart(canvasId: string, items: any[]) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return;
    this.destroyExisting(canvasId);

    const theme = this.getThemeColors();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const labels = (items || []).map(it => it.label.length > 12 ? it.label.substring(0, 10) + "…" : it.label);
    const fullLabels = (items || []).map(it => it.label);
    const data = (items || []).map(it => Math.max(0, Math.min(100, it.score || 50)));

    activeCharts[canvasId] = new Chart(ctx, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [{
          label: "% Domínio",
          data: data,
          backgroundColor: theme.radarBg,
          borderColor: "#4D7EA8",
          borderWidth: 2,
          pointBackgroundColor: "#7EA172",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 1.5,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: theme.tooltipBg,
            titleColor: theme.tooltipText,
            bodyColor: theme.tooltipText,
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              title: (items) => fullLabels[items[0].dataIndex] || "",
              label: (context) => ` Domínio: ${context.parsed.r}%`
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              display: false,
              stepSize: 25
            },
            grid: { color: theme.radarGrid },
            angleLines: { color: theme.radarGrid },
            pointLabels: {
              color: theme.textMain,
              font: { family: "Inter", size: 10, weight: 600 }
            }
          }
        }
      }
    });
  }

  // 5. Heatmap de Constância / Frequência de Estudos
  static renderConsistencyHeatmap(containerId, sessions) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    const sessionMap = {};
    (sessions || []).forEach(s => {
      sessionMap[s.date] = (sessionMap[s.date] || 0) + s.durationMinutes;
    });

    const today = new Date();
    const daysToShow = 70;
    const grid = document.createElement("div");
    grid.className = "heatmap-grid";

    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
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
}

export { PapiroCharts };
if (typeof window !== "undefined") {
  window.PapiroCharts = PapiroCharts;
}
