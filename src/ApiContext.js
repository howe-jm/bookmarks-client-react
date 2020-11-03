import React from 'react';

const ApiContext = React.createContext({
  bookmarks: [],
  addBookmark: () => {},
  deleteBookmark: () => {},
  updateBookmark: () => {},
  stateUpdate: () => {},
});

export default ApiContext;
