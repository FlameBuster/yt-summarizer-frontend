import React, { useState, useRef } from 'react';
import axios from 'axios';
import he from 'he';
import LoadingBar from 'react-top-loading-bar';
import './App.css'; // Make sure the CSS file is imported

function App() {
  const [videoURL, setVideoURL] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadingBarRef = useRef(null);

  const handleSummarize = async () => {
    if (!videoURL) return;

    setLoading(true);
    setError(null);
    setSummary('');
    loadingBarRef.current.continuousStart();

    try {
      const response = await axios.post('https://yt-summarizer-nhhe.onrender.com/summarize', { url: videoURL });
      setSummary(response.data.summary);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('An error occurred while summarizing the video.');
      }
    }
    
    loadingBarRef.current.complete();
    setLoading(false);
  };

  return (
    <div className="container">
      {/* Loading bar */}
      <LoadingBar color="#f11946" ref={loadingBarRef} />

      <h1>YouTube Lecture Summariser</h1>
      
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter YouTube video URL"
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
        />
        <button onClick={handleSummarize} disabled={loading}>
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {summary && (
        <div className="summary-container">
          <h2 className="summary-title">Summary:</h2>
          <div className="summary-bubble">
            <p>{he.decode(summary)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
