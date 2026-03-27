import { loadState, saveState, clearState } from './storage.js';
import {
  canClaimDailyReward,
  claimDailyReward,
  createInitialState,
  exportSave,
  importSave,
  openPack,
  setLoadout,
  simulateContract,
  toggleFavorite,
  toggleWishlist,
  upgradeYard
} from './game.js';
import {
  renderCollection,
  renderContracts,
  renderHome,
  renderPacks,
  renderSettings,
  renderYard
} from './render.js';
import { downloadJson, safeParseJson } from './utils.js';

const screenRoot = document.getElementById('screen-root');
const modal = document.getElementById('modal');
const toast = document.getElementById('toast');
const dailyRewardBtn = document.getElementById('daily-reward-btn');
const navButtons = [...document.querySelectorAll('.nav-btn')];

let state = loadState() ?? createInitialState();
let activeScreen = 'home';
let collectionFilters = {
  search: '',
  category: 'all',
  ownedOnly: false
};

function persist() {
  saveState(state);
  updateDailyRewardButton();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._timeout);
  showToast._timeout = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function setActiveScreen(screen) {
  activeScreen = screen;
  navButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.screen === screen));
  render();
}

function updateDailyRewardButton() {
  dailyRewardBtn.textContent = canClaimDailyReward(state) ? 'Daily Reward' : 'Reward Claimed';
  dailyRewardBtn.disabled = !canClaimDailyReward(state);
}

function render() {
  switch (activeScreen) {
    case 'collection':
      screenRoot.innerHTML = renderCollection(state, collectionFilters);
      break;
    case 'packs':
      screenRoot.innerHTML = renderPacks(state);
      break;
    case 'contracts':
      screenRoot.innerHTML = renderContracts(state);
      break;
    case 'yard':
      screenRoot.innerHTML = renderYard(state);
      break;
    case 'settings':
      screenRoot.innerHTML = renderSettings(state);
      break;
    case 'home':
    default:
      screenRoot.innerHTML = renderHome(state);
      break;
  }
}

function handleScreenClick(event) {
  const target = event.target.closest('button, article, label');
  if (!target) return;

  const { goto, action, cardId, runContract, loadoutType } = target.dataset;

  if (goto) {
    setActiveScreen(goto);
    return;
  }

  if (action === 'favorite' && cardId) {
    toggleFavorite(state, cardId);
    persist();
    render();
    return;
  }

  if (action === 'wishlist' && cardId) {
    toggleWishlist(state, cardId);
    persist();
    render();
    return;
  }

  if (loadoutType && cardId) {
    if (loadoutType === 'ship') {
      setLoadout(state, { shipId: cardId });
    } else if (loadoutType === 'pilot') {
      setLoadout(state, { pilotId: cardId });
    } else if (loadoutType === 'module') {
      const set = new Set(state.selectedLoadout.moduleIds);
      if (set.has(cardId)) set.delete(cardId);
      else if (set.size < 3) set.add(cardId);
      else {
        showToast('You can equip up to 3 modules.');
        return;
      }
      setLoadout(state, { moduleIds: [...set] });
    }
    persist();
    render();
    return;
  }

  if (runContract) {
    const result = simulateContract(state, runContract);
    if (!result.ok) {
      showToast(result.reason);
      return;
    }
    persist();
    render();
    showToast(result.success ? `Contract complete: +${result.creditsDelta} credits` : `Contract failed: ${result.creditsDelta} credits`);
    return;
  }

  if (target.id === 'open-pack-btn') {
    const result = openPack(state);
    if (!result.ok) {
      showToast(result.reason);
      return;
    }
    persist();
    render();
    showToast('Pack opened. Fresh cards added to your binder.');
    return;
  }

  if (target.id === 'goto-yard-btn') {
    setActiveScreen('yard');
    return;
  }

  if (target.id === 'upgrade-yard-btn') {
    const result = upgradeYard(state);
    if (!result.ok) {
      showToast(result.reason);
      return;
    }
    persist();
    render();
    showToast(`Yard upgraded to ${result.next.name}.`);
    return;
  }

  if (target.id === 'owned-filter') {
    collectionFilters.ownedOnly = !collectionFilters.ownedOnly;
    render();
    return;
  }

  if (target.id === 'export-save-btn') {
    downloadJson('orbital-haulers-cargo-cards-save.json', exportSave(state));
    showToast('Save exported.');
    return;
  }

  if (target.id === 'reset-save-btn') {
    openConfirmModal(
      'Reset progress',
      'This clears the local save on this device and restarts from the starter build.',
      () => {
        clearState();
        state = createInitialState();
        persist();
        closeModal();
        setActiveScreen('home');
        showToast('Progress reset.');
      }
    );
  }
}

function handleInput(event) {
  const target = event.target;
  if (target.id === 'card-search') {
    collectionFilters.search = target.value;
    render();
  }

  if (target.id === 'category-filter') {
    collectionFilters.category = target.value;
    render();
  }
}

function handleChange(event) {
  const target = event.target;
  if (target.id !== 'import-save-input') return;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const parsed = safeParseJson(String(reader.result));
    const imported = importSave(parsed);
    if (!imported) {
      showToast('Invalid save file.');
      target.value = '';
      return;
    }

    state = imported;
    persist();
    render();
    showToast('Save imported.');
    target.value = '';
  };
  reader.readAsText(file);
}

function openConfirmModal(title, body, onConfirm) {
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  modal.innerHTML = `
    <div class="modal-card">
      <h3>${title}</h3>
      <p class="muted">${body}</p>
      <div class="row" style="margin-top:14px;">
        <button id="modal-cancel-btn" class="btn">Cancel</button>
        <button id="modal-confirm-btn" class="btn btn-danger">Confirm</button>
      </div>
    </div>
  `;

  modal.querySelector('#modal-cancel-btn').addEventListener('click', closeModal, { once: true });
  modal.querySelector('#modal-confirm-btn').addEventListener('click', onConfirm, { once: true });
}

function closeModal() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = '';
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

dailyRewardBtn.addEventListener('click', () => {
  const reward = claimDailyReward(state);
  if (!reward.ok) {
    showToast(reward.reason);
    return;
  }
  persist();
  render();
  showToast(`Daily reward: +${reward.credits} credits${reward.packBonus ? ` and +${reward.packBonus} pack` : ''}`);
});

navButtons.forEach((button) => {
  button.addEventListener('click', () => setActiveScreen(button.dataset.screen));
});

screenRoot.addEventListener('click', handleScreenClick);
screenRoot.addEventListener('input', handleInput);
screenRoot.addEventListener('change', handleChange);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

registerServiceWorker();
persist();
render();
