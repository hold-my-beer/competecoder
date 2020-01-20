import axios from 'axios';
import { setAlert } from './alert';
import { ADD_REQUEST, FRIEND_ERROR, GET_REQUESTS } from './types';

//Add friends request
export const addFriendsRequest = userId => async dispatch => {
  try {
    const res = await axios.post(`/api/friends/${userId}`);

    dispatch({
      type: ADD_REQUEST,
      payload: res.data
    });

    dispatch(setAlert('Request registered', 'success'));
  } catch (err) {
    dispatch({
      type: FRIEND_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Get friends requests
export const getRequests = () => async dispatch => {
  try {
    const res = await axios.get('/api/friends');

    dispatch({
      type: GET_REQUESTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: FRIEND_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
