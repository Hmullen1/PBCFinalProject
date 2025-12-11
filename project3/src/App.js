import './App.css';
import React from 'react';
import spotifyLogo from './spotifyLogo.png';
import { useState } from 'react';
import { getSimilarArtistsTopTracks } from './api';


function App() {
    const [danceability, setDanceability] = useState(0.5);
    const [acousticness, setAcousticness] = useState(0.5);
    const [energy, setEnergy] = useState(0.5);
    const [loudness, setLoudness] = useState(0.5);
    const [speechiness, setSpeechiness] = useState(0.5);
    const [artistInput, setArtistInput] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    

    
    const handleGenerate = async () => {
    if (!artistInput.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500); 
      return;
    }
    setLoading(true);
    
    const target = {
    danceability: parseFloat(danceability),
    acousticness: parseFloat(acousticness),
    energy: parseFloat(energy),
    loudness: parseFloat(loudness),
    speechiness: parseFloat(speechiness),
  };

  try {
    const results = await getSimilarArtistsTopTracks(artistInput, target);

    if (results.length === 0) {
      setShake(true);
      setTimeout(() => setShake(false), 1000);
      setRecommendations([]);
    } else {
      setShake(false);
      setRecommendations(results);
    }
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    setRecommendations([]);
  } finally {
    setLoading(false);
  }
};

  return (

    <div className="App">
      <p className = "title">
          Spotify Song Recommender
        </p>
      <header className="App-header">
        <img src={spotifyLogo} className="App-logo" alt="logo" />



  <div className="artist-input-block">
  <input
    type="text"
    placeholder="Enter artist name..."
    value={artistInput}
    onChange={(e) => setArtistInput(e.target.value)}
    className={`artist-input ${shake ? 'shake' : ''}`}
  />
</div>
        
  <div className="sliders-container"> 

  <div className="feature-block">
    <div className="feature-pill">
      Danceability
    </div>

    <div className="feature-value">
      {danceability}
    </div>

    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={danceability}
      onChange={(e) => setDanceability(e.target.value)}
      className="feature-slider"
    />


  </div>

  <div className="feature-block">
  <div className="feature-pill">Acousticness</div>
  <div className="feature-value">{acousticness}</div>
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={acousticness}
    onChange={(e) => setAcousticness(e.target.value)}
    className="feature-slider"
  />
  </div>

  <div className="feature-block">
  <div className="feature-pill">Energy</div>
  <div className="feature-value">{energy}</div>
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={energy}
    onChange={(e) => setEnergy(e.target.value)}
    className="feature-slider"
  />
</div>



<div className="feature-block">
  <div className="feature-pill">Loudness</div>
  <div className="feature-value">{loudness}</div>
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={loudness}
    onChange={(e) => setLoudness(e.target.value)}
    className="feature-slider"
  />
</div>

<div className="feature-block">
  <div className="feature-pill">Speechiness</div>
  <div className="feature-value">{speechiness}</div>
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={speechiness}
    onChange={(e) => setSpeechiness(e.target.value)}
    className="feature-slider"
  />
</div>


<div className="sliders-container"> 
</div>
</div>

<button 
  className="generate-button" 
  onClick={handleGenerate}
  disabled={loading}
>
  {loading ? <span className="loading-spinner"></span> : "Generate Recommendations"}
</button>

    <div className="results">
      {recommendations.length > 0 && (
        <ol className="recommendation-list">
          {recommendations.map((r, index) => (
            <li key={index} className="recommendation-item">
              <a href={r.url} target="_blank" rel="noreferrer" className="recommendation-link">
                <img src={r.albumImage} alt={`${r.name} album cover`} className="album-cover" />
                <div className="track-info">
                  <div className="track-title">{r.name}</div>
                  <div className="track-artist">{r.artist}</div>
                  <div className="match-percentage">{r.matchPercent.toFixed(2)}%</div>
                </div>
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
      </header>
    </div>
  );
}

export default App;
