import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    country,
    dateOfBirth,
    skills
  }
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
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View Profile
        </Link>
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
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
