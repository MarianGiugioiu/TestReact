import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";
import MyList from '../components/MyList';


export default function Profile(props) {
    const history = useHistory();
    const authentication = useContext(AuthenticationContext);
    const privacyOptions = JSON.parse(props.profile.privacy);
    let myId = authentication.getUser();

    const [allImagesState,setAllImagesState] = useState(null);
    const [allImagesHiddenState, setAllImagesHiddenState] = useState("none");
    const [allPostingsState,setAllPostingsState] = useState(null);
    const [allPostingsHiddenState, setAllPostingsHiddenState] = useState("none");
    const [allFollowedState,setAllFollowedState] = useState(null);
    const [allFollowedHiddenState, setAllFollowedHiddenState] = useState("none");
    const [allFollowingState,setAllFollowingState] = useState(null);
    const [allFollowingHiddenState, setAllFollowingHiddenState] = useState("none");
    const [allLikesState,setAllLikesState] = useState(null);
    const [allLikesHiddenState, setAllLikesHiddenState] = useState("none");
    const [allDislikesState,setAllDislikesState] = useState(null);
    const [allDislikesHiddenState, setAllDislikesHiddenState] = useState("none");


    const allImagesRefs = {};
    const allPostingsRefs = {};
    const allFollowedRefs = {};
    const allFollowingRefs = {};
    const allLikesRefs = {};
    const allDislikesRefs = {};

    function loadAllImages () {
        if(allImagesState == null){
            var URL = "/profile/" + props.profile.id + "/fractals";
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    console.log(data);
                    setAllImagesState(data);
                })
                .catch((e) => {
                    console.log(e);
                  });
        } else {
            if(allImagesHiddenState === "none"){
                setAllImagesHiddenState("flex");
            } else {
                setAllImagesHiddenState("none");
            }
        }
    }

    function loadAllPostings () {
        if(allPostingsState == null){
            var URL = "/profile/" + props.profile.id + "/postings";
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    console.log(data);
                    setAllPostingsState(data);
                })
                .catch((e) => {
                    console.log(e);
                  });
        } else {
            if(allPostingsHiddenState === "none"){
                setAllPostingsHiddenState("flex");
            } else {
                setAllPostingsHiddenState("none");
            }
        }  
    }

    function loadAllFollowed () {
        if(allFollowedState == null){
            var URL = "/profile/" + props.profile.id + "/followed";
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    console.log(data);
                    setAllFollowedState(data);
                })
                .catch((e) => {
                    console.log(e);
                  });
        } else {
            if(allFollowedHiddenState === "none"){
                setAllFollowedHiddenState("flex");
            } else {
                setAllFollowedHiddenState("none");
            }
        }  
    }

    function loadAllFollowing () {
        if(allFollowingState == null){
            var URL = "/profile/" + props.profile.id + "/following";
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    console.log(data);
                    setAllFollowingState(data);
                })
                .catch((e) => {
                    console.log(e);
                  });
        } else {
            if(allFollowingHiddenState === "none"){
                setAllFollowingHiddenState("flex");
            } else {
                setAllFollowingHiddenState("none");
            }
        }  
    }

    function loadAllLikes () {
        if(allLikesState == null){
            var URL = "/profile/" + props.profile.id + "/likes";
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    console.log(data);
                    setAllLikesState(data);
                })
                .catch((e) => {
                    console.log(e);
                  });
        } else {
            if(allLikesHiddenState === "none"){
                setAllLikesHiddenState("flex");
            } else {
                setAllLikesHiddenState("none");
            }
        }  
    }

    function loadAllDislikes () {
        if(allDislikesState == null){
            var URL = "/profile/" + props.profile.id + "/dislikes";
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    console.log(data);
                    setAllDislikesState(data);
                })
                .catch((e) => {
                    console.log(e);
                  });
        } else {
            if(allDislikesHiddenState === "none"){
                setAllDislikesHiddenState("flex");
            } else {
                setAllDislikesHiddenState("none");
            }
        }  
    }

    useEffect(() => {
        if (allImagesState != null) {

            setAllImagesHiddenState("flex");
        }
    },[allImagesState])

    useEffect(() => {
        if (allPostingsState != null) {

            setAllPostingsHiddenState("flex");
        }
    },[allPostingsState])

    useEffect(() => {
        if (allFollowedState != null) {

            setAllFollowedHiddenState("flex");
        }
    },[allFollowedState])

    useEffect(() => {
        if (allFollowingState != null) {

            setAllFollowingHiddenState("flex");
        }
    },[allFollowingState])

    useEffect(() => {
        if (allLikesState != null) {

            setAllLikesHiddenState("flex");
        }
    },[allLikesState])

    useEffect(() => {
        if (allDislikesState != null) {

            setAllDislikesHiddenState("flex");
        }
    },[allDislikesState])

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

    function chooseFollowing(object){
        let idFollowing= object.id;
        let path = "/profile/" + idFollowing;
        if (idFollowing == myId){
            path = "/myprofile";
        }
        history.push(path);
    }

    function chooseLikes(object){
        let idLikes= object.id;
        let path = "/posting/" + idLikes;
        history.push(path);
    }

    function chooseDislikes(object){
        let idDislikes= object.id;
        let path = "/posting/" + idDislikes;
        history.push(path);
    }

    function chooseImage(object){
        let idImg = object.id;
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

    return (
        <div>
            {<MyList isProfile={true} type={props.type} name="Postings" data={allPostingsState} setData={setAllPostingsState} refs={allPostingsRefs} visibility={allPostingsHiddenState} loadFunction={loadAllPostings} chooseFunction={choosePosting} />}
            {props.type === "mine" || privacyOptions.fractals == true ? <MyList isProfile={true} type={props.type} name="Images" data={allImagesState} setData={setAllImagesState} refs={allImagesRefs} visibility={allImagesHiddenState} loadFunction={loadAllImages} chooseFunction={chooseImage} /> : <pre>You can't see this profile's images</pre>}
            {props.type === "mine" || privacyOptions.followers == true ? <MyList isProfile={true} type={props.type} name="Followers" data={allFollowedState} setData={setAllFollowedState} refs={allFollowedRefs} visibility={allFollowedHiddenState} loadFunction={loadAllFollowed} chooseFunction={chooseFollowed} /> : <pre>You can't see this profile's images</pre>}
            {props.type === "mine" || privacyOptions.following == true ? <MyList isProfile={true} type={props.type} name="Following" data={allFollowingState} setData={setAllFollowingState} refs={allFollowingRefs} visibility={allFollowingHiddenState} loadFunction={loadAllFollowing} chooseFunction={chooseFollowing} /> : <pre>You can't see this profile's images</pre>}
            {props.type === "mine" || privacyOptions.likes == true ? <MyList isProfile={true} type={props.type} name="Likes" data={allLikesState} setData={setAllLikesState} refs={allLikesRefs} visibility={allLikesHiddenState} loadFunction={loadAllLikes} chooseFunction={chooseLikes} /> : <pre>You can't see this profile's images</pre>}
            {props.type === "mine" || privacyOptions.dislikes== true ? <MyList isProfile={true} type={props.type} name="Dislikes" data={allDislikesState} setData={setAllDislikesState} refs={allDislikesRefs} visibility={allDislikesHiddenState} loadFunction={loadAllDislikes} chooseFunction={chooseDislikes} /> : <pre>You can't see this profile's images</pre>}
            
        </div>
    );
}