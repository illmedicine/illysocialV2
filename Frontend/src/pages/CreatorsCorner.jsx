import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFanpage } from '../services/fanpageService';
import { sendMessage, subscribeToMessages } from '../services/messageService';
import './CreatorsCorner.css';

const MessageBoard = ({ cornerNickname }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);

  useEffect(() => {
    setLoadingMessages(true);
    const unsubscribe = subscribeToMessages(cornerNickname, (msgs) => {
      setMessages(msgs || []);
      setLoadingMessages(false);
    });
    return unsubscribe;
  }, [cornerNickname]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    const result = await sendMessage(cornerNickname, newMessage, senderName);
    if (result.success) {
      setNewMessage('');
      setSenderName('');
    } else {
      alert('Failed to send message. Please try again.');
    }
    setSending(false);
  };

  return (
    <div className="message-board">
      <h2>Fan Messages</h2>

      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Your name (optional)"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          maxLength="50"
          disabled={sending}
        />
        <textarea
          placeholder="Leave a message for the creator..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          maxLength="500"
          disabled={sending}
          rows={3}
        />
        <button type="submit" disabled={!newMessage.trim() || sending} className="send-btn">
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <div className="messages-list">
        {loadingMessages ? (
          <p className="loading-text">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="empty-text">No messages yet. Be the first to leave a message!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message-item">
              <div className="message-header">
                <strong className="sender-name">{msg.senderName}</strong>
                <span className="message-time">
                  {msg.createdAt
                    ? new Date(msg.createdAt.toDate?.() || msg.createdAt).toLocaleDateString()
                    : 'just now'}
                </span>
              </div>
              <p className="message-text">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

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
    <div className="fanpage-page">
      {fanpage && fanpage.html && (
        <>
          <div className="fanpage-container">
            <iframe
              title={`${nickname}'s Creators Corner`}
              srcDoc={fanpage.html}
              className="fanpage-iframe"
            />
          </div>
          <MessageBoard cornerNickname={nickname} />
        </>
      )}
    </div>
  );
};

export default CreatorsCorner;
