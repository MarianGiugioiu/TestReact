import React from 'react'
import { Link } from "react-router-dom";
import httpService from '../services/httpService';
import '../App.css';

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
                        setData(list);
                    }
                })
        }
    }

    return (
        <div>
            {isProfile ? <button onClick={loadFunction} >{visibility === "none" ? "Show " + name: "Hide " + name}</button> : <></>}
            <div className={!isColumn ? "myRow2": "myColumnSimple"} style = {{display:visibility}}>
                {
                    data != null ?
                    (data.length > 0 ?
                        (data.map(function(object, i){
                            if(object!= null) {
                                return (   
                                    <div className="myColumnSimple" key={i}>
                                        <Link to={"/profile" + object.id}>
                                        </Link> 
                                        <img
                                            id={i}
                                            ref = {(ref) => refs[`img${i}`] = ref}
                                            src = {object.image}
                                            width = "100vw" height = "100vw"
                                            onClick={() => name == "Parts" ? chooseFunction(object,i) : chooseFunction(object)}
                                            >
                                        </img>
                                        <pre>{object.name}</pre>
                                        {
                                            isProfile ? 
                                            <button 
                                                style = {{display: ((visibility === "flex" && props.type === "mine" && (name === "Postings" || name === "Images")) ? "flex" : "none")}}
                                                onClick={() => deleteFromList(name,i)}
                                            >Delete</button> :
                                            <button style = {{display:((allVisibility==="flex" && visibility === "flex") ? "flex" : "none")}} onClick={() => deletePart(i)}>Delete</button>
                                        }

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