import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFanpage } from '../services/fanpageService';
import './CreatorsCorner.css';

const CreatorsCorner = () => {
  const { nickname } = useParams();
  const [fanpage, setFanpage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFanpage = async () => {
      if (!nickname) {
        setError('Invalid fanpage URL');
        setLoading(false);
        return;
      }

      const result = await getFanpage(nickname);
      if (result.success) {
        setFanpage(result.fanpage);
      } else {
        setError(result.error || 'Fanpage not found');
      }
      setLoading(false);
    };

    loadFanpage();
  }, [nickname]);

  if (loading) {
    return (
      <div className="fanpage-loading">
        <div className="spinner"></div>
        <p>Loading creator's fanpage...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fanpage-error">
        <h2>Oops! Fanpage Not Found</h2>
        <p>{error}</p>
        <a href="/" className="back-link">← Back to Illy Social</a>
      </div>
    );
  }

  return (
    <div className="fanpage-container">
      {fanpage && fanpage.html && (
        <iframe
          title={`${nickname}'s Creators Corner`}
          srcDoc={fanpage.html}
          className="fanpage-iframe"
        />
      )}
    </div>
  );
};

export default CreatorsCorner;
