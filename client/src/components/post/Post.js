import React, { Fragment, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';
import { connect } from 'react-redux';
import { getPostById } from '../../actions/post';

const Post = ({ getPostById, post: { post, loading }, match, history }) => {
  useEffect(() => {
    getPostById(match.params.id);
  }, [getPostById, match.params.id]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      {/* <Link to="/posts" className="btn">
        Back to Posts
      </Link> */}
      <button onClick={history.goBack} className="btn">
        Go Back
      </button>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className="comments">
        {post.comments.map(comment => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getPostById: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(mapStateToProps, { getPostById })(withRouter(Post));
