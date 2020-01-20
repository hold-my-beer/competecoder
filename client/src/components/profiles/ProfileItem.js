import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    country,
    dateOfBirth,
    skills
  },
  auth
}) => {
  return (
    <div className="profile bg-light">
      <img src={avatar} alt="" className="round-img" />
      <div>
        <h2>{name}</h2>
        <p className="my-1">{country && <span>{country}</span>}</p>
        <p className="my-1">
          {dateOfBirth && (
            <span>
              {/* <Moment format="YYYY/MM/DD">{dateOfBirth}</Moment> */}
              <Moment diff={dateOfBirth} unit="years">
                {Date.now()}
              </Moment>{' '}
              years
            </span>
          )}
        </p>
        <Link to={`/profile/${_id}`} className="btn btn-primary my-1">
          View Profile
        </Link>
        {/* {auth.isAuthenticated &&
          !auth.loading && auth.user._id !== _id && (
            <Link to="#" className="btn btn-white">
              Make Friends
            </Link>
          )} */}
      </div>
      <ul>
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className="text-primary">
            <i className="fas fa-check"></i> {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(ProfileItem);
