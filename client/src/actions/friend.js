import axios from 'axios';
import { setAlert } from './alert';
import {
  ADD_REQUEST,
  FRIEND_ERROR,
  GET_REQUESTS,
  GET_REQUEST,
  CLEAR_REQUEST
} from './types';

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

//Get all friends requests for a user
export const getRequests = () => async dispatch => {
  dispatch({
    type: CLEAR_REQUEST
  });

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

//Get incoming request by initiatorId
export const getIncomingRequestByInitiatorId = initiatorId => async dispatch => {
  try {
    const res = await axios.get(`/api/friends/incoming/${initiatorId}`);

    dispatch({
      type: GET_REQUEST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: FRIEND_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Get outgoing request by acceptorId
export const getOutgoingRequestByAcceptorId = acceptorId => async dispatch => {
  try {
    const res = await axios.get(`/api/friends/outgoing/${acceptorId}`);

    dispatch({
      type: GET_REQUEST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: FRIEND_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Accept request
export const acceptRequest = id => async dispatch => {
  try {
    await axios.put(`/api/friends/accept/${id}`);
  } catch (error) {}
};
