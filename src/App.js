import React, { useState, useRef } from 'react';
import axios from 'axios';
import he from 'he';
import LoadingBar from 'react-top-loading-bar'; // Import the loading bar

function App() {
  const [videoURL, setVideoURL] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadingBarRef = useRef(null); // Create a reference for the loading bar

  const handleSummarize = async () => {
    if (!videoURL) return;

    setLoading(true);
    setError(null);
    setSummary('');
    loadingBarRef.current.continuousStart(); // Start the loading bar

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
    
    loadingBarRef.current.complete(); // Complete the loading bar
    setLoading(false);
  };

  return (
    <div style={{ padding: '50px' }}>
      {/* Loading bar component */}
      <LoadingBar color="#f11946" ref={loadingBarRef} />

      <h1>YouTube Lecture Summariser</h1>
      <input
        type="text"
        placeholder="Enter YouTube video URL"
        value={videoURL}
        onChange={(e) => setVideoURL(e.target.value)}
        style={{ width: '60%', padding: '10px', fontSize: '16px' }}
      />
      <button onClick={handleSummarize} disabled={loading} style={{ padding: '10px', marginLeft: '10px' }}>
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>
      
      {error && (
        <div style={{ marginTop: '30px', color: 'red' }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
      {summary && (
        <div style={{ marginTop: '30px' }}>
          <h2>Summary:</h2>
          <p>{he.decode(summary)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
