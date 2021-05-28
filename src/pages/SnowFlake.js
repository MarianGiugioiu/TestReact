import React, { useRef, useEffect, useCallback, useState , useContext} from 'react'
import { ChromePicker } from 'react-color';
import { useParams } from 'react-router';
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";
import ImageDetails from "../components/ImageDetails";
import SaveAndLoad from "../components/SaveAndLoad";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function SnowFlake(props){
    const params = useParams();
    const authentication = useContext(AuthenticationContext);
    let profileId = authentication.getUser();

    const [imageProfileId, setImageProfileId] = useState(-1);

    const canvasRef = useRef(null);
    const canvasRef1 = useRef(null);
    const canvasRef2 = useRef(null);
    const downloadRef = useRef(null);

    const [backgroungColorState, setBackgroungColorState] = useState({r: 0, g: 0, b: 0, a: 1});
    const [isPngState, setIsPngState] = useState(false);
    const [canvasDataUrl, setCanvasDataUrl] = useState(null);

    const [nameState, setNameState] = useState("");
    const [descriptionState, setDescriptionState] = useState("");

    const [spreadState, setSpreadState] = useState(0.5);
    const [lengthState, setLengthState] = useState(200);
    const [nrFiguresState, setNrFiguresState] = useState(1);
    const [maxLevelState, setMaxLevelState] = useState(3);
    const [shadowBlurState, setShadowBlurState] = useState(0);
    const [lineColorState, setLineColorState] = useState({r: 255, g: 255, b: 255, a: 1});
    const [shadowColorState, setShadowColorState] = useState({r: 255, g: 255, b: 255, a: 1});
    const [lineWidthState, setLineWidthState] = useState(10);
    const [nrBranchesState, setNrBranchesState] = useState(2);

    let canvasDimX = 800;
    let canvasDimY = 800;

    const [bcx1State, setBcx1State] = useState(canvasDimX/2);
    const [bcy1State, setBcy1State] = useState(canvasDimY/2);
    const [bcx2State, setBcx2State] = useState(canvasDimX/2);
    const [bcy2State, setBcy2State] = useState(canvasDimY/2);
    const [bcx3State, setBcx3State] = useState(canvasDimX/2);
    const [bcy3State, setBcy3State] = useState(canvasDimY/2);
    const [pointState, setPointState] = useState(1);
    const [isLineState, setIsLineState] = useState(true);

    const [loadingGetState,setLoadingGetState] = useState(2);
    const [loadingPostState,setLoadingPostState] = useState(0);



    function drawLine(context, level) {
        if(level > maxLevelState) return;
        //let color1 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        let lineColor = 'rgb(' + lineColorState.r + ',' + lineColorState.g + ',' + lineColorState.b + ',' + lineColorState.a + ')';
        //console.log(lineColor);
        context.strokeStyle = lineColor;
        context.lineWidth = lineWidthState;
        context.shadowBlur = shadowBlurState;
        context.shadowColor = 'rgb(' + shadowColorState.r + ',' + shadowColorState.g + ',' + shadowColorState.b + ',' + shadowColorState.a + ')';;
        const len = lengthState;
        const angle = Math.PI * 2 * spreadState;
        context.beginPath();
        context.moveTo(0,0);
        if(isLineState){
            context.lineTo(0,-len);
        } else {
            context.bezierCurveTo(bcx1State-canvasDimX/2,
                bcy1State-canvasDimY/2,
                bcx2State-canvasDimX/2,
                bcy2State-canvasDimY/2,
                bcx3State-canvasDimX/2,
                bcy3State-canvasDimY/2);
        }
        let branches = parseInt(nrBranchesState);
        //console.log(nrBranchesState)
        context.stroke();
        for (let i = 1; i <= branches; i++){
            context.save();
            context.translate(0,-len * i / (branches+1));
            context.scale(0.7,0.7);
            context.save();
            context.rotate(angle);
            drawLine(context, level + 1);
            context.restore();
            context.save();
            context.rotate(-angle);
            drawLine(context, level + 1);
            context.restore();
            context.restore();
        }
    }

    function drawSnowFlake () {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        //console.log(lineColor);
        canvas.width = canvasDimX;
        canvas.height = canvasDimY;
        context.clearRect(0, 0, canvas.width, canvas.height)
        //const maxLevel = 5;
        //console.log(nrBranchesState)
        const bigAngle = Math.PI * 2 / nrFiguresState;
        context.translate(canvas.width/2, canvas.height/2);
        for (let i = 1; i <= nrFiguresState; i++){
            drawLine(context, 0);
            context.rotate(bigAngle);
        }

        const canvas1 = canvasRef1.current;
        const context1 = canvas1.getContext('2d');
        canvas1.width = canvasDimX;
        canvas1.height = canvasDimY;
        var sourceImageData = canvas.toDataURL("image/png",0.5);

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

    }

    function drawBezierCurve() {
        const canvas2 = canvasRef2.current;
        const context2 = canvas2.getContext('2d');
        //console.log(lineColor);
        canvas2.width = canvasDimX;
        canvas2.height = canvasDimY;
        context2.save();
        context2.strokeStyle = "white"
        context2.fillStyle = "white";
        context2.moveTo(canvasDimX/2,canvasDimY/2);
        context2.fillRect(canvasDimX/2,canvasDimY/2,10,10);
        context2.fillRect(bcx1State,bcy1State,10,10);
        context2.fillRect(bcx2State,bcy2State,10,10);
        context2.fillRect(bcx3State,bcy3State,10,10);
        context2.bezierCurveTo(bcx1State,bcy1State,bcx2State,bcy2State,bcx3State,bcy3State);
        context2.stroke();
        context2.restore();

    }

    function handleClickCanvas(event) {
        const canvas2 = canvasRef2.current;
        var offset = canvas2.getBoundingClientRect();
        var offsetX = offset.left;
        var offsetY = offset.top;
        var width = offset.width;
        var height = offset.height;
        //console.log("##")
        console.log(offset);
        console.log(offsetX,offsetY)
        console.log(width,height)
        console.log(event.clientX,event.clientY)
        var posX = (event.clientX - offsetX) * canvasDimX / width;
        var posY = (event.clientY - offsetY) * canvasDimY / height;
        console.log(posX,posY);
        if (pointState == 1){
            setBcx1State(posX);
            setBcy1State(posY);
        } else if (pointState == 2){
            setBcx2State(posX);
            setBcy2State(posY);
        } else {
            setBcx3State(posX);
            setBcy3State(posY);
        }
    }

    useEffect(() => {
        drawSnowFlake();
    },[maxLevelState,nrFiguresState,lengthState,nrBranchesState,lineWidthState,spreadState,lineColorState,backgroungColorState,shadowColorState,shadowBlurState,isLineState,isPngState])

    useEffect(() => {
        drawBezierCurve();
        if(!isLineState) {
            drawSnowFlake();
        }
    }, [bcx1State,bcy1State,bcx2State,bcy2State,bcx3State,bcy3State,isLineState,isPngState,backgroungColorState])

    function saveSnowFlake () {
        setLoadingPostState(1);
        var options = {
            "spread":spreadState,
            "length":lengthState,
            "nrFigures":nrFiguresState,
            "maxLevel":maxLevelState,
            "shadowBlur":shadowBlurState,
            "lineColor":lineColorState,
            "shadowColor":shadowColorState,
            "lineWidth":lineWidthState,
            "nrBranches":nrBranchesState,
            "isLine":isLineState,
            "points":pointState,
            "bcx1":bcx1State,
            "bcx2":bcx2State,
            "bcx3":bcx3State,
            "bcy1":bcy1State,
            "bcy2":bcy2State,
            "bcy3":bcy3State,
            "background":backgroungColorState
        }
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
            //console.log(context1.fillStyle);
            context1.fillRect(0, 0, canvas1.width, canvas1.height);
            context1.drawImage(canvas,0,0,canvasDimX,canvasDimY);
            var sourceImageData = canvas1.toDataURL("image/jpeg", 0.5);
            //console.log(sourceImageData);
            context1.restore();
        }

        var fractal = {
            "id": 0,
            "type": "snowFlake",
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
        //console.log(fractal);

        var URL = "/fractal"
        httpService
            .post(URL, fractal)
            .then((response) => {
              console.log(response.data);
              setLoadingPostState(0);
            });
    }

    const loadSnowFlake = useCallback(() => {
        let myId = params.id;
        let URL = "/fractal/" + myId;
        if(loadingGetState == 0) {
            setLoadingGetState(1);
        }

        httpService
            .get(URL)
            .then((response) => {
                var data = response.data;
                console.log(data);
                if(data.type == "snowFlake"){
                    var options = JSON.parse(data.options);
                    setNameState(data.name);
                    setImageProfileId(data.profile.id);
                    setDescriptionState(data.description);
                    setIsPngState(data.status);
                    if(options.background != null){
                        setBackgroungColorState(options.background);
                    }
                    setSpreadState(options.spread);
                    setLengthState(options.length);
                    setNrFiguresState(options.nrFigures);
                    setMaxLevelState(options.maxLevel);
                    setShadowBlurState(options.shadowBlur);
                    setLineColorState(options.lineColor);
                    setShadowColorState(options.shadowColor);
                    setLineWidthState(options.lineWidth);
                    setNrBranchesState(options.nrBranches);
                    setBcx1State(options.bcx1);
                    setBcy1State(options.bcy1);
                    setBcx2State(options.bcx2);
                    setBcy2State(options.bcy2);
                    setBcx3State(options.bcx3);
                    setBcy3State(options.bcy3);
                    setPointState(options.points);
                    setIsLineState(options.isLine);
                }
                setLoadingGetState(0);
            })
            .catch((e) => {
                setLoadingGetState(0);
                console.log(e);
              });
    }, [loadingGetState])

    function downloadClick(){
        const link = downloadRef.current;
        link.click();
    }

    useEffect(() => {
        drawSnowFlake("old");
    }, [loadSnowFlake])

    useEffect(() => {
        console.log(params.action)
        if(params.action === "old"){
            loadSnowFlake();
        } else if(params.action === "new"){
            setLoadingGetState(0);
            drawSnowFlake();
        }
        drawBezierCurve();

    }, [])

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
            <div style={{display: loadingGetState != 2 ? "flex" : "none",
                justifyContent: "space-between",
                background:"rgba(255, 255, 255, 0.75)",
                padding: "1vh",
                border: "1.5px dotted gray",
                borderRadius: "15px",
                height: "92vh",
                width:"80vw",
                overflow: "hidden"
            }}>
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
                    <div style={{
                            display:"flex",
                            flexDirection:"column",
                            width:"24vw"
                        }}>
                        <div className="slidecontainer">
                            <label style={{fontSize:"1.2vw"}}>Rotation: {nrFiguresState}</label>
                            <input style={{width:"60%"}} onInput={(event) => setNrFiguresState(event.target.value)} value={nrFiguresState} defaultValue="1" type="range" step="1" min="1" max="10" className="slider" id="myRange4" />  
                        </div>
                        <div className="slidecontainer">
                            <label style={{fontSize:"1.2vw"}}>Angle: {spreadState}</label>
                            <input style={{width:"60%"}} onInput={(event) => setSpreadState(event.target.value)} value={spreadState} defaultValue="0.50" type="range" step="0.01" min="0.50" max="1" className="slider" id="myRange4" />  
                        </div>
                        <div className="slidecontainer">
                            <label style={{fontSize:"1.2vw"}}>Nr Brances: {nrBranchesState}</label>
                            <input style={{width:"60%"}} onInput={(event) => setNrBranchesState(event.target.value)} value={nrBranchesState} defaultValue="2" type="range" step="1" min="1" max="3" className="slider" id="myRange4" />  
                        </div>
                        <div className="slidecontainer">
                            <label style={{fontSize:"1.2vw"}}>Depth: {maxLevelState}</label>
                            <input style={{width:"60%"}} onInput={(event) => setMaxLevelState(event.target.value)} value={maxLevelState} defaultValue="1" type="range" step="1" min="2" max="4" className="slider" id="myRange4" />  
                        </div>
                        <div className="slidecontainer">
                            <label style={{fontSize:"1.2vw"}}>Length: {lengthState}</label>
                            <input style={{width:"60%"}} onInput={(event) => setLengthState(event.target.value)} value={lengthState} defaultValue="200" type="range" step="10" min="150" max="500" className="slider" id="myRange4" />  
                        </div>
                        <div className="slidecontainer">
                            <label style={{fontSize:"1.2vw"}}>Width: {lineWidthState}</label>
                            <input style={{width:"60%"}} onInput={(event) => setLineWidthState(event.target.value)} value={lineWidthState} defaultValue="10" type="range" step="1" min="5" max="20" className="slider" id="myRange4" />  
                        </div>
                        <div className="slidecontainer">
                            <label style={{fontSize:"1.2vw"}}>ShadowBlur: {shadowBlurState}</label>
                            <input style={{width:"60%"}} onInput={(event) => setShadowBlurState(event.target.value)} value={shadowBlurState} defaultValue="0" type="range" step="1" min="0" max="20" className="slider" id="myRange4" />  
                        </div>
                    </div>
                </div>
                <br></br>
                <div className="myColumnOptionsSnowFlake">
                    <h3 className="fw-light">SnowFlake</h3>
                    <div className="myRowSimple">
                        <div style={{
                            display:"flex",
                            flexDirection:"column",
                            alignItems:"center"
                        }}>
                            <label className="form-label" style={{fontSize:"1vw"}}>Main color</label>
                            <ChromePicker 
                                color={lineColorState}
                                onChange={(event) => setLineColorState(event.rgb)}
                                width="8vw"
                            />
                        </div>
                        <div style={{
                            display:"flex",
                            flexDirection:"column",
                            alignItems:"center"
                        }}>
                            <label className="form-label" style={{fontSize:"1vw"}}>Shadow color</label>
                            <ChromePicker 
                                color={shadowColorState}
                                onChange={(event) => setShadowColorState(event.rgb)}
                                width="8vw"
                                height="10vh"
                            />
                        </div>
                        <div style={{
                            display:"flex",
                            paddingTop:"4vh"
                        }}>
                            <div className="myColumnCurveCanvas">
                                <canvas
                                    ref={canvasRef2}
                                    onClick={handleClickCanvas}
                                />
                                
                            </div>
                            <div onChange={(event) => setPointState(event.target.value)} style={{display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                                <div className="myRowSimple">
                                    <input type="radio" value="1" checked={pointState == 1} name="ponits" /> 
                                    <label className="form-label" style={{fontSize:"1vw"}}>Control1</label>
                                </div>
                                <div className="myRowSimple">
                                    <input type="radio" value="2" checked={pointState == 2} name="ponits" /> 
                                    <label className="form-label" style={{fontSize:"1vw"}}>Control2</label>
                                </div>
                                <div className="myRowSimple">
                                    <input type="radio" value="3" checked={pointState == 3} name="ponits" /> 
                                    <label className="form-label" style={{fontSize:"1vw"}}>EndPoint</label>
                                </div>
                                <div className="myRowSimple">
                                    <input type="checkbox" id="checkbox1" checked={isLineState} onChange={() => setIsLineState(!isLineState)}></input>
                                    <label className="form-label" style={{fontSize:"1vw"}}>Line</label>
                                </div>
                                
                            </div>
                        </div>
                    </div>

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
                        type = "SnowFlake"
                        loadFunction={loadSnowFlake}
                        saveFunction={checkInput() ? saveSnowFlake : null}
                        loadingGetState={loadingGetState}
                        loadingPostState={loadingPostState}
                        imageProfileId={imageProfileId}
                        profileId={profileId}
                        downloadRef={downloadRef}
                        downloadClick={downloadClick}
                        canvasDataUrl={canvasDataUrl}
                        nameState={nameState}
                        isPngState={isPngState}
                    />
                </div>
                
            </div>
        </div>
    ) 
}