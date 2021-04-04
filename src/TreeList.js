import React, { useRef, useEffect, useCallback, useState } from 'react'
import httpService from '../src/services/httpService';
import './App.css';

export default function TreeList(props){
    const canvasDimX = 1500;
    const canvasDimY = 1500;
    const imageDimX = 300;
    const imageDimY = 300;

    const [imagePartsState,setImagePartsState] = useState([]);
    const [allImagesState,setAllImagesState] = useState([]);

    const canvasRef = useRef(null);
    const imgCanvas = useRef(null);
    const imagePartsRefs = {};
    const allImagesRefs = {};

    const [idState, setIdState] = useState(-1);
    const [scaleState, setScaleState] = useState(1);
    const [rotationState, setRotationState] = useState(0);
    const [posXState, setPosXState] = useState(canvasDimX / 2);
    const [posYState, setPosYState] = useState(canvasDimY / 2);

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
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
            //console.log(datetime);
    
            const canvas = canvasRef.current;
            var sourceImageData = canvas.toDataURL("image/jpeg",0.7);
            //console.log(sourceImageData)
    
            var image = {
                "id": 0,
                "type": "image",
                "name": "first",
                "description": "description",
                "options": JSON.stringify(options),
                "dataURL": sourceImageData,
                "lastModified": datetime,
                "account": {
                    "id": 1
                }
            }
    
            var URL = "/fractal"
            httpService
                .post(URL, image)
                .then((response) => {
                  console.log(response.data);
                });

            setReadyState(0);
        //}
    }

    function loadImage() {
        //console.log("asd");
        let myId = 82
        let URL = "/fractal/" + myId;
        httpService
            .get(URL)
            .then(async (response) => {
                var data = response.data;
                const imagePropertiesList = JSON.parse(data.options).imagePropertiesList;
                setImgCanvasState(data.dataURL);
                setImagePropertiesListState(imagePropertiesList)
                let ids = []
                imagePropertiesList.forEach(elem => {
                    ids.push(elem.id);
                });
                let imageParts = new Array(ids.length)
                for(let i = 0; i < ids.length; i++){
                //imagePropertiesList.forEach(async (elem) => {
                    var URLPart = "/fractal/" + ids[i];
                    const response = await httpService.get(URLPart).then(response => {
                        const imagePart = response.data;
                        console.log(imagePart);
                        imageParts[i] = imagePart;
                    });
                    
                }
                ids.push(myId);
                setPartIdListState(ids);
                setImagePartsState(imageParts);
                setLoadingImagePartsState(1);
            })
            
    }

    useEffect(() => {
        if(loadingImagePartsState == 1){
            setBtnAfterPartsHiddenState("visible");
        }
    }, [loadingImagePartsState])

    function addImage() {
        setAllImagesHiddenState("visible");
    }

    function chooseImage(object) {
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
        setPartIdListState(ids);
    }

    function deletePart(i){
        let parts = [...imagePartsState];
        let properties = [...imagePropertiesListState];
        let ids = [...partIdListState];

        parts.splice(i,1);
        properties.splice(i,1);
        ids.splice(i,1);
        if(i == idState){
            setIdState(-1);
        }

        setImagePartsState(parts);
        setImagePropertiesListState(properties);
        setPartIdListState(ids);
    }

    function loadAllImages () {
        var URL = "/account/1/fractals";
        
        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
                console.log(data);
                setAllImagesState(data);
        })

    }

    useEffect(() => {
        if (allImagesState.length > 0) {
            setBtnAfterAllHiddenState("visible");
        }
    },[allImagesState])

    function onLoad() {
        //console.log(event.target)
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const image = imgCanvas.current;


        context.drawImage(image,0,0);
    }



    function drawImages(){
        const id = idState;
        const nrImages = Object.keys(imagePartsRefs).length;
        //console.log(nrImages)
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = canvasDimX;
        canvas.height = canvasDimY;
        for (let i = 0; i < nrImages; i++){
            if(i != id){
                const imageCurrent = imagePartsRefs[`img${i}`];
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
            list[idState] = {
                "posX": posXState,
                "posY": posYState,
                "rotation": rotationState,
                "scale": scaleState,
                "id": idImage
            }
            setImagePropertiesListState(list);
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
        
        console.log(partIdListState)
    }, [partIdListState])

    useEffect(() => {
        
        drawImages();
    }, [imagePropertiesListState])

    return (
        <div className="mainDiv1">
            <div className="myRow1">
                <div className="myColumn1" style = {{visibility:imagePartsHiddenState}}>
                    <p>Image's Components:</p>
                    {
                        //console.log(imagePartsState)
                        imagePartsState.map(function(object, i){
                            //const canvasRef = useRef(null);
                            
                            return (   
                                <div className="image-part"> 
                                    <img
                                        id={i}
                                        ref = {(ref) => imagePartsRefs[`img${i}`] = ref}
                                        src = {object.dataURL}
                                        width = "50%" height = "50%"
                                        onClick={changeImage}
                                        className={imagePartsHiddenState}
                                        >
                                    </img>
                                    {<button onClick={() => deletePart(i)}>Delete</button>}
                                </div>
                            );
                        })
                    }
                    {<button style = {{visibility:btnAfterAllHiddenState}} onClick={addImage}>Add Image</button>}
                </div>
                <div className="myColumn2">
                    <div className="myColumn21">
                        <canvas ref={canvasRef} onClick={handleClick} {...props}/>
                    </div>
                    <div className="myColumn22">
                        <div className="slidecontainer">
                            <input onInput={changeRotation} defaultValue="0" type="range" step="1" min="-180" max="180" className="slider" id="myRange4" />  
                        </div>
                        <div className="slidecontainer">
                            <input onInput={changeScale} defaultValue="1" type="range" step="0.1" min="0.1" max="3" className="slider" id="myRange4" />  
                        </div>
                        {<button onClick={loadAllImages}>Create Image</button>}
                        {<button onClick={loadImage}>Load Image</button>}
                        {<button style = {{visibility:btnAfterPartsHiddenState}} onClick={prepareImage} >Save Image</button>}
                        {<button style = {{visibility:btnAfterPartsHiddenState}} onClick={()=> imagePartsHiddenState == "hidden" ? setImagePartsHiddenState("visible") : setImagePartsHiddenState("hidden")}>Show Components</button>}
                    </div>
                </div>
            </div>
            {<img ref={imgCanvas} src={imgCanvasState} width="100" height="100" onLoad={onLoad} className="hidden"/>}
            <div className="myRow2" style = {{visibility:allImagesHiddenState}}>
            {
                    
                    allImagesState.map(function(object, i){
                        if(!partIdListState.includes(object.id)) {
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
    )
}