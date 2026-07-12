import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import {
  validateYouTubeHandle,
  validateInstagramHandle,
  validateCreatorsCornerNickname,
} from '../services/validationService';
import { generateFanpageHTML } from '../services/fanpageGenerator';
import { saveFanpage } from '../services/fanpageService';
import PaymentLinksManager from '../components/PaymentLinksManager';
import './CreatorsDashboard.css';

const PLATFORMS = ['instagram', 'youtube', 'tiktok', 'twitter', 'facebook'];
const PAYPAL_BUTTON_ID = 'NBD7CEP5TEYXN';

// Onboarding wizard modal (shown if user has no creator profile)
function OnboardingModal({ currentUser, onComplete }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // Step 0: Dashboard tour
  // Step 1: YouTube
  // Step 2: Instagram
  // Step 3: Corner Nickname
  // Step 4: Payment
  // Step 5: Complete

  const [youtubeHandle, setYoutubeHandle] = useState('');
  const [youtubeValid, setYoutubeValid] = useState(null);
  const [instagramUrl, setInstagramUrl] = useState('');
  const [instagramValid, setInstagramValid] = useState(null);
  const [cornerNickname, setCornerNickname] = useState('');
  const [nicknameValid, setNicknameValid] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handleYoutubeValidate = async () => {
    setLoading(true);
    const result = await validateYouTubeHandle(youtubeHandle);
    setYoutubeValid(result.valid ? { success: true } : { success: false, error: result.error });
    setLoading(false);
  };

  const handleInstagramValidate = async () => {
    if (!instagramUrl.trim()) {
      setInstagramValid(null);
      return;
    }
    setLoading(true);
    const result = await validateInstagramHandle(instagramUrl);
    setInstagramValid(result.valid ? { success: true } : { success: false, error: result.error });
    setLoading(false);
  };

  const handleNicknameValidate = () => {
    const result = validateCreatorsCornerNickname(cornerNickname);
    setNicknameValid(result.valid ? { success: true } : { success: false, error: result.error });
  };

  const isStepComplete = () => {
    switch (step) {
      case 0:
        return true; // tour is always complete
      case 1:
        return youtubeValid?.success;
      case 2:
        if (!instagramUrl.trim()) return true;
        return instagramValid?.success;
      case 3:
        return instagramUrl.trim() ? nicknameValid?.success : true;
      case 4:
        return paymentComplete;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step === 3 && instagramUrl.trim() && !nicknameValid?.success) {
      handleNicknameValidate();
      return;
    }
    if (isStepComplete()) {
      setStep(step + 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // 1. Save creator profile to Firestore
      await setDoc(
        doc(db, 'creators', currentUser.uid),
        {
          youtubeHandle,
          instagramUrl: instagramUrl || null,
          cornerNickname: instagramUrl ? cornerNickname : null,
          onboardingCompleted: true,
          onboardingDate: serverTimestamp(),
          status: 'active',
        },
        { merge: true }
      );

      // 2. Generate AI fanpage if Instagram is provided (fanpage requires Instagram content)
      if (instagramUrl && cornerNickname) {
        try {
          const creatorData = {
            youtubeHandle,
            instagramUrl,
            cornerNickname,
            displayName: currentUser.displayName || cornerNickname,
            paymentLinks: [], // Will be added via dashboard settings later
          };

          setError('Generating your custom fanpage...');
          const fanpageResult = await generateFanpageHTML(creatorData);

          if (fanpageResult.success) {
            // 3. Save generated fanpage to Firestore
            await saveFanpage(currentUser.uid, cornerNickname, fanpageResult.html);
            setError('');
          } else {
            console.warn('Fanpage generation warning:', fanpageResult.error);
            // Don't fail the onboarding if fanpage generation fails
          }
        } catch (fanpageErr) {
          console.error('Fanpage generation error:', fanpageErr);
          // Continue anyway - fanpage generation is secondary
        }
      }

      onComplete();
    } catch (err) {
      console.error('Error saving creator profile:', err);
      setError('Failed to save profile. Please try again.');
    }
    setLoading(false);
  };

  // Load PayPal SDK when we reach payment step
  useEffect(() => {
    if (step === 4 && !paypalLoaded) {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=BAACVz29C_Abgp2SNMII6zRix5largq7DDTUc1DNnG49p8LQOw2ClZGqRlnURBmpOWkkph_8zKeWIut-jw&components=hosted-buttons&enable-funding=venmo&currency=USD';
      script.async = true;
      script.onload = () => {
        setPaypalLoaded(true);
        if (window.paypal) {
          // Clear any existing buttons and render fresh
          const container = document.getElementById('paypal-container-NBD7CEP5TEYXN');
          if (container) {
            container.innerHTML = '';
          }
          window.paypal.HostedButtons({
            hostedButtonId: PAYPAL_BUTTON_ID,
          }).render('#paypal-container-NBD7CEP5TEYXN');
        }
      };
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [step, paypalLoaded]);

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <button
          className="onboarding-close"
          onClick={() => {
            /* can't close until complete */
          }}
          disabled
        >
          ×
        </button>

        {/* Step 0: Welcome tour */}
        {step === 0 && (
          <div className="onboarding-content">
            <h2>Welcome to Your Illy Social Creator Dashboard</h2>
            <div className="tour-cards">
              <div className="tour-card">
                <div className="tour-icon">📊</div>
                <h3>Campaign Manager</h3>
                <p>View and manage all your social media growth campaigns in one place</p>
              </div>
              <div className="tour-card">
                <div className="tour-icon">🎬</div>
                <h3>Creators Corner</h3>
                <p>AI-powered fanpage built from your YouTube & Instagram — auto-generated and deployed</p>
              </div>
              <div className="tour-card">
                <div className="tour-icon">💰</div>
                <h3>Integrations</h3>
                <p>Connect CashApp, PayPal, and other payment links for fan support</p>
              </div>
              <div className="tour-card">
                <div className="tour-icon">💬</div>
                <h3>Fan Messages</h3>
                <p>Let your community leave messages on your Creators Corner fanpage</p>
              </div>
            </div>
            <p className="tour-subtitle">Let's get you set up in 4 quick steps →</p>
          </div>
        )}

        {/* Step 1: YouTube */}
        {step === 1 && (
          <div className="onboarding-content">
            <h2>Step 1: Connect Your YouTube</h2>
            <p>Where does your content live?</p>
            <div className="input-group">
              <input
                type="text"
                placeholder="@YourChannelName"
                value={youtubeHandle}
                onChange={(e) => {
                  setYoutubeHandle(e.target.value);
                  setYoutubeValid(null);
                }}
              />
              <button onClick={handleYoutubeValidate} disabled={loading || !youtubeHandle}>
                {loading ? 'Checking...' : 'Verify'}
              </button>
              {youtubeValid && (
                <span className={`status ${youtubeValid.success ? 'success' : 'error'}`}>
                  {youtubeValid.success ? '✓' : '✗'}
                </span>
              )}
            </div>
            {youtubeValid?.error && <p className="error-text">{youtubeValid.error}</p>}
          </div>
        )}

        {/* Step 2: Instagram */}
        {step === 2 && (
          <div className="onboarding-content">
            <h2>Step 2: Instagram (Optional)</h2>
            <p>Add your public Instagram profile</p>
            <div className="input-group">
              <input
                type="text"
                placeholder="instagram.com/yourprofile"
                value={instagramUrl}
                onChange={(e) => {
                  setInstagramUrl(e.target.value);
                  setInstagramValid(null);
                }}
              />
              {instagramUrl && (
                <button onClick={handleInstagramValidate} disabled={loading}>
                  {loading ? 'Checking...' : 'Verify'}
                </button>
              )}
              {instagramValid && (
                <span className={`status ${instagramValid.success ? 'success' : 'error'}`}>
                  {instagramValid.success ? '✓' : '✗'}
                </span>
              )}
            </div>
            {instagramValid?.error && <p className="error-text">{instagramValid.error}</p>}
            <p className="hint">Leave blank to skip</p>
          </div>
        )}

        {/* Step 3: Corner Nickname */}
        {step === 3 && instagramUrl && (
          <div className="onboarding-content">
            <h2>Step 3: Your Creators Corner</h2>
            <p>Your fanpage URL: illy-ris.com/movie/[your-name]/</p>
            <div className="input-group">
              <input
                type="text"
                placeholder="e.g., YASHHH"
                value={cornerNickname}
                onChange={(e) => {
                  setCornerNickname(e.target.value);
                  setNicknameValid(null);
                }}
              />
              <button onClick={handleNicknameValidate} disabled={!cornerNickname}>
                Check
              </button>
              {nicknameValid && (
                <span className={`status ${nicknameValid.success ? 'success' : 'error'}`}>
                  {nicknameValid.success ? '✓' : '✗'}
                </span>
              )}
            </div>
            {nicknameValid?.error && <p className="error-text">{nicknameValid.error}</p>}
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="onboarding-content">
            <h2>Step 4: Activate Your Creator Profile</h2>
            <p>One-time $5 fee to unlock your Creators Corner & integrations</p>
            <div className="paypal-container">
              <div id="paypal-container-NBD7CEP5TEYXN"></div>
            </div>
            {paypalLoaded && (
              <p style={{ textAlign: 'center', color: '#7c85b8', fontSize: '13px', marginTop: '12px' }}>
                After payment, click below to activate your profile
              </p>
            )}
            <button className="payment-complete-btn" onClick={() => setPaymentComplete(true)}>
              {paypalLoaded ? 'Payment Complete? Click Here' : 'Loading Payment...'}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="onboarding-nav">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="btn-prev">
              ← Back
            </button>
          )}
          {step < 4 && (
            <button onClick={handleNext} disabled={!isStepComplete() || loading} className="btn-next">
              Next →
            </button>
          )}
          {step === 4 && (
            <button onClick={handleComplete} disabled={!paymentComplete || loading} className="btn-complete">
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>
          )}
        </div>

        {error && <p className="onboarding-error">{error}</p>}

        {/* Progress */}
        <div className="progress-dots">
          {[0, 1, 2, 3, 4].map((num) => (
            <div key={num} className={`dot ${num <= step ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Main dashboard
const CreatorsDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, updateSettings, signout } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  // Check if creator has an onboarded profile
  useEffect(() => {
    if (userProfile) {
      setCreatorProfile(userProfile);
      setCheckingProfile(false);
    }
  }, [userProfile]);

  // Hydrate the settings form
  useEffect(() => {
    if (userProfile?.settings) {
      setForm(userProfile.settings);
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSaved(false);
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(form);
      setSaved(true);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signout();
    navigate('/signin', { replace: true });
  };

  const handleOnboardingComplete = () => {
    setCreatorProfile({ onboardingCompleted: true });
  };

  if (!currentUser) return null;
  if (checkingProfile) return null;

  const name = currentUser.displayName || 'Creator';
  const initial = (name[0] || 'C').toUpperCase();
  const hasProfile = creatorProfile?.onboardingCompleted;

  return (
    <div className="dashboard-page">
      {!hasProfile && <OnboardingModal currentUser={currentUser} onComplete={handleOnboardingComplete} />}

      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="dashboard-brand">
            <span className="logo-text">Illy</span>
            <span className="logo-text-accent">social</span>
            <span className="dashboard-tag">Creators Dashboard</span>
          </div>
          <button className="dashboard-signout" onClick={handleSignOut}>
            Sign Out
          </button>
        </header>

        <section className="dashboard-profile">
          {currentUser.photoURL ? (
            <img className="dashboard-avatar" src={currentUser.photoURL} alt={name} referrerPolicy="no-referrer" />
          ) : (
            <div className="dashboard-avatar dashboard-avatar-fallback">{initial}</div>
          )}
          <div>
            <h1 className="dashboard-name">Welcome, {name}</h1>
            <p className="dashboard-email">{currentUser.email}</p>
            <span className="dashboard-provider">Signed in with Google</span>
          </div>
        </section>

        <section className="dashboard-card">
          <h2 className="dashboard-card-title">Your Illy Social Creator Profile</h2>
          <p className="dashboard-card-sub">Manage your Creators Corner, integrations, and campaign settings</p>

          {hasProfile && form && (
            <form className="dashboard-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Display Handle</label>
                <input
                  type="text"
                  name="displayHandle"
                  value={form.displayHandle}
                  onChange={handleChange}
                  placeholder="@yourhandle"
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell the community about yourself"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Primary Platform</label>
                <select name="primaryPlatform" value={form.primaryPlatform} onChange={handleChange}>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <label className="dashboard-toggle">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={form.emailNotifications}
                  onChange={handleChange}
                />
                Email me about engagement activity
              </label>

              <label className="dashboard-toggle">
                <input
                  type="checkbox"
                  name="publicProfile"
                  checked={form.publicProfile}
                  onChange={handleChange}
                />
                Make my creator profile public
              </label>

              <button type="submit" className="submit-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
              {saved && <p className="dashboard-saved">✓ Settings saved</p>}
            </form>
          )}
        </section>

        {hasProfile && (
          <section className="dashboard-card">
            <PaymentLinksManager
              userId={currentUser.uid}
              paymentLinks={userProfile?.paymentLinks || []}
              onUpdate={() => {
                // Refresh profile data
              }}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default CreatorsDashboard;
