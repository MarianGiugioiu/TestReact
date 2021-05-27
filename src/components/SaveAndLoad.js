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
            <div className="myRowSimple">
                {<button style={{display:((props.action === "old") ? "flex" : "none")}} onClick={props.loadFunction}>Reload {props.type}</button>}
                <Loader
                    style={{display: props.loadingGetState != 0 ? "flex" : "none"}}
                    type="TailSpin"
                    color="#000000"
                    height={25}
                    width={25} 
                />
            </div>
            <div className="myRowSimple">
                {<button onClick={props.saveFunction} style={{display:(((props.imageProfileId == props.profileId || props.imageProfileId == -1 ) && props.loadingGetState == 0) ? "flex" : "none")}}>Save {props.type}</button>}
                <Loader
                    style={{display: props.loadingPostState != 0 ? "flex" : "none"}}
                    type="TailSpin"
                    color="#000000"
                    height={25}
                    width={25} 
                />
            </div>
            
            <a ref={props.downloadRef} id="download" download={props.nameState + '.' + (props.isPngState ? "png" : "jpeg")} href={props.canvasDataUrl} style={{display:"none"}}>img</a>
            <button style={{display:props.loadingGetState == 0 ? "flex" : "none"}} onClick={props.downloadClick}>Download</button>

            {<button onClick={props.generate} style={{display:(((props.imageProfileId == props.profileId || props.imageProfileId == -1) && props.loadingGetState == 0 ) ? "flex" : "none")}}>Generate Random {props.type}</button>}
        </div>
    )
}