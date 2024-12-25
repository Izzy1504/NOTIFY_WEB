import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);

  const fetchAccessToken = async () => {
    const apiKey = 'AIzaSyCHM1nFjoDZgJACpSr9oxbqGtk40wumu6Y';
    return apiKey;
  };

  const searchYouTube = async (query) => {
    const apiKey = await fetchAccessToken();
    if (!apiKey) return;

    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <SearchContext.Provider value={{ searchResults, searchYouTube }}>
      {children}
    </SearchContext.Provider>
  );
};