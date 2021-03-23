import React, { useRef, useEffect, useCallback, useState } from 'react'
import './App.css';

export default function Canvas(props){
    const canvasRef1 = useRef(null);
    const canvasRef2 = useRef(null);
    const img = useRef(null);
    const [imgUrl, setImgUrl] = useState(null);

    const canvasDimX = 1500;
    const canvasDimY = 1500;
    const imageDimX = 300;
    const imageDimY = 300;

    const [scaleState, setScaleState] = useState(1);
    const [rotationState, setRotationState] = useState(0);
    const [posXState, setPosXState] = useState(canvasDimX / 2);
    const [posYState, setPosYState] = useState(canvasDimY / 2);

    const drawShape = useCallback(() => {
        const canvas = canvasRef1.current;
        const context = canvas.getContext('2d');

        canvas.width = 300;
        canvas.height = 300;


        context.beginPath();
        context.save();
        context.strokeStyle = 'blue';
        context.fillStyle = 'red';
        context.rect(100, 100, 100, 100);
        context.stroke();
        context.fill();

        var sourceImageData = canvas.toDataURL("image/png");
        var image = new Image();
        image.id = "pic"
        image.src = sourceImageData;
        setImgUrl(sourceImageData);

        var image1 = new Image(image);

        //context2.drawImage(image1, 0, 0);


    },[imgUrl])

    function loadData() {
        var URL = "/fractal/2";
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            setImgUrl(data.dataURL);
        }
        );
    }

    function drawSecond(rotation, posX, posY, scale){
        const canvas2 = canvasRef2.current;
        const context2 = canvas2.getContext('2d');
        const image = img.current;
        //console.log(image);

        canvas2.width = 1500;
        canvas2.height = 1500;

        
        //context2.fill();


        //console.log(rotation);
        //console.log(scale);
        context2.translate(posXState, posYState);
        context2.rotate(rotationState*Math.PI/180);

        
        context2.beginPath();
        context2.save();
        context2.strokeStyle = 'blue';
        context2.lineWidth = 5;
        context2.fillStyle = 'red';
        context2.rect(-imageDimX * scaleState / 2, -imageDimY * scaleState / 2, imageDimX * scaleState, imageDimY * scaleState);
        context2.stroke();

        context2.drawImage(image, -imageDimX * scaleState / 2, -imageDimY * scaleState / 2, 300 * scaleState, 300 * scaleState);
    }

    function onLoad(event) {
        drawSecond(0,0,0,1);

    }

    function changeRotation(event){
        let val = event.target.value;
        setRotationState(val)
        //console.log(image);
        //drawSecond(val, 200, 200, 1);
    }

    function handleClick(event){
        const canvas2 = canvasRef2.current;
        var offset = canvas2.getBoundingClientRect();
        var offsetX = offset.left;
        var offsetY = offset.top;
        var width = offset.height;
        var height = offset.bottom;
        //console.log(event.clientX,event.clientY)
        //console.log(canvas2.position)
        //console.log(offset);
        //console.log(event.clientX/(width-offsetX), event.clientY/())
        var posX = (event.clientX - offsetX) * 1500 / (width - offsetX)// - 150 * scaleState;
        var posY = (event.clientY - offsetY) * 1500 / (height - offsetY)// - 150 * scaleState;
        setPosXState(posX);
        setPosYState(posY);
        //console.log(parseInt(posX), parseInt(posY));
        //drawSecond(0, posX, posY, 1);
    }

    function changeScale(event) {
        let val = event.target.value;
        setScaleState(val);
       // console.log(val);
        //console.log(image);
        //drawSecond(0, 200, 200, val);
    }

    useEffect(() => {
        drawSecond(0,0,0,1);
        //loadData();
        
    }, [rotationState, scaleState, posXState, posYState])

    useEffect(() => {
        drawShape();
        //loadData();
        
    }, [])

    return (
        <div>
            <div>
                <canvas ref={canvasRef1} {...props}/>
            </div>
            <div>
                {<canvas ref={canvasRef2} onClick={handleClick} {...props}/>}
            </div>
            <div className="slidecontainer">
                <input onInput={changeRotation} defaultValue="0" type="range" step="1" min="-180" max="180" className="slider" id="myRange4" />  
            </div>
            <div className="slidecontainer">
                <input onInput={changeScale} defaultValue="1" type="range" step="0.1" min="0.1" max="3" className="slider" id="myRange4" />  
            </div>
            <img ref={img} src={imgUrl} width="100" height="100" onLoad={onLoad} className="hidden"/>
        </div>
    )
}