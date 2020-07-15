import {
  GET_POSTS,
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  ADD_POST,
  DELETE_POST,
  ADD_COMMENT,
  DELETE_COMMENT,
  // GET_FRIEND_POSTS,
  SET_POST_LOADING
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  // comments: [],
  // likes: [],
  loading: false,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false
      };
    case DELETE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            comment => comment._id !== payload
          )
        },
        loading: false
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload),
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        loading: false,
        error: payload
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.id
            ? { ...post, likes: payload.likes, dislikes: payload.dislikes }
            : post
        ),
        loading: false
      };
    // case GET_FRIEND_POSTS:
    //   return {
    //     ...state,
    //     posts: payload,
    //     loading: false
    //   };
    case SET_POST_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
