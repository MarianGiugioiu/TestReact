import React, { useRef, useEffect, useCallback, useState } from 'react'
import './App.css';

export default function TreeList(props){
    const canvasDimX = 1500;
    const canvasDimY = 1500;
    const imageDimX = 300;
    const imageDimY = 300;

    const [myData,setMyData] = useState([]);

    const canvasRef = useRef(null);
    const imageRefs = {};

    const [idState, setIdState] = useState(-1);
    const [scaleState, setScaleState] = useState(1);
    const [rotationState, setRotationState] = useState(0);
    const [posXState, setPosXState] = useState(canvasDimX / 2);
    const [posYState, setPosYState] = useState(canvasDimY / 2);

    const [imagePropertiesListState, setImagePropertiesListState] = useState([]);


    const loaadTrees = useCallback(() => {
        var URL = "/account/1/fractals";
        
        var fractal = {}
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            setMyData(data);
            
        })
        const imagePropertiesList = [
            {
                "posX": imageDimX / 2,
                "posY": imageDimY / 2,
                "rotation": 0,
                "scale": 1
            },
            {
                "posX": imageDimX * 3 /2,
                "posY": imageDimY * 3 / 2,
                "rotation": 0,
                "scale": 1
            },
            {
                "posX": imageDimX * 5 / 2,
                "posY": imageDimY * 5 / 2,
                "rotation": 0,
                "scale": 1
            }
        ];
        setImagePropertiesListState(imagePropertiesList);

    }, [myData, imagePropertiesListState])

    function onLoad(event) {
        console.log(event.target)
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        context.drawImage(event.target,0,0);
    }

    function changeTree(){
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = 800 * 2;
        canvas.height = 800 * 2;
        console.log(imageRefs);
        const image = imageRefs.img0;
        console.log(image);
        context.drawImage(image,0,0,image.width,image.height);
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

        context.beginPath();
        context.save();
        context.strokeStyle = 'blue';
        context.lineWidth = 5;
        context.fillStyle = 'red';
        context.rect(-imageDimX * scaleState / 2, -imageDimY * scaleState / 2, imageDimX * scaleState, imageDimY * scaleState);
        context.stroke();

        context.drawImage(image, -imageDimX * scaleState / 2, -imageDimY * scaleState / 2, imageDimX * scaleState, imageDimY * scaleState);
        }
    }

    function changeImage (event) {
        const image = event.target;
        const id = image.id;
        if (idState != -1){
            const list = [...imagePropertiesListState];
            list[idState] = {
                "posX": posXState,
                "posY": posYState,
                "rotation": rotationState,
                "scale": scaleState
            }
            setImagePropertiesListState(list);
        }
        setIdState(id);

        console.log(id);

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
        var posX = (event.clientX - offsetX) * 1500 / (width - offsetX);
        var posY = (event.clientY - offsetY) * 1500 / (height - offsetY);
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
        console.log(posXState,posYState,rotationState,scaleState)
        console.log(imagePropertiesListState);
        
    }, [idState,rotationState,scaleState,posXState,posYState])
    

    /*useEffect(() => {
        loaadTrees();
        //createImages();
        //existingTree();
    }, [])*/

    useEffect(() => {
        //console.log(myData);
        //console.log(imagePropertiesListState);
        drawImages();
    }, [loaadTrees])

    return (
        <div>
            <canvas ref={canvasRef} onClick={handleClick} {...props}/>
            {<button onClick={loaadTrees}>Load Tree</button>}
            {<button onClick={changeTree}>Change Tree</button>}
            <div className="slidecontainer">
                <input onInput={changeRotation} defaultValue="0" type="range" step="1" min="-180" max="180" className="slider" id="myRange4" />  
            </div>
            <div className="slidecontainer">
                <input onInput={changeScale} defaultValue="1" type="range" step="0.1" min="0.1" max="3" className="slider" id="myRange4" />  
            </div>
            {
                myData.map(function(object, i){
                    //const canvasRef = useRef(null);

                    return (
                        <div>
                            <p>rtu</p>
                            
                            {
                                <img
                                    id={i}
                                    ref = {(ref) => imageRefs[`img${i}`] = ref}
                                    src = {object.dataURL}
                                    width = "200" height = "200"
                                    onClick={changeImage}
                                    >
                                </img>}
                        </div>
                    );
                })
            }
        </div>
    )
}