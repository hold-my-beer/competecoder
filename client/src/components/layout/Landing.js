import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
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

export default Landing;
