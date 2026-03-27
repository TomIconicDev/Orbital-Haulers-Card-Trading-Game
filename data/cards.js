export const cards = [
  {
    id: 'OH-S1-001',
    name: 'Yard Wasp',
    category: 'ship',
    set: 'Earth Yard Genesis',
    rarity: 'common',
    description: 'Starter hauler built for quick local freight and cheap turnarounds.',
    lore: 'A battered classic seen in independent yards from Earth coastlines to orbital freight rings.',
    stats: { haul: 3, speed: 4, risk: 2, salvage: 1 }
  },
  {
    id: 'OH-S1-002',
    name: 'Mulefin 4',
    category: 'ship',
    set: 'Earth Yard Genesis',
    rarity: 'common',
    description: 'Stubby industrial carrier with more backbone than style.',
    lore: 'Dock crews swear by the Mulefin because it survives abuse that newer frames should not.',
    stats: { haul: 4, speed: 2, risk: 3, salvage: 1 }
  },
  {
    id: 'OH-S1-003',
    name: 'Rust Kite',
    category: 'ship',
    set: 'Earth Yard Genesis',
    rarity: 'uncommon',
    description: 'Fast courier hull with a reputation for risky but profitable runs.',
    lore: 'Plenty of these change hands off the books after “paperwork incidents.”',
    stats: { haul: 2, speed: 5, risk: 2, salvage: 2 }
  },
  {
    id: 'OH-S1-004',
    name: 'Atlas Bulkrunner',
    category: 'ship',
    set: 'Earth Yard Genesis',
    rarity: 'rare',
    description: 'Reliable medium freighter with reinforced holds and strong margins.',
    lore: 'The Atlas is the point where a side hustle turns into an actual logistics company.',
    stats: { haul: 5, speed: 3, risk: 4, salvage: 1 }
  },
  {
    id: 'OH-S1-005',
    name: 'Kestrel Escort',
    category: 'ship',
    set: 'Earth Yard Genesis',
    rarity: 'uncommon',
    description: 'Escort frame turned light cargo runner, good against pirate pressure.',
    lore: 'When the route board starts flashing red, captains start looking for a Kestrel.',
    stats: { haul: 3, speed: 4, risk: 5, salvage: 1 }
  },
  {
    id: 'OH-S1-006',
    name: 'Helios Heavy Lifter',
    category: 'ship',
    set: 'Earth Yard Genesis',
    rarity: 'legendary',
    description: 'Massive premium hauler built for colony-scale freight and prestige contracts.',
    lore: 'Owning one means you are no longer trying to make it. You already did.',
    stats: { haul: 7, speed: 3, risk: 5, salvage: 2 }
  },
  {
    id: 'OH-S1-007',
    name: 'Mara Voss',
    category: 'pilot',
    set: 'Earth Yard Genesis',
    rarity: 'common',
    description: 'Disciplined pilot who squeezes profit from rough margins.',
    lore: 'Mara flew relief freight through dust storms before most haulers learned to dock.',
    stats: { nav: 3, grit: 3, luck: 1 }
  },
  {
    id: 'OH-S1-008',
    name: 'Eli Mercer',
    category: 'pilot',
    set: 'Earth Yard Genesis',
    rarity: 'common',
    description: 'Old-school spacer with safe hands and a slow smile.',
    lore: 'He treats every landing like there is a camera rolling, which annoys impatient clients.',
    stats: { nav: 2, grit: 4, luck: 1 }
  },
  {
    id: 'OH-S1-009',
    name: 'Tano Reke',
    category: 'pilot',
    set: 'Earth Yard Genesis',
    rarity: 'rare',
    description: 'High-risk route specialist with a habit of finding shortcuts.',
    lore: 'Insurance firms hate his file. Yard owners love his results.',
    stats: { nav: 4, grit: 2, luck: 3 }
  },
  {
    id: 'OH-S1-010',
    name: 'Sura Vale',
    category: 'pilot',
    set: 'Earth Yard Genesis',
    rarity: 'uncommon',
    description: 'Moon operations pilot known for clean descents and zero wasted movement.',
    lore: 'Sura does not brag. The contract board does it for her.',
    stats: { nav: 3, grit: 2, luck: 2 }
  },
  {
    id: 'OH-S1-011',
    name: 'Cargo Spine Extender',
    category: 'module',
    set: 'Earth Yard Genesis',
    rarity: 'common',
    description: 'Add-on frame structure that increases safe haul volume.',
    lore: 'Everyone wants more cargo until they meet the station inspector.',
    stats: { haul: 1, speed: -1, risk: 0 }
  },
  {
    id: 'OH-S1-012',
    name: 'Dust Shielding',
    category: 'module',
    set: 'Earth Yard Genesis',
    rarity: 'common',
    description: 'Protective layering for lunar and Martian surface operations.',
    lore: 'Not glamorous, but replacing sensors every other run is worse.',
    stats: { haul: 0, speed: 0, risk: 1 }
  },
  {
    id: 'OH-S1-013',
    name: 'Tug Drone Rack',
    category: 'module',
    set: 'Earth Yard Genesis',
    rarity: 'uncommon',
    description: 'Automated drone assist that boosts salvage and tricky loading jobs.',
    lore: 'The cheapest crewmate you will ever hire is the one that folds into a rack.',
    stats: { haul: 0, speed: 1, risk: 0, salvage: 2 }
  },
  {
    id: 'OH-S1-014',
    name: 'Auto Loader Arms',
    category: 'module',
    set: 'Earth Yard Genesis',
    rarity: 'rare',
    description: 'Rapid transfer assembly that chops minutes off every stop.',
    lore: 'Every second saved compounds into entire fortunes over a long enough season.',
    stats: { haul: 1, speed: 2, risk: 0 }
  },
  {
    id: 'OH-S1-015',
    name: 'Refined Helium-3',
    category: 'cargo',
    set: 'Earth Yard Genesis',
    rarity: 'rare',
    description: 'High-value fuel cargo for fusion and orbital industry buyers.',
    lore: 'Small crates, huge invoices.',
    stats: { value: 5, volatility: 2 }
  },
  {
    id: 'OH-S1-016',
    name: 'Industrial Ceramics',
    category: 'cargo',
    set: 'Earth Yard Genesis',
    rarity: 'common',
    description: 'Standard construction input used all across the off-world frontier.',
    lore: 'Boring money is still money.',
    stats: { value: 2, volatility: 1 }
  },
  {
    id: 'OH-S1-017',
    name: 'Colony MRE Bricks',
    category: 'cargo',
    set: 'Earth Yard Genesis',
    rarity: 'common',
    description: 'Shelf-stable food blocks shipped in relentless quantities.',
    lore: 'The least romantic cargo in space is also one of the most necessary.',
    stats: { value: 2, volatility: 0 }
  },
  {
    id: 'OH-S1-018',
    name: 'Reactor Core Sleeves',
    category: 'cargo',
    set: 'Earth Yard Genesis',
    rarity: 'uncommon',
    description: 'Precision-fabricated thermal housings for heavy industrial reactors.',
    lore: 'Drop one and your quarter ends with it.',
    stats: { value: 4, volatility: 2 }
  },
  {
    id: 'OH-S1-019',
    name: 'White Dune Supply Run',
    category: 'contract',
    set: 'Earth Yard Genesis',
    rarity: 'common',
    description: 'Routine Earth-to-lunar freight route with reliable payouts.',
    lore: 'Where most serious haulers prove they can show up on time repeatedly.'
  },
  {
    id: 'OH-S1-020',
    name: 'Mare Tranquillitatis Drill Job',
    category: 'contract',
    set: 'Earth Yard Genesis',
    rarity: 'uncommon',
    description: 'Move mining parts and extraction gear to a rough lunar zone.',
    lore: 'Bring dust shielding or bring excuses.'
  },
  {
    id: 'OH-S1-021',
    name: 'Red Freight Priority Line',
    category: 'contract',
    set: 'Earth Yard Genesis',
    rarity: 'rare',
    description: 'Fast-track shipment to a growing Mars corridor.',
    lore: 'The difference between a good run and a legendary one is usually timing.'
  },
  {
    id: 'OH-S1-022',
    name: 'Emergency Medlift to Lowell Base',
    category: 'contract',
    set: 'Earth Yard Genesis',
    rarity: 'epic',
    description: 'High-pressure medical priority run with zero tolerance for delay.',
    lore: 'Nobody remembers the fuel cost when you arrive in time.'
  },
  {
    id: 'OH-S1-023',
    name: 'Pirate Ping',
    category: 'event',
    set: 'Earth Yard Genesis',
    rarity: 'uncommon',
    description: 'A suspicious contact lights up the edge of your route scanner.',
    lore: 'Could be junk telemetry. Could be the reason your insurer stops replying.'
  },
  {
    id: 'OH-S1-024',
    name: 'Solar Flare Window',
    category: 'event',
    set: 'Earth Yard Genesis',
    rarity: 'rare',
    description: 'Communication scatter and sensor bloom threaten navigation windows.',
    lore: 'The sun does not care how important your cargo is.'
  },
  {
    id: 'OH-S1-025',
    name: 'Customs Sweep',
    category: 'event',
    set: 'Earth Yard Genesis',
    rarity: 'common',
    description: 'Inspection teams are moving fast and asking more questions than usual.',
    lore: 'The cleanest books often still look dirty under the wrong light.'
  },
  {
    id: 'OH-S1-026',
    name: 'Derelict Beacon',
    category: 'event',
    set: 'Earth Yard Genesis',
    rarity: 'legendary',
    description: 'An abandoned signal promises salvage, danger, and a story worth telling.',
    lore: 'Some pings are treasure. Some are the trap wrapped around it.'
  }
];

export const cardIndex = Object.fromEntries(cards.map((card) => [card.id, card]));
export const categories = ['all', 'ship', 'pilot', 'module', 'cargo', 'contract', 'event'];
export const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'exotic'];
