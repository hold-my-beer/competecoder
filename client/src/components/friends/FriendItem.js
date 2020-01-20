import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const FriendItem = ({
  request: {
    isAccepted,
    initiator,
    initiatorName,
    initiatorAvatar,
    acceptor,
    acceptorName,
    acceptorAvatar
  },
  auth
}) => {
  return (
    <div className="post bg-white p-1 my-1">
      {!auth.loading && initiator === auth.user._id ? (
        <div>
          <Link to={`/profile/${acceptor}`}>
            <img className="round-img" src={acceptorAvatar} alt="" />
            <h4>{acceptorName}</h4>
          </Link>
        </div>
      ) : (
        <div>
          <Link to={`/profile/${initiator}`}>
            <img className="round-img" src={initiatorAvatar} alt="" />
            <h4>{initiatorName}</h4>
          </Link>
        </div>
      )}

      <div>
        {isAccepted === null && acceptor === auth.user._id && (
          <Fragment>
            <button
              //onClick={e => addLike(_id)}
              type="button"
              className="btn btn-success"
            >
              <i class="fas fa-check"></i> Accept
            </button>
            <button
              //onClick={e => addLike(_id)}
              type="button"
              className="btn btn-danger"
            >
              <i class="fas fa-times"></i> Decline
            </button>
          </Fragment>
        )}
        {isAccepted === null && initiator === auth.user._id && (
          <p className="lead">
            Your request has yet to be confirmed by the acceptor
          </p>
        )}
        {isAccepted && !auth.loading && initiator === auth.user._id && (
          <Link to={`/friends/${acceptor}`} className="btn btn-primary">
            Friend News
          </Link>
        )}
        {isAccepted && !auth.loading && acceptor === auth.user._id && (
          <Link to={`/friends/${initiator}`} className="btn btn-primary">
            Friend News
          </Link>
        )}
      </div>
    </div>
  );
};

FriendItem.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(FriendItem);
