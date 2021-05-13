import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import { useHistory, useParams } from 'react-router';
import { ChromePicker } from 'react-color';
import AuthenticationContext from "../AuthenticationContext";
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

    const [started, setStarted] =useState(0);
    const [imagePartsState,setImagePartsState] = useState([]);
    const [allImagesState,setAllImagesState] = useState([]);
    const [nameState, setNameState] = useState("");
    const [descriptionState, setDescriptionState] = useState("");

    const canvasRef = useRef(null);
    const canvasRef1 = useRef(null);
    const imgCanvas = useRef(null);
    const downloadRef = useRef(null);
    const imagePartsRefs = {};
    const allImagesRefs = {};

    const [idState, setIdState] = useState(-1);
    const [scaleState, setScaleState] = useState(1);
    const [rotationState, setRotationState] = useState(0);
    const [posXState, setPosXState] = useState(canvasDimX / 2);
    const [posYState, setPosYState] = useState(canvasDimY / 2);
    const [canvasDataUrl, setCanvasDataUrl] = useState(null)
    const [backgroungColorState, setBackgroungColorState] = useState({r: 0, g: 0, b: 0, a: 1});
    const [isPngState, setIsPngState] = useState(false);

    const [imagePropertiesListState, setImagePropertiesListState] = useState([]);
    const [imgCanvasState,setImgCanvasState] = useState(null);

    const [readyState, setReadyState] = useState(0);
    const [imagePartsHiddenState, setImagePartsHiddenState] = useState("hidden");
    const [allImagesHiddenState, setAllImagesHiddenState] = useState("hidden");
    const [btnAfterPartsHiddenState, setBtnAfterPartsHiddenState] = useState("hidden");
    const [btnAfterAllHiddenState, setBtnAfterAllHiddenState] = useState("hidden");
    const [loadingImagePartsState, setLoadingImagePartsState] = useState(0);
    const [loadingAllImagesState, setLoadingAllImagesState] = useState(0);
    const [partIdListState, setPartIdListState] = useState([]);
    const [btnMakePostingHiddenState, setBtnMakePostingHiddenState] = useState("hidden");
    const [newOrOldImageState, setNewOrOldImageState] = useState(0);

    const [uploadedImage, setUploadedImage] = useState();

    const [savedIdState, setSavedIdState] = useState(0);

    function prepareImage(){
        if (idState != -1){
            const list = [...imagePropertiesListState];
            var idImage = list[idState].id;
            list[idState] = {
                "posX": posXState,
                "posY": posYState,
                "rotation": rotationState,
                "scale": scaleState,
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

    function createPosting(){
        console.log(savedIdState);
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
        console.log(posting);

        var URL = "/posting"
            httpService
                .post(URL, posting)
                .then((response) => {
                    console.log(response.data);
                    
                });
    }

    function saveImage() {
        //if(readyState != 0){
            var options = {
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
                    });
            /*console.log(newOrOldImageState)
            if(newOrOldImageState == 0){
                var URL = "/fractal"
                httpService
                    .post(URL, image)
                    .then((response) => {
                    console.log(response.data);
                    });
            } else {
                var URL = "/fractal/" + newOrOldImageState;
                httpService
                    .put(URL, image)
                    .then((response) => {
                    console.log(response.data);
                    });
            }*/
            

            setReadyState(0);
        //}
    }

    function reloadImage(){
        setIdState(-1);
        setLoadingImagePartsState(0);
        setBtnAfterPartsHiddenState("hidden");
        setImagePartsHiddenState("hidden");
        setAllImagesHiddenState("hidden");
        loadImage();
    }

    useEffect(()=>{
        if(started == 0){
            /*if(props.location.state.action === "old"){
                loadImage();
            } else if(props.location.state.action === "new"){
                newImage();
            }*/
            if(params.action === "old"){
                loadImage();
            } else if(params.action === "new"){
                newImage();
            }
        }
        setStarted(1)
    },[started])

    function loadImage() {
        let myId = params.id;
        setSavedIdState(myId);
        let URL = "/fractal/" + myId;
        httpService
            .get(URL)
            .then(async (response) => {
                var data = response.data;
                setNameState(data.name);
                setDescriptionState(data.description);
                setIsPngState(data.status);
                const imagePropertiesList = JSON.parse(data.options).imagePropertiesList;
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
                    })
                
            })
        setNewOrOldImageState(myId); 
    }

    useEffect(() => {
        if(loadingImagePartsState == 1){
            setBtnAfterPartsHiddenState("visible");
            onLoad();
        }
    }, [loadingImagePartsState])

    function addImage() {
        setAllImagesHiddenState("visible");
    }

    function chooseImage(object) {
        console.log("asd");
        setAllImagesHiddenState("hidden");
        let id = object.id;
        let property = {
            id:id,
            posX:canvasDimX/2,
            posY:canvasDimY/2,
            rotation:0,
            scale:1
        }

        let parts = [...imagePartsState];
        let properties = [...imagePropertiesListState];
        let ids = [...partIdListState];

        parts.push(object);
        properties.push(property);
        ids.push(id);

        setImagePartsState(parts);
        setImagePropertiesListState(properties);
        //setPartIdListState(ids);
    }

    function newImage() {
        //console.log()
        if(imagePartsState.length != 0) {
            setImagePartsState([]);
            setPartIdListState([]);
            setIdState(-1);
        }
        setBtnAfterPartsHiddenState("visible");
        setImagePartsHiddenState("visible");
        if(allImagesState.length == 0){
            loadAllImages();
        }
        setNewOrOldImageState(0);
    }


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

    function loadAllImages () {
        var URL = "/profile/" + profileId + "/fractals";
        
        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
                console.log(data);
                setAllImagesState(data);
        })

    }

    useEffect(() => {
        if(allImagesState.length != 0){
            setLoadingAllImagesState(1);
        }
    },[allImagesState])

    useEffect(() => {
        if (allImagesState.length > 0) {
            setBtnAfterAllHiddenState("visible");
        }
    },[allImagesState])

    function onLoad() {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const image = imgCanvas.current;

        //console.log(image)
        context.drawImage(image,0,0);
        setCanvasDataUrl(canvas.toDataURL("image/png"));
    }



    function drawImages(){
        const id = idState;
        //console.log(imagePartsRefs);
        const nrImages = Object.keys(imagePartsRefs).length;
        //console.log(nrImages)
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = canvasDimX;
        canvas.height = canvasDimY;
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

                context.drawImage(imageCurrent, -imageDimX * imagePropertiesListState[i].scale / 2,
                    -imageDimY * imagePropertiesListState[i].scale / 2,
                    imageDimX * imagePropertiesListState[i].scale,
                    imageDimY * imagePropertiesListState[i].scale);
                //context.drawImage(imageCurrent,imageDimX * i , imageDimY * i, imageDimX, imageDimY);
                context.restore();
            }
        }

        if(id != -1){
            const image = imagePartsRefs[`img${id}`];
        
        //context.moveTo(0,0);
        context.translate(posXState, posYState);
        context.rotate(rotationState*Math.PI/180);
        context.drawImage(image, -imageDimX * scaleState / 2, -imageDimY * scaleState / 2, imageDimX * scaleState, imageDimY * scaleState);
        setCanvasDataUrl(canvas.toDataURL("image/png"));

        if(readyState == 0){
            context.beginPath();
            context.save();
            context.strokeStyle = 'blue';
            context.lineWidth = 5;
            context.fillStyle = 'red';
            context.rect(-imageDimX * scaleState / 2, -imageDimY * scaleState / 2, imageDimX * scaleState, imageDimY * scaleState);
            context.stroke();
            }
        }
        //context.restore();
        if (readyState == 1){
            setReadyState(2);
        }
    }

    function changeImage (event) {
        const image = event.target;
        const id = image.id;
        if (idState != -1){
            const list = [...imagePropertiesListState];
            var idImage = list[idState].id;
            if(idState != id) {
                list[idState] = {
                    "posX": posXState,
                    "posY": posYState,
                    "rotation": rotationState,
                    "scale": scaleState,
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
        setScaleState(imagePropertiesListState[id].scale)
    }

    function changeRotation(event){
        let val = event.target.value;
        setRotationState(val)
    }

    function handleClick(event){
        const canvas = canvasRef.current;
        var offset = canvas.getBoundingClientRect();
        var offsetX = offset.left;
        var offsetY = offset.top;
        var width = offset.height;
        var height = offset.bottom;
        //console.log(offset);
        //console.log(width,height)
        //console.log(event.clientX,event.clientY)
        var posX = (event.clientX - offsetX) * 1500 / width;
        var posY = (event.clientY - offsetY) * 1500 / height;
        setPosXState(posX);
        setPosYState(posY);
    }

    function changeScale(event) {
        let val = event.target.value;
        setScaleState(val);
    }

    useEffect(() => {
        //console.log("asd");
        drawImages();
        //console.log(posXState,posYState,rotationState,scaleState)
        //console.log(imagePropertiesListState);
        
    }, [idState,rotationState,scaleState,posXState,posYState])
    

    useEffect(() => {
        
        //console.log(partIdListState)
    }, [partIdListState])

    function uploadImage(event){
        let file = event.target.files[0];
        console.log(file);
        setUploadedImage(URL.createObjectURL(file));
    }

    useEffect(() => {
        //console.log(imagePropertiesListState.length)
        drawImages();
    }, [imagePropertiesListState])

    function downloadClick(){
        const link = downloadRef.current;
        link.click();
    }

    return (
        <div className="mainDiv1">
            <div className="myRow1">
                <div className="myColumn1" style = {{visibility:imagePartsHiddenState}}>
                    <p>Image's Components:</p>
                    {
                        //console.log(imagePartsState)
                        imagePartsState.map(function(object, i){
                            if(object != null){
                                return (   
                                    <div className="myRowSimple"> 
                                        <img
                                            id={i}
                                            ref = {(ref) => imagePartsRefs[`img${i}`] = ref}
                                            src = {object.image}
                                            width = "50%" height = "50%"
                                            onClick={changeImage}
                                            className={imagePartsHiddenState}
                                            >
                                        </img>
                                        <div className="myColumnSimple">
                                            <pre>{object.name}</pre>
                                            {<button style = {{visibility:((btnAfterAllHiddenState ==="visible" && imagePartsHiddenState === "visible") ? "visible" : "hidden")}} onClick={() => deletePart(i)}>Delete</button>}
                                        </div>
                                        
                                    </div>
                                );
                            }
                            
                        })
                    }
                    {<button style = {{visibility:((btnAfterAllHiddenState ==="visible" && imagePartsHiddenState === "visible") ? "visible" : "hidden")}}  onClick={addImage}>Add Image</button>}
                    <div style={{visibility:"hidden"}}>
                        <input type="file" name="file" onChange={uploadImage} />
                        <img src = {uploadedImage} width="100" height="100"></img>
		            </div>
                </div>
                <div className="myColumn2">
                    <div className="myColumnSimple">
                        <div className="myColumn21">
                            <canvas 
                                ref={canvasRef} 
                                style={{background:'rgb(' + backgroungColorState.r + ',' + backgroungColorState.g + ',' + backgroungColorState.b + ',' + backgroungColorState.a + ')'}} 
                                onClick={handleClick} 
                            />
                        </div>
                        <div className="myRowSimple">
                            <div>
                                <ChromePicker 
                                    color={backgroungColorState}
                                    onChange={(event) => setBackgroungColorState(event.rgb)}
                                />
                            </div>
                            <div className="myColumnSimple">
                                <div className="myRowSimple">
                                    <pre>Name:        </pre>
                                    {
                                        loadingAllImagesState == 0 ? 
                                        <pre>{nameState}</pre> : 
                                        <input
                                            type="text"
                                            value={nameState}
                                            onChange={(event) => {setNameState(event.target.value)}}
                                        />
                                    }
                                </div>
                                <div className="myRowSimple">
                                    <pre>Description: </pre>
                                    {
                                        loadingAllImagesState == 0 ? 
                                        <pre>{descriptionState}</pre> : 
                                        <input
                                            type="text"
                                            value={descriptionState}
                                            onChange={(event) => setDescriptionState(event.target.value)}
                                        />
                                    }
                                </div>
                                <div className="myRowSimple">
                                    <pre>PNG </pre>
                                    <input type="checkbox" id="checkbox1" checked={isPngState} onChange={() => setIsPngState(!isPngState)}></input>
                                </div>
                                <canvas 
                                    ref={canvasRef1}
                                    style={{display:"none"}}
                                    {...props}
                                />
                            </div>
                        </div>
                        
                        
                    </div>
                    
                    
                    <div className="myColumn22">
                        <div className="slidecontainer" style = {{visibility:(loadingAllImagesState == 1 ? "visible" : "hidden")}}>
                            <input onInput={changeRotation} defaultValue="0" type="range" step="1" min="-180" max="180" className="slider" id="myRange4" />  
                        </div>
                        <div className="slidecontainer" style = {{visibility:(loadingAllImagesState == 1 ? "visible" : "hidden")}}>
                            <input onInput={changeScale} defaultValue="1" type="range" step="0.1" min="0.1" max="5" className="slider" id="myRange4" />  
                        </div>
                        {<button style = {{visibility:(params.action === "new" ? "visible" : "hidden")}} onClick={newImage}>New Image</button>}
                        {<button style = {{visibility:(params.action === "old" ? "visible" : "hidden")}} onClick={reloadImage}>Reload Image</button>}
                        {<button style = {{visibility:btnAfterPartsHiddenState}} onClick={prepareImage} >Save Image</button>}
                        {<button style = {{visibility:btnAfterPartsHiddenState}} onClick={()=> imagePartsHiddenState == "hidden" ? setImagePartsHiddenState("visible") : setImagePartsHiddenState("hidden")}>Show Components</button>}
                        {<button style = {{visibility:((btnAfterPartsHiddenState === "visible" && params.action === "old") ? "visible" : "hidden")}}  onClick={loadAllImages} >Edit Image</button>}
                        {<button onClick={createPosting}>Create Posting</button>}
                        <button onClick={downloadClick}>Download</button>
                        {<a ref={downloadRef} href = {canvasDataUrl} download = {nameState + '.' + (isPngState ? "png" : "jpeg")}>Download Image </a>}
                        
                    </div>
                </div>
            </div>
            {<img ref={imgCanvas} src={imgCanvasState} width="100" height="100"  className="hidden"/>}
            <div className="myRow2" style = {{visibility:allImagesHiddenState}}>
            {
                    
                    allImagesState.map(function(object, i){
                        if(object!= null && !partIdListState.includes(object.id)) {
                            return (   
                                <div className="myColumnSimple"> 
                                    <img
                                        id={i}
                                        ref = {(ref) => allImagesRefs[`img${i}`] = ref}
                                        src = {object.image}
                                        width = "100vw" height = "100vw"
                                        onClick={() => chooseImage(object)}
                                        >
                                    </img>
                                    <pre>{object.name}</pre>
                                </div>
                            );
                        }
                    })
                }
            </div>
        </div>
    )
}