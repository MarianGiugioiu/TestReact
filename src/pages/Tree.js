import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import Slider from 'react';
import { ChromePicker } from 'react-color';
import { useParams } from 'react-router';
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";


export default function Tree(props){
    const params = useParams();
    const authentication = useContext(AuthenticationContext);
    let profileId = authentication.getUser();
    
    const canvasRef = useRef(null);
    const canvasRef1 = useRef(null);
    const downloadRef = useRef(null);

    const [backgroungColorState, setBackgroungColorState] = useState({r: 0, g: 0, b: 0, a: 1});
    const [isPngState, setIsPngState] = useState(false);
    const [canvasDataUrl, setCanvasDataUrl] = useState(null);

    const [nameState, setNameState] = useState("");
    const [descriptionState, setDescriptionState] = useState("");

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

    let canvasDimX = 600;
    let canvasDimY = 600;
    
    
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
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = canvasDimX;
        canvas.height = canvasDimY;
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
        const canvas1 = canvasRef1.current;
        const context1 = canvas1.getContext('2d');
        canvas1.width = canvasDimX;
        canvas1.height = canvasDimY;
        var sourceImageData = canvas.toDataURL("image/png",0.5);
        //console.log(sourceImageData);

        if (!isPngState) {
            context1.save();
            context1.fillStyle = 'rgb(' + backgroungColorState.r + ',' + backgroungColorState.g + ',' + backgroungColorState.b + ',' + backgroungColorState.a + ')';
            console.log(context1.fillStyle);
            context1.fillRect(0, 0, canvas1.width, canvas1.height);
            context1.drawImage(canvas,0,0,canvasDimX,canvasDimY);
            var sourceImageData = canvas1.toDataURL("image/jpeg", 0.5);
            //console.log(sourceImageData);
            context1.restore();
        }
        setCanvasDataUrl(sourceImageData);

    }, [bodyColorState,leafColorState, shadowColorState, angleListState, curveListState, lengthState, startXState, startYState, branchWidthState])

    function existingTree ()  {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = canvasDimX;
        canvas.height = canvasDimY;
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
        const canvas1 = canvasRef1.current;
        const context1 = canvas1.getContext('2d');
        canvas1.width = canvasDimX;
        canvas1.height = canvasDimY;
        var sourceImageData = canvas.toDataURL("image/png",0.5);
        //console.log(sourceImageData);

        if (!isPngState) {
            context1.save();
            context1.fillStyle = 'rgb(' + backgroungColorState.r + ',' + backgroungColorState.g + ',' + backgroungColorState.b + ',' + backgroungColorState.a + ')';
            
            context1.fillRect(0, 0, canvas1.width, canvas1.height);
            context1.drawImage(canvas,0,0,canvasDimX,canvasDimY);
            var sourceImageData = canvas1.toDataURL("image/jpeg", 0.5);
            //console.log(sourceImageData);
            context1.restore();
        }
        //console.log(sourceImageData);
        setCanvasDataUrl(sourceImageData);

    }

    useEffect(()=>{
        //console.log(canvasDataUrl)
    },[canvasDataUrl])

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
            "shadowColor": shadowColorState,
            "background":backgroungColorState
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

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const canvas1 = canvasRef1.current;
        const context1 = canvas1.getContext('2d');
        canvas1.width = canvasDimX;
        canvas1.height = canvasDimY;
        var sourceImageData = canvas.toDataURL("image/png",0.5);
        //console.log(sourceImageData);

        if (!isPngState) {
            context1.save();
            context1.fillStyle = 'rgb(' + backgroungColorState.r + ',' + backgroungColorState.g + ',' + backgroungColorState.b + ',' + backgroungColorState.a + ')';
            console.log(context1.fillStyle);
            context1.fillRect(0, 0, canvas1.width, canvas1.height);
            context1.drawImage(canvas,0,0,canvasDimX,canvasDimY);
            var sourceImageData = canvas1.toDataURL("image/jpeg", 0.5);
            //console.log(sourceImageData);
            context1.restore();
        }

        var fractal = {
            "id": 0,
            "type": "tree",
            "status":isPngState,
            "name": nameState,
            "description": descriptionState,
            "options": JSON.stringify(options),
            "dataURL": sourceImageData,
            "lastModified": datetime,
            "profile": {
                "id": profileId
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
                console.log(data);
                var options = JSON.parse(data.options);
                setNameState(data.name);
                setDescriptionState(data.description);
                setIsPngState(data.status);
                if(options.background != null){
                    setBackgroungColorState(options.background);
                }
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

    }, [bodyColorState,leafColorState,shadowColorState,backgroungColorState,isPngState])

    function downloadClick(){
        const link = downloadRef.current;
        link.click();
    }

    useEffect(() => {
        console.log(isPngState);
    },[isPngState])

    useEffect(()=>{
        if(started == 0){
            console.log(params.action)
            if(params.action === "old"){
                loadTree();
            } else if(params.action === "new"){
                randomTree()
            }
        }
        setStarted(1)
    },[started])
    
    return(
        <div className="mainDiv1">
            <div className="myRowSimple">
                <div className="myColumnCanvasTree">
                    <canvas 
                        ref={canvasRef}
                        style={{background:'rgb(' + backgroungColorState.r + ',' + backgroungColorState.g + ',' + backgroungColorState.b + ',' + backgroungColorState.a + ')'}} 
                    />
                    
                </div>
                <div className="myColumnOptionsTree">
                    <div className="myRowSimple">
                        <div>
                            <ChromePicker 
                                color={bodyColorState}
                                onChange={changeBodyColorState}
                                width="10vw"
                            />
                        </div>
                        <div>
                            <ChromePicker 
                                color={leafColorState}
                                onChange={changeLeafColorState}
                                width="10vw"
                            />
                        </div>
                        <div>
                            <ChromePicker 
                                color={shadowColorState}
                                onChange={changeShadowColorState}
                                width="10vw"
                            />
                        </div>
                    </div>
                    <br></br>
                    <div className="myColumnSimple">
                        {<button onClick={saveTree}>Save Tree</button>}
                        {<button style={{display:((params.action === "old") ? "flex" : "none")}} onClick={loadTree}>Load Tree</button>}
                        <a ref={downloadRef} id="download" download={nameState + '.' + (isPngState ? "png" : "jpeg")} href={canvasDataUrl} style={{display:"none"}}>img</a>
                        <button onClick={downloadClick}>Download</button>

                        {<button onClick={randomTree} className="generate-tree-button">Generate Random Tree</button>}

                        <div className="myRowSimple">
                            <pre>Name:        </pre>
                            {
                                //(params.action === "old") ? 
                                //<pre>{nameState}</pre> : 
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
                                //(params.action === "old") ? 
                                //<pre>{descriptionState}</pre> : 
                                <input
                                    type="text"
                                    value={descriptionState}
                                    onChange={(event) => setDescriptionState(event.target.value)}
                                />
                            }
                        </div>
                        <div className="myRowSimple">
                            <div>
                                <ChromePicker 
                                    color={backgroungColorState}
                                    onChange={(event) => setBackgroungColorState(event.rgb)}
                                    width="10vw"
                                />
                            </div>
                            <div className="myColumnSimple">
                                
                                <div className="myRowSimple">
                                    <pre>PNG </pre>
                                    <input type="checkbox" id="checkbox1" checked={isPngState} onChange={() => setIsPngState(!isPngState)}></input>
                                </div>
                                <canvas 
                                    ref={canvasRef1}
                                    style={{display:"none"}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                
            </div>
            
            
        </div>
    ) 
}