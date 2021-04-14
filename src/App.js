import React, { Component, useEffect, useState } from "react";
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import OtherProfile from './pages/OtherProfile';
import MyProfile from './pages/MyProfile';
import Generator from './pages/Generator';
import Layout from './components/Layout';
import Tree from './pages/Tree';
import SnowFlake from './pages/SnowFlake';
import ImageCreator from "./pages/ImageCreator";
import AuthenticationContext from "./AuthenticationContext";
import httpService from './services/httpService';

//<TreeList action="old" id="82"/>

export default function App(props){
  /*const [profileState, setProfileState] = useState();
  useEffect(()=>{
    const id = 1;
    let URL = "/profile/" + id;
    httpService
      .get(URL)
      .then((response) => {
          var data = response.data;
          data.following = data.following.map((elem) => {return {id: elem}});
          data.followed = data.followed.map((elem) => {return {id: elem}});
          console.log(data);
          setProfileState(data);
      })
  },[])*/

  return (
    <Router>
      <Switch>
        <AuthenticationContext.Provider value={{id:1}}>
          <Layout>
            <Route exact path="/" component={Home} />
            <Route path="/myprofile" component={MyProfile} />
            <Route path="/profile/:id" component={OtherProfile} />
            <Route path="/generator" component={Generator} />
            <Route path="/Tree" component={Tree} />
            <Route path="/ImageCreator/:action/:id?" component={ImageCreator} />
            <Route path="/SnowFlake" component={SnowFlake} />
          </Layout>
        </AuthenticationContext.Provider>
      </Switch>
    </Router>

  );
}
