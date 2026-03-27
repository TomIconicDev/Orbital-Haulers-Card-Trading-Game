# Orbital Haulers: Cargo Cards

A mobile-first GitHub Pages companion app for **Orbital Haulers**.

This starter repo gives you a real playable loop immediately:
- open packs
- collect cards
- build a contract loadout
- run freight jobs
- upgrade your Earth yard
- export and import local save data
- install the app on iPhone from Safari

## What is in this starter build

### Built now
- Home dashboard
- Collection binder with search and category filters
- Pack opening flow
- Contract simulation using owned ship, pilot, and modules
- Yard upgrades that boost rewards and premium pulls
- Favorites and wishlist flags
- Daily reward button
- Local save using browser storage
- Export/import JSON save files
- Basic offline support with a service worker
- App manifest for Home Screen installation

### Seed content
- 26 cards in the first starter set
- 4 contract routes
- 5 yard levels

## Repo structure

```text
orbital-haulers-cargo-cards/
  index.html
  styles.css
  manifest.webmanifest
  sw.js
  README.md
  assets/icons/
  data/
    cards.js
    contracts.js
  js/
    app.js
    game.js
    render.js
    storage.js
    utils.js
```

## Deploy on GitHub Pages

1. Create a new GitHub repo.
2. Upload all files from this starter project.
3. In the repo settings, enable **GitHub Pages** and publish from the root or default branch.
4. Open the Pages URL on your iPhone in **Safari**.
5. Use **Share → Add to Home Screen** to install it like an app.

## Best next build passes

### 1. Premium card art pass
Replace the abstract card-art panel with real art per card and move assets into `assets/cards/`.

### 2. Bigger sets
Split data into multiple set files:
- Earth Yard Genesis
- Lunar Extraction
- Mars Frontier
- Black Market Routes
- Deep Orbit Relics

### 3. Better collection systems
Add:
- binder pages
- holographic finishes
- completion rewards
- faction reputation tracks
- lore codex pages

### 4. Better game systems
Add:
- route hazards
- consumables
- cargo market prices
- salvage runs
- faction contracts
- named crew progression

### 5. Trading foundation
For a later version:
- friend trade codes
- QR import/export
- account sync
- backend ownership validation

## Notes

This starter version is intentionally light and GitHub Pages-friendly so you can ship fast, test it on iPhone, and expand the universe without fighting a heavy toolchain.
