import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";
import Profile from "./Profile"

export default function OtherProfile(props) {
    const { id } = useParams();
    const authentication = useContext(AuthenticationContext);
    let profileId = authentication.getUser();
    const history = useHistory();

    const [myProfile, setMyProfile] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(0);
    const [allPostingsState,setAllPostingsState] = useState([]);
    const [allPostingsHiddenState, setAllPostingsHiddenState] = useState("hidden");

    const allPostingsRefs = {};

    function checkIfObjectFromList(list){
        let k = 0
        while(k < list.length){
            if(list[k].id == profileId){
                return true;
            }
            k++;
        }
        return false;
    }

    function loadProfile(){
        let URL = "/profile/" + id;
        console.log(URL);
        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
                //data.following = data.following.map((elem) => {return {id: elem}});
                //data.followed = data.followed.map((elem) => {return {id: elem}});
                console.log(data);
                setProfile(data);
            })
    }

    function loadMyProfile(){
        let URL = "/profile/" + profileId;
        console.log(URL);
        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
                //data.following = data.following.map((elem) => {return {id: elem}});
                //data.followed = data.followed.map((elem) => {return {id: elem}});
                console.log(data);
                setMyProfile(data);
            })
    }

    function removeObjectFromList(list, objectId){
        let k = 0
        while(k < list.length){
            if(list[k].id == objectId){
                break;
            }
            k++;
        }
        list.splice(k,1);
    }

    function handleFollow(){
        let myProfileCopy = JSON.parse(JSON.stringify(myProfile));
        let profileCopy = JSON.parse(JSON.stringify(profile));
        if(!checkIfObjectFromList(profile.followed)){
            myProfileCopy.following.push({
                id: profile.id
            });
            profileCopy.followed.push({
                id: myProfile.id
            });
        } else {
            removeObjectFromList(profileCopy.followed,profileId);
            removeObjectFromList(myProfileCopy.following,id);
        }
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
            //console.log(profile);
            setIsLoading(1);
        }
    },[profile])

    useEffect(() => {
        if (allPostingsState.length > 0) {

            setAllPostingsHiddenState("visible");
        }
    },[allPostingsState])

    useEffect(() => {
        if(id == profileId){
            history.push("/myprofile")
        }
    },[])
    
    return (
        <div>
            <p>{isLoading === 1 ? profile.name : ""}</p>
            <p>{isLoading === 1 ? profile.description : ""}</p>
            <img src = {isLoading === 1 ? profile.photo : ""} width="100" height="100" style={{display:isLoading === 1 ? "block" : "none"}}></img>
            {<button style = {{visibility:(isLoading == 0 ? "hidden" : "visible")}} onClick={handleFollow}>{isLoading == 1 && checkIfObjectFromList(profile.followed) ? "Unfollow" : "Follow"}</button>}
            <br></br>
            {isLoading === 1 ? <Profile type="other" profile={profile} /> : <div></div>}
        </div>
    );
}