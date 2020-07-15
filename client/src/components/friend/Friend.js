import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfileById } from '../../actions/profile';
import { getNewPostsByUserId } from '../../actions/post';
import { getRequestByUserId } from '../../actions/friend';
import Spinner from '../layout/Spinner';
import ProfileTop from '../profile/ProfileTop';
import PostItem from '../posts/PostItem';

const Friend = ({
  getProfileById,
  getNewPostsByUserId,
  getRequestByUserId,
  profile,
  post,
  friend,
  match
}) => {
  useEffect(() => {
    getProfileById(match.params.userId);
    getNewPostsByUserId(match.params.userId);
    getRequestByUserId(match.params.userId);
  }, [
    getProfileById,
    getNewPostsByUserId,
    getRequestByUserId,
    match.params.userId
  ]);

  return (
    <Fragment>
      {// profile === null ||
      profile.loading ||
      // profile.profile === null ||
      post.loading ||
      friend.loading ? (
        // || friend.request === null
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/friends" className="btn btn-light">
            Back To Friends
          </Link>

          <div className="profile-grid my-1">
            <ProfileTop profile={profile.profile} />
          </div>
          <div className="posts">
            {post.posts.length > 0 ? (
              post.posts.map(post => (
                <Fragment key={post._id}>
                  {post.user === match.params.userId ? (
                    <h3>Your friend added the post</h3>
                  ) : post.comments.filter(
                      comment =>
                        comment.user === match.params.userId &&
                        friend.request &&
                        new Date(comment.date).getTime() >
                          new Date(
                            friend.request.initiator === match.params.userId
                              ? friend.request.initiatorCheckDate
                              : friend.request.acceptorCheckDate
                          ).getTime()
                    ).length > 0 ? (
                    <h3>Your friend added comment to the post</h3>
                  ) : (
                    <h3>Your friend liked the post</h3>
                  )}

                  <PostItem post={post} />
                </Fragment>
              ))
            ) : (
              <p className="lead">No friend news</p>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Friend.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  getNewPostsByUserId: PropTypes.func.isRequired,
  getRequestByUserId: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  friend: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  post: state.post,
  friend: state.friend
});

export default connect(mapStateToProps, {
  getProfileById,
  getNewPostsByUserId,
  getRequestByUserId
})(Friend);
