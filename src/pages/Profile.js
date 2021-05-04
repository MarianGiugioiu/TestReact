import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";

export default function Profile(props) {
    const history = useHistory();
    const authentication = useContext(AuthenticationContext);
    const privacyOptions = JSON.parse(props.profile.privacy);
    let myId = authentication.getUser();

    const [allImagesState,setAllImagesState] = useState([]);
    const [allImagesHiddenState, setAllImagesHiddenState] = useState("hidden");
    const [allPostingsState,setAllPostingsState] = useState([]);
    const [allPostingsHiddenState, setAllPostingsHiddenState] = useState("hidden");
    const [allFollowedState,setAllFollowedState] = useState([]);
    const [allFollowedHiddenState, setAllFollowedHiddenState] = useState("hidden");
    const [allFollowingState,setAllFollowingState] = useState([]);
    const [allFollowingHiddenState, setAllFollowingHiddenState] = useState("hidden");
    const [allLikesState,setAllLikesState] = useState([]);
    const [allLikesHiddenState, setAllLikesHiddenState] = useState("hidden");
    const [allDislikesState,setAllDislikesState] = useState([]);
    const [allDislikesHiddenState, setAllDislikesHiddenState] = useState("hidden");


    const allImagesRefs = {};
    const allPostingsRefs = {};
    const allFollowedRefs = {};
    const allFollowingRefs = {};
    const allLikesRefs = {};
    const allDislikesRefs = {};

    function loadAllImages () {
        if(allImagesState.length == 0){
            var URL = "/profile/" + props.profile.id + "/fractals";
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
            var URL = "/profile/" + props.profile.id + "/postings";
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

    function loadAllFollowed () {
        //console.log(allPostingsState.length)
        if(allFollowedState.length == 0){
            var URL = "/profile/" + props.profile.id + "/followed";
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    console.log(data);
                    setAllFollowedState(data);
            })
        } else {
            if(allFollowedHiddenState === "hidden"){
                setAllFollowedHiddenState("visible");
            } else {
                setAllFollowedHiddenState("hidden");
            }
        }  
    }

    useEffect(() => {
        if (allImagesState.length > 0) {

            setAllImagesHiddenState("visible");
        }
    },[allImagesState])

    useEffect(() => {
        if (allPostingsState.length > 0) {

            setAllPostingsHiddenState("visible");
        }
    },[allPostingsState])

    useEffect(() => {
        if (allFollowedState.length > 0) {

            setAllFollowedHiddenState("visible");
        }
    },[allFollowedState])

    function choosePosting(object){
        let idPosting= object.id;
        let path = "/posting/" + idPosting;
        history.push(path);
    }

    function chooseFollowed(object){
        let idFollowed= object.id;
        let path = "/profile/" + idFollowed;
        if (idFollowed == myId){
            path = "/myprofile";
        }
        history.push(path);
    }

    function chooseImage(object){
        let idImg = object.id;
        /*let img = allImagesState.filter(obj => {
            return obj.imageId === idImg;
        })[0]*/
        let img = object;
        console.log(img);
        let path = "/";
        if(img.type === "image"){
            path = "/ImageCreator/old/" + idImg;
        } else if(img.type === "tree"){
            path = "/Tree/old/" + idImg;
        }
        history.push(path);
    }

    function deleteFromList(name, i){
        if (name == "Postings"){
            let URL = /posting/ + allPostingsState[i].id;
            httpService
                .delete(URL)
                .then((response) => {
                    console.log(response);
                    if (response.status == 202) {
                        let list = [...allPostingsState];
                        list.splice(i,1);
                        setAllPostingsState(list);
                    }
                })
        } else if (name == "Images"){
            let URL = /fractal/ + allImagesState[i].id;
            httpService
                .delete(URL)
                .then((response) => {
                    console.log(response);
                    if (response.status == 202) {
                        let list = [...allImagesState];
                        list.splice(i,1);
                        setAllImagesState(list);
                    }
                })
        } 
        

    }

    function MyList(name, data, refs, visibility, loadFunction, chooseFunction){
        return (
            <div>
                <button onClick={loadFunction} >{visibility === "hidden" ? "Show " + name: "Hide " + name}</button>
                <div className="myRow2" style = {{visibility:visibility}}>
                {
                        
                        data.map(function(object, i){
                            if(object!= null) {
                                return (   
                                    <div className="myColumnSimple"> 
                                        <img
                                            id={i}
                                            ref = {(ref) => refs[`img${i}`] = ref}
                                            src = {object.image}
                                            width = "100vw" height = "100vw"
                                            onClick={() => chooseFunction(object)}
                                            >
                                        </img>
                                        <pre>{object.name}</pre>
                                        <button style = {{visibility: ((visibility === "visible" && props.type === "mine") ? "visible" : "hidden")}} onClick={() => deleteFromList(name,i)}>Delete</button>
                                    </div>
                                );
                            }
                        })
                    }
                </div>
            </div>
        )
    }

    return (
        <div>
            {MyList("Postings",allPostingsState,allPostingsRefs,allPostingsHiddenState,loadAllPostings,choosePosting)}
            {props.type === "mine" || privacyOptions.fractals == true ? MyList("Images",allImagesState,allImagesRefs,allImagesHiddenState,loadAllImages,chooseImage) : <pre>You can't see this profile's images</pre>}
            {props.type === "mine" || privacyOptions.followers == true ? MyList("Followers",allFollowedState,allFollowedRefs,allFollowedHiddenState,loadAllFollowed,chooseFollowed) : <pre>You can't see this profile's followers</pre>}
        </div>
    );
}