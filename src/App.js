import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import ApiContext from './ApiContext';
import Nav from './Nav/Nav';
import config from './config';
import './App.css';
import EditBookmark from './EditBookmark/EditBookmark';

class App extends Component {
  state = {
    bookmarks: [],
    error: null,
    working: false,
  };

  setBookmarks = (bookmarks) => {
    let sorted = bookmarks.sort((a, b) => a.id - b.id);
    this.setState({
      bookmarks: sorted,
      error: null,
    });
  };

  addBookmark = (bookmark) => {
    this.setState({
      bookmarks: [...this.state.bookmarks, bookmark],
    });
  };

  updateBookmark = (bookmark, bookmarkId) => {
    let index = this.state.bookmarks.findIndex((bookmark) => bookmark.id === bookmarkId);
    let bookmarks = this.state.bookmarks;
    bookmarks[index] = bookmark;
    this.setState({ bookmarks });
  };

  deleteBookmark = (bookmarkId) => {
    const newBookmarks = this.state.bookmarks.filter((bm) => bm.id !== bookmarkId);
    this.setState({
      bookmarks: newBookmarks,
    });
  };

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => Promise.reject(error));
        }
        return res.json();
      })
      .then(this.setBookmarks)
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      updateBookmark: this.updateBookmark,
    };
    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <ApiContext.Provider value={contextValue}>
          <Nav />
          <div className='content' aria-live='polite'>
            <Route path='/add-bookmark' component={AddBookmark} />
            <Route exact path='/' component={BookmarkList} />
            <Route path='/edit/:bookmarkId' component={EditBookmark} />
          </div>
        </ApiContext.Provider>
      </main>
    );
  }
}

export default App;
