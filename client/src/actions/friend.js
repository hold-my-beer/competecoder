import axios from 'axios';
import { setAlert } from './alert';
import {
  ADD_REQUEST,
  FRIEND_ERROR,
  GET_REQUESTS,
  GET_REQUEST,
  CLEAR_REQUEST,
  ACCEPT_REQUEST,
  SET_FRIEND_LOADING
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

  dispatch(setFriendLoading());

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
// export const getIncomingRequestByInitiatorId = initiatorId => async dispatch => {
//   dispatch(setFriendLoading());

//   try {
//     const res = await axios.get(`/api/friends/incoming/${initiatorId}`);

//     dispatch({
//       type: GET_REQUEST,
//       payload: res.data
//     });
//   } catch (err) {
//     dispatch({
//       type: FRIEND_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };

//Get outgoing request by acceptorId
// export const getOutgoingRequestByAcceptorId = acceptorId => async dispatch => {
//   dispatch(setFriendLoading());

//   try {
//     const res = await axios.get(`/api/friends/outgoing/${acceptorId}`);

//     dispatch({
//       type: GET_REQUEST,
//       payload: res.data
//     });
//   } catch (err) {
//     dispatch({
//       type: FRIEND_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };

//Get request by userId
export const getRequestByUserId = userId => async dispatch => {
  dispatch(setFriendLoading());

  try {
    const res = await axios.get(`/api/friends/${userId}`);

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

//Accept request by id
export const acceptRequest = id => async dispatch => {
  try {
    const res = await axios.put(`/api/friends/accept/${id}`);

    dispatch({
      type: ACCEPT_REQUEST,
      payload: { id }
    });

    dispatch(setAlert('Request accepted', 'success'));
  } catch (err) {
    dispatch({
      type: FRIEND_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Set friend loading
export const setFriendLoading = () => dispatch => {
  dispatch({
    type: SET_FRIEND_LOADING
  });
};
