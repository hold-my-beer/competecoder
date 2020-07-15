import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { acceptRequest, declineRequest } from '../../actions/friend';

const FriendItem = ({
  acceptRequest,
  declineRequest,
  request: {
    _id,
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
    <div className="friend bg-white p-1 m-1">
      {!auth.loading && initiator === auth.user._id ? (
        <div className="friend-top">
          <Link to={`/profile/${acceptor}`}>
            <img className="round-img" src={acceptorAvatar} alt="" />
            <h3>{acceptorName}</h3>
          </Link>
        </div>
      ) : (
        <div className="friend-top">
          <Link to={`/profile/${initiator}`}>
            <img className="round-img" src={initiatorAvatar} alt="" />
            <h3>{initiatorName}</h3>
          </Link>
        </div>
      )}

      <div className="friend-content">
        {isAccepted === null && acceptor === auth.user._id && (
          <Fragment>
            <button
              type="button"
              className="btn btn-stack btn-success my"
              onClick={() => acceptRequest(_id)}
            >
              <i class="fas fa-check"></i> Accept
            </button>
            <button
              type="button"
              className="btn btn-stack btn-danger"
              onClick={() => declineRequest(_id)}
            >
              <i class="fas fa-times"></i> Decline
            </button>
          </Fragment>
        )}
        {isAccepted === null && initiator === auth.user._id && (
          <h4>Your request has yet to be confirmed by the acceptor</h4>
        )}
        {isAccepted && !auth.loading && initiator === auth.user._id && (
          <Link to={`/friends/${acceptor}`} className="btn btn-primary my">
            Friend News
          </Link>
        )}
        {isAccepted && !auth.loading && acceptor === auth.user._id && (
          <Link to={`/friends/${initiator}`} className="btn btn-primary my">
            Friend News
          </Link>
        )}
      </div>
    </div>
  );
};

FriendItem.propTypes = {
  acceptRequest: PropTypes.func.isRequired,
  declineRequest: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  acceptRequest,
  declineRequest
})(FriendItem);
