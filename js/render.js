import { cards, cardIndex, categories } from '../data/cards.js';
import { contracts, yardLevels } from '../data/contracts.js';
import {
  claimDailyReward,
  getCollectionCount,
  getCurrentYard,
  getOwnedCardsByCategory,
  getOwnedCount,
  getTotalCardCopies,
  getUpgradePreview
} from './game.js';
import { formatCategory } from './utils.js';

function statPill(label, value) {
  return `<span class="card-stat">${label}: ${value}</span>`;
}

function renderCard(card, state, options = {}) {
  const count = getOwnedCount(state, card.id);
  const isFavorite = state.favorites.includes(card.id);
  const isWishlist = state.wishlist.includes(card.id);
  const compact = options.compact ? ' compact' : '';

  const statsMarkup = card.stats
    ? `<div class="card-stats">${Object.entries(card.stats)
        .filter(([, value]) => typeof value === 'number' && value !== 0)
        .map(([key, value]) => statPill(key, value > 0 ? `+${value}`.replace('++', '+') : value))
        .join('')}</div>`
    : '';

  return `
    <article class="card${compact}" data-card-id="${card.id}" data-category="${card.category}" data-rarity="${card.rarity}">
      <div class="card-body">
        <div>
          <div class="card-top">
            <div>
              <p class="card-type">${formatCategory(card.category)}</p>
              <h3 class="card-name">${card.name}</h3>
            </div>
            <span class="card-rarity">${card.rarity}</span>
          </div>
          <div class="card-art"></div>
          <p class="card-desc">${card.description}</p>
          ${statsMarkup}
          <p class="card-lore">${card.lore ?? ''}</p>
        </div>
        <div class="row">
          <button class="btn card-favorite-btn ${isFavorite ? 'is-selected' : ''}" data-action="favorite" data-card-id="${card.id}">${isFavorite ? '★ Favorite' : '☆ Favorite'}</button>
          <button class="btn card-wishlist-btn ${isWishlist ? 'is-selected' : ''}" data-action="wishlist" data-card-id="${card.id}">${isWishlist ? '✓ Wishlist' : '+ Wishlist'}</button>
        </div>
      </div>
      <span class="inventory-badge">x${count}</span>
    </article>
  `;
}

export function renderHome(state) {
  const yard = getCurrentYard(state);
  const uniqueCards = getCollectionCount(state);
  const totalCopies = getTotalCardCopies(state);
  const favoriteNames = state.favorites.slice(0, 3).map((id) => cardIndex[id]?.name).filter(Boolean);

  return `
    <section class="panel hero">
      <h2>Build the collector companion first.</h2>
      <p>
        This repo starts with the real loop: open packs, collect premium cards, run freight contracts,
        and upgrade your Earth yard. Then we scale into bigger sets, trading, and Steam tie-ins.
      </p>
    </section>

    <section class="grid grid-2">
      <article class="stat-card">
        <p class="stat-label">Credits</p>
        <p class="stat-value">${state.credits}</p>
        <p class="stat-sub">Your working yard bankroll</p>
      </article>
      <article class="stat-card">
        <p class="stat-label">Packs</p>
        <p class="stat-value">${state.packs}</p>
        <p class="stat-sub">Open them in the Packs tab</p>
      </article>
      <article class="stat-card">
        <p class="stat-label">Collection</p>
        <p class="stat-value">${uniqueCards} / ${cards.length}</p>
        <p class="stat-sub">${totalCopies} total copies owned</p>
      </article>
      <article class="stat-card">
        <p class="stat-label">Current Yard</p>
        <p class="stat-value">L${yard.level}</p>
        <p class="stat-sub">${yard.name}</p>
      </article>
    </section>

    <section class="panel">
      <div class="row space">
        <h3 class="panel-title">Quick launch</h3>
        <div class="quick-actions">
          <button class="btn btn-accent" data-goto="packs">Open a pack</button>
          <button class="btn" data-goto="contracts">Run a contract</button>
          <button class="btn" data-goto="collection">View collection</button>
        </div>
      </div>
      <div class="kv">
        <div class="kv-row"><span>Packs opened</span><strong>${state.stats.packsOpened}</strong></div>
        <div class="kv-row"><span>Contracts completed</span><strong>${state.stats.contractsCompleted}</strong></div>
        <div class="kv-row"><span>Best payout</span><strong>${state.stats.bestPayout}</strong></div>
        <div class="kv-row"><span>Wishlist targets</span><strong>${state.wishlist.length}</strong></div>
      </div>
    </section>

    <section class="panel">
      <div class="row space">
        <h3 class="panel-title">Pinned cards</h3>
        <span class="tag">${favoriteNames.length ? favoriteNames.join(' • ') : 'No favorites yet'}</span>
      </div>
      <div class="collection-grid">
        ${state.favorites.length ? state.favorites.slice(0, 3).map((id) => renderCard(cardIndex[id], state, { compact: true })).join('') : '<div class="empty-state">Favorite cards appear here for quick flexing and easy tracking.</div>'}
      </div>
    </section>
  `;
}

export function renderCollection(state, filters) {
  const filtered = cards.filter((card) => {
    const matchesCategory = filters.category === 'all' || card.category === filters.category;
    const search = filters.search.trim().toLowerCase();
    const matchesSearch = !search || `${card.name} ${card.description} ${card.lore}`.toLowerCase().includes(search);
    const matchesOwned = !filters.ownedOnly || getOwnedCount(state, card.id) > 0;
    return matchesCategory && matchesSearch && matchesOwned;
  });

  return `
    <section class="panel">
      <div class="row space">
        <h2 class="panel-title">Collection Binder</h2>
        <span class="tag">${getCollectionCount(state)} owned</span>
      </div>
      <div class="collection-toolbar">
        <input id="card-search" type="search" placeholder="Search cards" value="${filters.search}" />
        <select id="category-filter">
          ${categories.map((category) => `<option value="${category}" ${filters.category === category ? 'selected' : ''}>${formatCategory(category)}</option>`).join('')}
        </select>
        <button id="owned-filter" class="filter-chip ${filters.ownedOnly ? 'is-selected' : ''}">${filters.ownedOnly ? 'Owned only' : 'Show all cards'}</button>
      </div>
      <div class="collection-grid">
        ${filtered.length ? filtered.map((card) => renderCard(card, state)).join('') : '<div class="empty-state">No cards matched that filter.</div>'}
      </div>
    </section>
  `;
}

export function renderPacks(state) {
  return `
    <section class="panel">
      <div class="row space">
        <div>
          <h2 class="panel-title">Pack Bay</h2>
          <p class="muted">Open packs to expand the collection. Yard upgrades improve premium pull odds.</p>
        </div>
        <span class="tag">${state.packs} packs</span>
      </div>
      <div class="row">
        <button id="open-pack-btn" class="btn btn-accent">Open 1 pack</button>
        <button id="goto-yard-btn" class="btn">Boost pack odds in Yard</button>
      </div>
    </section>

    <section class="panel">
      <h3 class="panel-title">Latest reveal</h3>
      ${state.lastOpenedCards.length ? `
        <div class="reveal-grid">
          ${state.lastOpenedCards.map((id) => {
            const card = cardIndex[id];
            return `
              <article class="reveal-card is-flipped" data-category="${card.category}" data-rarity="${card.rarity}">
                <p class="card-type">${formatCategory(card.category)}</p>
                <h3 class="card-name">${card.name}</h3>
                <div class="card-art"></div>
                <p class="card-desc">${card.description}</p>
                <p class="card-lore">${card.lore}</p>
              </article>
            `;
          }).join('')}
        </div>
      ` : '<div class="empty-state">Open your first pack to reveal cards here.</div>'}
    </section>
  `;
}

function optionButtons(items, selectedId, type) {
  return items.length
    ? items.map((card) => `<button class="btn ${selectedId === card.id ? 'is-selected' : ''}" data-loadout-type="${type}" data-card-id="${card.id}">${card.name}</button>`).join('')
    : '<div class="empty-state">No owned cards available.</div>';
}

export function renderContracts(state) {
  const ships = getOwnedCardsByCategory(state, 'ship');
  const pilots = getOwnedCardsByCategory(state, 'pilot');
  const modules = getOwnedCardsByCategory(state, 'module');
  const last = state.lastContractResult;

  return `
    <section class="panel">
      <div class="row space">
        <div>
          <h2 class="panel-title">Contract Board</h2>
          <p class="muted">Pick a loadout, then run a route for credits and bonus packs.</p>
        </div>
        <span class="tag">Yard L${state.yardLevel}</span>
      </div>
      <div class="grid grid-2">
        <div>
          <h3>Ship</h3>
          <div class="row">${optionButtons(ships, state.selectedLoadout.shipId, 'ship')}</div>
        </div>
        <div>
          <h3>Pilot</h3>
          <div class="row">${optionButtons(pilots, state.selectedLoadout.pilotId, 'pilot')}</div>
        </div>
      </div>
      <div>
        <h3>Modules</h3>
        <p class="muted small">Choose up to 3 modules.</p>
        <div class="row">${modules.length ? modules.map((card) => `<button class="btn ${state.selectedLoadout.moduleIds.includes(card.id) ? 'is-selected' : ''}" data-loadout-type="module" data-card-id="${card.id}">${card.name}</button>`).join('') : '<div class="empty-state">Open packs to find more modules.</div>'}</div>
      </div>
    </section>

    <section class="panel">
      <h3 class="panel-title">Available routes</h3>
      <div class="contract-grid">
        ${contracts.map((contract) => `
          <article class="contract-card">
            <h3>${contract.name}</h3>
            <p class="muted">${contract.route}</p>
            <p>${contract.summary}</p>
            <div class="row">
              <span class="tag">Difficulty ${contract.difficulty}</span>
              <span class="tag">${contract.payout} credits</span>
            </div>
            <div class="row" style="margin-top:10px;">
              <button class="btn btn-accent" data-run-contract="${contract.id}">Run contract</button>
            </div>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="panel">
      <h3 class="panel-title">Last result</h3>
      ${last ? `
        <div class="result-box">
          <p><strong>${last.success ? 'Success' : 'Failed'}:</strong> ${last.contract.name}</p>
          <p>Success chance: ${last.successChance}% · Roll: ${last.roll}</p>
          <p>${last.creditsDelta >= 0 ? '+' : ''}${last.creditsDelta} credits ${last.packDelta ? `· +${last.packDelta} pack` : ''}</p>
          <p class="muted">${last.story}</p>
        </div>
      ` : '<div class="empty-state">Launch a contract to see results here.</div>'}
    </section>
  `;
}

export function renderYard(state) {
  const current = getCurrentYard(state);
  const next = getUpgradePreview(state);

  return `
    <section class="panel">
      <h2 class="panel-title">Earth Yard</h2>
      <div class="kv">
        <div class="kv-row"><span>Current tier</span><strong>L${current.level} · ${current.name}</strong></div>
        <div class="kv-row"><span>Contract reward boost</span><strong>${Math.round(current.rewardBoost * 100)}%</strong></div>
        <div class="kv-row"><span>Premium pack boost</span><strong>${Math.round(current.rareBoost * 100)}%</strong></div>
        <div class="kv-row"><span>Status</span><strong>${current.note}</strong></div>
      </div>
    </section>

    <section class="panel">
      <h3 class="panel-title">Upgrade path</h3>
      ${next ? `
        <div class="list-item">
          <div>
            <h4>L${next.level} · ${next.name}</h4>
            <p class="muted">${next.note}</p>
          </div>
          <div class="row">
            <span class="tag">${next.cost} credits</span>
            <button id="upgrade-yard-btn" class="btn btn-accent">Upgrade</button>
          </div>
        </div>
      ` : '<div class="empty-state">Your yard is fully upgraded for this starter build.</div>'}
    </section>

    <section class="panel">
      <h3 class="panel-title">Full roadmap</h3>
      <div class="list">
        ${yardLevels.map((yard) => `
          <div class="list-item">
            <div>
              <h4>L${yard.level} · ${yard.name}</h4>
              <p class="muted">${yard.note}</p>
            </div>
            <div class="row">
              <span class="tag">+${Math.round(yard.rewardBoost * 100)}% rewards</span>
              <span class="tag">+${Math.round(yard.rareBoost * 100)}% premium</span>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

export function renderSettings(state) {
  const dailyStatus = claimDailyReward; // quiet linter helper for static page tooling
  void dailyStatus;

  return `
    <section class="panel">
      <h2 class="panel-title">Settings & Save</h2>
      <div class="kv">
        <div class="kv-row"><span>Save type</span><strong>Local browser save</strong></div>
        <div class="kv-row"><span>Trading</span><strong>Ready for later share code format</strong></div>
        <div class="kv-row"><span>Install tip</span><strong>Use Safari → Share → Add to Home Screen</strong></div>
      </div>
    </section>

    <section class="panel">
      <h3 class="panel-title">Save tools</h3>
      <div class="row">
        <button id="export-save-btn" class="btn btn-accent">Export save</button>
        <label class="btn" for="import-save-input">Import save</label>
        <input class="file-input" id="import-save-input" type="file" accept="application/json" />
        <button id="reset-save-btn" class="btn btn-danger">Reset progress</button>
      </div>
    </section>

    <section class="panel">
      <h3 class="panel-title">Starter build checklist</h3>
      <div class="list">
        <div class="list-item"><div><h4>Built now</h4><p class="muted">Collection, packs, contracts, yard loop, export/import, installable PWA shell.</p></div></div>
        <div class="list-item"><div><h4>Next repo pass</h4><p class="muted">Real card art, bigger sets, binder animations, faction tracks, QR trade format, Steam unlock sync.</p></div></div>
      </div>
    </section>
  `;
}
