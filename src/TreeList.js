import React, { useRef, useEffect, useCallback, useState } from 'react'
import './App.css';

export default function TreeList(props){
    const canvasDimX = 1500;
    const canvasDimY = 1500;
    const imageDimX = 300;
    const imageDimY = 300;

    const [myData,setMyData] = useState([]);

    const canvasRef = useRef(null);
    const imgCanvas = useRef(null);
    const imageRefs = {};

    const [idState, setIdState] = useState(-1);
    const [scaleState, setScaleState] = useState(1);
    const [rotationState, setRotationState] = useState(0);
    const [posXState, setPosXState] = useState(canvasDimX / 2);
    const [posYState, setPosYState] = useState(canvasDimY / 2);

    const [imagePropertiesListState, setImagePropertiesListState] = useState([]);
    const [imgCanvasState,setImgCanvasState] = useState(null);

    const [imagePart, setImagePart] = useState({});
    const [readyState, setReadyState] = useState(0);

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
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(image),
                };
        
            fetch(URL, requestOptions)
                .then(response => response.json())
                .then(data => console.log(data));

            setReadyState(0);
        //}
    }

    const loadImage = useCallback(() => {
        //console.log("asd");
        var URL = "/fractal/71";
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            const imagePropertiesList = JSON.parse(data.options).imagePropertiesList;
            //console.log(imagePropertiesList)
            /*const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            canvas.width = canvasDimX;
            canvas.height = canvasDimY;
            var image1 = imgCanvas.current;
            image1.src = data.dataURL;
            console.log(image1)
            context.drawImage(image1,0,0,300,300)*/
            setImgCanvasState(data.dataURL);
            setImagePropertiesListState(imagePropertiesList)
            imagePropertiesList.forEach((elem) => {
                var URLPart = "/fractal/" + elem.id;
                //console.log(URLPart);
                //var images = [];
                fetch(URLPart)
                .then(response => response.json())
                .then(dataPart => {
                    //console.log(dataPart);
                    setImagePart(dataPart);
                    //images.push(dataPart);
                    /*var images = [...myData];
                    images.push(dataPart);
                    setMyData(images);
                    console.log(myData)*/
                });
                //console.log(images);
            })
        });
    },[myData,imagePart, imagePropertiesListState])

    useEffect(() => {
        //console.log(myData);
        //console.log(imagePart);
        var images = [...myData]
        if(Object.keys(imagePart).length !== 0)
            images.push(imagePart);
        setMyData(images);
        //console.log(myData);
        //drawImages();
    }, [imagePart])

    const loadTrees = useCallback(() => {
        var URL = "/account/1/fractals";
        
        var fractal = {}
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            setMyData(data);
            var imagePropertiesList = []
            data.forEach((image) => {
                imagePropertiesList.push({
                    "posX": imageDimX / 2,
                    "posY": imageDimY / 2,
                    "rotation": 0,
                    "scale": 1,
                    "id": image.id
                })
            });
            //console.log("###")
            //console.log(imagePropertiesList);
            //console.log("###")
            setImagePropertiesListState(imagePropertiesList);
        })

    }, [myData, imagePropertiesListState])

    function onLoad() {
        //console.log(event.target)
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const image = imgCanvas.current;


        context.drawImage(image,0,0);
    }



    function drawImages(){
        const id = idState;
        const nrImages = Object.keys(imageRefs).length;
        //console.log(nrImages)
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = canvasDimX;
        canvas.height = canvasDimY;
        for (let i = 0; i < nrImages; i++){
            if(i != id){
                const imageCurrent = imageRefs[`img${i}`];
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
            const image = imageRefs[`img${id}`];
        
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
    

    /*useEffect(() => {
        loadTrees();
        //createImages();
        //existingTree();
    }, [])*/

    useEffect(() => {
        //console.log(myData);
        //console.log(imagePropertiesListState);
        
        drawImages();
    }, [imagePropertiesListState])

    return (
        <div className="mainDiv1">
            <div className="myRow1">
                <div className="myColumn1">
                    <p>Image's Components:</p>
                    {
                        myData.reverse().map(function(object, i){
                            //const canvasRef = useRef(null);

                            return (    
                                <img
                                    id={i}
                                    ref = {(ref) => imageRefs[`img${i}`] = ref}
                                    src = {object.dataURL}
                                    width = "50%" height = "50%"
                                    onClick={changeImage}
                                    >
                                </img>
                            );
                        })
                    }
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
                        {<button onClick={loadTrees}>Load Trees</button>}
                        {<button onClick={loadImage}>Load Image</button>}
                        {<button onClick={prepareImage}>Save Image</button>}
                    </div>
                </div>
            </div>
            {<img ref={imgCanvas} src={imgCanvasState} width="100" height="100" onLoad={onLoad} className="hidden"/>}
            <div className="myRow2">
                <p>asd</p>
            </div>
        </div>
    )
}