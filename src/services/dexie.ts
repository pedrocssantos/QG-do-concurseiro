// ==========================================================================
// QG DO CONCURSEIRO - DEXIE.JS (INDEXEDDB WRAPPER & MIGRATION ENGINE)
// ==========================================================================
import Dexie from "dexie";

class QGDatabase extends Dexie {
  constructor() {
    super("QGConcurseiroDB");

    this.version(1).stores({
      state: "key", // key-value store para snapshot do app state
      study_sessions: "id, disciplinaId, date, timestamp",
      question_attempts: "id, questionId, isCorrect, mode, timestamp",
      user_errors: "id, questionId, reason, resolved",
      flashcards_progress: "id, cardId, dueDate",
      custom_questions: "id, disciplinaId, tipo",
      custom_flashcards: "id, disciplinaId"
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

            // 1. Salva snapshot completo no store 'state'
            await this.state.put({ key: "app_state", data: legacyData, updated_at: Date.now() });

            // 2. Popula tabelas relacionais locais
            if (Array.isArray(legacyData.studySessions)) {
              await this.study_sessions.bulkPut(legacyData.studySessions);
            }
            if (Array.isArray(legacyData.questionHistory)) {
              await this.question_attempts.bulkPut(legacyData.questionHistory);
            }
            if (Array.isArray(legacyData.cadernoErros)) {
              await this.user_errors.bulkPut(legacyData.cadernoErros);
            }

            console.log(`✅ Migração concluída: ${legacyData.studySessions?.length || 0} sessões, ${legacyData.questionHistory?.length || 0} questões copiadas para IndexedDB.`);
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
      await this.state.put({
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
      const record = await this.state.get("app_state");
      return record ? record.data : null;
    } catch (e) {
      console.warn("Aviso ao carregar do IndexedDB:", e);
      return null;
    }
  }
}

const localDB = new QGDatabase();
export { QGDatabase, localDB };

if (typeof window !== "undefined") {
  window.localDB = localDB;
}
