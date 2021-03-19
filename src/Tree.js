import React, { useRef, useEffect, useCallback, useState } from 'react'
import Slider from 'react';
import { ChromePicker } from 'react-color'
import img from './myImage.png';

export default function Canvas(props){
    const canvasRef1 = useRef(null);
    const canvasRef2 = useRef(null);
    const [imgUrl, setImgUrl] = useState(null);
    const [bodyColorState, setbodyColorState] = useState('');
    const [leafColorState, setleafColorState] = useState('');
    const [startXState, setStartXState] = useState(0);
    const [startYState, setStartYState] = useState(0);
    const [lengthListState, setLengthListState] = useState([]);
    const [nrBranchesListState, setNrBranchesListState] = useState([]);
    
    
    
    const drawTree = useCallback((context, startX, startY, length, angle, curve1, branchWidth, bodyColor, leafColor)  => {
        context.beginPath();
        context.save();
        context.strokeStyle = 'rgb(' + bodyColorState.r + ',' + bodyColorState.g + ',' + bodyColorState.b + ',' + bodyColorState.a + ')';
        context.fillStyle = 'rgb(' + leafColorState.r + ',' + leafColorState.g + ',' + leafColorState.b + ',' + leafColorState.a + ')';
        //console.log(bodyColorState);
        context.shadowBlur = 3;
        context.shadowColor = "white"
        context.lineWidth = branchWidth;
        context.translate(startX,startY);
        context.rotate(angle * Math.PI / 180);
        context.moveTo(0,0);
        //context.lineTo(0, -length);
        //console.log(curve1);
        if(angle > 0){
            context.bezierCurveTo(curve1, -length/2, curve1, -length/2, 0, -length)
        } else {
            if (angle == 0) {
                context.lineWidth *= 1;
            }
            context.bezierCurveTo(curve1, -length/2, -curve1, -length/2, 0, -length)
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
        for(let i =  1; i <= nrBranches - nrBranches % 2 ; i++){
            var angleDiff = Math.random() * 30 + 10;
            if(i % 2 == 0) {
                angleDiff = -angleDiff;
            }
            var newAngle = angle + angleDiff;
            //console.log(newAngle)
            drawTree(context,0 , -length, length * 0.75, newAngle, curve1,  branchWidth * 0.7);
        }
        if (nrBranches % 2) {
            var sign = Math.floor(Math.random() * 2)

            var angleDiff = Math.random() * 30 + 10;
            if(sign == 0) {
                angleDiff = -angleDiff;
            }
            var newAngle = angle + angleDiff;
            console.log(sign)
            //console.log(newAngle)
            drawTree(context,0 , -length, length * 0.75, newAngle, curve1,  branchWidth * 0.7);
        }

        context.restore();
        
    }, [bodyColorState,leafColorState])

    const randomTree = useCallback(()  => {
        const canvas = canvasRef1.current;
        const context = canvas.getContext('2d');
        var scale = 2;
        canvas.width = 800 * scale;
        canvas.height = 600 * scale;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        let length = Math.floor(Math.random() * 100 + 200)
        let branchWidth = Math.floor(Math.random() * 20 + 20);
        let color1 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        let color2 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        let curve1 = Math.floor(Math.random() * 3 + 3);
        //context.scale(0.5,0.5)
        drawTree(context, canvas.width / 2, canvas.height -100 , length, 0, curve1, branchWidth, color1, color2);
        
        var sourceImageData = canvas.toDataURL("image/png");
        //console.log(sourceImageData);
        var destinationImage = new Image;
        destinationImage.id = "pic"
        destinationImage.src = sourceImageData;
        destinationImage.width = 100;
        destinationImage.height = 100;
        setImgUrl(sourceImageData);

        /*const canvas2 = canvasRef2.current;
        const context2 = canvas2.getContext('2d');
        canvas2.width = 1280 * scale;
        canvas2.height = 739 * scale;
        context2.clearRect(0, 0, context.canvas.width, context.canvas.height)
        //console.log(imgUrl);
        //console.log(destinationImage)
        var sourceImageData1 = canvas2.toDataURL("image/png");
        //console.log(sourceImageData1);
        //context2.drawImage(image,0,0);
        //drawTree(context2, canvas.width / 2, canvas.height -300 , length, 0, curve1, branchWidth, color1, color2)
        var sourceImageData2 = canvas2.toDataURL("image/png");
        //console.log(sourceImageData2);
        //console.log(destinationImage)
        context2.translate(canvas.width/2+1000,canvas.height/2 +200);
        context2.rotate(-45*Math.PI/180);*/
        //context2.drawImage(image,0,0,image.width*2,image.height*2,-image.width/2,-image.width/2,);
        //context2.drawImage(image,-image.width/2 ,-image.width/2,image.width/2,image.height/2);
        //context2.drawImage(canvas,0,0,canvas.width*2,canvas.height*2,0,0,canvas.width,canvas.height);
        //drawTree(context2, canvas.width / 2, canvas.height -300 , length, 0, curve1, branchWidth, color1, color2);
    }, [bodyColorState,leafColorState,imgUrl])

    const changebodyColorState = useCallback((event) => {
        let val = event.rgb;
        setbodyColorState(val);
        //console.log(bodyColorState);
        
        
    }, [bodyColorState,leafColorState])

    const changeleafColorState = useCallback((event) => {
        let val = event.rgb;
        setleafColorState(val);
        //console.log(val);
        
        
    }, [leafColorState,leafColorState])

    useEffect(() => {
        //drawTree(context, canvas.width / 2, canvas.height -30 , 30, 0, 8, 'brown', 'blue')
        //randomTree();

        //context.fillRect(0, 0, context.canvas.width, context.canvas.height)
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
                        onChange={changebodyColorState}
                    />
                </div>
                <div>
                    <ChromePicker 
                        color={leafColorState}
                        onChange={changeleafColorState}
                    />
                </div>
            </div>
            
            {<button onClick={randomTree} className="generate-tree-button">Generate Random Tree</button>}
        </>
    ) 
}