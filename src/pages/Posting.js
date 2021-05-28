import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";
import { Link } from "react-router-dom";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function MyPosting(props) {
    const { id } = useParams();
    const authentication = useContext(AuthenticationContext);
    let profileId = authentication.getUser();
    //console.log(profileId)

    const [postingState, setPostingState] = useState(null);
    const [isLoading, setIsLoading] = useState(0);
    const [allCommentsState, setAllCommentsState] = useState(null);
    const [textNewCommentState, setTextNewCommentState] = useState("");
    const [newCommentHiddenState, setNewCommentHiddenState] = useState("hidden")
    const [textEditCommentState, setTextEditCommentState] = useState("");
    const [editCommentHiddenState, setEditCommentHiddenState] = useState("hidden")
    const [myProfile, setMyProfile] = useState(null);
    const [editingComment, setEditingComment] = useState(-1);
    const [likePostButtonColor, setLikePostButtonColor] = useState("#FFF");
    const [dislikePostButtonColor, setDislikePostButtonColor] = useState("#FFF");
    const [likeCommentButtonsColor, setLikeCommentButtonsColor] = useState();
    const [dislikeCommentButtonsColor, setDislikeCommentButtonsColor] = useState();
    const allCommentsRefs = {};
    
    function loadMyProfile(){
        let URL = "/profile/" + profileId;
        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
                //console.log(data);
                setMyProfile(data);
            })
            .catch((e) => {
                console.log(e);
              });
    }

    function loadPosting(){
        let URL = "/posting/" + id;
        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
                //console.log(data);
                setPostingState(data);
            })
            .catch((e) => {
                console.log(e);
              });
    }

    function loadAllComments(){
        var URL = "/posting/" + id + "/comments";
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    
                    setAllCommentsState(data);
            })
            .catch((e) => {
                console.log(e);
              });
    }

    useEffect(()=>{
        if(postingState != null){
            loadAllComments();
            if(checkIfObjectFromList(postingState.likedBy)){
                setLikePostButtonColor("#00F")
            }
            if(checkIfObjectFromList(postingState.dislikedBy)){
                setDislikePostButtonColor("#F00")
            }
        }
    },[postingState])

    useEffect(()=>{
        if(allCommentsState != null){
            loadMyProfile();
            let colors = []
            for (let j = 0; j < allCommentsState.length; j++){
                if(checkIfObjectFromList(allCommentsState[j].likedBy)){
                    colors.push("#00F");
                } else {
                    colors.push("#FFF");
                }     
            }
            setLikeCommentButtonsColor([...colors])

            colors = []
            for (let j = 0; j < allCommentsState.length; j++){
                if(checkIfObjectFromList(allCommentsState[j].dislikedBy)){
                    colors.push("#F00");
                } else {
                    colors.push("#FFF");
                }
                
            }
            setDislikeCommentButtonsColor([...colors])
        }
    },[allCommentsState])

    useEffect(()=>{
        if(myProfile != null){
            setIsLoading(1);
        }
    },[myProfile])

    useEffect(()=>{
        loadPosting();
    },[])

    function addComment(){
        if (newCommentHiddenState == "hidden")
            setNewCommentHiddenState("visible");
        else {
            setTextNewCommentState("");
            setNewCommentHiddenState("hidden");
        }
    }


    function postComment(){
        var currentdate = new Date(); 
        var datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth() < 9 ? "0"+ (currentdate.getMonth() + 1) : (currentdate.getMonth() + 1))  + "-" 
                + (currentdate.getDate() < 10 ? "0"+ currentdate.getDate() : currentdate.getDate()) + " "  
                + (currentdate.getHours() < 10 ? "0"+ currentdate.getHours() : currentdate.getHours()) + ":"  
                + (currentdate.getMinutes() < 10 ? "0"+ currentdate.getMinutes() : currentdate.getMinutes()) + ":" 
                + (currentdate.getSeconds() < 10 ? "0"+ currentdate.getSeconds() : currentdate.getSeconds())
        let comment = {
            "id":0,
            "text":textNewCommentState,
            "lastModified":datetime,
            "edited":false,
            "createdBy":myProfile.name,
            "profile":{
                "id":profileId
            },
            "posting":{
                "id":id
            },
            "likedBy":[],
            "dislikedBy":[]

        }
        var URL = "/comment"
        httpService
            .post(URL, comment)
            .then((response) => {
                console.log(response.data);
                let commentList = [...allCommentsState]
                comment.id = response.data.id
                commentList.push(comment);
                setAllCommentsState(commentList);
            })
            .catch((e) => {
                console.log(e);
              });
        
        setTextNewCommentState("");
        setNewCommentHiddenState("hidden")
    }

    function handleChangeNewComment(event){
        const { value } = event.target;
        setTextNewCommentState(value);
    }

    function handleChangeEditComment(event){
        const { value } = event.target;
        setTextEditCommentState(value);
    }

    function editComment(){
        let commentList = JSON.parse(JSON.stringify(allCommentsState));
        let comment = commentList[editingComment];
        comment.text = textEditCommentState;
        comment.edited = true;
        let commentId = comment.id;
        let URL = "/comment/" + commentId;
        setAllCommentsState(commentList);
        setEditingComment(-1);
        setTextEditCommentState("");
        httpService
            .put(URL, comment)
            .then((response) => {
                console.log(response.data);
                
            })
            .catch((e) => {
                console.log(e);
              });
    }

    function CommentText(object,i){
        //console.log(editingComment)
        //console.log(i)
        if(i != editingComment){
            return (
                <div style={{width: "35vw", wordWrap:"break-word"}} className="fs-6 fw-bold lh-1">{object.text}</div>
            )
        } else {
            return(
                <div className="myRowSimple">
                    <input 
                        className="form-control"
                        style={{height:"7vh"}}
                        type="text" 
                        name="Text"
                        value={textEditCommentState}
                        onChange={handleChangeEditComment}
                    ></input>
                    <button style={{display:"flex", height:"7vh"}} className="btn btn-outline-primary" onClick={editComment}><span style={{fontSize:"0.9vw"}}>Edit Comment</span></button>
                </div>
            )
        }
    }

    function startEditingComment(object, i){
        if(editingComment == -1){
            setEditingComment(i);
            setTextEditCommentState(object.text);
        } else {
            setEditingComment(-1);
            setTextEditCommentState("");
        }  
    }

    function removeObjectFromList(list){
        let k = 0
        while(k < list.length){
            if(list[k].id == profileId){
                break;
            }
            k++;
        }
        list.splice(k,1);
    }

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

    function saveLikePost(object){
        let URL = "/posting/" + id;
        httpService
            .put(URL, object)
            .then((response) => {
                console.log(response.data);
                
            })
            .catch((e) => {
                console.log(e);
              });
    }

    function saveLikeComment(comment){
        let URL = "/comment/" + comment.id;
        httpService
            .put(URL, comment)
            .then((response) => {
                console.log(response.data);
                
            })
            .catch((e) => {
                console.log(e);
              });
    }

    function likePost(){
        if(profileId != postingState.profile.id){
            let postingCopy = JSON.parse(JSON.stringify(postingState)) 
            if(likePostButtonColor === "#FFF"){
                setLikePostButtonColor("#00F")
                postingCopy.likedBy.push({id:profileId})
                if(dislikePostButtonColor !== "#FFF"){
                    setDislikePostButtonColor("#FFF")
                    removeObjectFromList(postingCopy.dislikedBy)
                }
                setPostingState(postingCopy);
                saveLikePost(postingCopy);
            } else {
                setLikePostButtonColor("#FFF")
                removeObjectFromList(postingCopy.likedBy)
                setPostingState(postingCopy);
                saveLikePost(postingCopy);
            }
        } else {
            alert("You can't like your own post");
        }
        
    }

    function dislikePost(){
        if(profileId != postingState.profile.id){
            let postingCopy = JSON.parse(JSON.stringify(postingState)) 
            if(dislikePostButtonColor === "#FFF"){
                setDislikePostButtonColor("#F00")
                postingCopy.dislikedBy.push({id:profileId})
                if(likePostButtonColor !== "#FFF"){
                    setLikePostButtonColor("#FFF")
                    removeObjectFromList(postingCopy.likedBy)
                }
                setPostingState(postingCopy);
                saveLikePost(postingCopy);
            } else {
                setDislikePostButtonColor("#FFF")
                removeObjectFromList(postingCopy.dislikedBy)
                setPostingState(postingCopy);
                saveLikePost(postingCopy);
            }
        } else {
            alert("You can't dislike your own post");
        }
    }

    function likeComment(object, i){
        if(profileId != object.profile.id){
            let comments = JSON.parse(JSON.stringify(allCommentsState)) 
            let comment = comments[i]
            let likeColors = [...likeCommentButtonsColor]
            let dislikeColors = [...dislikeCommentButtonsColor]
            if(likeColors[i] === "#FFF"){
                likeColors[i] = "#00F"
                setLikeCommentButtonsColor(likeColors)
                comment.likedBy.push({id:profileId})
                if(dislikeColors[i] != "#FFF"){
                    dislikeColors[i] = "#FFF";
                    setDislikeCommentButtonsColor(dislikeColors);
                    removeObjectFromList(comment.dislikedBy)
                }
                //console.log(comment)
                setAllCommentsState(comments);
                saveLikeComment(comment);
                
            } else {
                likeColors[i] = "#FFF"
                setLikeCommentButtonsColor(likeColors)
                removeObjectFromList(comment.likedBy)
                setAllCommentsState(comments);
                saveLikeComment(comment);
            }
        } else {
            alert("You can't like your own comment");
        }
    }

    function dislikeComment(object, i){
        if(profileId != object.profile.id){
            let comments = JSON.parse(JSON.stringify(allCommentsState)) 
            let comment = comments[i]
            let likeColors = [...likeCommentButtonsColor]
            let dislikeColors = [...dislikeCommentButtonsColor]
            if(dislikeColors[i] === "#FFF"){
                dislikeColors[i] = "#F00"
                setDislikeCommentButtonsColor(dislikeColors)
                comment.dislikedBy.push({id:profileId})
                if(likeColors[i] != "#FFF"){
                    likeColors[i] = "#FFF";
                    setLikeCommentButtonsColor(likeColors);
                    removeObjectFromList(comment.likedBy)
                }
                setAllCommentsState(comments);
                saveLikeComment(comment);
                
            } else {
                likeColors[i] = "#FFF"
                setDislikeCommentButtonsColor(dislikeColors)
                removeObjectFromList(comment.dislikedBy)
                setAllCommentsState(comments);
                saveLikeComment(comment);
            }
        } else {
            alert("You can't dislike your own comment");
        }
    }

    function deleteComment(idComment, i) {
        let URL = "/comment/" + idComment;
        httpService
            .delete(URL)
            .then((response) => {
                //console.log(response);
                let list = [...allCommentsState];
                list.splice(i,1);
                setAllCommentsState(list);
            })
            .catch((e) => {
                console.log(e);
              });
    }

    return(
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
                width:"50vw",
                overflowX: "hidden",
                overflowY: "scroll"
            }}>
                <div className="myRow3">
                    <pre className="fw-bold text-muted fs-5">Name: </pre>
                    <pre className="fs-5">{isLoading === 1 ? postingState.fractal.name : ""}</pre>
        
                </div>
                <hr/>
                <div className="myColumn3">
                    <pre className="fw-bold text-muted fs-6">Description: </pre>
                    <pre style={{width: "35vw", wordWrap:"break-word", textAlign:"center"}} className="fs-6">{isLoading === 1 ? postingState.fractal.description : ""}</pre>
                </div>
                <div className="myRow3">
                    <pre className="fw-bold text-muted fs-6">Created by: </pre>
                    <Link to={isLoading ===1 ? ("/profile/" + postingState.profile.id) : "myprofile"}>
                        <pre className="fs-6">{isLoading === 1 ? postingState.profile.name : ""}</pre>
                    </Link>
                </div>
                <img className="rounded img-thumbnail mx-auto d-block" src={isLoading === 1 ? postingState.fractal.dataURL : ""} height="200" width="200"></img>
                <div className="myRow3 mt-2">
                    <button className = {likePostButtonColor == "#FFF" ? "btn btn-outline-secondary bi bi-hand-thumbs-up" : "btn btn-outline-secondary bi bi-hand-thumbs-up-fill"} onClick={likePost}><span className="badge bg-success ms-1">{isLoading === 1 ? postingState.likedBy.length : ""}</span></button>
                    <pre>  </pre>
                    <button className = {dislikePostButtonColor == "#FFF" ? "btn btn-outline-secondary bi bi-hand-thumbs-down" : "btn btn-outline-secondary bi bi-hand-thumbs-down-fill"} onClick={dislikePost}><span className="badge bg-danger ms-1">{isLoading === 1 ? postingState.dislikedBy.length : ""}</span></button>
                </div>
                <div style={{
                    display:"flex",
                    alignItems: "center",
                    flexDirection: "column"
                }}> 
                    <button className="btn btn-outline-primary mt-2" style={{visibility:(isLoading == 0 ? "hidden" : "visible")}} onClick={addComment}>Add Comment</button>
                    <pre style={{visibility:(isLoading == 0 ? "hidden" : "visible")}}>Comments:</pre>
                    <div className="myRowSimple" style = {{display:newCommentHiddenState == "visible" ? "flex" : "none"}}>
                        <input 
                            className="form-control"
                            style={{height:"7vh"}}
                            type="text" 
                            name="Text"
                            value={textNewCommentState}
                            onChange={handleChangeNewComment}
                        ></input>
                        <button style={{display:"flex", height:"7vh"}} className="btn btn-outline-primary" onClick={postComment}><span style={{fontSize:"0.9vw"}}>Post Comment</span></button>
                    </div>
                    <div style={{
                        display:"flex",
                        flexDirection:"column",
                        alignItems:"flex-start"
                    }}>
                        {
                            isLoading === 1 ? 
                            (allCommentsState.map(function(object, i){
                                if(object!= null) {
                                    return (   
                                        <div id={i} > 
                                            <hr></hr>
                                            <div className="myRowSimple">
                                                <pre><span className="fw-bold">{object.profile.id != profileId ? object.createdBy : "Me"}</span> at <span className="fw-light fst-italic text-muted">{object.lastModified} {object.edited == true ? "edited" : ""}</span>  </pre>
                                                <div className="btn-group" role="group">
                                                    <button className="btn btn-outline-secondary" id={i} style={{visibility:(object.profile.id != profileId ? "hidden" : "visible")}} onClick={() => startEditingComment(object,i)}>Edit</button>
                                                    <button className="btn btn-outline-danger" style={{visibility:(object.profile.id != profileId ? "hidden" : "visible")}} onClick={() => deleteComment(object.id, i)}>Delete</button>
                                                </div>
                                            </div>
                                            {CommentText(object,i)}
                                            <div className="mt-2" style={{display:"flex"}}>
                                                <button className = {likeCommentButtonsColor[i] == "#FFF" ? "btn btn-outline-secondary bi bi-hand-thumbs-up" : "btn btn-outline-secondary bi bi-hand-thumbs-up-fill"} onClick={() => likeComment(object, i)}><span className="badge bg-success ms-1">{isLoading === 1 ? object.likedBy.length : ""}</span></button>
                                                <pre>  </pre>
                                                <button className = {dislikeCommentButtonsColor[i] == "#FFF" ? "btn btn-outline-secondary bi bi-hand-thumbs-down" : "btn btn-outline-secondary bi bi-hand-thumbs-down-fill"} onClick={() => dislikeComment(object, i)}><span className="badge bg-danger ms-1">{isLoading === 1 ? object.dislikedBy.length : ""}</span></button>
                                            </div>
                                        </div>
                                    );
                                }
                            })) : <div></div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}