export const contracts = [
  {
    id: 'contract-white-dune',
    name: 'White Dune Supply Run',
    route: 'Earth → Moon',
    difficulty: 34,
    payout: 240,
    packChance: 0.18,
    summary: 'Steady lunar route. Good for building momentum.',
    tags: ['starter', 'reliable']
  },
  {
    id: 'contract-mare-tranquillitatis',
    name: 'Mare Tranquillitatis Drill Job',
    route: 'Earth → Moon Surface',
    difficulty: 45,
    payout: 360,
    packChance: 0.24,
    summary: 'Mining gear delivery through hazardous dust conditions.',
    tags: ['mining', 'surface']
  },
  {
    id: 'contract-red-freight',
    name: 'Red Freight Priority Line',
    route: 'Earth → Mars Corridor',
    difficulty: 58,
    payout: 560,
    packChance: 0.3,
    summary: 'Longer haul with higher margin and tighter timing.',
    tags: ['mars', 'priority']
  },
  {
    id: 'contract-medlift-lowell',
    name: 'Emergency Medlift to Lowell Base',
    route: 'Earth → Mars Frontier',
    difficulty: 68,
    payout: 780,
    packChance: 0.38,
    summary: 'Premium medical run. High pressure, high reward.',
    tags: ['medical', 'elite']
  }
];

export const yardLevels = [
  { level: 1, name: 'Patchwork Yard', cost: 0, rewardBoost: 0, rareBoost: 0, note: 'Bare-bones start-up operation.' },
  { level: 2, name: 'Expanded Freight Lot', cost: 650, rewardBoost: 0.08, rareBoost: 0.01, note: 'Extra handling space and better vendor rates.' },
  { level: 3, name: 'Automated Dock Ring', cost: 1400, rewardBoost: 0.15, rareBoost: 0.03, note: 'Improved loading times and smarter contract filtering.' },
  { level: 4, name: 'Orbital Operations Annex', cost: 2800, rewardBoost: 0.24, rareBoost: 0.05, note: 'Access to more profitable routes and tighter logistics.' },
  { level: 5, name: 'Frontier Hauler Complex', cost: 5200, rewardBoost: 0.35, rareBoost: 0.08, note: 'Premium contracts and enhanced pack quality.' }
];
