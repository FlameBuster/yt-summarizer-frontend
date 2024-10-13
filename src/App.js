// src/App.js

import React, { useState } from "react";
import axios from "axios";
import he from "he";
import "./App.css"; // Import the App.css file

function App() {
  const [videoURL, setVideoURL] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async () => {
    if (!videoURL) return;

    setLoading(true);
    setError(null);
    setSummary("");

    try {
      const response = await axios.post(
        "yt-summarizer-backend-production.up.railway.app/summarize",
        {
          url: videoURL,
        }
      );
      setSummary(response.data.summary);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred while summarizing the video.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>YouTube Lecture Summariser</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter YouTube video URL"
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
        />
        <button onClick={handleSummarize} disabled={loading}>
          {loading ? "Summarizing..." : "Summarize"}
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
