// ==========================================================================
// QG DO CONCURSEIRO - DEXIE.JS (INDEXEDDB WRAPPER & MIGRATION ENGINE)
// ==========================================================================
import Dexie from "dexie";

class QGDatabase extends Dexie {
  isMigrated: boolean;

  constructor() {
    super("QGConcurseiroDB");
    this.isMigrated = false;

    this.version(1).stores({
      state: "key", // key-value store para snapshot do app state
      study_sessions: "id, disciplinaId, date, timestamp",
      question_attempts: "id, questionId, isCorrect, mode, timestamp",
      user_errors: "id, questionId, reason, resolved",
      flashcards_progress: "id, cardId, dueDate",
      custom_questions: "id, disciplinaId, tipo",
      custom_flashcards: "id, disciplinaId"
    });

    this.version(2).stores({
      state: "key",
      study_sessions: null,
      question_attempts: null,
      user_errors: null,
      flashcards_progress: null,
      custom_questions: null,
      custom_flashcards: null
    }).upgrade(async tx => {
      console.log("📦 Dexie V2: Consolidando tabelas relacionais em state blob...");
      
      const stateRecord = await tx.table("state").get("app_state");
      const appState = stateRecord ? stateRecord.data : {};
      let stateModified = false;

      // Migrate any relational data into the state blob before tables are dropped
      try {
        const studySessions = await tx.table("study_sessions").toArray();
        if (studySessions && studySessions.length > 0 && !appState.studySessions) {
          appState.studySessions = studySessions;
          stateModified = true;
        }
      } catch (e) {}

      try {
        const questionHistory = await tx.table("question_attempts").toArray();
        if (questionHistory && questionHistory.length > 0 && !appState.questionHistory) {
          appState.questionHistory = questionHistory;
          stateModified = true;
        }
      } catch (e) {}

      try {
        const cadernoErros = await tx.table("user_errors").toArray();
        if (cadernoErros && cadernoErros.length > 0 && !appState.cadernoErros) {
          appState.cadernoErros = cadernoErros;
          stateModified = true;
        }
      } catch (e) {}
      
      if (stateModified) {
        await tx.table("state").put({
          key: "app_state",
          data: appState,
          updated_at: Date.now()
        });
        console.log("✅ Dados das tabelas antigas integrados ao state blob.");
      }
    });

    this.isMigrated = false;
  }

  // Inicialização e Migração Não-Destrutiva do LocalStorage
  async init() {
    try {
      await this.open();
      const migrationFlag = localStorage.getItem("qg_indexeddb_migrated_v1");

      if (!migrationFlag) {
        console.log("📦 Primeira inicialização com IndexedDB. Iniciando migração segura do LocalStorage...");
        const legacyRaw = localStorage.getItem("foco_no_papiro_v1");

        if (legacyRaw) {
          try {
            const legacyData = JSON.parse(legacyRaw);

            if (legacyData && typeof legacyData === "object" && !Array.isArray(legacyData)) {
              // 1. Salva snapshot completo no store 'state'
              await this.table('state').put({ key: "app_state", data: legacyData, updated_at: Date.now() });
              console.log("✅ Migração concluída: Dados copiados para IndexedDB.");
            } else {
              console.warn("Estrutura do LocalStorage inválida. Migração abortada.");
            }
          } catch (parseErr) {
            console.warn("Aviso ao ler dados legados do LocalStorage:", parseErr);
          }
        }

        // Marca como migrado sem apagar o LocalStorage original (mantido como fallback seguro)
        localStorage.setItem("qg_indexeddb_migrated_v1", "true");
      }

      this.isMigrated = true;
    } catch (err) {
      console.error("Erro ao inicializar IndexedDB (Dexie):", err);
    }
  }

  // Salva o estado completo de forma assíncrona no IndexedDB
  async saveAppState(stateData) {
    if (!this.isOpen()) return;
    try {
      await this.table('state').put({
        key: "app_state",
        data: stateData,
        updated_at: Date.now()
      });
    } catch (e) {
      console.warn("Aviso ao salvar snapshot no IndexedDB:", e);
    }
  }

  // Carrega o estado do IndexedDB
  async loadAppState() {
    if (!this.isOpen()) return null;
    try {
      const record = await this.table('state').get("app_state");
      return record ? record.data : null;
    } catch (e) {
      console.warn("Aviso ao carregar do IndexedDB:", e);
      return null;
    }
  }

  // Retorna tamanho aproximado armazenado (útil para gerenciamento de quota)
  async getStorageStats() {
    if (!this.isOpen()) return { sizeBytes: 0, sizeMB: "0.00" };
    try {
      const record = await this.table('state').get("app_state");
      if (!record || !record.data) return { sizeBytes: 0, sizeMB: "0.00" };
      
      const sizeBytes = new Blob([JSON.stringify(record.data)]).size;
      return {
        sizeBytes,
        sizeMB: (sizeBytes / (1024 * 1024)).toFixed(2)
      };
    } catch (e) {
      console.warn("Erro ao calcular stats de storage:", e);
      return { sizeBytes: 0, sizeMB: "0.00" };
    }
  }
}

const localDB = new QGDatabase();
export { QGDatabase, localDB };

if (typeof window !== "undefined") {
  // @ts-ignore
  window.localDB = localDB;
}
