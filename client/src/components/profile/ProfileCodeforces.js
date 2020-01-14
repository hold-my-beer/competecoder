import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getCodeforcesData } from '../../actions/profile';

const ProfileCodeforces = ({ handle, getCodeforcesData, codeforces }) => {
  useEffect(() => {
    getCodeforcesData(handle);
  }, [getCodeforcesData, handle]);

  return codeforces === null ? (
    <Spinner />
  ) : (
    // <div className="profile-exp bg-white p-2">
    //   <h2 className="text-primary">Codeforces Data</h2>
    <div className="my-2">
      <p className="lead">
        <strong>Rating: </strong> {codeforces.rating}
      </p>
      <p className="lead">
        <strong>Rank: </strong> {codeforces.rank}
      </p>
      <p className="lead">
        <strong>Max Rating: </strong> {codeforces.maxRating}
      </p>
      <p className="lead">
        <strong>Max Rank: </strong> {codeforces.maxRank}
      </p>
    </div>
    // </div>
    // codeforces.result.map(item => (
    //   <div className="profile-edu bg-white p-2">
    //     <h2 className="text-primary">Codeforces Data</h2>
    //     <div>
    //       <p>
    //         <strong>Rating: </strong> {item.rating}
    //       </p>
    //     </div>
    //   </div>
    // ))
  );
};

ProfileCodeforces.propTypes = {
  getCodeforcesData: PropTypes.func.isRequired,
  codeforces: PropTypes.object.isRequired,
  handle: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  codeforces: state.profile.codeforces
});

export default connect(mapStateToProps, { getCodeforcesData })(
  ProfileCodeforces
);
