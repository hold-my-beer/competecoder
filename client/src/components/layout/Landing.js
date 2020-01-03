import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1>CompeteCoder</h1>
          <h4>Diversify your coding experience.</h4>
          <h4>Socialize with your competitors and find new friends.</h4>

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
