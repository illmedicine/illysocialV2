import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, useProgress } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LabScene from '../lab/LabScene';
import { STATIONS, PAGES, LOGO_BASE } from '../lab/labData';
import '../lab/rndlab.css';

// Detect WebGL once; fall back to a static hero on unsupported devices.
const HAS_WEBGL = (() => {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch {
    return false;
  }
})();

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function LoadingScreen() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="lab-loading">
      <div className="lab-spinner" />
      <div>Initializing Illy R&amp;D Labs — {Math.round(progress)}%</div>
    </div>
  );
}

// DOM overlay synced to the scroll (rendered by drei <Scroll html>).
function Overlay({ currentUser, signingIn, error, onSignIn, onEnter, onExplore }) {
  const vh = (page) => ({ top: `${page * 100}vh` });
  const finalePage = PAGES - 1;
  return (
    <div className="lab-dom">
      {/* Intro */}
      <section className="lab-hero" style={vh(0)}>
        <div className="lab-eyebrow">Illy Robotic Instruments</div>
        <h1>
          ILLY <span className="grad">R&amp;D LABS</span>
        </h1>
        <p>
          Step inside the automation engine. Scroll to walk deeper into the lab and watch a single
          creator&apos;s $50 cascade through the entire Illy ecosystem — in order.
        </p>
      </section>

      {/* One caption per product station */}
      {STATIONS.map((s, i) => (
        <section key={s.key} className={`lab-caption ${i % 2 ? 'right' : 'left'}`} style={vh(i + 1)}>
          <div className="lab-card">
            <div className="lab-node">NODE {s.node}</div>
            <h2>{s.name}</h2>
            <div className="lab-role" style={{ color: s.accent }}>
              {s.role}
            </div>
            <p>{s.tagline}</p>
          </div>
        </section>
      ))}

      {/* Finale — Google sign-in airlock */}
      <section className="lab-finale" style={vh(finalePage)}>
        <div className="lab-signin">
          <div className="lab-eyebrow">End of the walkthrough</div>
          {currentUser ? (
            <>
              <h2>Welcome back</h2>
              <p>You&apos;re signed in. Head to your Creators Dashboard to manage your presence.</p>
              <button className="lab-enter-btn" onClick={onEnter}>
                Enter Dashboard →
              </button>
            </>
          ) : (
            <>
              <h2>Enter the Lab</h2>
              <p>Sign in with Google to claim your Creators Dashboard and start your first cascade.</p>
              <button className="lab-google-btn" onClick={onSignIn} disabled={signingIn}>
                <GoogleIcon />
                {signingIn ? 'Signing in…' : 'Continue with Google'}
              </button>
              {error && <p className="lab-error">{error}</p>}
              <p className="lab-terms">By continuing you agree to the IllySocial community terms.</p>
            </>
          )}
          <span className="lab-explore-link" onClick={onExplore}>
            or explore services first →
          </span>
        </div>
      </section>
    </div>
  );
}

export default function RndLab() {
  const { currentUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setError('');
    setSigningIn(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Sign-in failed. Please try again.');
      setSigningIn(false);
    }
  };

  const goDashboard = () => navigate('/dashboard');
  const goExplore = () => navigate('/explore');

  // Graceful fallback when WebGL is unavailable.
  if (!HAS_WEBGL) {
    return (
      <div className="lab-fallback">
        <div className="lab-eyebrow">Illy Robotic Instruments</div>
        <h1>Illy R&amp;D Labs</h1>
        <p style={{ maxWidth: 560, color: '#aab0d8' }}>
          The $50 ecosystem cascade: Illy Social → DisCryptoBank → CoinDrop → IRIS → Social Plug.
        </p>
        <div className="row">
          {STATIONS.map((s) => (
            <img key={s.key} src={LOGO_BASE + s.logo} alt={s.name} />
          ))}
        </div>
        {currentUser ? (
          <button className="lab-enter-btn" style={{ width: 280 }} onClick={goDashboard}>
            Enter Dashboard →
          </button>
        ) : (
          <button className="lab-google-btn" style={{ width: 280 }} onClick={handleSignIn} disabled={signingIn}>
            <GoogleIcon />
            {signingIn ? 'Signing in…' : 'Continue with Google'}
          </button>
        )}
        {error && <p className="lab-error">{error}</p>}
        <span className="lab-explore-link" onClick={goExplore}>
          or explore services first →
        </span>
      </div>
    );
  }

  return (
    <div className="lab-root">
      <div className="lab-topbar">
        <div className="lab-brand">
          <span className="b1">Illy</span>
          <span className="b2">R&amp;D</span>
          <small>LABS</small>
        </div>
        <div className="lab-nav">
          <button onClick={goExplore}>Explore</button>
          {currentUser ? (
            <button className="primary" onClick={goDashboard}>
              Dashboard
            </button>
          ) : (
            <button className="primary" onClick={handleSignIn} disabled={signingIn}>
              {signingIn ? 'Signing in…' : 'Sign in'}
            </button>
          )}
        </div>
      </div>

      <Canvas
        dpr={[1, 1.8]}
        camera={{ fov: 62, position: [0, 0.5, 12] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#04050d']} />
        <fog attach="fog" args={['#04050d', 14, 82]} />
        <Suspense fallback={null}>
          <ScrollControls pages={PAGES} damping={0.28}>
            <LabScene />
            <Scroll html style={{ width: '100%' }}>
              <Overlay
                currentUser={currentUser}
                signingIn={signingIn}
                error={error}
                onSignIn={handleSignIn}
                onEnter={goDashboard}
                onExplore={goExplore}
              />
            </Scroll>
          </ScrollControls>
        </Suspense>
        <EffectComposer>
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.25} luminanceSmoothing={0.3} />
          <Vignette offset={0.22} darkness={0.85} />
        </EffectComposer>
      </Canvas>

      <LoadingScreen />
      <div className="lab-scrollhint">scroll to enter ↓</div>
    </div>
  );
}
