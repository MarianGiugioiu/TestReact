import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";

export default function MyProfile(props) {
    const authentication = useContext(AuthenticationContext);
    const history = useHistory();
    let myId = authentication.id;

    const [myProfile, setMyProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(0);
    const [allImagesState,setAllImagesState] = useState([]);
    const [allImagesHiddenState, setAllImagesHiddenState] = useState("hidden");
    const [allPostingsState,setAllPostingsState] = useState([]);
    const [allPostingsHiddenState, setAllPostingsHiddenState] = useState("hidden");

    const allImagesRefs = {};
    const allPostingsRefs = {};

    function loadMyProfile(){
        let URL = "/profile/" + myId;
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

    function loadAllImages () {
        if(allImagesState.length == 0){
            var URL = "/profile/" + myId + "/fractals";
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    console.log(data);
                    setAllImagesState(data);
            })
        } else {
            if(allImagesHiddenState === "hidden"){
                setAllImagesHiddenState("visible");
            } else {
                setAllImagesHiddenState("hidden");
            }
        }
        
        
    }

    function loadAllPostings () {
        console.log(allPostingsState.length)
        if(allPostingsState.length == 0){
            var URL = "/profile/" + myId + "/postings";
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    console.log(data);
                    setAllPostingsState(data);
            })
        } else {
            if(allPostingsHiddenState === "hidden"){
                setAllPostingsHiddenState("visible");
            } else {
                setAllPostingsHiddenState("hidden");
            }
        }
        
        
    }
    useEffect(() => {
        if (allPostingsState.length > 0) {

            setAllPostingsHiddenState("visible");
        }
    },[allPostingsState])

    useEffect(() => {
        if (allImagesState.length > 0) {

            setAllImagesHiddenState("visible");
        }
    },[allImagesState])

    function choosePosting(object){
        let idPosting= object.id;
        let path = "/posting/" + idPosting;
        history.push(path);
    }

    function chooseImage(object){
        let idImg = object.id;
        let img = allImagesState.filter(obj => {
            return obj.id === idImg;
        })[0]
        console.log(img);
        let path = "/";
        if(img.type === "image"){
            path = "/ImageCreator/old/" + idImg;
        } else if(img.type === "tree"){
            path = "/Tree/old" + idImg;
        }
        history.push(path);
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
            <button style = {{visibility:(isLoading == 0 ? "hidden" : "visible")}} onClick={loadAllPostings} >{allPostingsHiddenState === "hidden" ? "Show my postings": "Hide postings"}</button>
            <div className="myRow2" style = {{visibility:allPostingsHiddenState}}>
            {
                    
                    allPostingsState.map(function(object, i){
                        if(object!= null) {
                            return (   
                                <> 
                                    <img
                                        id={i}
                                        ref = {(ref) => allPostingsRefs[`img${i}`] = ref}
                                        src = {object.fractal.dataURL}
                                        width = "100vw" height = "100vw"
                                        onClick={() => choosePosting(object)}
                                        >
                                    </img>
                                    
                                </>
                            );
                        }
                    })
                }
            </div>
            <button style = {{visibility:(isLoading == 0 ? "hidden" : "visible")}} onClick={loadAllImages} >{allImagesHiddenState === "hidden" ? "Show my images": "Hide images"}</button>
            <div className="myRow2" style = {{visibility:allImagesHiddenState}}>
            {
                    
                    allImagesState.map(function(object, i){
                        if(object!= null) {
                            return (   
                                <> 
                                    <img
                                        id={i}
                                        ref = {(ref) => allImagesRefs[`img${i}`] = ref}
                                        src = {object.dataURL}
                                        width = "100vw" height = "100vw"
                                        onClick={() => chooseImage(object)}
                                        >
                                    </img>
                                    
                                </>
                            );
                        }
                    })
                }
            </div>
        </div>
    );
}