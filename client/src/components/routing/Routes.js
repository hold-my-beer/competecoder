import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Alert from '../layout/Alert';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Dashboard from '../dashboard/Dashboard';
import PrivateRoute from './PrivateRoute';
import CreateProfile from '../profile-forms/CreateProfile';
import EditProfile from '../profile-forms/EditProfile';
import AddEducation from '../profile-forms/AddEducation';
import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';
import Posts from '../posts/Posts';
import Post from '../post/Post';
import Friends from '../friends/Friends';
import Friend from '../friend/Friend';

const Routes = () => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profiles" component={Profiles} />
        <Route exact path="/profile/:id" component={Profile} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/create-profile" component={CreateProfile} />
        <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        <PrivateRoute exact path="/add-education" component={AddEducation} />
        <PrivateRoute exact path="/posts" component={Posts} />
        <PrivateRoute exact path="/posts/:id" component={Post} />
        <PrivateRoute exact path="/friends" component={Friends} />
        <PrivateRoute exact path="/friends/:userId" component={Friend} />
      </Switch>
    </section>
  );
};

export default Routes;
