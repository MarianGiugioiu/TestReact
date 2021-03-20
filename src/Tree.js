import React, { useRef, useEffect, useCallback, useState } from 'react'
import Slider from 'react';
import { ChromePicker } from 'react-color'
import img from './myImage.png';

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

export default function Canvas(props){
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
        canvas.width = 800 * scale;
        canvas.height = 600 * scale;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)

        let startX = canvas.width / 2;
        setStartXState(startX);

        let startY = canvas.height -100;
        setStartYState(startY);

        let length = Math.floor(Math.random() * 100 + 200);
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

        console.log(angleListState);

        //console.log(angleList)
        console.log("####")
        var sourceImageData = canvas.toDataURL("image/png");
        setImgUrl(sourceImageData);

    }, [bodyColorState,leafColorState, shadowColorState, angleListState, curveListState, lengthState, startXState, startYState, branchWidthState])

    /*const existingTree = useCallback(()  => {
        const canvas = canvasRef1.current;
        const context = canvas.getContext('2d');

        var scale = 2;
        canvas.width = 800 * scale;
        canvas.height = 600 * scale;
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

        console.log(angleList);

        //console.log(angleList)
        console.log("####")
        var sourceImageData = canvas.toDataURL("image/png");
        setImgUrl(sourceImageData);

    }, [bodyColorState,leafColorState, shadowColorState, angleListState, curveListState, lengthState, startXState, startYState, branchWidthState])
    

    const changeBodyColorState = useCallback((event) => {
        let val = event.rgb;
        setbodyColorState(val);
        //console.log(bodyColorState);
        
        existingTree();
    }, [bodyColorState,existingTree])

    const changeLeafColorState = useCallback((event) => {
        let val = event.rgb;
        setleafColorState(val);
        //console.log(val);
        
        existingTree();
    }, [leafColorState,existingTree])

    const changeShadowColorState = useCallback((event) => {
        let val = event.rgb;
        setShadowColorState(val);
        console.log(shadowColorState);
        
        existingTree();
    }, [shadowColorState,existingTree])*/

    function existingTree ()  {
        const canvas = canvasRef1.current;
        const context = canvas.getContext('2d');

        var scale = 2;
        canvas.width = 800 * scale;
        canvas.height = 600 * scale;
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

        console.log(angleList);

        //console.log(angleList)
        console.log("####")
        var sourceImageData = canvas.toDataURL("image/png");
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
            {<button onClick={randomTree} className="generate-tree-button">Generate Random Tree</button>}
        </>
    ) 
}