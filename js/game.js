import { cards, cardIndex, rarityOrder } from '../data/cards.js';
import { contracts, yardLevels } from '../data/contracts.js';
import { clamp, pickRandom, randomInt, weightedPick, daysBetween } from './utils.js';

const rarityWeights = {
  common: 54,
  uncommon: 26,
  rare: 12,
  epic: 5,
  legendary: 2,
  exotic: 1
};

const starterInventory = {
  'OH-S1-001': 1,
  'OH-S1-007': 1,
  'OH-S1-011': 1,
  'OH-S1-016': 1,
  'OH-S1-019': 1,
  'OH-S1-025': 1
};

export function createInitialState() {
  return {
    version: 1,
    credits: 1200,
    packs: 3,
    yardLevel: 1,
    inventory: { ...starterInventory },
    favorites: [],
    wishlist: ['OH-S1-006', 'OH-S1-026'],
    selectedLoadout: {
      shipId: 'OH-S1-001',
      pilotId: 'OH-S1-007',
      moduleIds: ['OH-S1-011']
    },
    stats: {
      packsOpened: 0,
      contractsCompleted: 0,
      bestPayout: 0,
      totalCards: Object.values(starterInventory).reduce((sum, count) => sum + count, 0)
    },
    lastDailyRewardAt: null,
    lastContractResult: null,
    lastOpenedCards: []
  };
}

export function getOwnedCount(state, cardId) {
  return state.inventory[cardId] ?? 0;
}

export function getOwnedCardsByCategory(state, category) {
  return cards.filter((card) => card.category === category && getOwnedCount(state, card.id) > 0);
}

export function getCollectionCount(state) {
  return Object.keys(state.inventory).filter((cardId) => state.inventory[cardId] > 0).length;
}

export function getTotalCardCopies(state) {
  return Object.values(state.inventory).reduce((sum, count) => sum + count, 0);
}

export function getCurrentYard(state) {
  return yardLevels.find((yard) => yard.level === state.yardLevel) ?? yardLevels[0];
}

export function openPack(state) {
  if (state.packs <= 0) {
    return { ok: false, reason: 'No packs available.' };
  }

  const yard = getCurrentYard(state);
  const cardsOpened = [];
  const rarityBump = yard.rareBoost;

  const slots = [
    { minimum: 'common' },
    { minimum: 'common' },
    { minimum: 'uncommon' },
    { minimum: 'common' },
    { minimum: 'rare' }
  ];

  for (const slot of slots) {
    const minimumIndex = rarityOrder.indexOf(slot.minimum);
    const pool = cards.filter((card) => rarityOrder.indexOf(card.rarity) >= minimumIndex);

    const selected = weightedPick(pool, (card) => {
      const base = rarityWeights[card.rarity] ?? 1;
      const boosted = ['rare', 'epic', 'legendary', 'exotic'].includes(card.rarity)
        ? base * (1 + rarityBump * 10)
        : base;
      return boosted;
    });

    cardsOpened.push(selected);
    state.inventory[selected.id] = (state.inventory[selected.id] ?? 0) + 1;
  }

  state.packs -= 1;
  state.stats.packsOpened += 1;
  state.stats.totalCards = getTotalCardCopies(state);
  state.lastOpenedCards = cardsOpened.map((card) => card.id);

  return { ok: true, cards: cardsOpened };
}

export function toggleFavorite(state, cardId) {
  const set = new Set(state.favorites);
  if (set.has(cardId)) set.delete(cardId);
  else set.add(cardId);
  state.favorites = [...set];
}

export function toggleWishlist(state, cardId) {
  const set = new Set(state.wishlist);
  if (set.has(cardId)) set.delete(cardId);
  else set.add(cardId);
  state.wishlist = [...set];
}

export function setLoadout(state, partial) {
  state.selectedLoadout = {
    ...state.selectedLoadout,
    ...partial
  };
}

export function simulateContract(state, contractId) {
  const contract = contracts.find((item) => item.id === contractId);
  if (!contract) return { ok: false, reason: 'Contract not found.' };

  const ship = cardIndex[state.selectedLoadout.shipId];
  const pilot = cardIndex[state.selectedLoadout.pilotId];
  const modules = state.selectedLoadout.moduleIds.map((id) => cardIndex[id]).filter(Boolean);

  if (!ship || !pilot) {
    return { ok: false, reason: 'Select both a ship and a pilot before launching.' };
  }

  const moduleTotals = modules.reduce(
    (sum, card) => {
      const stats = card.stats ?? {};
      sum.haul += stats.haul ?? 0;
      sum.speed += stats.speed ?? 0;
      sum.risk += stats.risk ?? 0;
      sum.salvage += stats.salvage ?? 0;
      return sum;
    },
    { haul: 0, speed: 0, risk: 0, salvage: 0 }
  );

  const shipStats = ship.stats ?? {};
  const pilotStats = pilot.stats ?? {};
  const yard = getCurrentYard(state);

  const score =
    (shipStats.haul ?? 0) * 4 +
    (shipStats.speed ?? 0) * 3 +
    (shipStats.risk ?? 0) * 4 +
    (shipStats.salvage ?? 0) * 2 +
    (pilotStats.nav ?? 0) * 4 +
    (pilotStats.grit ?? 0) * 3 +
    (pilotStats.luck ?? 0) * 2 +
    moduleTotals.haul * 3 +
    moduleTotals.speed * 2 +
    moduleTotals.risk * 3 +
    moduleTotals.salvage * 2 +
    state.yardLevel * 4;

  const successChance = clamp(45 + score - contract.difficulty, 18, 95);
  const roll = randomInt(1, 100);
  const success = roll <= successChance;
  const rareEvent = Math.random() < 0.18;

  let creditsDelta = 0;
  let packDelta = 0;
  let story = '';

  if (success) {
    const rewardBoost = 1 + yard.rewardBoost;
    const precisionBonus = shipStats.speed + (pilotStats.nav ?? 0);
    creditsDelta = Math.round((contract.payout + precisionBonus * 16 + moduleTotals.salvage * 14) * rewardBoost);
    packDelta = Math.random() < contract.packChance + yard.rareBoost ? 1 : 0;
    state.credits += creditsDelta;
    state.packs += packDelta;
    state.stats.contractsCompleted += 1;
    state.stats.bestPayout = Math.max(state.stats.bestPayout, creditsDelta);
    story = rareEvent
      ? pickRandom([
          'A ghost beacon appeared on return approach. Your crew logged the coordinates for a future salvage run.',
          'A private buyer noticed the clean execution and marked your yard for higher-tier offers.',
          'Dock workers spread word of the flawless turnaround. Your board is heating up.'
        ])
      : pickRandom([
          'The route stayed clean and the payout landed without dispute.',
          'Your timing shaved hours off the route and impressed the client.',
          'The cargo arrived intact and the yard crews moved like clockwork.'
        ]);
  } else {
    const penalty = Math.round(contract.payout * 0.18);
    creditsDelta = -penalty;
    state.credits = Math.max(0, state.credits - penalty);
    story = rareEvent
      ? pickRandom([
          'A pirate ping forced a detour and the contract penalties hit hard.',
          'Solar interference scrambled the approach window and the client docked your fee.',
          'A surprise customs sweep froze the handoff and wrecked the margin.'
        ])
      : pickRandom([
          'The route slipped out of tolerance and the client invoked penalty clauses.',
          'A rough approach burned fuel and forced an expensive delay.',
          'You made it through, but not in the shape the client wanted.'
        ]);
  }

  const result = {
    ok: true,
    success,
    successChance,
    roll,
    creditsDelta,
    packDelta,
    contract,
    ship,
    pilot,
    modules,
    story
  };

  state.lastContractResult = result;
  return result;
}

export function canClaimDailyReward(state, now = new Date()) {
  return daysBetween(now.toISOString(), state.lastDailyRewardAt) >= 1;
}

export function claimDailyReward(state, now = new Date()) {
  if (!canClaimDailyReward(state, now)) {
    return { ok: false, reason: 'Daily reward already claimed today.' };
  }

  const credits = 180 + state.yardLevel * 40;
  const packBonus = state.yardLevel >= 3 ? 1 : 0;
  state.credits += credits;
  state.packs += packBonus;
  state.lastDailyRewardAt = now.toISOString();
  return { ok: true, credits, packBonus };
}

export function getUpgradePreview(state) {
  const next = yardLevels.find((yard) => yard.level === state.yardLevel + 1);
  return next ?? null;
}

export function upgradeYard(state) {
  const next = getUpgradePreview(state);
  if (!next) return { ok: false, reason: 'Yard is already maxed out.' };
  if (state.credits < next.cost) return { ok: false, reason: 'Not enough credits.' };

  state.credits -= next.cost;
  state.yardLevel = next.level;
  return { ok: true, next };
}

export function exportSave(state) {
  return {
    exportedAt: new Date().toISOString(),
    state
  };
}

export function importSave(payload) {
  if (!payload || typeof payload !== 'object' || !payload.state || typeof payload.state !== 'object') {
    return null;
  }

  const state = payload.state;
  const required = ['credits', 'packs', 'yardLevel', 'inventory', 'selectedLoadout', 'stats'];
  if (!required.every((key) => key in state)) return null;

  return {
    ...createInitialState(),
    ...state,
    inventory: { ...state.inventory },
    favorites: Array.isArray(state.favorites) ? state.favorites : [],
    wishlist: Array.isArray(state.wishlist) ? state.wishlist : [],
    selectedLoadout: {
      ...createInitialState().selectedLoadout,
      ...state.selectedLoadout,
      moduleIds: Array.isArray(state.selectedLoadout?.moduleIds) ? state.selectedLoadout.moduleIds.slice(0, 3) : []
    },
    stats: {
      ...createInitialState().stats,
      ...state.stats
    }
  };
}
