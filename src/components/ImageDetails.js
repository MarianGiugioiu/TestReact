import React from 'react';
import { ChromePicker } from 'react-color';
import '../App.css';

export default function ImageDetails (props) {
    //console.log(props.canvasRef1)
    return (
        <div className="myRowSimple">
            <div style={{
                display:"flex",
                flexDirection:"column",
                alignItems:"center"
            }}>
                <label className="form-label" style={{fontSize:"1vw"}}>Background color</label>
                <ChromePicker 
                    color={props.backgroungColorState}
                    onChange={(event) => props.setBackgroungColorState(event.rgb)}
                    width="8vw"
                />
            </div>
            <div className="myColumnSimple" style={{justifyContent:"space-between"}}>
                <div style={{
                    display:"flex",
                    flexDirection:"column",
                    alignItems:"center"
                }}>
                    <label className="form-label" style={{fontSize:"1vw"}}>Name</label>
                    {
                        props.condition ? 
                        <pre style={{fontSize:"1vw"}}>{props.nameState}</pre> : 
                        <input
                            className="form-control"
                            style={{width:"15vw",height:"4vh",marginLeft:"1vw"}}
                            placeholder="Enter Name"
                            type="text"
                            value={props.nameState}
                            onChange={(event) => {props.setNameState(event.target.value)}}
                        />
                    }
                        {(props.nameState.length < 6 || props.nameState.length > 20) ? <pre className="text-danger" style={{fontSize:"0.8vw"}}>Name must be between 6 and 20!</pre> : <></>}
                    
                </div>
                <div style={{
                    display:"flex",
                    flexDirection:"column",
                    alignItems:"center"
                }}>
                    <label className="form-label" style={{fontSize:"1vw"}}>Description</label>
                    {
                        props.condition ? 
                        <pre style={{fontSize:"1vw"}}>{props.descriptionState}</pre> : 
                        <input
                            className="form-control"
                            style={{width:"15vw",height:"4vh",marginLeft:"1vw"}}
                            placeholder="Enter Description"
                            type="text"
                            value={props.descriptionState}
                            onChange={(event) => props.setDescriptionState(event.target.value)}
                        />
                    }
                    {(props.descriptionState.length < 6 || props.descriptionState.length > 100) ? <pre className="text-danger" style={{fontSize:"0.75vw"}}>Description must be between 6 and 100!</pre> : <></>}
                </div>
                <div style={{
                    display:"flex",
                    justifyContent:"center"
                }}>
                    <pre style={{fontSize:"1vw"}}>PNG </pre>
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