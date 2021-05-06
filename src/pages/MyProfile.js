import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";
import Profile from './Profile'

export default function MyProfile(props) {
    const authentication = useContext(AuthenticationContext);
    const history = useHistory();
    let myId = authentication.getUser();

    const [myProfile, setMyProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(0);

    function loadMyProfile(){
        let URL = "/profile/" + myId;
        console.log(URL);
        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
                console.log(data);
                setMyProfile(data);
            })
            .catch((e) => {
                console.log(e);
              });
    }

    useEffect(()=>{
        loadMyProfile();
    },[])

    useEffect(()=>{
        if(myProfile!=null){
            //console.log(myProfile)
            setIsLoading(1);
        }
    },[myProfile])

    
    return (
        <div>
            <p>{isLoading === 1 ? myProfile.name : ""}</p>
            <p>{isLoading === 1 ? myProfile.description : ""}</p>
            <img src = {isLoading === 1 ? myProfile.photo : ""} width="100" height="100" style={{display:isLoading === 1 ? "block" : "none"}}></img>
            {isLoading === 1 ? <Profile type="mine" profile={myProfile} /> : <div></div>}
        </div>
    );
}