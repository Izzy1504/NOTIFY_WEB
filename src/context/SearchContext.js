import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);

  const fetchAccessToken = async () => {
    const clientId = 'd0a4d0901ef24d31b048d5f2ce9e9fee';
    const clientSecret = 'c5ee7fd1352b424b912e66292e334273';
    const authString = `${clientId}:${clientSecret}`;
    const encodedAuthString = btoa(authString);

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${encodedAuthString}`,
        },
        body: 'grant_type=client_credentials',
      });
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  const searchSpotify = async (query) => {
    const accessToken = await fetchAccessToken();
    if (!accessToken) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album,artist,track`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <SearchContext.Provider value={{ searchResults, searchSpotify }}>
      {children}
    </SearchContext.Provider>
  );
};