import { useState, useEffect } from 'react';

const DiscordStats = () => {
  // Illy Social stats (49 - 1,300 active range)
  const [illyStats, setIllyStats] = useState({
    totalMembers: 1343,
    activeMembers: 650
  });

  // Content Creators Cabin stats (5,000 - 15,000 active range)
  const [cabinStats, setCabinStats] = useState({
    totalMembers: 32946,
    activeMembers: 8500
  });

  // YouTube Creator Café stats (7,041 - 48,980 active range)
  const [ytCafeStats, setYtCafeStats] = useState({
    totalMembers: 71166,
    activeMembers: 28500
  });

  // Simulate realtime updates for Illy Social (49 - 1,300 range)
  useEffect(() => {
    const interval = setInterval(() => {
      setIllyStats(prev => ({
        ...prev,
        activeMembers: Math.max(
          49,
          Math.min(1300, prev.activeMembers + Math.floor(Math.random() * 100) - 50)
        )
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate realtime updates for Content Creators Cabin (5,000 - 15,000 range)
  useEffect(() => {
    const interval = setInterval(() => {
      setCabinStats(prev => ({
        ...prev,
        activeMembers: Math.max(
          5000,
          Math.min(15000, prev.activeMembers + Math.floor(Math.random() * 500) - 250)
        ),
        totalMembers: prev.totalMembers + (Math.random() > 0.85 ? 1 : 0)
      }));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Simulate realtime updates for YouTube Creator Café (7,041 - 48,980 range)
  useEffect(() => {
    const interval = setInterval(() => {
      setYtCafeStats(prev => ({
        ...prev,
        activeMembers: Math.max(
          7041,
          Math.min(48980, prev.activeMembers + Math.floor(Math.random() * 2000) - 1000)
        ),
        totalMembers: prev.totalMembers + (Math.random() > 0.85 ? 1 : 0)
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="discord" className="section discord-section">
      <div className="discord-header-logo">
        <span className="illy-logo-text-large">illysocial</span>
      </div>
      <h2 className="discord-page-title">Discord Partners Network</h2>
      
      <div className="discord-cards-container">
        {/* Illy Social Featured Card */}
        <div className="discord-card featured-card">
          <div className="listing-header">
            <span className="listing-title">Featured Server</span>
            <a href="https://discordservers.com/server/1459252801464041554/view" target="_blank" rel="noopener noreferrer" className="view-link">
              View on DiscordServers
            </a>
          </div>
          
          <div className="server-info cafe-info">
            <div className="cafe-logo illy-logo">
              <span className="illy-logo-text">illysocial</span>
            </div>
            <div className="server-details">
              <h4>Illy Social</h4>
              <p className="cafe-tagline">Welcome to IllySocial, the premier ecosystem where high-performance digital creation meets professionalized audience engagement. A revolutionary bridge between independent creators and a global network of verified engagers.</p>
            </div>
          </div>
          
          <div className="stats-badges cafe-badges">
            <span className="stat-badge members">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              <strong>{illyStats.totalMembers.toLocaleString()}</strong> members
            </span>
            <span className="stat-badge youtube-tag">Youtube</span>
          </div>

          <div className="live-stats-container">
            <span className="live-indicator">
              <span className="live-dot"></span>
              LIVE
            </span>
            <span className="live-count">
              <strong>{illyStats.activeMembers.toLocaleString()}</strong> active now
            </span>
          </div>
          
          <div className="cafe-actions">
            <a 
              href="https://discord.gg/VNbTgEZgbW" 
              target="_blank" 
              rel="noopener noreferrer"
              className="discord-join-btn cafe-join"
            >
              Join Server
            </a>
            <button className="bump-btn">Bump Server</button>
          </div>

          <div className="share-row">
            <span className="share-label">Share:</span>
            <div className="share-icons">
              <a href="#" className="share-icon facebook">
                <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="share-icon twitter">
                <svg viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="share-icon reddit">
                <svg viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Content Creators Cabin Card */}
        <div className="discord-card featured-card">
          <div className="listing-header">
            <span className="listing-title">Featured Server</span>
            <a href="https://discordservers.com/server/677565751741251585/view" target="_blank" rel="noopener noreferrer" className="view-link">
              View on DiscordServers
            </a>
          </div>
          
          <div className="server-info cafe-info">
            <div className="cafe-logo cabin-logo">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <div className="server-details">
              <h4>Content Creators Cabin</h4>
              <p className="cafe-tagline">Connect, Collaborate & Grow with fellow YouTubers, Twitch Streamers, TikTokers and all content creators! Unite & Thrive!</p>
            </div>
          </div>
          
          <div className="stats-badges cafe-badges">
            <span className="stat-badge members">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              <strong>{cabinStats.totalMembers.toLocaleString()}</strong> members
            </span>
            <span className="stat-badge youtube-tag">Advertise</span>
          </div>

          <div className="live-stats-container">
            <span className="live-indicator">
              <span className="live-dot"></span>
              LIVE
            </span>
            <span className="live-count">
              <strong>{cabinStats.activeMembers.toLocaleString()}</strong> active now
            </span>
          </div>
          
          <div className="cafe-actions">
            <a 
              href="https://discord.gg/VNbTgEZgbW" 
              target="_blank" 
              rel="noopener noreferrer"
              className="discord-join-btn cafe-join"
            >
              Join Server
            </a>
            <button className="bump-btn">Bump Server</button>
          </div>

          <div className="share-row">
            <span className="share-label">Share:</span>
            <div className="share-icons">
              <a href="#" className="share-icon facebook">
                <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="share-icon twitter">
                <svg viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="share-icon reddit">
                <svg viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* YouTube Creator Café Card */}
        <div className="discord-card youtube-cafe-card">
          <div className="listing-header">
            <span className="listing-title">Featured Server</span>
            <a href="https://discordservers.com/server/686001142236446763/view" target="_blank" rel="noopener noreferrer" className="view-link">
              View on DiscordServers
            </a>
          </div>
          
          <div className="server-info cafe-info">
            <div className="cafe-logo">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </div>
            <div className="server-details">
              <h4>YouTube Creator Café</h4>
              <p className="cafe-tagline">A Discord for YouTubers and Streamers! Discuss, get advice, share content, attend workshops, share and grow together!</p>
            </div>
          </div>
          
          <div className="stats-badges cafe-badges">
            <span className="stat-badge members">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              <strong>{ytCafeStats.totalMembers.toLocaleString()}</strong> members
            </span>
            <span className="stat-badge youtube-tag">Youtube</span>
          </div>

          <div className="live-stats-container">
            <span className="live-indicator">
              <span className="live-dot"></span>
              LIVE
            </span>
            <span className="live-count">
              <strong>{ytCafeStats.activeMembers.toLocaleString()}</strong> active now
            </span>
          </div>
          
          <div className="cafe-actions">
            <a 
              href="https://discord.gg/VNbTgEZgbW" 
              target="_blank" 
              rel="noopener noreferrer"
              className="discord-join-btn cafe-join"
            >
              Join Server
            </a>
            <button className="bump-btn">Bump Server</button>
          </div>

          <div className="share-row">
            <span className="share-label">Share:</span>
            <div className="share-icons">
              <a href="#" className="share-icon facebook">
                <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="share-icon twitter">
                <svg viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="share-icon reddit">
                <svg viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="discord-partner-cta">
        <a href="https://discord.gg/VNbTgEZgbW" target="_blank" rel="noopener noreferrer" className="partner-link">
          Become a Discord Partner
        </a>
      </div>
    </section>
  );
};

export default DiscordStats;
