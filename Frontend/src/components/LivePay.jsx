import { useState, useEffect } from 'react';
import './LivePay.css';

// Simulated data value calculations based on typical user activity
const calculateDataValue = (userData) => {
  // Base values per data type (estimated market rates)
  const dataRates = {
    searchHistory: 0.005, // per search
    socialMedia: 0.002, // per post/interaction
    locationData: 0.01, // per location point
    purchaseHistory: 0.05, // per purchase
    browsing: 0.001, // per page view
    emailActivity: 0.003, // per email interaction
    demographics: 0.25, // base value for demographic profile
  };

  let total = 0;
  
  // Calculate estimated monthly data value
  total += (userData.dailySearches || 15) * 30 * dataRates.searchHistory;
  total += (userData.socialInteractions || 50) * 30 * dataRates.socialMedia;
  total += (userData.locationPoints || 100) * 30 * dataRates.locationData;
  total += (userData.monthlyPurchases || 10) * dataRates.purchaseHistory;
  total += (userData.dailyPageViews || 100) * 30 * dataRates.browsing;
  total += (userData.dailyEmails || 20) * 30 * dataRates.emailActivity;
  total += dataRates.demographics;

  return total;
};

const LivePay = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [prototypeAcknowledged, setPrototypeAcknowledged] = useState(false);
  const [signPetition, setSignPetition] = useState(false);
  const [userData, setUserData] = useState({
    dailySearches: 15,
    socialInteractions: 50,
    locationPoints: 100,
    monthlyPurchases: 10,
    dailyPageViews: 100,
    dailyEmails: 20,
  });
  const [walletValue, setWalletValue] = useState(0);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [petitionSubmitted, setPetitionSubmitted] = useState(false);

  // Calculate data value when userData changes
  useEffect(() => {
    const value = calculateDataValue(userData);
    setWalletValue(value);
  }, [userData]);

  // Animate the wallet value
  useEffect(() => {
    if (currentStep === 5 && prototypeAcknowledged) {
      const targetValue = walletValue;
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = targetValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          setAnimatedValue(targetValue);
          clearInterval(timer);
        } else {
          setAnimatedValue(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [currentStep, prototypeAcknowledged, walletValue]);

  const handlePetitionSubmit = async () => {
    if (!signPetition) return;
    
    setIsLoading(true);
    
    // Simulate petition submission to LivePay-Petition-Suppot
    // In production, this would call the actual petition API
    try {
      // Simulated API call to petition backend
      // The actual implementation would integrate with:
      // https://github.com/illmedicine/LivePay-Petition-Suppot
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPetitionSubmitted(true);
      console.log('Petition signed! Data submitted to Fair Data Act petition.');
    } catch (error) {
      console.error('Error submitting petition:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 4) {
      if (!prototypeAcknowledged) {
        alert('Please acknowledge that you understand this is a prototype before continuing.');
        return;
      }
      // Handle petition submission if checked
      if (signPetition) {
        handlePetitionSubmit();
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSliderChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: parseInt(value) }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="livepay-step">
            <div className="step-icon">💰</div>
            <h2>Welcome to LivePay</h2>
            <div className="prototype-banner">
              <span className="prototype-badge">PHASE 1 PROTOTYPE</span>
            </div>
            <p className="step-description">
              <strong>Discover the Real Value of Your Data</strong>
            </p>
            <p className="step-text">
              Every day, tech companies collect and sell your personal data worth billions of dollars — 
              yet you receive nothing in return. LivePay is a prototype designed to show you the actual 
              monetary value of your digital footprint.
            </p>
            <div className="info-box">
              <h4>🎯 Phase 1 Goals:</h4>
              <ul>
                <li>Show users the real-time value of their data</li>
                <li>Build support for the Fair Data Act petition to Congress</li>
                <li>Inspire millions to demand fair data transparency</li>
              </ul>
            </div>
            <p className="disclaimer">
              <strong>Important:</strong> This is a demonstration prototype. No actual payments will be made 
              during Phase 1. Our goal is to raise awareness and gather support for legislation that would 
              require fair compensation for your data.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="livepay-step">
            <div className="step-icon">📊</div>
            <h2>Your Data Value Calculator</h2>
            <p className="step-description">
              Adjust the sliders to estimate your typical online activity. Watch how your data value changes in real-time.
            </p>
            
            <div className="data-calculator">
              <div className="calculator-item">
                <label>Daily Web Searches: <span className="value-display">{userData.dailySearches}</span></label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={userData.dailySearches}
                  onChange={(e) => handleSliderChange('dailySearches', e.target.value)}
                />
              </div>
              
              <div className="calculator-item">
                <label>Daily Social Media Interactions: <span className="value-display">{userData.socialInteractions}</span></label>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  value={userData.socialInteractions}
                  onChange={(e) => handleSliderChange('socialInteractions', e.target.value)}
                />
              </div>

              <div className="calculator-item">
                <label>Daily Location Points Tracked: <span className="value-display">{userData.locationPoints}</span></label>
                <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  value={userData.locationPoints}
                  onChange={(e) => handleSliderChange('locationPoints', e.target.value)}
                />
              </div>

              <div className="calculator-item">
                <label>Monthly Online Purchases: <span className="value-display">{userData.monthlyPurchases}</span></label>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={userData.monthlyPurchases}
                  onChange={(e) => handleSliderChange('monthlyPurchases', e.target.value)}
                />
              </div>

              <div className="calculator-item">
                <label>Daily Pages Viewed: <span className="value-display">{userData.dailyPageViews}</span></label>
                <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  value={userData.dailyPageViews}
                  onChange={(e) => handleSliderChange('dailyPageViews', e.target.value)}
                />
              </div>

              <div className="calculator-item">
                <label>Daily Email Interactions: <span className="value-display">{userData.dailyEmails}</span></label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={userData.dailyEmails}
                  onChange={(e) => handleSliderChange('dailyEmails', e.target.value)}
                />
              </div>
            </div>

            <div className="estimated-value-preview">
              <p>Estimated Monthly Data Value:</p>
              <span className="value-amount">${walletValue.toFixed(2)}</span>
              <p className="value-annual">That&apos;s <strong>${(walletValue * 12).toFixed(2)}</strong> per year!</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="livepay-step">
            <div className="step-icon">📜</div>
            <h2>The Fair Data Act</h2>
            <p className="step-description">
              Learn about the legislation we&apos;re fighting for.
            </p>
            
            <div className="policy-section">
              <h3>Data Ownership & Fair Revenue Act</h3>
              <p>
                The data economy generates over <strong>$250 billion annually</strong> in the United States alone, 
                yet the individuals who create this data see none of the profits.
              </p>
              
              <div className="policy-points">
                <div className="policy-point">
                  <span className="point-icon">✓</span>
                  <div>
                    <strong>Data Ownership Rights</strong>
                    <p>You should own your personal data and control how it&apos;s used.</p>
                  </div>
                </div>
                
                <div className="policy-point">
                  <span className="point-icon">✓</span>
                  <div>
                    <strong>Transparency Requirements</strong>
                    <p>Companies must disclose what data they collect and its market value.</p>
                  </div>
                </div>
                
                <div className="policy-point">
                  <span className="point-icon">✓</span>
                  <div>
                    <strong>Fair Compensation</strong>
                    <p>When your data is sold, you should receive fair payment.</p>
                  </div>
                </div>
                
                <div className="policy-point">
                  <span className="point-icon">✓</span>
                  <div>
                    <strong>Opt-Out Rights</strong>
                    <p>Easy ability to opt out of data collection entirely.</p>
                  </div>
                </div>
              </div>

              <div className="petition-info">
                <p>
                  <strong>Our Goal:</strong> Gather 1 million signatures to present to Congress 
                  and demand legislation that protects your data rights.
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="livepay-step">
            <div className="step-icon">✅</div>
            <h2>Acknowledgment & Action</h2>
            <p className="step-description">
              Please review and confirm the following before viewing your data wallet.
            </p>
            
            <div className="acknowledgment-section">
              <div className={`checkbox-card mandatory ${prototypeAcknowledged ? 'checked' : ''}`}>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={prototypeAcknowledged}
                    onChange={(e) => setPrototypeAcknowledged(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <div className="checkbox-content">
                    <strong>I Understand This Is A Prototype</strong>
                    <span className="required-badge">Required</span>
                    <p>
                      I acknowledge that LivePay Phase 1 is a demonstration prototype designed to 
                      show the value of my data. No actual payments will be made at this time. 
                      The purpose is to build awareness and support for fair data legislation.
                    </p>
                  </div>
                </label>
              </div>

              <div className={`checkbox-card optional ${signPetition ? 'checked' : ''}`}>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={signPetition}
                    onChange={(e) => setSignPetition(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <div className="checkbox-content">
                    <strong>Sign the Fair Data Act Petition</strong>
                    <span className="optional-badge">Optional</span>
                    <p>
                      I want to add my voice to the petition urging Congress to pass the 
                      Data Ownership & Fair Revenue Act. My signature will be recorded 
                      to support this important cause.
                    </p>
                    {signPetition && (
                      <div className="petition-note">
                        <span>🎉</span> Thank you for supporting data rights! Your signature will be 
                        submitted when you proceed.
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {!prototypeAcknowledged && (
              <div className="warning-message">
                <span>⚠️</span> You must acknowledge the prototype disclaimer to continue.
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="livepay-step wallet-step">
            <div className="wallet-container">
              <div className="wallet-header">
                <div className="wallet-icon">💎</div>
                <h2>Your Data Wallet</h2>
                <div className="prototype-label">PROTOTYPE VIEW</div>
              </div>
              
              <div className="wallet-balance">
                <p className="balance-label">Estimated Monthly Value</p>
                <div className="balance-amount">
                  <span className="currency">$</span>
                  <span className="amount">{animatedValue.toFixed(2)}</span>
                </div>
                <p className="balance-annual">
                  Annual Projection: <strong>${(walletValue * 12).toFixed(2)}</strong>
                </p>
              </div>

              <div className="wallet-breakdown">
                <h3>Value Breakdown</h3>
                <div className="breakdown-items">
                  <div className="breakdown-item">
                    <span className="item-label">🔍 Search Data</span>
                    <span className="item-value">${(userData.dailySearches * 30 * 0.005).toFixed(2)}/mo</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="item-label">📱 Social Activity</span>
                    <span className="item-value">${(userData.socialInteractions * 30 * 0.002).toFixed(2)}/mo</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="item-label">📍 Location Data</span>
                    <span className="item-value">${(userData.locationPoints * 30 * 0.01).toFixed(2)}/mo</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="item-label">🛒 Purchase History</span>
                    <span className="item-value">${(userData.monthlyPurchases * 0.05).toFixed(2)}/mo</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="item-label">🌐 Browsing Data</span>
                    <span className="item-value">${(userData.dailyPageViews * 30 * 0.001).toFixed(2)}/mo</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="item-label">✉️ Email Activity</span>
                    <span className="item-value">${(userData.dailyEmails * 30 * 0.003).toFixed(2)}/mo</span>
                  </div>
                </div>
              </div>

              {petitionSubmitted && (
                <div className="petition-success">
                  <span>🎉</span>
                  <p><strong>Thank you for signing the Fair Data Act Petition!</strong></p>
                  <p>Your voice matters in the fight for data rights.</p>
                </div>
              )}

              <div className="wallet-disclaimer">
                <p>
                  <strong>⚠️ Prototype Disclaimer:</strong> This is a Phase 1 demonstration. 
                  The values shown are estimates based on industry data valuations. 
                  No actual payments are processed during this prototype phase. 
                  Our mission is to show you the value of your data and build support 
                  for legislation that would make fair compensation a reality.
                </p>
              </div>

              <div className="wallet-actions">
                <a 
                  href="https://illmedicine.github.io/LivePay-Petition-Suppot/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-btn primary"
                >
                  Learn More About the Fair Data Act
                </a>
                <button onClick={onClose} className="action-btn secondary">
                  Close Wallet
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="livepay-overlay" onClick={onClose}>
      <div className="livepay-modal" onClick={(e) => e.stopPropagation()}>
        <button className="livepay-close" onClick={onClose}>×</button>
        
        <div className="livepay-progress">
          {[1, 2, 3, 4, 5].map((step) => (
            <div 
              key={step} 
              className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
            >
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Welcome'}
                {step === 2 && 'Calculator'}
                {step === 3 && 'Fair Data Act'}
                {step === 4 && 'Confirm'}
                {step === 5 && 'Wallet'}
              </div>
            </div>
          ))}
          <div 
            className="progress-line" 
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          ></div>
        </div>

        <div className="livepay-content">
          {renderStep()}
        </div>

        <div className="livepay-navigation">
          {currentStep > 1 && currentStep < 5 && (
            <button className="nav-btn back" onClick={handleBack}>
              ← Back
            </button>
          )}
          {currentStep < 5 && (
            <button 
              className={`nav-btn next ${currentStep === 4 && !prototypeAcknowledged ? 'disabled' : ''}`}
              onClick={handleNext}
              disabled={currentStep === 4 && !prototypeAcknowledged}
            >
              {isLoading ? 'Processing...' : currentStep === 4 ? 'View My Data Wallet' : 'Continue →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePay;
