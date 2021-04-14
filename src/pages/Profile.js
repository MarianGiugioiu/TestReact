import '../App.css';
import { useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";

//<TreeList action="old" id="82"/>

function MyProfile(profile){
    return (
        <div>
            <p>{profile.name}</p>
            <p>{profile.description}</p>
        </div>
    );
}

function OtherProfile(profile,myProfile,setMyProfile,setProfile){
    //const authentication = useContext(AuthenticationContext);
    //const myProfile = authentication.profile;
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
        //console.log(myProfileCopy)
        const URL = "/profile/" + myProfile.id;
        httpService
        .put(URL, myProfileCopy)
        .then((response) => {
          console.log(response.data);
          myProfile = myProfileCopy;
        });
    }

    return (
        <div>
            <p>{profile.name}</p>
            <p>{profile.description}</p>
            <button onClick={handleFollow}>Follow</button>
        </div>
    );
}

export default function Profile(props) {
    const { id } = useParams();
    console.log(id);
    const authentication = useContext(AuthenticationContext);
    let myId = authentication.id;
    /*let myId = -1;
    if(authentication.profile){
        myId = authentication.profile.id;
    }*/
    const [profile, setProfile] = useState(null);
    const [myProfile, setMyProfile] = useState(null);
    const [idState, setIdState] = useState(-1);
    setIdState(id);

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

    function loadAllImages(){

    }

    useEffect(()=>{
        if(idState!= -1){
            console.log("###");
            if(myId != id){
                loadMyProfile();
            } 
            loadProfile();
        }
    },[idState])

    const showProfile = useCallback(()=>{
        if(profile!=null){
            if(myId == id){
                return (MyProfile(profile));
            } else {
                return (OtherProfile(profile,myProfile,setMyProfile,setProfile));
            }
        } else {
            return(
                <p>Loading...</p>
            )
        }
    },[profile])

    return (
        <div>
            {showProfile()}
            <button style = {{visibility : (myId == id ? "visible" : "hidden")}}onClick={loadAllImages} >Show Images</button>
        </div>
    );
}