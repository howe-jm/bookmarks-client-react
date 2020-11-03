import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ApiContext from '../ApiContext';
import config from '../config';
import './EditBookmark.css';

const Required = () => <span className='EditBookmark__required'>*</span>;

class EditBookmark extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  static contextType = ApiContext;

  state = {
    error: null,
    id: '',
    title: '',
    website_url: '',
    website_description: '',
    rating: 1,
  };

  componentDidMount() {
    const { bookmarkId } = this.props.match.params;
    console.log(bookmarkId);
    fetch(config.API_ENDPOINT + `${bookmarkId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((error) => Promise.reject(error));

        return res.json();
      })
      .then((responseData) => {
        this.setState({
          id: responseData.id,
          title: responseData.title,
          website_url: responseData.website_url,
          website_description: responseData.website_description,
          rating: responseData.rating,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  }

  handleChangeTitle = (e) => {
    this.setState({ title: e.target.value });
  };

  handleChangeUrl = (e) => {
    this.setState({ website_url: e.target.value });
  };

  handleChangeDescription = (e) => {
    this.setState({ website_description: e.target.value });
  };

  handleChangeRating = (e) => {
    this.setState({ rating: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { bookmarkId } = this.props.match.params;
    const { id, title, website_url, website_description, rating } = this.state;
    const newBookmark = { id, title, website_url, website_description, rating };
    fetch(config.API_ENDPOINT + `${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then((error) => {
            // then throw it
            throw error;
          });
        }
        return res;
      })
      .then((data) => {
        console.log(this.state.id);
        this.context.updateBookmark(this.state, this.state.id);
        this.props.history.push('/');
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  };

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      website_url: newFields.website_url || '',
      website_description: newFields.website_description || '',
      rating: newFields.rating || '',
    });
  };

  handleClickCancel = () => {
    this.props.history.push('/');
  };

  render() {
    const { error, title, website_url, website_description, rating } = this.state;
    return (
      <section className='EditBookmark'>
        <h2>Edit bookmark</h2>
        <form className='EditBookmark__form' onSubmit={this.handleSubmit}>
          <div className='EditBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <input type='hidden' name='id' />
          <div>
            <label htmlFor='title'>
              Title <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              required
              value={title}
              onChange={this.handleChangeTitle}
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder={website_url}
              required
              value={website_url}
              onChange={this.handleChangeUrl}
            />
          </div>
          <div>
            <label htmlFor='description'>Description</label>
            <textarea
              name='description'
              id='description'
              value={website_description}
              onChange={this.handleChangeDescription}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              min='1'
              max='5'
              required
              value={rating}
              onChange={this.handleChangeRating}
            />
          </div>
          <div className='EditBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>{' '}
            <button type='submit'>Save</button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
