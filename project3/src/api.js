const LASTFM_API_KEY = "765b398a184f12f2d3b4e75536e62641"; 
let SPOTIFY_TOKEN = "BQBBr4wt-DFdPomd_7i3Cf-P4gASO0cnolOHbabug1afonOGzo9w_-A91waL6U9zd7gpKTySt29QhrnkfzOAShwtZ9yZ3Hbsa1huDZIQ2c051xizYN1Y_va8XjgZ0BJfIh7NB1Wd708";  // Replace with your Spotify OAuth token
const SOUNDCHARTS_APP_ID = "HHUNTER-API_497A5641"; 
const SOUNDCHARTS_API_KEY = "fb47bdcfad423799"; 

const clientId = "85dd9e2f2c124269a43e0a51c4f4d951";
const clientSecret = "761a599959004d55849b1d5ba8bd35ff";

function normalizeLoudness(dB) {
  return (dB + 60) / 60;
}

function computeMatchPercentage(attrs, target) {
  const normalizedAttrs = {
    danceability: attrs.danceability,
    energy: attrs.energy,
    acousticness: attrs.acousticness,
    speechiness: attrs.speechiness,
    loudness: normalizeLoudness(attrs.loudness ?? -60)
  };

  let diffSum = 0;
  for (const key of Object.keys(target)) {
    if (normalizedAttrs[key] !== undefined) {
      diffSum += Math.abs(normalizedAttrs[key] - target[key]);
    }
  }

  const maxDiff = Object.keys(target).length;
  const percentage = Math.max(0, 100 * (1 - diffSum / maxDiff));

  return percentage;
}

async function getSimilarArtistsFromLastFM(artistName) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json&limit=6`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Last.fm API error: ${res.statusText}`);
  const data = await res.json();
  return data.similarartists.artist.map(a => a.name);
}


async function getAccessToken() {
  console.log("Fetching new Spotify access token...");

  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + basicAuth
    },
    body: "grant_type=client_credentials"
  });

  if (!res.ok) {
    console.error("Failed to get access token:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  console.log("Spotify token refreshed!");
  SPOTIFY_TOKEN = data.access_token;
  return SPOTIFY_TOKEN;
}


async function spotifyFetch(url, retry = false) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` }
  });

  if ((res.status === 401 || res.status === 403) && !retry) {
    console.warn("Spotify token expired, refreshing...");
    const newToken = await getAccessToken();
    if (!newToken) throw new Error("Cannot refresh Spotify token");
    return spotifyFetch(url, true);
  }

  return res;
}

async function getTopTracksFromSpotify(artistName) {
  const query = encodeURIComponent(artistName);
  const url = `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=1`;

  const res = await spotifyFetch(url);
  const data = await res.json();

  const artistId = data.artists.items[0]?.id;
  if (!artistId) return [];

  const topTracksUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;

  const tracksRes = await fetch(topTracksUrl, {
    headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` },
  });

  const tracksData = await tracksRes.json();
  
  return tracksData.tracks.slice(0, 2).map(track => ({
    id: track.id,
    name: track.name,
    artist: track.artists[0]?.name ?? artistName,
    url: track.external_urls.spotify,
    albumImage: track.album.images[0]?.url ?? ''

    
  }));
}

async function getSongAttributesFromSoundcharts(spotifyTrackId) {
  const url = `https://customer.api.soundcharts.com/api/v2.25/song/by-platform/spotify/${spotifyTrackId}`;

  const res = await fetch(url, {
    headers: {
      "x-app-id": SOUNDCHARTS_APP_ID,
      "x-api-key": SOUNDCHARTS_API_KEY
    },
  });

  const data = await res.json();
  return data.object.audio;
}

export async function getSimilarArtistsTopTracks(artistName, targetAttributes) {
  try {
    const similarArtists = await getSimilarArtistsFromLastFM(artistName);

    const results = [];

    for (const artist of similarArtists) {
      const topTracks = await getTopTracksFromSpotify(artist);

      for (const track of topTracks) {
        const attrs = await getSongAttributesFromSoundcharts(track.id);
        if (!attrs) continue;

        const matchPercent = computeMatchPercentage(attrs, targetAttributes);

        results.push({
          id: track.id,
          name: track.name,
          artist: track.artist,
          url: track.url,
          albumImage: track.albumImage,
          matchPercent
        });
      }
    }

    results.sort((a, b) => b.matchPercent - a.matchPercent);

    const uniqueArtistResults = [];
    const seenArtists = new Set();

    for (const r of results) {
      if (!seenArtists.has(r.artist)) {
        seenArtists.add(r.artist);
        uniqueArtistResults.push(r);
      }
      if (uniqueArtistResults.length === 6) break;
    }

    return uniqueArtistResults;

  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}