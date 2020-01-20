import { ADD_REQUEST, FRIEND_ERROR, GET_REQUESTS } from '../actions/types';

const initialState = {
  request: null,
  requests: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_REQUEST:
      return state;
    case GET_REQUESTS:
      return {
        ...state,
        requests: payload,
        loading: false
      };
    case FRIEND_ERROR:
      return {
        ...state,
        loading: false,
        error: payload
      };
    default:
      return state;
  }
}
