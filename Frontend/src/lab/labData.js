// Illy R&D Labs — the ecosystem cascade, in order, as the user walks deeper.
// Order + copy mirror the $50 ecosystem infographic and EcosystemEngine.jsx.
// Logos are staged in /public/logos and served under the app base (/isocial/).

export const LOGO_BASE = import.meta.env.BASE_URL + 'logos/';

export const STATIONS = [
  {
    key: 'illysocial',
    node: '01',
    name: 'Illy Social',
    role: 'The Entry Point',
    tagline: 'A creator injects $50 for a pay-as-you-go growth package. The cascade begins here.',
    logo: 'illysocial.png',
    color: '#8b7bff',
    accent: '#c4b5fd',
  },
  {
    key: 'discryptobank',
    node: '02',
    name: 'DisCryptoBank',
    role: 'The Task Generators',
    tagline: 'The budget splits into 1,000 micro-bounties routed to a 100k+ member Discord network.',
    logo: 'discryptobank.png',
    color: '#22d3ee',
    accent: '#67e8f9',
  },
  {
    key: 'coindrop',
    node: '03',
    name: 'CoinDrop',
    role: 'Global Monetization',
    tagline: 'Tasks list across the worldwide engagement market — real workers, instant SOL payouts.',
    logo: 'coindrop.png',
    color: '#f59e0b',
    accent: '#fcd34d',
  },
  {
    key: 'iris',
    node: '04',
    name: 'IRIS Automations',
    role: 'The Content Hub',
    tagline: 'Auto-builds a Creators Corner — a high-speed content CDN that captures the incoming traffic.',
    logo: 'i-rislogo.png',
    color: '#a78bfa',
    accent: '#ddd6fe',
  },
  {
    key: 'socialplug',
    node: '05',
    name: 'Social Plug',
    role: 'The Viral Multiplier',
    tagline: 'Auto-replies and ad campaigns turn followers into paid engagers across every platform.',
    logo: 'SocialPlug.png',
    color: '#34d399',
    accent: '#6ee7b7',
  },
];

// Camera / layout constants shared by the scene and overlay page math.
export const PAGES = STATIONS.length + 2; // intro + N stations + finale
export const STATION_Z0 = -18; // z of the first station
export const STATION_GAP = -17; // spacing between stations (deeper = more negative)
