import {
  ADD_REQUEST,
  FRIEND_ERROR,
  GET_REQUESTS,
  GET_REQUEST,
  CLEAR_REQUEST,
  ACCEPT_REQUEST
} from '../actions/types';

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
      return {
        ...state,
        request: payload,
        loading: false
      };
    case GET_REQUESTS:
      return {
        ...state,
        requests: payload,
        loading: false
      };
    case GET_REQUEST:
      return {
        ...state,
        request: payload,
        loading: false
      };
    case ACCEPT_REQUEST:
      return {
        ...state,
        requests: state.requests.map(request =>
          request._id === payload.id
            ? { ...request, isAccepted: true }
            : request
        ),
        loading: false
      };
    case CLEAR_REQUEST:
      return {
        ...state,
        request: null,
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
