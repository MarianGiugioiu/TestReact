import React from 'react'
import { Link } from "react-router-dom";
import httpService from '../services/httpService';
import '../App.css';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import defaultImg from "../images/default.png";

export default function MyList(props){
    let isProfile = props.isProfile;
    let name = props.name;
    let data = props.data;
    let refs = props.refs;
    let visibility = props.visibility;
    let loadFunction = props.loadFunction;
    let chooseFunction = props.chooseFunction;
    let setData = props.setData;
    let deletePart = props.deletePart;
    let allVisibility = props.allVisibility;
    let isColumn = props.isColumn;
    if (isColumn == null) {
        isColumn = false;
    }

    let isLoading = props.isLoading;
    if (isLoading == null) {
        isLoading = 0;
    }

    let otherData = props.otherData;
    let setOtherData = props.setOtherData;

    function deleteFromOther (i) {
        let idImage = data[i].id;
        let otherCopy = JSON.parse(JSON.stringify(otherData));
        let newCopy = otherCopy.filter((elem) => elem.idFractal != idImage);
        setOtherData(newCopy);
    }

    function deleteFromList(name, i){
        if (name == "Postings" || name == "Images"){
            let URL = /posting/ + data[i].id;
            if (name == "Images") {
                URL = /fractal/ + data[i].id;
            }
            httpService
                .delete(URL)
                .then((response) => {
                    console.log(response);
                    if (response.status == 202) {
                        let list = [...data];
                        list.splice(i,1);
                        if (name == "Images" && otherData != null) {
                            deleteFromOther(i);
                        }
                        setData(list);
                    }
                })
        }
    }

    return (
        <div style={{
        }}>
            {
                isProfile ? 
                    <div style={{
                        display:"flex",
                        justifyContent:"center",
                        alignItems:"center"
                    }}>
                        <Loader
                            style={{display: isLoading == 1 ? "flex" : "none"}}
                            type="TailSpin"
                            color="#000000"
                            height={100}
                            width={100} 
                        />
                    </div>
                : 
                <></>
            }
            <div className={!isColumn ? "myRow2": "myColumn2"} style = {{display:visibility}}>
                {
                    data != null ?
                    (data.length > 0 ?
                        (data.map(function(object, i){
                            if(object!= null) {
                                return (   
                                    <div 
                                        style={{
                                            display:"flex",
                                            marginLeft:"0.5vw",
                                            marginRight:"0.5vw",
                                            marginTop : "0.5vh",
                                            border: "1px groove gray",
                                            alignItems:"center",
                                            height:"11vh",
                                            width:"12vw"
                                        }}
                                        key={i}
                                    >
                                        <img
                                            className="rounded img-thumbnail mx-auto d-block"
                                            style={{width:"4.8vw"}}
                                            id={i}
                                            ref = {(ref) => refs[`img${i}`] = ref}
                                            src = {object.image != "" ? object.image : defaultImg}
                                            onClick={() => name == "Parts" ? chooseFunction(object,i) : chooseFunction(object)}
                                            >
                                        </img>
                                        <div style={{display:"flex",flexDirection:"column"}}>
                                            <pre style={{fontSize:"1.1vw"}}>{object.name}</pre>
                                            {
                                                isProfile ? 
                                                <button 
                                                    className="btn btn-outline-danger"
                                                    style = {{display: ((visibility === "flex" && props.type === "mine" && (name === "Postings" || name === "Images")) ? "flex" : "none"),width:"5vw"}}
                                                    onClick={() => deleteFromList(name,i)}
                                
                                                ><span style={{fontSize:"0.9vw"}}>Delete</span></button> :
                                                <button className="btn btn-outline-danger" style = {{display:((allVisibility==="flex" && visibility === "flex") ? "flex" : "none"),width:"5vw"}} onClick={() => deletePart(i)}><span style={{fontSize:"0.9vw"}}>Delete</span></button>
                                            }
                                        </div>
                                    </div>
                                );
                            }
                        })) : 
                        <pre>The are no {name}</pre>
                    ) : <div></div>
                }
            </div>
        </div>
    )
}