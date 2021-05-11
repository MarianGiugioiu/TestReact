import React, { useRef, useEffect, useCallback, useState , useContext} from 'react'
import { ChromePicker } from 'react-color';
import { useParams } from 'react-router';
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";

export default function SnowFlake(props){
    const params = useParams();
    const authentication = useContext(AuthenticationContext);
    let profileId = authentication.getUser();

    const canvasRef = useRef(null);
    const canvasRef1 = useRef(null);
    const canvasRef2 = useRef(null);
    const downloadRef = useRef(null);

    const [spreadState, setSpreadState] = useState(0.5);
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



    function drawLine(context, level) {
        if(level > maxLevelState) return;
        //let color1 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        let lineColor = 'rgb(' + lineColorState.r + ',' + lineColorState.g + ',' + lineColorState.b + ',' + lineColorState.a + ')';
        //console.log(lineColor);
        context.strokeStyle = lineColor;
        context.lineWidth = lineWidthState;
        context.shadowBlur = shadowBlurState;
        context.shadowColor = 'rgb(' + shadowColorState.r + ',' + shadowColorState.g + ',' + shadowColorState.b + ',' + shadowColorState.a + ')';;
        const len = 200;
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
        console.log(nrBranchesState)
        const bigAngle = Math.PI * 2 / nrFiguresState;
        context.translate(canvas.width/2, canvas.height/2);
        for (let i = 1; i <= nrFiguresState; i++){
            drawLine(context, 0);
            context.rotate(bigAngle);
        }

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

    function handleChangeRadioButtons(event) {
        setPointState(event.target.value);
    }

    function handleClickCanvas(event) {
        const canvas2 = canvasRef2.current;
        var offset = canvas2.getBoundingClientRect();
        var offsetX = offset.left;
        var offsetY = offset.top;
        var width = offset.width;
        var height = offset.height;
        console.log("##")
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
    },[maxLevelState,nrFiguresState,nrBranchesState,lineWidthState,spreadState,lineColorState,shadowColorState,shadowBlurState,isLineState])

    useEffect(() => {
        drawBezierCurve();
        if(!isLineState) {
            drawSnowFlake();
        }
    }, [bcx1State,bcy1State,bcx2State,bcy2State,bcx3State,bcy3State,isLineState])

    useEffect(() => {
        console.log(params.action)
        if(params.action === "old"){
            drawSnowFlake();
        } else if(params.action === "new"){
            drawSnowFlake();
        }
        drawBezierCurve();

    }, [])
    
    return(
        <div className="myColumnSimple">
            <div className="myRowSimple">
                <div className="myColumn21">
                    <canvas ref={canvasRef}/>
                </div>
                <div className="myColumnOptionsTree">
                    <div className="slidecontainer">
                            <input onInput={(event) => setNrFiguresState(event.target.value)} defaultValue="1" type="range" step="1" min="1" max="10" className="slider" id="myRange4" />  
                    </div>
                    <div className="slidecontainer">
                            <input onInput={(event) => setNrBranchesState(event.target.value)} defaultValue="2" type="range" step="1" min="1" max="3" className="slider" id="myRange2" />  
                    </div>
                    <div className="slidecontainer">
                            <input onInput={(event) => setLineWidthState(event.target.value)} defaultValue="10" type="range" step="1" min="5" max="20" className="slider" id="myRange2" />  
                    </div>
                    <div className="slidecontainer">
                            <input onInput={(event) => setSpreadState(event.target.value)} defaultValue="0.50" type="range" step="0.01" min="0.50" max="1" className="slider" id="myRange3" />  
                    </div>
                    <div className="slidecontainer">
                            <input onInput={(event) => setMaxLevelState(event.target.value)} defaultValue="1" type="range" step="1" min="2" max="4" className="slider" id="myRange2" />  
                    </div>
                    <div className="slidecontainer">
                            <input onInput={(event) => setShadowBlurState(event.target.value)} defaultValue="0" type="range" step="1" min="0" max="20" className="slider" id="myRange2" />  
                    </div>
                    
                    <div className="myRowSimple">
                    <div>
                        <ChromePicker 
                            color={lineColorState}
                            onChange={(event) => setLineColorState(event.rgb)}
                            width="10vw"
                        />
                        <ChromePicker 
                            color={shadowColorState}
                            onChange={(event) => setShadowColorState(event.rgb)}
                            width="10vw"
                        />
                        </div>
                        <pre>Line </pre>
                        <input type="checkbox" id="checkbox1" checked={isLineState} onChange={() => setIsLineState(!isLineState)}></input>
                    </div>
                    
                </div>
            </div>
            <br></br>
            <div className="myRowSimple">
                <div className="myColumn21">
                    <canvas 
                        ref={canvasRef2}
                        onClick={handleClickCanvas}
                    />
                    
                </div>
                <div onChange={handleChangeRadioButtons}>
                    <input type="radio" value="1" checked={pointState == 1} name="ponits" /> Point 1
                    <input type="radio" value="2" checked={pointState == 2} name="points" /> Point 2
                    <input type="radio" value="3" checked={pointState == 3} name="points" /> Point 3
                </div>
            </div>
        </div>
    ) 
}