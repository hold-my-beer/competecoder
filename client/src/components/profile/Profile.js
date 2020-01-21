import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';
import { addFriendsRequest } from '../../actions/friend';
import { getOutgoingRequestByAcceptorId } from '../../actions/friend';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileEducation from './ProfileEducation';
import ProfileCodeforces from './ProfileCodeforces';

const Profile = ({
  getProfileById,
  addFriendsRequest,
  getOutgoingRequestByAcceptorId,
  profile: { profile, loading },
  friend,
  auth,
  match
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
    getOutgoingRequestByAcceptorId(match.params.id);
  }, [getProfileById, getOutgoingRequestByAcceptorId, match.params.id]);
  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id !== profile.user._id &&
            !friend.loading &&
            friend.request === null && (
              <button
                type="button"
                className="btn btn-white"
                onClick={() => addFriendsRequest(profile.user._id)}
              >
                Make Friends
              </button>
            )}

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
  getOutgoingRequestByAcceptorId: PropTypes.func.isRequired,
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
  getOutgoingRequestByAcceptorId
})(Profile);
