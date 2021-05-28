import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import Slider from 'react';
import { ChromePicker } from 'react-color';
import { useParams } from 'react-router';
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";
import ImageDetails from "../components/ImageDetails";
import SaveAndLoad from "../components/SaveAndLoad";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


export default function Tree(props){
    const params = useParams();
    const authentication = useContext(AuthenticationContext);
    let profileId = authentication.getUser();

    const [imageProfileId, setImageProfileId] = useState(-1);
    
    const canvasRef = useRef(null);
    const canvasRef1 = useRef(null);
    const downloadRef = useRef(null);

    const [backgroungColorState, setBackgroungColorState] = useState({r: 0, g: 0, b: 0, a: 1});
    const [isPngState, setIsPngState] = useState(false);
    const [canvasDataUrl, setCanvasDataUrl] = useState(null);

    const [nameState, setNameState] = useState("");
    const [descriptionState, setDescriptionState] = useState("");

    const [bodyColorState, setBodyColorState] = useState({r: 255, g: 255, b: 255, a: 1});
    const [leafColorState, setLeafColorState] = useState({r: 255, g: 255, b: 255, a: 1});
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

    const [loadingGetState,setLoadingGetState] = useState(2);
    const [loadingPostState,setLoadingPostState] = useState(0);
    
    
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

    function saveTree() {
        setLoadingPostState(1);
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
              setLoadingPostState(0);
            });
        
    }

    const loadTree = useCallback(() => {
        let myId = params.id;
        let URL = "/fractal/" + myId;
        console.log(loadingGetState)
        if(loadingGetState == 0) {
            setLoadingGetState(1);
        }
        
        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
                console.log(data);
                if (data.type == "tree"){
                    var options = JSON.parse(data.options);
                    setNameState(data.name);
                    setImageProfileId(data.profile.id);
                    setDescriptionState(data.description);
                    setIsPngState(data.status);
                    console.log(options.background)
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
                    setBodyColorState(options.bodyColor);
                    setLeafColorState(options.leafColor);
                    setShadowColorState(options.shadowColor);
                }
                setLoadingGetState(0);
            })
            .catch((e) => {
                setLoadingGetState(0);
                console.log(e);
              });
        

    }, [loadingGetState])

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

    useEffect(()=>{
        //console.log(params.action)
        if(params.action === "old"){
            loadTree();
        } else if(params.action === "new"){
            setLoadingGetState(0);
            randomTree()
        }
       
    },[])

    function checkInput() {
        if (nameState.length < 6 || nameState.length > 20 || descriptionState.length < 6 || descriptionState.length > 100) {
            return false;
        }
        return true;
    }
    
    return(
        <div>
            <Loader
                style={{display: loadingGetState == 2 ? "flex" : "none"}}
                type="TailSpin"
                color="#FFF"
                height={100}
                width={100} 
            />
            <div style={{
                display: loadingGetState != 2 ? "flex" : "none",
                justifyContent: "space-between",
                background:"rgba(255, 255, 255, 0.75)",
                padding: "1vh",
                border: "1.5px dotted gray",
                borderRadius: "15px",
                height: "92vh",
                width:"60vw",
                overflow: "hidden"
            }}
            >
                <div style={{
                    display:"flex",
                    flexDirection:"column",
                    alignItems:"center"
                }}>
                    <div className="myColumnCanvas">
                        <canvas 
                            ref={canvasRef}
                            style={{background:'rgb(' + backgroungColorState.r + ',' + backgroungColorState.g + ',' + backgroungColorState.b + ',' + backgroungColorState.a + ')'}} 
                        />
                    </div>
                    <div className="myRowSimple">
                            <div style={{
                                display:"flex",
                                flexDirection:"column",
                                alignItems:"center"
                            }}>
                                <label className="form-label" style={{fontSize:"1.5vw"}}>Body color</label>
                                <ChromePicker 
                                    color={bodyColorState}
                                    onChange={(event) => setBodyColorState(event.rgb)}
                                    width="9vw"
                                />
                            </div>
                            <div style={{
                                display:"flex",
                                flexDirection:"column",
                                alignItems:"center"
                            }}>
                                <label className="form-label" style={{fontSize:"1.5vw"}}>Leaf color</label>
                                <ChromePicker 
                                    color={leafColorState}
                                    onChange={(event) => setLeafColorState(event.rgb)}
                                    width="9vw"
                                />
                            </div>
                            <div style={{
                                display:"flex",
                                flexDirection:"column",
                                alignItems:"center"
                            }}>
                                <label className="form-label" style={{fontSize:"1.5vw"}}>Shadow color</label>
                                <ChromePicker 
                                    color={shadowColorState}
                                    onChange={(event) => setShadowColorState(event.rgb)}
                                    width="9vw"
                                />
                            </div>
                        </div>
                    </div>
                <div className="myColumnOptions">
                    <h3 className="fw-light">Tree</h3>
                    <ImageDetails 
                        backgroungColorState={backgroungColorState} 
                        setBackgroungColorState={setBackgroungColorState}
                        condition={!(imageProfileId == profileId || imageProfileId == -1 )}
                        canvasRef1={canvasRef1}
                        nameState={nameState}
                        setNameState={setNameState}
                        descriptionState={descriptionState}
                        setDescriptionState={setDescriptionState}
                        isPngState={isPngState}
                        setIsPngState={setIsPngState}
                    />
                    <SaveAndLoad 
                        action = {params.action}
                        type = "Tree"
                        loadFunction={loadTree}
                        saveFunction={checkInput() ? saveTree : null}
                        loadingGetState={loadingGetState}
                        loadingPostState={loadingPostState}
                        imageProfileId={imageProfileId}
                        profileId={profileId}
                        downloadRef={downloadRef}
                        downloadClick={downloadClick}
                        canvasDataUrl={canvasDataUrl}
                        nameState={nameState}
                        isPngState={isPngState}
                        generate={randomTree}
                    />
                </div>
                
                
            </div>
        </div>
    ) 
}