import { useState, useEffect } from 'react';

// ─── Scene system ──────────────────────────────────────────────────────────────
// Auto-advancing "commercial" — pure SVG/CSS scenes that loop like a long GIF,
// no video files. Mirrors the pacing/structure of SquadREN's APE commercial.

const SCENE_MS = [3200, 3400, 3600, 3600, 3600, 3400, 3200];
const TOTAL_SCENES = SCENE_MS.length;

// ─── Badge / logo SVG ──────────────────────────────────────────────────────────

function IllyBadgeSvg({ glow = false, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="engBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="30%" stopColor="#764ba2" />
          <stop offset="60%" stopColor="#f093fb" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
        <filter id="engGlowFilter">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="60" cy="60" r="52" fill="#0f0f23" stroke="url(#engBadgeGrad)" strokeWidth="3" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="url(#engBadgeGrad)" strokeWidth="1" opacity="0.4">
        {glow && <animate attributeName="r" values="52;58;52" dur="2.4s" repeatCount="indefinite" />}
        {glow && <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite" />}
      </circle>
      <text x="60" y="72" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="900"
        fill="url(#engBadgeGrad)" filter={glow ? 'url(#engGlowFilter)' : ''}>IS</text>
    </svg>
  );
}

// ─── Flow line ─────────────────────────────────────────────────────────────────

function FlowLine({ x1, y1, x2, y2, color = '#22d3ee', delay = '0s' }) {
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2"
      strokeDasharray={`${len}`} strokeDashoffset={`${len}`} opacity="0.85">
      <animate attributeName="stroke-dashoffset" from={`${len}`} to="0" dur="0.8s" begin={delay} fill="freeze" />
      <animate attributeName="opacity" values="0.85;0.35;0.85" dur="1.6s" begin={delay} repeatCount="indefinite" />
    </line>
  );
}

// ─── Node badge (small circular icon used across scenes) ──────────────────────

function NodeBadge({ icon, label, color, sub }) {
  return (
    <div className="eng-node" style={{ borderColor: color }}>
      <div className="eng-node-icon" style={{ background: `${color}22`, color }}>{icon}</div>
      <div className="eng-node-label" style={{ color }}>{label}</div>
      {sub && <div className="eng-node-sub">{sub}</div>}
    </div>
  );
}

// ─── Scenes ────────────────────────────────────────────────────────────────────

function Scene0Title() {
  return (
    <div className="eng-scene-inner">
      <svg className="eng-circuit-bg" viewBox="0 0 800 500" aria-hidden preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 28} x2="800" y2={i * 28} stroke="#a78bfa" strokeWidth="0.3" opacity={0.06 + (i % 4) * 0.02} />
        ))}
        {[{ x: 100, y: 80 }, { x: 700, y: 100 }, { x: 150, y: 400 }, { x: 650, y: 380 }, { x: 400, y: 50 }].map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r="3" fill="#22d3ee" opacity="0.5">
            <animate attributeName="r" values="3;6;3" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
      <div className="eng-title-wrap">
        <div className="eng-badge-wrap"><IllyBadgeSvg glow size={130} /></div>
        <div className="eng-by-line">BY ILLY ROBOTIC INSTRUMENTS</div>
        <div className="eng-huge-text">$50 ECOSYSTEM</div>
        <div className="eng-full-name">THE AUTOMATED LIFECYCLE ENGINE</div>
        <div className="eng-tagline-sub">Five products. One cascade. Watch what happens when a client presses "buy."</div>
      </div>
    </div>
  );
}

function Scene1Node1() {
  return (
    <div className="eng-scene-inner">
      <div className="eng-section-label">NODE 1 · ILLY SOCIAL — THE ENTRY POINT</div>
      <div className="eng-flow-wrap">
        <svg viewBox="0 0 400 180" className="eng-flow-svg" aria-hidden>
          <text x="40" y="70" fontSize="34" fontWeight="900" fill="#22c55e">$50</text>
          <FlowLine x1={90} y1={60} x2={220} y2={90} color="#22c55e" delay="0.1s" />
          <circle cx="260" cy="90" r="46" fill="#0f0f23" stroke="#667eea" strokeWidth="2.5">
            <animate attributeName="stroke" values="#667eea;#f093fb;#667eea" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <text x="260" y="80" textAnchor="middle" fontSize="18" fontWeight="900" fill="#f093fb">IS</text>
          <text x="260" y="100" textAnchor="middle" fontSize="8" fill="#94a3b8">ILLY SOCIAL</text>
        </svg>
      </div>
      <div className="eng-copy-card">
        <p>Client pays <strong>$50</strong> for a monthly pay-as-you-go SEO scaling package.</p>
        <p>The system ingests the client's target links and campaign parameters, readying them for distribution.</p>
      </div>
      <a className="eng-node-link" href="https://www.illyrobotic-ai.com/isocial/" target="_blank" rel="noopener noreferrer">illyrobotic-ai.com/isocial ↗</a>
    </div>
  );
}

function Scene2Nodes23() {
  return (
    <div className="eng-scene-inner">
      <div className="eng-section-label">NODE 2 &amp; 3 · DISCRYPTOBANK + COINDROP — THE TASK GENERATORS</div>
      <div className="eng-split-row">
        <NodeBadge icon="🏦" label="DISCRYPTOBANK" color="#22d3ee" sub="100k+ Discord members" />
        <div className="eng-split-center">
          <div className="eng-split-amount">1,000 tasks</div>
          <div className="eng-split-desc">$50 → $0.05 / engagement</div>
        </div>
        <NodeBadge icon="🪙" label="COINDROP" color="#f59e0b" sub="Global monetization network" />
      </div>
      <div className="eng-copy-card">
        <p>The $50 budget is instantly split into micro-bounties, creating <strong>1,000 paid engagement tasks</strong>.</p>
        <p><strong>DisCryptoBank</strong> routes its share into private Discord servers, prompting 100k+ active members to engage.</p>
        <p><strong>CoinDrop</strong> simultaneously lists its share of tasks across its broader global monetization network.</p>
      </div>
      <div className="eng-link-row">
        <a className="eng-node-link" href="https://dcb-gm.com/" target="_blank" rel="noopener noreferrer">dcb-gm.com ↗</a>
        <a className="eng-node-link" href="https://coindrop.in/" target="_blank" rel="noopener noreferrer">coindrop.in ↗</a>
      </div>
    </div>
  );
}

function Scene3Node4() {
  return (
    <div className="eng-scene-inner">
      <div className="eng-section-label">NODE 4 · IRIS AUTOMATIONS — THE CONTENT HUB</div>
      <div className="eng-flow-wrap">
        <svg viewBox="0 0 400 160" className="eng-flow-svg" aria-hidden>
          <text x="15" y="40" fontSize="9" fill="#22d3ee">Discord traffic</text>
          <text x="15" y="130" fontSize="9" fill="#f59e0b">CoinDrop traffic</text>
          <FlowLine x1={110} y1={35} x2={210} y2={80} color="#22d3ee" delay="0s" />
          <FlowLine x1={110} y1={125} x2={210} y2={80} color="#f59e0b" delay="0.2s" />
          <circle cx="250" cy="80" r="48" fill="#0f0f23" stroke="#a78bfa" strokeWidth="2.5">
            <animate attributeName="stroke" values="#a78bfa;#22d3ee;#a78bfa" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <text x="250" y="72" textAnchor="middle" fontSize="20">🎬</text>
          <text x="250" y="98" textAnchor="middle" fontSize="8" fill="#94a3b8">IRIS</text>
          <FlowLine x1={298} y1={80} x2={385} y2={80} color="#a78bfa" delay="1s" />
        </svg>
      </div>
      <div className="eng-copy-card">
        <p>Triggered by the initial Illy Social purchase, <strong>IRIS</strong> automatically generates a dedicated "Creators Corner."</p>
        <p>This acts as a high-speed homepage and content distribution network designed to capture incoming traffic from the Discord and CoinDrop tasks.</p>
      </div>
      <a className="eng-node-link" href="http://illy-ris.com/movie.html" target="_blank" rel="noopener noreferrer">illy-ris.com ↗</a>
    </div>
  );
}

function Scene4Node5() {
  return (
    <div className="eng-scene-inner">
      <div className="eng-section-label">NODE 5 · SOCIAL PLUG — THE VIRAL MULTIPLIER</div>
      <div className="eng-flow-wrap">
        <svg viewBox="0 0 400 170" className="eng-flow-svg" aria-hidden>
          <circle cx="70" cy="85" r="42" fill="#0f0f23" stroke="#22c55e" strokeWidth="2.5">
            <animate attributeName="stroke" values="#22c55e;#00d4ff;#22c55e" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <text x="70" y="78" textAnchor="middle" fontSize="18">📣</text>
          <text x="70" y="98" textAnchor="middle" fontSize="8" fill="#94a3b8">SOCIAL PLUG</text>
          <FlowLine x1={114} y1={70} x2={230} y2={30} color="#a78bfa" delay="0.2s" />
          <FlowLine x1={114} y1={100} x2={230} y2={140} color="#f59e0b" delay="0.4s" />
          <text x="235" y="25" fontSize="9" fill="#a78bfa">→ IRIS Creators Corner</text>
          <text x="235" y="150" fontSize="9" fill="#f59e0b">→ CoinDrop listing</text>
        </svg>
      </div>
      <div className="eng-copy-card">
        <p><strong>Social Plug</strong> activates template automations that set up auto-replies and ad campaigns across the client's social platforms.</p>
        <p>Every auto-reply embeds two links: one to the IRIS Creators Corner (retaining traffic), another to the CoinDrop listing — converting followers into paid engagers.</p>
      </div>
      <a className="eng-node-link" href="https://illmedicine.github.io/SocialPlug/" target="_blank" rel="noopener noreferrer">Social Plug ↗</a>
    </div>
  );
}

function Scene5Results() {
  return (
    <div className="eng-scene-inner">
      <div className="eng-section-label">THE PAYOFF</div>
      <div className="eng-results-grid">
        <div className="eng-result-card">
          <div className="eng-result-num">5</div>
          <div className="eng-result-label">Public Web Domains</div>
        </div>
        <div className="eng-result-card">
          <div className="eng-result-num">1,000</div>
          <div className="eng-result-label">Paid Engagement Tasks / Cycle</div>
        </div>
        <div className="eng-result-card">
          <div className="eng-result-num">100k+</div>
          <div className="eng-result-label">Active Discord Members Reached</div>
        </div>
        <div className="eng-result-card highlight">
          <div className="eng-result-num">↑ SEO</div>
          <div className="eng-result-label">Increased Searchability &amp; Footprint</div>
        </div>
      </div>
      <div className="eng-copy-card small">
        <p>Every $50 injection cascades through all five products simultaneously — content, payouts, and distribution all fire in parallel, not in sequence.</p>
      </div>
    </div>
  );
}

function Scene6Outro() {
  return (
    <div className="eng-scene-inner eng-outro-scene">
      <div className="eng-badge-outro"><IllyBadgeSvg glow size={90} /></div>
      <div className="eng-outro-headline">OPEN-SOURCE, DECENTRALIZED TECHNOLOGY</div>
      <div className="eng-outro-sub">POWERING THE NEXT GENERATION OF FINTECH</div>
      <div className="eng-outro-links">
        <a href="https://www.illyrobotic-ai.com/isocial/" className="eng-outro-link" target="_blank" rel="noopener noreferrer">Illy Social</a>
        <a href="https://dcb-gm.com/" className="eng-outro-link" target="_blank" rel="noopener noreferrer">DisCryptoBank</a>
        <a href="https://coindrop.in/" className="eng-outro-link" target="_blank" rel="noopener noreferrer">CoinDrop</a>
        <a href="http://illy-ris.com/movie.html" className="eng-outro-link" target="_blank" rel="noopener noreferrer">IRIS</a>
        <a href="https://illmedicine.github.io/SocialPlug/" className="eng-outro-link" target="_blank" rel="noopener noreferrer">Social Plug</a>
      </div>
    </div>
  );
}

// ─── Main engine component ─────────────────────────────────────────────────────

export function EcosystemEngine() {
  const [scene, setScene] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dur = SCENE_MS[scene];
    setProgress(0);
    const start = Date.now();
    let raf;
    const tick = () => {
      const pct = Math.min(100, ((Date.now() - start) / dur) * 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t = setTimeout(() => setScene((s) => (s + 1) % TOTAL_SCENES), dur);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [scene]);

  const scenes = [
    <Scene0Title />,
    <Scene1Node1 />,
    <Scene2Nodes23 />,
    <Scene3Node4 />,
    <Scene4Node5 />,
    <Scene5Results />,
    <Scene6Outro />,
  ];

  return (
    <div className="eng-com">
      <div className="eng-scene-host" key={scene}>
        {scenes[scene]}
      </div>
      <div className="eng-progress-row">
        {SCENE_MS.map((_, i) => (
          <button key={i} className={`eng-prog-seg ${i === scene ? 'active' : i < scene ? 'done' : ''}`}
            onClick={() => setScene(i)} aria-label={`Scene ${i + 1}`}>
            {i === scene && <div className="eng-prog-fill" style={{ width: `${progress}%` }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Modal wrapper ──────────────────────────────────────────────────────────────

export default function EcosystemModal({ onClose }) {
  return (
    <div className="eng-modal-overlay" onClick={onClose}>
      <div className="eng-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="eng-modal-close" onClick={onClose} aria-label="Close">×</button>
        <EcosystemEngine />
      </div>
    </div>
  );
}
