import React, { useRef, useEffect, useCallback, useState } from 'react'
import Slider from 'react';
import { ChromePicker } from 'react-color';
import { useParams } from 'react-router';
import httpService from '../services/httpService';


export default function Tree(props){
    const params = useParams();
    const canvasRef1 = useRef(null);
    const downloadRef = useRef(null);
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

    const [started, setStarted] =useState(0);
    
    
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

        if(length < 20){
            context.beginPath();
            context.arc(0, -length, 20, 0, Math.PI/2);
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
        canvas.width = 300 * scale;
        canvas.height = 300 * scale;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)

        let startX = canvas.width / 2;
        setStartXState(startX);

        let startY = canvas.height -50;
        setStartYState(startY);

        let length = Math.floor(Math.random() * 20 + 120);
        setLengthState(length);

        let branchWidth = Math.floor(Math.random() * 7 + 10);
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
        canvas.width = 300 * scale;
        canvas.height = 300 * scale;
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

    useEffect(()=>{
        //console.log(imgUrl)
    },[imgUrl])

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
                + (currentdate.getHours() < 10 ? "0"+ currentdate.getHours() : currentdate.getHours()) + ":"  
                + (currentdate.getMinutes() < 10 ? "0"+ currentdate.getMinutes() : currentdate.getMinutes()) + ":" 
                + (currentdate.getSeconds() < 10 ? "0"+ currentdate.getSeconds() : currentdate.getSeconds());
        //console.log(datetime);

        const canvas = canvasRef1.current;
        var sourceImageData = canvas.toDataURL("image/png",0.5);
        console.log(sourceImageData);


        var fractal = {
            "id": 0,
            "type": "tree",
            "name": "name5",
            "description": "description",
            "options": JSON.stringify(options),
            "dataURL": sourceImageData,
            "lastModified": datetime,
            "profile": {
                "id": 1
            }
        }

        var URL = "/fractal"
        httpService
            .post(URL, fractal)
            .then((response) => {
              console.log(response.data);
            });
        
    }

    const loadTree = useCallback(() => {
        let myId = params.id;
        let URL = "/fractal/" + myId;
        
        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
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
        existingTree();

    }, [bodyColorState,leafColorState,shadowColorState])

    function downloadClick(){
        const link = downloadRef.current;
        link.click();
    }

    useEffect(()=>{
        if(started == 0){
            if(params.action === "old"){
                loadTree();
            } else if(params.action === "new"){
                randomTree()
            }
        }
        setStarted(1)
    },[started])
    
    return(
        <>
            <div>
                <canvas ref={canvasRef1} {...props}/>
            </div>
            <div>
                {/*<canvas ref={canvasRef2} {...props}/>*/}
            </div>
            <a ref={downloadRef} id="download" download="myImage.png" href={"imgUrl"}>img</a>
            <button onClick={downloadClick}>Download</button>
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
            {/*<button onClick={existingTree}>Generate Previous Tree</button>*/}
            {<button onClick={saveTree}>Save Tree</button>}
            {<button style={{visibility:((params.action === "old") ? "visible" : "hidden")}} onClick={loadTree}>Load Tree</button>}
            {<button onClick={randomTree} className="generate-tree-button">Generate Random Tree</button>}
        </>
    ) 
}