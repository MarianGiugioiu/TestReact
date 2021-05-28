import React, { useRef, useEffect, useCallback, useState, useContext } from 'react';
import '../App.css';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function SaveAndLoad(props) {
    return (
        <div style={{
            display:"flex",
            flexDirection:"column",
            alignItems: "center"
        }}>
            <div style={{display:"flex"}}>
                <div className="myRowSimple">
                    {<button className="btn btn-outline-success" style={{display:((props.action === "old") ? "flex" : "none"),marginTop:"1vh"}} onClick={props.loadFunction}><span style={{fontSize:"1.5vw"}}>Reload {props.type}</span></button>}
                    <Loader
                        style={{display: props.loadingGetState != 0 ? "flex" : "none"}}
                        type="TailSpin"
                        color="#000000"
                        height={25}
                        width={25} 
                    />
                </div>
                <div className="myRowSimple">
                    {<button className="btn btn-outline-success" onClick={props.saveFunction} style={{display:(((props.imageProfileId == props.profileId || props.imageProfileId == -1 ) && props.loadingGetState == 0) ? "flex" : "none"),marginTop:"1vh"}}><span style={{fontSize:"1.5vw"}}>Save {props.type}</span></button>}
                    <Loader
                        style={{display: props.loadingPostState != 0 ? "flex" : "none"}}
                        type="TailSpin"
                        color="#000000"
                        height={25}
                        width={25} 
                    />
                </div>
            </div>
            <a ref={props.downloadRef} id="download" download={props.nameState + '.' + (props.isPngState ? "png" : "jpeg")} href={props.canvasDataUrl} style={{display:"none"}}>img</a>
            <button className="btn btn-outline-primary" style={{display:props.loadingGetState == 0 ? "flex" : "none",marginTop:"1vh"}} onClick={props.downloadClick}><span style={{fontSize:"1.5vw"}}>Download</span></button>

            {<button className="btn btn-outline-danger" onClick={props.generate} style={{display:(((props.imageProfileId == props.profileId || props.imageProfileId == -1) && props.loadingGetState == 0 && props.generate != null) ? "flex" : "none"),marginTop:"1vh"}}><span style={{fontSize:"1.5vw"}}>Generate Random {props.type}</span></button>}
        </div>
    )
}