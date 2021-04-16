import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";

export default function MyPosting(props) {
    const { id } = useParams();
    const authentication = useContext(AuthenticationContext);
    let profileId = authentication.id;
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
    }

    function loadAllComments(){
        var URL = "/posting/" + id + "/comments";
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    
                    setAllCommentsState(data);
            })
    }

    useEffect(()=>{
        if(postingState != null){
            loadAllComments();
            saveLikePost();
            console.log(postingState.likedBy)
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
        setNewCommentHiddenState("visible");
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
                
            });
    }

    function CommentText(object,i){
        //console.log(editingComment)
        //console.log(i)
        if(i != editingComment){
            return (
                <p>{object.text}</p>
            )
        } else {
            return(
                <div className="myRowSimple">
                    <input 
                        type="text" 
                        name="Text"
                        value={textEditCommentState}
                        onChange={handleChangeEditComment}
                    ></input>
                    <button onClick={editComment}>Edit Comment</button>
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

    function saveLikePost(){
        let URL = "/posting/" + id;
        httpService
            .put(URL, postingState)
            .then((response) => {
                console.log(response.data);
                
            });
    }

    function saveLikeComment(comment){
        let URL = "/comment/" + comment.id;
        httpService
            .put(URL, comment)
            .then((response) => {
                console.log(response.data);
                
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
                //saveLikePost()
            } else {
                setLikePostButtonColor("#FFF")
                removeObjectFromList(postingCopy.likedBy)
                setPostingState(postingCopy);
                //saveLikePost();
            }
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
                //saveLikePost()
            } else {
                setDislikePostButtonColor("#FFF")
                removeObjectFromList(postingCopy.dislikedBy)
                setPostingState(postingCopy);
                //saveLikePost();
            }
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
                setAllCommentsState(comments);
                
            } else {
                likeColors[i] = "#FFF"
                setLikeCommentButtonsColor(likeColors)
                removeObjectFromList(comment.likedBy)
                setAllCommentsState(comments);
            }
        }
    }

    function dislikeComment(object, i){
        if(profileId != object.profile.id){
            let colors = [...dislikeCommentButtonsColor]
            if(colors[i] === "#FFF"){
                colors[i] = "#F00"
                setDislikeCommentButtonsColor(colors)
            } else {
                colors[i] = "#FFF"
                setDislikeCommentButtonsColor(colors)
            }
        }
    }

    return(
        <div>
            <div className="myRowSimple">
                <pre style={{visibility:(isLoading == 0 ? "hidden" : "visible")}}>Name: </pre>
                <pre>{isLoading === 1 ? postingState.fractal.name : ""}</pre>
            </div>
            
            <div className="myRowSimple">
                <pre style={{visibility:(isLoading == 0 ? "hidden" : "visible")}}>Description: </pre>
                <pre>{isLoading === 1 ? postingState.fractal.description : ""}</pre>
            </div>
            <div className="myRowSimple">
                <pre style={{visibility:(isLoading == 0 ? "hidden" : "visible")}}>Created by: </pre>
                <pre>{isLoading === 1 ? postingState.profile.name : ""}</pre>
            </div>
            <img src={isLoading === 1 ? postingState.fractal.dataURL : ""} height="200" width="200" style={{visibility:(isLoading === 1 ? "visible" : "hidden")}}></img>
            <div className="myRowSimple" style={{visibility:(isLoading == 0 ? "hidden" : "visible")}}>
                <pre>{isLoading === 1 ? postingState.likedBy.length : ""}</pre>
                <button style={{background:likePostButtonColor}} onClick={likePost}>Like</button>
                <pre>  </pre>
                <pre>{isLoading === 1 ? postingState.dislikedBy.length : ""}</pre>
                <button style={{background:dislikePostButtonColor}} onClick={dislikePost}>Dislike</button>
            </div>
            <div>
                
                <button style={{visibility:(isLoading == 0 ? "hidden" : "visible")}} onClick={addComment}>Add Comment</button>
                <pre style={{visibility:(isLoading == 0 ? "hidden" : "visible")}}>Comments:</pre>
                <div className="myRowSimple" style = {{visibility:newCommentHiddenState}}>
                    <input 
                        type="text" 
                        name="Text"
                        value={textNewCommentState}
                        onChange={handleChangeNewComment}
                    ></input>
                    <button onClick={postComment}>Post Comment</button>
                </div>
                
                
                {
                    isLoading === 1 ? 
                    (allCommentsState.map(function(object, i){
                        if(object!= null) {
                            return (   
                                <div id={i} > 
                                    <hr></hr>
                                    <div className="myRowSimple">
                                        <pre>{object.profile.id != profileId ? object.createdBy : "Me"} at {object.lastModified} {object.edited == true ? "edited" : ""}  </pre>
                                        <button id={i} style={{visibility:(object.profile.id != profileId ? "hidden" : "visible")}} onClick={() => startEditingComment(object,i)}>Edit</button>
                                        <button style={{visibility:(object.profile.id != profileId ? "hidden" : "visible")}}>Delete</button>
                                    </div>
                                    {CommentText(object,i)}
                                    <div className="myRowSimple" style={{visibility:(isLoading == 0 ? "hidden" : "visible")}}>
                                        <pre>{isLoading === 1 ? object.likedBy.length : ""}</pre>
                                        <button style={{background:likeCommentButtonsColor[i]}} onClick={() => likeComment(object, i)}>Like</button>
                                        <pre> </pre>
                                        <pre>{isLoading === 1 ? object.dislikedBy.length : ""}</pre>
                                        <button style={{background:dislikeCommentButtonsColor[i]}} onClick={() => dislikeComment(object, i)}>Dislike</button>
                                        <pre> </pre>
                                        
                                    </div>
                                </div>
                            );
                        }
                    })) : <div></div>
                }
            </div>
        </div>
    )
}