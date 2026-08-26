<template>
  <div class="flashcards-vue-container">
    <!-- Cabeçalho da Seção -->
    <div class="view-header">
      <div class="view-title-group">
        <h1><i class="fa-solid fa-layer-group text-primary"></i> Flashcards com Repetição Espaçada (SRS)</h1>
        <p>Fixe conceitos com o algoritmo SuperMemo SM-2. Quanto melhor a lembrança, mais longe o próximo intervalo.</p>
      </div>
      <div class="view-header-actions" style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn btn-secondary btn-sm" @click="openImportModal" title="Importar cards do Anki, CSV ou texto em lote">
          <i class="fa-solid fa-file-import"></i> Importar (Anki / CSV)
        </button>
        <button class="btn btn-primary btn-sm" @click="openNewCardModal">
          <i class="fa-solid fa-plus"></i> Novo Flashcard
        </button>
      </div>
    </div>

    <div class="flashcards-layout">
      <!-- Barra de Modo de Revisão SRS -->
      <div class="srs-mode-bar" style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px 16px; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="badge" style="background: var(--color-accent-tint); color: var(--color-accent); border: 1px solid rgba(126,161,114,0.35); font-family: var(--font-mono); font-size: var(--text-2xs); font-weight: 800; padding: 4px 10px; border-radius: var(--radius-xs);">
            <i class="fa-solid fa-fire"></i> {{ dueTodayCount }} cards devidos hoje
          </span>
          <span style="font-size: var(--text-xs); color: var(--text-muted);">
            {{ showAllCardsMode ? 'Modo Livre (Praticando todos os flashcards)' : 'Fila Inteligente SM-2 (Apenas cards para revisar hoje)' }}
          </span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button 
            class="btn btn-sm" 
            :class="!showAllCardsMode ? 'btn-primary' : 'btn-secondary'"
            @click="showAllCardsMode = false; currentIndex = 0;"
          >
            <i class="fa-solid fa-calendar-day"></i> Fila do Dia ({{ dueTodayCount }})
          </button>
          <button 
            class="btn btn-sm" 
            :class="showAllCardsMode ? 'btn-primary' : 'btn-secondary'"
            @click="showAllCardsMode = true; currentIndex = 0;"
          >
            <i class="fa-solid fa-book-open"></i> Modo Livre ({{ totalCardsCount }})
          </button>
        </div>
      </div>

      <!-- Seletor de Decks (Disciplinas) -->
      <div class="deck-chips-container">
        <button 
          class="deck-chip" 
          :class="{ active: selectedDeckId === 'all' }"
          @click="selectDeck('all')"
        >
          <i class="fa-solid fa-layer-group"></i> Todos os Decks
          <span class="deck-badge" :class="{ 'badge-due': dueTodayCount > 0 }">{{ showAllCardsMode ? totalCardsCount : dueTodayCount }}</span>
        </button>

        <button 
          v-for="deck in decks" 
          :key="deck.id"
          class="deck-chip"
          :class="{ active: selectedDeckId === deck.id }"
          @click="selectDeck(deck.id)"
        >
          <i class="fa-solid" :class="deck.icon || 'fa-book'"></i> {{ deck.name }}
          <span class="deck-badge" :class="{ 'badge-due': deck.dueCount > 0 }">{{ showAllCardsMode ? deck.count : deck.dueCount }}</span>
        </button>
      </div>

      <!-- Palco do Card 3D -->
      <div v-if="currentCard" class="flashcard-main-container">
        <div class="flashcard-stage" @click="flipCard">
          <div class="flashcard-3d-box" :class="{ flipped: isFlipped }">
            <div class="flashcard-inner">
              
              <!-- Frente do Card -->
              <div class="flashcard-front">
                <div class="fc-card-header">
                  <span class="fc-tag">{{ currentDeckName }}</span>
                  <span class="fc-counter">Card {{ currentIndex + 1 }} de {{ activeDeckCards.length }}</span>
                </div>
                <div class="fc-card-content">
                  {{ currentCard.frente }}
                </div>
                <div class="fc-card-footer">
                  <i class="fa-solid fa-hand-pointer"></i> Clique ou pressione [Espaço] para revelar
                </div>
                <div class="fc-due-info" v-if="currentCard.dueDate">
                  <i class="fa-regular fa-calendar-check"></i>
                  {{ formatDueDate(currentCard) }}
                </div>
              </div>

              <!-- Verso do Card -->
              <div class="flashcard-back">
                <div class="fc-card-header">
                  <span class="fc-tag fc-tag-success"><i class="fa-solid fa-circle-check"></i> Resposta & Fundamento</span>
                  <span class="fc-counter">Card {{ currentIndex + 1 }} de {{ activeDeckCards.length }}</span>
                </div>
                <div class="fc-card-content">
                  {{ currentCard.verso }}
                </div>
                <div class="fc-card-footer">
                  Classifique sua lembrança abaixo:
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Ações do Card (Virar & Excluir & Áudio TTS) -->
        <div class="flashcard-actions-wrapper">
          <div class="fc-flip-btn-row">
            <button class="btn btn-secondary" @click="flipCard">
              <i class="fa-solid fa-arrows-rotate"></i> {{ isFlipped ? 'Ocultar Resposta' : 'Virar Cartão (Espaço)' }}
            </button>
            <button class="btn btn-outline-primary btn-sm" @click="speakCardText" title="Ouvir Pergunta e Resposta em Voz Alta">
              <i class="fa-solid fa-volume-high"></i> Voz
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="deleteCurrentCard" title="Excluir este Flashcard">
              <i class="fa-solid fa-trash-can"></i> Excluir
            </button>
          </div>

          <!-- Botões de Classificação SM-2 (Revelados ao virar o card) -->
          <div v-if="isFlipped" class="fc-grade-grid">
            <button class="fc-grade-btn btn-grade-0" @click="rateCard(0)">
              <span class="grade-title">🔴 Errei</span>
              <span class="grade-sub">Revisar em {{ previewInterval(0) }}</span>
            </button>
            <button class="fc-grade-btn btn-grade-3" @click="rateCard(3)">
              <span class="grade-title">🟠 Difícil</span>
              <span class="grade-sub">Revisar em {{ previewInterval(3) }}</span>
            </button>
            <button class="fc-grade-btn btn-grade-4" @click="rateCard(4)">
              <span class="grade-title">🟢 Bom</span>
              <span class="grade-sub">Revisar em {{ previewInterval(4) }}</span>
            </button>
            <button class="fc-grade-btn btn-grade-5" @click="rateCard(5)">
              <span class="grade-title">🔵 Fácil</span>
              <span class="grade-sub">Revisar em {{ previewInterval(5) }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Estado Vazio (Todos os cards revisados) -->
      <div v-else class="empty-state-box">
        <div class="empty-icon-circle">
          <i class="fa-solid fa-circle-check text-success"></i>
        </div>
        <h3>Todos os cards deste deck foram revisados!</h3>
        <p>Excelente disciplina! Retorne no prazo programado para a próxima rodada de repetição espaçada.</p>
        <button class="btn btn-secondary btn-sm" style="margin-top: 14px;" @click="resetDueFilter">
          <i class="fa-solid fa-rotate-left"></i> Modo Livre (Praticar Todos)
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { store } from '../services/store';
import { showToast } from '../app';
import type { Flashcard } from '../types';

const selectedDeckId = ref<string>('all');
const currentIndex = ref<number>(0);
const isFlipped = ref<boolean>(false);
const showAllCardsMode = ref<boolean>(false);
const storeVersion = ref<number>(0);

// Concurso ativo e disciplinas
const activeConcurso = computed(() => {
  storeVersion.value;
  return store.getActiveConcurso();
});

const decks = computed(() => {
  storeVersion.value;
  const cards: any[] = store.data?.flashcards || [];
  const activeDisc = activeConcurso.value?.disciplinas || [];
  const today = store.getLocalDateString();

  const deckMap = new Map<string, { id: string; name: string; icon: string; count: number; dueCount: number }>();

  // 1. Adiciona as matérias do concurso ativo
  activeDisc.forEach(d => {
    const discCards = cards.filter(c => c.disciplinaId === d.id);
    const dueCards = discCards.filter(c => !c.dueDate || c.dueDate <= today);
    deckMap.set(d.id, {
      id: d.id,
      name: d.name,
      icon: d.icon || 'fa-book',
      count: discCards.length,
      dueCount: dueCards.length
    });
  });

  // 2. Adiciona outros decks com cards cadastrados
  cards.forEach(c => {
    if (!deckMap.has(c.disciplinaId)) {
      const discCards = cards.filter(card => card.disciplinaId === c.disciplinaId);
      const dueCards = discCards.filter(card => !card.dueDate || card.dueDate <= today);
      deckMap.set(c.disciplinaId, {
        id: c.disciplinaId,
        name: c.disciplinaName || c.disciplinaId,
        icon: 'fa-book',
        count: discCards.length,
        dueCount: dueCards.length
      });
    }
  });

  return Array.from(deckMap.values());
});

const totalCardsCount = computed(() => {
  storeVersion.value;
  return (store.data?.flashcards || []).length;
});

const dueTodayCount = computed(() => {
  storeVersion.value;
  const cards: any[] = store.data?.flashcards || [];
  const today = store.getLocalDateString();
  return cards.filter(c => !c.dueDate || c.dueDate <= today).length;
});

// Cards filtrados por deck e agendamento
const activeDeckCards = computed(() => {
  storeVersion.value;
  const cards: Flashcard[] = store.data?.flashcards || [];
  const today = store.getLocalDateString();

  let filtered = cards;
  if (selectedDeckId.value !== 'all') {
    filtered = filtered.filter(c => c.disciplinaId === selectedDeckId.value);
  }

  if (!showAllCardsMode.value) {
    const dueCards = filtered.filter(c => !c.dueDate || c.dueDate <= today);
    return dueCards.length > 0 ? dueCards : [];
  }

  return filtered;
});

const currentCard = computed<Flashcard | null>(() => {
  if (activeDeckCards.value.length === 0) return null;
  const idx = Math.min(currentIndex.value, activeDeckCards.value.length - 1);
  return activeDeckCards.value[idx] || null;
});

const currentDeckName = computed(() => {
  if (!currentCard.value) return 'Geral';
  const d = (activeConcurso.value?.disciplinas || []).find(disc => disc.id === currentCard.value?.disciplinaId);
  return d ? d.name : (currentCard.value?.disciplinaId || 'Geral');
});

function previewInterval(quality: number): string {
  if (!currentCard.value) return '';
  const card = currentCard.value;
  let ef = card.easeFactor || 2.5;
  let interval = card.interval || 1;
  let reps = card.repetitions || 0;
  
  if (quality < 3) {
    return '< 1 dia';
  }
  
  // SM-2 calculation preview
  ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  if (reps === 0) interval = 1;
  else if (reps === 1) interval = 6;
  else interval = Math.round(interval * ef);
  
  if (interval === 1) return '1 dia';
  if (interval < 7) return `${interval} dias`;
  if (interval < 30) return `${Math.round(interval / 7)} semana(s)`;
  return `${Math.round(interval / 30)} mês(es)`;
}

function formatDueDate(card: Flashcard): string {
  if (!card.dueDate) return 'Nova';
  const today = store.getLocalDateString();
  if (card.dueDate <= today) return '📌 Revisão pendente!';
  
  const due = new Date(card.dueDate + 'T12:00:00');
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Próxima revisão: amanhã';
  if (diffDays < 7) return `Próxima revisão: ${diffDays} dias`;
  return `Próxima revisão: ${card.dueDate}`;
}

function selectDeck(deckId: string) {
  selectedDeckId.value = deckId;
  currentIndex.value = 0;
  isFlipped.value = false;
  showAllCardsMode.value = false;
}

function flipCard() {
  isFlipped.value = !isFlipped.value;
}

function resetDueFilter() {
  showAllCardsMode.value = true;
  currentIndex.value = 0;
  isFlipped.value = false;
}

function rateCard(quality: number) {
  if (!currentCard.value) return;

  const cardId = currentCard.value.id;
  store.reviewFlashcard(cardId, quality);

  isFlipped.value = false;

  if (currentIndex.value >= activeDeckCards.value.length - 1) {
    currentIndex.value = 0;
  } else {
    currentIndex.value++;
  }

  const updatedCard = store.data.flashcards.find(c => c.id === cardId);
  const nextReview = updatedCard ? formatDueDate(updatedCard) : 'agendada';
  showToast(`Card classificado! ${nextReview}`, 'success');
}

function deleteCurrentCard() {
  if (!currentCard.value) return;
  if (confirm('Deseja realmente excluir este flashcard?')) {
    store.deleteFlashcard(currentCard.value.id);
    isFlipped.value = false;
    currentIndex.value = 0;
    showToast('Flashcard excluído com sucesso.', 'info');
  }
}

function speakCardText() {
  if (!('speechSynthesis' in window) || !currentCard.value) {
    showToast('Síntese de voz não suportada neste navegador.', 'warning');
    return;
  }
  window.speechSynthesis.cancel();
  const textToSpeak = isFlipped.value 
    ? `${currentCard.value.frente}. Resposta: ${currentCard.value.verso}`
    : currentCard.value.frente;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = 'pt-BR';
  utterance.rate = 1.05;
  window.speechSynthesis.speak(utterance);
}

function openImportModal() {
  const modal = document.getElementById('modal-import-flashcards') as HTMLDialogElement | null;
  if (modal) {
    const select = document.getElementById('import-fc-disciplina') as HTMLSelectElement | null;
    if (select) {
      select.innerHTML = '';
      const concurso = store.getActiveConcurso();
      (concurso?.disciplinas || []).forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.name;
        select.appendChild(opt);
      });
    }
    modal.showModal();
  }
}

function openNewCardModal() {
  const modal = document.getElementById('modal-new-flashcard') as HTMLDialogElement | null;
  if (modal) {
    const select = document.getElementById('new-fc-disciplina') as HTMLSelectElement | null;
    if (select) {
      select.innerHTML = '';
      const concurso = store.getActiveConcurso();
      (concurso?.disciplinas || []).forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.name;
        select.appendChild(opt);
      });
    }
    modal.showModal();
  }
}

// Atalhos de teclado (Espaço e 1-5)
function handleKeydown(e: KeyboardEvent) {
  const activeView = document.getElementById('view-flashcards');
  if (!activeView || activeView.classList.contains('hidden')) return;

  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

  if (e.code === 'Space') {
    e.preventDefault();
    flipCard();
  } else if (isFlipped.value) {
    if (e.key === '1' || e.key === '0') rateCard(0);
    else if (e.key === '2' || e.key === '3') rateCard(3);
    else if (e.key === '4') rateCard(4);
    else if (e.key === '5') rateCard(5);
  }
}

let unsubscribeStore: (() => void) | null = null;

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  unsubscribeStore = store.subscribe(() => {
    storeVersion.value++;
  });
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (unsubscribeStore) unsubscribeStore();
});
</script>

<style scoped>
.flashcards-vue-container {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.flashcards-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.deck-chips-container {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
}

.flashcard-main-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flashcard-stage {
  perspective: 1200px;
  width: 100%;
  max-width: 640px;
  min-height: 360px;
  margin: 0 auto;
}

.flashcard-actions-wrapper {
  width: 100%;
  max-width: 640px;
  margin: 20px auto 0;
}

.fc-flip-btn-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 14px;
}

.fc-grade-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 100%;
}

@media (max-width: 640px) {
  .fc-grade-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.fc-tag-success {
  background: rgba(126, 161, 114, 0.18) !important;
  color: var(--color-accent) !important;
  border: 1px solid rgba(126, 161, 114, 0.3) !important;
}

.empty-icon-circle {
  font-size: 3rem;
  margin-bottom: 12px;
}

.flashcard-3d-box.flipped .flashcard-inner {
  transform: rotateY(180deg);
}

.grade-title {
  font-weight: 700;
  font-size: 0.85rem;
}

.grade-sub {
  font-size: 0.72rem;
  opacity: 0.8;
}

.fc-due-info {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
