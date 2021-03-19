import React, { useRef, useEffect, useCallback, useState } from 'react'
import Slider from 'react';
import { ChromePicker } from 'react-color'

export default function Canvas(props){
    const canvasRef1 = useRef(null);
    const canvasRef2 = useRef(null);
    const [spreadState, setSpreadState] = useState(1);
    const [nrState, setNrState] = useState(0.01);
    const [maxLevelState, setMaxLevelState] = useState(3);
    const [shadowBlurState, setShadowBlurState] = useState(0);
    const [color1State, setColor1State] = useState('');

    const drawLine = useCallback((context, maxLevel, branches, angle, level, lineWidth, shadowBlur,lineColor)  => {
        if(level > maxLevel) return;
        //let color1 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        let color1 = 'rgb(' + lineColor.r + ',' + lineColor.g + ',' + lineColor.b + ',' + lineColor.a + ')';
        console.log(color1);
        context.strokeStyle = color1;
        context.lineWidth = lineWidth;
        context.shadowBlur = shadowBlur;
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
            drawLine(context, maxLevel, branches, angle, level + 1, lineWidth, shadowBlur,lineColor);
            context.restore();
            context.save();
            context.rotate(-angle);
            drawLine(context, maxLevel, branches, angle, level + 1, lineWidth, shadowBlur,lineColor);
            context.restore();
            context.restore();
        }
    }, [])

    const draw3 = useCallback((nr, spread, maxLevel, shadowBlur, lineColor)  => {
        const canvas = canvasRef1.current;
        const context = canvas.getContext('2d');
        //console.log(lineColor);
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
            drawLine(context,maxLevel,branches,angle,0,lineWidth,shadowBlur,lineColor);
            context.rotate(bigAngle);
        }

    }, [drawLine])

    const changeNr = useCallback((event) => {
        let val = event.target.value;
        setNrState(val);

        draw3(val,spreadState,maxLevelState,shadowBlurState,color1State);
    }, [draw3,nrState,spreadState,maxLevelState,shadowBlurState,color1State])

    const changeSpread = useCallback((event) => {
        let val = event.target.value;
        setSpreadState(val);

        draw3(nrState,val,maxLevelState,shadowBlurState,color1State);
    }, [draw3,nrState,spreadState,maxLevelState,shadowBlurState,color1State])

    const changeMaxLevel = useCallback((event) => {
        let val = event.target.value;
        setMaxLevelState(val);

        draw3(nrState,spreadState,val,shadowBlurState,color1State);
    }, [draw3,nrState,spreadState,maxLevelState,shadowBlurState,color1State])

    const changeShadowBlur = useCallback((event) => {
        let val = event.target.value;
        setShadowBlurState(val);
        console.log(shadowBlurState);

        draw3(nrState,spreadState,maxLevelState,val,color1State);
    }, [draw3,nrState,spreadState,maxLevelState,shadowBlurState,color1State])

    const changeColorPicker = useCallback((event) => {
        let val = event.rgb;
        setColor1State(val);
        //console.log(val);

        draw3(nrState,spreadState,maxLevelState,shadowBlurState,val);
    }, [draw3,nrState,spreadState,maxLevelState,shadowBlurState,color1State])

    useEffect(() => {
        //console.log(color1State);
    }, [])
    
    return(
        <>
            <div>
                <canvas ref={canvasRef1} {...props}/>
            </div>
            <>
                <div className="slidecontainer">
                        <input onInput={changeNr} defaultValue="1" type="range" step="1" min="1" max="20" className="slider" id="myRange4" />  
                </div>
                <div className="slidecontainer">
                        <input onInput={changeSpread} defaultValue="0.01" type="range" step="0.01" min="0.51" max="0.99" className="slider" id="myRange3" />  
                </div>
                <div className="slidecontainer">
                        <input onInput={changeMaxLevel} defaultValue="1" type="range" step="1" min="3" max="7" className="slider" id="myRange2" />  
                </div>
                <div className="slidecontainer">
                        <input onInput={changeShadowBlur} defaultValue="0" type="range" step="1" min="0" max="10" className="slider" id="myRange2" />  
                </div>
                <div>
                    <ChromePicker 
                        color={color1State}
                        onChange={changeColorPicker}
                    />
                </div>
            </>
        </>
    ) 
}