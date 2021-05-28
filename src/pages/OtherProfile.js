import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'

import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";

import Profile from "./Profile";
import '../App.css';

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import defaultImg from "../images/default.png";

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
            <Loader
                style={{display: isLoading === 0 ? "flex" : "none"}}
                type="TailSpin"
                color="#FFF"
                height={100}
                width={100}
            />
            <div style = {{
                display:(isLoading == 0 ? "none" : "flex"),
                flexDirection: "column",
                alignItems:"center",
                background:"rgba(255, 255, 255, 0.75)",
                padding: "1vh",
                border: "1.5px dotted gray",
                borderRadius: "15px",
                height: "92vh",
                width:"55vw",
                overflowX: "hidden",
                overflowY: "scroll"
            }}>
                <div style={{
                    display:"flex",
                    flexDirection:"column",
                    alignItems:"center",
                    height:"46vh"
                }}>
                    <div className="myRow3">
                        <pre className="fw-bold text-muted fs-5">Name: </pre>
                        <pre className="fs-5">{isLoading === 1 ? profile.name : ""}</pre>
                    </div>
                    <div className="myColumn3">
                        <pre className="fw-bold text-muted fs-6">Description: </pre>
                        <pre style={{width: "35vw", wordWrap:"break-word", textAlign:"center"}} className="fs-6">{isLoading === 1 ? profile.description : ""}</pre>
                    </div>
                    <img className="rounded img-thumbnail mx-auto d-block" src = {isLoading === 1 ? (profile.photo != "" ? profile.photo : defaultImg) : ""} style={{display:isLoading === 1 ? "flex" : "none", width:"6vw", height:"6vw"}}></img>
                    {<button className="btn btn-outline-secondary" style = {{marginTop:"1vh",height:"6vh"}} onClick={handleFollow}><span style={{fontSize:"1.5vw"}}>{isLoading == 1 && checkIfObjectFromList(profile.followed) ? "Unfollow" : "Follow"}</span></button>}
                </div>
                {isLoading === 1 ? <Profile type="other" profile={profile} /> : <div></div>}
            </div>
        </div>
    );
}