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
    const [allImagesLoadingState, setAllImagesLoadingState] = useState(0);
    const [allPostingsState,setAllPostingsState] = useState(null);
    const [allPostingsHiddenState, setAllPostingsHiddenState] = useState("none");
    const [allPostingsLoadingState, setAllPostingsLoadingState] = useState(0);
    const [allFollowedState,setAllFollowedState] = useState(null);
    const [allFollowedHiddenState, setAllFollowedHiddenState] = useState("none");
    const [allFollowedLoadingState, setAllFollowedLoadingState] = useState(0);
    const [allFollowingState,setAllFollowingState] = useState(null);
    const [allFollowingHiddenState, setAllFollowingHiddenState] = useState("none");
    const [allFollowingLoadingState, setAllFollowingLoadingState] = useState(0);
    const [allLikesState,setAllLikesState] = useState(null);
    const [allLikesHiddenState, setAllLikesHiddenState] = useState("none");
    const [allLikesLoadingState, setAllLikesLoadingState] = useState(0);
    const [allDislikesState,setAllDislikesState] = useState(null);
    const [allDislikesHiddenState, setAllDislikesHiddenState] = useState("none");
    const [allDislikesLoadingState, setAllDislikesLoadingState] = useState(0);


    const allImagesRefs = {};
    const allPostingsRefs = {};
    const allFollowedRefs = {};
    const allFollowingRefs = {};
    const allLikesRefs = {};
    const allDislikesRefs = {};

    function loadAllImages () {
        if(allImagesState == null){
            hideLists();
            var URL = "/profile/" + props.profile.id + "/fractals";
            setAllImagesLoadingState(1);
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
                hideLists();
                setAllImagesHiddenState("flex");
            } else {
                setAllImagesHiddenState("none");
            }
        }
    }

    function loadAllPostings () {
        if(allPostingsState == null){
            hideLists();
            var URL = "/profile/" + props.profile.id + "/postings";
            setAllPostingsLoadingState(1);
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
                hideLists();
                setAllPostingsHiddenState("flex");
            } else {
                setAllPostingsHiddenState("none");
            }
        }  
    }

    function loadAllFollowed () {
        if(allFollowedState == null){
            hideLists();
            var URL = "/profile/" + props.profile.id + "/followed";
            setAllFollowedLoadingState(1);
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
                hideLists();
                setAllFollowedHiddenState("flex");
            } else {
                setAllFollowedHiddenState("none");
            }
        }  
    }

    function loadAllFollowing () {
        if(allFollowingState == null){
            hideLists();
            var URL = "/profile/" + props.profile.id + "/following";
            setAllFollowingLoadingState(1);
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
                hideLists();
                setAllFollowingHiddenState("flex");
            } else {
                setAllFollowingHiddenState("none");
            }
        }  
    }

    function loadAllLikes () {
        if(allLikesState == null){
            hideLists();
            var URL = "/profile/" + props.profile.id + "/likes";
            setAllLikesLoadingState(1);
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
                hideLists();
                setAllLikesHiddenState("flex");
            } else {
                setAllLikesHiddenState("none");
            }
        }  
    }

    function loadAllDislikes () {
        if(allDislikesState == null){
            hideLists();
            var URL = "/profile/" + props.profile.id + "/dislikes";
            setAllDislikesLoadingState(1);
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
                hideLists();
                setAllDislikesHiddenState("flex");
            } else {
                setAllDislikesHiddenState("none");
            }
        }  
    }

    useEffect(() => {
        if (allImagesState != null) {
            setAllImagesLoadingState(0);
            setAllImagesHiddenState("flex");
            setAllPostingsHiddenState("none");
        }
    },[allImagesState])

    useEffect(() => {
        if (allPostingsState != null) {
            setAllPostingsLoadingState(0);
            setAllPostingsHiddenState("flex");
        }
    },[allPostingsState])

    useEffect(() => {
        if (allFollowedState != null) {
            setAllFollowedLoadingState(0);
            setAllFollowedHiddenState("flex");
        }
    },[allFollowedState])

    useEffect(() => {
        if (allFollowingState != null) {
            setAllFollowingLoadingState(0);
            setAllFollowingHiddenState("flex");
        }
    },[allFollowingState])

    useEffect(() => {
        if (allLikesState != null) {
            setAllLikesLoadingState(0);
            setAllLikesHiddenState("flex");
        }
    },[allLikesState])

    useEffect(() => {
        if (allDislikesState != null) {
            setAllDislikesLoadingState(0);
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
        } else if(img.type === "mountain"){
            path = "/Mountain/old/" + idImg;
        } else if(img.type === "snowFlake"){
            path = "/SnowFlake/old/" + idImg;
        } 
        history.push(path);
    }

    function hideLists() {
        console.log("aabr")
        setAllPostingsHiddenState("none");
        setAllImagesHiddenState("none");
        setAllFollowingHiddenState("none");
        setAllFollowedHiddenState("none");
        setAllLikesHiddenState("none");
        setAllDislikesHiddenState("none");
    }

    function checkLoading() {
        if (allPostingsLoadingState == 0 && 
            allImagesLoadingState == 0 && 
            allFollowingLoadingState == 0 && 
            allFollowedLoadingState == 0 && 
            allLikesLoadingState == 0 &&
            allDislikesLoadingState == 0) {
                return true;
            }
        return false;
    }

    return (
        <div style={{
            display:"flex",
            height: "46vh",
            justifyContent:"space-between"
        }}>
            <div 
                className="btn-group"
                role="group"
                style={{
                    display:"flex",
                    flexDirection:"column",
                    border: "1px groove gray",
                    height:"40vh",
                    width:"15vw"
                }}
            >
                <button className="btn btn-outline-dark" style={{height:"6vh"}} onClick={checkLoading() ? loadAllPostings : null} ><span style={{fontSize:"1.5vw"}}>{allPostingsHiddenState === "none" ? "Show " + "Postings": "Hide " + "Postings"}</span></button>
                <button className="btn btn-outline-dark" style={{height:"6vh"}} onClick={checkLoading() ? loadAllImages : null} ><span style={{fontSize:"1.5vw"}}>{allImagesHiddenState === "none" ? "Show " + "Images": "Hide " + "Images"}</span></button>
                <button className="btn btn-outline-dark" style={{height:"6vh"}} onClick={checkLoading() ? loadAllFollowing : null} ><span style={{fontSize:"1.5vw"}}>{allFollowingHiddenState === "none" ? "Show " + "Following": "Hide " + "Following"}</span></button>
                <button className="btn btn-outline-dark" style={{height:"6vh"}} onClick={checkLoading() ? loadAllFollowed : null} ><span style={{fontSize:"1.5vw"}}>{allFollowedHiddenState === "none" ? "Show " + "Followed": "Hide " + "Followed"}</span></button>
                <button className="btn btn-outline-dark" style={{height:"6vh"}} onClick={checkLoading() ? loadAllLikes : null} ><span style={{fontSize:"1.5vw"}}>{allLikesHiddenState === "none" ? "Show " + "Likes": "Hide " + "Likes"}</span></button>
                <button className="btn btn-outline-dark" style={{height:"6vh"}} onClick={checkLoading() ? loadAllDislikes : null} ><span style={{fontSize:"1.5vw"}}>{allDislikesHiddenState === "none" ? "Show " + "Dislikes": "Hide " + "Dislikes"}</span></button>
            </div>
            <div style={{
                display:"flex",
                flexDirection:"column",
                height:"44vh",
                width:"25vw"
            }}>
                {<MyList isColumn={true} isProfile={true} type={props.type} name="Postings" data={allPostingsState} setData={setAllPostingsState} refs={allPostingsRefs} visibility={allPostingsHiddenState} loadFunction={loadAllPostings} chooseFunction={choosePosting} isLoading={allPostingsLoadingState}/>}
                {props.type === "mine" || privacyOptions.fractals == true ? <MyList isColumn={true} isProfile={true} type={props.type} name="Images" data={allImagesState} otherData={allPostingsState} setOtherData={setAllPostingsState} setData={setAllImagesState} refs={allImagesRefs} visibility={allImagesHiddenState} loadFunction={loadAllImages} chooseFunction={chooseImage} isLoading={allImagesLoadingState}/> : <div style={{display:allImagesHiddenState, justifyContent:"center"}}><pre>You can't see this profile's images</pre></div>}
                {props.type === "mine" || privacyOptions.followers == true ? <MyList isColumn={true} isProfile={true} type={props.type} name="Followers" data={allFollowedState} setData={setAllFollowedState} refs={allFollowedRefs} visibility={allFollowedHiddenState} loadFunction={loadAllFollowed} chooseFunction={chooseFollowed} isLoading={allFollowedLoadingState}/> : <div style={{display:allFollowedHiddenState, justifyContent:"center"}}><pre>You can't see this profile's followers</pre></div>}
                {props.type === "mine" || privacyOptions.following == true ? <MyList isColumn={true} isProfile={true} type={props.type} name="Following" data={allFollowingState} setData={setAllFollowingState} refs={allFollowingRefs} visibility={allFollowingHiddenState} loadFunction={loadAllFollowing} chooseFunction={chooseFollowing} isLoading={allFollowingLoadingState}/> : <div style={{display:allFollowingHiddenState, justifyContent:"center"}}><pre>You can't see this profile's following</pre></div>}
                {props.type === "mine" || privacyOptions.likes == true ? <MyList isColumn={true} isProfile={true} type={props.type} name="Likes" data={allLikesState} setData={setAllLikesState} refs={allLikesRefs} visibility={allLikesHiddenState} loadFunction={loadAllLikes} chooseFunction={chooseLikes} isLoading={allLikesLoadingState}/> : <div style={{display:allLikesHiddenState, justifyContent:"center"}}><pre>You can't see this profile's likes</pre></div>}
                {props.type === "mine" || privacyOptions.dislikes== true ? <MyList isColumn={true} isProfile={true} type={props.type} name="Dislikes" data={allDislikesState} setData={setAllDislikesState} refs={allDislikesRefs} visibility={allDislikesHiddenState} loadFunction={loadAllDislikes} chooseFunction={chooseDislikes} isLoading={allDislikesLoadingState}/> : <div style={{display:allDislikesHiddenState, justifyContent:"center"}}><pre>You can't see this profile's dislikes</pre></div>}
            </div>
        </div>
    );
}