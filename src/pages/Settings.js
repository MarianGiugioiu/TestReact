import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";

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
        //console.log(file);
        setUploadedImage(URL.createObjectURL(file));
    }

    function loadCanvas(){
        let canvas = canvasRef.current
        let image = imgCanvas.current;
        let context = canvas.getContext("2d");
        canvas.width = canvasDim;
        canvas.height = canvasDim;
        context.drawImage(image,0,0,canvasDim,canvasDim);
        let data = canvas.toDataURL("image/jpeg");
        //console.log((new TextEncoder().encode(data)).length)
        //console.log(data);
        setImageDataURL(data);
    }

    /*useEffect(() => {
        if(uploadedImage != null) {
            loadCanvas();
        }
    },[uploadedImage])*/

    return(
        <div style = {{visibility:(isLoading == 0 ? "hidden" : "visible")}}>
            <h4>Personal data</h4>
            <div>
                <input
                    type="text"
                    placeholder="Enter Name"
                    name="name"
                    value={isLoading === 1 ? myProfile.name : ""}
                    onChange={handleChangeData}
                />
                <br></br>
                <input
                    type="text"
                    placeholder="Enter Description"
                    name="description"
                    value={isLoading === 1 ? myProfile.description : ""}
                    onChange={handleChangeData}
                />
                <br></br>
                <img ref={imgCanvas} src = {uploadedImage} width="100" height="100" onLoad={loadCanvas}></img>
                <canvas style={{display:'none'}} ref={canvasRef}/>
                <br></br>
                <input type="file" name="file" onChange={uploadImage} />

            </div>
            <br></br>
            <br></br>
            <h4>Privacy</h4>
            <div className="myRow2">
                <pre>Fractals </pre>
                <input type="checkbox" id="checkbox1" checked={isLoading == 1 ? privacyOptions.fractals : false} onChange={() => handleChangePrivacy("fractals")}></input>
            </div>
            <div className="myRow2">
                <pre>Followers </pre>
                <input type="checkbox" id="checkbox1" checked={isLoading == 1 ? privacyOptions.followers : false} onChange={() => handleChangePrivacy("followers")}></input>
            </div>
            <div className="myRow2">
                <pre>Following </pre>
                <input type="checkbox" id="checkbox1" checked={isLoading == 1 ? privacyOptions.following : false} onChange={() => handleChangePrivacy("following")}></input>
            </div>
            <div className="myRow2">
                <pre>Liked postings </pre>
                <input type="checkbox" id="checkbox1" checked={isLoading == 1 ? privacyOptions.likes : false} onChange={() => handleChangePrivacy("likes")}></input>
            </div>
            <div className="myRow2">
                <pre>Disliked postings </pre>
                <input type="checkbox" id="checkbox1" checked={isLoading == 1 ? privacyOptions.dislikes : false} onChange={() => handleChangePrivacy("dislikes")}></input>
            </div>
            <br></br>
            <br></br>
            <button
                onClick={saveChanges}
            >
                SaveChanges
            </button>
            <br></br>
            <br></br>
            <button
                onClick={handleClickLogOut}
                >
                LogOut
            </button>
        </div>
    );
}