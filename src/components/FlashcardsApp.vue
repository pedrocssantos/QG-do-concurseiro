<template>
  <div class="flashcards-vue-container">
    <!-- Cabeçalho da Seção -->
    <div class="view-header">
      <div class="view-title-group">
        <h1><i class="fa-solid fa-layer-group text-primary"></i> Flashcards com Repetição Espaçada (SRS)</h1>
        <p>Fixe conceitos com o algoritmo SuperMemo SM-2. Quanto melhor a lembrança, mais longe o próximo intervalo.</p>
      </div>
      <button class="btn btn-primary btn-sm" @click="openNewCardModal">
        <i class="fa-solid fa-plus"></i> Novo Flashcard
      </button>
    </div>

    <div class="flashcards-layout">
      <!-- Seletor de Decks (Disciplinas) -->
      <div class="deck-chips-container">
        <button 
          class="deck-chip" 
          :class="{ active: selectedDeckId === 'all' }"
          @click="selectDeck('all')"
        >
          <i class="fa-solid fa-layer-group"></i> Todos os Decks
          <span class="deck-badge">{{ totalCardsCount }}</span>
        </button>

        <button 
          v-for="deck in decks" 
          :key="deck.id"
          class="deck-chip"
          :class="{ active: selectedDeckId === deck.id }"
          @click="selectDeck(deck.id)"
        >
          <i class="fa-solid" :class="deck.icon || 'fa-book'"></i> {{ deck.name }}
          <span class="deck-badge">{{ deck.count }}</span>
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

        <!-- Ações do Card (Virar & Excluir) -->
        <div class="flashcard-actions-wrapper">
          <div class="fc-flip-btn-row">
            <button class="btn btn-secondary" @click="flipCard">
              <i class="fa-solid fa-arrows-rotate"></i> {{ isFlipped ? 'Ocultar Resposta' : 'Virar Cartão (Espaço)' }}
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="deleteCurrentCard" title="Excluir este Flashcard">
              <i class="fa-solid fa-trash-can"></i> Excluir
            </button>
          </div>

          <!-- Botões de Classificação SM-2 (Revelados ao virar o card) -->
          <div v-if="isFlipped" class="fc-grade-grid">
            <button class="fc-grade-btn btn-grade-0" @click="rateCard(0)">
              <span class="grade-title">🔴 Errei</span>
              <span class="grade-sub">Revisar em 1 min</span>
            </button>
            <button class="fc-grade-btn btn-grade-3" @click="rateCard(3)">
              <span class="grade-title">🟠 Difícil</span>
              <span class="grade-sub">Revisar em 1 dia</span>
            </button>
            <button class="fc-grade-btn btn-grade-4" @click="rateCard(4)">
              <span class="grade-title">🟢 Bom</span>
              <span class="grade-sub">Revisar em 3-6 dias</span>
            </button>
            <button class="fc-grade-btn btn-grade-5" @click="rateCard(5)">
              <span class="grade-title">🔵 Fácil</span>
              <span class="grade-sub">Revisar em 7+ dias</span>
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

// Concurso ativo e disciplinas
const activeConcurso = computed(() => store.getActiveConcurso());

const decks = computed(() => {
  const disciplinas = activeConcurso.value?.disciplinas || [];
  const cards = store.data?.flashcards || [];

  return disciplinas.map(d => ({
    id: d.id,
    name: d.name,
    icon: d.icon,
    count: cards.filter(c => c.disciplinaId === d.id).length
  }));
});

const totalCardsCount = computed(() => (store.data?.flashcards || []).length);

// Cards filtrados por deck e agendamento
const activeDeckCards = computed(() => {
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
  return d ? d.name : 'Geral';
});

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
  store.updateFlashcardSM2(cardId, quality);

  // Recompensa XP
  const xp = quality >= 3 ? 15 : 5;
  store.addXP(xp, `Flashcard revisado (+${xp} XP)`);

  isFlipped.value = false;

  if (currentIndex.value >= activeDeckCards.value.length - 1) {
    currentIndex.value = 0;
  } else {
    currentIndex.value++;
  }

  showToast(`Card classificado! Próxima revisão agendada.`, 'success');
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

function openNewCardModal() {
  const modal = document.getElementById('modal-new-flashcard');
  if (modal) {
    modal.classList.remove('hidden');
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

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.flashcards-vue-container {
  width: 100%;
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
</style>
