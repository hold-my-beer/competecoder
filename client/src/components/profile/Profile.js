import React, { Fragment, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';
import { addFriendsRequest } from '../../actions/friend';
// import { getOutgoingRequestByAcceptorId } from '../../actions/friend';
// import { getIncomingRequestByInitiatorId } from '../../actions/friend';
import { getRequestByUserId } from '../../actions/friend';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileEducation from './ProfileEducation';
import ProfileCodeforces from './ProfileCodeforces';

const Profile = ({
  getProfileById,
  addFriendsRequest,
  getRequestByUserId,
  // getOutgoingRequestByAcceptorId,
  // getIncomingRequestByInitiatorId,
  profile: { profile, loading },
  friend,
  auth,
  match,
  history
}) => {
  useEffect(() => {
    // getOutgoingRequestByAcceptorId(match.params.id);
    // getIncomingRequestByInitiatorId(match.params.id);
    getProfileById(match.params.id);
    getRequestByUserId(match.params.id);
  }, [
    getProfileById,
    getRequestByUserId,
    // getOutgoingRequestByAcceptorId,
    // getIncomingRequestByInitiatorId,
    match.params.id
  ]);

  const ownProfile = (
    <Link to="/edit-profile" className="btn btn-dark">
      Edit Profile
    </Link>
  );

  const noRequest = (
    <button
      type="button"
      className="btn btn-white"
      onClick={() => addFriendsRequest(profile.user._id)}
    >
      Make Friends
    </button>
  );

  return (
    <Fragment>
      {profile === null || loading || auth.loading || friend.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <button onClick={history.goBack} className="btn btn-light">
            Go Back
          </button>
          {auth.isAuthenticated &&
            auth.user._id === profile.user._id &&
            ownProfile}
          {auth.isAuthenticated &&
            auth.user._id !== profile.user._id &&
            friend.request === null &&
            noRequest}

          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />

            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map(education => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>

            <div className="profile-github bg-white p-2">
              <h2 className="text-primary">Codeforces Data</h2>
              {profile.codeforcesHandle && (
                <ProfileCodeforces handle={profile.codeforcesHandle} />
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  addFriendsRequest: PropTypes.func.isRequired,
  getRequestByUserId: PropTypes.func.isRequired,
  // getOutgoingRequestByAcceptorId: PropTypes.func.isRequired,
  // getIncomingRequestByInitiatorId: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  friend: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  friend: state.friend
});

export default connect(mapStateToProps, {
  getProfileById,
  addFriendsRequest,
  getRequestByUserId
  // getOutgoingRequestByAcceptorId,
  // getIncomingRequestByInitiatorId
})(withRouter(Profile));
