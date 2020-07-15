import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRequests } from '../../actions/friend';
import Spinner from '../layout/Spinner';
import FriendItem from './FriendItem';

const Friends = ({ getRequests, friend, auth }) => {
  useEffect(() => {
    getRequests();
  }, [getRequests]);

  let incoming = [];
  let outgoing = [];
  let friends = [];

  friend.requests.forEach(request => {
    if (request.isAccepted) {
      friends.push(request);
    } else if (
      request.isAccepted === null &&
      request.acceptor === auth.user._id
    ) {
      incoming.push(request);
    } else if (
      request.isAccepted === null &&
      request.initiator === auth.user._id
    ) {
      outgoing.push(request);
    }
  });

  return (
    <Fragment>
      {friend.loading || auth.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Friends</h1>
          {incoming.length > 0 || outgoing.length > 0 || friends.length > 0 ? (
            <Fragment>
              <p className="lead">
                <i className="fas fa-users"></i> Welcome to your clan
              </p>
              {incoming.length > 0 && (
                <Fragment>
                  <h2 className="text-primary">
                    Requests waiting for your accept
                  </h2>
                  <div className="friends">
                    {incoming.map(request => (
                      <FriendItem key={request._id} request={request} />
                    ))}
                  </div>
                </Fragment>
              )}
              {outgoing.length > 0 && (
                <Fragment>
                  <h2 className="text-primary">Your requests pending</h2>
                  <div className="friends">
                    {outgoing.map(request => (
                      <FriendItem key={request._id} request={request} />
                    ))}
                  </div>
                </Fragment>
              )}
              {friends.length > 0 && (
                <Fragment>
                  <h2 className="text-primary">Your friends</h2>
                  <div className="friends">
                    {friends.map(request => (
                      <FriendItem key={request._id} request={request} />
                    ))}
                  </div>
                </Fragment>
              )}
            </Fragment>
          ) : (
            <Fragment>
              <p className="lead">You have no active friend requests</p>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

Friends.propTypes = {
  getRequests: PropTypes.func.isRequired,
  friend: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  friend: state.friend,
  auth: state.auth
});

export default connect(mapStateToProps, { getRequests })(Friends);
