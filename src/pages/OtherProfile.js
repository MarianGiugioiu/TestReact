import '../App.css';
import { useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";

export default function MyProfile(props) {
    const { id } = useParams();
    const authentication = useContext(AuthenticationContext);
    let myId = authentication.id;

    const [myProfile, setMyProfile] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(0);

    function loadProfile(){
        let URL = "/profile/" + id;
        console.log(URL);
        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
                data.following = data.following.map((elem) => {return {id: elem}});
                data.followed = data.followed.map((elem) => {return {id: elem}});
                console.log(data);
                setProfile(data);
            })
    }

    function loadMyProfile(){
        let URL = "/profile/" + myId;
        console.log(URL);
        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
                data.following = data.following.map((elem) => {return {id: elem}});
                data.followed = data.followed.map((elem) => {return {id: elem}});
                console.log(data);
                setMyProfile(data);
            })
    }

    function handleFollow(){
        let myProfileCopy = JSON.parse(JSON.stringify(myProfile));
        let profileCopy = JSON.parse(JSON.stringify(profile));
        myProfileCopy.following.push({
            id: profile.id
        });
        profileCopy.followed.push({
            id: myProfile.id
        });
        setProfile(profileCopy);
        setMyProfile(myProfileCopy);
        const URL = "/profile/" + myProfile.id;
        httpService
        .put(URL, myProfileCopy)
        .then((response) => {
          console.log(response.data);
        });
    }

    useEffect(()=>{
        loadMyProfile();
        loadProfile();
    },[])

    useEffect(()=>{
        if(profile!=null){
            console.log(profile);
            setIsLoading(1);
        }
    },[profile])

    
    return (
        <div>
            <p>{isLoading === 1 ? profile.name : ""}</p>
            <p>{isLoading === 1 ? profile.description : ""}</p>
            <button style = {{visibility:(isLoading == 0 ? "hidden" : "visible")}} onClick={handleFollow}>Follow</button>
        </div>
    );
}