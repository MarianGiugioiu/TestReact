import React, { useRef, useEffect, useCallback, useState } from 'react'
import Slider from 'react';

export default function Canvas(props){
    const canvasRef1 = useRef(null);
    const canvasRef2 = useRef(null);
    const [spreadState, setSpreadState] = useState(1);
    const [nrState, setNrState] = useState(0.01);
    const [maxLevelState, setMaxLevelState] = useState(3);
    
    
    const drawTree = useCallback((context, startX, startY, len, angle, curve1, branchWidth, color1, color2)  => {
        context.beginPath();
        context.save();
        context.strokeStyle = color1;
        context.fillStyle = color2;
        context.shadowBlur = 20;
        context.shadowColor = "white"
        context.lineWidth = branchWidth;
        context.translate(startX,startY);
        context.rotate(angle * Math.PI / 180);
        context.moveTo(0,0);
        //context.lineTo(0, -len);
        console.log(curve1);
        if(angle > 0){
            context.bezierCurveTo(curve1, -len/2, curve1, -len/2, 0, -len)
        } else {
            context.bezierCurveTo(curve1, -len/2, -curve1, -len/2, 0, -len)
        }
        context.stroke();

        if(len < 10){
            context.beginPath();
            context.arc(0, -len, 30, 0, Math.PI/2);
            context.fill();
            context.restore();
            return;
        }
        let curve = Math.random() * 20 + 10;
        drawTree(context,0 , -len, len * 0.75, angle + curve, curve1,  branchWidth * 0.7);
        drawTree(context,0 , -len, len * 0.75, angle - curve, curve1, branchWidth * 0.7);

        context.restore();
        
    }, [])

    const randomTree = useCallback(()  => {
        const canvas = canvasRef1.current;
        const context = canvas.getContext('2d');
        var scale = 2;
        canvas.width = 1280 * scale;
        canvas.height = 739 * scale;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        let len = Math.floor(Math.random() * 100 + 200)
        let branchWidth = Math.floor(Math.random() * 20 + 20);
        let color1 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        let color2 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        let curve1 = Math.floor(Math.random() * 3 + 3);
        drawTree(context, canvas.width / 2, canvas.height -300 , len, 0, curve1, branchWidth, color1, color2);
        /*const canvas2 = canvasRef2.current;
        const context2 = canvas2.getContext('2d');
        canvas2.width = 1280 * scale;
        canvas2.height = 739 * scale;
        //var sourceImageData = canvas.toDataURL("image/png");
        //var destinationImage = new Image;
        //destinationImage.src = sourceImageData;
        //console.log(destinationImage)
        context2.drawImage(canvas,0,0);*/
        //drawTree(context2, canvas.width / 2, canvas.height -300 , len, 0, curve1, branchWidth, color1, color2);
    }, [])

    const drawLine = useCallback((context, maxLevel, branches, angle, level, lineWidth)  => {
        if(level > maxLevel) return;
        //let color1 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        let color1 = 'white';
        context.strokeStyle = color1;
        context.lineWidth = lineWidth;
        context.shadowBlur = 5;
        context.shadowColor = "blue";
        const len = 200;
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(0,-len);
        context.stroke();
        for (let i = 1; i <= branches; i++){
            context.save();
            context.translate(0,-len * i / (branches+1));
            context.scale(0.7,0.7);
            context.save();
            context.rotate(angle);
            drawLine(context, maxLevel, branches, angle, level + 1);
            context.restore();
            context.save();
            context.rotate(-angle);
            drawLine(context, maxLevel, branches, angle, level + 1);
            context.restore();
            context.restore();
        }
    }, [])

    const draw3 = useCallback((nr, spread, maxLevel)  => {
        const canvas = canvasRef1.current;
        const context = canvas.getContext('2d');
        var scale = 1;
        canvas.width = 800 * scale;
        canvas.height = 800 * scale;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        //const maxLevel = 5;
        const branches = 2;
        const lineWidth = 10;
        const angle = Math.PI * 2 * spread;
        
        const bigAngle = Math.PI * 2 / nr;
        context.translate(canvas.width/2, canvas.height/2);
        for (let i = 1; i <= nr; i++){
            drawLine(context,maxLevel,branches,angle,0,lineWidth);
            context.rotate(bigAngle);
        }

    }, [drawLine])

    const changeNr = useCallback((event) => {
        let val = event.target.value;
        setNrState(val)

        draw3(val,spreadState,maxLevelState);
    }, [draw3,nrState,spreadState,maxLevelState])

    const changeSpread = useCallback((event) => {
        let val = event.target.value;
        setSpreadState(val);

        draw3(nrState,val,maxLevelState);
    }, [draw3,nrState,spreadState,maxLevelState])

    const changeMaxLevel = useCallback((event) => {
        let val = event.target.value;
        setMaxLevelState(val)

        draw3(nrState,spreadState,val);
    }, [draw3,nrState,spreadState,maxLevelState])

    useEffect(() => {
        //setNrState(1);
        //setSpreadState(0.85);
        //console.log(nrState,spreadState);
        //draw3(nrState,spreadState);
        
        //drawTree(context, canvas.width / 2, canvas.height -30 , 30, 0, 8, 'brown', 'blue')
        //randomTree();

        //context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    }, [])
    
    return(
        <div>
            <div>
                <canvas ref={canvasRef1} {...props}/>
            </div>
            <div>
                {/*<canvas ref={canvasRef2} {...props}/>*/}
            </div>
            <div className="slidecontainer">
                    <input onInput={changeNr} defaultValue="1" type="range" step="1" min="1" max="20" className="slider" id="myRange4" />  
            </div>
            <div className="slidecontainer">
                    <input onInput={changeSpread} defaultValue="0.01" type="range" step="0.01" min="0.51" max="0.99" className="slider" id="myRange3" />  
            </div>
            <div className="slidecontainer">
                    <input onInput={changeMaxLevel} defaultValue="3" type="range" step="1" min="3" max="7" className="slider" id="myRange2" />  
            </div>
            
            {/*<button onClick={randomTree} className="generate-tree-button">Generate Random Tree</button>*/}
        </div>
    ) 
}