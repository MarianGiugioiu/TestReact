import React, { useRef, useEffect, useCallback, useState , useContext} from 'react'
import { ChromePicker } from 'react-color';
import { useParams } from 'react-router';
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";
import ImageDetails from "../components/ImageDetails";
import SaveAndLoad from "../components/SaveAndLoad";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function Mountain(props) {
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

    const [colorNrState, setColorNrState] = useState(0);
    const [pointsState, setPointsState] = useState(null);
    const [isHQState, setIsHQState] = useState(false);

    const [loadingGetState,setLoadingGetState] = useState(2);
    const [loadingPostState,setLoadingPostState] = useState(0);

    let canvasDimX = 800;
    let canvasDimY = 800;

    let colors = [["#506e55", "#314448", "#548bb0", "#afbcbb"],
        ["#2b2c18", "#314448", "#908102", "#e2ce8a"],
        ["#241f0f","#908102","#c7c2bb","#b8c0c8","#6e7478"]];


    function weightedRandom(prob) {
        let i, sum=0, r=Math.random();
        for (i in prob) {
          sum += prob[i];
          if (r <= sum) return i;
        }
      }

    function drawMargins(context,margins) {
        context.save();
        context.strokeStyle = "black";
        context.lineWidth = 3;
        let L = [[],[],[]];
        for (let z of Object.keys(margins)){
            //console.log(p);
            let p = JSON.parse(z);
            //context.fillRect(p[0],p[1],10,10);
            L[margins[z]].push(p);
        }
        L[0].sort(function(a,b) {
            return a[1] - b[1];
        })
        L[1].sort(function(a,b) {
            return a[0] - b[0];
        })
        L[2].sort(function(a,b) {
            return b[1] - a[1];
        })
        context.beginPath();
        context.moveTo(L[0][0][0], L[0][0][1]);
        for (let i = 1; i < L[0].length; i++) {
            context.lineTo(L[0][i][0], L[0][i][1]);
        }
        for (let i = 0; i < L[1].length; i++) {
            context.lineTo(L[1][i][0], L[1][i][1]);
        }
        for (let i = 0; i < L[2].length ; i++) {
            context.lineTo(L[2][i][0], L[2][i][1]);
        }
        context.lineTo(L[0][0][0], L[0][0][1])
        context.stroke();
        
       
        context.restore();
    }

    function fillTriangles(context,points,g,max) {
        for (let i = g; i < points.length; i++){
            context.save();
            context.strokeStyle = "black";
            context.lineWidth = 0.5;
            let pos = ([...points[i]].sort(function(a,b) {
                return a[1] - b[1];
            }))[0];
            let x = pos[0];
            let y = pos[1];
            context.fillStyle = getColor(x,y,max);
            context.beginPath();
            context.moveTo(points[i][0][0],points[i][0][1]);
            context.lineTo(points[i][1][0],points[i][1][1]);
            context.lineTo(points[i][2][0],points[i][2][1]);
            context.closePath();
            context.stroke();
            context.fill();
            context.restore();
        }
    }

    function calculateTriangles() {
        let P0 = [canvasDimX/2, 200]
        let P1 = [canvasDimX/2 - 300, 600]
        let P2 = [canvasDimX/2 + 300, 600]
        let points = []
        points.push([P0,P1,P2])
        let margins = {}
        let randoms = {}
        margins[JSON.stringify(P0)] = 0;
        margins[JSON.stringify(P1)] = 1;
        margins[JSON.stringify(P2)] = 2;
        let randomRatio = 20;
        let max = 0;
        let n = 7;
        if (isHQState) {
            n = 8;
        }
        let k = 1;
        let g = 0;
        while (k < n) {
            let h = g + 4 ** (k-1);
            for (let i = g; i < h; i++) {
                //console.log(i);
                //console.log(points[i])

                let p0 = points[i][0];
                let p1 = points[i][1];
                let p2 = points[i][2];
                let p = [p0,p1,p2];
                let m0 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
                let m1 = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
                let m2 = [(p2[0] + p0[0]) / 2, (p2[1] + p0[1]) / 2];
                let m = [m0,m1,m2]
                let o = [JSON.stringify(p[0]),JSON.stringify(p[1]),JSON.stringify(p[2])]
                let t = [JSON.stringify(m[0]),JSON.stringify(m[1]),JSON.stringify(m[2])]
                

                let rd1 = (Math.abs(p[0][0] - p[1][0]) + Math.abs(p[2][0] - p[1][0]) + Math.abs(p[0][0] - p[2][0])) / randomRatio;
                let rd2 = (Math.abs(p[0][1] - p[1][1]) + Math.abs(p[2][1] - p[1][1]) + Math.abs(p[0][1] - p[2][1])) / randomRatio;
                let n = []
                n.push([m[0][0] + Math.random() * 2 * rd1 - Math.random() * rd1,
                    m[0][1] + Math.random() * 2 * rd2 - Math.random() * rd2]);
                n.push([m[1][0] + Math.random() * 2 * rd1 - Math.random() * rd1,
                    m[1][1] + Math.random() * 2 * rd2 - Math.random() * rd2]);
                n.push([m[2][0] + Math.random() * 2 * rd1 - Math.random() * rd1,
                    m[2][1] + Math.random() * 2 * rd2 - Math.random() * rd2]);

                for (let j in t) {
                    if (randoms[t[j]] == null) {
                        randoms[t[j]] = n[j]
                    } else {
                        n[j] = randoms[t[j]];
                    }
                }

                if (n[0][1] > max) max = n[0][1];
                if (n[1][1] > max) max = n[1][1];
                if (n[2][1] > max) max = n[2][1];

                let u = [JSON.stringify(n[0]),JSON.stringify(n[1]),JSON.stringify(n[2])]
                //console.log(JSON.stringify([1,2]) === JSON.stringify([1,3]))

                for (let j = 0; j < 3; j++) {
                    for (let l = 0;l < 3; l++) {
                        if (margins[o[j]] == l){
                            if(margins[o[(j+1) % 3]] == l) {
                                margins[u[j]] = l;
                            } else if (margins[o[(j+1) % 3]] == ((l+1) % 3)) {
                                //margins[u[j]] = l;
                                if (JSON.stringify(p[j]) == JSON.stringify(points[0][l]) || JSON.stringify(p[(j+1) % 3]) == JSON.stringify(points[0][(l+1) % 3])){
                                    margins[u[j]] = l;
                                }
                            }
                        }
                    }
                }


                points.push([p[0],n[0],n[2]]);
                points.push([p[1],n[1],n[0]]);
                points.push([p[2],n[2],n[1]]);
                points.push([n[1],n[2],n[0]]);
            }
            g = h;
            k++;
        }
        return [points,g,max,margins]
    }

    function getColor(x, y, max) {
        let start = 200;
        let end = max;
        let height = end - start;
        if (colorNrState == 0){
            let fa1 = 1 / (end - 500);
            let fb1 = -500 * fa1; 
            let fa2 = 1 / (450 - 300);
            let fb2 = -300 * fa2; 
            let fa3 = 1 / (300 - 250);
            let fb3 = -250 * fa3; 
            if (y >= start + 2 * height / 3) {
                let c1 = fa1 * y + fb1;
                let c = weightedRandom({0:c1, 1:(1 - c1)})
                return colors[colorNrState][c];
            } else if (y <= start + 2 * height / 3 && y >= start + height / 3) {
                let c1 = fa2 * y + fb2;
                let c = weightedRandom({0:0.1, 1:c1, 2:(0.9 - c1)})
                return colors[colorNrState][c];
            } else {
                //let c1 = fa3 * y + fb3;
                let c = weightedRandom({2:0.15, 3:0.85})
                return colors[colorNrState][c];
            }
        } else if (colorNrState == 1) {
            let fa1 = 1 / (500 - 400);
            let fb1 = -400 * fa1; 
            let fa2 = 1 / (400 - 300);
            let fb2 = -300 * fa2; 
            if (y <= end && y >= start + 3 * height / 4){
                let c = weightedRandom({0:0.9, 1:0.1})
                return colors[colorNrState][c]
            }
            if (y >= start + height / 3) {
                let c1 = fa1 * y + fb1;
                let c = weightedRandom({0:c1,1:0.1, 2:(0.85-c1), 3:0.05})
                return colors[colorNrState][c];
            } else  {
                //let c1 = fa2 * y + fb2;
                let c = weightedRandom({0:0.1, 2:0.8, 3:0.1})
                return colors[colorNrState][c];
            }
        } else if (colorNrState == 2) {
            let fa1 = 1 / ((end + 500) - (400 + 450));
            //((1.1 ** ((x + y) / 1000)) - 1) * 8;
            let fb1 = -(400 + 450) * fa1;
            if (3*y + 1.5*x > Math.random() * 100 + 1900) {
                let c1 = fa1 * (x + y) + fb1
                let c = weightedRandom({0:c1, 4:(1-c1)});
                return colors[colorNrState][c];
            } else if(2.2*y + 1.8*x > Math.random() * 100 + 1450){
                let c = weightedRandom({2:0.5, 3:0.5});
                return colors[colorNrState][c]
            } else {
                if (y > Math.random() * 50 + 300){
                    return colors[colorNrState][1];
                } else {
                    let c = weightedRandom({2:0.5, 3:0.5});
                    return colors[colorNrState][c]
                }
            }
        }
        
    }

    function drawMountain(action) {
        let canvas = canvasRef.current;
        let context = canvas.getContext('2d');
        canvas.width = canvasDimX;
        canvas.height = canvasDimY;
        context.clearRect(0,0,canvas.width,canvas.height);
        let res;
        if (action === "new"){
            res = calculateTriangles();
            setPointsState(res);
        } else {
            res = pointsState;
        }
        if (res != null) {
            let points = res[0];
            let g = res[1];
            let max = res[2]
            let margins = res[3]

            fillTriangles(context,points,g,max)
            drawMargins(context,margins)
        }

        const canvas1 = canvasRef1.current;
        const context1 = canvas1.getContext('2d');
        canvas1.width = canvasDimX;
        canvas1.height = canvasDimY;
        var sourceImageData = canvas.toDataURL("image/png",0.5);

        if (!isPngState) {
            context1.save();
            context1.fillStyle = 'rgb(' + backgroungColorState.r + ',' + backgroungColorState.g + ',' + backgroungColorState.b + ',' + backgroungColorState.a + ')';
            context1.fillRect(0, 0, canvas1.width, canvas1.height);
            context1.drawImage(canvas,0,0,canvasDimX,canvasDimY);
            var sourceImageData = canvas1.toDataURL("image/jpeg", 0.5);
            //console.log(sourceImageData);
            context1.restore();
        }
        setCanvasDataUrl(sourceImageData);
        
    }

    function saveMountain () {
        setLoadingPostState(1);
        var options = {
            "points": pointsState,
            "color": colorNrState,
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
            "type": "mountain",
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

    const loadMountain = useCallback(() => {
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
                if(data.type == "mountain"){
                    var options = JSON.parse(data.options);
                    setNameState(data.name);
                    setImageProfileId(data.profile.id);
                    setDescriptionState(data.description);
                    setIsPngState(data.status);
                    if(options.background != null){
                        setBackgroungColorState(options.background);
                    }
                    setColorNrState(options.color);
                    setPointsState(options.points);
                }
                setLoadingGetState(0);
            })
            .catch((e) => {
                setLoadingGetState(0);
                console.log(e);
              });
        

    }, [loadingGetState])

    useEffect(() => {
        //console.log(pointsState)
        drawMountain("old");
    }, [loadMountain])

    useEffect(() => {
        if(params.action === "old"){
            loadMountain();
        } else if(params.action === "new"){
            setLoadingGetState(0);
            drawMountain("new");
        }

    }, [])

    useEffect(() => {
        if(pointsState != null) {
            drawMountain("old");
        }
    },[colorNrState,isPngState])

    useEffect(() => {
        if(pointsState != null) {
            drawMountain("new");
        }
    },[isHQState])

    function downloadClick(){
        const link = downloadRef.current;
        link.click();
    }

    function checkInput() {
        if (nameState.length < 6 || nameState.length > 20 || descriptionState.length < 6 || descriptionState.length > 100) {
            return false;
        }
        return true;
    }

    return (
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
                    <br></br>
                    <div onChange={(event) => setColorNrState(event.target.value)}>
                        <div style={{
                            display:"flex",
                            width: "24vw",
                            justifyContent:"space-between"
                        }}>
                            {
                                colors.map((obj, index) => 
                                <div style={{
                                    display:"flex",
                                    flexDirection:"column",
                                    width:"8vw",
                                    overflow:"hidden"
                                }}>
                                    <div className="myRowSimple">
                                        {
                                            colors[index].map(elem => <div style={{background:elem,width:"2vw",height:"4vh", overflow:"hidden"}}></div>)
                                        }
                                    </div>
                                    <div className="myRowSimple">
                                        <input type="radio" value={index} checked={colorNrState == index} name="ponits" />
                                        <pre style={{fontSize:"1.2vw"}}>Palette {index}</pre>
                                    </div>
        
                                </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="myRowSimple">
                        <pre style={{fontSize:"1.2vw"}}>High Quality </pre>
                        <input type="checkbox" id="checkbox2" checked={isHQState} onChange={() => setIsHQState(!isHQState)}></input>
                    </div>
                </div>
                
                <div className="myColumnOptions">
                    <h3 className="fw-light">Mountain</h3>
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
                        type = "Mountain"
                        loadFunction={loadMountain}
                        saveFunction={checkInput() ? saveMountain : null}
                        loadingGetState={loadingGetState}
                        loadingPostState={loadingPostState}
                        imageProfileId={imageProfileId}
                        profileId={profileId}
                        downloadRef={downloadRef}
                        downloadClick={downloadClick}
                        canvasDataUrl={canvasDataUrl}
                        nameState={nameState}
                        isPngState={isPngState}
                        generate={() => drawMountain("new")}
                    />
                </div>
                
            </div>
        </div>
    )
}