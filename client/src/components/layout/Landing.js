import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="large">CompeteCoder</h1>
          <p className="lead">Diversify your coding experience.</p>
          <p className="lead">
            Socialize with your competitors and find new friends.
          </p>

          <div className="buttons">
            <Link className="btn btn-primary" to="/login">
              Login
            </Link>
            <Link className="btn btn-light" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
