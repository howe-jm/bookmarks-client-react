import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '../Rating/Rating';
import ApiContext from '../ApiContext';
import config from '../config';
import './BookmarkItem.css';

function deleteBookmarkRequest(bookmarkId, cb) {
  fetch(config.API_ENDPOINT + `${bookmarkId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      authorization: `bearer ${config.API_KEY}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((error) => Promise.reject(error));
      }
    })
    .then(() => {
      cb(bookmarkId);
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function BookmarkItem(props) {
  return (
    <ApiContext.Consumer>
      {(context) => (
        <li className='BookmarkItem'>
          <div className='BookmarkItem__row'>
            <h3 className='BookmarkItem__title'>
              <a href={props.website_url} target='_blank' rel='noopener noreferrer'>
                {props.title}
              </a>
            </h3>
            <Rating value={props.rating} />
          </div>
          <p className='BookmarkItem__description'>{props.description}</p>
          <div className='BookmarkItem__buttons'>
            <Link to={`./edit/${props.id}`}>Edit</Link>
            <button
              className='BookmarkItem__description'
              onClick={() => {
                deleteBookmarkRequest(props.id, context.deleteBookmark);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      )}
    </ApiContext.Consumer>
  );
}

BookmarkItem.defaultProps = {
  onClickDelete: () => {},
};
