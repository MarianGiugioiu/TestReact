import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";

export default function Home() {
  const [nameSearchState, setNameSearchState] = useState("");
  const [userIdState, setUserIdState] = useState("");
  const history = useHistory();
  const authentication = useContext(AuthenticationContext);
  let myId = authentication.getUser();

  function handleChange(event){
    const { name, value } = event.target;
    setNameSearchState(value);
  }
  function handleClick(){
    const URL = "/profile/name/" + nameSearchState;
    //console.log(URL);
    httpService
      .get(URL)
      .then((response) => {
        var data = response.data; 
        console.log(data);
        let path = "/profile/"+data;
        console.log(path);
        history.push(path);
      });
  }

  function handleChangeId(event){
    const { name, value } = event.target;
    setUserIdState(value);
  }
  function handleClickLogIn(){
    authentication.logIn(userIdState);
  }
  function handleClickLogOut(){
    authentication.logOut();
  }

  function HomePage(){
    if(myId==-1){
      return (
        <div>
          <input
            type="text"
            placeholder="Enter Id"
            name="Id"
            value={userIdState}
            onChange={handleChangeId}
          />
          <button
            onClick={handleClickLogIn}
          >
            LogIn
          </button>
        </div>
      )
    } else {
      return (
        <div>
          
          <label>Enter Name:</label>
          <input
            type="text"
            placeholder="Enter Name"
            name="Name"
            value={nameSearchState}
            onChange={handleChange}
          />
          <button
            onClick={handleClick}
          >
            Search
          </button>
        </div>
      );
    }
  }

  return (
    HomePage()
  );
}