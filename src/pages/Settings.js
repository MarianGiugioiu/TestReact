import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import defaultImg from "../images/default.png";

export default function Settings(props) {
    const history = useHistory();
    const authentication = useContext(AuthenticationContext);
    let myId = authentication.getUser();
    const [myProfile, setMyProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(0);
    const [privacyOptions, setPrivacyOptions] = useState(null)
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageDataURL, setImageDataURL] = useState(null);

    const canvasRef = useRef(null);
    const imgCanvas = useRef(null);

    const canvasDim = 100;

    function handleClickLogOut(){
        authentication.logOut();
        let path = "/"
        history.push(path);
    }

    function loadMyProfile(){
        let URL = "/profile/" + myId;
        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
                //console.log(data);
                setMyProfile(data);
                setUploadedImage(data.photo)
            })
    }

    useEffect(()=>{
        if(myProfile!=null){
            //console.log(myProfile)
            setIsLoading(1);
            let options = JSON.parse(myProfile.privacy);
            //console.log(options)
            setPrivacyOptions(options);
        }
    },[myProfile])


    useEffect(()=>{
        loadMyProfile();
    },[])

    function handleChangeData(event){
        const { name, value } = event.target;
        let profileCopy = JSON.parse(JSON.stringify(myProfile));
        profileCopy[name] = value;
        setMyProfile(profileCopy)
    }

    function saveChanges(){
        let URL = "/profile/" + myId;
        let profileCopy = JSON.parse(JSON.stringify(myProfile));
        profileCopy.privacy = JSON.stringify(privacyOptions);
        profileCopy.photo = imageDataURL;

        httpService
            .put(URL,profileCopy)
            .then((response) => {
                var data = response.data;
                console.log(data);
                
            })
    }

    function handleChangePrivacy(key){
        let optionsCopy = JSON.parse(JSON.stringify(privacyOptions));
        optionsCopy[key] = !optionsCopy[key];
        setPrivacyOptions(optionsCopy);

    }

    function uploadImage(event){
        let file = event.target.files[0];
        console.log(file);
        if (file == null) {
            setUploadedImage("");
        } else {
            setUploadedImage(URL.createObjectURL(file));
        }
    }

    function loadCanvas(){
        let canvas = canvasRef.current
        let image = imgCanvas.current;
        let context = canvas.getContext("2d");
        canvas.width = canvasDim;
        canvas.height = canvasDim;
        context.drawImage(image,0,0,canvasDim,canvasDim);
        let data = canvas.toDataURL("image/jpeg");
        //console.log(data);
        setImageDataURL(data);
    }


    function checkInput() {
        if (myProfile != null){
            if (myProfile.name.length < 6 || myProfile.name.length > 20 || myProfile.description.length < 6 || myProfile.description.length > 100) {
                return false;
            }
        }
        return true;
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
                overflowY:"scroll"
            }}>
                <h4 className="fw-light">Personal data</h4>
                <div style={{
                    display:"flex",
                    flexDirection:"column",
                    alignItems:"center",
                }}>
                    <div style={{display:'flex',flexDirection: 'row' , alignItems: "center"}}>
                        <label className="form-label" style={{fontSize:"1.3vw"}}>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            style={{width:"20vw",height:"4vh",marginLeft:"1vw"}}
                            placeholder="Enter Name"
                            name="name"
                            value={isLoading === 1 ? myProfile.name : ""}
                            onChange={handleChangeData}
                        />
                    </div>
                    {isLoading == 1 && (myProfile.name.length < 6 || myProfile.name.length > 20) ? <pre className="text-danger" style={{fontSize:"1vw"}}>Name must have length between 6 and 20 characters!</pre> : <></>}
                    <div style={{display:'flex',flexDirection: 'row' , alignItems: "start"}}>
                        <label className="form-label" style={{fontSize:"1.3vw"}}>Description</label>
                        <input
                            type="text"
                            className="form-control"
                            style={{width:"20vw",height:"4vh",marginLeft:"1vw"}}
                            placeholder="Enter Description"
                            name="description"
                            value={isLoading === 1 ? myProfile.description : ""}
                            onChange={handleChangeData}
                        />
                    </div>
                    {isLoading == 1 && (myProfile.description.length < 6 || myProfile.description.length > 100) ? <pre className="text-danger" style={{fontSize:"1vw"}}>Description must have length between 6 and 100 characters!</pre> : <></>}
                    <button className="btn btn-outline-secondary" onClick={() => history.push("/change_password")}>Change Password</button>
                    <img className="rounded img-thumbnail mx-auto d-block" style={{visibility: isLoading === 0 ? "hidden" : "visible", height:"7vw", width:"7vw"}} ref={imgCanvas} src = {uploadedImage != "" ? uploadedImage : defaultImg} onLoad={loadCanvas}></img>
                    <canvas style={{display:'none'}} ref={canvasRef}/>
                    <div style={{display:"flex", alignItems:"center",flexDirection:"column",justifyContent:"center"}}>
                        <input style={{marginInlineStart:"9vw"}} type="file" name="file" onChange={uploadImage} />
                    </div>
                </div>
                <h4 className="fw-light">Privacy</h4>
                <div style={{display:"flex"}}>
                    <pre>Fractals </pre>
                    <input type="checkbox" id="checkbox1" checked={isLoading == 1 ? privacyOptions.fractals : false} onChange={() => handleChangePrivacy("fractals")}></input>
                </div>
                <div style={{display:"flex"}}>
                    <pre>Followers </pre>
                    <input type="checkbox" id="checkbox1" checked={isLoading == 1 ? privacyOptions.followers : false} onChange={() => handleChangePrivacy("followers")}></input>
                </div>
                <div style={{display:"flex"}}>
                    <pre>Following </pre>
                    <input type="checkbox" id="checkbox1" checked={isLoading == 1 ? privacyOptions.following : false} onChange={() => handleChangePrivacy("following")}></input>
                </div>
                <div style={{display:"flex"}}>
                    <pre>Liked postings </pre>
                    <input type="checkbox" id="checkbox1" checked={isLoading == 1 ? privacyOptions.likes : false} onChange={() => handleChangePrivacy("likes")}></input>
                </div>
                <div style={{display:"flex"}}>
                    <pre>Disliked postings </pre>
                    <input type="checkbox" id="checkbox1" checked={isLoading == 1 ? privacyOptions.dislikes : false} onChange={() => handleChangePrivacy("dislikes")}></input>
                </div>
                <button
                    className="btn btn-outline-success"
                    onClick={checkInput() ? saveChanges : null}
                >
                    SaveChanges
                </button>
                <button
                    className="btn btn-outline-danger"
                    onClick={handleClickLogOut}
                    >
                    LogOut
                </button>
            </div>
        </div>
    );
}