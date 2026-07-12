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
import './CreatorSetup.css';

const PAYPAL_BUTTON_ID = 'NBD7CEP5TEYXN'; // PayPal hosted button

export default function CreatorSetup() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Wizard state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: YouTube
  const [youtubeHandle, setYoutubeHandle] = useState('');
  const [youtubeValid, setYoutubeValid] = useState(null);

  // Step 2: Instagram (optional)
  const [instagramUrl, setInstagramUrl] = useState('');
  const [instagramValid, setInstagramValid] = useState(null);

  // Step 3: Creators Corner Nickname (conditional on Instagram)
  const [cornerNickname, setCornerNickname] = useState('');
  const [nicknameValid, setNicknameValid] = useState(null);

  // Step 4: Payment status
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Validate YouTube handle
  const handleYouTubeValidate = async () => {
    setLoading(true);
    const result = await validateYouTubeHandle(youtubeHandle);
    setYoutubeValid(result.valid ? { success: true } : { success: false, error: result.error });
    setLoading(false);
  };

  // Validate Instagram URL
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

  // Validate nickname
  const handleNicknameValidate = () => {
    const result = validateCreatorsCornerNickname(cornerNickname);
    setNicknameValid(result.valid ? { success: true } : { success: false, error: result.error });
  };

  // Check if current step is complete
  const isStepComplete = () => {
    switch (step) {
      case 1:
        return youtubeValid?.success;
      case 2:
        if (!instagramUrl.trim()) return true; // optional
        return instagramValid?.success;
      case 3:
        return instagramUrl.trim() ? nicknameValid?.success : true; // only required if Instagram
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

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  // Handle payment completion (called after PayPal payment)
  const handlePaymentComplete = async () => {
    setLoading(true);
    try {
      // Save creator profile to Firestore
      const creatorRef = doc(db, 'creators', currentUser.uid);
      await setDoc(
        creatorRef,
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

      setPaymentComplete(true);
      // After a moment, redirect to dashboard
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Error saving creator profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load PayPal script once we reach step 4
  useEffect(() => {
    if (step === 4) {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AZDxjDScFpQtjWTOUtWKbyN_bDt5Qs30l2ijabxV5OlqaH0hqrHIqrzQDvW08zxsuR979-8DNyVzXwpa';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [step]);

  return (
    <div className="creator-setup">
      <div className="setup-container">
        <div className="setup-header">
          <h1>Creator Onboarding</h1>
          <p>Activate your Illy Social R&D Labs — connect your YouTube & Instagram, then launch your custom Creators Corner fanpage</p>
        </div>

        {error && <div className="setup-error">{error}</div>}

        {/* Step 1: YouTube */}
        {step >= 1 && (
          <div className={`setup-step ${step === 1 ? 'active' : 'completed'}`}>
            <div className="step-number">1</div>
            <div className="step-content">
              <h2>Step 1: Your YouTube Channel</h2>
              <p>Where your content lives. Enter your YouTube handle.</p>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="@YourChannelName"
                  value={youtubeHandle}
                  onChange={(e) => {
                    setYoutubeHandle(e.target.value);
                    setYoutubeValid(null);
                  }}
                  disabled={step !== 1}
                />
                {step === 1 && (
                  <button onClick={handleYouTubeValidate} disabled={loading || !youtubeHandle}>
                    {loading ? 'Checking...' : 'Verify'}
                  </button>
                )}
                {youtubeValid && (
                  <span className={`status ${youtubeValid.success ? 'success' : 'error'}`}>
                    {youtubeValid.success ? '✓' : '✗'}
                  </span>
                )}
              </div>
              {youtubeValid?.error && <p className="error-text">{youtubeValid.error}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Instagram (optional) */}
        {step >= 2 && (
          <div className={`setup-step ${step === 2 ? 'active' : 'completed'}`}>
            <div className="step-number">2</div>
            <div className="step-content">
              <h2>Step 2: Instagram Profile (Optional)</h2>
              <p>Connect your audience. Leave blank to skip.</p>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="instagram.com/yourprofile or @yourprofile"
                  value={instagramUrl}
                  onChange={(e) => {
                    setInstagramUrl(e.target.value);
                    setInstagramValid(null);
                  }}
                  disabled={step !== 2}
                />
                {step === 2 && instagramUrl && (
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
              <p className="hint">Leave blank to skip. You can add this later.</p>
            </div>
          </div>
        )}

        {/* Step 3: Creators Corner Nickname (conditional) */}
        {step >= 3 && instagramUrl && (
          <div className={`setup-step ${step === 3 ? 'active' : 'completed'}`}>
            <div className="step-number">3</div>
            <div className="step-content">
              <h2>Step 3: Your Creators Corner</h2>
              <p>Custom fanpage powered by Illy R&D Labs AI. URL: illy-ris.com/movie/[your-name]/</p>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="e.g., YASHHH"
                  value={cornerNickname}
                  onChange={(e) => {
                    setCornerNickname(e.target.value);
                    setNicknameValid(null);
                  }}
                  disabled={step !== 3}
                  maxLength="30"
                />
                {step === 3 && (
                  <button onClick={handleNicknameValidate} disabled={!cornerNickname}>
                    Check
                  </button>
                )}
                {nicknameValid && (
                  <span className={`status ${nicknameValid.success ? 'success' : 'error'}`}>
                    {nicknameValid.success ? '✓' : '✗'}
                  </span>
                )}
              </div>
              {nicknameValid?.error && <p className="error-text">{nicknameValid.error}</p>}
              <p className="hint">Letters, numbers, underscores, hyphens only. 2-30 characters.</p>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step >= 4 && (
          <div className={`setup-step ${step === 4 ? 'active' : 'completed'}`}>
            <div className="step-number">4</div>
            <div className="step-content">
              <h2>Step 4: Complete Your Setup</h2>
              <p>One-time $5 fee unlocks your custom Creators Corner, AI-powered by your YouTube & Instagram</p>

              {!paymentComplete ? (
                <div className="paypal-container">
                  <div id="paypal-container-NBD7CEP5TEYXN"></div>
                  <script
                    dangerouslySetInnerHTML={{
                      __html: `
                        if (window.paypal) {
                          paypal.HostedButtons({
                            hostedButtonId: "${PAYPAL_BUTTON_ID}",
                            onComplete: () => {
                              window.dispatchEvent(new CustomEvent('paymentComplete'));
                            }
                          }).render("#paypal-container-NBD7CEP5TEYXN");
                        }
                      `,
                    }}
                  />
                </div>
              ) : (
                <div className="payment-success">
                  <p>✓ Payment complete! Your profile is being set up...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="setup-nav">
          {step > 1 && (
            <button onClick={handlePrev} className="btn-prev" disabled={paymentComplete}>
              ← Previous
            </button>
          )}
          {step < 4 && (
            <button
              onClick={handleNext}
              className="btn-next"
              disabled={!isStepComplete() || loading}
            >
              Next →
            </button>
          )}
        </div>

        {/* Progress indicator */}
        <div className="progress-bar">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`progress-dot ${num <= step ? 'active' : ''}`}
              onClick={() => num < step && setStep(num)}
            />
          ))}
        </div>
      </div>

      {/* Listen for PayPal completion */}
      {step === 4 && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('paymentComplete', () => {
                setTimeout(() => {
                  const event = new CustomEvent('creatorPaymentComplete');
                  window.dispatchEvent(event);
                }, 500);
              });
            `,
          }}
        />
      )}
    </div>
  );
}
