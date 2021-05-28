import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'

import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";

import defaultImg from "../images/default.png";

import Profile from './Profile'

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

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
                    height:"40vh"
                }}>
                    <div className="myRow3">
                        <pre className="fw-bold text-muted fs-5">Name: </pre>
                        <pre className="fs-5">{isLoading === 1 ? myProfile.name : ""}</pre>
                    </div>
                    <div className="myColumn3">
                        <pre className="fw-bold text-muted fs-6">Description: </pre>
                        <pre style={{width: "35vw", wordWrap:"break-word", textAlign:"center"}} className="fs-6">{isLoading === 1 ? myProfile.description : ""}</pre>
                    </div>
                    <img className="rounded img-thumbnail mx-auto d-block" src = {isLoading === 1 ? (myProfile.photo != "" ? myProfile.photo : defaultImg) : ""} style={{display:isLoading === 1 ? "flex" : "none", width:"8vw", height:"8vw"}}></img>
                </div>
                {isLoading === 1 ? <Profile type="mine" profile={myProfile} /> : <div></div>}
            </div>
            
        </div>
    );
}