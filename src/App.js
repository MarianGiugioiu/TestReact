import React, { Component, useEffect, useState } from "react";
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import OtherProfile from './pages/OtherProfile';
import MyProfile from './pages/MyProfile';
import Generator from './pages/Generator';
import Settings from './pages/Settings'
import Layout from './components/Layout';
import Tree from './pages/Tree';
import SnowFlake from './pages/SnowFlake';
import ImageCreator from "./pages/ImageCreator";
import Posting from "./pages/Posting";
import ScrollComp from "./pages/ScrollComp";
import AuthenticationContext from "./AuthenticationContext";
import httpService from './services/httpService';
import { v4 as uuidv4 } from 'uuid';

//<TreeList action="old" id="82"/>

export default function App(props){
  const [userId, setUserId] = useState(-1);
  function logIn(newState) {
    setUserId(newState);
    console.log(newState);
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: newState,
      })
    );
  }

  function logOut() {
    setUserId(-1);
    localStorage.removeItem("user");
  }

  function getUser(){
    const user = localStorage.getItem("user");
    let id = -1;
    if(user != null){
      id = JSON.parse(user).id;
    }
    setUserId(id);
    return id;
  }

  useEffect(()=>{
    getUser();
  },[])


  return (
    <Router>
      <Switch>
        <AuthenticationContext.Provider value={{id:userId, logIn:logIn, logOut:logOut, getUser:getUser}}>
          <Layout>
            <Route exact path="/" component={Home} />
            <Route path="/myprofile" component={MyProfile} />
            <Route path="/profile/:id" render={(props) => <OtherProfile {...props} key={uuidv4()}/>} />
            <Route path="/generator" component={Generator} />
            <Route path="/settings" component={Settings} />
            <Route path="/posting/:id" component={Posting} />
            <Route path="/Tree" component={Tree} />
            <Route path="/ImageCreator/:action/:id?" component={ImageCreator} />
            <Route path="/SnowFlake" component={SnowFlake} />
          </Layout>
        </AuthenticationContext.Provider>
      </Switch>
    </Router>

  );
}
