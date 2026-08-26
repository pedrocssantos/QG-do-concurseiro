// ==========================================================================
// QG DO CONCURSEIRO - EDITAL BULK TEXT PARSER & HEURÍSTICA
// ==========================================================================
import { sanitizeText } from "./security";

export interface ParsedTopic {
  title: string;
}

export interface ParsedDisciplina {
  name: string;
  weight: number;
  color: string;
  icon: string;
  topicos: ParsedTopic[];
}

export interface ParsedEditalResult {
  title?: string;
  banca?: string;
  disciplinas: ParsedDisciplina[];
}

export class EditalBulkParser {
  private static DISCIPLINA_ICONS_COLORS: Record<string, { icon: string; color: string }> = {
    port: { icon: "fa-book", color: "#38BDF8" },
    lingua: { icon: "fa-book", color: "#38BDF8" },
    const: { icon: "fa-landmark", color: "#FBBF24" },
    adm: { icon: "fa-scale-balanced", color: "#34D399" },
    penal: { icon: "fa-gavel", color: "#F87171" },
    proc: { icon: "fa-gavel", color: "#F87171" },
    info: { icon: "fa-network-wired", color: "#22D3EE" },
    ti: { icon: "fa-code", color: "#22D3EE" },
    contab: { icon: "fa-calculator", color: "#A78BFA" },
    rlm: { icon: "fa-brain", color: "#F472B6" },
    mat: { icon: "fa-calculator", color: "#F472B6" },
    estat: { icon: "fa-chart-pie", color: "#F472B6" },
    trans: { icon: "fa-car-side", color: "#34D399" },
    fisic: { icon: "fa-atom", color: "#FBBF24" },
    crim: { icon: "fa-fingerprint", color: "#A78BFA" },
    dir: { icon: "fa-scale-balanced", color: "#34D399" },
    prev: { icon: "fa-shield-heart", color: "#34D399" },
    trib: { icon: "fa-coins", color: "#FBBF24" },
    leg: { icon: "fa-shield", color: "#FBBF24" },
    hum: { icon: "fa-hand-holding-heart", color: "#F472B6" }
  };

  public static inferIconAndColor(name: string): { icon: string; color: string } {
    const lower = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (const [key, val] of Object.entries(this.DISCIPLINA_ICONS_COLORS)) {
      if (lower.includes(key)) return val;
    }
    return { icon: "fa-book-open", color: "#38BDF8" };
  }

  public static cleanTopicTitle(raw: string): string {
    return sanitizeText(raw)
      .replace(/^[\s\-\*\•\⁃\◦\–\—\.\;]+/, "") // remove bullets e símbolos
      .replace(/^\d+([\.\-\)]\d+)*[\.\-\)]\s*/, "") // remove numeração tipo 1., 1.1, 1-
      .replace(/^Item\s+\d+[\.\:\-]?\s*/i, "")
      .replace(/[\;\.]$/, "") // remove ponto e vírgula final
      .replace(/\s+/g, " ")
      .trim();
  }

  public static parse(rawText: string): ParsedEditalResult {
    if (!rawText || !rawText.trim()) {
      return { disciplinas: [] };
    }

    const lines = rawText.split(/\r?\n/);
    const disciplinas: ParsedDisciplina[] = [];
    let currentDisc: ParsedDisciplina | null = null;
    const fallbackTopics: ParsedTopic[] = [];

    const isHeaderLine = (line: string): boolean => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      if (/^(?:disciplina|matéria|materia|bloco|módulo|modulo|conteúdo|conteudo)\s*[:\-]/i.test(trimmed)) return true;
      if (/^#{1,3}\s+/.test(trimmed)) return true;
      if (/(?:peso|weight|p)[\s:]*[1-5]/i.test(trimmed) && trimmed.length < 80) return true;
      
      // Linha curta em caixa alta sem ponto final extenso
      const withoutSymbols = trimmed.replace(/[^a-zA-ZáéíóúÁÉÍÓÚãõÃÕâêîôûÂÊÎÔÛçÇ\s]/g, "").trim();
      if (withoutSymbols.length >= 4 && withoutSymbols.length <= 60 && withoutSymbols === withoutSymbols.toUpperCase() && !trimmed.includes(".")) {
        return true;
      }
      return false;
    };

    const extractWeight = (line: string): number => {
      const match = line.match(/(?:peso|weight|p)[\s:]*([1-5])/i) || 
                    line.match(/\((?:peso\s*)?([1-5])\)/i) || 
                    line.match(/\[(?:peso\s*)?([1-5])\]/i);
      return match ? parseInt(match[1], 10) : 3;
    };

    const cleanDiscName = (line: string): string => {
      return line
        .replace(/^#{1,3}\s*/, "")
        .replace(/^(?:disciplina|matéria|materia|bloco|módulo|modulo|conteúdo|conteudo)\s*[:\-]\s*/i, "")
        .replace(/\((?:peso\s*)?[1-5]\)/gi, "")
        .replace(/\[(?:peso\s*)?[1-5]\]/gi, "")
        .replace(/(?:peso|weight|p)[\s:]*[1-5]/gi, "")
        .replace(/[:\-]+$/, "")
        .trim();
    };

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();
      if (!trimmed) continue;

      if (isHeaderLine(trimmed)) {
        const discName = cleanDiscName(trimmed);
        if (discName.length > 1) {
          const weight = extractWeight(trimmed);
          const { icon, color } = this.inferIconAndColor(discName);
          currentDisc = {
            name: sanitizeText(discName),
            weight: weight >= 1 && weight <= 5 ? weight : 3,
            color,
            icon,
            topicos: []
          };
          disciplinas.push(currentDisc);
          continue;
        }
      }

      // Processamento de Tópicos (Inline Cebraspe ou Linha a Linha)
      const inlineCebraspePattern = /(?:^|\s)(?:\d+(?:\.\d+)*[\.\)\-]\s+)/g;
      const matches = Array.from(trimmed.matchAll(inlineCebraspePattern));

      if (matches.length >= 2) {
        const parts = trimmed.split(/(?=\s\d+(?:\.\d+)*[\.\)\-]\s+)/);
        for (const p of parts) {
          const clean = this.cleanTopicTitle(p);
          if (clean.length > 2) {
            if (currentDisc) currentDisc.topicos.push({ title: clean });
            else fallbackTopics.push({ title: clean });
          }
        }
      } else {
        const clean = this.cleanTopicTitle(trimmed);
        if (clean.length > 1) {
          if (currentDisc) {
            currentDisc.topicos.push({ title: clean });
          } else {
            fallbackTopics.push({ title: clean });
          }
        }
      }
    }

    if (fallbackTopics.length > 0) {
      if (disciplinas.length === 0) {
        const { icon, color } = this.inferIconAndColor("Geral");
        disciplinas.unshift({
          name: "Conteúdo Programático Geral",
          weight: 3,
          color,
          icon,
          topicos: fallbackTopics
        });
      } else {
        disciplinas[0].topicos.unshift(...fallbackTopics);
      }
    }

    return { disciplinas };
  }
}
