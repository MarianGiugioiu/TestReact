import React, { useRef, useEffect, useCallback, useState } from 'react'
import Slider from 'react';
import { ChromePicker } from 'react-color'
import httpService from '../src/services/httpService';
import img from './myImage.png';


export default function Tree(props){
    const canvasRef1 = useRef(null);
    const canvasRef2 = useRef(null);
    const [imgUrl, setImgUrl] = useState(null);
    const [bodyColorState, setbodyColorState] = useState({r: 255, g: 255, b: 255, a: 1});
    const [leafColorState, setleafColorState] = useState({r: 255, g: 255, b: 255, a: 1});
    const [shadowColorState, setShadowColorState] = useState({r: 255, g: 255, b: 255, a: 1});
    const [startXState, setStartXState] = useState(0);
    const [startYState, setStartYState] = useState(0);
    const [lengthState, setLengthState] = useState(0);
    const [branchWidthState, setBranchWidthState] = useState(0);
    const [angleListState, setAngleListState] = useState([]);
    const [nrBranchesListState, setNrBranchesListState] = useState([]);
    const [curveListState, setCurveListState] = useState([]);
    
    
    const drawTree = useCallback((rand, context, startX, startY, length, branchWidth, nrBranchesList, angle, angleList, curveList, bodyColor, leafColor, shadowColor)  => {
        context.beginPath();
        //console.log(branchWidth);
        context.save();
        context.strokeStyle = 'rgb(' + bodyColor.r + ',' + bodyColor.g + ',' + bodyColor.b + ',' + bodyColor.a + ')';
        context.fillStyle = 'rgb(' + leafColor.r + ',' + leafColor.g + ',' + leafColor.b + ',' + leafColor.a + ')';

        context.shadowBlur = 5;
        context.shadowColor = 'rgb(' + shadowColor.r + ',' + shadowColor.g + ',' + shadowColor.b + ',' + shadowColor.a + ')';
        
        context.lineWidth = branchWidth;
        context.translate(startX,startY);

        var curve = 0;

        if (rand){
            angleList.push(angle);
            var curve = Math.floor(Math.random() * 3 + 3);
            curveList.push(curve);
        } else {
            angle = angleList.pop();
            curve = curveList.pop();
        }


        context.rotate(angle * Math.PI / 180);
        context.moveTo(0,0);
        
        if(angle > 0){
            context.bezierCurveTo(curve, -length/2, curve, -length/2, 0, -length)
        } else {
            context.bezierCurveTo(curve, -length/2, -curve, -length/2, 0, -length)
        }
        context.stroke();

        if(length < 30){
            context.beginPath();
            context.arc(0, -length, 30, 0, Math.PI/2);
            context.fill();
            context.restore();
            return;
        }
        //var nrBranches = Math.floor(Math.random() + 2);
        var nrBranches = 3;
        //console.log(nrBranches)
        if(rand){
            for(let i =  1; i <= nrBranches - nrBranches % 2 ; i++){
                var angleDiff = Math.random() * 30 + 10;
                if(i % 2 == 0) {
                    angleDiff = -angleDiff;
                }
                var newAngle = angle + angleDiff;
                //console.log(newAngle)
                drawTree(rand, context, 0 , -length, length * 0.75, branchWidth * 0.7, nrBranchesList , newAngle, angleList, curveList, bodyColor, leafColor, shadowColor);
            }
            if (nrBranches % 2) {
                var sign = Math.floor(Math.random() * 2)
    
                var angleDiff = Math.random() * 30 + 10;
                if(sign == 0) {
                    angleDiff = -angleDiff;
                }
                var newAngle = angle + angleDiff;
                //console.log(newAngle)
                drawTree(rand, context,0 , -length, length * 0.75, branchWidth * 0.7, nrBranchesList , newAngle, angleList, curveList, bodyColor, leafColor, shadowColor);
            }
        } else {
            for(let i =  1; i <= nrBranches; i++){
                drawTree(rand, context,0 , -length, length * 0.75, branchWidth * 0.7, nrBranchesList , angle, angleList, curveList, bodyColor, leafColor, shadowColor);
            }
        }

        context.restore();
        
    }, [bodyColorState,leafColorState,shadowColorState])

    const randomTree = useCallback(()  => {
        const canvas = canvasRef1.current;
        const context = canvas.getContext('2d');

        var scale = 2;
        canvas.width = 700 * scale;
        canvas.height = 700 * scale;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)

        let startX = canvas.width / 2;
        setStartXState(startX);

        let startY = canvas.height -100;
        setStartYState(startY);

        let length = Math.floor(Math.random() * 50 + 250);
        setLengthState(length);

        let branchWidth = Math.floor(Math.random() * 20 + 20);
        setBranchWidthState(branchWidth);

        //console.log(startX, startY, length, branchWidth)

        //let color1 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        //let color2 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        var bodyColor = bodyColorState;
        var leafColor = leafColorState;
        var shadowColor = shadowColorState;

        let curveList = [];
        let angleList = [];

        drawTree(true, context, startX, startY , length, branchWidth, 3, 0, angleList, curveList, bodyColor, leafColor, shadowColor);
        
        setAngleListState(angleList.reverse());
        setCurveListState(curveList.reverse());

        //console.log(angleListState);

        //console.log(angleList)
        //console.log("####")
        /*context.beginPath();
        context.save();
        context.strokeStyle = 'blue';
        context.fillStyle = 'red';
        context.rect(100, 100, 100, 100);
        context.stroke();
        context.fill();*/

        var sourceImageData = canvas.toDataURL("image/png");
        setImgUrl(sourceImageData);

    }, [bodyColorState,leafColorState, shadowColorState, angleListState, curveListState, lengthState, startXState, startYState, branchWidthState])

    function existingTree ()  {
        const canvas = canvasRef1.current;
        const context = canvas.getContext('2d');

        var scale = 2;
        canvas.width = 700 * scale;
        canvas.height = 700 * scale;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)

        let startX = startXState;

        let startY = startYState;

        let length = lengthState;

        let branchWidth = branchWidthState;

        //console.log(startX, startY, length, branchWidth)

        //let color1 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        //let color2 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        var bodyColor = bodyColorState;
        var leafColor = leafColorState;
        var shadowColor = shadowColorState;

        let curveList = [...curveListState];
        let angleList = [...angleListState];

        drawTree(false, context, startX, startY , length, branchWidth, 3, 0, angleList, curveList, bodyColor, leafColor, shadowColor);

        //console.log(angleList);

        //console.log(angleList)
        //console.log("####")
        var sourceImageData = canvas.toDataURL("image/png");
        //console.log(sourceImageData);
        setImgUrl(sourceImageData);

    }

    function changeBodyColorState (event) {
        let val = event.rgb;
        setbodyColorState(val);
        //console.log(bodyColorState);
        
        //existingTree();
    }

    function changeLeafColorState(event) {
        let val = event.rgb;
        setleafColorState(val);
        //console.log(val);
        
        //existingTree();
    }

    function changeShadowColorState(event) {
        let val = event.rgb;
        setShadowColorState(val);
        console.log(shadowColorState);
        
        //existingTree();
    }

    function saveTree() {
        var options = {
            "type": "tree",
            "startX": startXState,
            "startY": startYState,
            "length": lengthState,
            "branchWidth": branchWidthState,
            "nrBranchesList": nrBranchesListState,
            "angleList": angleListState,
            "curveList": curveListState,
            "bodyColor": bodyColorState,
            "leafColor": leafColorState,
            "shadowColor": shadowColorState
        }
        //console.log(JSON.stringify(options));

        var currentdate = new Date(); 
        var datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth() < 9 ? "0"+ (currentdate.getMonth() + 1) : (currentdate.getMonth() + 1))  + "-" 
                + (currentdate.getDate() < 10 ? "0"+ currentdate.getDate() : currentdate.getDate()) + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
        console.log(datetime);

        const canvas = canvasRef1.current;
        var sourceImageData = canvas.toDataURL("image/png");

        var fractal = {
            "id": 0,
            "type": "tree",
            "name": "name5",
            "description": "description",
            "options": JSON.stringify(options),
            "dataURL": sourceImageData,
            "lastModified": datetime,
            "account": {
                "id": 1
            }
        }

        //console.log(fractal);
        /*httpService
            .post('/fractal', fractal)
            .then((response) => {
                console.log('createStudent Response :');
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });*/
        var URL = "/fractal"
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fractal),
            };
    
        fetch(URL, requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
        
    }

    const loadTree = useCallback(() => {
        var URL = "/fractal/1";
        
        var fractal = {}
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            var options = JSON.parse(data.options);
            console.log(options);
            setStartXState(options.startX);
            setStartYState(options.startY);
            setLengthState(options.length);
            setBranchWidthState(options.branchWidth);
            setNrBranchesListState(options.nrBranchesList);
            setAngleListState(options.angleList);
            setCurveListState(options.curveList);
            setbodyColorState(options.bodyColor);
            setleafColorState(options.leafColor);
            setShadowColorState(options.shadowColor);
        })

    }, [])

    useEffect(() => {
        existingTree();
    }, [loadTree])

    useEffect(() => {
        //drawTree(context, canvas.width / 2, canvas.height -30 , 30, 0, 8, 'brown', 'blue')
        //randomTree();

        //context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        existingTree();

    }, [bodyColorState,leafColorState,shadowColorState])

    useEffect(() => {
        randomTree();
    }, [])
    
    return(
        <>
            <div>
                <canvas ref={canvasRef1} {...props}/>
            </div>
            <div>
                {/*<canvas ref={canvasRef2} {...props}/>*/}
            </div>
            <a id="download" download="myImage.png" href={"imgUrl"}>img</a>
            <div className="column-div">
                <div>
                    <ChromePicker 
                        color={bodyColorState}
                        onChange={changeBodyColorState}
                    />
                </div>
                <div>
                    <ChromePicker 
                        color={leafColorState}
                        onChange={changeLeafColorState}
                    />
                </div>
                <div>
                    <ChromePicker 
                        color={shadowColorState}
                        onChange={changeShadowColorState}
                    />
                </div>
            </div>
            {<button onClick={existingTree}>Generate Previous Tree</button>}
            {<button onClick={saveTree}>Save Tree</button>}
            {<button onClick={loadTree}>Load Tree</button>}
            {<button onClick={randomTree} className="generate-tree-button">Generate Random Tree</button>}
        </>
    ) 
}