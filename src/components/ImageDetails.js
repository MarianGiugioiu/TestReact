import React from 'react';
import { ChromePicker } from 'react-color';
import '../App.css';

export default function ImageDetails (props) {
    //console.log(props.canvasRef1)
    return (
        <div className="myRowSimple">
            <div>
                <ChromePicker 
                    color={props.backgroungColorState}
                    onChange={(event) => props.setBackgroungColorState(event.rgb)}
                    width="10vw"
                />
            </div>
            <div className="myColumnSimple">
                <div className="myColumnSimple">
                    <pre>Name:</pre>
                    {
                        props.condition ? 
                        <pre>{props.nameState}</pre> : 
                        <input
                            type="text"
                            value={props.nameState}
                            onChange={(event) => {props.setNameState(event.target.value)}}
                        />
                    }
                </div>
                <div className="myColumnSimple">
                    <pre>Description: </pre>
                    {
                        props.condition ? 
                        <pre>{props.descriptionState}</pre> : 
                        <input
                            type="text"
                            value={props.descriptionState}
                            onChange={(event) => props.setDescriptionState(event.target.value)}
                        />
                    }
                </div>
                <div className="myRowSimple">
                    <pre>PNG </pre>
                    <input type="checkbox" id="checkbox1" checked={props.isPngState} onChange={() => props.setIsPngState(!props.isPngState)}></input>
                </div>
                <canvas 
                    ref={props.canvasRef1}
                    width="100"
                    height="100"
                    style={{display:"none"}}
                />
            </div>
        </div>
    )
}