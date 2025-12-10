import './App.css';
import React from 'react';
import spotifyLogo from './spotifyLogo.png';
import { useState } from 'react';


function App() {
  //hi
    const [danceability, setDanceability] = useState(0.5);
    const [acousticness, setAcousticness] = useState(0.5);
    const [energy, setEnergy] = useState(0.5);
    const [loudness, setLoudness] = useState(0.5);
    const [speechiness, setSpeechiness] = useState(0.5);
    const [artistInput, setArtistInput] = useState("");

    
    const handleGenerate = () => {
      const dataArray = [
      `Artist: ${artistInput}`,
      `Danceability: ${danceability}`,
      `Acousticness: ${acousticness}`,
      `Energy: ${energy}`,
      `Loudness: ${loudness}`,
      `Speechiness: ${speechiness}`
    ];

    console.log(dataArray); 
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
    className="artist-input"
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
>
  Generate Recommendations
</button>


  


      </header>
    </div>
  );
}

export default App;
