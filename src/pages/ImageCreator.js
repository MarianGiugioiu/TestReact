import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import { useHistory, useParams } from 'react-router';
import AuthenticationContext from "../AuthenticationContext";

import MyList from '../components/MyList';
import ImageDetails from "../components/ImageDetails";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { ChromePicker } from 'react-color';

import '../App.css';

export default function ImageCreator(props){
    const history = useHistory();
    const authentication = useContext(AuthenticationContext);
    let profileId = authentication.getUser();
    const params = useParams();
    const canvasDimX = 1500;
    const canvasDimY = 1500;
    const imageDimX = 300;
    const imageDimY = 300;

    const [imageProfileId, setImageProfileId] = useState(-1);
    const [started, setStarted] = useState(0);
    const [imagePartsState,setImagePartsState] = useState(null);
    const [allImagesState,setAllImagesState] = useState(null);
    const [nameState, setNameState] = useState("");
    const [descriptionState, setDescriptionState] = useState("");

    const canvasRef = useRef(null);
    const canvasRef1 = useRef(null);
    const imgCanvas = useRef(null);
    const downloadRef = useRef(null);
    const imagePartsRefs = {};
    const allImagesRefs = {};

    const [idState, setIdState] = useState(-1);
    const [scaleXState, setScaleXState] = useState(1);
    const [scaleYState, setScaleYState] = useState(1);
    const [rotationState, setRotationState] = useState(0);
    const [posXState, setPosXState] = useState(canvasDimX / 2);
    const [posYState, setPosYState] = useState(canvasDimY / 2);
    const [canvasDataUrl, setCanvasDataUrl] = useState(null)
    const [backgroungColorState, setBackgroungColorState] = useState({r: 0, g: 0, b: 0, a: 1});
    const [isPngState, setIsPngState] = useState(false);

    const [imagePropertiesListState, setImagePropertiesListState] = useState([]);
    const [imgCanvasState,setImgCanvasState] = useState(null);

    const [readyState, setReadyState] = useState(0);
    const [imagePartsHiddenState, setImagePartsHiddenState] = useState("none");
    const [allImagesHiddenState, setAllImagesHiddenState] = useState("none");
    const [btnAfterPartsHiddenState, setBtnAfterPartsHiddenState] = useState("none");
    const [btnAfterAllHiddenState, setBtnAfterAllHiddenState] = useState("none");
    const [loadingImagePartsState, setLoadingImagePartsState] = useState(0);
    const [loadingAllImagesState, setLoadingAllImagesState] = useState(0);
    const [partIdListState, setPartIdListState] = useState([]);
    const [btnMakePostingHiddenState, setBtnMakePostingHiddenState] = useState("none");
    const [newOrOldImageState, setNewOrOldImageState] = useState(0);

    const [partsMissingState, setPartsMissingState] = useState(0);

    const [loadingGetState,setLoadingGetState] = useState(2);
    const [loadingGetAllState,setLoadingGetAllState] = useState(2);
    const [loadingPostState,setLoadingPostState] = useState(0);
    const [loadingSavePostingState,setLoadingSavePostingState] = useState(0);


    const [savedIdState, setSavedIdState] = useState(0);

    //POSTING
    function createPosting(){
        //console.log(savedIdState);
        setLoadingSavePostingState(1);
        var currentdate = new Date(); 
        var datetime = currentdate.getFullYear() + "-"
            + (currentdate.getMonth() < 9 ? "0"+ (currentdate.getMonth() + 1) : (currentdate.getMonth() + 1))  + "-" 
            + (currentdate.getDate() < 10 ? "0"+ currentdate.getDate() : currentdate.getDate()) + " "  
            + (currentdate.getHours() < 10 ? "0"+ currentdate.getHours() : currentdate.getHours()) + ":"  
            + (currentdate.getMinutes() < 10 ? "0"+ currentdate.getMinutes() : currentdate.getMinutes()) + ":" 
            + (currentdate.getSeconds() < 10 ? "0"+ currentdate.getSeconds() : currentdate.getSeconds())
        var posting = {
            "id": 0,
            "posterDate": datetime,
            "profile": {
                "id": profileId
            },
            "fractal": {
                "id": savedIdState
            },
            "likedBy": [],
            "dislikedBy": [],
            "seenBy":[]
        }
        //console.log(posting);

        var URL = "/posting"
            httpService
                .post(URL, posting)
                .then((response) => {
                    console.log(response.data);
                    setLoadingSavePostingState(0);
                })
                .catch((e) => {
                    setLoadingSavePostingState(0)
                    console.log(e);
                  });
    }


    //SAVING PROCESS
    function prepareImage(){
        if (idState != -1){
            const list = [...imagePropertiesListState];
            var idImage = list[idState].id;
            list[idState] = {
                "posX": posXState,
                "posY": posYState,
                "rotation": rotationState,
                "scaleX":scaleXState,
                "scaleY":scaleYState,
                "id": idImage
            }
            setImagePropertiesListState(list);
        }
        setReadyState(1);
    }

    useEffect(()=>{
        if(readyState == 1){
            drawImages();
        }
        else if(readyState == 2)
            saveImage();
    },[readyState])

    function saveImage() {
        setLoadingPostState(1);
        //if(readyState != 0){
        var options = {
            "background":backgroungColorState,
            "imagePropertiesList": imagePropertiesListState
        }
        //console.log(JSON.stringify(options));

        var currentdate = new Date(); 
        var datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth() < 9 ? "0"+ (currentdate.getMonth() + 1) : (currentdate.getMonth() + 1))  + "-" 
                + (currentdate.getDate() < 10 ? "0"+ currentdate.getDate() : currentdate.getDate()) + " "  
                + (currentdate.getHours() < 10 ? "0"+ currentdate.getHours() : currentdate.getHours()) + ":"  
                + (currentdate.getMinutes() < 10 ? "0"+ currentdate.getMinutes() : currentdate.getMinutes()) + ":" 
                + (currentdate.getSeconds() < 10 ? "0"+ currentdate.getSeconds() : currentdate.getSeconds())
        //console.log(datetime);

        //add background
        const canvas = canvasRef.current;
        const canvas1 = canvasRef1.current;
        const context1 = canvas1.getContext('2d');
        canvas1.width = canvasDimX;
        canvas1.height = canvasDimY;
        var sourceImageData = canvas.toDataURL("image/png", 0.5);
        if (!isPngState) {
            context1.save();
            context1.fillStyle = 'rgb(' + backgroungColorState.r + ',' + backgroungColorState.g + ',' + backgroungColorState.b + ',' + backgroungColorState.a + ')';
            context1.fillRect(0, 0, canvas1.width, canvas1.height);
            context1.drawImage(canvas,0,0,canvasDimX,canvasDimY);
            /*var destinationImage = new Image;
            destinationImage.onload = function(){
                context1.drawImage(destinationImage,0,0);
            };*/
            //destinationImage.src = sourceImageData;
            var sourceImageData = canvas1.toDataURL("image/jpeg", 0.5);
            context1.restore();
        }

        var image = {
            "id": newOrOldImageState,
            "type": "image",
            "name": nameState,
            "status": isPngState,
            "description": descriptionState,
            "options": JSON.stringify(options),
            "dataURL": sourceImageData,
            "lastModified": datetime,
            "profile": {
                "id": profileId
            }
        }

        let imageCopy = {
            "id":image.id,
            "name":image.name,
            "image":image.dataURL
        }

        allImagesState.push(imageCopy);
        var URL = "/fractal"
            httpService
                .post(URL, image)
                .then((response) => {
                    console.log(response.data);
                    setSavedIdState(response.data.id);
                    setImageProfileId(profileId);
                    setLoadingPostState(0);
                }).catch((e) => {
                    setLoadingPostState(0);
                    console.log(e);
                  });
        
        

        setReadyState(0);
        //}
    }

    //Loading Image
    function loadImage() {
        let myId = params.id;
        setSavedIdState(myId);
        let URL = "/fractal/" + myId;
        if(loadingGetState == 0) {
            setLoadingGetState(1);
        }
        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
                if (data.type == "image") {
                    setImageProfileId(data.profile.id);
                    setNameState(data.name);
                    setDescriptionState(data.description);
                    setIsPngState(data.status);
                    const options = JSON.parse(data.options);
                    const imagePropertiesList = options.imagePropertiesList;
                    const background = options.background;
                    if(background != null){
                        setBackgroungColorState(background)
                    }
                    
                    setImgCanvasState(data.dataURL);
                    setImagePropertiesListState(imagePropertiesList)
                    let ids = []
                    imagePropertiesList.forEach(elem => {
                        ids.push(elem.id);
                    });
                    ids.push(myId);
                    //setPartIdListState(ids);
                    let URLParts = "/fractal/" + data.id + "/parts";
                    httpService
                        .get(URLParts)
                        .then((response) => {
                            console.log(response.data);
                            setImagePartsState(response.data);
                            setLoadingImagePartsState(1);
                            setLoadingGetState(0);
                        })
                        .catch((e) => {
                            setLoadingGetState(0);
                            console.log(e);
                            let response = e.response;
                            console.log(response.status);
                            if (response.status == 406) {
                                setPartsMissingState(1);
                            }
                          })
                } else {
                    setLoadingGetState(0);
                } 
                    
            })
            .catch((e) => {
                setLoadingGetState(0);
                console.log(e);
              })
        setNewOrOldImageState(myId); 
    }

    useEffect(() => {
        if(loadingImagePartsState == 1){
            setBtnAfterPartsHiddenState("flex");
            drawImages();
            //onLoad();
        }
    }, [loadingImagePartsState])

    function reloadImage(){
        setIdState(-1);
        setLoadingImagePartsState(0);
        setBtnAfterPartsHiddenState("none");
        setImagePartsHiddenState("none");
        setAllImagesHiddenState("none");
        loadImage();
    }

    //New Image
    function newImage() {
        //console.log()
        if(imagePartsState != null) {
            setImagePartsState(null);
            setPartIdListState([]);
            setIdState(-1);
        }
        setBtnAfterPartsHiddenState("flex");
        setImagePartsHiddenState("flex");
        if(allImagesState == null){
            loadAllImages();
        }
        setNewOrOldImageState(0);
    }

    //Load all Images
    function loadAllImages () {
        var URL = "/profile/" + profileId + "/fractals";
        if(allImagesState == null){

        
            if(loadingGetAllState == 0) {
                setLoadingGetAllState(1);
            }
            
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    console.log(data);
                    setAllImagesState(data);
                    setLoadingGetAllState(0);
                })
                .catch((e) => {
                    setLoadingGetAllState(0);
                    console.log(e);
                });
        }
    }

    useEffect(() => {
        if(allImagesState != null){
            setLoadingAllImagesState(1);
            setBtnAfterAllHiddenState("flex");
        }
    },[allImagesState])

    //Starting
    useEffect(()=>{
        //console.log(loadingGetState,loadingGetAllState)
        if(started == 0){
            if(params.action === "old"){
                setLoadingGetAllState(0);
                loadImage();
            } else if(params.action === "new"){
                setLoadingGetState(0);
                newImage();
            }
        }
        setStarted(1)
    },[started])

    //Put image in canvas when started
    function onLoad() {
        const canvas1 = canvasRef1.current;
        const context1 = canvas1.getContext('2d');
        canvas1.width = canvasDimX;
        canvas1.height = canvasDimY;
        const image = imgCanvas.current;


        //console.log(image)
        context1.drawImage(image,0,0);
        setCanvasDataUrl(canvas1.toDataURL("image/png"));
    }

    //Download
    function downloadClick(){
        const link = downloadRef.current;
        link.click();
    }

    //Choose Image to add to Parts
    function chooseImage(object) {
        console.log("asd");
        setAllImagesHiddenState("none");
        let id = object.id;
        let property = {
            id:id,
            posX:canvasDimX/2,
            posY:canvasDimY/2,
            rotation:0,
            scaleX:1,
            scaleY:1
        }
        let parts = [];
        if(imagePartsState != null) {
            parts = [...imagePartsState]
        }
        let properties = [...imagePropertiesListState];
        let ids = [...partIdListState];

        parts.push(object);
        properties.push(property);
        ids.push(id);

        setImagePartsState(parts);
        setImagePropertiesListState(properties);
    }

    //Delete Part
    function deletePart(i){
        //console.log("asd");
        let myId = imagePartsState[i].id;
        let parts = [...imagePartsState];
        let properties = [...imagePropertiesListState];
        let ids = [...partIdListState];
        let currentId = ids[idState];

        parts.splice(i,1);
        properties.splice(i,1);
        ids.splice(ids.indexOf(myId),1);
        /*parts[i] = null;
        properties[i] = null;
        ids[i] = null;*/
        if(i == idState){
            setIdState(-1);
        } else {
            setIdState(ids.indexOf(currentId))
        }
        

        setImagePartsState(parts);
        setImagePropertiesListState(properties);
        setPartIdListState(ids);
    }

    //Select Part for options
    function changeImage (event,i) {
        const id = i;
        if (idState != -1){
            const list = [...imagePropertiesListState];
            var idImage = list[idState].id;
            if(idState != id) {
                list[idState] = {
                    "posX": posXState,
                    "posY": posYState,
                    "rotation": rotationState,
                    "scaleX":scaleXState,
                    "scaleY":scaleYState,
                    "id": idImage
                }
                setImagePropertiesListState(list);
            }
            
        }
        setIdState(id);

        //console.log(id);

        setPosXState(imagePropertiesListState[id].posX);
        setPosYState(imagePropertiesListState[id].posY);
        setRotationState(imagePropertiesListState[id].rotation);
        //setScaleState(imagePropertiesListState[id].scale)
        setScaleXState(imagePropertiesListState[id].scaleX)
        setScaleYState(imagePropertiesListState[id].scaleY)
    }

    function prepareDownload() {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const canvas1 = canvasRef1.current;
        const context1 = canvas1.getContext('2d');
        canvas1.width = canvasDimX;
        canvas1.height = canvasDimY;
        var sourceImageData = canvas.toDataURL("image/png", 0.5);
        if (!isPngState) {
            context1.save();
            context1.fillStyle = 'rgb(' + backgroungColorState.r + ',' + backgroungColorState.g + ',' + backgroungColorState.b + ',' + backgroungColorState.a + ')';
            context1.fillRect(0, 0, canvas1.width, canvas1.height);
            context1.drawImage(canvas,0,0,canvasDimX,canvasDimY);
            var sourceImageData = canvas1.toDataURL("image/jpeg", 0.5);
            context1.restore();
        }
        setCanvasDataUrl(sourceImageData);
    }

    //Draw current state in canvas
    function drawImages(){
        const id = idState;
        //console.log(imagePartsRefs);
        const nrImages = Object.keys(imagePartsRefs).length;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = canvasDimX;
        canvas.height = canvasDimY;
        context.clearRect(0,0,canvasDimX,canvasDimY)
        for (let i = 0; i < nrImages; i++){
            //console.log(imagePropertiesListState[i])
            //console.log(imagePartsRefs[`img${i}`]);
            const imageCurrent = imagePartsRefs[`img${i}`];
            //console.log(id);
            if(imagePropertiesListState[i] != null && imageCurrent != null && i != id){
                //console.log(imageCurrent)
                context.save();
                context.translate(imagePropertiesListState[i].posX, imagePropertiesListState[i].posY);
                context.rotate(imagePropertiesListState[i].rotation*Math.PI/180);

                context.drawImage(imageCurrent, -imageDimX * imagePropertiesListState[i].scaleX / 2,
                    -imageDimY * imagePropertiesListState[i].scaleY / 2,
                    imageDimX * imagePropertiesListState[i].scaleX,
                    imageDimY * imagePropertiesListState[i].scaleY);
                //context.drawImage(imageCurrent,imageDimX * i , imageDimY * i, imageDimX, imageDimY);
                context.restore();
            }
        }


        if(id != -1){
            const image = imagePartsRefs[`img${id}`];
        
            //context.moveTo(0,0);
            context.translate(posXState, posYState);
            context.rotate(rotationState*Math.PI/180);
            context.drawImage(image, -imageDimX * scaleXState / 2, -imageDimY * scaleYState / 2, imageDimX * scaleXState, imageDimY * scaleYState);

            prepareDownload()

            if(readyState == 0){
                context.beginPath();
                context.save();
                context.strokeStyle = 'blue';
                context.lineWidth = 5;
                context.fillStyle = 'red';
                context.rect(-imageDimX * scaleXState / 2, -imageDimY * scaleYState / 2, imageDimX * scaleXState, imageDimY * scaleYState);
                context.stroke();
            }
        } else {
            prepareDownload()
        }
        //context.restore();
        if (readyState == 1){
            setReadyState(2);
        }
    }

    //Move selected image in canvas
    function handleClick(event){
        if(loadingAllImagesState == 1){
            const canvas = canvasRef.current;
            var offset = canvas.getBoundingClientRect();
            var offsetX = offset.left;
            var offsetY = offset.top;
            var width = offset.width;
            var height = offset.height;
            //console.log(offset);
            //console.log(width,height)
            //console.log(event.clientX,event.clientY)
            var posX = (event.clientX - offsetX) * 1500 / width;
            var posY = (event.clientY - offsetY) * 1500 / height;
            setPosXState(posX);
            setPosYState(posY);
        }
    }

    //Update canvas 
    useEffect(() => {
        //console.log("asd");
        drawImages();
        
    }, [loadingGetState,imagePropertiesListState,backgroungColorState,idState,rotationState,scaleXState,scaleYState,posXState,posYState,isPngState])

    useEffect(() => {
        console.log(loadingGetState)
    },[loadingGetState])

    function checkInput() {
        if (nameState.length < 6 || nameState.length > 20 || descriptionState.length < 6 || descriptionState.length > 100) {
            return false;
        }
        return true;
    }

    return (
        <div>
            <Loader
                style={{display: (loadingGetState == 2 && (loadingGetAllState == 2 || params.action=="old")) ? "flex" : "none"}}
                type="TailSpin"
                color="#FFF"
                height={100}
                width={100} 
            />
            <div
            style={{
                display: !(loadingGetState == 2 && (loadingGetAllState == 2 || params.action=="old")) ? "flex" : "none",
                flexDirection: 'column',
                background:"rgba(255, 255, 255, 0.75)",
                padding: "1vh",
                border: "1.5px dotted gray",
                borderRadius: "15px",
                height: "92vh",
                width:"80vw",
                overflow: "hidden"
            }}
            >
                <div 
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height:"75%",
                        width: "75vw"
                    }}
                >
                    <div 
                        style={{
                            display:"flex",
                            flexDirection: "column",
                            height:"100%",
                            width:"15vw",
                            overflow:"hidden"
                        }}
                    >
                        <div style={{
                            display:"flex",
                            flexDirection: "column",
                            height:"15%",
                            width:"15vw",
                            overflow:"hidden"
                        }}>
                            {<button className="btn btn-outline-dark" style = {{display:btnAfterPartsHiddenState, height:"5vh"}} onClick={()=> imagePartsHiddenState == "none" ? setImagePartsHiddenState("flex") : setImagePartsHiddenState("none")}><span style={{fontSize:"1.1vw"}}>Show Components</span></button>}
                            {<button 
                                className="btn btn-outline-dark"
                                style = {{display:((btnAfterAllHiddenState ==="flex" && imagePartsHiddenState === "flex") ? "flex" : "none"), height:"5vh"}}
                                onClick={() => allImagesHiddenState === "flex" ? setAllImagesHiddenState("none") : setAllImagesHiddenState("flex")}
                            ><span style={{fontSize:"1.1vw"}}>{allImagesHiddenState === "flex" ? "Hide Images" : "Add Image"}</span>
                            </button>}
                        </div>
                        <div style = {{
                            display:imagePartsHiddenState,
                            flexDirection: "column",
                            height:"80%",
                            width:"15vw",
                            overflow:"hidden"
                        }}>
                            <p style={{fontSize:"1.5vw"}}>Image's Components:</p>

                            <MyList isProfile={false} isColumn={true} name="Parts" data={imagePartsState} deletePart={deletePart} refs={imagePartsRefs} allVisibility={btnAfterAllHiddenState} visibility={imagePartsHiddenState} chooseFunction={changeImage}/>
                            
                            
                        </div>
                    </div>

                    {/*Canvas and options*/}
                    <div
                        style={{
                            display:"flex",
                            flexDirection: "column",
                            alignItems : "center",
                            height:"100%",
                            width:"30vw"
                        }}
                    >
                        <div className="myColumn21">
                            <canvas 
                                ref={canvasRef} 
                                style={{background:'rgb(' + backgroungColorState.r + ',' + backgroungColorState.g + ',' + backgroungColorState.b + ',' + backgroungColorState.a + ')'}} 
                                onClick={handleClick} 
                            />
                        </div>

                        <div
                            style={{
                                display:"flex",
                                flexDirection:"column",
                                width: "80%"
                            }}
                        >
                            <div className="slidecontainer" style = {{display:(loadingAllImagesState == 1 ? "flex" : "none")}}>
                                <label style={{fontSize:"1.2vw"}}>Rotation: {rotationState}</label>
                                <input style={{width:"50%"}} onInput={(event) => setRotationState(event.target.value)} value={rotationState} defaultValue="0" type="range" step="1" min="-180" max="180" className="slider" id="myRange4" />  
                            </div>
                            <div className="slidecontainer" style = {{display:(loadingAllImagesState == 1 ? "flex" : "none")}}>
                                <label style={{fontSize:"1.2vw"}}>HorizontalScale: {scaleXState}</label>
                                <input style={{width:"50%"}} onInput={(event) => setScaleXState(event.target.value)} value={scaleXState} defaultValue="1" type="range" step="0.1" min="0.1" max="5" className="slider" id="myRange4" />  
                            </div>
                            <div className="slidecontainer" style = {{display:(loadingAllImagesState == 1 ? "flex" : "none")}}>
                                <label style={{fontSize:"1.2vw"}}>VerticalScale: {scaleYState}</label>
                                <input style={{width:"50%"}} onInput={(event) => setScaleYState(event.target.value)} value={scaleYState} defaultValue="1" type="range" step="0.1" min="0.1" max="5" className="slider" id="myRange4" />  
                            </div>
                        </div>
                    </div>
                        
                    {/*Saving, Editing, Details*/}
                    <div 
                        style={{
                            display:"flex",
                            flexDirection: "column",
                            height:"100%",
                            width:"25vw"
                        }}
                    >
                        <h3 className="fw-light">Image Creator</h3>
                        <ImageDetails
                            backgroungColorState={backgroungColorState} 
                            setBackgroungColorState={setBackgroungColorState}
                            condition={loadingAllImagesState == 0}
                            canvasRef1={canvasRef1}
                            nameState={nameState}
                            setNameState={setNameState}
                            descriptionState={descriptionState}
                            setDescriptionState={setDescriptionState}
                            isPngState={isPngState}
                            setIsPngState={setIsPngState}
                        />
                        <div
                            style={{
                                display:"flex",
                            }}
                        >
                            <div style={{
                                display:"flex",
                                flexDirection:"column",
                                alignItems: "center"
                            }}>
                                <div className="myRowSimple">
                                    {<button className="btn btn-outline-success" style = {{display:(params.action === "old" && partsMissingState == 0 ? "flex" : "none"),marginTop:"1vh"}} onClick={reloadImage}><span style={{fontSize:"1.1vw"}}>Reload Image</span></button>}
                                    <Loader
                                        style={{display: loadingGetState != 0 ? "flex" : "none"}}
                                        type="TailSpin"
                                        color="#000000"
                                        height={25}
                                        width={25} 
                                    />
                                </div>
                                <div className="myRowSimple">
                                    {<button className="btn btn-outline-success" style = {{display:((btnAfterPartsHiddenState === "flex" && (imageProfileId == profileId || imageProfileId == -1 )) ? "flex" : "none"),marginTop:"1vh"}} onClick={checkInput() ? prepareImage : null}><span style={{fontSize:"1.1vw"}}>Save Image</span></button>}
                                    <Loader
                                        style={{display: loadingPostState != 0 ? "flex" : "none"}}
                                        type="TailSpin"
                                        color="#000000"
                                        height={25}
                                        width={25} 
                                    />
                                </div>
                                <button style={{display:partsMissingState == 0 ? "flex" : "none" ,marginTop:"1vh"}} className="btn btn-outline-primary" onClick={downloadClick}><span style={{fontSize:"1.1vw"}}>Download</span></button>
                                {<a ref={downloadRef} href = {canvasDataUrl} download = {nameState + '.' + (isPngState ? "png" : "jpeg")} style={{display:"none"}}>Download Image </a>}
                            </div>

                            <div style={{
                                display:"flex",
                                flexDirection:"column",
                                alignItems: "center"
                            }}>
                                <div className="myRowSimple">
                                    {<button className="btn btn-outline-info" style = {{display:((btnAfterPartsHiddenState === "flex" && params.action === "old" && imageProfileId == profileId) ? "flex" : "none"),marginTop:"1vh"}}  onClick={loadAllImages}><span style={{fontSize:"1.1vw"}}>Edit Image</span></button>}
                                    <Loader
                                        style={{display: loadingGetAllState != 0 ? "flex" : "none"}}
                                        type="TailSpin"
                                        color="#000000"
                                        height={25}
                                        width={25} 
                                    />
                                </div>

                                {<button className="btn btn-outline-danger" style = {{display:(params.action === "new" ? "flex" : "none"),marginTop:"1vh"}} onClick={newImage}><span style={{fontSize:"1.1vw"}}>New Image</span></button>}

                                <div className="myRowSimple">
                                    {<button className="btn btn-outline-secondary" style = {{display:(imageProfileId == profileId && loadingGetState == 0 && loadingGetAllState == 0 && loadingPostState == 0 && partsMissingState == 0? "flex" : "none"),marginTop:"1vh"}} onClick={createPosting}><span style={{fontSize:"1.1vw"}}>Create Posting</span></button>}
                                    <Loader
                                        style={{display: loadingSavePostingState != 0 ? "flex" : "none"}}
                                        type="TailSpin"
                                        color="#000000"
                                        height={25}
                                        width={25} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{
                            display: partsMissingState == 1 ? "flex" : "none",
                            flexDirection: "column"
                        }}>
                            <p className="text-danger" style={{fontSize:"1vw"}}>Parts of this image are missing. You can't see this image in the editor. You will have to delete it manually from your profile if you want.</p>
                        </div>
                    </div>
                </div>
                {<img ref={imgCanvas} src={imgCanvasState} width="100" height="100"  style={{display:"none"}}/>}
                <MyList style={{height:"15%"}} isProfile={false} name="Images" data={allImagesState} refs={allImagesRefs} visibility={allImagesHiddenState} chooseFunction={chooseImage}/>
            </div>
        </div>
    )
}